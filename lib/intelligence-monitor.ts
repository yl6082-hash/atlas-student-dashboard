import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { intelligenceItems, schoolSources } from "@/db/schema";
import { officialSources, type OfficialSourceConfig } from "@/data/official-sources";

type AiBinding = {
  run(model: string, input: { prompt: string; max_tokens?: number }): Promise<unknown>;
};

export type IntelligenceMonitorEnv = {
  DB: D1Database;
  AI?: AiBinding;
};

type ChangeSummary = {
  title: string;
  fact: string;
  impact: string;
  action: string;
  level: "high" | "medium" | "low";
};

type SourceSnapshot = {
  fingerprint: string;
  content: string;
};

function serializeSnapshot(snapshot: SourceSnapshot) {
  return JSON.stringify({
    hash: snapshot.fingerprint,
    content: snapshot.content,
  });
}

function deserializeSnapshot(value: string | null): SourceSnapshot {
  if (!value) return { fingerprint: "", content: "" };
  if (!value.startsWith("{")) return { fingerprint: value, content: "" };

  try {
    const parsed = JSON.parse(value) as { hash?: unknown; content?: unknown };
    return {
      fingerprint: typeof parsed.hash === "string" ? parsed.hash : "",
      content: typeof parsed.content === "string" ? parsed.content : "",
    };
  } catch {
    return { fingerprint: value, content: "" };
  }
}

export type MonitorResult = {
  initialized: number;
  unchanged: number;
  changed: number;
  summarized: number;
  failed: string[];
  checkedAt: string;
};

const USER_AGENT = "AtlasSchoolMonitor/1.1 (+official-source-monitor)";
const MAX_SNAPSHOT_LENGTH = 60_000;
const MAX_DIFF_LENGTH = 12_000;

const htmlEntities: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
};

function normalizeOfficialPage(html: string) {
  const withoutNoise = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|template|svg)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(br|\/p|\/li|\/h[1-6]|\/section|\/article|\/tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  const decoded = withoutNoise.replace(
    /&(amp|quot|apos|lt|gt|nbsp);|&#39;/g,
    (entity) => htmlEntities[entity] ?? " ",
  );

  return decoded
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 28)
    .filter((line) => !/cookie|privacy settings|enable javascript/i.test(line))
    .slice(0, 1_000)
    .join("\n")
    .slice(0, MAX_SNAPSHOT_LENGTH);
}

async function hashContent(content: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content),
  );
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchSnapshot(url: string): Promise<SourceSnapshot> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) throw new Error(`官方页面返回 ${response.status}`);

  const content = normalizeOfficialPage(await response.text());
  if (content.length < 120) throw new Error("未能提取有效正文");

  return {
    content,
    fingerprint: await hashContent(content),
  };
}

function buildDiff(previous: string, current: string) {
  const previousLines = new Set(previous.split("\n"));
  const currentLines = new Set(current.split("\n"));
  const added = [...currentLines].filter((line) => !previousLines.has(line));
  const removed = [...previousLines].filter((line) => !currentLines.has(line));

  return [
    "【新增或改写】",
    ...(added.length ? added.slice(0, 24) : ["未识别到稳定的新增段落"]),
    "",
    "【删除或被替换】",
    ...(removed.length ? removed.slice(0, 24) : ["未识别到稳定的删除段落"]),
  ].join("\n").slice(0, MAX_DIFF_LENGTH);
}

function fallbackSummary(source: OfficialSourceConfig, diff: string): ChangeSummary {
  const firstAdded = diff
    .split("\n")
    .find((line) => line && !line.startsWith("【") && !line.startsWith("未识别"));

  return {
    title: `${source.label}检测到官网变化`,
    fact: firstAdded
      ? `官网新增或改写内容：“${firstAdded.slice(0, 220)}”`
      : `Atlas 发现 ${source.label} 的正文与上次监测结果不同。`,
    impact: "该变化可能影响申请要求或准备节奏，当前内容尚未经过顾问核验。",
    action: "请顾问打开官方来源，核对适用入学年份、申请人群和生效日期后再发布。",
    level: "medium",
  };
}

