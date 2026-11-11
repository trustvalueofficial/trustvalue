"use client";

import React from "react";
import Link from "next/link";
import { ListOrdered, ChevronDown, ShieldCheck } from "lucide-react";
import { paths } from "@/lib/routing";

export interface TocItem {
  id: string;
  label: string;
}

interface BlogTableOfContentsProps {
  tocItems: TocItem[];
  activeId: string;
  readingProgress: number;
  mobileTocOpen: boolean;
  onToggleMobileToc: () => void;
  onSelectSection: (e: React.MouseEvent, id: string) => void;
}

/**
 * Desktop Sticky Table of Contents (Left Column)
 */
export function DesktopTableOfContents({
  tocItems,
  activeId,
  readingProgress,
  onSelectSection,
}: {
  tocItems: TocItem[];
  activeId: string;
  readingProgress: number;
  onSelectSection: (e: React.MouseEvent, id: string) => void;
}) {
  return (
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
                onClick={(e) => onSelectSection(e, item.id)}
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
  );
}

/**
 * Mobile Collapsible Table of Contents (< 1024px)
 */
export function MobileTableOfContents({
  tocItems,
  activeId,
  mobileTocOpen,
  onToggleMobileToc,
  onSelectSection,
}: {
  tocItems: TocItem[];
  activeId: string;
  mobileTocOpen: boolean;
  onToggleMobileToc: () => void;
  onSelectSection: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <div className="lg:hidden mt-4 mb-6 bg-white border border-[#DCE2EB] rounded-xl overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={onToggleMobileToc}
        style={{ padding: "14px 18px", width: "100%" }}
        className="w-full flex items-center justify-between text-left font-bold text-xs text-[#071B46] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <ListOrdered size={16} className="text-[#FF5A0A] shrink-0" />
          <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#071B46" }}>
            Table of Contents
          </span>
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
                onClick={(e) => onSelectSection(e, item.id)}
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
  );
}

