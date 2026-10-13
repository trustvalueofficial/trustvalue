import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community rules & review standards | TrustValue",
  description: "What you can post on TrustValue, authenticity verification, and our strict anti-defamation rules.",
};

export default function GuidelinesPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Community rules</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Trust &amp; Safety</p>
        <h1>Community guidelines</h1>
        <p className="lead">
          Rules for policyholder reviews, evidence submission, and fair public disputes.
        </p>
      </header>

      <article className="prose">
        <h2>Post your authentic experience</h2>
        <p>
          Reviews and dispute filings must reflect your firsthand experience with the insurer or policy. Do not submit hypothetical or second-hand commentary.
        </p>

        <h2>Keep private identifiers confidential</h2>
        <p>
          Do not include Aadhaar numbers, PAN details, bank account numbers, or personal phone numbers in public review text.
        </p>

        <h2>Zero tolerance for paid incentives</h2>
        <p>
          Insurers, agents, and marketing agencies are strictly prohibited from offering gift cards, discounts, or incentives in exchange for positive reviews.
        </p>
      </article>
    </div>
  );
}
