import React from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const defaultKeywords = [
  "TrustValue",
  "TrustValue.ai",
  "The Global Trust Index",
  "Consumer Trust Telemetry",
  "IRDAI Insurance Trust Score",
  "Life Insurance Claim Settlement Ratio",
  "Term Insurance Review Forensics",
  "IS 19000:2022 Compliance",
  "Fake Review Detection",
  "Universal Neutrality Guarantee",
  "Point-Delta Verification",
  "Health Insurance Rankings India",
];

export default function SEO({
  title = "TrustValue.ai: The Global Trust Index | Universal Consumer & Corporate Trust Telemetry",
  description = "The Global Trust Index across all consumer-critical industries. Check any brand, contract, policy, or loan before you sign. Phase 1 live audit: Life & Health Insurance. Rate yours in 7 seconds.",
  canonical = "https://trustvalue.ai",
  keywords = defaultKeywords,
  ogImage = "https://trustvalue.ai/brand/logo-full.webp",
  jsonLd,
}: SEOProps) {
  // Comprehensive Schema.org JSON-LD Graph
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://trustvalue.ai/#organization",
        "name": "TrustValue.ai",
        "url": "https://trustvalue.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://trustvalue.ai/brand/logo.webp",
          "width": 660,
          "height": 101,
        },
        "description": "Universal consumer and corporate trust telemetry platform built on statutory neutrality (IS 19000:2022).",
        "sameAs": [
          "https://twitter.com/trustvalue_ai",
          "https://linkedin.com/company/trustvalue-ai",
        ],
        "knowsAbout": [
          "Consumer Review Authenticity",
          "IS 19000:2022 Neutrality",
          "IRDAI Claim Settlement Telemetry",
          "Fake Review Forensics",
          "Contractual Transparency",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://trustvalue.ai/#website",
        "url": "https://trustvalue.ai",
        "name": "TrustValue.ai",
        "publisher": {
          "@id": "https://trustvalue.ai/#organization",
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://trustvalue.ai/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://trustvalue.ai/#telemetry-core",
        "name": "TrustValue Global Trust Telemetry Core",
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "description": "Autonomous trust scoring engine auditing 26 life insurers and consumer contracts in 7 seconds.",
      },
      ...(jsonLd ? [jsonLd] : []),
    ],
  };

  return (
    <>
      {/* 1. Global SEO Keywords and Meta Tags */}
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content="TrustValue.ai Autonomous Intelligence Core" />
      <meta name="theme-color" content="#071B46" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#071B46" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="compliance-standard" content="IS 19000:2022 Certified Neutral" />

      {/* 2. Structured Data JSON-LD Ingestion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
