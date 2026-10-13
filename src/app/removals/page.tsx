import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Removals Log | TrustValue",
  description: "Public transparency log of every legal or court-ordered removal from TrustValue.",
};

export default function RemovalsPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Removals log</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Transparency</p>
        <h1>Public removals log</h1>
        <p className="lead">
          We maintain a permanent public log of content removed due to court orders, statutory legal requests, or proven defamation.
        </p>
      </header>

      <div className="metrics" style={{ maxWidth: "560px" }}>
        <div><b>0</b><span>Reviews removed</span></div>
        <div><b>0</b><span>Legal court orders</span></div>
      </div>

      <div className="empty" style={{ marginTop: "24px" }}>
        <h3>No content removed to date</h3>
        <p>
          Negative reviews are never suppressed for poor ratings. When content is quarantined under court decree, the case number and legal ground are catalogued here.
        </p>
      </div>
    </div>
  );
}
