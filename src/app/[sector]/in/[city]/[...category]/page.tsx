import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView, categoryIsThin } from "@/components/CategoryView";
import { getCategories, getCategory, getCities, getCity, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string; city: string; category: string[] }> };
export const dynamicParams = false;

export const generateStaticParams = () =>
  getSectors().filter((s) => s.location !== "none").flatMap((s) =>
    getCities().flatMap((city) => getCategories(s.slug).map((c) => ({ sector: s.slug, city: city.slug, category: c.path }))));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, city, category } = await params;
  const c = getCategory(sector, category), ci = getCity(city);
  if (!c || !ci) return {};
  return meta(`${c.name} in ${ci.name}`, `${c.name} in ${ci.name}.`, paths.cityCategory(sector, city, category), !categoryIsThin(sector, category, city));
}

export default async function Page({ params }: Props) {
  const { sector, city, category } = await params;
  const s = getSector(sector);
  if (!s || s.location === "none" || category.length > s.maxCategoryDepth) notFound();
  return <CategoryView sector={sector} path={category} city={city} />;
}
