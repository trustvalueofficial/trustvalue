import type { Metadata } from "next";
import { OfferingPage, offeringMetadata } from "@/components/OfferingPage";
import { getOfferings, getSectors } from "@/lib/cms";

type Props = { params: Promise<{ sector: string; provider: string; offering: string }> };
export const dynamicParams = false;
export const revalidate = 3600; // ISR: rates / prices change, so refresh hourly (tune per sector later)

export const generateStaticParams = () =>
  getSectors().flatMap((s) => getOfferings(s.slug).map((o) => ({ sector: s.slug, provider: o.provider, offering: o.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, provider, offering } = await params;
  return offeringMetadata(sector, provider, offering);
}
export default async function Page({ params }: Props) {
  const { sector, provider, offering } = await params;
  return <OfferingPage s={sector} p={provider} o={offering} />;
}
