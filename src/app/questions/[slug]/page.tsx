import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QUESTIONS, insUrl, insName } from "@/lib/prototypeData";

export default async function SingleQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = QUESTIONS.find((x) => x.slug === slug);
  if (!q) notFound();

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/questions">Questions</Link></li>
          <li><span aria-current="page">{q.q.slice(0, 40)}…</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">{q.topic}</p>
        <h1>{q.q}</h1>
        <div className="meta-line">
          <span>Asked by a TrustValue reader</span>
          <span>Answered by {q.by}</span>
        </div>
      </header>

      <div className="body2">
        <div className="stack-l">
          <div className="card" style={{ borderColor: "var(--green)" }}>
            <span className="tag tag-green">Accepted answer</span>
            <p style={{ marginTop: "10px", fontSize: "1.0625rem", color: "var(--ink)" }}>{q.a}</p>
            <p className="tiny faint" style={{ marginTop: "8px" }}>
              {q.by} · Verified against IRDAI and insurer records
            </p>
            {q.insurers && q.insurers.length > 0 && (
              <div className="row" style={{ marginTop: "12px" }}>
                {q.insurers.map((ins) => (
                  <Link key={ins} className="chip" href={insUrl(ins)}>{insName(ins)}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="rail stack">
          <div className="card">
            <h3>Have another question?</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              Ask the community and our editors will verify the contract wording.
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
