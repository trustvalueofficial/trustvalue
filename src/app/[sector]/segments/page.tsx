import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OfferingCard } from "@/components/OfferingCard";
import { getCategories, getOfferings, getOfferingsByProvider, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { getCategoryFaIcon, getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getSectors().map((s) => ({ sector: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSector((await params).sector);
  return s
    ? meta(
        `All ${s.labels.levels[0]}s & Plans – ${s.name}`,
        `Explore all verified plan segments, categories, and products under ${s.name}.`,
        paths.segments(s.slug)
      )
    : {};
}

export default async function SegmentsPage({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const categories = getCategories(slug);
  const offerings = getOfferings(slug);
  const providers = getProvidersForSector(slug);
  const sectorIconClass = getSectorFaIcon(slug);

  const isInsurance = slug === "insurance";

  // Life segments: level 1 or 2 with path starting with 'life'
  const lifeSegments = isInsurance
    ? categories.filter((c) => c.path[0] === "life")
    : [];

  // General & Health segments: path starting with 'health' or 'general'
  const generalSegments = isInsurance
    ? categories.filter((c) => c.path[0] === "health" || c.path[0] === "general")
    : [];

  // Brands active in Life Insurance vs General & Health Insurance
  const lifeBrands = isInsurance
    ? providers.filter((p) => p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life"))
    : [];

  const generalBrands = isInsurance
    ? providers.filter((p) => !lifeBrands.some((l) => l.slug === p.slug))
    : [];

  // Offerings split
  const lifeOfferings = isInsurance
    ? offerings.filter((o) => o.primaryCategory.startsWith("life"))
    : offerings;

  const generalOfferings = isInsurance
    ? offerings.filter((o) => o.primaryCategory.startsWith("health") || o.primaryCategory.startsWith("general"))
    : [];

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(slug) },
          { name: "Segments", href: paths.segments(slug) },
        ]}
      />

      <div className="sector-hero" style={{ marginBottom: "28px" }}>
        <div className="sector-hero__badge">
          <i className="fa-solid fa-circle-check text-[11px] text-[#047857]" aria-hidden="true" />
          <span>Verified Plan Segments &amp; Audits</span>
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
            <i className={`fa-solid ${sectorIconClass}`} />
          </span>
          <span>All {sector.labels.levels[0]}s &amp; Products ({categories.length})</span>
        </h1>
        <p className="lead">
          Explore verified consumer plan segments, active brands, and statutorily benchmarked products under {sector.name}.
        </p>

        {/* Directory Switcher Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
          <span
            style={{
              padding: "7px 18px",
              borderRadius: "9999px",
              background: "#071B46",
              color: "#FFFFFF",
              fontSize: "0.875rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="fa-solid fa-layer-group text-xs" />
            <span>Segments Directory ({categories.length})</span>
          </span>
          <Link
            href={paths.brands(slug)}
            style={{
              padding: "7px 18px",
              borderRadius: "9999px",
              background: "#F2F4F7",
              color: "#344054",
              fontSize: "0.875rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
            className="hover:bg-[#E4E7EC]"
          >
            <i className="fa-solid fa-building-shield text-xs text-[#98A2B3]" />
            <span>View All Brands ({providers.length})</span>
          </Link>
        </div>
      </div>

      {isInsurance ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
          {/* SECTION 1: LIFE INSURANCE SEGMENTS & BRANDS */}
          <section id="life-segments">
            <div className="sector-section-header" style={{ marginBottom: "20px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  <i className="fa-solid fa-shield-heart" />
                  <span>Section 1 &bull; Life Insurance</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                  Life Insurance Segments &amp; Categories ({lifeSegments.length})
                </h2>
                <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                  Pure risk term life, unit-linked investment policies (ULIPs), guaranteed savings, and retirement annuity categories.
                </p>
              </div>
            </div>

            {/* Segment Cards */}
            <div className="grid-4" style={{ marginBottom: "28px" }}>
              {lifeSegments.map((c) => {
                const iconClass = getCategoryFaIcon(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={paths.category(slug, c.path)}
                    className="card link-card"
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
                            background: "#ECFDF3",
                            color: "#027A48",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.95rem",
                          }}
                          aria-hidden="true"
                        >
                          <i className={`fa-solid ${iconClass}`} />
                        </div>
                        <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                      </div>
                      <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{c.name}</strong>
                    </div>
                    <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "8px" }}>
                      Compare {c.name.toLowerCase()} plans
                    </small>
                  </Link>
                );
              })}
            </div>

            {/* Life Brands Registry (Section 2 in Life) */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#071B46" }}>
                  Active Life Insurance Brands ({lifeBrands.length})
                </h3>
                <Link href={`${paths.brands(slug)}#life-insurers`} className="text-xs font-bold text-[#FF5A0A] hover:underline">
                  All Life Brands &rarr;
                </Link>
              </div>
              <div className="chips" style={{ gap: "8px" }}>
                {lifeBrands.map((p) => (
                  <Link
                    key={p.slug}
                    href={paths.provider(slug, p.slug)}
                    className="chip"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                  >
                    <i className="fa-solid fa-shield-heart text-xs text-[#027A48]" />
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Life Plans (Section 3 in Life) */}
            {lifeOfferings.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#071B46", marginBottom: "14px" }}>
                  Audited Life Insurance Plans ({lifeOfferings.length})
                </h3>
                <div className="grid-4">
                  {lifeOfferings.map((o) => (
                    <OfferingCard key={o.provider + o.slug} offering={o} />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2: GENERAL & HEALTH INSURANCE SEGMENTS & BRANDS */}
          <section id="general-segments" style={{ paddingTop: "32px", borderTop: "1px solid #EAECF0" }}>
            <div className="sector-section-header" style={{ marginBottom: "20px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  <i className="fa-solid fa-heart-pulse" />
                  <span>Section 2 &bull; General &amp; Health</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                  General &amp; Health Insurance Segments ({generalSegments.length})
                </h2>
                <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                  Comprehensive mediclaim hospitalization, family floater, motor vehicle, international travel, and property plans.
                </p>
              </div>
            </div>

            {/* Segment Cards */}
            <div className="grid-4" style={{ marginBottom: "28px" }}>
              {generalSegments.map((c) => {
                const iconClass = getCategoryFaIcon(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={paths.category(slug, c.path)}
                    className="card link-card"
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
                            background: "#EFF8FF",
                            color: "#175CD3",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.95rem",
                          }}
                          aria-hidden="true"
                        >
                          <i className={`fa-solid ${iconClass}`} />
                        </div>
                        <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                      </div>
                      <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{c.name}</strong>
                    </div>
                    <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "8px" }}>
                      Compare {c.name.toLowerCase()} plans
                    </small>
                  </Link>
                );
              })}
            </div>

            {/* General Brands Registry (Section 2 in General) */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#071B46" }}>
                  Active General &amp; Health Insurance Brands ({generalBrands.length})
                </h3>
                <Link href={`${paths.brands(slug)}#general-insurers`} className="text-xs font-bold text-[#FF5A0A] hover:underline">
                  All General Brands &rarr;
                </Link>
              </div>
              <div className="chips" style={{ gap: "8px" }}>
                {generalBrands.map((p) => (
                  <Link
                    key={p.slug}
                    href={paths.provider(slug, p.slug)}
                    className="chip"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                  >
                    <i className="fa-solid fa-heart-pulse text-xs text-[#175CD3]" />
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured General & Health Plans (Section 3 in General) */}
            {generalOfferings.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#071B46", marginBottom: "14px" }}>
                  Audited General &amp; Health Insurance Plans ({generalOfferings.length})
                </h3>
                <div className="grid-4">
                  {generalOfferings.map((o) => (
                    <OfferingCard key={o.provider + o.slug} offering={o} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div>
          <div className="grid-4" style={{ marginBottom: "36px" }}>
            {categories.map((c) => {
              const iconClass = getCategoryFaIcon(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={paths.category(slug, c.path)}
                  className="card link-card"
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
                        <i className={`fa-solid ${iconClass}`} />
                      </div>
                      <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                    </div>
                    <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{c.name}</strong>
                  </div>
                  <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "8px" }}>
                    Compare {c.name.toLowerCase()} {sector.labels.offerings.toLowerCase()}
                  </small>
                </Link>
              );
            })}
          </div>

          {/* Fallback Section 2: Active Brands / Providers */}
          {providers.length > 0 && (
            <section style={{ marginTop: "44px" }}>
              <div className="sector-section-header">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    <i className="fa-solid fa-building-shield" />
                    <span>Section 2 &bull; Active Brands</span>
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                    All Regulated {sector.labels.providers} ({providers.length})
                  </h2>
                </div>
                <Link href={paths.brands(slug)} className="btn btn--quiet btn--sm">
                  <span>View All Brands</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
              <div className="grid-4">
                {providers.map((p) => {
                  const count = getOfferingsByProvider(slug, p.slug).length;
                  return (
                    <Link
                      key={p.slug}
                      href={paths.provider(slug, p.slug)}
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
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#46526B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {p.type || "Provider"}
                          </span>
                          <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" />
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

          {/* Fallback Section 3: Audited Products & Plans */}
          {offerings.length > 0 && (
            <section style={{ marginTop: "44px" }}>
              <div className="sector-section-header">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    <i className="fa-solid fa-file-shield" />
                    <span>Section 3 &bull; Audited Products</span>
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                    All Audited {sector.labels.offerings} ({offerings.length})
                  </h2>
                </div>
              </div>
              <div className="grid-4">
                {offerings.map((o) => (
                  <OfferingCard key={o.provider + o.slug} offering={o} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
