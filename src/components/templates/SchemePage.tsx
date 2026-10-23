import { AttributeTable, FaqList, ListSection, OfferingHeader, Section, SourceList } from "../sections";
import type { TemplateProps } from "./types";

/** Public services and schemes. Reviews and commercial compare stay off. */
export function SchemePage({ sector, offering, variant, attrs, values }: TemplateProps) {
  const link = typeof values.official_link === "string" ? values.official_link : undefined;
  const known = ["eligibility", "benefits", "documents_required", "steps", "official_link"];
  return (
    <>
      <OfferingHeader offering={offering} variant={variant} sectorSlug={sector.slug} badge={sector.labels.offering} />
      <ListSection title="Who it is for" items={values.eligibility} />
      <ListSection title="Benefits" items={values.benefits} />
      <ListSection title="Documents needed" items={values.documents_required} />
      <ListSection title="Steps to apply" items={values.steps} />
      {sector.features.eligibilityChecker && <Section title="Eligibility checker"><p className="muted">Mount your eligibility checker here.</p></Section>}
      <AttributeTable title="Key facts" attrs={attrs.filter((a) => !known.includes(a.key))} values={values} />
      {link && <Section title="Official link"><a href={link} rel="nofollow noopener">{link}</a></Section>}
      <FaqList faqs={offering.faqs} />
      <SourceList sources={offering.sources} />
    </>
  );
}
