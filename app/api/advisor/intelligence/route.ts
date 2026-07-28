import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { intelligenceItems } from "@/db/schema";

const required = ["schoolSlug", "schoolName", "schoolCode", "schoolAccent", "category", "title", "fact", "impact", "action", "level", "sourceUrl", "sourceLabel"] as const;

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "顾问登录后才能查看审核队列。" }, { status: 401 });

  const items = await getDb().select().from(intelligenceItems)
    .orderBy(desc(intelligenceItems.observedAt), desc(intelligenceItems.id));
  return Response.json({ items });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "顾问登录后才能创建情报。" }, { status: 401 });

  const payload = (await request.json()) as Record<string, unknown>;
  for (const field of required) {
    if (typeof payload[field] !== "string" || !payload[field].trim()) {
      return Response.json({ error: `缺少字段：${field}` }, { status: 400 });
    }
  }

  const [item] = await getDb().insert(intelligenceItems).values({
    schoolSlug: payload.schoolSlug as string,
    schoolName: payload.schoolName as string,
    schoolCode: payload.schoolCode as string,
    schoolAccent: payload.schoolAccent as string,
    category: payload.category as string,
    title: payload.title as string,
    fact: payload.fact as string,
    impact: payload.impact as string,
    action: payload.action as string,
    level: payload.level as string,
    sourceUrl: payload.sourceUrl as string,
    sourceLabel: payload.sourceLabel as string,
    sourcePublishedAt: typeof payload.sourcePublishedAt === "string" ? payload.sourcePublishedAt : null,
    reviewStatus: "pending_review",
  }).returning();

  return Response.json({ item, createdBy: user.email }, { status: 201 });
}
