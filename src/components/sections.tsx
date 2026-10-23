import Link from "next/link";
import type { ReactNode } from "react";
import { getProvider } from "@/lib/cms";
import { paths } from "@/lib/routing";
import type { AttributeDef, AttrValue, Faq, Offering, Review, SourceRef, Variant } from "@/lib/types";

export function formatValue(def: AttributeDef, v: AttrValue | undefined): ReactNode {
  if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) return <span className="muted">Not available</span>;
  if (Array.isArray(v)) return <ul>{v.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (def.type === "date" && typeof v === "string") return new Date(v).toLocaleDateString("en-IN", { dateStyle: "long" });
  return `${v}${def.unit && def.type === "number" ? ` ${def.unit}` : ""}`;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="card"><h2>{title}</h2>{children}</section>;
}

export function OfferingHeader({ offering, variant, sectorSlug, badge }: {
  offering: Offering; variant?: Variant; sectorSlug: string; badge: string;
}) {
  const provider = getProvider(offering.provider);
  return (
    <header className="offering-head">
      <span className="badge">{badge}</span>
      <h1>{offering.name}{variant ? ` – ${variant.name}` : ""}</h1>
      <p>
        by <Link href={paths.provider(sectorSlug, offering.provider)}>{provider?.name ?? offering.provider}</Link>
        {" · "}<VerifiedOn date={offering.lastVerified} />
      </p>
      {offering.summary && <p className="lead">{offering.summary}</p>}
    </header>
  );
}

export function VerifiedOn({ date }: { date: string }) {
  return <small>Last verified {new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small>;
}

export function KeyNumbers({ attrs, values, limit = 4 }: { attrs: AttributeDef[]; values: Record<string, AttrValue>; limit?: number }) {
  const keys = attrs.filter((a) => a.type !== "list" && values[a.key] !== undefined).slice(0, limit);
  if (!keys.length) return null;
  return (
    <div className="stats">
      {keys.map((a) => (
        <div key={a.key} className="stat"><small>{a.label}</small><strong>{formatValue(a, values[a.key])}</strong></div>
      ))}
    </div>
  );
}

export function AttributeTable({ attrs, values, only, title }: {
  attrs: AttributeDef[]; values: Record<string, AttrValue>; only?: string[]; title: string;
}) {
  const rows = only ? attrs.filter((a) => only.includes(a.key)) : attrs;
  return (
    <Section title={title}>
      <table className="table"><tbody>
        {rows.map((a) => <tr key={a.key}><th>{a.label}</th><td>{formatValue(a, values[a.key])}</td></tr>)}
      </tbody></table>
    </Section>
  );
}

export function ListSection({ title, items }: { title: string; items?: AttrValue }) {
  if (!Array.isArray(items) || !items.length) return null;
  return <Section title={title}><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul></Section>;
}

export function VariantList({ offering, sectorSlug, label, attrs }: {
  offering: Offering; sectorSlug: string; label: string; attrs: AttributeDef[];
}) {
  if (!offering.variants?.length) return null;
  const cols = attrs.filter((a) => offering.variants!.some((v) => a.key in v.attributes));
  return (
    <Section title={`${label}s`}>
      <table className="table">
        <thead><tr><th>{label}</th>{cols.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
        <tbody>
          {offering.variants.map((v) => (
            <tr key={v.slug}>
              <td><Link href={paths.variant(sectorSlug, offering.provider, offering.slug, v.slug)}>{v.name}</Link></td>
              {cols.map((c) => <td key={c.key}>{formatValue(c, v.attributes[c.key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

export function FaqList({ faqs }: { faqs?: Faq[] }) {
  if (!faqs?.length) return null;
  return <Section title="FAQs">{faqs.map((f) => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</Section>;
}
export function SourceList({ sources }: { sources?: SourceRef[] }) {
  if (!sources?.length) return null;
  return (
    <Section title="Sources">
      <ul>{sources.map((s) => <li key={s.url}><a href={s.url} rel="nofollow noopener">{s.title}</a> <small>accessed {s.accessedOn}</small></li>)}</ul>
    </Section>
  );
}
export function ReviewList({ reviews, enabled }: { reviews?: Review[]; enabled: boolean }) {
  if (!enabled) return null;
  return (
    <Section title="Reviews">
      {reviews?.length ? reviews.map((r, i) => <p key={i}>{"★".repeat(r.rating)} <small>{r.source}, {r.date}</small><br />{r.body}</p>) : <p className="muted">No reviews yet.</p>}
    </Section>
  );
}
