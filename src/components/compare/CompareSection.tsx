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

        {/* Quick Dropdown Combobox */}
        {allEligibleOptions.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <label htmlFor="quick-compare-select" className="text-xs font-semibold text-[#46526B] hidden sm:inline">
              Quick Compare:
            </label>
            <select
              id="quick-compare-select"
              value={selectedPeer}
              onChange={handleQuickSelect}
              className="text-xs font-medium text-[#071B46] bg-white border border-[#DCE2EB] rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:border-[#FF5A0A] cursor-pointer"
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
          </div>
        )}
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

      {/* Duel Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3">
        {activePeers.slice(0, 3).map((peer) => {
          const baseHref = peer.href || getCompareUrl(peer.slug);
          const compareUrl = baseHref.includes("lock=")
            ? baseHref
            : `${baseHref}${baseHref.includes("?") ? "&" : "?"}lock=${encodeURIComponent(currentSlug)}`;
          return (
            <div
              key={peer.slug}
              className="bg-white border border-[#DCE2EB] rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top duel header with VS pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-[#EEF2F7] text-[#071B46] font-black text-xs flex items-center justify-center flex-shrink-0">
                      {currentName.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#FF5A0A] text-white flex-shrink-0">
                      VS
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#071B46] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      {peer.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {peer.deltaBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4F4EC] text-[#075E3B] border border-[#B9E6CF] flex-shrink-0">
                      {peer.deltaBadge}
                    </span>
                  )}
                </div>

                <div className="text-xs font-extrabold text-[#071B46] line-clamp-1">
                  {peer.name}
                </div>
                <div className="text-[11px] text-[#667085] mt-0.5">
                  {peer.providerName ? `by ${peer.providerName}` : `Alternative ${categoryName}`}
                </div>

                {peer.metricsSnippet && (
                  <p className="text-[11px] text-[#46526B] mt-2 line-clamp-2 leading-relaxed bg-[#FAFBFD] p-2 rounded-lg border border-[#F1F3F7]">
                    {peer.metricsSnippet}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#F1F3F7]">
                <Link
                  href={compareUrl}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold text-[#071B46] bg-[#EEF2F7] hover:bg-[#FF5A0A] hover:text-white rounded-lg transition-colors group"
                >
                  <span>Compare Head-to-Head</span>
                  <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5" />
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
