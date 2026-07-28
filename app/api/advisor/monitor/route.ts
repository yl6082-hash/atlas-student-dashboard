import { eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { intelligenceItems, schoolSources } from "@/db/schema";
import { officialSources } from "@/data/official-sources";

async function fingerprint(url: string) {
  const response = await fetch(url, { headers: { "User-Agent": "AtlasSchoolMonitor/1.0 (+official-source-monitor)" } });
  if (!response.ok) throw new Error(`官方页面返回 ${response.status}`);
  const html = (await response.text()).replace(/\s+/g, " ").trim();
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(html));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Checks official source pages and creates a *pending* signal only when their
 * content changes. It never publishes or invents an interpretation.
 */
export async function POST() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "顾问登录后才能执行监测。" }, { status: 401 });

  const db = getDb();
  const result = { initialized: 0, changed: 0, failed: [] as string[] };

  for (const source of officialSources) {
    try {
      const [existing] = await db.select().from(schoolSources).where(eq(schoolSources.url, source.url)).limit(1);
      const nextFingerprint = await fingerprint(source.url);
      const now = new Date().toISOString();

      if (!existing) {
        await db.insert(schoolSources).values({
          schoolSlug: source.schoolSlug,
          schoolName: source.schoolName,
          label: source.label,
          url: source.url,
          kind: source.kind,
          lastFingerprint: nextFingerprint,
          lastCheckedAt: now,
        });
        result.initialized += 1;
        continue;
      }

      if (existing.lastFingerprint && existing.lastFingerprint !== nextFingerprint) {
        await db.insert(intelligenceItems).values({
          schoolSlug: source.schoolSlug,
          schoolName: source.schoolName,
          schoolCode: source.schoolCode,
          schoolAccent: source.schoolAccent,
          category: source.kind,
          title: "官方页面检测到内容变化，待顾问核验",
          fact: `Atlas 发现 ${source.label} 的页面内容与上次监测结果不同。请打开官方来源确认具体变化。`,
          impact: "在顾问核验前，不会向学生展示，也不会自动改变申请任务。",
          action: "核对官方页面的有效入学年份、适用申请人及截止日期；确认后再发布给相关学生。",
          level: "medium",
          sourceUrl: source.url,
          sourceLabel: source.label,
          reviewStatus: "pending_review",
        });
        result.changed += 1;
      }
      await db.update(schoolSources).set({ lastFingerprint: nextFingerprint, lastCheckedAt: now }).where(eq(schoolSources.id, existing.id));
    } catch (error) {
      result.failed.push(`${source.schoolName}：${error instanceof Error ? error.message : "无法读取官方页面"}`);
    }
  }

  return Response.json({ ...result, checkedAt: new Date().toISOString(), by: user.email });
}
