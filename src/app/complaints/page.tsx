"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loadStore, insName, fmtDate } from "@/lib/prototypeData";

export default function ComplaintsIndexPage() {
  const store = loadStore();
  const [filter, setFilter] = useState<string>("all");

  const complaints = store.complaints || [];
  const filtered = filter === "all"
    ? complaints
    : complaints.filter((c) => c.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="wrap py-10">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Public Grievance Desk</span></li>
        </ol>
      </nav>

      <header className="phead" style={{ marginBottom: "2rem" }}>
        <span className="tag tag-amber">Independent Resolution</span>
        <h1 style={{ marginTop: "10px" }}>Consumer Grievance Desk</h1>
        <p className="lead">
          Track public claim disputes, turnaround violations, and policy mis-selling.
          Every filed case is publicly logged with a strict 7-day insurer response window.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/complaints/new" className="btn btn--primary">
            + File a New Complaint
          </Link>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b pb-3">
        {["all", "sent", "in progress", "resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
              filter === tab
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab === "all" ? `All (${complaints.length})` : tab}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="stack-m">
        {filtered.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">
            <p className="text-sm">No complaints found under this status.</p>
          </div>
        ) : (
          filtered.map((c) => {
            const daysRemaining = Math.max(0, Math.ceil((c.created + 7 * 864e5 - Date.now()) / 864e5));
            return (
              <Link
                key={c.id}
                href={`/complaints/${c.id}`}
                className="card card-link block hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`tag ${c.status === "Resolved" ? "tag-green" : "tag-amber"}`}>
                      {c.status}
                    </span>
                    <span className="tiny faint font-mono">#{c.id}</span>
                  </div>
                  <span className="tiny faint">{fmtDate(c.created)}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{c.issue}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Filed against <span className="font-semibold text-slate-700">{insName(c.insurer)}</span>
                </p>

                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{c.details}</p>

                {c.status === "Sent" && daysRemaining > 0 && (
                  <p className="text-xs font-semibold text-amber-600 mt-3">
                    ⏱ {daysRemaining} days left for insurer public response
                  </p>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
