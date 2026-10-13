import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARTICLE, PILLARS, ARTICLES } from "@/lib/prototypeData";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const art = ARTICLE[slug];
  const pil = PILLARS.find((p) => p.slug === slug);
  if (art) return { title: `${art.title} | TrustValue`, description: art.answer };
  if (pil) return { title: `${pil.name} Pillar Guide | TrustValue`, description: pil.intro };
  return { title: "Guide not found | TrustValue" };
}

export default async function LearnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = ARTICLE[slug];
  const pil = PILLARS.find((p) => p.slug === slug);

  if (art) {
    const parentPillar = PILLARS.find((p) => p.slug === art.pillar);
    return (
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/learn">Encyclopedia</Link></li>
            {parentPillar && <li><Link href={`/learn/${parentPillar.slug}`}>{parentPillar.name}</Link></li>}
            <li><span aria-current="page">{art.title}</span></li>
          </ol>
        </nav>

        <header className="phead">
          <p className="eyebrow">{parentPillar?.name || "Insurance Guide"}</p>
          <h1>{art.title}</h1>
          <div className="meta-line"><span>Updated {art.updated}</span></div>
        </header>

        <div className="body2">
          <article className="stack-l">
            <div className="card card-mist" style={{ maxWidth: "860px" }}>
              <p className="eyebrow">Short answer</p>
              <p style={{ marginTop: "6px", fontSize: "1.0625rem", color: "var(--ink)" }}>{art.answer}</p>
            </div>

            <div className="prose">
              {art.body.map((b, idx) => {
                if (b[0] === "h2") return <h2 key={idx}>{b[1]}</h2>;
                if (b[0] === "p") return <p key={idx}>{b[1]}</p>;
                if (b[0] === "ul") {
                  return (
                    <ul key={idx}>
                      {b[1].map((li: string, lIdx: number) => (
                        <li key={lIdx}>{li}</li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </div>

            {art.faq && art.faq.length > 0 && (
              <section className="section-tight">
                <h2 style={{ marginBottom: "12px" }}>Questions people ask</h2>
                <div className="stack">
                  {art.faq.map((f, idx) => (
                    <details key={idx} className="card" open={idx === 0}>
                      <summary style={{ cursor: "pointer", font: "700 1rem/1.4 var(--f-display)", color: "var(--ink)" }}>
                        {f[0]}
                      </summary>
                      <p className="muted" style={{ marginTop: "8px" }}>{f[1]}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {art.sources && art.sources.length > 0 && (
              <section>
                <h2 style={{ fontSize: "1.125rem", marginBottom: "8px" }}>Primary Sources</h2>
                <ul className="prose small">
                  {art.sources.map((s, idx) => (
                    <li key={idx}>
                      <a href={s[1]} target="_blank" rel="noopener noreferrer">{s[0]}</a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </div>
    );
  }

  if (pil) {
    const arts = ARTICLES.filter((a) => a.pillar === slug);
    return (
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/learn">Encyclopedia</Link></li>
            <li><span aria-current="page">{pil.name}</span></li>
          </ol>
        </nav>

        <header className="phead">
          <p className="eyebrow">Pillar Guide</p>
          <h1>{pil.name}</h1>
          <p className="lead">{pil.intro}</p>
        </header>

        <section className="section-tight">
          <div className="list">
            {arts.map((a) => (
              <Link key={a.slug} className="li" href={`/learn/${a.slug}`}>
                <span className="li-main">
                  <b>{a.title}</b>
                  <span>{a.answer.slice(0, 120)}…</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  notFound();
}
