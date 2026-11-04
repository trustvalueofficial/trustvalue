import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getOfferingsByProvider, getProvidersForSector, getSector, getSectors } from "@/lib/cms";
import { getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getSectors().map((s) => ({ sector: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSector((await params).sector);
  return s ? meta(`All ${s.labels.providers.toLowerCase()} – ${s.name}`, `Every ${s.labels.provider.toLowerCase()} in ${s.name}.`, paths.providers(s.slug)) : {};
}

export default async function ProvidersPage({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();
  const providers = getProvidersForSector(slug);
  const sectorIconClass = getSectorFaIcon(slug);

  // Split brands into 2 sections for Insurance (Life vs General & Health)
  const isInsurance = slug === "insurance";
  
  const lifeBrands = isInsurance
    ? providers.filter((p) => p.type?.toLowerCase().includes("life") || p.name?.toLowerCase().includes("life"))
    : [];

  const generalBrands = isInsurance
    ? providers.filter((p) => !lifeBrands.some((l) => l.slug === p.slug))
    : [];

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(slug) },
          { name: "Brands", href: paths.brands(slug) },
        ]}
      />

      <div className="sector-hero" style={{ marginBottom: "28px" }}>
        <div className="sector-hero__badge">
          <i className="fa-solid fa-circle-check text-[11px] text-[#047857]" aria-hidden="true" />
          <span>Statutory Registry &amp; Verified Directory</span>
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
          <span>All Regulated {sector.labels.providers} ({providers.length})</span>
        </h1>
        <p className="lead">
          Every statutorily registered and audited {sector.labels.provider.toLowerCase()} operating in {sector.name}, categorized by operational license.
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
            <i className="fa-solid fa-building-shield text-xs" />
            <span>Brands Directory ({providers.length})</span>
          </span>
          <Link
            href={paths.segments(slug)}
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
            <i className="fa-solid fa-layer-group text-xs text-[#98A2B3]" />
            <span>View Plan Segments</span>
          </Link>
        </div>
      </div>

      {isInsurance ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {/* SECTION 1: LIFE INSURANCE BRANDS */}
          <section id="life-insurers">
            <div className="sector-section-header" style={{ marginBottom: "20px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  <i className="fa-solid fa-shield-heart" />
                  <span>Section 1 &bull; Life Insurance</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                  Life Insurance Brands ({lifeBrands.length})
                </h2>
                <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                  IRDAI-registered life insurers offering term plans, savings policies, ULIPs, and retirement annuities.
                </p>
              </div>
            </div>

            <div className="grid-4">
              {lifeBrands.map((p) => {
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
          </section>

          {/* SECTION 2: GENERAL & HEALTH INSURANCE BRANDS */}
          <section id="general-insurers" style={{ paddingTop: "24px", borderTop: "1px solid #EAECF0" }}>
            <div className="sector-section-header" style={{ marginBottom: "20px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF5A0A", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  <i className="fa-solid fa-heart-pulse" />
                  <span>Section 2 &bull; General &amp; Health</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#071B46" }}>
                  General &amp; Health Insurance Brands ({generalBrands.length})
                </h2>
                <p style={{ color: "#667085", fontSize: "0.9375rem" }}>
                  Licensed non-life &amp; standalone health insurers offering mediclaim, motor, travel, and personal property protection.
                </p>
              </div>
            </div>

            <div className="grid-4">
              {generalBrands.map((p) => {
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
          </section>
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
    </div>
  );
}
