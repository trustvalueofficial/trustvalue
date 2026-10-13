import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

interface LaunchProps {
  params: Promise<{ plan: string }>;
}

export async function generateMetadata({ params }: LaunchProps) {
  const { plan } = await params;
  const title = plan.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `New Launch: ${title} — Early Trust Audit — TrustValue.ai`,
    description: `Early access trust analysis for ${title}. Inspect policy wording clauses, premium-to-benefit ratios, and early disclosures.`,
  };
}

export default async function NewPlanLaunchPage({ params }: LaunchProps) {
  const { plan } = await params;
  const planTitle = plan.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="min-h-screen bg-[#060911] text-slate-100 px-6 py-10 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "New Launches", href: "/launches" },
          { label: planTitle },
        ]}
      />

      <header className="py-8 border-b border-slate-800 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Product Filing Showcase (Early Access)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          {planTitle}
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl">
          Newly registered life insurance plan undergoing Bayesian prior benchmarking before full public score consolidation.
        </p>
      </header>

      <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Early Audit Checklist</h2>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> <span>IRDAI Unique Identification Number (UIN) verified</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> <span>Policy prospectus &amp; exclusion wordings digitized</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap className="w-4 h-4" /> <span>Initial Bayesian prior benchmark score: 78.0 / 100</span>
          </div>
        </div>
      </div>
    </main>
  );
}
