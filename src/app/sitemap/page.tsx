import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { INSURERS, TYPES, ARTICLES, GLOSSARY } from "@/lib/prototypeData";

export const metadata: Metadata = {
  title: "HTML Sitemap | TrustValue",
  description: "Complete index of all insurance categories, insurer profiles, guides and glossary terms.",
};

export default function SitemapPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Sitemap</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Index Directory</p>
        <h1>Platform sitemap</h1>
        <p className="lead">Direct navigation to all indexed directories and tools.</p>
      </header>

      <div className="grid g2">
        <section className="card">
          <h2>Brands ({INSURERS.length})</h2>
          <ul className="small" style={{ marginTop: "10px", paddingLeft: "18px" }}>
            {INSURERS.map((i) => (
              <li key={i.slug} style={{ marginBottom: "4px" }}>
                <Link href={`/industry/insurance/${i.slug}`}>{i.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Policy Categories</h2>
          <ul className="small" style={{ marginTop: "10px", paddingLeft: "18px" }}>
            {TYPES.map((t) => (
              <li key={t.slug} style={{ marginBottom: "4px" }}>
                <Link href={`/products?type=${t.slug}`}>{t.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Guides &amp; Articles</h2>
          <ul className="small" style={{ marginTop: "10px", paddingLeft: "18px" }}>
            {ARTICLES.map((a) => (
              <li key={a.slug} style={{ marginBottom: "4px" }}>
                <Link href={`/learn/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Tools &amp; Governance</h2>
          <ul className="small" style={{ marginTop: "10px", paddingLeft: "18px" }}>
            <li><Link href="/tools/cover-calculator">Cover Calculator</Link></li>
            <li><Link href="/tools/mis-selling-checker">Mis-Selling Checker</Link></li>
            <li><Link href="/methodology">Methodology</Link></li>
            <li><Link href="/editorial-policy">Editorial Policy</Link></li>
            <li><Link href="/guidelines">Community Guidelines</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
