import { AttributeTable, FaqList, KeyNumbers, ListSection, OfferingHeader, ReviewList, Section, SourceList, VariantList } from "../sections";
import type { TemplateProps } from "./types";

/** Financial products, subscriptions, tariffs. */
export function PlanPage({ sector, offering, variant, attrs, values }: TemplateProps) {
  const listKeys = attrs.filter((a) => a.type === "list").map((a) => a.key);
  return (
    <>
      <OfferingHeader offering={offering} variant={variant} sectorSlug={sector.slug} badge={sector.labels.offering} />
      <KeyNumbers attrs={attrs} values={values} />
      {sector.features.calculator && <Section title="Calculator"><p className="muted">Mount your premium / EMI calculator component here.</p></Section>}
      {listKeys.map((k) => <ListSection key={k} title={attrs.find((a) => a.key === k)!.label} items={values[k]} />)}
      <AttributeTable title="Details" attrs={attrs.filter((a) => a.type !== "list")} values={values} />
      <VariantList offering={offering} sectorSlug={sector.slug} label={sector.labels.variant} attrs={attrs} />
      <ReviewList reviews={offering.reviews} enabled={sector.features.reviews} />
      <FaqList faqs={offering.faqs} />
      <SourceList sources={offering.sources} />
    </>
  );
}
