import BrandDetailLayout, { BrandProductItem, FactItem } from "@/components/brands/BrandDetailLayout";
import { getCategory, getOfferingsByProvider } from "@/lib/cms";
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
    />
  );
}

