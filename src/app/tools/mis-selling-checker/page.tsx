"use client";

import React, { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  { id: "q1", text: "Were you told the plan was a fixed deposit, bank account or guaranteed high return?" },
  { id: "q2", text: "Is the annual premium higher, or the payment tenure longer, than what was verbally promised?" },
  { id: "q3", text: "Were you promised specific payout benefits that you cannot find in the official policy document?" },
  { id: "q4", text: "Were you told that market-linked fund bonuses or returns were 100% risk-free and guaranteed?" },
  { id: "q5", text: "Did an agent or bank representative fill out your health and medical declarations on your behalf?" },
  { id: "q6", text: "Did you receive the official policy document more than 30 days ago (past the free-look period)?" },
];

export default function MisSellingCheckerPage() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yesCount = Object.keys(answers).filter((k) => answers[k] && k !== "q6").length;
    const isPastFreeLook = answers["q6"];

    if (yesCount > 0) {
      if (!isPastFreeLook) {
        setResult("high_early");
      } else {
        setResult("high_late");
      }
    } else {
      setResult("low");
    }
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tools">Tools</Link></li>
          <li><span aria-current="page">Mis-selling checker</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Consumer Protection</p>
        <h1>Was I mis-sold a policy?</h1>
        <p className="lead">
          Answer six rapid questions to determine whether your policy violated IRDAI sales conduct regulations.
        </p>
      </header>

      <form className="card stack formcard" onSubmit={handleSubmit}>
        {QUESTIONS.map((q) => (
          <fieldset key={q.id} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="label" style={{ marginBottom: "8px" }}>{q.text}</legend>
            <div className="row">
              <label className="chip">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === true}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: true }))}
                />{" "}
                Yes
              </label>
              <label className="chip">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === false}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: false }))}
                />{" "}
                No
              </label>
            </div>
          </fieldset>
        ))}

        <button className="btn btn-primary" type="submit" style={{ marginTop: "16px" }}>
          Check my status
        </button>
      </form>

      {result && (
        <div className="card card-navy" style={{ marginTop: "24px", maxWidth: "760px" }}>
          {result === "high_early" && (
            <>
              <h2>Clear indicators of mis-selling — Active Free-Look Window</h2>
              <p className="muted" style={{ marginTop: "8px" }}>
                You are still within the statutory 30-day free-look period. You are legally entitled to cancel the policy immediately in writing and receive a full premium refund minus proportionate medical/stamp costs.
              </p>
              <div className="row" style={{ marginTop: "16px" }}>
                <Link className="btn btn-primary btn-sm" href="/complaints/new">Draft free-look cancellation letter</Link>
                <Link className="btn btn-ghost btn-sm" href="/learn/was-i-mis-sold">Read mis-selling guide</Link>
              </div>
            </>
          )}

          {result === "high_late" && (
            <>
              <h2>Strong evidence of mis-selling — Escalation required</h2>
              <p className="muted" style={{ marginTop: "8px" }}>
                Because you are past the free-look period, you must file a formal grievance with the insurer&apos;s Grievance Redressal Officer (GRO) citing deceptive sales conduct, followed by IRDAI Bima Bharosa and the Insurance Ombudsman.
              </p>
              <div className="row" style={{ marginTop: "16px" }}>
                <Link className="btn btn-primary btn-sm" href="/complaints/new">File official complaint</Link>
                <Link className="btn btn-ghost btn-sm" href="/learn/claim-rejected-what-now">Ombudsman escalation guide</Link>
              </div>
            </>
          )}

          {result === "low" && (
            <>
              <h2>No prominent mis-selling flags detected</h2>
              <p className="muted" style={{ marginTop: "8px" }}>
                Based on your answers, the policy appears compliant with regular sales documentation disclosures. If specific terms still conflict with expectations, check the official policy clauses.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
