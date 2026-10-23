"use client";

import React from "react";
import Link from "next/link";
import { paths } from "@/lib/routing";

export default function Footer() {
  return (
    <footer id="ftr" className="ftr" role="contentinfo">
      <div className="wrap">
        <div className="ftr-grid">
          <div style={{ gridColumn: "1 / -1", maxWidth: "560px" }}>
            <img
              className="ftr-logo"
              src="/brand/logo-full.webp"
              alt="TrustValue.ai, The Global Trust Index"
              width={173}
              height={34}
              style={{ height: "34px", width: "auto", marginBottom: "12px" }}
            />
            <p>
              Independent Bayesian trust scores and regulatory compliance auditing across 18 regulated consumer sectors in India.
              Not a broker, insurer, builder, or lender. Providers cannot pay for scores, ratings, or index placement.
            </p>
          </div>

          <div>
            <h2>Top Sectors</h2>
            <ul>
              <li><Link href={paths.sector("insurance")}>Life &amp; Health Insurance</Link></li>
              <li><Link href={paths.sector("banking")}>Banking &amp; Loans</Link></li>
              <li><Link href={paths.sector("healthcare")}>Hospitals &amp; Healthcare</Link></li>
              <li><Link href={paths.sector("real-estate")}>Real Estate &amp; Housing</Link></li>
              <li><Link href={paths.sector("automobiles")}>Automobiles &amp; EVs</Link></li>
              <li><Link href={paths.sector("electronics")}>Consumer Electronics</Link></li>
              <li><Link href={paths.sector("investments")}>Mutual Funds &amp; FDs</Link></li>
              <li><Link href={paths.sector("telecom")}>Telecom &amp; Broadband</Link></li>
            </ul>
          </div>

          <div>
            <h2>Insurance Directory</h2>
            <ul>
              <li><Link href={paths.provider("insurance", "hdfc-life")}>HDFC Life</Link></li>
              <li><Link href={paths.provider("insurance", "max-life")}>Max Life</Link></li>
              <li><Link href={paths.providers("insurance")}>All Insurers Directory</Link></li>
              <li><Link href={paths.category("insurance", ["life", "term-insurance"])}>Term Insurance</Link></li>
              <li><Link href={paths.category("insurance", ["health", "individual-health"])}>Health Insurance</Link></li>
              <li><Link href={paths.compareProviders("insurance", "hdfc-life-vs-max-life")}>Compare Insurers</Link></li>
              <li><Link href="/insurance#cities">City Cashless Desks</Link></li>
            </ul>
          </div>

          <div>
            <h2>Trust &amp; Telemetry</h2>
            <ul>
              <li><Link href={paths.rating()}>TrustScore Leaderboard</Link></li>
              <li><Link href={paths.reviews()}>Verified Consumer Reviews</Link></li>
              <li><Link href={paths.blog()}>Regulatory &amp; Research Desk</Link></li>
              <li><Link href={paths.blogPost("irdai-3-year-incontestability-rule-explained")}>IRDAI Section 45 Incontestability</Link></li>
              <li><Link href={paths.blogPost("rera-carpet-area-vs-built-up-guide")}>MahaRERA Carpet Area Standard</Link></li>
              <li><Link href={paths.blogPost("nabh-cashless-hospital-turnaround-times")}>NABH Cashless Standards</Link></li>
            </ul>
          </div>

          <div>
            <h2>Community &amp; Voice</h2>
            <ul>
              <li><Link href="/reviews">Browse Verified Telemetry</Link></li>
              <li><Link href="/#experience">Rate Your Experience</Link></li>
              <li><Link href="/#sectors">Pledge Vote for Next Sector</Link></li>
              <li><Link href="/#brands">Search Any Brand</Link></li>
              <li><Link href={paths.contact()}>Ombudsman Escalation</Link></li>
            </ul>
          </div>

          <div>
            <h2>Company &amp; Ethics</h2>
            <ul>
              <li><Link href={paths.about()}>About TrustValue</Link></li>
              <li><Link href={paths.rating()}>Scoring Methodology</Link></li>
              <li><Link href={paths.contact()}>Contact &amp; Grievances</Link></li>
              <li><Link href={paths.blog()}>Research Desk</Link></li>
            </ul>
          </div>

          <div>
            <h2>Institutional &amp; Legal</h2>
            <ul>
              <li><Link href={paths.about()}>Auditing Integrity Notice</Link></li>
              <li><Link href={paths.contact()}>Grievance Redressal Officer</Link></li>
              <li><Link href="/sitemap.xml">XML Sitemap</Link></li>
              <li><Link href={paths.rating()}>Bayesian Authenticity Model</Link></li>
            </ul>
          </div>
        </div>

        <div className="ftr-base">
          <span>
            &copy; {new Date().getFullYear()} TrustValue.ai, The Global Trust Index.
          </span>
          <span>
            Brand names belong to their respective statutory owners and identify reviewed providers. Operational ratios and statutory filings are derived from public disclosures from IRDAI, RBI, SEBI, RERA, and NABH.
          </span>
        </div>
      </div>
    </footer>
  );
}
