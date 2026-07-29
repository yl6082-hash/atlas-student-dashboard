import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { intelligenceItems } from "@/db/schema";
import { verifiedSchoolBriefs } from "@/data/verified-school-briefs";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}

/** Student-safe feed: no pending, draft, or AI-only claims ever leave this route. */
export async function GET() {
  try {
    const rows = await getDb()
      .select()
      .from(intelligenceItems)
      .where(eq(intelligenceItems.reviewStatus, "verified"))
      .orderBy(desc(intelligenceItems.observedAt), desc(intelligenceItems.id))
      .limit(12);
    const items = [...rows, ...verifiedSchoolBriefs]
      .sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt))
      .slice(0, 12);
    return Response.json({ items });
  } catch (error) {
    return Response.json({
      items: verifiedSchoolBriefs,
      degraded: true,
      error: errorMessage(error),
    });
  }
}

export async function POST(request: Request) {
  // This endpoint is intentionally unavailable to the public student client.
  // New facts are created through the authenticated advisor route.
  return Response.json({ error: "Use the advisor intelligence workflow." }, { status: 405 });
}
