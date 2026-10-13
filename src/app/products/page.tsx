import Link from "next/link";
import { getAllIndustries } from "@/lib/data/industryData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export const metadata = {
  title: "Audited Insurance Policies & Plans | TrustValue.ai",
  description: "Browse verified life insurance products across Term Life, Savings, ULIP, and Retirement. Audited claim settlement speeds and authenticity ratings.",
};

export default function ProductsCatalogPage() {
  const industries = getAllIndustries();
  const insurance = industries.find((i) => i.slug === "insurance");
  const brands = insurance?.brands || [];

  const allProducts = brands.flatMap((b) =>
    b.products.map((p) => ({ ...p, brandName: b.name }))
  );

  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: "Products" }]} />

      <header className="phead">
        <p className="eyebrow">Product Catalog · Policy Telemetry</p>
        <h1>Audited Insurance Plans &amp; Products</h1>
        <p className="lead">
          Direct online plans audited for policy exclusions, claim turnaround speed, starting premiums, and verified customer sentiment.
        </p>
      </header>

      <div className="grid g2" style={{ marginBottom: "32px" }}>
        {allProducts.map((prod) => (
          <div key={prod.slug} className="card">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: "8px" }}>
              <span className="tag">
                {prod.category} · {prod.brandName}
              </span>
              <span className="tag tag-green">
                TrustScore: {prod.trustScore}/100
              </span>
            </div>

            <h2 style={{ fontSize: "1.25rem" }}>
              <Link
                href={`/industry/insurance/${prod.brandSlug}/${prod.slug}`}
                style={{ color: "var(--ink)", textDecoration: "none" }}
              >
                {prod.name}
              </Link>
            </h2>

            <div className="stack" style={{ marginTop: "12px", fontSize: "0.875rem" }}>
              <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                <span className="muted">Starting Premium:</span>
                <b>₹{prod.monthlyStartingPrice}/mo</b>
              </div>
              <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                <span className="muted">Claim Turnaround:</span>
                <b style={{ color: "var(--green)" }}>{prod.claimSettlementSpeedDays} Days</b>
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="muted">Verified Reviews:</span>
                <b>{prod.totalVerifiedReviews} reviews</b>
              </div>
            </div>

            <div className="row" style={{ marginTop: "16px" }}>
              <Link
                className="btn btn-primary btn-sm"
                href={`/industry/insurance/${prod.brandSlug}/${prod.slug}`}
              >
                View Plan
              </Link>
              <Link
                className="btn btn-ghost btn-sm"
                href={`/industry/insurance/${prod.brandSlug}/compare`}
              >
                Compare
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
