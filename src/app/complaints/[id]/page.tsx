"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadStore, insName, fmtDate } from "@/lib/prototypeData";

export default function SingleComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = loadStore();
  const c = store.complaints.find((x) => x.id === id);
  if (!c) notFound();

  const daysRemaining = Math.max(0, Math.ceil((c.created + 7 * 864e5 - Date.now()) / 864e5));

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/complaints">Complaints</Link></li>
          <li><Link href={`/industry/insurance/${c.insurer}`}>{insName(c.insurer)}</Link></li>
          <li><span aria-current="page">Complaint #{c.id}</span></li>
        </ol>
      </nav>

      <header className="phead">
        <span className={`tag ${c.status === "Resolved" ? "tag-green" : "tag-amber"}`}>
          {c.status}
        </span>
        <h1 style={{ marginTop: "10px" }}>{c.issue}</h1>
        <p className="lead">
          Filed against {insName(c.insurer)} on {fmtDate(c.created)}.
        </p>
        {c.status === "Sent" && (
          <p className="small" style={{ color: "var(--orange)", fontWeight: 700, marginTop: "6px" }}>
            {daysRemaining > 0 ? `${daysRemaining} days left for insurer public response` : "Response window passed"}
          </p>
        )}
      </header>

      <div className="body2">
        <div className="stack-l">
          <div className="card">
            <h3>Dispute Details</h3>
            <p className="body" style={{ marginTop: "8px" }}>{c.details}</p>
            {c.outcome && (
              <p className="small muted" style={{ marginTop: "12px" }}>
                <b>Requested Outcome:</b> {c.outcome}
              </p>
            )}
          </div>

          <section>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>Event Timeline</h2>
            <div className="timeline">
              {c.events.map((ev, idx) => (
                <div key={idx} className="t done">
                  <b className="small" style={{ color: "var(--ink)" }}>{ev.who}</b>{" "}
                  <span className="tiny faint">{fmtDate(ev.t)}</span>
                  <p className="small muted" style={{ marginTop: "4px" }}>{ev.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="rail stack">
          <div className="card card-mist">
            <h3>Ombudsman Escalation</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              If the insurer does not resolve your dispute, you can escalate free of charge to the Insurance Ombudsman under the 2017 Rules.
            </p>
            <Link className="btn btn-navy btn-sm" style={{ marginTop: "12px" }} href="/learn/claim-rejected-what-now">
              View escalation guide
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
