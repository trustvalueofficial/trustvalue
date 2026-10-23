import Link from "next/link";
import { paths } from "@/lib/routing";
import { AttributeTable, FaqList, KeyNumbers, ListSection, OfferingHeader, ReviewList, Section, SourceList } from "../sections";
import type { TemplateProps } from "./types";

/** Offerings tied to a place, date or route: projects, routes, courses. */
export function ListingPage({ sector, provider, profile, offering, variant, attrs, values }: TemplateProps) {
  return (
    <>
      <OfferingHeader offering={offering} variant={variant} sectorSlug={sector.slug} badge={sector.labels.offering} />
      <KeyNumbers attrs={attrs} values={values} />
      {offering.place && <Section title="Location"><p>{[offering.place.address, offering.place.locality, offering.place.state].filter(Boolean).join(", ")}</p></Section>}
      {attrs.filter((a) => a.type === "list").map((a) => <ListSection key={a.key} title={a.label} items={values[a.key]} />)}
      <AttributeTable title="Details" attrs={attrs.filter((a) => a.type !== "list")} values={values} />
      <Section title={`About the ${sector.labels.provider.toLowerCase()}`}>
        <p><Link href={paths.provider(sector.slug, provider.slug)}>{provider.name}</Link>: {profile?.description}</p>
        {profile?.registration && <p><small>Registration: {profile.registration}</small></p>}
      </Section>
      <Section title="Enquire"><p className="muted">Mount your enquiry form here.</p></Section>
      <ReviewList reviews={offering.reviews} enabled={sector.features.reviews} />
      <FaqList faqs={offering.faqs} />
      <SourceList sources={offering.sources} />
    </>
  );
}
