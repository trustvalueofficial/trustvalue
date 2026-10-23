import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView, categoryIsThin } from "@/components/CategoryView";
import { getCategories, getCategory, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string; category: string[] }> };
export const dynamicParams = false; // only CMS-approved URLs exist; everything else is a 404

export const generateStaticParams = () =>
  getSectors().flatMap((s) => getCategories(s.slug).map((c) => ({ sector: s.slug, category: c.path })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, category } = await params;
  const c = getCategory(sector, category);
  const s = getSector(sector);
  if (!c || !s) return {};
  return meta(`${c.name} – ${s.name}`, c.intro ?? `Compare ${c.name.toLowerCase()}.`, paths.category(sector, category), !categoryIsThin(sector, category));
}

export default async function CategoryPage({ params }: Props) {
  const { sector, category } = await params;
  const s = getSector(sector);
  if (!s || category.length > s.maxCategoryDepth) notFound();
  return <CategoryView sector={sector} path={category} />;
}
