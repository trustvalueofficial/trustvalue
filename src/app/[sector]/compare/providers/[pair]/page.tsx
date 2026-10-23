import { notFound } from "next/navigation";
import type { Provider } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getComparePairs, getOfferingsByProvider, getProvider, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = { params: Promise<{ sector: string; pair: string }> };
export const dynamicParams = false;
// Spec rule: generate compare pages only for curated, most-searched pairs (content/compare.json).
export const generateStaticParams = () => getComparePairs().providers.map((p) => ({ sector: p.sector, pair: p.pair }));

export default async function CompareProviders({ params }: Props) {
  const { sector: s, pair } = await params;
  const sector = getSector(s);
  const [a, b] = pair.split("-vs-").map((x) => getProvider(x));
  if (!sector || !a || !b || !a.sectors[s] || !b.sectors[s]) notFound();
  const rows: [string, (p: Provider) => string][] = [
    ["Type", (p) => p.type],
    ["Registration", (p) => p.sectors[s].registration ?? "—"],
    [sector.labels.offerings, (p) => String(getOfferingsByProvider(s, p.slug).length)],
  ];
  return (
    <>
      <Breadcrumbs items={[{ name: sector.name, href: paths.sector(s) }, { name: `${a.name} vs ${b.name}`, href: paths.compareProviders(s, pair) }]} />
      <h1>{a.name} vs {b.name}</h1>
      <table className="table">
        <thead><tr><th /><th>{a.name}</th><th>{b.name}</th></tr></thead>
        <tbody>{rows.map(([l, f]) => <tr key={l}><th>{l}</th><td>{f(a)}</td><td>{f(b)}</td></tr>)}</tbody>
      </table>
    </>
  );
}
