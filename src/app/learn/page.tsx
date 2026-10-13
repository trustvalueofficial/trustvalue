import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PILLARS, ARTICLES } from "@/lib/prototypeData";

export const metadata: Metadata = {
  title: "Life insurance encyclopedia | TrustValue",
  description: "Plain-language guides to life insurance claims, buying, term cover and policy changes in India.",
};

export default function LearnIndexPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Encyclopedia</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Knowledge Base</p>
        <h1>Life insurance encyclopedia</h1>
        <p className="lead">
          Verified guides written directly from policy documents and regulatory mandates. Plain language without jargon.
        </p>
      </header>

      {PILLARS.map((p) => {
        const arts = ARTICLES.filter((a) => a.pillar === p.slug);
        return (
          <section key={p.slug} className="section-tight">
            <div className="shead">
              <div>
                <h2>{p.name}</h2>
                <p className="lead" style={{ marginTop: "4px" }}>{p.intro}</p>
              </div>
            </div>
            <div className="grid g3">
              {arts.map((a) => (
                <Link key={a.slug} className="card card-link" href={`/learn/${a.slug}`}>
                  <h3>{a.title}</h3>
                  <p className="small muted" style={{ marginTop: "6px" }}>{a.answer.slice(0, 120)}…</p>
                  <p className="tiny faint" style={{ marginTop: "10px" }}>Updated {a.updated}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
