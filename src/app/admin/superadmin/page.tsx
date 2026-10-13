import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ShieldAlert, Key, Activity, Database, Scale, Lock, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Superadmin Master Governance Console — TrustValue.ai",
  description: "Enterprise root console. FIDO2 MFA protected, Swarm health telemetry, 1% statistical review audits, and immutable cryptographic audit ledger.",
  robots: { index: false, follow: false },
};

export default function SuperadminPage() {
  return (
    <main className="min-h-screen bg-[#060911] text-slate-100 px-6 py-10 max-w-7xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Admin Console", href: "/admin" },
          { label: "Superadmin Governance" },
        ]}
      />

      <header className="py-6 border-b border-rose-900/60 mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-mono text-rose-400 font-bold tracking-widest uppercase">
              LEVEL 0: ROOT GOVERNANCE CONSOLE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Command &amp; Audit Desk</h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 px-3 py-1.5 rounded-lg">
          <Key className="w-3.5 h-3.5" />
          <span>FIDO2 WebAuthn Enforced</span>
        </div>
      </header>

      {/* 4 Swarm Health Monitors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono text-xs">
        <div className="bg-[#0c1220] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 block">Agent 1 (Scraper Swarm)</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">ONLINE (42 nodes)</span>
          <span className="text-[11px] text-slate-400">Headless proxy fleet healthy</span>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 block">Agent 2 (Point-Delta Engine)</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">LATENCY 4.2ms</span>
          <span className="text-[11px] text-slate-400">Bayesian queues clearing</span>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 block">Daily LLM Token Burn</span>
          <span className="text-xl font-bold text-white mt-1 block">$34.20 / $130.00</span>
          <span className="text-[11px] text-emerald-400">Circuit breaker nominal</span>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 block">1% Quality Audit Queue</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">14 Decisions Pending</span>
          <span className="text-[11px] text-slate-400">Human consensus review</span>
        </div>
      </div>

      {/* Cryptographic Audit Ledger */}
      <section className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Cryptographic Tamper-Evident Immutable Audit Log (SHA-256)</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Every administrative state change, proxy reload, and score recalculation is cryptographically chained.
        </p>

        <div className="bg-[#080d19] border border-slate-800 p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
          <div>[2026-10-11T00:28:14Z] BLOCK #10931 • ACTOR: superadmin_01 (MFA FIDO2) • ACTION: REVALIDATE_EDGE_TAG • TARGET: /industry/*</div>
          <div>[2026-10-11T00:15:02Z] BLOCK #10930 • ACTOR: compliance_lead • ACTION: VERIFY_KYC_CLAIM • TARGET: rev-101 (HDFC Life)</div>
          <div>[2026-10-10T23:59:44Z] BLOCK #10929 • ACTOR: system_daemon • ACTION: AGENT1_ROTATING_PROXY_REFRESH • STATUS: SUCCESS</div>
        </div>
      </section>
    </main>
  );
}
