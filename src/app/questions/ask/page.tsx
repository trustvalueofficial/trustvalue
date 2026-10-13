"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, CheckCircle, ArrowLeft, Send } from "lucide-react";

export default function AskQuestionPage() {
  const [topic, setTopic] = useState("Claims");
  const [insurer, setInsurer] = useState("Any Insurer / General");
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/questions">Questions</Link></li>
          <li><span aria-current="page">Ask a Question</span></li>
        </ol>
      </nav>

      <header className="phead">
        <span className="eyebrow">Community &amp; Editorial Q&amp;A</span>
        <h1 style={{ marginTop: "12px" }}>Ask a Life Insurance Question</h1>
        <p className="lead" style={{ marginTop: "10px" }}>
          Unclear about a clause, exclusion, free-look refund, or claim repudiation reason? Ask our editorial team and community. Verified answers become permanent reference pages.
        </p>
      </header>

      <div className="split" style={{ marginTop: "24px", marginBottom: "64px" }}>
        <div className="card">
          {submitted ? (
            <div className="stack" style={{ padding: "24px 0", textAlign: "center", alignItems: "center" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "var(--green-bg)", display: "grid", placeItems: "center", color: "var(--green)" }}>
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 style={{ marginTop: "12px" }}>Question Submitted</h2>
              <p className="muted" style={{ maxWidth: "46ch", margin: "8px auto 0" }}>
                Our editorial team audits questions against contract terms and IRDAI regulations. You will receive an update once the verified answer is published.
              </p>
              <div className="row" style={{ marginTop: "20px" }}>
                <Link className="btn btn-primary" href="/questions">
                  Browse Questions
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setSubmitted(false);
                    setQuestion("");
                    setDetails("");
                  }}
                >
                  Ask Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="stack-l">
              <div className="field">
                <label htmlFor="q-topic">Topic area</label>
                <div className="select">
                  <select id="q-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option value="Claims">Claim Settlement &amp; Repudiation</option>
                    <option value="Policy Wording">Policy Terms &amp; Exclusions</option>
                    <option value="Free-Look">Free-Look Period &amp; Refunds</option>
                    <option value="Surrender">Surrender Value &amp; Foreclosure</option>
                    <option value="Riders">Critical Illness &amp; Accidental Riders</option>
                    <option value="General">General / Other</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="q-insurer">Insurer (optional)</label>
                <div className="select">
                  <select id="q-insurer" value={insurer} onChange={(e) => setInsurer(e.target.value)}>
                    <option value="Any Insurer / General">General / All Insurers</option>
                    <option value="HDFC Life">HDFC Life</option>
                    <option value="LIC">LIC of India</option>
                    <option value="SBI Life">SBI Life</option>
                    <option value="ICICI Prudential">ICICI Prudential</option>
                    <option value="Max Life">Max Life</option>
                    <option value="Tata AIA">Tata AIA</option>
                    <option value="Ageas Federal">Ageas Federal</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="q-text">Your question in one clear sentence</label>
                <input
                  id="q-text"
                  className="input"
                  type="text"
                  placeholder="e.g. Can an insurer reject a death claim after 3 years under Section 45?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="q-details">Additional context or situation details (optional)</label>
                <textarea
                  id="q-details"
                  className="input"
                  rows={4}
                  style={{ height: "auto", padding: "12px 16px" }}
                  placeholder="Mention relevant policy dates, clauses cited by the insurer, or specific communications."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="q-email">Email (to notify you when answered)</label>
                <input
                  id="q-email"
                  className="input"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Submit question for verification
              </button>
            </form>
          )}
        </div>

        <aside className="stack">
          <div className="card card-navy">
            <h3 style={{ color: "#fff" }}>Editorial Guidelines</h3>
            <ul className="stack small" style={{ marginTop: "12px", color: "var(--on-navy-2)", paddingLeft: "18px" }}>
              <li>We check answers directly against IRDAI guidelines &amp; Master Circulars.</li>
              <li>Questions about active claim repudiations are cross-checked with Insurance Ombudsman jurisprudence.</li>
              <li>We never provide sponsored or affiliate endorsements.</li>
            </ul>
          </div>

          <div className="card">
            <h3>Urgent Grievance?</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              If your insurer has delayed or rejected a valid claim, file a formal dispute on our Ombudsman tracking pipeline.
            </p>
            <Link className="btn btn-ghost btn-sm" style={{ marginTop: "14px" }} href="/complaints/new">
              Raise a dispute →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
