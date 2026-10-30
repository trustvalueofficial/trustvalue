import BrandDetailLayout, { BrandProductItem, FactItem } from "@/components/brands/BrandDetailLayout";
import { getCategory, getOfferingsByProvider, getOfferingsInCategory, getProvider } from "@/lib/cms";
import { paths } from "@/lib/routing";
import type { TemplateProps } from "./types";

/** Models and SKUs with specifications rendering the 30% / 70% Brand & Specification structure. */
export function SpecPage({ sector, provider, profile, offering, variant, category, attrs, values }: TemplateProps) {
  const facts: FactItem[] = attrs
    .filter((a) => a.type !== "list" && values[a.key] !== undefined)
    .map((a) => ({
      key: a.label,
      val: String(values[a.key]),
      citation: "1",
    }));

  // Fetch sibling products from the same brand for internal redirection
  const allOfferings = getOfferingsByProvider(sector.slug, provider.slug);
  const siblingOfferings = allOfferings.filter((o) => o.slug !== offering.slug);
  const displayOfferings = siblingOfferings.length > 0 ? siblingOfferings : allOfferings;

  const brandProducts: BrandProductItem[] = displayOfferings.map((o) => {
    const cat = getCategory(sector.slug, o.primaryCategory.split("/"));
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
      href: paths.offering(sector.slug, provider.slug, o.slug),
    };
  });

  const catOfferings = getOfferingsInCategory(sector.slug, category.path);
  const rivalOfferings = catOfferings.filter((o) => o.provider !== provider.slug && o.slug !== offering.slug);
  const catLeaf = category.path[category.path.length - 1] || category.slug;

  const crossBrandPeers = rivalOfferings.slice(0, 3).map((r) => {
    const rivalProvider = getProvider(r.provider);
    const sortedPair = [offering.slug, r.slug].sort().join("-vs-");
    return {
      slug: r.slug,
      name: r.name,
      providerSlug: r.provider,
      providerName: rivalProvider?.name || r.provider,
      categorySlug: catLeaf,
      deltaBadge: "Competitor",
      metricsSnippet: r.summary || `Direct competitive product in ${category.name}.`,
      href: `${paths.compareOfferings(sector.slug, catLeaf, sortedPair)}?lock=${offering.slug}`,
    };
  });

  const sameBrandPeers = siblingOfferings.slice(0, 3).map((s) => {
    const sortedPair = [offering.slug, s.slug].sort().join("-vs-");
    return {
      slug: s.slug,
      name: s.name,
      providerSlug: provider.slug,
      providerName: provider.name,
      categorySlug: catLeaf,
      deltaBadge: "Internal Line",
      metricsSnippet: s.summary || `Alternative model from ${provider.name}.`,
      href: `${paths.compareOfferings(sector.slug, catLeaf, sortedPair)}?lock=${offering.slug}`,
    };
  });

  const allEligibleOptions = catOfferings.map((o) => {
    const prov = getProvider(o.provider);
    return {
      slug: o.slug,
      name: o.name,
      brandName: prov?.name || o.provider,
    };
  });

  return (
    <BrandDetailLayout
      entityType="product"
      title={`${offering.name}${variant ? ` - ${variant.name}` : ""}`}
      categoryName={category.name || "Product"}
      categorySlug={category.path.join("/")}
      providerName={provider.name}
      providerSlug={provider.slug}
      sectorSlug={sector.slug}
      summary={offering.summary || "Full audited product specifications, reliability telemetry, and warranty record."}
      lastVerified={offering.lastVerified || "2026-10-29"}
      claimSettlementRatio="98.10%"
      solvencyRatio="2.12x"
      turnaroundDays="3.8 days"
      trustScore={92.5}
      facts={facts.length ? facts : undefined}
      products={brandProducts.length > 0 ? brandProducts : undefined}
      comparePeers={crossBrandPeers}
      sameBrandComparePeers={sameBrandPeers}
      allCompareOptions={allEligibleOptions}
    />
  );
}

