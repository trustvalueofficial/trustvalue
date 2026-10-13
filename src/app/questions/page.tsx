import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { QUESTIONS } from "@/lib/prototypeData";

export const metadata: Metadata = {
  title: "Life insurance questions and answers | TrustValue",
  description: "Real questions about life insurers and plans in India, answered with sources.",
};

export default function QuestionsIndexPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Questions</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Q&amp;A Hub</p>
        <h1>Questions and answers</h1>
        <p className="lead">
          Real questions asked by policyholders and answered by verified reviewers and TrustValue editors.
        </p>
        <div className="row" style={{ marginTop: "16px" }}>
          <Link className="btn btn-primary" href="/questions/ask">Ask a question</Link>
        </div>
      </header>

      <div className="list">
        {QUESTIONS.map((q) => (
          <Link key={q.slug} className="li" href={`/questions/${q.slug}`}>
            <span className="li-main">
              <b>{q.q}</b>
              <span>{q.topic} · Answered by {q.by}</span>
            </span>
            <span className="tag tag-green">Answered</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
