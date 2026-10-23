import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatValue } from "@/components/sections";
import { getCategoryBySlug, getComparePairs, getOfferingsInCategory, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = { params: Promise<{ sector: string; category: string; pair: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getComparePairs().offerings.map((o) => ({ sector: o.sector, category: o.category, pair: o.pair }));

export default async function CompareOfferings({ params }: Props) {
  const { sector: s, category: catSlug, pair } = await params;
  const sector = getSector(s);
  const cat = getCategoryBySlug(s, catSlug); // leaf slug is unique per sector
  if (!sector || !cat) notFound();
  const pool = getOfferingsInCategory(s, cat.path);
  const [a, b] = pair.split("-vs-").map((slug) => pool.find((o) => o.slug === slug));
  if (!a || !b) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: sector.name, href: paths.sector(s) }, { name: cat.name, href: paths.category(s, cat.path) }, { name: `${a.name} vs ${b.name}`, href: paths.compareOfferings(s, catSlug, pair) }]} />
      <h1>{a.name} vs {b.name}</h1>
      <table className="table">
        <thead><tr><th /><th>{a.name}</th><th>{b.name}</th></tr></thead>
        <tbody>{cat.attributes.filter((x) => x.comparable).map((x) => (
          <tr key={x.key}><th>{x.label}</th><td>{formatValue(x, a.attributes[x.key])}</td><td>{formatValue(x, b.attributes[x.key])}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
}
