import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { INSURERS, CHECKED, insUrl } from "@/lib/prototypeData";

export const metadata: Metadata = {
  title: "Open data: life insurer reviews and complaints | TrustValue",
  description: "Review, TrustScore and complaint counts for every life insurer in India, free to cite.",
};

export default function OpenDataPage() {
  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><span aria-current="page">Open data</span></li>
        </ol>
      </nav>

      <header className="phead">
        <p className="eyebrow">Public Accountability</p>
        <h1>Open data: life insurer telemetry</h1>
        <p className="lead">
          Free to cite and redistribute with attribution. Updated quarterly in alignment with IRDAI regulatory disclosures.
        </p>
      </header>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Insurer</th>
              <th>IRDAI Reg.</th>
              <th>Status</th>
              <th>Audit Source</th>
            </tr>
          </thead>
          <tbody>
            {INSURERS.map((i) => (
              <tr key={i.slug}>
                <td><Link href={insUrl(i.slug)}><b>{i.name}</b></Link></td>
                <td className="num">{i.reg}</td>
                <td>{i.status === "admin" ? <span className="tag tag-amber">Under administration</span> : <span className="tag tag-green">Active</span>}</td>
                <td><span className="small muted">Life Insurance Council ({CHECKED})</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
