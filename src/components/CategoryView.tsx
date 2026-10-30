import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "./Breadcrumbs";
import { CityPicker } from "./CityPicker";
import { JsonLd } from "./JsonLd";
import { OfferingCard } from "./OfferingCard";
import { formatValue } from "./sections";
import {
  getAncestors,
  getCategory,
  getChildren,
  getCity,
  getOfferingsByProvider,
  getOfferingsInCategory,
  getProvidersForSector,
  getSector,
} from "@/lib/cms";
import { getCategoryFaIcon, getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";

/** Used by both /[sector]/[...category] and /[sector]/in/[city]/[...category]. */
export function CategoryView({
  sector: s,
  path,
  city,
}: {
  sector: string;
  path: string[];
  city?: string;
}) {
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
    { name: "Home", href: paths.home() },
    { name: sector.name, href: paths.sector(s) },
    ...(cityRec
      ? [{ name: cityRec.name, href: paths.city(s, cityRec.slug) }]
      : [{ name: "Segments", href: paths.segments(s) }]),
    ...getAncestors(s, path).map((c) => ({ name: c.name, href: link(c.path) })),
  ];
  const cols = category.attributes.filter((a) => a.comparable);
  const categoryIconClass = getCategoryFaIcon(category.slug);

  // Active brands for this segment/category (Section 2)
  const allProviders = getProvidersForSector(s);
  const offeringProviderSlugs = new Set(offerings.map((o) => o.provider));
  const segmentKey = path[0];

  const relevantProviders = allProviders.filter((p) => {
    if (offeringProviderSlugs.has(p.slug)) return true;
    if (s === "insurance") {
      if (segmentKey === "life") {
        return p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life");
      }
      if (segmentKey === "health" || segmentKey === "general") {
        return !p.type?.toLowerCase().includes("life") && !p.name?.toLowerCase().includes("life");
      }
    }
    return true;
  });

  const displayProviders = relevantProviders.length > 0 ? relevantProviders : allProviders;

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs items={crumbs} />

      {/* Category Hero Header matching product pages */}
      <div className="sector-hero">
        <div className="sector-hero__badge">
          <i className="fa-solid fa-circle-check text-[11px] text-[#047857]" aria-hidden="true" />
          <span>Verified Plan Segment</span>
        </div>
        <h1>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#FFF4EE",
              color: "#FF5A0A",
              fontSize: "1.35rem",
            }}
            aria-hidden="true"
          >
            <i className={`fa-solid ${categoryIconClass}`} />
          </span>
          <span>
            {category.name}
            {cityRec ? ` in ${cityRec.name}` : ""}
          </span>
        </h1>
        <p className="lead">
          {category.intro ??
            `Compare verified ${category.name.toLowerCase()} ${sector.labels.offerings.toLowerCase()} with statutory metrics.`}
        </p>
      </div>

      {needsCity && (
        <CityPicker
          title={`Choose a city for ${category.name}`}
          href={(c) => paths.cityCategory(s, c, path)}
        />
      )}

      {/* Granular Sub-categories / Children (4 cards per row) */}
      {children.length > 0 && (
        <section style={{ marginTop: "32px" }}>
          <div className="sector-section-header">
            <div>
              <h2>{levelLabel}s ({children.length})</h2>
              <p>Explore specialized plan options under {category.name}</p>
            </div>
          </div>
          <div className="grid-4">
            {children.map((c) => {
              const childIcon = getCategoryFaIcon(c.slug);
              return (
                <Link
                  key={c.slug}
                  className="card link-card"
                  href={link(c.path)}
                  style={{
                    minHeight: "135px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "#F4F7FB",
                          color: "#071B46",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.95rem",
                        }}
                        aria-hidden="true"
                      >
                        <i className={`fa-solid ${childIcon}`} />
                      </div>
                      <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                    </div>
                    <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>
                      {c.name}
                    </strong>
                  </div>
                  <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "8px" }}>
                    Compare {c.name.toLowerCase()} {sector.labels.offerings.toLowerCase()}
                  </small>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: ALL BRANDS IN THIS SEGMENT */}
      {displayProviders.length > 0 && (
        <section style={{ marginTop: "44px" }}>
          <div className="sector-section-header">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                <i className="fa-solid fa-building-shield" />
                <span>Section 2 &bull; Verified Brands</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                Active {sector.labels.providers} in {category.name} ({displayProviders.length})
              </h2>
              <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                Statutorily registered and audited brands offering {category.name.toLowerCase()} coverage
              </p>
            </div>
            <Link
              href={paths.brands(s)}
              className="btn btn--quiet btn--sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span>All {sector.labels.providers.toLowerCase()}</span>
              <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid-4">
            {displayProviders.map((p) => {
              const count = getOfferingsByProvider(s, p.slug).length;
              const isLife = p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life");
              return (
                <Link
                  key={p.slug}
                  href={paths.provider(s, p.slug)}
                  className="card link-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "135px",
                    padding: "20px",
                    borderRadius: "16px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: isLife ? "#027A48" : "#175CD3",
                          background: isLife ? "#ECFDF3" : "#EFF8FF",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {p.type || "Insurer"}
                      </span>
                      <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                    </div>
                    <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{p.name}</strong>
                  </div>
                  <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "12px" }}>
                    {count > 0 ? `${count} Audited Plans` : "Verified Provider Profile"}
                  </small>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: AUDITED OFFERINGS / PRODUCTS */}
      {offerings.length > 0 && (
        <section style={{ marginTop: "44px" }}>
          <div className="sector-section-header">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                <i className="fa-solid fa-file-shield" />
                <span>Section 3 &bull; Audited Products</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                Audited {sector.labels.offerings} ({offerings.length})
              </h2>
              <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                Verified statutory filings and transparency records for {category.name}
              </p>
            </div>
          </div>
          <div className="grid-4">
            {offerings.map((o) => (
              <OfferingCard key={o.provider + o.slug} offering={o} />
            ))}
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {sector.features.compare && offerings.length >= 2 && (
        <section
          className="card"
          style={{
            background: "#ffffff",
            border: "1px solid #DCE2EB",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "44px",
            boxShadow: "0 1px 3px rgba(7, 27, 70, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FFF4EE",
                color: "#FF5A0A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fa-solid fa-scale-balanced" aria-hidden="true" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#071B46", margin: 0 }}>
                Specification Comparison
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "#667085", margin: "2px 0 0 0" }}>
                Feature by feature side-by-side comparison across audited offerings
              </p>
            </div>
          </div>

          <div className="scroll">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ background: "#FAFBFD" }}>Specification</th>
                  {offerings.map((o) => (
                    <th key={o.slug} style={{ color: "#071B46" }}>
                      {o.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cols.map((a) => (
                  <tr key={a.key}>
                    <th>{a.label}</th>
                    {offerings.map((o) => (
                      <td key={o.slug}>{formatValue(a, o.attributes[a.key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FAQs */}
      {category.faqs.length > 0 && (
        <section
          className="card"
          style={{
            background: "#ffffff",
            border: "1px solid #DCE2EB",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "40px",
            boxShadow: "0 1px 3px rgba(7, 27, 70, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fa-solid fa-circle-question" aria-hidden="true" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#071B46", margin: 0 }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "#667085", margin: "2px 0 0 0" }}>
                Verified regulatory guidance and policy explanations
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {category.faqs.map((f) => (
              <details
                key={f.question}
                style={{
                  background: "#FAFBFD",
                  border: "1px solid #DCE2EB",
                  borderRadius: "12px",
                  padding: "14px 18px",
                }}
              >
                <summary style={{ fontWeight: 700, color: "#071B46", cursor: "pointer", fontSize: "0.9375rem" }}>
                  {f.question}
                </summary>
                <p style={{ color: "#46526B", fontSize: "0.875rem", lineHeight: "1.5", marginTop: "10px" }}>
                  {f.answer}
                </p>
              </details>
            ))}
          </div>

          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: category.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }}
          />
        </section>
      )}
    </div>
  );
}

/** Empty categories and city-required pages without a city are thin: keep them out of the index. */
export function categoryIsThin(s: string, path: string[], city?: string): boolean {
  const c = getCategory(s, path);
  if (!c) return true;
  if (c.location === "required" && !city) return true;
  return getOfferingsInCategory(s, path, city).length === 0 && getChildren(s, path).length === 0;
}
