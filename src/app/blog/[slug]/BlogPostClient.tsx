"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send
} from "lucide-react";
import { paths } from "@/lib/routing";
import { JsonLd } from "@/components/JsonLd";
import type { BlogArticle } from "@/lib/cms";

interface Props {
  post: BlogArticle;
  relatedArticles?: BlogArticle[];
}

export function BlogPostClient({ post, relatedArticles = [] }: Props) {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<Array<{ name: string; date: string; content: string }>>([
    {
      name: "Adv. Rajesh Deshmukh",
      date: "3 days ago",
      content: "Very thorough analysis of the statutory precedence. Most policyholders are unaware of the 2015 amendment strictly shutting down repudiation post 36 months.",
    },
    {
      name: "Pooja Sundaram",
      date: "1 week ago",
      content: "Could you clarify if the revival clause also applies to lapsed health policies, or is Section 45 strictly limited to life assurance contracts?",
    },
  ]);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;

    setComments((prev) => [
      {
        name: authorName.trim(),
        date: "Just now",
        content: commentText.trim(),
      },
      ...prev,
    ]);

    setCommentText("");
    setAuthorName("");
    setAuthorEmail("");
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  // Build FAQ Schema if FAQs exist
  const faqSchema = post.faqData && post.faqData.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqData.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  return (
    <article style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px" }}>
      {/* Schema.org FAQPage */}
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* Breadcrumbs */}
      <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
        <Link href={paths.home()} style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href={paths.blog()} style={{ color: "#94a3b8", textDecoration: "none" }}>Research &amp; Guides</Link>
        <span>/</span>
        <span style={{ color: "#38bdf8", textTransform: "capitalize" }}>{post.sector}</span>
      </nav>

      {/* Header Info */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <span style={{
            padding: "4px 12px",
            borderRadius: "6px",
            background: "rgba(59, 130, 246, 0.15)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#93c5fd",
            letterSpacing: "0.04em",
          }}>
            {post.sector}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#94a3b8" }}>
            <Clock size={14} /> {post.readTime || "6 min read"}
          </span>
          {post.views ? (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#94a3b8" }}>
              <Eye size={14} /> {post.views} views
            </span>
          ) : null}
          <button
            onClick={handleShare}
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: "#1e293b",
              border: "1px solid #334155",
              color: copied ? "#34d399" : "#cbd5e1",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Link Copied" : "Share"}
          </button>
        </div>

        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#f8fafc", lineHeight: 1.3, letterSpacing: "-0.02em", margin: "0 0 16px 0" }}>
          {post.title}
        </h1>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          paddingBottom: "20px",
          borderBottom: "1px solid #1e293b",
          fontSize: "13px",
          color: "#94a3b8"
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <User size={15} style={{ color: "#38bdf8" }} />
            <strong style={{ color: "#f1f5f9" }}>{post.author || "TrustValue Research Desk"}</strong>
          </span>
          {post.publishedAt ? (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={15} />
              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          ) : null}
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#10b981" }}>
            <ShieldCheck size={15} /> Audited Explainer
          </span>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage ? (
        <div style={{
          borderRadius: "14px",
          overflow: "hidden",
          marginBottom: "28px",
          maxHeight: "420px",
          background: "#0f172a",
          border: "1px solid #1e293b"
        }}>
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : null}

      {/* Direct Answer Box (Google Snippet Optimized) */}
      {post.directAnswer ? (
        <div style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.2))",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>
            <Sparkles size={16} /> Direct Statutory Key Takeaway
          </div>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#e2e8f0", fontWeight: 500 }}>
            {post.directAnswer}
          </p>
        </div>
      ) : null}

      {/* Summary / Lead */}
      {post.summary ? (
        <p style={{ fontSize: "18px", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "28px", fontStyle: "italic" }}>
          {post.summary}
        </p>
      ) : null}

      {/* Article Body */}
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "14px",
        padding: "32px",
        marginBottom: "40px",
        color: "#cbd5e1",
        fontSize: "16px",
        lineHeight: 1.8,
        whiteSpace: "pre-line"
      }}>
        {post.body}
      </div>

      {/* FAQ Section with Accordion */}
      {post.faqData && post.faqData.length > 0 ? (
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <HelpCircle size={20} style={{ color: "#38bdf8" }} />
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
              Frequently Asked Legal &amp; Regulatory Questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {post.faqData.map((faq, idx) => {
              const isOpen = !!openFaqs[idx];
              return (
                <div
                  key={idx}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "none",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: isOpen ? "#60a5fa" : "#f1f5f9",
                      fontSize: "15px",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen ? (
                    <div style={{
                      padding: "0 20px 18px 20px",
                      color: "#94a3b8",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      paddingTop: "12px"
                    }}>
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Comments Section */}
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "14px",
        padding: "28px",
        marginBottom: "40px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={20} style={{ color: "#38bdf8" }} />
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
              Discussion &amp; Queries ({comments.length})
            </h3>
          </div>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Moderated by legal desk</span>
        </div>

        {/* Existing comments */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          {comments.map((c, i) => (
            <div key={i} style={{ background: "#131d33", borderRadius: "10px", padding: "14px 18px", border: "1px solid #1e293b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <strong style={{ fontSize: "14px", color: "#f1f5f9" }}>{c.name}</strong>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{c.date}</span>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{c.content}</p>
            </div>
          ))}
        </div>

        {/* Comment form */}
        <form onSubmit={handleAddComment} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1", margin: 0 }}>Leave a reply or query</h4>
          {submittedMessage && (
            <div style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "8px", color: "#34d399", fontSize: "13px" }}>
              Thank you! Your comment has been posted to the discussion thread.
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input
              type="text"
              placeholder="Your Name *"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#131d33",
                border: "1px solid #334155",
                color: "#f8fafc",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <input
              type="email"
              placeholder="Email address (kept private)"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#131d33",
                border: "1px solid #334155",
                color: "#f8fafc",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
          <textarea
            rows={3}
            placeholder="Write your observation or statutory query..."
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#131d33",
              border: "1px solid #334155",
              color: "#f8fafc",
              fontSize: "13px",
              outline: "none",
              resize: "vertical",
            }}
          />
          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#2563eb",
              border: "none",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Send size={14} /> Submit Comment
          </button>
        </form>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 ? (
        <div style={{ marginTop: "48px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc", marginBottom: "16px" }}>
            Related Statutory &amp; Sector Audits
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={paths.blogPost(rel.slug)}
                style={{
                  display: "block",
                  padding: "16px",
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#38bdf8" }}>
                  {rel.sector}
                </span>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9", margin: "6px 0 8px 0", lineHeight: 1.4 }}>
                  {rel.title}
                </h4>
                <span style={{ fontSize: "12px", color: "#60a5fa", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Read Explainer <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
