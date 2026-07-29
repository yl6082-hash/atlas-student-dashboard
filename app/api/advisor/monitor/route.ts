import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { runOfficialSourceMonitor, type IntelligenceMonitorEnv } from "@/lib/intelligence-monitor";

/**
 * Checks official source pages and creates a *pending* signal only when their
 * content changes. It never publishes or invents an interpretation.
 */
export async function POST() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "顾问登录后才能执行监测。" }, { status: 401 });

  const result = await runOfficialSourceMonitor(env as unknown as IntelligenceMonitorEnv);

  return Response.json({ ...result, checkedAt: new Date().toISOString(), by: user.email });
}
