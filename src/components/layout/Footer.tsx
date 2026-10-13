"use client";

import React from "react";
import Link from "next/link";
import { TYPES } from "@/lib/prototypeData";

export default function Footer() {
  return (
    <footer id="ftr" className="ftr" role="contentinfo">
      <div className="wrap">
        <div className="ftr-grid">
          <div style={{ gridColumn: "1 / -1", maxWidth: "520px" }}>
            <img
              className="ftr-logo"
              src="/brand/logo-full.webp"
              alt="TrustValue.ai, The Global Trust Index"
              width={173}
              height={34}
              style={{ height: "34px", width: "auto", marginBottom: "12px" }}
            />
            <p>
              Reviews you can trust across life insurance in India, mathematically weighted for authenticity. Not an insurer, broker, agent or adviser. Insurers cannot pay for ratings, scores or placement.
            </p>
          </div>

          <div>
            <h2>Brands</h2>
            <ul>
              <li><Link href="/industry/insurance/lic">LIC</Link></li>
              <li><Link href="/industry/insurance/sbi-life">SBI Life</Link></li>
              <li><Link href="/industry/insurance/hdfc-life">HDFC Life</Link></li>
              <li><Link href="/industry/insurance/icici-prudential">ICICI Prudential</Link></li>
              <li><Link href="/industry/insurance/max-life">Max Life</Link></li>
              <li><Link href="/industry/insurance">All 26 Brands Directory</Link></li>
            </ul>
          </div>

          <div>
            <h2>Products</h2>
            <ul>
              {TYPES.map((t) => (
                <li key={t.slug}>
                  <Link href={`/products?type=${t.slug}`}>{t.name}</Link>
                </li>
              ))}
              <li><Link href="/products">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h2>Learn</h2>
            <ul>
              <li><Link href="/learn">Encyclopedia</Link></li>
              <li><Link href="/glossary">Glossary</Link></li>
              <li><Link href="/questions">Questions</Link></li>
              <li><Link href="/tools">Tools</Link></li>
              <li><Link href="/data">Open Data</Link></li>
              <li><Link href="/news">News</Link></li>
            </ul>
          </div>

          <div>
            <h2>Community</h2>
            <ul>
              <li><Link href="/write-review">Write a review</Link></li>
              <li><Link href="/complaints/new">Raise a complaint</Link></li>
              <li><Link href="/community">Community</Link></li>
              <li><Link href="/guidelines">Community rules</Link></li>
            </ul>
          </div>

          <div>
            <h2>Company</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/methodology">Methodology</Link></li>
              <li><Link href="/editorial-policy">Editorial policy</Link></li>
              <li><Link href="/contact">Contact &amp; Grievances</Link></li>
            </ul>
          </div>

          <div>
            <h2>Legal</h2>
            <ul>
              <li><Link href="/privacy">Privacy notice</Link></li>
              <li><Link href="/terms">Terms of use</Link></li>
              <li><Link href="/removals">Removals log</Link></li>
              <li><Link href="/sitemap">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="ftr-base">
          <span>
            &copy; {new Date().getFullYear()} TrustValue.ai, The Global Trust Index.
          </span>
          <span>
            Brand names belong to their owners and identify the insurers reviewed. Insurer facts come from the Life Insurance Council, IRDAI and insurers&apos; own public documents.
          </span>
        </div>
      </div>
    </footer>
  );
}
