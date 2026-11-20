"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  ArrowUpDown,
  X,
  ChevronRight,
  BookOpen,
  FolderTree,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { paths } from "@/lib/routing";
import type { BlogArticle, BlogCategory } from "@/lib/cms";
import { BlogCard } from "./BlogCard";

interface Props {
  category: BlogCategory;
  articles: BlogArticle[];
  allCategories: BlogCategory[];
}

export function BlogCategoryView({ category, articles, allCategories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [readTimeFilter, setReadTimeFilter] = useState<"all" | "short" | "medium" | "long">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "quickest" | "longest">("newest");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Extract all distinct sub-topics / tags across articles in this category
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.categoryName) set.add(a.categoryName);
      if (Array.isArray((a as any).tags)) {
        (a as any).tags.forEach((t: string) => set.add(t));
      }
    });
    return Array.from(set);
  }, [articles]);

  // Parse numeric read time helper
  const getMinutes = (rt?: string): number => {
    if (!rt) return 5;
    const match = rt.match(/\d+/);
    return match ? parseInt(match[0], 10) : 5;
  };

  // Filter & sort logic
  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = a.title.toLowerCase().includes(q);
        const inSummary = a.summary?.toLowerCase().includes(q) || false;
        const inDirect = a.directAnswer?.toLowerCase().includes(q) || false;
        if (!inTitle && !inSummary && !inDirect) return false;
      }

      // 2. Read Time Filter
      const mins = getMinutes(a.readTime);
      if (readTimeFilter === "short" && mins >= 5) return false;
      if (readTimeFilter === "medium" && (mins < 5 || mins > 10)) return false;
      if (readTimeFilter === "long" && mins <= 10) return false;

      // 3. Topic Tag Filter
      if (selectedTopic !== "all") {
        const matchCat = a.categoryName === selectedTopic;
        const matchTags = Array.isArray((a as any).tags) && (a as any).tags.includes(selectedTopic);
        if (!matchCat && !matchTags) return false;
      }

      return true;
    });

    // Sort logic
    result.sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
        return dateA - dateB;
      }
      if (sortBy === "quickest") {
        return getMinutes(a.readTime) - getMinutes(b.readTime);
      }
      if (sortBy === "longest") {
        return getMinutes(b.readTime) - getMinutes(a.readTime);
      }
      return 0;
    });

    return result;
  }, [articles, searchQuery, readTimeFilter, sortBy, selectedTopic]);

  const hasActiveFilters = searchQuery.trim() !== "" || readTimeFilter !== "all" || selectedTopic !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setReadTimeFilter("all");
    setSelectedTopic("all");
    setSortBy("newest");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* 1. HERO & TOP METADATA BANNER */}
      <section className="bg-[#06132F] text-white pt-10 pb-12 border-b border-[#12224A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#475569]">/</span>
            <Link href={paths.blog()} className="hover:text-white transition-colors">
              Blog
            </Link>
            <span className="text-[#475569]">/</span>
            <span className="text-amber-400 font-semibold">{category.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-semibold mb-3 border border-white/15">
                <Sparkles size={13} />
                <span>{category.badge || "Statutory Regulatory Silo"}</span>
              </div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  lineHeight: "1.2",
                  color: "#FFFFFF",
                  letterSpacing: "-0.5px",
                  margin: "0 0 12px 0",
                }}
              >
                {category.heroTitle || `${category.name} Research & Regulatory Audits`}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-[#CBD5E1] leading-relaxed max-w-2xl">
                {category.description ||
                  `In-depth consumer analyses, statutory circular breakdowns, and verified claim settlement telemetry for the ${category.name} sector.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN BODY: E-COMMERCE SIDEBAR FILTERS (LEFT) + ARTICLES GRID (RIGHT) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR (DESKTOP) ================= */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6">
            
            {/* WIDGET 1: E-COMMERCE STYLE FILTER PANEL */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2 font-bold text-[#071B46] text-sm">
                  <SlidersHorizontal size={16} className="text-[#FF5A0A]" />
                  <span>Filter Research</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#EF4444",
                      backgroundColor: "#FEF2F2",
                      borderRadius: "6px",
                      border: "1px solid #FEE2E2",
                      cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {/* Search in Category */}
                <div>
                  <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-1.5">
                    Search in {category.name}
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. claim, penalty, circular..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sort By Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ArrowUpDown size={12} className="text-slate-500" /> Sort Order
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#071B46] focus:outline-none focus:border-[#FF5A0A] font-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="quickest">Quickest Read (&lt; 5 min)</option>
                    <option value="longest">In-depth / Longest</option>
                  </select>
                </div>

                {/* Read Time Filter */}
                <div>
                  <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock size={12} className="text-slate-500" /> Reading Duration
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { key: "all", label: "All Read Times" },
                      { key: "short", label: "Quick Reads (< 5 min)" },
                      { key: "medium", label: "In-Depth (5–10 min)" },
                      { key: "long", label: "Longform (> 10 min)" },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                          readTimeFilter === opt.key
                            ? "bg-[#FFF7ED] text-[#C2410C] font-semibold border border-[#FFEDD5]"
                            : "hover:bg-[#F8FAFC] text-[#475569]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="readTime"
                            checked={readTimeFilter === opt.key}
                            onChange={() => setReadTimeFilter(opt.key as any)}
                            className="accent-[#FF5A0A] w-3 h-3"
                          />
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sub-Topics / Tags Filter (if available) */}
                {availableTopics.length > 0 && (
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-2">
                      Key Topics in {category.name}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTopic("all")}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: selectedTopic === "all" ? 700 : 500,
                          backgroundColor: selectedTopic === "all" ? "#FF5A0A" : "#F1F5F9",
                          color: selectedTopic === "all" ? "#FFFFFF" : "#475569",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        All Topics
                      </button>
                      {availableTopics.map((topic) => {
                        const active = selectedTopic === topic;
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setSelectedTopic(topic)}
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: active ? 700 : 500,
                              backgroundColor: active ? "#FF5A0A" : "#F1F5F9",
                              color: active ? "#FFFFFF" : "#475569",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* WIDGET 2: CATEGORY LINKING TABS / LIST (BELOW THE FILTER AS REQUESTED) */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2 font-bold text-[#071B46] text-sm">
                  <FolderTree size={16} className="text-amber-500" />
                  <span>Research Categories</span>
                </div>
                <span className="text-[11px] text-[#64748B] font-mono font-semibold">
                  {allCategories.length} Sectors
                </span>
              </div>
              <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                Browse investigative reports across India&apos;s statutory sectors:
              </p>

              {/* Vertical Category Linking List */}
              <div className="flex flex-col gap-1 max-h-[460px] overflow-y-auto pr-1">
                {allCategories.map((c) => {
                  const isActive = c.slug === category.slug;
                  return (
                    <Link
                      key={c.slug}
                      href={paths.blogCategory(c.slug)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition no-underline ${
                        isActive
                          ? "bg-[#FFF7ED] text-[#C2410C] font-bold border border-[#FFD8A8]"
                          : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#071B46]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isActive ? "bg-[#FF5A0A]" : "bg-slate-300"
                          }`}
                        />
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? "bg-[#FF5A0A] text-white"
                            : (c.articleCount || 0) > 0
                            ? "bg-slate-100 text-slate-700"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {c.articleCount || 0}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Back to All Blog Link */}
              <div className="pt-3 mt-3 border-t border-[#E2E8F0]">
                <Link
                  href={paths.blog()}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#071B46] hover:text-[#FF5A0A] transition py-1"
                >
                  <BookOpen size={13} />
                  <span>View All Research Guides ({allCategories.reduce((s, c) => s + (c.articleCount || 0), 0)})</span>
                </Link>
              </div>
            </div>

          </aside>

          {/* ================= MOBILE SLIDE-OVER DRAWER (FROM LEFT) ================= */}
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={() => setIsMobileDrawerOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
                <div className="p-4 bg-[#071B46] text-white flex items-center justify-between border-b border-[#12224A]">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <SlidersHorizontal size={16} className="text-amber-400" />
                    <span>Filters & Categories</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Category Switcher */}
                  <div>
                    <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FolderTree size={13} className="text-amber-500" /> All Categories
                    </label>
                    <div className="space-y-1">
                      {allCategories.map((c) => {
                        const isCurrent = c.slug === category.slug;
                        return (
                          <Link
                            key={c.slug}
                            href={paths.blogCategory(c.slug)}
                            onClick={() => setIsMobileDrawerOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                              isCurrent
                                ? "bg-[#FFF7ED] text-[#C2410C] font-bold border border-[#FFD8A8]"
                                : "text-[#475569] hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              {c.articleCount ?? 0}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search inside Category */}
                  <div>
                    <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-1.5">
                      Search in {category.name}
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Keyword or circular..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#071B46]"
                      />
                    </div>
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-xs font-bold text-[#071B46] uppercase tracking-wider mb-1.5">
                      Reading Duration
                    </label>
                    <div className="space-y-1">
                      {[
                        { key: "all", label: "All Read Times" },
                        { key: "short", label: "Quick Reads (< 5 min)" },
                        { key: "medium", label: "In-Depth (5–10 min)" },
                        { key: "long", label: "Longform (> 10 min)" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setReadTimeFilter(opt.key as any);
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                            readTimeFilter === opt.key
                              ? "bg-[#FFF7ED] text-[#C2410C] font-semibold border border-[#FFEDD5]"
                              : "text-[#475569] hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= RIGHT ARTICLES GRID ================= */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-6">
            
            {/* Mobile Filter Trigger Button */}
            <div className="lg:hidden flex items-center justify-between bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071B46] text-white text-xs font-bold hover:bg-[#0B255E] transition shadow-xs"
              >
                <SlidersHorizontal size={13} className="text-amber-400" />
                <span>Filters &amp; Categories</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
              <span className="text-[11px] text-[#64748B]">
                Showing <strong className="text-[#071B46]">{filteredArticles.length}</strong> of {articles.length}
              </span>
            </div>

            {/* Active Filter Chips & Counter Header */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#071B46]">
                  Showing {filteredArticles.length} of {articles.length} reports
                </span>
                {hasActiveFilters && (
                  <span className="text-[11px] text-[#64748B]">
                    (Filtered)
                  </span>
                )}
              </div>

              {/* Active Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      Query: &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery("")} className="hover:text-red-500">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {readTimeFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      Duration: {readTimeFilter}
                      <button onClick={() => setReadTimeFilter("all")} className="hover:text-red-500">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedTopic !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      Topic: {selectedTopic}
                      <button onClick={() => setSelectedTopic("all")} className="hover:text-red-500">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Articles Grid - 2 on mobile, 3 on desktop */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4">
                {filteredArticles.map((article) => (
                  <BlogCard key={article.slug} article={article} compact={true} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              /* Filter Produced Empty State */
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                  <Search size={24} />
                </div>
                <h3 className="text-base font-bold text-[#071B46]">
                  No reports matched your current filter criteria
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
                  Try clearing your search query or adjusting your read time filter to view all {articles.length} research guides in {category.name}.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{
                      padding: "8px 18px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      backgroundColor: "#FF5A0A",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              /* Category has 0 Published Articles */
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#071B46]">
                  Upcoming Research Dossiers for {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
                  Our consumer regulatory investigation desk is currently auditing statutory compliance, dispute resolution SLAs, and consumer circulars for {category.name}. Reports will be published here upon peer review.
                </p>
                <div className="pt-2">
                  <Link
                    href={paths.blog()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "8px 18px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      backgroundColor: "#071B46",
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    Explore Active Research Sectors
                  </Link>
                </div>
              </div>
            )}

            {/* Regulatory Footer Callout for this Category */}
            <div className="bg-[#EEF2F7] border border-[#CBD5E1] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#071B46] uppercase tracking-wider block mb-1">
                  Empirical Consumer Telemetry
                </span>
                <p className="text-xs text-[#475569] leading-relaxed max-w-xl">
                  Every guide in the <strong className="text-[#071B46]">{category.name}</strong> silo is compiled directly from statutory regulator gazettes, appellate tribunal orders, and independent claim dispute audits.
                </p>
              </div>
              <Link
                href="/write-review/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#030712",
                  backgroundColor: "#FF5A0A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Submit Consumer Signal
              </Link>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
