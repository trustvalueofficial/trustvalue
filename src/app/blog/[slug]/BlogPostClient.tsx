"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send,
  ListOrdered,
  Flame,
  Layers,
  TrendingUp,
  Award,
  Star,
  ChevronRight,
} from "lucide-react";
import { paths } from "@/lib/routing";
import { JsonLd } from "@/components/JsonLd";
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

// Universal Top Categories
const UNIVERSAL_TOP_CATEGORIES = [
  {
    name: "Term Life Insurance",
    sector: "insurance",
    href: "/insurance",
    count: "48 Audited Plans",
    metric: "99.1% Claim SLA",
  },
  {
    name: "Health Mediclaim & TPAs",
    sector: "insurance",
    href: "/insurance",
    count: "32 Cashless Networks",
    metric: "60-min TPA SLA",
  },
  {
    name: "RERA Approved Real Estate",
    sector: "real-estate",
    href: "/real-estate",
    count: "118 Projects",
    metric: "100% Escrow Verified",
  },
  {
    name: "Electric & Hybrid Vehicles",
    sector: "automobiles",
    href: "/automobiles",
    count: "24 EV Models",
    metric: "8-Yr Battery Telemetry",
  },
  {
    name: "High-Yield Fixed Deposits",
    sector: "banking",
    href: "/banking",
    count: "16 Scheduled Banks",
    metric: "DICGC Insured",
  },
];

