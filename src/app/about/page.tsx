import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TrustValue | The Global Trust Index",
  description: "TrustValue publishes authenticity-weighted reviews of life insurers and plans in India, so people can see which promises are kept before they buy or claim.",
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">About</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">The Global Trust Index</p>
        <h1>About TrustValue</h1>
        <p className="lead">
          Turning genuine human experience into measurable, tamper-proof trust telemetry across consumer-critical sectors.
        </p>
      </header>

      <div className="body2">
        <article className="prose">
          <h2>What we do</h2>
          <p>
            We cover all 26 life insurers in India and their policies. Consumers review their actual experience; we weigh each submission for KYC verification and fraud forensics, and publish real-time TrustScores, grievance tracks, and contractual facts.
          </p>

          <h2>What we do not do</h2>
          <p>
            We do not sell insurance, quote broker premiums, or offer commissioned financial advice. Insurers cannot pay to influence scores, sponsor search placements, or suppress critical reviews.
          </p>

          <h2>Compliance and independence</h2>
          <p>
            TrustValue operates strictly under <b>IS 19000:2022</b> principles of review neutrality. Mathematical algorithms are open, consistent across every insurer, and audited against fraud rings.
          </p>
        </article>

        <aside className="rail stack">
          <div className="card card-mist">
            <h3>Learn our methodology</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              See the exact equations used to calculate TrustScores.
            </p>
            <Link className="btn btn-navy btn-sm" style={{ marginTop: "12px" }} href="/methodology">
              How TrustScores work
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
