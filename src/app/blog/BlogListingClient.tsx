"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles, BookOpen } from "lucide-react";
import { BlogCard } from "@/components/blogcomponent";
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
            style={{
              padding: "6px 14px",
              backgroundColor: selectedSector === "all" ? "#071B46" : "#F8FAFC",
              color: selectedSector === "all" ? "#FFFFFF" : "#46526B",
              border: selectedSector === "all" ? "1px solid #071B46" : "1px solid #DCE2EB",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            className="transition-colors hover:!bg-[#EEF2F7]"
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
                style={{
                  padding: "6px 14px",
                  backgroundColor: active ? "#071B46" : "#F8FAFC",
                  color: active ? "#FFFFFF" : "#46526B",
                  border: active ? "1px solid #071B46" : "1px solid #DCE2EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                className="capitalize transition-colors hover:!bg-[#EEF2F7]"
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
            <BlogCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
