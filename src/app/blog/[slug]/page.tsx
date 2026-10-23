import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

const ARTICLES: Record<string, { title: string; sector: string; readTime: string; summary: string; body: string }> = {
  "irdai-3-year-incontestability-rule-explained": {
    title: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    sector: "Insurance",
    readTime: "6 min read",
    summary: "How the Insurance Act Section 45 protects nominees and makes life policies incontestable after 36 months.",
    body: "Under Section 45 of the Insurance Act 1938 (amended in 2015), no policy of life insurance can be called in question on any ground whatsoever, including fraud or non-disclosure of material facts, after the expiry of three continuous years from the date of issuance or revival.",
  },
  "rera-carpet-area-vs-built-up-guide": {
    title: "MahaRERA Carpet Area Standard: How to Avoid Paying for Balcony & Utility Air",
    sector: "Real Estate",
    readTime: "8 min read",
    summary: "Clear guide on statutory carpet area measurements, RERA escrow protections, and penalty interest for delayed possession.",
    body: "Under RERA legislation across all Indian states, builders are legally prohibited from selling apartments on super built-up or loaded square footage. Every transaction must be calculated exclusively on usable net carpet area.",
  },
  "nabh-cashless-hospital-turnaround-times": {
    title: "Cashless Hospitalization Standards: What NABH Accreditations Mean for Your Discharge",
    sector: "Healthcare",
    readTime: "5 min read",
    summary: "Step-by-step breakdown of cashless pre-authorization, TPA query resolution limits, and hospital repudiation appeals.",
    body: "NABH and JCI accredited hospital networks adhere to strict turnaround protocols for insurer cashless desk coordination. Learn how patient discharge settlement times are capped under standard regulatory operating procedures.",
  },
};

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => Object.keys(ARTICLES).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = ARTICLES[slug];
  if (!post) return {};
  return meta(post.title, post.summary, paths.blogPost(slug));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = ARTICLES[slug];
  if (!post) notFound();

  return (
    <article className="page" style={{ maxWidth: "760px", padding: 0 }}>
      <nav className="crumbs">
        <Link href={paths.home()}>Home</Link> &gt; <Link href={paths.blog()}>Blog</Link> &gt; <span>{post.title}</span>
      </nav>
      <span className="badge">{post.sector}</span>
      <h1 style={{ marginTop: "8px" }}>{post.title}</h1>
      <p className="lead">{post.summary}</p>

      <div className="card" style={{ marginTop: "24px", lineHeight: "1.8" }}>
        <p>{post.body}</p>
        <p style={{ marginTop: "16px" }}>
          For further details on audited plans or registered providers in this sector, explore our <Link href={paths.sector("insurance")}>Insurance Hub</Link> or <Link href={paths.rating()}>TrustScore Directory</Link>.
        </p>
      </div>
    </article>
  );
}
