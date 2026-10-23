import { AttributeTable, FaqList, OfferingHeader, ReviewList, Section, SourceList, VariantList } from "../sections";
import type { TemplateProps } from "./types";

/** Models and SKUs with specifications and variants. */
export function SpecPage({ sector, offering, variant, attrs, values }: TemplateProps) {
  return (
    <>
      <OfferingHeader offering={offering} variant={variant} sectorSlug={sector.slug} badge={sector.labels.offering} />
      <AttributeTable title="Specifications" attrs={attrs} values={values} />
      <VariantList offering={offering} sectorSlug={sector.slug} label={sector.labels.variant} attrs={attrs} />
      {(offering.pros?.length || offering.cons?.length) && (
        <Section title="Pros and cons">
          <div className="two-col">
            <div><h3>Pros</h3><ul>{offering.pros?.map((p) => <li key={p}>{p}</li>)}</ul></div>
            <div><h3>Cons</h3><ul>{offering.cons?.map((p) => <li key={p}>{p}</li>)}</ul></div>
          </div>
        </Section>
      )}
      <ReviewList reviews={offering.reviews} enabled={sector.features.reviews} />
      <FaqList faqs={offering.faqs} />
      <SourceList sources={offering.sources} />
    </>
  );
}
