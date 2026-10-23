import type { Metadata } from "next";
import type { Offering, ResolvedCategory, SectorConfig, TemplateKey } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trustvalue.ai";
export const SITE_NAME = "TrustValue.ai";

export const canonical = (p: string) => `${SITE_URL}${p}`;

/** Number of non-empty attribute fields on an offering. */
export function filledFields(o: Offering, attrs: Record<string, unknown> = o.attributes): number {
  return Object.values(attrs).filter((v) => (Array.isArray(v) ? v.length > 0 : v !== "" && v != null)).length;
}
/** Thin-page protection: noindex until the sector's minimum number of fields is filled. */
export const isIndexable = (o: Offering, sector: SectorConfig, attrs?: Record<string, unknown>) =>
  filledFields(o, attrs) >= sector.indexing.minFieldsToIndex;

export const meta = (title: string, description: string, p: string, index = true): Metadata => ({
  title, description,
  alternates: { canonical: canonical(p) },
  robots: index ? { index: true, follow: true } : { index: false, follow: true },
});

export function schemaType(template: TemplateKey, sector: SectorConfig, category?: ResolvedCategory): string {
  switch (template) {
    case "plan": return "FinancialProduct";
    case "spec": return "Product";
    case "listing": return sector.slug === "education" ? "Course" : "Product";
    case "scheme": return "GovernmentService";
    case "place":
      if (sector.slug === "healthcare") return "Hospital";
      if (sector.slug === "food") return "Restaurant";
      if (category?.path[0] === "schools") return "School";
      return "LocalBusiness";
  }
}
