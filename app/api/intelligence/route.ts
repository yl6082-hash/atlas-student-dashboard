import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { intelligenceItems } from "@/db/schema";

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
    return Response.json({ items: rows });
  } catch (error) {
    return Response.json({ items: [], error: errorMessage(error) }, { status: 503 });
  }
}

export async function POST(request: Request) {
  // This endpoint is intentionally unavailable to the public student client.
  // New facts are created through the authenticated advisor route.
  return Response.json({ error: "Use the advisor intelligence workflow." }, { status: 405 });
}
