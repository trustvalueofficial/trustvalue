import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOfferingsByProvider, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getSectors().map((s) => ({ sector: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSector((await params).sector);
  return s ? meta(`All ${s.labels.providers.toLowerCase()} – ${s.name}`, `Every ${s.labels.provider.toLowerCase()} in ${s.name}.`, paths.providers(s.slug)) : {};
}

export default async function ProvidersPage({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();
  const providers = getProvidersForSector(slug);
  return (
    <>
      <h1>{sector.labels.providers}</h1>
      <div className="grid">
        {providers.map((p) => (
          <Link key={p.slug} href={paths.provider(slug, p.slug)} className="card link-card">
            <strong>{p.name}</strong><small>{p.type} · {getOfferingsByProvider(slug, p.slug).length} {sector.labels.offerings.toLowerCase()}</small>
          </Link>
        ))}
      </div>
    </>
  );
}
