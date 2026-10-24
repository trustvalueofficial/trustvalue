import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { OfferingCard } from "@/components/OfferingCard";
import { getOfferingsByProvider, getProvider, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string; provider: string }> };
export const dynamicParams = false;
export const generateStaticParams = () =>
  getSectors().flatMap((s) => getProvidersForSector(s.slug).map((p) => ({ sector: s.slug, provider: p.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, provider } = await params;
  const p = getProvider(provider);
  const prof = p?.sectors[sector];
  return p && prof ? meta(`${p.name} – ${getSector(sector)?.name}`, prof.description, paths.provider(sector, provider)) : {};
}

export default async function ProviderPage({ params }: Props) {
  const { sector: s, provider } = await params;
  const sector = getSector(s);
  const p = getProvider(provider);
  const profile = p?.sectors[s];
  if (!sector || !p || !profile) notFound();
  const offerings = getOfferingsByProvider(s, provider);
  return (
    <>
      <Breadcrumbs items={[
        { name: sector.name, href: paths.sector(s) },
        { name: sector.labels.providers, href: paths.providers(s) },
        { name: p.name, href: paths.provider(s, provider) },
      ]} />
      <h1>{p.name}</h1>
      <p className="lead">{profile.description}</p>
      {profile.registration && <p><small>Registration: {profile.registration}</small></p>}
      {profile.trust && <div className="stats">{Object.entries(profile.trust).map(([k, v]) => <div className="stat" key={k}><small>{k}</small><strong>{v}</strong></div>)}</div>}
      <h2>{sector.labels.offerings}</h2>
      {offerings.length ? <div className="grid">{offerings.map((o) => <OfferingCard key={o.slug} offering={o} />)}</div> : <p className="muted">None published yet.</p>}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: p.name, url: p.website }} />
    </>
  );
}
