import type { Metadata } from "next";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";
import { getBlogs } from "@/lib/cms";
import { BlogListingClient } from "./BlogListingClient";

export const metadata: Metadata = meta(
  "TrustValue Research & Regulatory Guides",
  "In-depth consumer analyses, policyholder rights, statutory circular breakdowns, and sector audits.",
  paths.blog()
);

const FALLBACK_ARTICLES = [
  {
    slug: "irdai-3-year-incontestability-rule-explained",
    title: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    sector: "insurance",
    readTime: "6 min read",
    summary: "How the Insurance Act Section 45 protects nominees and makes life policies incontestable after 36 months.",
    status: "published",
    author: "Dr. Aris Thorne",
    body: "Under Section 45 of the Insurance Act 1938...",
  },
  {
    slug: "rera-carpet-area-vs-built-up-guide",
    title: "MahaRERA Carpet Area Standard: How to Avoid Paying for Balcony & Utility Air",
    sector: "real-estate",
    readTime: "8 min read",
    summary: "Clear guide on statutory carpet area measurements, RERA escrow protections, and penalty interest for delayed possession.",
    status: "published",
    author: "Kavita Rao",
    body: "Under RERA legislation across all Indian states...",
  },
  {
    slug: "nabh-cashless-hospital-turnaround-times",
    title: "Cashless Hospitalization Standards: What NABH Accreditations Mean for Your Discharge",
    sector: "healthcare",
    readTime: "5 min read",
    summary: "Step-by-step breakdown of cashless pre-authorization, TPA query resolution limits, and hospital repudiation appeals.",
    status: "published",
    author: "Dr. Sameer Joshi",
    body: "NABH and JCI accredited hospital networks...",
  },
];

export default function BlogPage() {
  const cmsArticles = getBlogs();
  const articles = cmsArticles.length > 0 ? cmsArticles : FALLBACK_ARTICLES;

  return <BlogListingClient articles={articles} />;
}
