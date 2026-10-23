import Link from "next/link";
import { getProvider } from "@/lib/cms";
import { paths } from "@/lib/routing";
import type { Offering } from "@/lib/types";

export function OfferingCard({ offering }: { offering: Offering }) {
  const provider = getProvider(offering.provider);
  return (
    <Link className="card link-card" href={paths.offering(offering.sector, offering.provider, offering.slug)}>
      <strong>{offering.name}</strong>
      <small>{provider?.name}</small>
      {offering.summary && <p>{offering.summary}</p>}
    </Link>
  );
}
