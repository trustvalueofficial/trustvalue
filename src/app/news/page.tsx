import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { NEWS } from "@/lib/prototypeData";

export const metadata: Metadata = {
  title: "Life insurance news & regulatory updates | TrustValue",
  description: "IRDAI circulars, insurer announcements, plan changes and TrustValue data updates.",
};

export default function NewsIndexPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">News</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">News &amp; Regulatory Intel</p>
        <h1>Life insurance news</h1>
        <p className="lead">
          Verified industry reporting on circulars, name changes, solvency margins, and consumer claim developments.
        </p>
      </header>

      <div className="grid g2">
        {NEWS.map((n) => (
          <div key={n.slug} className="card">
            <span className="tag">{n.cat}</span>
            <h2 style={{ fontSize: "1.375rem", marginTop: "10px" }}>{n.title}</h2>
            <p className="muted" style={{ marginTop: "8px" }}>{n.dek}</p>
            <p className="tiny faint" style={{ marginTop: "12px" }}>{n.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
