import type { Metadata } from "next";
import { OfferingPage, offeringMetadata } from "@/components/OfferingPage";
import { getOfferings, getSectors } from "@/lib/cms";

type Props = { params: Promise<{ sector: string; provider: string; offering: string; variant: string }> };
export const dynamicParams = false;
export const revalidate = 3600;

export const generateStaticParams = () =>
  getSectors().flatMap((s) =>
    getOfferings(s.slug).flatMap((o) =>
      (o.variants ?? []).map((v) => ({ sector: s.slug, provider: o.provider, offering: o.slug, variant: v.slug }))));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, provider, offering, variant } = await params;
  return offeringMetadata(sector, provider, offering, variant);
}
export default async function Page({ params }: Props) {
  const { sector, provider, offering, variant } = await params;
  return <OfferingPage s={sector} p={provider} o={offering} v={variant} />;
}
