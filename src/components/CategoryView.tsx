import Link from "next/link";
import { notFound } from "next/navigation";
import { getAncestors, getCategory, getChildren, getCity, getOfferingsInCategory, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { Breadcrumbs } from "./Breadcrumbs";
import { CityPicker } from "./CityPicker";
import { JsonLd } from "./JsonLd";
import { OfferingCard } from "./OfferingCard";
import { formatValue } from "./sections";

/** Used by both /[sector]/[...category] and /[sector]/in/[city]/[...category]. */
export function CategoryView({ sector: s, path, city }: { sector: string; path: string[]; city?: string }) {
  const sector = getSector(s);
  const category = getCategory(s, path);
  const cityRec = city ? getCity(city) : undefined;
  if (!sector || !category || (city && !cityRec)) notFound();

  const needsCity = category.location === "required" && !city;
  const children = getChildren(s, path);
  const offerings = needsCity ? [] : getOfferingsInCategory(s, path, city);
  const link = (p: string[]) => (city ? paths.cityCategory(s, city, p) : paths.category(s, p));
  const levelLabel = sector.labels.levels[category.level] ?? sector.labels.offerings;

  const crumbs = [
    { name: sector.name, href: paths.sector(s) },
    ...(cityRec ? [{ name: cityRec.name, href: paths.city(s, cityRec.slug) }] : []),
    ...getAncestors(s, path).map((c) => ({ name: c.name, href: link(c.path) })),
  ];
  const cols = category.attributes.filter((a) => a.comparable);

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <h1>{category.name}{cityRec ? ` in ${cityRec.name}` : ""}</h1>
      <p className="lead">{category.intro ?? `Compare ${category.name.toLowerCase()} ${sector.labels.offerings.toLowerCase()}.`}</p>

      {needsCity && <CityPicker title={`Choose a city for ${category.name}`} href={(c) => paths.cityCategory(s, c, path)} />}

      {children.length > 0 && (
        <section>
          <h2>{levelLabel}s</h2>
          <div className="grid">
            {children.map((c) => <Link key={c.slug} className="card link-card" href={link(c.path)}><strong>{c.name}</strong></Link>)}
          </div>
        </section>
      )}

      {offerings.length > 0 && (
        <section>
          <h2>{sector.labels.offerings}</h2>
          <div className="grid">{offerings.map((o) => <OfferingCard key={o.provider + o.slug} offering={o} />)}</div>
        </section>
      )}

      {sector.features.compare && offerings.length >= 2 && (
        <section className="card">
          <h2>Comparison</h2>
          <div className="scroll"><table className="table">
            <thead><tr><th />{offerings.map((o) => <th key={o.slug}>{o.name}</th>)}</tr></thead>
            <tbody>{cols.map((a) => (
              <tr key={a.key}><th>{a.label}</th>{offerings.map((o) => <td key={o.slug}>{formatValue(a, o.attributes[a.key])}</td>)}</tr>
            ))}</tbody>
          </table></div>
        </section>
      )}

      {category.faqs.length > 0 && (
        <section className="card">
          <h2>FAQs</h2>
          {category.faqs.map((f) => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}
          <JsonLd data={{
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: category.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }} />
        </section>
      )}
    </>
  );
}

/** Empty categories and city-required pages without a city are thin: keep them out of the index. */
export function categoryIsThin(s: string, path: string[], city?: string): boolean {
  const c = getCategory(s, path);
  if (!c) return true;
  if (c.location === "required" && !city) return true;
  return getOfferingsInCategory(s, path, city).length === 0 && getChildren(s, path).length === 0;
}
