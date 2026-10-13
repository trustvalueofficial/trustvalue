import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { GLOSSARY } from "@/lib/prototypeData";

export const metadata: Metadata = {
  title: "Life insurance glossary: A to Z terms | TrustValue",
  description: "Plain definitions of life insurance terms used in India, from annuity to waiver of premium.",
};

export default function GlossaryIndexPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Glossary</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Insurance Dictionary</p>
        <h1>Life insurance glossary</h1>
        <p className="lead">
          {GLOSSARY.length} terms in plain language. Each entry has its own dedicated page.
        </p>
      </header>

      <div className="grid g2">
        {sorted.map((g) => (
          <div key={g.slug} className="card">
            <h3><Link href={`/glossary/${g.slug}`}>{g.term}</Link></h3>
            <p className="small muted" style={{ marginTop: "6px" }}>{g.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
