import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectorCard } from "@/components/SectorCard";
import { getCategories, getProvidersForSector, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

export const metadata: Metadata = meta(
  "All Consumer Sectors – TrustValue",
  "Explore all 18 regulated consumer sectors with verified audits, statutory ratios, and independent trust telemetry.",
  "/sectors"
);

export default function AllSectorsPage() {
  const sectors = getSectors();

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: "All Sectors", href: "/sectors" },
        ]}
      />

      <div className="sector-hero">
        <div className="sector-hero__badge">
          <i className="fa-solid fa-circle-check text-[11px] text-[#047857]" aria-hidden="true" />
          <span>Independent Telemetry Across India</span>
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
            <i className="fa-solid fa-shapes" />
          </span>
          <span>All Regulated Consumer Sectors</span>
        </h1>
        <p className="lead">
          Explore all 18 consumer-critical industries mapped with verified statutory records, IRDAI/RBI filings, Ombudsman dispute ratios, and transparent customer telemetry.
        </p>
      </div>

      <div className="sector-section-header">
        <div>
          <h2>Monitored Industry Sectors ({sectors.length})</h2>
          <p>Four cards per row. Click any sector to view verified segments, providers, and audit metrics.</p>
        </div>
      </div>

      <div className="sectors-grid-4">
        {sectors.map((s) => {
          const providers = getProvidersForSector(s.slug);
          const categories = getCategories(s.slug);
          return (
            <SectorCard
              key={s.slug}
              sector={s}
              providerCount={providers.length}
              categoryCount={categories.length}
            />
          );
        })}
      </div>
    </div>
  );
}
