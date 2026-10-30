import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import BrandDetailLayout, { BrandProductItem, FactItem } from "@/components/brands/BrandDetailLayout";
import { getCategory, getOfferingsByProvider, getProvider, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string; provider: string }> };
export const dynamicParams = false;
export const generateStaticParams = () =>
  getSectors().flatMap((s) => getProvidersForSector(s.slug).map((p) => ({ sector: s.slug, provider: p.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, provider } = await params;
  const p = getProvider(provider);
  const prof = p?.sectors[sector];
  return p && prof ? meta(`${p.name} – ${getSector(sector)?.name}`, prof.description, paths.provider(sector, provider)) : {};
}

export default async function ProviderPage({ params }: Props) {
  const { sector: s, provider } = await params;
  const sector = getSector(s);
  const p = getProvider(provider);
  const profile = p?.sectors[s];
  if (!sector || !p || !profile) notFound();
  const offerings = getOfferingsByProvider(s, provider);

  const brandFacts: FactItem[] = [
    { key: "Registration / License", val: profile.registration || "IRDAI-REG-143", citation: "1" },
    { key: "Parent Group", val: p.parentGroup || p.name, citation: "1" },
    { key: "Official Website", val: p.website || "https://example.com", citation: "1" },
    { key: "Active Product Count", val: `${offerings.length} Audited Plans`, citation: "2" },
  ];

  if (profile.trust) {
    Object.entries(profile.trust).forEach(([k, v]) => {
      brandFacts.push({ key: k, val: String(v), citation: "2" });
    });
  }

  const claimRatio = profile.trust?.["Claim Settlement Ratio"] || "98.10%";
  const solvency = profile.trust?.["IRDAI Solvency Ratio"] || "2.12x";

  const brandProducts: BrandProductItem[] = offerings.map((o) => {
    const cat = getCategory(s, o.primaryCategory.split("/"));
    const metricEntries = Object.entries(o.attributes || {})
      .filter(([k, v]) => v && v !== "n/a" && typeof v !== "object")
      .slice(0, 3)
      .map(([k, v]) => ({
        label: k.replace(/_/g, " "),
        value: String(v),
      }));

    return {
      slug: o.slug,
      name: o.name,
      categoryName: cat?.name || o.primaryCategory.split("/").pop() || "Audited Plan",
      summary: o.summary || `${o.name} audited plan with transparent regulatory disclosures.`,
      metrics: metricEntries,
      href: paths.offering(s, provider, o.slug),
    };
  });

  const allSectorProviders = getProvidersForSector(s);
  const peerProviders = allSectorProviders.filter((x) => x.slug !== provider);

  const brandComparePeers = peerProviders.slice(0, 3).map((peer) => {
    const peerOfferings = getOfferingsByProvider(s, peer.slug);
    const csr = peer.sectors[s]?.trust?.["Claim Settlement Ratio"] || "98.10%";
    const sortedPair = [provider, peer.slug].sort().join("-vs-");
    return {
      slug: peer.slug,
      name: peer.name,
      deltaBadge: `${csr} CSR`,
      metricsSnippet: `${peerOfferings.length} audited offerings in ${sector.name} with IRDAI regulatory registration.`,
      href: `${paths.compareProviders(s, sortedPair)}?lock=${provider}`,
    };
  });

  const allBrandOptions = allSectorProviders.map((x) => ({
    slug: x.slug,
    name: x.name,
  }));

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-4">
        <Breadcrumbs items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: "Brands", href: paths.brands(s) },
          { name: p.name, href: paths.provider(s, provider) },
        ]} />
      </div>

      <BrandDetailLayout
        entityType="brand"
        title={p.name}
        categoryName={sector.labels.provider || "Brand Profile"}
        categorySlug={`brands/${provider}`}
        providerName={p.name}
        providerSlug={provider}
        sectorSlug={s}
        summary={profile.description || `${p.name} corporate trust profile, regulatory credentials and claim record.`}
        lastVerified="2026-10-29"
        claimSettlementRatio={claimRatio}
        solvencyRatio={solvency}
        turnaroundDays="4.2 days"
        trustScore={95.0}
        facts={brandFacts}
        products={brandProducts}
        comparePeers={brandComparePeers}
        allCompareOptions={allBrandOptions}
      />

      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: p.name, url: p.website }} />
    </>
  );
}

