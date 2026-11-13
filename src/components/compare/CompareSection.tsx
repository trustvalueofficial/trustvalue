"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/routing";

export interface ComparePeerItem {
  slug: string;
  name: string;
  providerSlug?: string;
  providerName?: string;
  categorySlug?: string;
  deltaBadge?: string;
  metricsSnippet?: string;
  href?: string;
}

export interface CompareSectionProps {
  sectorSlug: string;
  sectorName?: string;
  entityType: "brand" | "product" | "plan" | "segment";
  currentSlug: string;
  currentName: string;
  categorySlug?: string;
  categoryName?: string;
  providerSlug?: string;
  providerName?: string;
  crossBrandPeers?: ComparePeerItem[];
  sameBrandPeers?: ComparePeerItem[];
  allEligibleOptions?: { slug: string; name: string; brandName?: string }[];
}

export default function CompareSection({
  sectorSlug,
  sectorName = "Insurance",
  entityType = "plan",
  currentSlug,
  currentName,
  categorySlug = "health/individual-health",
  categoryName = "Plan",
  providerSlug,
  providerName,
  crossBrandPeers = [],
  sameBrandPeers = [],
  allEligibleOptions = [],
}: CompareSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"rivals" | "internal">("rivals");
  const [selectedPeer, setSelectedPeer] = useState<string>("");

  const isBrand = entityType === "brand";
  const hasTabs = !isBrand && sameBrandPeers.length > 0 && crossBrandPeers.length > 0;
  const activePeers = activeTab === "internal" ? sameBrandPeers : crossBrandPeers;

  const compareScrollRef = React.useRef<HTMLDivElement>(null);
  const scrollCompare = (dir: "left" | "right") => {
    if (compareScrollRef.current) {
      const amount = 280;
      compareScrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Compute canonical comparison URL for any target peer with source entity locked
  const getCompareUrl = (targetSlug: string) => {
    if (isBrand) {
      const sorted = [currentSlug, targetSlug].sort();
      return `${paths.compareProviders(sectorSlug, sorted.join("-vs-"))}?lock=${encodeURIComponent(currentSlug)}`;
    }
    const cat = categorySlug.split("/").pop() || categorySlug;
    const sorted = [currentSlug, targetSlug].sort();
    return `${paths.compareOfferings(sectorSlug, cat, sorted.join("-vs-"))}?lock=${encodeURIComponent(currentSlug)}`;
  };

  const handleQuickSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPeer(val);
    if (val) {
      router.push(getCompareUrl(val));
    }
  };

  return (
    <section id="compare-matrix" className="py-5 sm:py-6 border-b border-[#DCE2EB] scroll-mt-20">
      {/* Header with Comparison Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#FFF4ED] text-[#FF5A0A] border border-[#FFD8C2]">
            <i className="fa-solid fa-arrows-split-up-and-left text-[10px]" />
            Dynamic Head-to-Head Engine
          </div>
          <h2 className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight mt-1.5">
            {isBrand
              ? `Compare ${currentName} with Top Competitors`
              : `Compare ${currentName} Side-by-Side`}
          </h2>
          <p className="text-xs text-[#46526B] mt-0.5">
            {isBrand
              ? `Benchmark claim settlement ratios, solvency margins, and audited track records.`
              : `Evaluate coverage limits, waiting periods, and deductibles with 0% biased scoring.`}
          </p>
        </div>

        {/* Right side controls: Quick Dropdown and Carousel Navigation */}
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          {/* Carousel Arrows when more than 3 peers */}
          {activePeers.length > 3 && (
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => scrollCompare("left")}
                className="w-7 h-7 rounded-full border border-[#DCE2EB] bg-white text-[#071B46] hover:bg-[#F2F4F7] hover:border-[#98A2B3] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll left"
              >
                <i className="fa-solid fa-chevron-left text-[11px]" />
              </button>
              <button
                type="button"
                onClick={() => scrollCompare("right")}
                className="w-7 h-7 rounded-full border border-[#DCE2EB] bg-white text-[#071B46] hover:bg-[#F2F4F7] hover:border-[#98A2B3] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll right"
              >
                <i className="fa-solid fa-chevron-right text-[11px]" />
              </button>
            </div>
          )}

          {/* Quick Dropdown Combobox */}
          {allEligibleOptions.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <label htmlFor="quick-compare-select" className="text-xs font-bold text-[#46526B] hidden sm:inline">
                Quick Compare:
              </label>
              <div className="relative">
                <select
                  id="quick-compare-select"
                  value={selectedPeer}
                  onChange={handleQuickSelect}
                  className="text-xs font-semibold text-[#071B46] bg-white border border-[#DCE2EB] rounded-xl pl-3 pr-8 py-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A0A]/20 focus:border-[#FF5A0A] cursor-pointer appearance-none transition-all"
                >
                  <option value="">Compare with another {isBrand ? "brand" : "plan"}...</option>
                  {allEligibleOptions
                    .filter((opt) => opt.slug !== currentSlug)
                    .map((opt) => (
                      <option key={opt.slug} value={opt.slug}>
                        {opt.brandName ? `${opt.name} (${opt.brandName})` : opt.name}
                      </option>
                    ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#667085] pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Plan/Product (Cross-Brand vs Sibling) */}
      {hasTabs && (
        <div className="flex items-center gap-2 mb-4 border-b border-[#DCE2EB] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("rivals")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "rivals"
                ? "bg-[#071B46] text-white shadow-sm"
                : "bg-[#EEF2F7] text-[#46526B] hover:bg-[#E2E8F0]"
            }`}
          >
            <i className="fa-solid fa-code-compare mr-1.5" />
            Against Competing Brands ({crossBrandPeers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "internal"
                ? "bg-[#071B46] text-white shadow-sm"
                : "bg-[#EEF2F7] text-[#46526B] hover:bg-[#E2E8F0]"
            }`}
          >
            <i className="fa-solid fa-layer-group mr-1.5" />
            Within {providerName || "Brand"} Tiers ({sameBrandPeers.length})
          </button>
        </div>
      )}

      {/* Duel Comparison Cards: compact, small, spacious, horizontal scroll after 3 cards */}
      <div
        ref={compareScrollRef}
        className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#DCE2EB transparent",
        }}
      >
        {activePeers.map((peer) => {
          const baseHref = peer.href || getCompareUrl(peer.slug);
          const compareUrl = baseHref.includes("lock=")
            ? baseHref
            : `${baseHref}${baseHref.includes("?") ? "&" : "?"}lock=${encodeURIComponent(currentSlug)}`;
          return (
            <div
              key={peer.slug}
              className="w-[250px] sm:w-[270px] flex-shrink-0 bg-white border border-[#DCE2EB] rounded-2xl p-3.5 shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between snap-start text-left"
            >
              <div>
                {/* Top duel header with compact badges and ample breathing room */}
                <div className="flex items-center justify-between gap-1.5 mb-2.5 pb-2 border-b border-[#F1F4F9]">
                  {/* Duel Brand Badges */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      title={currentName}
                      className="w-6 h-6 rounded-full bg-[#EEF2F7] text-[#071B46] font-extrabold text-[10px] flex items-center justify-center border border-[#DCE2EB] shadow-2xs flex-shrink-0"
                    >
                      {currentName.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[8px] font-black px-1 py-0.5 rounded bg-[#FF5A0A] text-white tracking-wider uppercase flex-shrink-0">
                      VS
                    </span>
                    <span
                      title={peer.name}
                      className="w-6 h-6 rounded-full bg-[#071B46] text-white font-extrabold text-[10px] flex items-center justify-center shadow-2xs flex-shrink-0"
                    >
                      {peer.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Benchmark / CSR Badge */}
                  {peer.deltaBadge && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E4F4EC] text-[#075E3B] border border-[#B9E6CF] whitespace-nowrap flex-shrink-0">
                      <i className="fa-solid fa-circle-check text-[8px] text-[#0A8754]" />
                      <span>{peer.deltaBadge}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xs sm:text-[13px] font-extrabold text-[#071B46] truncate">
                  {peer.name}
                </h3>
                <div className="text-[10px] font-medium text-[#667085] mt-0.5 truncate">
                  {peer.providerName ? `by ${peer.providerName}` : `Alternative ${categoryName}`}
                </div>

                {peer.metricsSnippet && (
                  <div className="mt-2 p-2 rounded-xl bg-[#FAFBFD] border border-[#EEF2F7] text-[10px] text-[#46526B] leading-relaxed line-clamp-2">
                    {peer.metricsSnippet}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2.5 border-t border-[#F1F4F9]">
                <Link
                  href={compareUrl}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold text-[#071B46] bg-[#F4F7FB] hover:bg-[#FF5A0A] hover:text-white rounded-xl border border-[#DCE2EB] hover:border-[#FF5A0A] transition-all duration-200 group/btn shadow-2xs"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "11px",
                  }}
                >
                  <span>Compare Head-to-Head</span>
                  <i className="fa-solid fa-arrow-right text-[9px] transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fallback if no peers populated */}
      {activePeers.length === 0 && (
        <div className="bg-[#FAFBFD] border border-dashed border-[#DCE2EB] rounded-xl p-5 text-center">
          <i className="fa-solid fa-code-compare text-lg text-[#94A3B8] mb-1.5" />
          <p className="text-xs font-semibold text-[#071B46]">
            Select any peer from the quick compare dropdown above to see a full attribute breakdown.
          </p>
        </div>
      )}
    </section>
  );
}
