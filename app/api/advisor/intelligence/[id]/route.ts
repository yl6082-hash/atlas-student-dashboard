import { eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { intelligenceItems } from "@/db/schema";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "顾问登录后才能审核。" }, { status: 401 });

  const { id } = await context.params;
  const itemId = Number(id);
  const body = (await request.json()) as { decision?: "verified" | "returned" };
  if (!Number.isInteger(itemId) || !["verified", "returned"].includes(body.decision ?? "")) {
    return Response.json({ error: "无效的审核请求。" }, { status: 400 });
  }

  const [item] = await getDb().update(intelligenceItems).set({
    reviewStatus: body.decision,
    reviewedBy: user.email,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).where(eq(intelligenceItems.id, itemId)).returning();

  if (!item) return Response.json({ error: "未找到这条情报。" }, { status: 404 });
  return Response.json({ item });
}
