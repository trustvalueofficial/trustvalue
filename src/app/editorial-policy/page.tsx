import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial policy | TrustValue",
  description: "How guides, answers and news on TrustValue are written, verified and corrected.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Editorial policy</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Integrity Standards</p>
        <h1>Editorial policy</h1>
        <p className="lead">
          Our standards for factual independence, legal citing, and editorial neutrality.
        </p>
      </header>

      <article className="prose">
        <h2>Primary sources only</h2>
        <p>
          We write exclusively from primary sources: registered policy contract wordings, IRDAI annual reports and circulars, and insurers&apos; statutory public disclosures. We do not rephrase aggregator marketing articles.
        </p>

        <h2>Author &amp; reviewer accountability</h2>
        <p>
          Every educational guide clearly names its author and an actuarial or legal reviewer with verified credentials.
        </p>

        <h2>Corrections</h2>
        <p>
          If an insurer updates a policy contract or an error is identified, corrections are updated transparently with change timestamps.
        </p>
      </article>
    </div>
  );
}
