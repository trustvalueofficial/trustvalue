import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Life insurance calculators and tools | TrustValue",
  description: "Free tools: term cover calculator, mis-selling checker and policy decoder. Free, no phone number required.",
};

export default function ToolsIndexPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Tools</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Calculators &amp; Audit Utilities</p>
        <h1>Life insurance tools</h1>
        <p className="lead">
          Free, independent tools. None of them ask for your phone number or pass leads to brokers.
        </p>
      </header>

      <div className="grid g3">
        <Link className="card card-link" href="/tools/cover-calculator">
          <span className="tag tag-green">Live</span>
          <h3 style={{ marginTop: "10px" }}>Term cover calculator</h3>
          <p className="small muted">
            How much life cover your family needs, calculated using the Human Life Value (HLV) model.
          </p>
        </Link>

        <Link className="card card-link" href="/tools/mis-selling-checker">
          <span className="tag tag-green">Live</span>
          <h3 style={{ marginTop: "10px" }}>Mis-selling checker</h3>
          <p className="small muted">
            Six questions that tell you whether your policy was mis-sold and help you draft a formal grievance.
          </p>
        </Link>
      </div>
    </div>
  );
}
