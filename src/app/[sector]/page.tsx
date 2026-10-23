import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CityPicker } from "@/components/CityPicker";
import { OfferingCard } from "@/components/OfferingCard";
import { getChildren, getOfferings, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getSectors().map((s) => ({ sector: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSector((await params).sector);
  return s ? meta(s.name, s.description, paths.sector(s.slug)) : {};
}

export default async function SectorHub({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();
  const top = getChildren(slug, []);
  const providers = getProvidersForSector(slug);
  const offerings = getOfferings(slug).slice(0, 6);
  return (
    <>
      <h1>{sector.icon} {sector.name}</h1>
      <p className="lead">{sector.description}</p>

      <section>
        <h2>{sector.labels.levels[0]}s</h2>
        <div className="grid">
          {top.map((c) => <Link key={c.slug} href={paths.category(slug, c.path)} className="card link-card"><strong>{c.name}</strong></Link>)}
        </div>
      </section>

      {sector.location !== "none" && (
        <div id="cities"><CityPicker title={sector.location === "required" ? "Choose your city" : "Browse by city"} href={(c) => paths.city(slug, c)} /></div>
      )}

      {offerings.length > 0 && (
        <section><h2>Featured {sector.labels.offerings.toLowerCase()}</h2>
          <div className="grid">{offerings.map((o) => <OfferingCard key={o.provider + o.slug} offering={o} />)}</div></section>
      )}

      <section>
        <h2>{sector.labels.providers}</h2>
        <div className="chips">
          {providers.map((p) => <Link key={p.slug} href={paths.provider(slug, p.slug)} className="chip">{p.name}</Link>)}
          <Link href={paths.providers(slug)} className="chip">All {sector.labels.providers.toLowerCase()} →</Link>
        </div>
      </section>

      {sector.watch && <p className="note"><strong>Sector invariant to watch:</strong> {sector.watch}</p>}
    </>
  );
}
