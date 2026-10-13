import Breadcrumbs, { BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import { ShieldCheck, CheckCircle2, Lock, Sparkles, PlusCircle, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export interface SiteLayoutProps {
  children: React.ReactNode;
  /** Page title for SEO structured data and header */
  title?: string;
  /** Meta description for JSON-LD */
  description?: string;
  /** Eyebrow badge text (e.g. "IRDAI Audited Directory") */
  eyebrow?: string;
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional custom Schema.org JSON-LD object to merge */
  jsonLd?: Record<string, any>;
  /** Toggle the top live trust telemetry counter strip (default: true) */
  showLiveTicker?: boolean;
  /** Toggle the IS 19000:2022 neutrality compliance banner (default: true) */
  showNeutralityBanner?: boolean;
  /** Toggle the bottom review contribution & dispute CTA (default: true) */
  showBottomCTA?: boolean;
  /** Custom max-width class (default: "max-w-7xl") */
  maxWidthClass?: string;
}

export default function SiteLayout({
  children,
  title,
  description = "TrustValue.ai — Turning genuine human experience into measurable trust with real-time Point-Delta verification and fraud forensics.",
  eyebrow,
  breadcrumbs,
  jsonLd,
  showLiveTicker = true,
  showNeutralityBanner = true,
  showBottomCTA = true,
  maxWidthClass = "max-w-7xl",
}: SiteLayoutProps) {
  // Base Schema.org JSON-LD injected into every page
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title || "TrustValue.ai Platform",
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": "TrustValue.ai",
      "url": "https://trustvalue.ai",
      "logo": "https://trustvalue.ai/logo.png",
      "knowsAbout": ["Insurance Audits", "Consumer Review Verification", "IS 19000:2022 Compliance"],
    },
    ...(breadcrumbs && breadcrumbs.length > 0
      ? {
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((b, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": b.label,
              "item": b.href ? `https://trustvalue.ai${b.href}` : undefined,
            })),
          },
        }
      : {}),
    ...(jsonLd || {}),
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. SEO JSON-LD Ingestion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultSchema) }}
      />

      {/* 2. Repetitive Live Trust Telemetry Ticker (From researchfrontend.html Blueprint) */}
      {showLiveTicker && (
        <aside
          aria-label="Live Trust Telemetry"
          className="bg-[#080d19] border-b border-slate-800/80 px-6 py-2 text-[11px] font-mono text-slate-400"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE TELEMETRY
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-300">
                <strong className="text-white">24,190+</strong> Reviews Analysed
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-300">
                <strong className="text-amber-400">3,820</strong> Fake/Bot Filtered
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-300">
                <strong className="text-cyan-400">1,490</strong> Complaints Resolved
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agent 2 Point-Delta Core: Latency 4.2ms</span>
            </div>
          </div>
        </aside>
      )}

      {/* 3. Main Page Content Container */}
      <main className={`flex-1 w-full ${maxWidthClass} mx-auto px-6 py-6 md:py-8`}>
        {/* Breadcrumb Layer */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {/* Optional Page Header with Eyebrow */}
        {(eyebrow || title) && (
          <header className="mb-8 pt-2">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{eyebrow}</span>
              </div>
            )}
            {title && (
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2.5 text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </header>
        )}

        {/* Injected Page Content */}
        <div className="w-full">
          {children}
        </div>

        {/* 4. IS 19000:2022 Neutrality Guarantee Banner */}
        {showNeutralityBanner && (
          <section className="mt-14 p-5 rounded-2xl bg-[#0c1220] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-sans text-sm">
                  Statutory Neutrality Guarantee (IS 19000:2022)
                </strong>
                <span className="text-slate-400">
                  Insurers and brands cannot pay for higher scores, edit ratings, or remove verified customer claim experiences.
                </span>
              </div>
            </div>

            <Link
              href="/methodology"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold flex-shrink-0"
            >
              <span>Inspect Formulas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>
        )}

        {/* 5. Bottom Review & Dispute Contribution CTA */}
        {showBottomCTA && (
          <section className="mt-6 p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0c1220] to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Policyholder Action Desk
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Have an authentic experience with an insurer or plan?
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
                Submit your claim turnaround story or dispute. Every verified review updates the national TrustScore and holds brands accountable.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/write-review"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:opacity-95 transition-all text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write Verified Review</span>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
