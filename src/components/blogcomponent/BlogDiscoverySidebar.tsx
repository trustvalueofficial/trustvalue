"use client";

import React from "react";
import Link from "next/link";
import { Flame, Layers, TrendingUp, Award, Clock, Eye, Star, ChevronRight } from "lucide-react";
import { paths } from "@/lib/routing";
import type { BlogArticle } from "@/lib/cms";

// Universal Top Categories
export const UNIVERSAL_TOP_CATEGORIES = [
  {
    name: "Term Life Insurance",
    sector: "insurance",
    href: "/insurance",
    count: "26 Insurers",
    metric: "98.4% Avg Settlement",
  },
  {
    name: "Home Loans & RERA Escrow",
    sector: "banking",
    href: "/banking",
    count: "18 Banks",
    metric: "8.35% Base Repo Spread",
  },
  {
    name: "Cashless Health Portability",
    sector: "healthcare",
    href: "/healthcare",
    count: "14,000+ Hospitals",
    metric: "1 hr Discharge SLA",
  },
  {
    name: "EV Battery Warranty Audits",
    sector: "automobiles",
    href: "/automobiles",
    count: "12 OEM Brands",
    metric: "8-Yr Degradation Guarantee",
  },
  {
    name: "RERA Carpet Area Standards",
    sector: "real-estate",
    href: "/real-estate",
    count: "4,200+ Projects",
    metric: "Zero Super-Builtup Deviation",
  },
];

// Popular Guides across all sectors
export const POPULAR_GUIDES = [
  {
    slug: "rera-carpet-area-vs-built-up-guide",
    title: "MahaRERA Carpet Area Standard: How to Avoid Paying for Balcony Super-Builtup",
    sector: "real-estate",
    views: 2980,
    readTime: "8 min read",
  },
  {
    slug: "nabh-cashless-hospital-turnaround-times",
    title: "Cashless Hospitalization Standards: What NABH Accreditations Mean for Your Discharge",
    sector: "healthcare",
    views: 1845,
    readTime: "5 min read",
  },
  {
    slug: "banking-ombudsman-failed-upi-chargeback-timeline",
    title: "RBI CMS Framework: Reclaiming Disputed UPI & NetBanking Debits Within 48 Hours",
    sector: "banking",
    views: 3420,
    readTime: "7 min read",
  },
];

// Daily Top Brands based on review score
export const DAILY_TOP_BRANDS = [
  {
    name: "HDFC Life Insurance",
    sector: "insurance",
    score: 96.4,
    rating: 4.9,
    reviews: 18420,
    badge: "99.3% Settlement",
    href: "/insurance/brands/hdfc-life",
  },
  {
    name: "Tata Motors EV",
    sector: "automobiles",
    score: 94.8,
    rating: 4.8,
    reviews: 12180,
    badge: "8-Yr Battery SLA",
    href: "/automobiles/brands/tata-motors",
  },
  {
    name: "State Bank of India",
    sector: "banking",
    score: 92.5,
    rating: 4.7,
    reviews: 24510,
    badge: "Lowest Foreclosure Fee",
    href: "/banking/brands/sbi",
  },
];

export interface PopularPostItem {
  slug: string;
  title: string;
  sector?: string;
  views?: number;
  readTime?: string;
}

interface BlogDiscoverySidebarProps {
  sector?: string;
  latestCategoryPosts: Array<{
    slug: string;
    title: string;
    readTime?: string;
  }>;
  popularPosts?: PopularPostItem[];
}

export function BlogDiscoverySidebar({
  sector = "general",
  latestCategoryPosts,
  popularPosts = POPULAR_GUIDES,
}: BlogDiscoverySidebarProps) {
  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-5">
      {/* 1. LATEST BLOG IN THE SAME CATEGORY */}
      <div className="bg-white border border-[#DCE2EB] rounded-2xl p-4 xl:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEF2F7]">
          <div className="flex items-center gap-1.5">
            <Flame size={15} className="text-[#FF5A0A]" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#071B46] m-0">
              Latest in {sector}
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
                <strong
                  style={{ fontSize: "12px", color: "#071B46" }}
                  className="group-hover:text-[#FF5A0A] block leading-snug transition-colors"
                >
                  {cat.name}
                </strong>
                <span className="text-[10px] text-[#667085]">
                  {cat.count} • <span className="text-[#0A8754] font-medium">{cat.metric}</span>
                </span>
              </div>
              <ChevronRight
                size={13}
                className="text-[#CBD5E1] group-hover:text-[#FF5A0A] shrink-0 transition-colors"
              />
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
                  <span className="flex items-center gap-0.5">
                    <Eye size={10} /> {pop.views || 2400}
                  </span>
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
        <div className="flex items-center justify-between mb-1 pb-2 border-b border-[#EEF2F7]">
          <div className="flex items-center gap-1.5">
            <Award size={15} className="text-[#FF5A0A]" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#071B46] m-0">
              Daily Top Brands
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-[#0A8754] bg-[#ECFDF5] px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live
          </span>
        </div>
        <p className="text-[10px] text-[#667085] mb-3">
          Ranked by 50,000+ audited reviews &amp; claim settlement telemetry
        </p>

        <div className="flex flex-col gap-2.5">
          {DAILY_TOP_BRANDS.map((brand, bIdx) => (
            <Link
              key={bIdx}
              href={brand.href}
              className="group block p-2.5 rounded-xl border border-[#EEF2F7] hover:border-[#DCE2EB] hover:bg-[#FAFBFD] transition-all no-underline"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{ fontSize: "12px", fontWeight: 700, color: "#071B46" }}
                  className="group-hover:text-[#FF5A0A] transition-colors"
                >
                  {brand.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#0A8754] text-[10px] font-bold border border-[#A7F3D0]">
                  {brand.score}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#667085]">
                <span className="flex items-center gap-1 font-semibold text-[#B45309]">
                  <Star size={10} className="fill-[#F59E0B] text-[#F59E0B]" />
                  {brand.rating}{" "}
                  <span className="text-[#94A3B8] font-normal">
                    ({brand.reviews.toLocaleString()})
                  </span>
                </span>
                <span className="text-[#071B46] font-medium">{brand.badge}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

