import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import CompareView from "@/components/compare/CompareView";
import { buildCompareModesData } from "@/lib/compare";
import { getOfferings, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = { params: Promise<{ sector: string }> };

export const generateStaticParams = () => getSectors().map((s) => ({ sector: s.slug }));

export default async function SectorComparePage({ params }: Props) {
  const { sector: s } = await params;
  const sector = getSector(s);
  if (!sector) notFound();

  const allProviders = getProvidersForSector(s);
  const allOfferings = getOfferings(s);
  const modesData = buildCompareModesData(s, allProviders, allOfferings);

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: "Compare", href: `/${s}/compare` },
        ]}
      />

      <CompareView
        sectorSlug={s}
        sectorName={sector.name}
        initialMode="brands"
        modesData={modesData}
      />
    </div>
  );
}
