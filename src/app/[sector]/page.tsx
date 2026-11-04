import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CityPicker } from "@/components/CityPicker";
import { OfferingCard } from "@/components/OfferingCard";
import { SectorCard } from "@/components/SectorCard";
import {
  getCategories,
  getChildren,
  getOfferings,
  getOfferingsByProvider,
  getProvidersForSector,
  getSector,
  getSectors,
} from "@/lib/cms";
import { getCategoryFaIcon, getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getSectors().map((s) => ({ sector: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSector((await params).sector);
  return s ? meta(s.name, s.description, paths.sector(s.slug)) : {};
}

export default async function SectorHub({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const allSectors = getSectors();
  const allCategories = getCategories(slug);

  // Granular segments (level 2 sub-categories) so all segments are present
  const subSegments = allCategories.filter((c) => c.level === 2);
  const displaySegments = subSegments.length > 0 ? subSegments : allCategories;

  // All providers in this sector (29 insurers)
  const providers = getProvidersForSector(slug);

  // All audited offerings / products in this sector
  const offerings = getOfferings(slug);

  const sectorIconClass = getSectorFaIcon(slug);

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Breadcrumbs matching product pages */}
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: "All Sectors", href: "/sectors" },
          { name: sector.name, href: paths.sector(slug) },
        ]}
      />

      {/* Sector Hero Header */}
      <div className="sector-hero">
        <div className="sector-hero__badge">
          <i className="fa-solid fa-circle-check text-[11px] text-[#047857]" aria-hidden="true" />
          <span>Statutorily Monitored Sector</span>
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
          <span>{sector.name}</span>
        </h1>
        <p className="lead">{sector.description}</p>
      </div>

      {/* ALL SEGMENTS (4 cards per row) */}
      <section>
        <div className="sector-section-header">
          <div>
            <h2>All {sector.labels.levels[0]}s &amp; Categories ({displaySegments.length})</h2>
            <p>Explore all verified consumer plan segments under {sector.name}</p>
          </div>
          <Link
            href={paths.segments(slug)}
            className="btn btn--quiet btn--sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>View 2 Segment Sections</span>
            <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid-4">
          {displaySegments.map((c) => {
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
      </section>

      {sector.location !== "none" && (
        <div id="cities" style={{ marginTop: "24px" }}>
          <CityPicker
            title={sector.location === "required" ? "Choose your city" : "Browse by city"}
            href={(c) => paths.city(slug, c)}
          />
        </div>
      )}

      {/* SECTION 2: ALL REGULATED BRANDS / PROVIDERS (2 SECTIONS FOR INSURANCE) */}
      {providers.length > 0 && (
        <section style={{ marginTop: "48px" }}>
          <div className="sector-section-header">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                <i className="fa-solid fa-building-shield" />
                <span>Section 2 &bull; Verified Brands</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                All Regulated {sector.labels.providers} ({providers.length})
              </h2>
              <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                Every statutorily registered and audited provider active in {sector.name}
              </p>
            </div>
            <Link
              href={paths.brands(slug)}
              className="btn btn--quiet btn--sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span>Full Brands Directory</span>
              <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
            </Link>
          </div>

          {slug === "insurance" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {/* SECTION 2A: LIFE INSURANCE BRANDS */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#027A48", background: "#ECFDF3", padding: "4px 10px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Life Insurers ({providers.filter((p) => p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life")).length})
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#667085" }}>Term, ULIP, savings &amp; retirement</span>
                  </div>
                  <Link href={`${paths.brands(slug)}#life-insurers`} style={{ fontSize: "0.8125rem", color: "#FF5A0A", fontWeight: 600 }}>
                    View all {providers.filter((p) => p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life")).length} life brands &rarr;
                  </Link>
                </div>
                <div className="grid-4">
                  {providers
                    .filter((p) => p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life"))
                    .slice(0, 8)
                    .map((p) => {
                      const offeringCount = getOfferingsByProvider(slug, p.slug).length;
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
                              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#027A48", background: "#ECFDF3", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Life Insurer
                              </span>
                              <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                            </div>
                            <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{p.name}</strong>
                          </div>
                          <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "12px" }}>
                            {offeringCount > 0 ? `${offeringCount} Audited Plans` : "Verified Provider Profile"}
                          </small>
                        </Link>
                      );
                    })}
                </div>
              </div>

              {/* SECTION 2B: GENERAL & HEALTH BRANDS */}
              <div style={{ paddingTop: "20px", borderTop: "1px solid #EAECF0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#175CD3", background: "#EFF8FF", padding: "4px 10px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      General &amp; Health Insurers ({providers.filter((p) => !p.type?.toLowerCase().includes("life") && !p.name?.toLowerCase().includes("life")).length})
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#667085" }}>Health, motor, travel &amp; property</span>
                  </div>
                  <Link href={`${paths.brands(slug)}#general-insurers`} style={{ fontSize: "0.8125rem", color: "#FF5A0A", fontWeight: 600 }}>
                    View all {providers.filter((p) => !p.type?.toLowerCase().includes("life") && !p.name?.toLowerCase().includes("life")).length} general brands &rarr;
                  </Link>
                </div>
                <div className="grid-4">
                  {providers
                    .filter((p) => !p.type?.toLowerCase().includes("life") && !p.name?.toLowerCase().includes("life"))
                    .slice(0, 8)
                    .map((p) => {
                      const offeringCount = getOfferingsByProvider(slug, p.slug).length;
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
                              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#175CD3", background: "#EFF8FF", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                General / Health
                              </span>
                              <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                            </div>
                            <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{p.name}</strong>
                          </div>
                          <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "12px" }}>
                            {offeringCount > 0 ? `${offeringCount} Audited Plans` : "Verified Provider Profile"}
                          </small>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid-4">
              {providers.map((p) => {
                const offeringCount = getOfferingsByProvider(slug, p.slug).length;
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
                        <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                      </div>
                      <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>{p.name}</strong>
                    </div>
                    <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "12px" }}>
                      {offeringCount > 0 ? `${offeringCount} Audited Plans` : "Verified Provider Profile"}
                    </small>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* SECTION 3: ALL AUDITED PRODUCTS & PLANS */}
      {offerings.length > 0 && (
        <section style={{ marginTop: "48px" }}>
          <div className="sector-section-header">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                <i className="fa-solid fa-file-shield" />
                <span>Section 3 &bull; Audited Products</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                All Audited {sector.labels.offerings} ({offerings.length})
              </h2>
              <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                Complete directory of statutorily audited products and plans in {sector.name}
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

      {sector.watch && (
        <p className="note" style={{ marginTop: "32px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <i className="fa-solid fa-triangle-exclamation text-[#FF5A0A] mt-0.5" aria-hidden="true" />
          <span>
            <strong>Sector invariant to watch:</strong> {sector.watch}
          </span>
        </p>
      )}

      {/* ALL CONSUMER SECTORS (18) */}
      <section style={{ marginTop: "52px", paddingTop: "36px", borderTop: "1px solid #DCE2EB" }}>
        <div className="sector-section-header">
          <div>
            <h2>All Regulated Consumer Sectors ({allSectors.length})</h2>
            <p>Explore independent trust telemetry and statutory audits across all industries</p>
          </div>
          <Link
            href="/sectors"
            className="btn btn--quiet btn--sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>View All Sectors</span>
            <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
          </Link>
        </div>
        <div className="sectors-grid-4">
          {allSectors.map((s) => (
            <SectorCard
              key={s.slug}
              sector={s}
              isCurrent={s.slug === slug}
              providerCount={getProvidersForSector(s.slug).length}
              categoryCount={getChildren(s.slug, []).length}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
