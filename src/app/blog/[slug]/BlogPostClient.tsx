"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
  Calendar,
  User,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { paths } from "@/lib/routing";
import { JsonLd } from "@/components/JsonLd";
import {
  DesktopTableOfContents,
  MobileTableOfContents,
  BlogDiscoverySidebar,
  BlogFaqSection,
  BlogDiscussionSection,
} from "@/components/blogcomponent";
import type { BlogArticle } from "@/lib/cms";

interface Props {
  post: BlogArticle;
  relatedArticles?: BlogArticle[];
  allArticles?: BlogArticle[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Robust markdown parser separating headings, lists, and paragraphs
function parseMarkdownBlocks(content: string) {
  const lines = content.split("\n");
  const blocks: Array<
    | { type: "heading"; text: string; id: string }
    | { type: "list"; ordered: boolean; items: string[] }
    | { type: "paragraph"; text: string }
  > = [];

  let currentList: { ordered: boolean; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        blocks.push({ type: "paragraph", text });
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push({ type: "list", ordered: currentList.ordered, items: currentList.items });
      currentList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ") || line.startsWith("## ")) {
      flushParagraph();
      flushList();
      const headingText = line.replace(/^#{2,3}\s+/, "").replace(/:$/, "").trim();
      blocks.push({
        type: "heading",
        text: headingText,
        id: `sec-${slugify(headingText)}`,
      });
      continue;
    }

    const isOrderedItem = /^\d+\.\s+/.test(line);
    const isUnorderedItem = /^[-*]\s+/.test(line);

    if (isOrderedItem || isUnorderedItem) {
      flushParagraph();
      const itemText = line.replace(/^(\d+\.|[-*])\s+/, "").trim();
      const ordered = isOrderedItem;

      if (!currentList || currentList.ordered !== ordered) {
        flushList();
        currentList = { ordered, items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, pIdx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={pIdx} className="font-semibold text-[#071B46]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function BlogPostClient({ post, relatedArticles = [], allArticles = [] }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const [comments, setComments] = useState<Array<{ name: string; date: string; content: string }>>([
    {
      name: "Adv. Rajesh Deshmukh",
      date: "3 days ago",
      content:
        "Very thorough analysis of the statutory precedence. Most policyholders are unaware of the 2015 amendment strictly shutting down repudiation post 36 months.",
    },
    {
      name: "Pooja Sundaram",
      date: "1 week ago",
      content:
        "Could you clarify if the revival clause also applies to lapsed health policies, or is Section 45 strictly limited to life assurance contracts?",
    },
  ]);

  // Parse markdown body into structured blocks
  const bodyBlocks = useMemo(() => {
    return parseMarkdownBlocks(post.body || "");
  }, [post.body]);

  // Dynamic Table of Contents items
  const tocItems = useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];

    if (post.directAnswer) {
      items.push({ id: "direct-takeaway", label: "Key Takeaway" });
    }

    for (const b of bodyBlocks) {
      if (b.type === "heading") {
        items.push({ id: b.id, label: b.text });
      }
    }

    if (post.faqData && post.faqData.length > 0) {
      items.push({ id: "faqs", label: "Statutory FAQs" });
    }

    items.push({ id: "discussion", label: "Discussion & Queries" });

    if (relatedArticles.length > 0) {
      items.push({ id: "related-guides", label: "Related Guides" });
    }

    return items;
  }, [post, bodyBlocks, relatedArticles]);

  // Latest Posts in Same Category
  const latestCategoryPosts = useMemo(() => {
    const matching = allArticles.filter(
      (a) => a.sector?.toLowerCase() === post.sector?.toLowerCase() && a.slug !== post.slug
    );
    if (matching.length > 0) return matching.slice(0, 3);

    return [
      {
        slug: "rera-carpet-area-vs-built-up-guide",
        title: "Statutory Real Estate Escrow & Carpet Area Measurement Standards",
        sector: post.sector || "real-estate",
        readTime: "7 min read",
      },
      {
        slug: "builder-delay-compensation-rera-act",
        title: "RERA Section 18: Mandatory Monthly Interest for Delayed Possession",
        sector: post.sector || "real-estate",
        readTime: "6 min read",
      },
    ].filter((p) => p.slug !== post.slug).slice(0, 2);
  }, [allArticles, post]);

  // Popular Posts Across the Site
  const popularPosts = useMemo(() => {
    const list = [...allArticles]
      .filter((a) => a.slug !== post.slug)
      .sort((a, b) => (b.views || 0) - (a.views || 0));

    if (list.length >= 3) return list.slice(0, 4);

    const defaults = [
      {
        slug: "irdai-3-year-incontestability-rule-explained",
        title: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
        sector: "insurance",
        readTime: "6 min read",
        views: 4210,
      },
      {
        slug: "rera-carpet-area-vs-built-up-guide",
        title: "MahaRERA Carpet Area Standard: How to Avoid Paying for Balcony Air",
        sector: "real-estate",
        readTime: "8 min read",
        views: 2980,
      },
      {
        slug: "nabh-cashless-hospital-turnaround-times",
        title: "Cashless Hospitalization Standards: NABH Discharge Turnarounds",
        sector: "healthcare",
        readTime: "5 min read",
        views: 1845,
      },
      {
        slug: "rbi-banking-ombudsman-upi-recovery",
        title: "RBI CMS Framework: Reclaiming Disputed UPI & NetBanking Deductions",
        sector: "banking",
        readTime: "7 min read",
        views: 3420,
      },
    ];

    return defaults.filter((d) => d.slug !== post.slug).slice(0, 4);
  }, [allArticles, post]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const docEl = document.documentElement;
      const totalHeight = docEl.scrollHeight - docEl.clientHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-90px 0% -65% 0%",
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setMobileTocOpen(false);
    }
  };


  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build FAQ Schema
  const faqSchema =
    post.faqData && post.faqData.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqData.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <article className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* 3-Column Layout: Left TOC | Center Content (with Header inside) | Right Discovery */}
      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Sticky Table of Contents (Desktop)           */}
        {/* ========================================================= */}
        <DesktopTableOfContents
          tocItems={tocItems}
          activeId={activeId}
          readingProgress={readingProgress}
          onSelectSection={scrollToSection}
        />

        {/* ========================================================= */}
        {/* CENTER COLUMN: Article Header & Body (Restored Position)  */}
        {/* ========================================================= */}
        <div className="w-full min-w-0 flex-1 max-w-[760px] xl:max-w-[780px]">
          {/* HEADER PLACED BACK HERE AS IT WAS EARLIER */}
          <div className="mb-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs font-medium text-[#667085] mb-3">
              <Link href={paths.home()} className="text-[#667085] hover:text-[#FF5A0A] transition-colors">
                Home
              </Link>
              <span className="text-[#CBD5E1]">/</span>
              <Link href={paths.blog()} className="text-[#667085] hover:text-[#FF5A0A] transition-colors">
                Research &amp; Guides
              </Link>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#071B46] font-semibold capitalize">{post.sector}</span>
            </nav>

            {/* Meta Bar + Share */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[10px] font-bold uppercase tracking-wider text-[#071B46]">
                {post.sector}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#667085]">
                <Clock size={13} /> {post.readTime || "6 min read"}
              </span>
              {post.views ? (
                <span className="inline-flex items-center gap-1 text-xs text-[#667085]">
                  <Eye size={13} /> {post.views} views
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleShare}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DCE2EB",
                  borderRadius: "8px",
                  color: "#071B46",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                className="ml-auto hover:!bg-[#F8FAFC] shadow-xs transition-colors"
              >
                {copied ? <Check size={13} className="text-[#0A8754]" /> : <Share2 size={13} />}
                <span>{copied ? "Copied" : "Share"}</span>
              </button>
            </div>

            {/* Article Title (Explicit inline styles to override prototype.css) */}
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#071B46",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                margin: "0 0 10px 0",
              }}
            >
              {post.title}
            </h1>

            {/* Author Byline */}
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#DCE2EB] text-xs text-[#667085]">
              <span className="inline-flex items-center gap-1.5">
                <User size={14} className="text-[#FF5A0A]" />
                <strong className="text-[#071B46] font-semibold">{post.author || "TrustValue Research Desk"}</strong>
              </span>
              {post.publishedAt ? (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 text-[#0A8754] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0] text-[11px]">
                <ShieldCheck size={13} /> Audited Explainer
              </span>
            </div>
          </div>

          {/* Mobile Table of Contents Accordion (< 1024px) */}
          <MobileTableOfContents
            tocItems={tocItems}
            activeId={activeId}
            mobileTocOpen={mobileTocOpen}
            onToggleMobileToc={() => setMobileTocOpen((prev) => !prev)}
            onSelectSection={scrollToSection}
          />

          {/* Featured Image */}
          {post.featuredImage ? (
            <div className="rounded-2xl overflow-hidden mb-6 border border-[#DCE2EB] bg-white shadow-xs max-h-[420px]">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover block"
              />
            </div>
          ) : null}

          {/* Direct Statutory Key Takeaway */}
          {post.directAnswer ? (
            <div
              id="direct-takeaway"
              className="scroll-mt-24 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 sm:p-5 mb-6 shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-[#0A8754] font-bold text-[11px] uppercase tracking-wider mb-1.5">
                <Sparkles size={14} /> Direct Statutory Key Takeaway
              </div>
              <p
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.55,
                  color: "#064E3B",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {post.directAnswer}
              </p>
            </div>
          ) : null}

          {/* Summary / Lead */}
          {post.summary ? (
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#46526B",
                fontStyle: "italic",
                margin: "0 0 18px 0",
              }}
              className="border-l-3 border-[#FF5A0A] pl-3.5"
            >
              {post.summary}
            </p>
          ) : null}

          {/* Article Body with properly parsed blocks and explicit font sizes */}
          <div
            id="article-body"
            className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-7 mb-6 shadow-xs"
          >
            {bodyBlocks.map((block, idx) => {
              if (block.type === "heading") {
                return (
                  <h3
                    key={idx}
                    id={block.id}
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#071B46",
                      lineHeight: 1.35,
                      margin: "22px 0 8px 0",
                    }}
                    className="scroll-mt-24 flex items-center gap-2 group"
                  >
                    <span>{block.text}</span>
                    <a
                      href={`#${block.id}`}
                      onClick={(e) => scrollToSection(e, block.id)}
                      className="text-[#CBD5E1] group-hover:text-[#FF5A0A] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Direct link"
                    >
                      #
                    </a>
                  </h3>
                );
              }

              if (block.type === "list") {
                return block.ordered ? (
                  <ol key={idx} className="list-decimal pl-5 space-y-1.5 mb-4">
                    {block.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.65,
                          color: "#334155",
                          marginBottom: "4px",
                        }}
                      >
                        {renderFormattedText(item)}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 mb-4">
                    {block.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.65,
                          color: "#334155",
                          marginBottom: "4px",
                        }}
                      >
                        {renderFormattedText(item)}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={idx}
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.65,
                    color: "#334155",
                    margin: "0 0 12px 0",
                  }}
                >
                  {renderFormattedText(block.text)}
                </p>
              );
            })}
          </div>

          {/* FAQ Section */}
          <BlogFaqSection faqData={post.faqData || []} />

          {/* Comments Section */}
          <BlogDiscussionSection
            comments={comments}
            onAddComment={({ name, content }) => {
              setComments((prev) => [
                {
                  name,
                  date: "Just now",
                  content,
                },
                ...prev,
              ]);
            }}
          />

          {/* Related Articles Bottom Strip */}
          {relatedArticles.length > 0 ? (
            <div id="related-guides" className="scroll-mt-24 mt-6">
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#071B46",
                  margin: "0 0 12px 0",
                }}
              >
                Related Statutory &amp; Sector Audits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={paths.blogPost(rel.slug)}
                    className="group block p-3.5 bg-white border border-[#DCE2EB] hover:border-[#FF5A0A] rounded-xl no-underline shadow-xs hover:shadow-md transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A0A]">
                      {rel.sector}
                    </span>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#071B46",
                        lineHeight: 1.35,
                        margin: "4px 0 6px 0",
                      }}
                      className="group-hover:text-[#FF5A0A] line-clamp-2 transition-colors"
                    >
                      {rel.title}
                    </div>
                    <span className="text-[11px] font-semibold text-[#0C2659] group-hover:text-[#FF5A0A] inline-flex items-center gap-1 transition-colors">
                      Read Explainer <ArrowRight size={11} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Discovery Sidebar                           */}
        {/* ========================================================= */}
        <BlogDiscoverySidebar
          sector={post.sector}
          latestCategoryPosts={latestCategoryPosts}
          popularPosts={popularPosts}
        />
      </div>
    </article>
  );
}
