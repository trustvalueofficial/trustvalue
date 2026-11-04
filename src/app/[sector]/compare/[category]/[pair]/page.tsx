import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import CompareView from "@/components/compare/CompareView";
import { buildCompareModesData, normalizePairSlug } from "@/lib/compare";
import { getCategoryBySlug, getComparePairs, getOfferings, getOfferingsInCategory, getProvidersForSector, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = {
  params: Promise<{ sector: string; category: string; pair: string }>;
  searchParams?: Promise<{ lock?: string; from?: string }>;
};

export const dynamicParams = true;
export const generateStaticParams = () =>
  getComparePairs().offerings.map((o) => ({ sector: o.sector, category: o.category, pair: o.pair }));

export default async function CompareOfferings({ params, searchParams }: Props) {
  const { sector: s, category: catSlug, pair } = await params;
  const sp = searchParams ? await searchParams : {};
  const lockedEntity = (sp.lock || sp.from || "").trim();

  const sector = getSector(s);
  const cat = getCategoryBySlug(s, catSlug);
  if (!sector || !cat) notFound();

  // Canonical alphabetical sorting redirect
  const { canonicalPair, isCanonical, slugs } = normalizePairSlug(pair);
  if (!isCanonical) {
    const q = lockedEntity ? `?lock=${encodeURIComponent(lockedEntity)}` : "";
    redirect(`${paths.compareOfferings(s, catSlug, canonicalPair)}${q}`);
  }

  // Verify both offerings exist in category
  const pool = getOfferingsInCategory(s, cat.path);
  const a = pool.find((o) => o.slug === slugs[0]);
  const b = pool.find((o) => o.slug === slugs[1]);
  if (!a || !b) notFound();

  const allProviders = getProvidersForSector(s);
  const allOfferings = getOfferings(s);
  const modesData = buildCompareModesData(s, allProviders, allOfferings);

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: "Segments", href: paths.segments(s) },
          { name: cat.name, href: paths.category(s, cat.path) },
          { name: `${a.name} vs ${b.name}`, href: paths.compareOfferings(s, catSlug, pair) },
        ]}
      />

      <CompareView
        sectorSlug={s}
        sectorName={sector.name}
        initialMode="products"
        initialPair={pair}
        lockedEntity={lockedEntity}
        modesData={modesData}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${a.name} vs ${b.name}`,
          description: `Head-to-head comparison between ${a.name} and ${b.name} in ${cat.name}.`,
        }}
      />
    </div>
  );
}
