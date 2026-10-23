import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAncestors, getCategory, getOffering, getProvider, getSector, mergeAttributes } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { canonical, isIndexable, meta, schemaType } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { TEMPLATES } from "./templates";

/** Resolve everything an offering/variant URL needs, or null if any link in the chain is missing. */
function load(sectorSlug: string, providerSlug: string, offeringSlug: string, variantSlug?: string) {
  const sector = getSector(sectorSlug);
  const provider = getProvider(providerSlug);
  const offering = getOffering(sectorSlug, providerSlug, offeringSlug);
  const profile = provider?.sectors[sectorSlug];
  if (!sector || !provider || !offering || !profile) return null;
  const variant = variantSlug ? offering.variants?.find((v) => v.slug === variantSlug) : undefined;
  if (variantSlug && !variant) return null;
  const category = getCategory(sectorSlug, offering.primaryCategory.split("/"));
  if (!category) return null;
  return { sector, provider, profile, offering, variant, category, values: mergeAttributes(offering, variantSlug) };
}

export function offeringMetadata(s: string, p: string, o: string, v?: string): Metadata {
  const d = load(s, p, o, v);
  if (!d) return {};
  // One canonical URL per offering: variants point back to the offering page.
  const url = paths.offering(s, p, o);
  const m = meta(
    `${d.offering.name}${d.variant ? ` ${d.variant.name}` : ""} – ${d.provider.name}`,
    d.offering.summary ?? `${d.offering.name} by ${d.provider.name}`,
    url,
    isIndexable(d.offering, d.sector, d.values),
  );
  return m;
}

export function OfferingPage({ s, p, o, v }: { s: string; p: string; o: string; v?: string }) {
  const d = load(s, p, o, v);
  if (!d) notFound();
  const { sector, provider, offering, variant, category } = d;
  const Template = TEMPLATES[category.template];
  const crumbs = [
    { name: sector.name, href: paths.sector(s) },
    ...getAncestors(s, category.path).map((c) => ({ name: c.name, href: paths.category(s, c.path) })),
    { name: provider.name, href: paths.provider(s, p) },
    { name: offering.name, href: paths.offering(s, p, o) },
    ...(variant ? [{ name: variant.name, href: paths.variant(s, p, o, variant.slug) }] : []),
  ];
  return (
    <>
      <Breadcrumbs items={crumbs} />
      <Template {...d} attrs={category.attributes} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": schemaType(category.template, sector, category),
        name: offering.name, description: offering.summary,
        provider: { "@type": "Organization", name: provider.name },
        url: canonical(paths.offering(s, p, o)),
      }} />
    </>
  );
}
