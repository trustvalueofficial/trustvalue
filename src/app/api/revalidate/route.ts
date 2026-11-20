import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearCmsCache } from "@/lib/cms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, slug, action } = body;

    // Flush any in-memory module memoization
    try {
      clearCmsCache();
    } catch {}

    if (entityType === "blog") {
      revalidatePath("/blog");
      (revalidateTag as any)("blogs");
      if (slug) {
        const parts = slug.split("/");
        if (parts.length > 1) {
          revalidatePath(`/blog/${parts[0]}`);
          revalidatePath(`/blog/${parts[0]}/${parts[1]}`);
        } else {
          revalidatePath(`/blog/${slug}`);
        }
        revalidatePath(`/blog/category/${slug}`);
        (revalidateTag as any)(`blog-${slug}`);
      }
    } else if (entityType === "sector") {
      if (slug) {
        revalidatePath(`/${slug}`);
      }
      revalidatePath("/");
      (revalidateTag as any)("sectors");
    } else if (entityType === "category") {
      // slug format: "sectorSlug/categorySlug"
      if (slug) {
        const parts = slug.split("/");
        if (parts.length >= 1) {
          revalidatePath(`/${parts[0]}`);
        }
        revalidatePath(`/${slug}`);
      }
      revalidatePath("/");
      (revalidateTag as any)("categories");
    } else if (entityType === "provider") {
      if (slug) {
        // Providers appear on sector pages and their own brand pages
        revalidatePath(`/brand/${slug}`);
        (revalidateTag as any)(`provider-${slug}`);
      }
      revalidatePath("/");
      (revalidateTag as any)("providers");
    } else if (entityType === "offering") {
      // slug format: "sectorSlug/offeringSlug"
      if (slug) {
        revalidatePath(`/${slug}`);
        const parts = slug.split("/");
        if (parts.length >= 1) {
          revalidatePath(`/${parts[0]}`);
        }
        (revalidateTag as any)(`offering-${parts[parts.length - 1]}`);
      }
      revalidatePath("/");
      (revalidateTag as any)("offerings");
    } else if (entityType === "seo") {
      revalidatePath("/robots.txt");
      revalidatePath("/llms.txt");
      revalidatePath("/llm.txt");
      (revalidateTag as any)("seo");
    } else if (entityType === "static") {
      revalidatePath("/");
      (revalidateTag as any)("static");
      (revalidateTag as any)("home");
    }

    return NextResponse.json({
      revalidated: true,
      entityType,
      slug,
      action,
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
