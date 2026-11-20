"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, BookOpen, ArrowRight, FolderTree, Layers, X, SlidersHorizontal } from "lucide-react";
import { paths } from "@/lib/routing";
import { BlogCard } from "@/components/blogcomponent";
import type { BlogArticle, BlogCategory, BlogPageContent } from "@/lib/cms";

interface Props {
  articles: BlogArticle[];
  allCategories?: BlogCategory[];
  pageContent?: BlogPageContent;
}

export function BlogListingClient({ articles, allCategories = [], pageContent }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<boolean>(false);

  // Compute categories that have published blogs (only show categories where blogs are present)
  const activeCategories = useMemo(() => {
    const countMap = new Map<string, number>();
    articles.forEach((a) => {
      const sec = (a.sector || a.categorySlug || "").toLowerCase();
      if (sec) {
        countMap.set(sec, (countMap.get(sec) || 0) + 1);
      }
    });

    const list: Array<{ slug: string; name: string; count: number }> = [];
    const seen = new Set<string>();

    if (allCategories && allCategories.length > 0) {
      allCategories.forEach((cat) => {
        const slug = cat.slug.toLowerCase();
        const count = countMap.get(slug) || 0;
        if (count > 0) {
          list.push({ slug: cat.slug, name: cat.name, count });
          seen.add(slug);
        }
      });
    }

    // Include any sector present in articles not already in allCategories
    countMap.forEach((count, sec) => {
      if (!seen.has(sec) && count > 0) {
        const formatted = sec
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        list.push({ slug: sec, name: formatted, count });
        seen.add(sec);
      }
    });

    return list.sort((a, b) => b.count - a.count);
  }, [allCategories, articles]);

  // Client-side letter-by-letter live search across all blogs (no repeated API calls)
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return articles.filter((a) => {
      // Category / Sector match
      const matchCategory =
        selectedCategory === "all" ||
        a.sector?.toLowerCase() === selectedCategory.toLowerCase() ||
        a.categorySlug?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchCategory) return false;

      // Letter-matching search
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.directAnswer?.toLowerCase().includes(q) ||
        a.sector?.toLowerCase().includes(q) ||
        a.categoryName?.toLowerCase().includes(q) ||
        a.author?.toLowerCase().includes(q) ||
        a.body?.toLowerCase().includes(q)
      );
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* ========================================================= */}
      {/* 1. HERO BANNER: STYLED EXACTLY LIKE BLOG CATEGORY PAGE    */}
      {/* ========================================================= */}
      <section className="bg-[#06132F] text-white pt-8 pb-10 sm:pt-10 sm:pb-12 border-b border-[#12224A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3 sm:mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#475569]">/</span>
            <span className="text-amber-400 font-semibold">Articles &amp; Regulatory Guides</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-semibold mb-3 border border-white/15">
              <Sparkles size={13} />
              <span>{pageContent?.badge || "TrustValue Knowledge Hub"}</span>
            </div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: 800,
                lineHeight: "1.2",
                color: "#FFFFFF",
                letterSpacing: "-0.5px",
                margin: "0 0 10px 0",
              }}
            >
              {pageContent?.title || "Articles, Insights & Regulatory Guides"}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#CBD5E1] leading-relaxed max-w-2xl">
              {pageContent?.description ||
                "Evidence-backed consumer guides, statutory explainers, and regulatory circular breakdowns audited by our research desk."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INSTANT SEARCH BAR JUST AFTER BANNER (LETTER MATCHING) */}
      {/* ========================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] py-2 sm:py-3 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Category Trigger Pill - Visible ONLY on mobile (< lg), completely hidden on desktop */}
            <button
              type="button"
              onClick={() => setIsMobileCategoryOpen(true)}
              style={{
                backgroundColor: "#071B46",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              className="inline-flex lg:hidden items-center gap-1.5 px-2.5 h-8.5 text-xs font-bold shrink-0 hover:bg-[#0B255E] transition-colors shadow-xs active:scale-95"
              title="Open Categories"
            >
              <FolderTree size={13} className="text-amber-400" />
              <span className="text-[10px] bg-amber-400 text-[#071B46] font-bold px-1.5 py-0.2 rounded-full font-mono">
                {activeCategories.length}
              </span>
            </button>

            <div className="relative flex-1 w-full">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />
              <input
                type="text"
                placeholder={pageContent?.searchPlaceholder || "Search all research guides, statutory circulars, laws..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8.5 pl-8 pr-7 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A] focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label="Clear search query"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Desktop-only Search button - hidden on mobile */}
            <button
              type="button"
              onClick={() => {
                const grid = document.getElementById("blog-grid-section");
                if (grid) grid.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                backgroundColor: "#FF5A0A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 h-8.5 justify-center hover:opacity-95 transition-opacity shrink-0 shadow-xs"
            >
              <Search size={14} />
              <span>Search</span>
            </button>
          </div>

          {/* Instant feedback on query */}
          {searchQuery.trim() ? (
            <div className="mt-1.5 flex items-center justify-between text-xs text-[#64748B]">
              <span>
                Matching &ldquo;<strong className="text-[#071B46]">{searchQuery}</strong>&rdquo;:
              </span>
              <span className="font-semibold text-[#071B46]">
                {filteredArticles.length} {filteredArticles.length === 1 ? "guide" : "guides"} found
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {/* ========================================================= */}
      {/* MOBILE SLIDE-OVER CATEGORY DRAWER (FROM LEFT SIDE)        */}
      {/* ========================================================= */}
      {isMobileCategoryOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileCategoryOpen(false)}
          />

          {/* Drawer Sliding from Left */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
            {/* Drawer Header */}
            <div className="p-4 bg-[#071B46] text-white flex items-center justify-between border-b border-[#12224A]">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FolderTree size={16} className="text-amber-400" />
                <span>Research Categories</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCategoryOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close categories"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category Items */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setIsMobileCategoryOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-2 ${
                  selectedCategory === "all"
                    ? "bg-[#FFF7ED] text-[#C2410C] font-bold border border-[#FFD8A8]"
                    : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#071B46] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers
                    size={14}
                    className={selectedCategory === "all" ? "text-[#FF5A0A]" : "text-slate-400"}
                  />
                  <span>All Categories</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-[#FF5A0A] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {articles.length}
                </span>
              </button>

              {activeCategories.map((c) => {
                const isActive = selectedCategory === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setIsMobileCategoryOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? "bg-[#FFF7ED] text-[#C2410C] font-bold border border-[#FFD8A8]"
                        : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#071B46] border border-transparent"
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
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN SECTION: LEFT CATEGORIES (DESKTOP) + BLOG GRID    */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT CATEGORIES WIDGET (DESKTOP ONLY) ================= */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2 font-bold text-[#071B46] text-sm">
                  <FolderTree size={16} className="text-amber-500" />
                  <span>Research Categories</span>
                </div>
                <span className="text-[11px] text-[#64748B] font-mono font-semibold">
                  {activeCategories.length} Active
                </span>
              </div>

              {/* All Categories Option */}
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-2 ${
                  selectedCategory === "all"
                    ? "bg-[#FFF7ED] text-[#C2410C] font-bold border border-[#FFD8A8]"
                    : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#071B46] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers
                    size={13}
                    className={selectedCategory === "all" ? "text-[#FF5A0A]" : "text-slate-400"}
                  />
                  <span>All Categories</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-[#FF5A0A] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {articles.length}
                </span>
              </button>

              {/* Scrollable list of categories with blogs (scrollable after 8 tabs) */}
              <div
                className="flex flex-col gap-1 pr-1 overflow-y-auto scrollbar-thin"
                style={{ maxHeight: "324px" }}
              >
                {activeCategories.map((c) => {
                  const isActive = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? "bg-[#FFF7ED] text-[#C2410C] font-bold border border-[#FFD8A8]"
                          : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#071B46] border border-transparent"
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
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {c.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Footnote */}
              {selectedCategory !== "all" && (
                <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Link
                    href={paths.blogCategory(selectedCategory)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5A0A] hover:underline"
                  >
                    <span>Open Category Hub</span>
                    <ArrowRight size={11} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="text-[11px] text-[#64748B] hover:text-[#071B46] underline cursor-pointer"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* ================= RIGHT BLOG GRID (2 ON MOBILE, 4 ON DESKTOP) ================= */}
          <main id="blog-grid-section" className="lg:col-span-8 xl:col-span-9">
            {/* Mobile/Tablet Category Status Bar - clean count only without redundant button */}
            <div className="lg:hidden flex items-center justify-between mb-2.5 px-1">
              <div className="text-[11px] text-[#64748B]">
                Showing <strong className="text-[#071B46]">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "guide" : "guides"}
                {selectedCategory !== "all" && (
                  <span className="ml-1 text-[#FF5A0A] font-semibold">in {selectedCategory}</span>
                )}
              </div>
              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="text-[11px] text-[#FF5A0A] font-bold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Results Header (Desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="text-xs text-[#64748B]">
                Showing <strong className="text-[#071B46]">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "guide" : "guides"}
                {selectedCategory !== "all" && (
                  <span> in <strong className="capitalize text-[#FF5A0A]">{selectedCategory}</strong></span>
                )}
              </div>
              {(selectedCategory !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="text-xs text-[#FF5A0A] hover:underline font-semibold"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#DCE2EB] shadow-xs">
                <BookOpen size={40} className="text-[#94A3B8] mx-auto mb-2" />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#071B46", margin: "0 0 4px 0" }}>
                  No research guides found
                </h3>
                <p style={{ fontSize: "13px", color: "#667085", margin: 0 }}>
                  Try adjusting your search keyword or selecting a different category.
                </p>
              </div>
            ) : (
              /* 2 BLOGS IN MOBILE, 4 IN HORIZONTAL ON DESKTOP */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {filteredArticles.map((a) => (
                  <BlogCard key={a.slug} article={a} compact={true} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
