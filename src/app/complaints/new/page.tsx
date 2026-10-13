"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INSURERS, uid, loadStore, saveStore, Complaint } from "@/lib/prototypeData";

const ISSUES = [
  "Claim delayed beyond regulatory turnaround",
  "Claim rejected under disputed exclusion",
  "Mis-selling / verbally distorted terms",
  "Surrender value dispute or refund delayed",
  "Service request or nominee change ignored",
  "Policy bond not delivered",
  "Other contractual dispute",
];

export default function NewComplaintPage() {
  const [insurer, setInsurer] = useState("");
  const [issue, setIssue] = useState(ISSUES[0]);
  const [details, setDetails] = useState("");
  const [outcome, setOutcome] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insurer || !details || !consent) return;

    const newComp: Complaint = {
      id: uid(),
      insurer,
      issue,
      details,
      outcome,
      status: "Sent",
      created: Date.now(),
      updated: Date.now(),
      author: "consumer-" + Math.floor(Math.random() * 900 + 100),
      events: [
        {
          t: Date.now(),
          who: "Consumer",
          text: `Complaint filed: ${issue}. Requested resolution: ${outcome || "Fair claim review"}.`,
        },
      ],
    };

    const s = loadStore();
    s.complaints.unshift(newComp);
    saveStore(s);
    setSubmitted(newComp.id);
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Raise a complaint</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Public Dispute Resolution</p>
        <h1>Raise an insurance complaint</h1>
        <p className="lead">
          Your complaint is published with a 7-day timer for the insurer to respond publicly. If unanswered, we provide direct escalation steps to IRDAI Bima Bharosa and the Insurance Ombudsman.
        </p>
      </header>

      {submitted ? (
        <div className="card card-navy" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", padding: "36px" }}>
          <h2>Complaint enqueued and sent</h2>
          <p className="muted" style={{ marginTop: "10px" }}>
            The insurer has 7 days to issue an official public response. Your personal phone and policy numbers are never published.
          </p>
          <div className="row" style={{ justifyContent: "center", marginTop: "20px" }}>
            <Link className="btn btn-primary" href={`/complaints/${submitted}`}>Track complaint status</Link>
            <Link className="btn btn-ghost" href="/">Return to Home</Link>
          </div>
        </div>
      ) : (
        <form className="card stack formcard" style={{ margin: "0 auto" }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="cp-i">Select Insurer</label>
            <select
              id="cp-i"
              className="input"
              required
              value={insurer}
              onChange={(e) => setInsurer(e.target.value)}
            >
              <option value="">Select the insurance company...</option>
              {INSURERS.map((i) => (
                <option key={i.slug} value={i.slug}>{i.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="cp-iss">Issue category</label>
            <select
              id="cp-iss"
              className="input"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            >
              {ISSUES.map((iss) => (
                <option key={iss} value={iss}>{iss}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="cp-dt">Summary of what occurred</label>
            <textarea
              id="cp-dt"
              className="input"
              required
              placeholder="State key dates, claim numbers, and agent communications. Do not include your personal contact details here."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="cp-out">Desired resolution</label>
            <input
              id="cp-out"
              className="input"
              placeholder="e.g. Full claim settlement of ₹15,00,000, refund of premium"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            />
          </div>

          <label className="check">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I certify that this complaint represents an authentic dispute with the named insurer.
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
            disabled={!insurer || !details || !consent}
          >
            Submit public complaint
          </button>
        </form>
      )}
    </div>
  );
}
