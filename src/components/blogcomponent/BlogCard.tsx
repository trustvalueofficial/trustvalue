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
        <div className={`w-full ${compact ? "h-32" : "h-44"} overflow-hidden bg-[#F8FAFC] relative`}>
          <img
            src={a.featuredImage}
            alt={a.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </div>
      ) : null}

      <div className={`${compact ? "p-3 sm:p-3.5" : "p-4 sm:p-5"} flex-1 flex flex-col`}>
        {/* Meta Header */}
        <div className="flex justify-between items-center mb-2">
          <span
            className={`px-2 py-0.5 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] ${
              compact ? "text-[9px]" : "text-[10px]"
            } font-bold uppercase tracking-wider text-[#071B46] truncate max-w-[130px]`}
          >
            {a.sector}
          </span>
          <div
            className={`flex items-center gap-2 ${
              compact ? "text-[10px]" : "text-[11px]"
            } text-[#667085]`}
          >
            <span className="flex items-center gap-0.5">
              <Clock size={compact ? 10 : 11} /> {a.readTime || "5 min read"}
            </span>
            {a.views ? (
              <span className="flex items-center gap-0.5">
                <Eye size={compact ? 10 : 11} /> {a.views}
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Title */}
        <div
          className="font-bold text-[#071B46] group-hover:text-[#FF5A0A] transition-colors line-clamp-2"
          style={{
            fontSize: compact ? "13px" : "15px",
            fontWeight: 700,
            lineHeight: "1.35",
            margin: "0 0 6px 0",
          }}
        >
          {a.title}
        </div>

        {/* Direct Answer snippet highlight if present */}
        {a.directAnswer ? (
          <div
            className={`p-2 bg-[#ECFDF5] border-l-2 border-[#10B981] rounded-r-md mb-2 line-clamp-2`}
            style={{ fontSize: compact ? "11px" : "12px", lineHeight: "1.4", color: "#065F46" }}
          >
            <strong style={{ color: "#0A8754", display: "inline", marginRight: "4px" }}>
              Takeaway:
            </strong>
            {a.directAnswer}
          </div>
        ) : (
          <p
            style={{
              fontSize: compact ? "11.5px" : "13px",
              color: "#46526B",
              lineHeight: "1.45",
              margin: "0 0 8px 0",
            }}
            className="flex-1 line-clamp-2"
          >
            {a.summary}
          </p>
        )}

        {/* Card Footer */}
        <div
          className={`flex justify-between items-center pt-2 border-t border-[#EEF2F7] mt-auto ${
            compact ? "text-[10px]" : "text-[11px]"
          } text-[#667085]`}
        >
          <span className="truncate max-w-[110px]">By {a.author || "Research Desk"}</span>
          <span className="flex items-center gap-0.5 text-[#FF5A0A] font-bold group-hover:translate-x-0.5 transition-transform text-xs">
            Read <ChevronRight size={compact ? 11 : 13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
