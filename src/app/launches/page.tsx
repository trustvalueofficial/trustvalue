import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Clock, FileCheck } from "lucide-react";

export const metadata = {
  title: "New Launches & Product Filings — TrustValue.ai",
  description: "Track the newest life insurance products registered with IRDAI undergoing Bayesian early access trust benchmarking.",
};

const NEW_LAUNCHES = [
  {
    slug: "hdfc-life-click-2-protect-super",
    brand: "HDFC Life",
    brandSlug: "hdfc-life",
    title: "Click 2 Protect Super",
    category: "Term Insurance",
    uin: "101N145V01",
    status: "Audit in progress",
    date: "Registered Q1 2026",
    summary: "Flexible sum assured re-balancing across critical illness and terminal illness riders.",
  },
  {
    slug: "lic-amritbaal-plan",
    brand: "LIC of India",
    brandSlug: "lic",
    title: "Amritbaal Plan 874",
    category: "Savings Plan",
    uin: "512N365V01",
    status: "Early access",
    date: "Registered Q1 2026",
    summary: "Higher guaranteed additions designed for child higher education funding.",
  },
  {
    slug: "tata-aia-param-rakshak-elite",
    brand: "Tata AIA",
    brandSlug: "tata-aia",
    title: "Param Rakshak Elite",
    category: "ULIP",
    uin: "110L149V02",
    status: "Audit in progress",
    date: "Registered Q4 2025",
    summary: "High-value wealth generation plan with zero premium allocation charges after Year 5.",
  },
  {
    slug: "sbi-life-smart-scholar-plus",
    brand: "SBI Life",
    brandSlug: "sbi-life",
    title: "Smart Scholar Plus",
    category: "Savings Plan",
    uin: "111N151V01",
    status: "Early access",
    date: "Registered Q4 2025",
    summary: "Dual benefit life cover with built-in premium waiver upon unfortunate event.",
  },
];

export default function LaunchesPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">New Launches</span></li>
        </ol>
      </nav>

      <header className="phead">
        <div className="kicker">
          <span className="tag tag-amber">IRDAI Registry Tracker</span>
          <span className="tag tag-navy">Early Access</span>
        </div>
        <h1 style={{ marginTop: "12px" }}>New Insurance Launches</h1>
        <p className="lead" style={{ marginTop: "10px" }}>
          Every newly registered life insurance policy undergoing contract wording audits, exclusion scrutiny, and early Bayesian trust score computation.
        </p>
      </header>

      <div className="grid g2" style={{ marginTop: "32px" }}>
        {NEW_LAUNCHES.map((plan) => (
          <div key={plan.slug} className="card stack" style={{ position: "relative" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="tag tag-line">{plan.category}</span>
              <span className="tag tag-green">{plan.status}</span>
            </div>
            <h3 style={{ marginTop: "8px" }}>
              <Link href={`/launches/${plan.slug}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
                {plan.title}
              </Link>
            </h3>
            <p className="small muted">
              Offered by <Link href={`/industry/insurance/${plan.brandSlug}`}>{plan.brand}</Link> · UIN: {plan.uin}
            </p>
            <p className="small" style={{ color: "var(--text)" }}>{plan.summary}</p>
            <div className="row" style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
              <span className="tiny faint">{plan.date}</span>
              <Link className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} href={`/launches/${plan.slug}`}>
                View Audit Checklist →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
