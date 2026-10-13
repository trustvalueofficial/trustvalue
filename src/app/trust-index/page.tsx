import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ShieldCheck, ArrowRight, BarChart3, Globe, Lock, Cpu } from "lucide-react";

export const metadata = {
  title: "The Global Trust Index | Universal Consumer & Corporate Telemetry | TrustValue.ai",
  description: "The Global Trust Index across all consumer-critical industries. Universal trust telemetry calibrated under IS 19000:2022 neutrality standards.",
};

export default function TrustIndexOverviewPage() {
  const sectors = [
    {
      name: "Life & Health Insurance",
      status: "LIVE AUDIT (Phase 1)",
      entities: "26 Registered Insurers",
      regulator: "IRDAI",
      avgScore: 78.4,
      href: "/industry/insurance",
      badge: "LIVE",
    },
    {
      name: "Retail Banking & Credit",
      status: "CALIBRATION (Phase 2)",
      entities: "34 Scheduled Commercial Banks",
      regulator: "RBI",
      avgScore: 82.1,
      href: "#",
      badge: "COMING SOON",
    },
    {
      name: "Broadband & Telecom",
      status: "DATA INGESTION (Phase 3)",
      entities: "Tier-1 Telcos & ISPs",
      regulator: "TRAI",
      avgScore: 68.3,
      href: "#",
      badge: "COMING SOON",
    },
    {
      name: "Residential Real Estate",
      status: "DATA INGESTION (Phase 4)",
      entities: "National Builders & Projects",
      regulator: "RERA",
      avgScore: 61.9,
      href: "#",
      badge: "COMING SOON",
    },
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Trust Index" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Globe className="w-4 h-4" />
            <span>Universal Telemetry Core • IS 19000:2022</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            The Global Trust Index
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] max-w-3xl leading-relaxed">
            Universal trust telemetry replacing opaque review aggregators with cryptographic and regulatory proof. We measure consumer-critical industries on what actually happens when contracts are tested.
          </p>
        </header>

        {/* Sectors Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sectors.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge === "LIVE" ? "bg-[#E6F4EA] text-[#0A8754] border border-[#0A8754]/30" : "bg-[#EEF2F7] text-[#667085] border border-[#DCE2EB]"}`}>
                    {s.badge}
                  </span>
                  <span className="text-xs font-bold text-[#071B46]">
                    Regulator: {s.regulator}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
                  {s.name}
                </h2>
                <p className="text-xs text-[#667085] mb-6">{s.status} • {s.entities}</p>

                <div className="bg-[#FAFBFD] border border-[#DCE2EB] p-4 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#667085]">Sector Average TrustScore:</span>
                  <span className="text-2xl font-extrabold text-[#071B46]">
                    {s.avgScore}<span className="text-xs text-[#667085]">/100</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCE2EB]">
                {s.badge === "LIVE" ? (
                  <Link
                    href={s.href}
                    className="w-full py-2.5 rounded-xl bg-[#FF5A0A] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F12A0A] transition-all"
                  >
                    <span>Inspect Sector Live Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-[#EEF2F7] text-[#667085] font-semibold text-xs cursor-not-allowed"
                  >
                    Telemetry Pipeline Active
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* 3 Foundational Pillars */}
        <section className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#071B46] mb-6 font-[family-name:var(--font-manrope)]">
            How TrustValue Calculates The Index
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#46526B]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#FF5A0A] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071B46] mb-1 font-[family-name:var(--font-manrope)]">1. Regulatory Grounding</h3>
              <p className="text-xs leading-relaxed">Audited claims settlement ratios, repudiation rates, and grievance response SLAs direct from statutory regulator filings.</p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#FF5A0A] flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071B46] mb-1 font-[family-name:var(--font-manrope)]">2. Bot &amp; Shilling Forensics</h3>
              <p className="text-xs leading-relaxed">Autonomous AI pattern recognition detects review clusters, PR-firm blast cycles, and paid positive defamation.</p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#FF5A0A] flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071B46] mb-1 font-[family-name:var(--font-manrope)]">3. Statutory Neutrality</h3>
              <p className="text-xs leading-relaxed">Certified under IS 19000:2022. No insurer can purchase score increments, remove negative reviews, or buy advertising.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
