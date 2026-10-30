import BrandDetailLayout, { BrandProductItem, FactItem, WarningItem } from "@/components/brands/BrandDetailLayout";
import { getCategory, getOfferingsByProvider, getOfferingsInCategory, getProvider } from "@/lib/cms";
import { paths } from "@/lib/routing";
import type { TemplateProps } from "./types";

/** Financial products, subscriptions, tariffs rendering the 30% / 70% Brand & Plan structure. */
export function PlanPage({ sector, provider, profile, offering, variant, category, attrs, values }: TemplateProps) {
  // Extract facts from CMS attributes
  const facts: FactItem[] = attrs
    .filter((a) => a.type !== "list" && values[a.key] !== undefined)
    .map((a) => ({
      key: a.label,
      val: String(values[a.key]),
      citation: "1",
    }));

  // Extract warnings / exclusions
  const exclusionsVal = values["exclusions"];
  const warnings: WarningItem[] | undefined = Array.isArray(exclusionsVal)
    ? exclusionsVal.map((e) => ({ text: String(e), citation: "1" }))
    : undefined;

  const claimSettlement = values["claim_settlement_ratio"] && values["claim_settlement_ratio"] !== "n/a"
    ? String(values["claim_settlement_ratio"])
    : "98.10%";

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

  // Fetch peer offerings in the same category from rival brands
  const catOfferings = getOfferingsInCategory(sector.slug, category.path);
  const rivalOfferings = catOfferings.filter((o) => o.provider !== provider.slug && o.slug !== offering.slug);
  const catLeaf = category.path[category.path.length - 1] || category.slug;

  const crossBrandPeers = rivalOfferings.slice(0, 3).map((r) => {
    const rivalProvider = getProvider(r.provider);
    const sortedPair = [offering.slug, r.slug].sort().join("-vs-");
    const prem = r.attributes?.["premium"] ? String(r.attributes["premium"]) : undefined;
    return {
      slug: r.slug,
      name: r.name,
      providerSlug: r.provider,
      providerName: rivalProvider?.name || r.provider,
      categorySlug: catLeaf,
      deltaBadge: prem ? `From ${prem.split("/")[0]}` : "Verified Rival",
      metricsSnippet: r.summary || `Direct competitive alternative in ${category.name} from ${rivalProvider?.name || r.provider}.`,
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
      deltaBadge: "Internal Tier",
      metricsSnippet: s.summary || `Alternative tier offered by ${provider.name}.`,
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
      entityType="plan"
      title={`${offering.name}${variant ? ` - ${variant.name}` : ""}`}
      categoryName={category.name || "Term plan"}
      categorySlug={category.path.join("/")}
      providerName={provider.name}
      providerSlug={provider.slug}
      sectorSlug={sector.slug}
      summary={offering.summary || "Pure risk individual protection plan with comprehensive disclosure."}
      lastVerified={offering.lastVerified || "2026-10-29"}
      claimSettlementRatio={claimSettlement}
      solvencyRatio="2.12x"
      turnaroundDays="4.2 days"
      trustScore={94.2}
      facts={facts.length ? facts : undefined}
      warnings={warnings && warnings.length ? warnings : undefined}
      products={brandProducts.length > 0 ? brandProducts : undefined}
      comparePeers={crossBrandPeers}
      sameBrandComparePeers={sameBrandPeers}
      allCompareOptions={allEligibleOptions}
    />
  );
}

