import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, slug } = body;

    if (entityType === "blog") {
      revalidatePath("/blog");
      if (slug) {
        revalidatePath(`/blog/${slug}`);
      }
    } else if (entityType === "sector") {
      if (slug) {
        revalidatePath(`/${slug}`);
      }
      revalidatePath("/");
    }

    return NextResponse.json({
      revalidated: true,
      entityType,
      slug,
      now: Date.now(),
      message: `Cache revalidated for ${entityType} ${slug || ""}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error revalidating", error: err?.message },
      { status: 500 }
    );
  }
}
