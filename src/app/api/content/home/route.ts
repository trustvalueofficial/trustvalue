import { NextResponse } from "next/server";
import { getHomePageContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = getHomePageContent();
  return NextResponse.json(
    { data: content },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
      },
    }
  );
}