function parseAiResponse(result: unknown): ChangeSummary | null {
  const responseText =
    typeof result === "object" && result !== null && "response" in result
      ? String((result as { response: unknown }).response)
      : typeof result === "string"
        ? result
        : "";
  const match = responseText.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]) as Partial<ChangeSummary>;
    if (
      !parsed.title ||
      !parsed.fact ||
      !parsed.impact ||
      !parsed.action ||
      !["high", "medium", "low"].includes(parsed.level ?? "")
    ) return null;
    return {
      title: parsed.title.slice(0, 120),
      fact: parsed.fact.slice(0, 800),
      impact: parsed.impact.slice(0, 800),
      action: parsed.action.slice(0, 800),
      level: parsed.level as ChangeSummary["level"],
    };
  } catch {
    return null;
  }
}

async function summarizeWithAi(
  ai: AiBinding | undefined,
  source: OfficialSourceConfig,
  diff: string,
) {
  if (!ai) return null;

  const prompt = `你是 Atlas 大学申请情报编辑。请只根据下面提供的学校官网正文差异，生成一条中文“待顾问核验”草稿。

学校：${source.schoolName}
页面：${source.label}
信息类别：${source.kind}

规则：
1. 不得补充差异中没有出现的日期、数字、政策或推断。
2. fact 只写官网发生了什么；impact 说明对申请者可能意味着什么，并明确不确定性；action 给顾问核验步骤。
3. 招生政策、截止日期、标化要求等直接影响申请的变化为 high；一般要求为 medium；纯页面措辞为 low。
4. 只输出 JSON，不要 Markdown：
{"title":"...","fact":"...","impact":"...","action":"...","level":"high|medium|low"}

官网差异：
${diff}`;

  try {
    const result = await ai.run("@cf/meta/llama-3.1-8b-instruct", {
      prompt,
      max_tokens: 700,
    });
    return parseAiResponse(result);
  } catch {
    return null;
  }
}

export async function runOfficialSourceMonitor(
  env: IntelligenceMonitorEnv,
): Promise<MonitorResult> {
  const db = drizzle(env.DB);
  const result: MonitorResult = {
    initialized: 0,
    unchanged: 0,
    changed: 0,
    summarized: 0,
    failed: [],
    checkedAt: new Date().toISOString(),
  };

  for (const source of officialSources) {
    try {
      const [existing] = await db
        .select()
        .from(schoolSources)
        .where(eq(schoolSources.url, source.url))
        .limit(1);
      const snapshot = await fetchSnapshot(source.url);
      const now = new Date().toISOString();

      if (!existing) {
        await db.insert(schoolSources).values({
          schoolSlug: source.schoolSlug,
          schoolName: source.schoolName,
          label: source.label,
          url: source.url,
          kind: source.kind,
          lastFingerprint: serializeSnapshot(snapshot),
          lastCheckedAt: now,
        });
        result.initialized += 1;
        continue;
      }

      const previousSnapshot = deserializeSnapshot(existing.lastFingerprint);

      if (
        !previousSnapshot.fingerprint ||
        previousSnapshot.fingerprint === snapshot.fingerprint
      ) {
        await db
          .update(schoolSources)
          .set({
            lastFingerprint: serializeSnapshot(snapshot),
            lastCheckedAt: now,
          })
          .where(eq(schoolSources.id, existing.id));
        result.unchanged += 1;
        continue;
      }

      const diff = buildDiff(previousSnapshot.content, snapshot.content);
      const aiSummary = await summarizeWithAi(env.AI, source, diff);
      const summary = aiSummary ?? fallbackSummary(source, diff);

      await db.insert(intelligenceItems).values({
        schoolSlug: source.schoolSlug,
        schoolName: source.schoolName,
        schoolCode: source.schoolCode,
        schoolAccent: source.schoolAccent,
        category: source.kind,
        title: summary.title,
        fact: summary.fact,
        impact: summary.impact,
        action: summary.action,
        level: summary.level,
        sourceUrl: source.url,
        sourceLabel: source.label,
        reviewStatus: "pending_review",
      });
      await db
        .update(schoolSources)
        .set({
          lastFingerprint: serializeSnapshot(snapshot),
          lastCheckedAt: now,
        })
        .where(eq(schoolSources.id, existing.id));

      result.changed += 1;
      if (aiSummary) result.summarized += 1;
    } catch (error) {
      result.failed.push(
        `${source.schoolName}：${error instanceof Error ? error.message : "无法读取官方页面"}`,
      );
    }
  }

  return result;
}
