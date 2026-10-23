import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OfferingCard } from "@/components/OfferingCard";
import { getChildren, getCities, getCity, getOfferingsInCity, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string; city: string }> };
export const dynamicParams = false;

/** Only sectors whose location mode is not "none" get /in/[city] pages. */
export const generateStaticParams = () =>
  getSectors().filter((s) => s.location !== "none").flatMap((s) => getCities().map((c) => ({ sector: s.slug, city: c.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, city } = await params;
  const s = getSector(sector), c = getCity(city);
  if (!s || !c) return {};
  return meta(`${s.name} in ${c.name}`, `${s.name} in ${c.name}.`, paths.city(sector, city), getOfferingsInCity(sector, city).length > 0);
}

export default async function CityHub({ params }: Props) {
  const { sector: s, city } = await params;
  const sector = getSector(s), c = getCity(city);
  if (!sector || !c || sector.location === "none") notFound();
  const offerings = getOfferingsInCity(s, city);
  return (
    <>
      <Breadcrumbs items={[{ name: sector.name, href: paths.sector(s) }, { name: c.name, href: paths.city(s, city) }]} />
      <h1>{sector.name} in {c.name}</h1>
      <div className="grid">
        {getChildren(s, []).map((cat) => <Link key={cat.slug} href={paths.cityCategory(s, city, cat.path)} className="card link-card"><strong>{cat.name}</strong></Link>)}
      </div>
      {offerings.length > 0 && <><h2>{sector.labels.offerings} in {c.name}</h2><div className="grid">{offerings.map((o) => <OfferingCard key={o.provider + o.slug} offering={o} />)}</div></>}
    </>
  );
}
