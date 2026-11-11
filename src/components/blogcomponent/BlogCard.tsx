"use client";

import React from "react";
import Link from "next/link";
import { Clock, Eye, ChevronRight } from "lucide-react";
import { paths } from "@/lib/routing";
import type { BlogArticle } from "@/lib/cms";

interface BlogCardProps {
  article: BlogArticle;
}

export function BlogCard({ article: a }: BlogCardProps) {
  return (
    <Link
      href={paths.blogPost(a.slug)}
      className="group flex flex-col bg-white border border-[#DCE2EB] hover:border-[#FF5A0A] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 no-underline"
    >
      {/* Featured Thumbnail */}
      {a.featuredImage ? (
        <div className="w-full h-44 overflow-hidden bg-[#F8FAFC] relative">
          <img
            src={a.featuredImage}
            alt={a.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </div>
      ) : null}

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
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
  );
}

