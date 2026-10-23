import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { canonical } from "@/lib/seo";

export interface Crumb { name: string; href: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        {items.map((c, i) => (
          <span key={c.href}>
            {i < items.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            {i < items.length - 1 && " › "}
          </span>
        ))}
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem", position: i + 1, name: c.name, item: canonical(c.href),
        })),
      }} />
    </>
  );
}
