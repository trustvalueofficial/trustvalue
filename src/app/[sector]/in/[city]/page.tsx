import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OfferingCard } from "@/components/OfferingCard";
import {
  getChildren,
  getCities,
  getCity,
  getOfferingsInCity,
  getSector,
  getSectors,
} from "@/lib/cms";
import { getCategoryFaIcon, getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

type Props = { params: Promise<{ sector: string; city: string }> };
export const dynamicParams = false;

/** Only sectors whose location mode is not "none" get /in/[city] pages. */
export const generateStaticParams = () =>
  getSectors()
    .filter((s) => s.location !== "none")
    .flatMap((s) => getCities().map((c) => ({ sector: s.slug, city: c.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, city } = await params;
  const s = getSector(sector),
    c = getCity(city);
  if (!s || !c) return {};
  return meta(
    `${s.name} in ${c.name}`,
    `Audited ${s.name.toLowerCase()} providers, branches, and verified offerings in ${c.name}.`,
    paths.city(sector, city),
    getOfferingsInCity(sector, city).length > 0
  );
}

export default async function CityHub({ params }: Props) {
  const { sector: s, city } = await params;
  const sector = getSector(s),
    c = getCity(city);
  if (!sector || !c || sector.location === "none") notFound();

  const offerings = getOfferingsInCity(s, city);
  const categories = getChildren(s, []);
  const sectorIconClass = getSectorFaIcon(s);

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: c.name, href: paths.city(s, city) },
        ]}
      />

      {/* City Hero Header */}
      <div className="sector-hero">
        <div className="sector-hero__badge">
          <i className="fa-solid fa-location-dot text-[11px] text-[#FF5A0A]" aria-hidden="true" />
          <span>Local City Audit</span>
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
          <span>
            {sector.name} in {c.name}
          </span>
        </h1>
        <p className="lead">
          Verified {sector.name.toLowerCase()} providers, regional claim settlement records, and localized service turnarounds in {c.name}.
        </p>
      </div>

      {/* Plan Categories in this City (4 cards per row) */}
      {categories.length > 0 && (
        <section style={{ marginTop: "32px" }}>
          <div className="sector-section-header">
            <div>
              <h2>{sector.labels.levels[0]}s in {c.name} ({categories.length})</h2>
              <p>Explore localized plan categories available in {c.name}</p>
            </div>
          </div>
          <div className="grid-4">
            {categories.map((cat) => {
              const catIcon = getCategoryFaIcon(cat.slug);
              return (
                <Link
                  key={cat.slug}
                  href={paths.cityCategory(s, city, cat.path)}
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
                        <i className={`fa-solid ${catIcon}`} />
                      </div>
                      <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
                    </div>
                    <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block" }}>
                      {cat.name}
                    </strong>
                  </div>
                  <small style={{ color: "#667085", fontSize: "0.8125rem", marginTop: "8px" }}>
                    Browse {cat.name.toLowerCase()} in {c.name}
                  </small>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Audited Offerings in City (4 cards per row) */}
      {offerings.length > 0 && (
        <section style={{ marginTop: "44px" }}>
          <div className="sector-section-header">
            <div>
              <h2>{sector.labels.offerings} in {c.name} ({offerings.length})</h2>
              <p>Audited offerings with localized network and branch presence in {c.name}</p>
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
  );
}
