"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  INSURERS,
  STOPS,
  ASPECTS,
  JOURNEYS,
  uid,
  loadStore,
  saveStore,
  Review,
} from "@/lib/prototypeData";

export default function WriteReviewFlowPage() {
  const [insurer, setInsurer] = useState("");
  const [planName, setPlanName] = useState("");
  const [stop, setStop] = useState<number | null>(null);
  const [aspectRatings, setAspectRatings] = useState<Record<string, number>>({});
  const [journey, setJourney] = useState("Buying");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stop === null || !insurer || !headline || !body) return;

    const newRev: Review = {
      id: uid(),
      insurer,
      planName,
      overall: stop,
      aspects: aspectRatings,
      title: headline,
      body,
      journey,
      verify: "email",
      status: "published",
      created: Date.now(),
      author: "policyholder-" + Math.floor(Math.random() * 900 + 100),
      helpful: 0,
      history: [{ t: Date.now(), ev: "Published" }],
    };

    const s = loadStore();
    s.reviews.unshift(newRev);
    saveStore(s);
    setSubmitted(true);
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Write a review</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Consumer Verification</p>
        <h1>Write a verified review</h1>
        <p className="lead">
          Share your real experience with an insurer. Reviews are weighted for authenticity, and insurers cannot pay to alter or remove them.
        </p>
      </header>

      {submitted ? (
        <div className="card card-navy" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", padding: "36px" }}>
          <h2>Thank you. Your review is live!</h2>
          <p className="muted" style={{ marginTop: "10px" }}>
            Your rating has been recorded and contributed to the platform&apos;s TrustScore calculations.
          </p>
          <div className="row" style={{ justifyContent: "center", marginTop: "20px" }}>
            <Link className="btn btn-primary" href="/">Return to Home</Link>
            <Link className="btn btn-ghost" href={`/industry/insurance/${insurer}`}>View Insurer Hub</Link>
          </div>
        </div>
      ) : (
        <form className="card stack formcard" style={{ margin: "0 auto" }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="wr-ins">Select your insurer</label>
            <select
              id="wr-ins"
              className="input"
              required
              value={insurer}
              onChange={(e) => setInsurer(e.target.value)}
            >
              <option value="">Choose from all 26 licensed insurers...</option>
              {INSURERS.map((i) => (
                <option key={i.slug} value={i.slug}>{i.name} (Reg: {i.reg})</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="wr-pname">Plan name (as stated on policy)</label>
            <input
              id="wr-pname"
              className="input"
              placeholder="e.g. Super Protect Plan, Click 2 Protect, etc."
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Overall rating</label>
            <p className="small muted">Angry Star represents an experience that broke your trust (scores 0).</p>
            <div className="stops" style={{ margin: "10px 0" }}>
              {STOPS.map((st) => (
                <button
                  key={st.v}
                  type="button"
                  className={`stop ${stop === st.v ? "on" : ""}`}
                  onClick={() => setStop(st.v)}
                >
                  <span>{st.v === 0 ? "⚠️" : st.label}</span>
                  <small>{st.sub}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Rate specific aspects (Optional)</label>
            <div className="stack" style={{ marginTop: "6px" }}>
              {ASPECTS.map(([k, label]) => (
                <div key={k} className="row" style={{ justifyContent: "space-between" }}>
                  <span className="small">{label}</span>
                  <div className="mini-stops">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={aspectRatings[k] === num ? "on" : ""}
                        onClick={() => setAspectRatings((prev) => ({ ...prev, [k]: num }))}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="wr-journey">Journey stage</label>
            <select
              id="wr-journey"
              className="input"
              value={journey}
              onChange={(e) => setJourney(e.target.value)}
            >
              {JOURNEYS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="wr-title">Review headline</label>
            <input
              id="wr-title"
              className="input"
              required
              placeholder="e.g. Claim settled in 12 days after physical verification"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="wr-body">Detailed experience</label>
            <textarea
              id="wr-body"
              className="input"
              required
              placeholder="Describe what occurred, dates, customer support response, and whether promises were kept. Please do not share phone or policy numbers publicly."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
            disabled={stop === null || !insurer || !headline || !body}
          >
            Publish review
          </button>
        </form>
      )}
    </div>
  );
}
