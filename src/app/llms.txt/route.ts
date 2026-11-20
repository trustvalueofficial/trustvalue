import { getLlmsTxt } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getLlmsTxt();
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
