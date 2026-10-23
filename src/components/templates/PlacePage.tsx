import Link from "next/link";
import { getCity, getOfferingsInCategory } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { AttributeTable, FaqList, ListSection, OfferingHeader, ReviewList, Section, SourceList } from "../sections";
import type { TemplateProps } from "./types";

/** Facilities tied to an address: hospitals, schools, restaurants, branches. */
export function PlacePage({ sector, offering, variant, category, attrs, values }: TemplateProps) {
  const city = offering.place?.city;
  const nearby = getOfferingsInCategory(sector.slug, category.path, city).filter((o) => o.slug !== offering.slug);
  return (
    <>
      <OfferingHeader offering={offering} variant={variant} sectorSlug={sector.slug} badge={sector.labels.offering} />
      {offering.place && (
        <Section title="Address">
          <p>{[offering.place.address, offering.place.locality, city && getCity(city)?.name, offering.place.state].filter(Boolean).join(", ")}</p>
          <p className="muted">Mount your map component here.</p>
        </Section>
      )}
      {attrs.filter((a) => a.type === "list").map((a) => <ListSection key={a.key} title={a.label} items={values[a.key]} />)}
      <AttributeTable title="Details and timings" attrs={attrs.filter((a) => a.type !== "list")} values={values} />
      <ReviewList reviews={offering.reviews} enabled={sector.features.reviews} />
      <FaqList faqs={offering.faqs} />
      {nearby.length > 0 && (
        <Section title="Nearby">
          <ul>{nearby.map((o) => <li key={o.slug}><Link href={paths.offering(sector.slug, o.provider, o.slug)}>{o.name}</Link></li>)}</ul>
        </Section>
      )}
      <SourceList sources={offering.sources} />
    </>
  );
}
