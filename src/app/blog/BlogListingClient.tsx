"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, Eye, Sparkles, BookOpen, MessageSquare, ChevronRight } from "lucide-react";
import { paths } from "@/lib/routing";
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
    <div className="blog-portal" style={{ maxWidth: "1140px", margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(37, 99, 235, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#60a5fa",
          marginBottom: "14px"
        }}>
          <Sparkles size={14} /> TrustValue Legal &amp; Regulatory Intelligence
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em", color: "#f8fafc", margin: "0 0 12px 0" }}>
          Research &amp; Regulatory Guides
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
          Evidence-backed statutory explainers, IRDAI/RERA/SEBI circular breakdowns, and consumer protection playbooks audited by our research desk.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "32px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setSelectedSector("all")}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: selectedSector === "all" ? "#2563eb" : "#1e293b",
              color: selectedSector === "all" ? "#ffffff" : "#94a3b8",
              border: selectedSector === "all" ? "1px solid #3b82f6" : "1px solid #334155",
            }}
          >
            All Sectors ({articles.length})
          </button>
          {sectors.map((s) => {
            const count = articles.filter((a) => a.sector?.toLowerCase() === s).length;
            const active = selectedSector === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedSector(s)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: active ? "#2563eb" : "#1e293b",
                  color: active ? "#ffffff" : "#94a3b8",
                  border: active ? "1px solid #3b82f6" : "1px solid #334155",
                }}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px", maxWidth: "380px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            type="text"
            placeholder="Search regulations, laws, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "8px",
              background: "#131d33",
              border: "1px solid #334155",
              color: "#f8fafc",
              fontSize: "13px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px", background: "#0f172a", borderRadius: "14px", border: "1px solid #1e293b" }}>
          <BookOpen size={40} style={{ color: "#475569", margin: "0 auto 16px auto" }} />
          <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>No research guides found</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Try adjusting your sector filter or search keyword.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filteredArticles.map((a) => (
            <Link
              key={a.slug}
              href={paths.blogPost(a.slug)}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "14px",
                overflow: "hidden",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              className="hover:border-blue-500/40 hover:shadow-lg"
            >
              {/* Featured Image */}
              {a.featuredImage ? (
                <div style={{ height: "180px", overflow: "hidden", background: "#131d33" }}>
                  <img
                    src={a.featuredImage}
                    alt={a.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                  />
                </div>
              ) : null}

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Meta Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#93c5fd",
                    letterSpacing: "0.04em",
                  }}>
                    {a.sector}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#64748b" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> {a.readTime || "5 min read"}
                    </span>
                    {a.views ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Eye size={12} /> {a.views}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", lineHeight: 1.4, margin: "0 0 10px 0" }}>
                  {a.title}
                </h2>

                {/* Direct Answer snippet highlight if present */}
                {a.directAnswer ? (
                  <div style={{
                    padding: "10px 12px",
                    background: "rgba(16, 185, 129, 0.08)",
                    borderLeft: "3px solid #10b981",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#a7f3d0",
                    lineHeight: 1.5,
                    marginBottom: "12px"
                  }}>
                    <strong style={{ color: "#34d399", display: "block", marginBottom: "2px" }}>Direct Statutory Answer:</strong>
                    {a.directAnswer.length > 120 ? a.directAnswer.slice(0, 120) + "..." : a.directAnswer}
                  </div>
                ) : (
                  <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 16px 0", flex: 1 }}>
                    {a.summary}
                  </p>
                )}

                {/* Card Footer */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "14px",
                  borderTop: "1px solid #1e293b",
                  marginTop: "auto",
                  fontSize: "12px",
                  color: "#64748b"
                }}>
                  <span>By {a.author || "Research Desk"}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#60a5fa", fontWeight: 600 }}>
                    Read Guide <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
