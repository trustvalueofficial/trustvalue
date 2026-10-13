import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Database, Download, FileSpreadsheet, ArrowRight } from "lucide-react";
import { getIndustry } from "@/lib/data/industryData";

interface DatasetProps {
  params: Promise<{ dataset: string }>;
}

export async function generateMetadata({ params }: DatasetProps) {
  const { dataset } = await params;
  return {
    title: `Open Dataset: ${dataset.toUpperCase()} — TrustValue.ai Data Portal`,
    description: `Official open-access dataset for ${dataset}. Downloadable CSV and verified IRDAI claim ratio historical telemetry.`,
  };
}

export default async function OpenDatasetPage({ params }: DatasetProps) {
  const { dataset } = await params;
  const industry = getIndustry("insurance");

  return (
    <main className="min-h-screen bg-[#060911] text-slate-100 px-6 py-10 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Open Data", href: "/data" },
          { label: `Dataset: ${dataset}` },
        ]}
      />

      <header className="py-8 border-b border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Open Public Data Initiative</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Life Insurer Claim Payout Benchmark Dataset
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Complete telemetry table tracking all 26 registered life insurers, claim settlement ratios, grievance resolution SLAs, and fraud filter stats.
          </p>
        </div>

        <button className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 flex-shrink-0 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Dataset (CSV)</span>
        </button>
      </header>

      {/* Dataset Table */}
      <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 uppercase">
              <th className="py-3 px-4">IRDAI Reg #</th>
              <th className="py-3 px-4 font-sans font-bold">Insurer Name</th>
              <th className="py-3 px-4">CSR (%)</th>
              <th className="py-3 px-4">Grievance SLA (Days)</th>
              <th className="py-3 px-4">TrustScore</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {industry?.brands.slice(0, 10).map((b) => (
              <tr key={b.slug} className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-400">{b.regulatoryId}</td>
                <td className="py-3 px-4 font-sans font-bold text-white">{b.name}</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{b.claimSettlementRatio}%</td>
                <td className="py-3 px-4 text-slate-300">{b.averageGrievanceResolutionDays}d</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">{b.trustScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
