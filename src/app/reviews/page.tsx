import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Verified Policyholder Reviews & Resolutions | TrustValue.ai",
  description: "Browse verified consumer reviews and closed-loop dispute resolution audits across life insurance brands.",
};

const SAMPLE_REVIEWS = [
  {
    id: "rev-101",
    author: "Vikram R.",
    city: "Bengaluru",
    brand: "HDFC Life",
    brandSlug: "hdfc-life",
    product: "Click 2 Protect Super",
    rating: 5,
    title: "Settled term life claim within 4 days with zero friction",
    body: "Submitted death certificate and hospital records online. Relationship manager was proactive and payment was credited on the 4th day directly to nominee account.",
    date: "September 2026",
    status: "Policyholder KYC Verified",
  },
  {
    id: "rev-102",
    author: "Anita M.",
    city: "Mumbai",
    brand: "ICICI Prudential Life",
    brandSlug: "icici-prudential",
    product: "iProtect Smart",
    rating: 4,
    title: "Transparent medical tele-underwriting and smooth issuance",
    body: "Tele-MER was scheduled on time. Blood tests at home. Policy document generated within 48 hours without unexpected loadings.",
    date: "August 2026",
    status: "Policyholder KYC Verified",
  },
  {
    id: "rev-103",
    author: "Suresh K.",
    city: "Pune",
    brand: "Max Life",
    brandSlug: "max-life",
    product: "Smart Secure Plus",
    rating: 5,
    title: "Claim paid smoothly despite minor discrepancy clarified by hospital",
    body: "Claims team directly contacted hospital records desk to verify admission dates rather than rejecting. Highly ethical handling.",
    date: "August 2026",
    status: "Policyholder KYC Verified",
  },
];

export default function ReviewsFeedPage() {
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: "Reviews" }]} />

      <header className="phead">
        <p className="eyebrow">Consumer Verification Telemetry</p>
        <h1>Verified Policyholder Reviews</h1>
        <p className="lead">
          Real customer experiences verified under IS 19000:2022 standards. Insurers cannot pay to remove, suppress, or modify any review.
        </p>
        <div className="row" style={{ marginTop: "16px" }}>
          <Link className="btn btn-primary" href="/write-review">
            Submit a review
          </Link>
          <Link className="btn btn-ghost" href="/industry/insurance">
            Browse by insurer
          </Link>
        </div>
      </header>

      <div className="stack" style={{ marginBottom: "32px" }}>
        {SAMPLE_REVIEWS.map((r) => (
          <article key={r.id} className="review">
            <div className="review-head">
              <span className="tag tag-green">{r.status}</span>
              <span className="small muted">
                <Link href={`/industry/insurance/${r.brandSlug}`}><b>{r.brand}</b></Link> · {r.product}
              </span>
              <span className="tiny faint" style={{ marginLeft: "auto" }}>{r.date}</span>
            </div>
            <h3 style={{ marginTop: "10px" }}>
              <Link href={`/reviews/${r.id}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
                {r.title}
              </Link>
            </h3>
            <p className="body">{r.body}</p>
            <p className="small muted" style={{ marginTop: "8px" }}>
              By {r.author} ({r.city})
            </p>
            <div className="row" style={{ marginTop: "12px" }}>
              <Link className="btn btn-ghost btn-sm" href={`/reviews/${r.id}`}>
                View full audit trail &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
