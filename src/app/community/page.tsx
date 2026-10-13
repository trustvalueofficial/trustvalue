"use client";

import React from "react";
import Link from "next/link";
import { loadStore, getLiveReviews } from "@/lib/prototypeData";

export default function CommunityPage() {
  const store = loadStore();
  const reviews = getLiveReviews(store, () => true);

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Community</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Consumer Voice</p>
        <h1>Policyholder community</h1>
        <p className="lead">
          Real policyholders sharing claim experiences, customer service feedback, and contract audits.
        </p>
        <div className="row" style={{ marginTop: "16px" }}>
          <Link className="btn btn-primary" href="/write-review">Write a review</Link>
          <Link className="btn btn-ghost" href="/questions/ask">Ask a question</Link>
        </div>
      </header>

      <section className="section-tight">
        <div className="shead">
          <h2>Latest reviews from policyholders</h2>
        </div>

        {reviews.length > 0 ? (
          <div className="stack">
            {reviews.map((r) => (
              <article key={r.id} className="review">
                <div className="review-head">
                  <span className="tag tag-green">{r.verify}</span>
                  <span className="tiny faint" style={{ marginLeft: "auto" }}>
                    {new Date(r.created).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ marginTop: "10px" }}>{r.title}</h3>
                <p className="body">{r.body}</p>
                <p className="small muted" style={{ marginTop: "8px" }}>
                  By @{r.author} · Insurer: {r.insurer}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No community reviews yet</h3>
            <p>Be the first verified customer to contribute your rating and experience.</p>
            <Link className="btn btn-primary btn-sm" style={{ marginTop: "12px" }} href="/write-review">
              Write the first review
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
