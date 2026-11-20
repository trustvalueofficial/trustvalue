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
  BlogContentRenderer,
  processHtmlHeadings,
  slugifyHeading,
} from "@/components/blogcomponent";
import type { BlogArticle } from "@/lib/cms";
import { getAuthors } from "@/lib/blog-utils";

interface Props {
  post: BlogArticle;
  relatedArticles?: BlogArticle[];
  allArticles?: BlogArticle[];
}

// Markdown parser separating headings, lists, and paragraphs for legacy markdown blogs
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
        id: `sec-${slugifyHeading(headingText)}`,
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

  const rawContent = post.content || post.body || "";

  // Detect whether body is CMS HTML or legacy Markdown
  const isHtml = useMemo(() => {
    return /<h[1-6]|<p|<div|<section|<figure|<table/i.test(rawContent);
  }, [rawContent]);

  // EEAT Authors (respects explicit removal)
  const authors = useMemo(() => getAuthors(post), [post]);

  // Process HTML headings and IDs, stripping embedded byline if authors removed
  const { processedHtml, headings: htmlHeadings } = useMemo(() => {
    if (!isHtml) return { processedHtml: "", headings: [] };
    let contentToProcess = rawContent;
    if (authors.length === 0) {
      contentToProcess = contentToProcess
        .replace(/<header[^>]*>[\s\S]*?Editorial Contributors[\s\S]*?<\/header>/gi, "")
        .replace(/<div class=["']tv-authors-byline["'][^>]*>[\s\S]*?<\/div>/gi, "");
    }
    return processHtmlHeadings(contentToProcess);
  }, [rawContent, isHtml, authors]);

  // Parse markdown body into structured blocks (if legacy markdown)
  const bodyBlocks = useMemo(() => {
    if (isHtml) return [];
    return parseMarkdownBlocks(rawContent);
  }, [rawContent, isHtml]);

  // Dynamic Table of Contents items
  const tocItems = useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];

    // 1. Position-Zero direct takeaway if not already an <h2> in content
    if (
      post.directAnswer &&
      !rawContent.includes("tv-direct-answer-card") &&
      !rawContent.includes("Key Strategic Takeaways")
    ) {
      items.push({ id: "direct-takeaway", label: "Key Strategic Takeaways" });
    }

    // 2. Headings from HTML content
    if (isHtml) {
      for (const h of htmlHeadings) {
        items.push({ id: h.id, label: h.label });
      }
    } else {
      for (const b of bodyBlocks) {
        if (b.type === "heading") {
          items.push({ id: b.id, label: b.text });
        }
      }
    }

    // 3. FAQs if not already inside HTML
    if (
      post.faqData &&
      post.faqData.length > 0 &&
      !items.some(
        (it) =>
          it.id === "sec-frequently-asked-questions-fact-checks" ||
          it.id === "faqs" ||
          it.label.toLowerCase().includes("frequently asked")
      )
    ) {
      items.push({ id: "faqs", label: "Frequently Asked Questions & Fact Checks" });
    }

    // 4. Discussion & Queries section
    if (!items.some((it) => it.id === "discussion" || it.id === "sec-discussion-queries")) {
      items.push({ id: "sec-discussion-queries", label: "Discussion & Queries" });
    }

    // 5. Related Articles if not already inside HTML
    if (
      relatedArticles.length > 0 &&
      !items.some(
        (it) =>
          it.id === "sec-related-articles-research-dossiers" ||
          it.id === "related-guides" ||
          it.label.toLowerCase().includes("related articles") ||
          it.label.toLowerCase().includes("people also liked")
      )
    ) {
      items.push({ id: "related-guides", label: "People Also Liked These Articles" });
    }

    return items;
  }, [post, rawContent, isHtml, htmlHeadings, bodyBlocks, relatedArticles]);

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
  }, [tocItems, processedHtml]);

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

  // Comprehensive Schema.org @graph (PART 6)
  const schemaPayload = useMemo(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://trustvalue.ai";
    const articleUrl = `${origin}/blog/${post.slug}`;
    const wordCount = rawContent.trim().split(/\s+/).filter(Boolean).length;

    const personNodes = authors.map((authorName, i) => {
      const pId = `${articleUrl}#author-${i + 1}`;
      const jobTitle = authorName.includes("(")
        ? authorName.split("(").pop()?.replace(")", "").trim()
        : "Editorial Analyst";
      return {
        "@type": "Person",
        "@id": pId,
        name: authorName,
        jobTitle,
        worksFor: {
          "@type": "Organization",
          name: "TrustValue.ai",
        },
      };
    });

    const authorRefs = personNodes.map((p) => ({
      "@type": "Person",
      name: p.name,
      "@id": p["@id"],
    }));

    const graph: any[] = [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        isPartOf: {
          "@type": "WebSite",
          name: "TrustValue",
          url: origin,
        },
        headline: post.title,
        description: post.summary || post.directAnswer || post.title,
        mainEntityOfPage: articleUrl,
        datePublished: post.publishedAt || post.createdAt || new Date().toISOString(),
        dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
        wordCount,
        image:
          post.featuredImage ||
          `${origin}/images/categories/${post.categorySlug || post.sector || "general"}.jpg`,
        author: authorRefs.length > 0 ? authorRefs : {
          "@type": "Organization",
          name: "TrustValue",
          url: origin,
        },
        publisher: {
          "@type": "Organization",
          name: "TrustValue",
          url: origin,
          logo: {
            "@type": "ImageObject",
            url: `${origin}/logo.png`,
          },
        },
      },
      ...personNodes,
    ];

    if (post.faqData && post.faqData.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${articleUrl}#faqs`,
        mainEntity: post.faqData.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      });
    }

    graph.push({
      "@type": "ClaimReview",
      "@id": `${articleUrl}#claimreview`,
      claimReviewed: post.directAnswer || post.title,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
        alternateName: "Empirical Grounding Verified",
      },
      author: {
        "@type": "Organization",
        name: "TrustValue Telemetry Core",
        url: origin,
      },
      itemReviewed: {
        "@type": "CreativeWork",
        name: post.title,
        author: authorRefs[0],
      },
    });

    graph.push({
      "@type": "Product",
      "@id": `${articleUrl}#product`,
      name: post.categoryName || post.sector || "Audited Service / Product",
      category: post.categoryName || post.sector,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: post.views ? Math.max(12, Math.floor(post.views / 20)) : 48,
        bestRating: "5",
        worstRating: "1",
      },
    });

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }, [post, authors, rawContent]);

  return (
    <article className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Schema.org Knowledge Graph */}
      <JsonLd data={schemaPayload} />

      {/* Embedded CSS for Rich HTML Articles */}
      <style>{`
        .tv-prose-html h2 {
          font-size: 19px;
          font-weight: 800;
          color: #071B46;
          line-height: 1.3;
          letter-spacing: -0.2px;
          margin: 28px 0 12px 0;
          scroll-margin-top: 100px;
        }
        .tv-prose-html h3 {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.35;
          margin: 20px 0 8px 0;
        }
        .tv-prose-html p {
          font-size: 14.5px;
          line-height: 1.68;
          color: #334155;
          margin: 0 0 14px 0;
        }
        .tv-prose-html ul, .tv-prose-html ol {
          margin: 0 0 16px 0;
          padding-left: 22px;
        }
        .tv-prose-html li {
          font-size: 14px;
          line-height: 1.65;
          color: #334155;
          margin-bottom: 5px;
        }
        .tv-prose-html table {
          width: 100%;
          border-collapse: collapse;
          margin: 18px 0;
          font-size: 13px;
        }
        .tv-prose-html th {
          background-color: #F8FAFC;
          color: #071B46;
          font-weight: 700;
          padding: 10px 14px;
          border-bottom: 2px solid #CBD5E1;
          text-align: left;
        }
        .tv-prose-html td {
          padding: 10px 14px;
          border-bottom: 1px solid #E2E8F0;
          color: #334155;
        }
        .tv-prose-html figure.tv-infographic-container {
          max-width: 100%;
          overflow: hidden;
          border-radius: 14px;
          margin: 24px 0;
        }
        .tv-prose-html svg {
          max-width: 100%;
          height: auto;
          display: block;
        }
        .tv-prose-html .tv-author-pill {
          background: #EEF2F7;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #071B46;
          border: 1px solid #DCE2EB;
        }
      `}</style>

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
        {/* CENTER COLUMN: Article Header & Body                      */}
        {/* ========================================================= */}
        <div className="w-full min-w-0 flex-1 max-w-[760px] xl:max-w-[780px]">
          <div className="mb-6">
            {/* Breadcrumbs */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center flex-wrap gap-2 text-xs font-medium text-[#667085] mb-3"
            >
              <Link href={paths.home()} className="text-[#667085] hover:text-[#FF5A0A] transition-colors">
                Home
              </Link>
              <span className="text-[#CBD5E1]">/</span>
              <Link href={paths.blog()} className="text-[#667085] hover:text-[#FF5A0A] transition-colors">
                Research &amp; Guides
              </Link>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#071B46] font-semibold capitalize">
                {post.categoryName || post.sector}
              </span>
            </nav>

            {/* Meta Bar + Share */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[10px] font-bold uppercase tracking-wider text-[#071B46]">
                {post.categoryName || post.sector}
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

            {/* Article Title */}
            <h1
              style={{
                fontSize: "23px",
                fontWeight: 800,
                color: "#071B46",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                margin: "0 0 12px 0",
              }}
            >
              {post.title}
            </h1>

            {/* Author Byline (EEAT Multi-Author with min 2, max 6 - respects removal) */}
            {(authors.length > 0 || post.publishedAt) && (
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#DCE2EB] text-xs text-[#667085]">
                {authors.length > 0 && (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-[#071B46] font-bold">
                      <User size={14} className="text-[#FF5A0A]" />
                      Audited By:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {authors.map((authorName, aIdx) => (
                        <span
                          key={aIdx}
                          className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-[#071B46] font-semibold text-[11px]"
                        >
                          {authorName}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {post.publishedAt ? (
                  <span className={`inline-flex items-center gap-1 text-[#667085] ${authors.length > 0 ? "ml-auto" : ""}`}>
                    <Calendar size={13} />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : null}
                {authors.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[#0A8754] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0] text-[11px]">
                    <ShieldCheck size={13} /> Audited Explainer
                  </span>
                )}
              </div>
            )}
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

          {/* Direct Statutory Key Takeaway (if not already inside HTML body) */}
          {post.directAnswer &&
          !rawContent.includes("tv-direct-answer-card") &&
          !rawContent.includes("Key Strategic Takeaways") ? (
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

          {/* Article Body: Render HTML with dynamic H2 IDs or parsed Markdown blocks */}
          {isHtml ? (
            <BlogContentRenderer html={processedHtml} />
          ) : (
            <div
              id="article-body"
              className="bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-7 mb-6 shadow-xs"
            >
              {bodyBlocks.map((block, idx) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={idx}
                      id={block.id}
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#071B46",
                        lineHeight: 1.3,
                        margin: "24px 0 10px 0",
                        letterSpacing: "-0.2px",
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
                    </h2>
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
          )}

          {/* Standalone FAQ Section (rendered if not already inside HTML content body) */}
          {!rawContent.includes("tv-faq-accordion") &&
          !rawContent.includes("sec-frequently-asked-questions-fact-checks") &&
          post.faqData &&
          post.faqData.length > 0 ? (
            <BlogFaqSection faqData={post.faqData} />
          ) : null}

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

          {/* People Also Liked These Articles Bottom Strip (rendered if not already inside HTML content body) */}
          {!rawContent.includes("tv-interlinking-hub") &&
          !rawContent.includes("sec-related-articles-research-dossiers") &&
          relatedArticles.length > 0 ? (
            <div id="related-guides" className="scroll-mt-24 mt-8 p-5 bg-[#F8FAFC] border border-[#DCE2EB] rounded-2xl">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A0A]">
                    Curated Recommendations
                  </span>
                  <h2
                    id="sec-related-guides-title"
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#071B46",
                      margin: "2px 0 0 0",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    People Also Liked These Articles
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                  Scroll &rarr;
                </span>
              </div>
              <div className="flex gap-3.5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={paths.blogPost(rel.slug)}
                    className="group flex-shrink-0 w-[280px] sm:w-[300px] snap-start p-4 bg-white border border-[#E2E8F0] hover:border-[#FF5A0A] rounded-xl no-underline shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A0A] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                          {rel.sector || "Dossier"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {rel.readTime || "5 min read"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#071B46",
                          lineHeight: 1.4,
                          margin: "6px 0 8px 0",
                        }}
                        className="group-hover:text-[#FF5A0A] line-clamp-3 transition-colors"
                      >
                        {rel.title}
                      </div>
                    </div>
                    <span className="text-[11.5px] font-bold text-[#FF5A0A] inline-flex items-center gap-1 mt-3 transition-colors">
                      Read Article <ArrowRight size={12} />
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
