import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How TrustScores work | TrustValue",
  description: "The formula, weighting, verification tiers, and authenticity model behind every score on TrustValue.",
};

export default function MethodologyPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Methodology</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Trust Mathematical Model</p>
        <h1>How TrustScores work</h1>
        <p className="lead">
          The exact method and mathematical formulas behind every score on TrustValue, published so that any researcher, consumer, or AI assistant can verify how numbers are derived.
        </p>
      </header>

      <div className="body2">
        <article className="prose">
          <h2>The score in one line</h2>
          <p>
            A TrustScore is a weighted average of consumer reviews on a 0 to 100 scale, blended with a prior category mean so that a handful of reviews cannot produce an extreme or distorted score. It shows from a plan&apos;s 10th verified review.
          </p>

          <h2>How each review is weighted</h2>
          <p>
            Every review receives an individual mathematical weight <b>w = A × V × R × C</b>:
          </p>
          <ul>
            <li><b>A (Authenticity):</b> 0.0 to 1.0, scored by our fraud detection model. Reviews below 0.3 are excluded from the score but remain accessible for public transparency.</li>
            <li><b>V (Verification):</b> 1.0 for policy document verification, 0.9 for ID verification, 0.7 for phone verification, and 0.5 for email-only accounts.</li>
            <li><b>R (Recency):</b> Time-decay factor that halves weight every 18 months to reflect current service levels.</li>
            <li><b>C (Context):</b> 0.6 for expectation gap disputes (contractually excluded events), 1.0 otherwise.</li>
          </ul>

          <h2>The governing formula</h2>
          <pre className="code">
            {`TrustScore = (k * m + Σ (w_i * r_i)) / (k + Σ w_i)`}
          </pre>
          <p>
            Where <i>r_i</i> is the rating stop (Angry Star = 0, Poor = 20, Below par = 40, Okay = 60, Good = 80, Recommend = 100), <i>m</i> is the industry category baseline mean, and <i>k</i> is the prior dampening constant (k = 20).
          </p>

          <h2>Trust Alert</h2>
          <p>
            When 10% or more of a plan&apos;s raters assign an Angry Star (0/100), the entity displays a prominent <b>Trust Alert</b> badge regardless of whether the overall numerical average is high.
          </p>

          <h2>Compliance &amp; Standards</h2>
          <p>
            TrustValue adheres to <b>IS 19000:2022</b> standards for online consumer reviews. Insurers cannot buy scores, pay for sponsored placements, or edit customer accounts.
          </p>
        </article>

        <aside className="rail stack">
          <div className="card card-mist">
            <h3>Read our Constitution</h3>
            <p className="small muted" style={{ marginTop: "6px" }}>
              Our founding commitments to complete mathematical neutrality.
            </p>
            <Link className="btn btn-navy btn-sm" style={{ marginTop: "12px" }} href="/about">
              About TrustValue
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
