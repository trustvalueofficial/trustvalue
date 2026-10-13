"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CoverCalculatorPage() {
  const [age, setAge] = useState(32);
  const [retireAge, setRetireAge] = useState(60);
  const [income, setIncome] = useState(1200000);
  const [expenses, setExpenses] = useState(300000);
  const [loans, setLoans] = useState(2500000);
  const [goals, setGoals] = useState(1500000);
  const [savings, setSavings] = useState(800000);
  const [existingCover, setExistingCover] = useState(0);

  const years = Math.max(0, retireAge - age);
  const netIncome = Math.max(0, income - expenses);
  const r = 0.07;
  const g = 0.05;

  let pv = 0;
  for (let t = 1; t <= years; t++) {
    pv += (netIncome * Math.pow(1 + g, t - 1)) / Math.pow(1 + r, t);
  }
  const totalNeeded = Math.max(0, pv + loans + goals - savings - existingCover);
  const formatCrores = (n: number) =>
    "₹" + (n >= 1e7 ? (n / 1e7).toFixed(2) + " crore" : (n / 1e5).toFixed(1) + " lakh");

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tools">Tools</Link></li>
          <li><span aria-current="page">Cover calculator</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Financial Tool</p>
        <h1>How much term cover do you need?</h1>
        <p className="lead">
          An independent estimate using the Human Life Value (HLV) method. Adjust any field to see real-time updates.
        </p>
      </header>

      <div className="body2">
        <form className="card stack" onSubmit={(e) => e.preventDefault()}>
          <div className="grid g2">
            <div className="field">
              <label htmlFor="c-age">Your current age</label>
              <input
                id="c-age"
                className="input num"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-ret">Age you plan to retire</label>
              <input
                id="c-ret"
                className="input num"
                type="number"
                value={retireAge}
                onChange={(e) => setRetireAge(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-inc">Annual take-home income (₹)</label>
              <input
                id="c-inc"
                className="input num"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-exp">Your own annual expenses (₹)</label>
              <input
                id="c-exp"
                className="input num"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-loan">Outstanding loans / EMIs (₹)</label>
              <input
                id="c-loan"
                className="input num"
                type="number"
                value={loans}
                onChange={(e) => setLoans(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-goal">Major future goals (e.g. child education) (₹)</label>
              <input
                id="c-goal"
                className="input num"
                type="number"
                value={goals}
                onChange={(e) => setGoals(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-sav">Existing liquid savings / investments (₹)</label>
              <input
                id="c-sav"
                className="input num"
                type="number"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-cov">Existing active life cover (₹)</label>
              <input
                id="c-cov"
                className="input num"
                type="number"
                value={existingCover}
                onChange={(e) => setExistingCover(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </form>

        <aside className="rail stack">
          <div className="card card-navy" aria-live="polite">
            <p className="eyebrow" style={{ color: "#FFB27A" }}>Recommended Term Cover</p>
            <p style={{ font: "800 2.2rem/1.1 var(--f-display)", color: "#fff", marginTop: "8px" }} className="num">
              {formatCrores(totalNeeded)}
            </p>
            <p className="small muted" style={{ marginTop: "8px" }}>
              Income replacement of {formatCrores(pv)} over {years} working years, plus liabilities of {formatCrores(loans + goals)}, minus assets of {formatCrores(savings + existingCover)}.
            </p>
          </div>

          <div className="card">
            <h3>Next steps</h3>
            <div className="stack" style={{ marginTop: "10px" }}>
              <Link className="chip" href="/products?type=term-insurance">Browse term insurance plans</Link>
              <Link className="chip" href="/learn/how-much-term-cover">Read the full term cover guide</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
