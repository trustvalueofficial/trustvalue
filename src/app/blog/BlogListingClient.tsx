"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, Eye, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { paths } from "@/lib/routing";
import type { BlogArticle } from "@/lib/cms";

interface Props {
  articles: BlogArticle[];
}

export function BlogListingClient({ articles }: Props) {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Unique sectors from articles
  const sectors = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.sector) set.add(a.sector.toLowerCase());
    });
    return Array.from(set);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSector =
        selectedSector === "all" ||
        a.sector?.toLowerCase() === selectedSector.toLowerCase() ||
        a.categoryId?.toLowerCase().includes(selectedSector.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.directAnswer?.toLowerCase().includes(q) ||
        a.body?.toLowerCase().includes(q);

      return matchSector && matchSearch;
    });
  }, [articles, selectedSector, searchQuery]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[10px] font-bold uppercase tracking-wider text-[#071B46] mb-2">
          <Sparkles size={12} className="text-[#FF5A0A]" />
          <span>TrustValue Legal &amp; Regulatory Intelligence</span>
        </div>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#071B46",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            margin: "0 0 8px 0",
          }}
        >
          Research &amp; Regulatory Guides
        </h1>
        <p style={{ fontSize: "14px", color: "#46526B", lineHeight: 1.55, margin: 0 }}>
          Evidence-backed statutory explainers, IRDAI/RERA/SEBI circular breakdowns, and consumer protection playbooks audited by our research desk.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-[#DCE2EB] rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <button
            type="button"
            onClick={() => setSelectedSector("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              selectedSector === "all"
                ? "bg-[#071B46] text-white"
                : "bg-[#F8FAFC] text-[#46526B] border border-[#DCE2EB] hover:bg-[#EEF2F7]"
            }`}
          >
            All Sectors ({articles.length})
          </button>
          {sectors.map((s) => {
            const count = articles.filter((a) => a.sector?.toLowerCase() === s).length;
            const active = selectedSector === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSector(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                  active
                    ? "bg-[#071B46] text-white"
                    : "bg-[#F8FAFC] text-[#46526B] border border-[#DCE2EB] hover:bg-[#EEF2F7]"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search regulations, laws, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#DCE2EB] text-[#071B46] placeholder-[#94A3B8] text-xs focus:outline-none focus:border-[#FF5A0A] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-[#DCE2EB] shadow-xs">
          <BookOpen size={36} className="text-[#94A3B8] mx-auto mb-2" />
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#071B46", margin: "0 0 4px 0" }}>
            No research guides found
          </h3>
          <p style={{ fontSize: "13px", color: "#667085", margin: 0 }}>
            Try adjusting your sector filter or search keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.map((a) => (
            <Link
              key={a.slug}
              href={paths.blogPost(a.slug)}
              className="group flex flex-col bg-white border border-[#DCE2EB] hover:border-[#FF5A0A] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all no-underline"
            >
              {/* Featured Image */}
              {a.featuredImage ? (
                <div className="h-40 overflow-hidden bg-[#F8FAFC]">
                  <img
                    src={a.featuredImage}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : null}

              <div className="p-4 sm:p-5 flex flex-col flex-1">
                {/* Meta Header */}
                <div className="flex justify-between items-center mb-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[10px] font-bold uppercase tracking-wider text-[#071B46]">
                    {a.sector}
                  </span>
                  <div className="flex items-center gap-2.5 text-[11px] text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {a.readTime || "5 min read"}
                    </span>
                    {a.views ? (
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {a.views}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Card Title - Explicit inline styles to prevent prototype.css h2 inflation */}
                <div
                  className="font-bold text-[#071B46] group-hover:text-[#FF5A0A] transition-colors"
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: "1.35",
                    margin: "0 0 8px 0",
                  }}
                >
                  {a.title}
                </div>

                {/* Direct Answer snippet highlight if present */}
                {a.directAnswer ? (
                  <div
                    className="p-2.5 bg-[#ECFDF5] border-l-2 border-[#10B981] rounded-r-lg mb-3"
                    style={{ fontSize: "12px", lineHeight: "1.5", color: "#065F46" }}
                  >
                    <strong style={{ color: "#0A8754", display: "block", marginBottom: "2px" }}>
                      Statutory Takeaway:
                    </strong>
                    {a.directAnswer.length > 100 ? a.directAnswer.slice(0, 100) + "..." : a.directAnswer}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#46526B",
                      lineHeight: "1.5",
                      margin: "0 0 12px 0",
                    }}
                    className="flex-1 line-clamp-2"
                  >
                    {a.summary}
                  </p>
                )}

                {/* Card Footer */}
                <div className="flex justify-between items-center pt-2.5 border-t border-[#EEF2F7] mt-auto text-[11px] text-[#667085]">
                  <span>By {a.author || "Research Desk"}</span>
                  <span className="flex items-center gap-1 text-[#FF5A0A] font-bold group-hover:translate-x-0.5 transition-transform text-xs">
                    Read Guide <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
