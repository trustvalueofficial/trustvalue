import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";
import { getBlogs, getBlogCategories, getBlogCategory, getSector, getBlog } from "@/lib/cms";
import { BlogCategoryView } from "@/components/blogcomponent";

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = getBlogCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: catParam } = await params;
  const category = getBlogCategory(catParam);

  if (!category) {
    const sector = getSector(catParam);
    if (!sector) return meta("Category Not Found", "Category could not be found", paths.blog());
    return meta(
      `${sector.name} Research & Regulatory Audits | TrustValue`,
      `In-depth consumer research, statutory circulars, and regulatory audits across the ${sector.name} sector.`,
      paths.blogCategory(catParam)
    );
  }

  const title = category.seoTitle || `${category.name} Research & Regulatory Audits | TrustValue`;
  const desc =
    category.seoDescription ||
    category.description ||
    `Independent regulatory analysis, consumer research, and claim settlement audits for ${category.name}.`;

  return meta(title, desc, paths.blogCategory(catParam));
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: catParam } = await params;

  // 1. Check if catParam is actually a legacy single-slug blog article URL (/blog/[slug])
  const possibleArticle = await getBlog(catParam);
  if (possibleArticle) {
    // 308 redirect to nested /blog/[category]/[slug]
    const targetCategory = possibleArticle.sector || possibleArticle.categorySlug || "general";
    redirect(`/blog/${targetCategory}/${possibleArticle.slug}`);
  }

  // 2. Resolve category or fallback to sector
  let category = getBlogCategory(catParam);

  if (!category) {
    const sector = getSector(catParam);
    if (!sector) notFound();

    category = {
      id: sector.slug,
      slug: sector.slug,
      sectorSlug: sector.slug,
      name: sector.name,
      description: sector.description || `Independent regulatory audit and research guides for ${sector.name}.`,
      heroTitle: `${sector.name} Research & Regulatory Audits`,
      badge: "Regulatory Silo",
      seoTitle: `${sector.name} Research & Regulatory Audits | TrustValue`,
      seoDescription: sector.description,
      articleCount: 0,
    };
  }

  const allArticles = await getBlogs();
  const categoryArticles = allArticles.filter(
    (a) =>
      a.sector?.toLowerCase() === catParam.toLowerCase() ||
      a.categorySlug?.toLowerCase() === catParam.toLowerCase()
  );

  const allCategories = getBlogCategories();

  return (
    <BlogCategoryView
      category={category}
      articles={categoryArticles}
      allCategories={allCategories}
    />
  );
}
