import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";
import { getBlog, getBlogs, BlogArticle } from "@/lib/cms";
import { BlogPostClient } from "./BlogPostClient";

const FALLBACK_ARTICLES: Record<string, BlogArticle> = {
  "irdai-3-year-incontestability-rule-explained": {
    slug: "irdai-3-year-incontestability-rule-explained",
    title: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    sector: "insurance",
    readTime: "6 min read",
    summary: "How the Insurance Act Section 45 protects nominees and makes life policies incontestable after 36 months.",
    directAnswer: "Under Section 45 of the Insurance Act 1938, once a life insurance policy completes 3 consecutive years from issuance or revival, the insurer is legally barred from questioning or rejecting any death claim on ANY ground, including fraud or non-disclosure of medical facts.",
    body: "Under Section 45 of the Insurance Act 1938 (amended in 2015), no policy of life insurance can be called in question on any ground whatsoever, including fraud or non-disclosure of material facts, after the expiry of three continuous years from the date of issuance or revival.\n\n### Key Protections Under Section 45:\n1. Absolute Incontestability: Once 36 continuous months lapse, the insurer forfeits the legal right to repudiate a death claim.\n2. Shifted Burden of Proof: During the first 3 years, the insurer bears strict legal burden to prove deliberate, material misstatement.\n3. Nominee Safeguards: Eliminates harassment of surviving beneficiaries during claim settlement periods.",
    status: "published",
    author: "Dr. Aris Thorne",
    publishedAt: "2026-03-20T14:30:00.000Z",
    faqData: [
      {
        question: "Can an insurer repudiate a claim after 3 years if fraud is discovered?",
        answer: "No. Under the amended Section 45 (effective 2015), the 3-year bar is absolute. Even if intentional fraud or omission is alleged, no repudiation is legally permissible once 36 continuous months pass.",
      },
      {
        question: "Does the 3-year clock reset if the policy lapses and is subsequently revived?",
        answer: "Yes. If a policy lapses due to non-payment of premiums and is later revived, the 3-year period begins afresh from the official date of revival.",
      },
    ],
  },
  "rera-carpet-area-vs-built-up-guide": {
    slug: "rera-carpet-area-vs-built-up-guide",
    title: "MahaRERA Carpet Area Standard: How to Avoid Paying for Balcony & Utility Air",
    sector: "real-estate",
    readTime: "8 min read",
    summary: "Clear guide on statutory carpet area measurements, RERA escrow protections, and penalty interest for delayed possession.",
    directAnswer: "Under RERA legislation, developers are legally obligated to quote and sell units strictly based on RERA Net Usable Carpet Area. Selling on super built-up area or loaded square footage is a punishable statutory violation across all Indian jurisdictions.",
    body: "Under RERA legislation across all Indian states, builders are legally prohibited from selling apartments on super built-up or loaded square footage. Every transaction must be calculated exclusively on usable net carpet area.",
    status: "published",
    author: "Kavita Rao",
    publishedAt: "2026-04-02T11:00:00.000Z",
  },
  "nabh-cashless-hospital-turnaround-times": {
    slug: "nabh-cashless-hospital-turnaround-times",
    title: "Cashless Hospitalization Standards: What NABH Accreditations Mean for Your Discharge",
    sector: "healthcare",
    readTime: "5 min read",
    summary: "Step-by-step breakdown of cashless pre-authorization, TPA query resolution limits, and hospital repudiation appeals.",
    directAnswer: "IRDAI Master Circular mandates that insurance TPAs must grant initial cashless pre-authorization within 60 minutes and finalize discharge clearance within 180 minutes of hospital billing submission.",
    body: "NABH and JCI accredited hospital networks adhere to strict turnaround protocols for insurer cashless desk coordination. Learn how patient discharge settlement times are capped under standard regulatory operating procedures.",
    status: "published",
    author: "Dr. Sameer Joshi",
    publishedAt: "2026-05-12T16:20:00.000Z",
  },
};

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => {
  const dynamicSlugs = getBlogs().map((b) => ({ slug: b.slug }));
  const fallbackSlugs = Object.keys(FALLBACK_ARTICLES).map((slug) => ({ slug }));
  return dynamicSlugs.length > 0 ? dynamicSlugs : fallbackSlugs;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog(slug) || FALLBACK_ARTICLES[slug];
  if (!post) return {};
  return meta(
    post.seo?.title || post.title,
    post.seo?.description || post.summary,
    paths.blogPost(slug)
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const allArticles = getBlogs();
  const post = getBlog(slug) || FALLBACK_ARTICLES[slug];
  if (!post) notFound();

  // Find related articles (same sector or relatedSlugs)
  const relatedArticles = allArticles.filter(
    (a) => a.slug !== post.slug && (a.sector === post.sector || post.relatedSlugs?.includes(a.slug))
  ).slice(0, 3);

  return <BlogPostClient post={post} relatedArticles={relatedArticles} />;
}
