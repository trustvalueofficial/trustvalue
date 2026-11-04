import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { canonical } from "@/lib/seo";

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <div className="flex items-center flex-wrap text-xs sm:text-[13px] font-medium text-[#667085] py-2 mb-3">
          {items.map((c, i) => {
            const isLast = i === items.length - 1;
            return (
              <span key={c.href} className="inline-flex items-center">
                {isLast ? (
                  <span className="text-[#071B46] font-semibold" aria-current="page">
                    {c.name}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="text-[#667085] hover:text-[#FF5A0A] transition-colors"
                  >
                    {c.name}
                  </Link>
                )}
                {!isLast && (
                  <i
                    className="fa-solid fa-chevron-right text-[9px] text-[#98A2B3] mx-2"
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          })}
        </div>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: canonical(c.href),
          })),
        }}
      />
    </>
  );
}
