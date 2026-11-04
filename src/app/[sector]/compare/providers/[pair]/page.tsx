import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import CompareView from "@/components/compare/CompareView";
import { buildCompareModesData, normalizePairSlug } from "@/lib/compare";
import { getComparePairs, getOfferings, getProvider, getProvidersForSector, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = {
  params: Promise<{ sector: string; pair: string }>;
  searchParams?: Promise<{ lock?: string; from?: string }>;
};

export const dynamicParams = true;
export const generateStaticParams = () =>
  getComparePairs().providers.map((p) => ({ sector: p.sector, pair: p.pair }));

export default async function CompareProviders({ params, searchParams }: Props) {
  const { sector: s, pair } = await params;
  const sp = searchParams ? await searchParams : {};
  const lockedEntity = (sp.lock || sp.from || "").trim();

  const sector = getSector(s);
  if (!sector) notFound();

  // Canonical alphabetical sorting redirect
  const { canonicalPair, isCanonical, slugs } = normalizePairSlug(pair);
  if (!isCanonical) {
    const q = lockedEntity ? `?lock=${encodeURIComponent(lockedEntity)}` : "";
    redirect(`${paths.compareProviders(s, canonicalPair)}${q}`);
  }

  const a = getProvider(slugs[0]);
  const b = getProvider(slugs[1]);
  if (!a || !b || !a.sectors[s] || !b.sectors[s]) {
    notFound();
  }

  const allProviders = getProvidersForSector(s);
  const allOfferings = getOfferings(s);
  const modesData = buildCompareModesData(s, allProviders, allOfferings);

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: "Brands", href: paths.brands(s) },
          { name: `${a.name} vs ${b.name}`, href: paths.compareProviders(s, pair) },
        ]}
      />

      <CompareView
        sectorSlug={s}
        sectorName={sector.name}
        initialMode="brands"
        initialPair={pair}
        lockedEntity={lockedEntity}
        modesData={modesData}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemPage",
          name: `${a.name} vs ${b.name}`,
          description: `Side-by-side regulatory and trust comparison of ${a.name} and ${b.name} in ${sector.name}.`,
        }}
      />
    </div>
  );
}
