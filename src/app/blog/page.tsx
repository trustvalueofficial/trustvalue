import type { Metadata } from "next";
import Link from "next/link";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

export const metadata: Metadata = meta(
  "TrustValue Research & Regulatory Guides",
  "In-depth consumer analyses, policyholder rights, circular breakdowns, and sector audits.",
  paths.blog()
);

const ARTICLES = [
  {
    slug: "irdai-3-year-incontestability-rule-explained",
    title: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    sector: "Insurance",
    readTime: "6 min read",
    summary: "How the Insurance Act Section 45 protects nominees and makes life policies incontestable after 36 months.",
  },
  {
    slug: "rera-carpet-area-vs-built-up-guide",
    title: "MahaRERA Carpet Area Standard: How to Avoid Paying for Balcony & Utility Air",
    sector: "Real Estate",
    readTime: "8 min read",
    summary: "Clear guide on statutory carpet area measurements, RERA escrow protections, and penalty interest for delayed possession.",
  },
  {
    slug: "nabh-cashless-hospital-turnaround-times",
    title: "Cashless Hospitalization Standards: What NABH Accreditations Mean for Your Discharge",
    sector: "Healthcare",
    readTime: "5 min read",
    summary: "Step-by-step breakdown of cashless pre-authorization, TPA query resolution limits, and hospital repudiation appeals.",
  },
];

export default function BlogPage() {
  return (
    <>
      <h1>Research &amp; Regulatory Guides</h1>
      <p className="lead">
        Evidence-backed explainers, legal circular breakdowns, and consumer protection playbooks written by our research desk.
      </p>

      <div className="grid">
        {ARTICLES.map((a) => (
          <Link key={a.slug} href={paths.blogPost(a.slug)} className="card link-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="badge">{a.sector}</span>
              <small className="muted">{a.readTime}</small>
            </div>
            <strong>{a.title}</strong>
            <small>{a.summary}</small>
          </Link>
        ))}
      </div>
    </>
  );
}
