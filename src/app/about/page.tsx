import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { paths } from "@/lib/routing";

export const metadata: Metadata = meta(
  "About TrustValue",
  "Independent Bayesian TrustScores, regulatory auditing standards, and multi-vertical consumer intelligence.",
  paths.about()
);

export default function AboutPage() {
  return (
    <>
      <h1>About TrustValue</h1>
      <p className="lead">
        We provide independent, audited benchmarks across 18 regulated sectors in India — from insurance and banking to healthcare and real estate.
      </p>

      <section className="card">
        <h2>Our Core Principle</h2>
        <p>
          Every recommendation and TrustScore is algorithmically derived from verified customer settlements, regulatory complaints data (IRDAI, RBI, RERA, NABH), and evidence-backed audits. We never sell rankings or accept paid placement.
        </p>
      </section>

      <div className="stats">
        <div className="stat">
          <small>Sectors Audited</small>
          <strong>18 Industries</strong>
        </div>
        <div className="stat">
          <small>Authenticity Model</small>
          <strong>Bayesian Scored</strong>
        </div>
        <div className="stat">
          <small>Evidence Standard</small>
          <strong>Document Verified</strong>
        </div>
      </div>
    </>
  );
}
