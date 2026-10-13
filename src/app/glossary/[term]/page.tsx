import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GLOSS, GLOSSARY, TYPE } from "@/lib/prototypeData";

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const { term } = await params;
  const g = GLOSS[term];
  if (!g) return { title: "Term not found | TrustValue" };
  return {
    title: `What is ${g.term}? | TrustValue`,
    description: g.def,
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const g = GLOSS[term];
  if (!g) notFound();

  const rel = g.related.map((r) => GLOSS[r]).filter(Boolean);

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/glossary">Glossary</Link></li>
          <li><span aria-current="page">{g.term}</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Insurance Definition</p>
        <h1>{g.term}</h1>
      </header>

      <div className="body2">
        <div className="stack-l">
          <div className="card card-mist" style={{ maxWidth: "860px" }}>
            <p className="eyebrow">Plain definition</p>
            <p style={{ marginTop: "6px", fontSize: "1.0625rem", color: "var(--ink)" }}>{g.def}</p>
          </div>

          {g.type && (
            <div className="card">
              <h3>Where you will see it</h3>
              <p className="small muted" style={{ marginTop: "6px" }}>
                Primarily in <Link href={`/life-insurance/${g.type}`}>{TYPE[g.type]?.name.toLowerCase()}</Link> policies.
              </p>
            </div>
          )}

          {rel.length > 0 && (
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>Related terms</h2>
              <div className="grid g3">
                {rel.map((r) => (
                  <Link key={r.slug} className="card card-link" href={`/glossary/${r.slug}`}>
                    <h3>{r.term}</h3>
                    <p className="small muted" style={{ marginTop: "4px" }}>{r.def.slice(0, 90)}…</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="row" style={{ marginTop: "24px" }}>
            <Link className="btn btn-ghost btn-sm" href="/glossary">Back to full glossary</Link>
          </div>
        </div>

        <aside className="rail stack">
          <div className="card card-mist">
            <h3>Still have questions?</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              Ask how this term applies to your specific policy wording.
            </p>
            <Link className="btn btn-navy btn-sm" style={{ marginTop: "12px" }} href="/questions/ask">
              Ask a question
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
