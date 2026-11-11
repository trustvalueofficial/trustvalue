"use client";

import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export interface CommentItem {
  name: string;
  date: string;
  content: string;
}

interface BlogDiscussionSectionProps {
  comments: CommentItem[];
  onAddComment: (comment: { name: string; email?: string; content: string }) => void;
}

export function BlogDiscussionSection({
  comments,
  onAddComment,
}: BlogDiscussionSectionProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;

    onAddComment({
      name: authorName.trim(),
      email: authorEmail.trim(),
      content: commentText.trim(),
    });

    setCommentText("");
    setAuthorName("");
    setAuthorEmail("");
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div
      id="discussion"
      className="scroll-mt-24 bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-6 mb-6 shadow-xs"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <MessageSquare size={16} className="text-[#071B46]" />
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#071B46",
              margin: 0,
            }}
          >
            Discussion &amp; Queries ({comments.length})
          </h3>
        </div>
        <span className="text-[10px] text-[#667085] font-medium bg-[#EEF2F7] px-2 py-0.5 rounded-full">
          Moderated
        </span>
      </div>

      {/* Existing comments */}
      <div className="flex flex-col gap-2.5 mb-5">
        {comments.map((c, i) => (
          <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <strong style={{ fontSize: "13px", color: "#071B46" }} className="font-bold">
                {c.name}
              </strong>
              <span className="text-[10px] text-[#667085]">{c.date}</span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#334155", margin: 0 }}>
              {c.content}
            </p>
          </div>
        ))}
      </div>

      {/* Comment submission form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#071B46", margin: 0 }}>
          Leave a query or observation
        </h4>
        {submittedMessage && (
          <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-[#065F46] text-xs font-semibold">
            Thank you! Your query has been submitted for review.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="text"
            placeholder="Your Name *"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{ fontSize: "13px" }}
            className="p-2 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A]"
          />
          <input
            type="email"
            placeholder="Email address (kept private)"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            style={{ fontSize: "13px" }}
            className="p-2 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A]"
          />
        </div>
        <textarea
          rows={3}
          placeholder="Write your observation or statutory query..."
          required
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ fontSize: "13px" }}
          className="p-2 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#071B46] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A0A] resize-y"
        />
        <button
          type="submit"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 22px",
            backgroundColor: "#071B46",
            color: "#FFFFFF",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="self-start shadow-xs hover:!bg-[#FF5A0A] hover:!text-white active:scale-[0.98]"
        >
          <Send size={14} className="shrink-0 text-white" />
          <span>Submit Query</span>
        </button>
      </form>
    </div>
  );
}