// Daily Top Brands
const DAILY_TOP_BRANDS = [
  {
    name: "HDFC Life Insurance",
    sector: "Life Insurance",
    trustScore: 96.4,
    rating: 4.9,
    reviews: "18,420",
    badge: "99.3% Settlement",
    href: "/insurance/brands/hdfc-life",
  },
  {
    name: "Tata Motors EV",
    sector: "Automobiles",
    trustScore: 94.8,
    rating: 4.8,
    reviews: "12,180",
    badge: "8-Yr Battery SLA",
    href: "/automobiles/brands/tata-motors",
  },
  {
    name: "Godrej Properties",
    sector: "Real Estate",
    trustScore: 93.2,
    rating: 4.7,
    reviews: "8,940",
    badge: "Zero RERA Default",
    href: "/real-estate",
  },
  {
    name: "State Bank of India (SBI)",
    sector: "Banking & Loans",
    trustScore: 92.5,
    rating: 4.6,
    reviews: "24,800",
    badge: "Lowest Repo Spread",
    href: "/banking/brands/sbi",
  },
  {
    name: "Apollo Healthcare",
    sector: "Healthcare",
    trustScore: 91.8,
    rating: 4.6,
    reviews: "14,350",
    badge: "JCI & NABH Accredited",
    href: "/healthcare",
  },
];

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
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;

    setComments((prev) => [
      {
        name: authorName.trim(),
        date: "Just now",
        content: commentText.trim(),
      },
      ...prev,
    ]);

    setCommentText("");
    setAuthorName("");
    setAuthorEmail("");
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
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
        <aside className="hidden lg:block w-[230px] xl:w-[250px] shrink-0 lg:sticky lg:top-[90px] z-10 self-start">
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-4 xl:p-5 shadow-xs">
            {/* Reading Progress Indicator */}
            <div className="mb-3 pb-3 border-b border-[#EEF2F7]">
              <div className="flex items-center justify-between text-xs text-[#667085] font-medium mb-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#071B46]">
                  <ListOrdered size={13} className="text-[#FF5A0A]" /> Contents
                </span>
                <span className="text-[11px] font-semibold text-[#FF5A0A]">
                  {Math.round(readingProgress)}%
                </span>
              </div>
              <div className="w-full bg-[#EEF2F7] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF5A0A] h-full rounded-full transition-all duration-150"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>

            {/* Nav list */}
            <nav className="flex flex-col gap-1 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
              {tocItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={`group flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs leading-snug transition-all ${
                      isActive
                        ? "bg-[#FFF5F0] text-[#FF5A0A] font-bold border-l-2 border-[#FF5A0A]"
                        : "text-[#46526B] hover:text-[#071B46] hover:bg-[#F8FAFC] font-medium border-l-2 border-transparent"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors ${
                        isActive ? "bg-[#FF5A0A]" : "bg-[#CBD5E1] group-hover:bg-[#94A3B8]"
                      }`}
                    />
                    <span className="line-clamp-2">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Ombudsman shortcut */}
            <div className="mt-4 pt-3 border-t border-[#EEF2F7]">
              <Link
                href={paths.contact()}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[#071B46] hover:text-[#FF5A0A] transition-colors"
              >
                <ShieldCheck size={13} className="text-[#0A8754]" />
                <span>Ombudsman Help?</span>
              </Link>
            </div>
          </div>
        </aside>

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
          <div className="lg:hidden mt-4 mb-6 bg-white border border-[#DCE2EB] rounded-xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setMobileTocOpen((prev) => !prev)}
              style={{ padding: "14px 18px", width: "100%" }}
              className="w-full flex items-center justify-between text-left font-bold text-xs text-[#071B46] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <ListOrdered size={16} className="text-[#FF5A0A] shrink-0" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#071B46" }}>Table of Contents</span>
                <span className="text-[11px] font-medium text-[#667085]">
                  ({tocItems.length} sections)
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`text-[#667085] shrink-0 transition-transform duration-200 ${
                  mobileTocOpen ? "rotate-180 text-[#FF5A0A]" : ""
                }`}
              />
            </button>
            {mobileTocOpen && (
              <div
                style={{ padding: "10px 16px 14px 16px" }}
                className="border-t border-[#EEF2F7] flex flex-col gap-1.5 bg-[#FAFBFD]"
              >
                {tocItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      style={{ fontSize: "13px", padding: "8px 12px" }}
                      className={`rounded-lg transition-colors block ${
                        isActive
                          ? "bg-[#FFF5F0] text-[#FF5A0A] font-bold"
                          : "text-[#46526B] hover:text-[#071B46] hover:bg-white font-medium"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

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
          {post.faqData && post.faqData.length > 0 ? (
            <section id="faqs" className="scroll-mt-24 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle size={17} className="text-[#FF5A0A]" />
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#071B46",
                      lineHeight: 1.25,
                    }}
                  >
                    Frequently Asked Statutory Questions
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#0A8754] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                  Audited Answers
                </span>
              </div>

              <div className="divide-y divide-[#DCE2EB] bg-white rounded-xl border border-[#DCE2EB] overflow-hidden shadow-xs">
                {post.faqData.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group p-3.5 sm:p-4 cursor-pointer transition-colors hover:bg-[#FAFBFD]"
                    open={idx === 0}
                  >
                    <summary className="flex items-center justify-between list-none">
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#071B46",
                          lineHeight: 1.35,
                        }}
                        className="group-open:text-[#FF5A0A] transition-colors pr-3"
                      >
                        {faq.question}
                      </span>
                      <span className="shrink-0 text-[#667085] group-open:text-[#FF5A0A] transition-transform duration-200 group-open:rotate-180">
                        <ChevronDown size={15} />
                      </span>
                    </summary>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "#46526B",
                        margin: "8px 0 0 0",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* Comments Section */}
          <div
            id="discussion"
            className="scroll-mt-24 bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 mb-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare size={16} className="text-[#071B46]" />
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#071B46",
                    margin: 0,
                  }}
                >
                  Discussion &amp; Queries ({comments.length})
                </h3>
              </div>
              <span className="text-[10px] text-[#667085] font-medium bg-[#EEF2F7] px-2 py-0.5 rounded-full">
                Moderated
              </span>
            </div>

            {/* Existing comments */}
            <div className="flex flex-col gap-2.5 mb-5">
              {comments.map((c, i) => (
                <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <strong style={{ fontSize: "13px", color: "#071B46" }} className="font-bold">
                      {c.name}
                    </strong>
                    <span className="text-[10px] text-[#667085]">{c.date}</span>
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#334155", margin: 0 }}>
                    {c.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment form */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-2.5">
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#071B46", margin: 0 }}>
                Leave a query or observation
              </h4>
              {submittedMessage && (
                <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-[#065F46] text-xs font-semibold">
                  Thank you! Your query has been submitted for review.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{ fontSize: "13px" }}
                  className="p-2 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A]"
                />
                <input
                  type="email"
                  placeholder="Email address (kept private)"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  style={{ fontSize: "13px" }}
                  className="p-2 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A]"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Write your observation or statutory query..."
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ fontSize: "13px" }}
                className="p-2 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A] resize-y"
              />
              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  backgroundColor: "#071B46",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="self-start shadow-xs hover:!bg-[#FF5A0A] hover:!text-white active:scale-[0.98]"
              >
                <Send size={14} className="shrink-0 text-white" />
                <span>Submit Query</span>
              </button>
            </form>
          </div>

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
        <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-5">
          {/* 1. LATEST BLOG IN THE SAME CATEGORY */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-4 xl:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEF2F7]">
              <div className="flex items-center gap-1.5">
                <Flame size={15} className="text-[#FF5A0A]" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#071B46] m-0">
                  Latest in {post.sector}
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#667085] bg-[#EEF2F7] px-2 py-0.5 rounded-full">
                Fresh
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {latestCategoryPosts.map((catPost) => (
                <Link
                  key={catPost.slug}
                  href={paths.blogPost(catPost.slug)}
                  className="group block p-2.5 rounded-xl border border-[#EEF2F7] hover:border-[#FF5A0A] hover:bg-[#FAFBFD] transition-all no-underline"
                >
                  <div
                    style={{ fontSize: "12px", fontWeight: 700, color: "#071B46", lineHeight: 1.35 }}
                    className="group-hover:text-[#FF5A0A] line-clamp-2 mb-1.5 transition-colors"
                  >
                    {catPost.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {catPost.readTime || "5 min"}
                    </span>
                    <span className="text-[#0C2659] group-hover:text-[#FF5A0A] font-semibold flex items-center gap-0.5">
                      Read <ChevronRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. TOP CATEGORIES UNIVERSALLY IN WEBSITE */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-4 xl:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEF2F7]">
              <div className="flex items-center gap-1.5">
                <Layers size={15} className="text-[#071B46]" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#071B46] m-0">
                  Top Audited Categories
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#0A8754]">
                Universal
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {UNIVERSAL_TOP_CATEGORIES.map((cat, i) => (
                <Link
                  key={i}
                  href={cat.href}
                  className="group flex items-center justify-between p-2 rounded-xl border border-transparent hover:border-[#DCE2EB] hover:bg-[#F8FAFC] transition-all no-underline"
                >
                  <div>
                    <strong style={{ fontSize: "12px", color: "#071B46" }} className="group-hover:text-[#FF5A0A] block leading-snug transition-colors">
                      {cat.name}
                    </strong>
                    <span className="text-[10px] text-[#667085]">
                      {cat.count} • <span className="text-[#0A8754] font-medium">{cat.metric}</span>
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-[#CBD5E1] group-hover:text-[#FF5A0A] shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* 3. OTHER POPULAR POSTS FROM ANY BLOG */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-4 xl:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEF2F7]">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={15} className="text-[#FF5A0A]" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#071B46] m-0">
                  Popular Guides
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#667085]">
                Most Read
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {popularPosts.map((pop, idx) => (
                <Link
                  key={pop.slug}
                  href={paths.blogPost(pop.slug)}
                  className="group flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-[#F8FAFC] transition-all no-underline"
                >
                  <span className="w-5 h-5 rounded-md bg-[#EEF2F7] text-[#071B46] font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF5A0A] block mb-0.5">
                      {pop.sector}
                    </span>
                    <div
                      style={{ fontSize: "12px", fontWeight: 600, color: "#071B46", lineHeight: 1.35 }}
                      className="group-hover:text-[#FF5A0A] line-clamp-2 mb-1 transition-colors"
                    >
                      {pop.title}
                    </div>
                    <span className="text-[10px] text-[#667085] flex items-center gap-1.5">
                      <span className="flex items-center gap-0.5"><Eye size={10} /> {pop.views || 2400}</span>
                      <span>•</span>
                      <span>{pop.readTime || "6 min"}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 4. TOP BRANDS BASED ON REVIEW DAILY */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-4 xl:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Award size={15} className="text-[#FF5A0A]" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#071B46] m-0">
                  Daily Top Brands
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0A8754] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[10px] text-[#667085] mb-3 pb-2 border-b border-[#EEF2F7]">
              Ranked by 50,000+ audited reviews &amp; claim settlement telemetry
            </p>

            <div className="flex flex-col gap-2">
              {DAILY_TOP_BRANDS.map((brand, i) => (
                <Link
                  key={i}
                  href={brand.href}
                  className="group block p-2.5 rounded-xl bg-[#FAFBFD] border border-[#EEF2F7] hover:border-[#FF5A0A] hover:bg-white transition-all no-underline"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: "12px", color: "#071B46" }} className="font-bold group-hover:text-[#FF5A0A] leading-snug transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#0A8754] bg-[#ECFDF5] px-1.5 py-0.5 rounded-full border border-[#A7F3D0]">
                      {brand.trustScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#667085] flex items-center gap-1 font-medium">
                      <Star size={10} className="fill-[#FFAA00] text-[#FFAA00]" />
                      <strong className="text-[#071B46]">{brand.rating}</strong> ({brand.reviews})
                    </span>
                    <span className="text-[9px] font-semibold text-[#0C2659] bg-[#EEF2F7] px-1.5 py-0.5 rounded">
                      {brand.badge}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EEF2F7] text-center">
              <Link
                href="/sectors"
                className="text-xs font-bold text-[#071B46] hover:text-[#FF5A0A] inline-flex items-center gap-1 transition-colors"
              >
                <span>View All 200+ Audited Brands</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
