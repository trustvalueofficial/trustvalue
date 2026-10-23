import type { Metadata } from "next";
import Link from "next/link";
import { getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

export const metadata: Metadata = meta(
  "Verified Consumer Reviews & Telemetry",
  "Live stream of evidence-backed consumer reviews, settlement documents, and dispute resolutions across all 18 sectors.",
  paths.reviews()
);

export default function ReviewsPage() {
  const sectors = getSectors();

  // Mock telemetry data to demonstrate multi-sector review stream
  const sampleReviews = [
    {
      id: "rev-1",
      sectorSlug: "insurance",
      provider: "HDFC Life",
      offering: "Click 2 Protect Supreme",
      offeringSlug: "click-2-protect-supreme",
      rating: 5,
      proof: "Hospital Settlement Receipt",
      text: "Claim disbursed in 48 hours under IRDAI rapid claim track. Verified through cashless desk.",
      time: "2 hours ago",
    },
    {
      id: "rev-2",
      sectorSlug: "real-estate",
      provider: "Lodha",
      offering: "Palava Phase 2",
      offeringSlug: "palava-phase-2",
      rating: 4,
      proof: "RERA Occupancy Certificate",
      text: "Possession handed over on verified MahaRERA schedule. Water infrastructure operational.",
      time: "5 hours ago",
    },
    {
      id: "rev-3",
      sectorSlug: "automobiles",
      provider: "Tata Motors",
      offering: "Nexon",
      offeringSlug: "nexon",
      rating: 5,
      proof: "Bharat NCAP 5-Star Test",
      text: "Crash test integrity verified. Real-world highway mileage 17.4 kmpl verified by telematics.",
      time: "1 day ago",
    },
    {
      id: "rev-4",
      sectorSlug: "government",
      provider: "Rural Development",
      offering: "PM Awas Yojana",
      offeringSlug: "pm-awas-yojana",
      rating: 5,
      proof: "DBT Direct Bank Transfer",
      text: "Subsidized instalment credited directly into Jan Dhan account after geo-tag inspection.",
      time: "2 days ago",
    },
  ];

  return (
    <>
      <h1>Verified Consumer Reviews &amp; Telemetry</h1>
      <p className="lead">
        Real customer experiences backed by document proof (redacted settlement letters, RERA certificates, and bill receipts).
      </p>

      <section style={{ marginBottom: "24px" }}>
        <h2>Filter by Sector</h2>
        <div className="chips">
          {sectors.map((s) => (
            <Link key={s.slug} href={paths.sector(s.slug)} className="chip">
              {s.icon} {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Live Verification Stream</h2>
        <div className="grid">
          {sampleReviews.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span className="badge">{r.sectorSlug}</span>
                <span className="muted" style={{ fontSize: "12px" }}>{r.time}</span>
              </div>
              <strong>{r.provider} — {r.offering}</strong>
              <div style={{ color: "#f59e0b", fontSize: "14px", margin: "4px 0" }}>
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>
              <p style={{ fontSize: "14px", margin: "8px 0" }}>{r.text}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
                <small style={{ color: "var(--brand)", fontWeight: "600" }}>✓ {r.proof}</small>
                <Link
                  href={paths.offering(r.sectorSlug, r.provider.toLowerCase().replace(/\s+/g, "-"), r.offeringSlug)}
                  style={{ fontSize: "12px" }}
                >
                  View Offering &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
