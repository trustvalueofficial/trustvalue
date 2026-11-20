"use client";

import React from "react";
import Link from "next/link";
import { Clock, Eye, ChevronRight } from "lucide-react";
import { paths } from "@/lib/routing";
import type { BlogArticle } from "@/lib/cms";

interface BlogCardProps {
  article: BlogArticle;
  compact?: boolean;
}

export function BlogCard({ article: a, compact = false }: BlogCardProps) {
  const category = a.sector || a.categorySlug || "general";
  return (
    <Link
      href={paths.blogPost(category, a.slug)}
      className="group flex flex-col bg-white border border-[#DCE2EB] hover:border-[#FF5A0A] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 no-underline h-full"
    >
      {/* Featured Thumbnail */}
      {a.featuredImage ? (
        <div className={`w-full ${compact ? "h-24 sm:h-32" : "h-28 sm:h-44"} overflow-hidden bg-[#F8FAFC] relative shrink-0`}>
          <img
            src={a.featuredImage}
            alt={a.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement)?.style.setProperty("display", "none");
            }}
          />
        </div>
      ) : null}

      <div className={`${compact ? "p-2 sm:p-3" : "p-2.5 sm:p-4"} flex-1 flex flex-col justify-between`}>
        <div>
          {/* Meta Header */}
          <div className="flex justify-between items-center mb-1 sm:mb-2 gap-1">
            <span
              className={`px-1.5 py-0.5 rounded-md bg-[#EEF2F7] border border-[#DCE2EB] ${
                compact ? "text-[8px] sm:text-[9.5px]" : "text-[8.5px] sm:text-[10px]"
              } font-bold uppercase tracking-wider text-[#071B46] truncate max-w-[70px] sm:max-w-[120px]`}
            >
              {a.sector}
            </span>
            <div
              className={`flex items-center gap-1 sm:gap-2 ${
                compact ? "text-[8.5px] sm:text-[10px]" : "text-[9px] sm:text-[11px]"
              } text-[#667085] shrink-0`}
            >
              <span className="flex items-center gap-0.5">
                <Clock size={compact ? 9 : 11} /> {a.readTime || "5m"}
              </span>
              {a.views ? (
                <span className="hidden sm:flex items-center gap-0.5">
                  <Eye size={compact ? 9 : 11} /> {a.views}
                </span>
              ) : null}
            </div>
          </div>

          {/* Card Title */}
          <div
            className="font-bold text-[#071B46] group-hover:text-[#FF5A0A] transition-colors line-clamp-2 text-xs sm:text-[13.5px] leading-snug sm:leading-[1.35] mb-1 sm:mb-1.5"
          >
            {a.title}
          </div>

          {/* Card Excerpt / Summary */}
          {(a.summary || a.seo?.description) ? (
            <p
              className="line-clamp-2 text-[10px] sm:text-[11.5px] text-[#46526B] leading-tight sm:leading-relaxed mb-1.5 sm:mb-2"
            >
              {a.summary || a.seo?.description}
            </p>
          ) : null}
        </div>

        {/* Card Footer */}
        <div
          className={`flex justify-between items-center pt-1.5 sm:pt-2 border-t border-[#EEF2F7] mt-auto ${
            compact ? "text-[8.5px] sm:text-[10px]" : "text-[9px] sm:text-[11px]"
          } text-[#667085]`}
        >
          <span className="truncate max-w-[65px] sm:max-w-[110px]">By {a.author || "Research"}</span>
          <span className="flex items-center gap-0.5 text-[#FF5A0A] font-bold group-hover:translate-x-0.5 transition-transform text-[10px] sm:text-xs">
            Read <ChevronRight size={compact ? 10 : 12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
