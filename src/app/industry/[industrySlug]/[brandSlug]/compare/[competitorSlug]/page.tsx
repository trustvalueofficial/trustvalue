import Link from "next/link";
import { notFound } from "next/navigation";
import { compareBrands, getIndustry } from "@/lib/data/industryData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ArrowRight, ArrowLeftRight, Trophy } from "lucide-react";

interface ComparePageProps {
  params: Promise<{
    industrySlug: string;
    brandSlug: string;
    competitorSlug: string;
  }>;
}

export async function generateMetadata({ params }: ComparePageProps) {
  const { industrySlug, brandSlug, competitorSlug } = await params;
  const comparison = compareBrands(industrySlug, brandSlug, competitorSlug);

  if (!comparison) return { title: "Comparison Not Found — TrustValue.ai" };

  return {
    title: `${comparison.brandA.name} vs ${comparison.brandB.name} Trust Comparison | TrustValue.ai`,
    description: `Independent comparison between ${comparison.brandA.name} (TrustScore ${comparison.brandA.trustScore}) and ${comparison.brandB.name} (TrustScore ${comparison.brandB.trustScore}). Compare claim ratios, grievance speeds, and customer ratings.`,
  };
}

export default async function BrandComparisonPage({ params }: ComparePageProps) {
  const { industrySlug, brandSlug, competitorSlug } = await params;
  const industry = getIndustry(industrySlug);
  const comparison = compareBrands(industrySlug, brandSlug, competitorSlug);

  if (!industry || !comparison) {
    notFound();
  }

  const { brandA, brandB, scoreDelta, metrics, verdictSummary } = comparison;

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Industries", href: "/industry" },
            { label: industry.name, href: `/industry/${industry.slug}` },
            { label: brandA.name, href: `/industry/${industry.slug}/${brandA.slug}` },
            { label: `vs ${brandB.name}` },
          ]}
        />

        {/* Comparison Header */}
        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Head-to-Head Point-Delta Audit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            {brandA.name} <span className="text-[#667085] font-normal">vs</span> {brandB.name}
          </h1>
          <p className="mt-2 text-[#46526B] max-w-3xl text-sm sm:text-base leading-relaxed">
            {verdictSummary}
          </p>
        </header>

        {/* Side-by-Side Trust Score Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Brand A Card */}
          <div className={`p-6 rounded-2xl border transition-all ${scoreDelta >= 0 ? "bg-white border-[#0A8754] shadow-md" : "bg-white border-[#DCE2EB] shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                Entity A • Rank #{brandA.rank}
              </span>
              {scoreDelta >= 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#E6F4EA] border border-[#0A8754]/30 text-[#0A8754]">
                  <Trophy className="w-3 h-3" /> Winner (+{scoreDelta})
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-[#071B46] mb-1 font-[family-name:var(--font-manrope)]">{brandA.name}</h2>
            <span className="text-xs text-[#667085] block mb-6">{brandA.regulatoryId}</span>

            <div className="bg-[#FAFBFD] border border-[#DCE2EB] p-5 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#667085]">Overall TrustScore:</span>
              <span className="text-3xl font-extrabold text-[#071B46]">
                {brandA.trustScore}<span className="text-xs text-[#667085]">/100</span>
              </span>
            </div>

            <div className="mt-4 flex justify-between text-xs text-[#46526B] px-1">
              <span>Claim Ratio: <strong className="text-[#0A8754]">{brandA.claimSettlementRatio}%</strong></span>
              <span>Resolution: <strong className="text-[#071B46]">{brandA.averageGrievanceResolutionDays}d</strong></span>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DCE2EB]">
              <Link
                href={`/industry/${industry.slug}/${brandA.slug}`}
                className="text-xs font-bold text-[#FF5A0A] hover:underline flex items-center gap-1"
              >
                <span>Inspect Full {brandA.name} Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Brand B Card */}
          <div className={`p-6 rounded-2xl border transition-all ${scoreDelta < 0 ? "bg-white border-[#0A8754] shadow-md" : "bg-white border-[#DCE2EB] shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                Entity B • Rank #{brandB.rank}
              </span>
              {scoreDelta < 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#E6F4EA] border border-[#0A8754]/30 text-[#0A8754]">
                  <Trophy className="w-3 h-3" /> Winner (+{Math.abs(scoreDelta)})
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-[#071B46] mb-1 font-[family-name:var(--font-manrope)]">{brandB.name}</h2>
            <span className="text-xs text-[#667085] block mb-6">{brandB.regulatoryId}</span>

            <div className="bg-[#FAFBFD] border border-[#DCE2EB] p-5 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#667085]">Overall TrustScore:</span>
              <span className="text-3xl font-extrabold text-[#071B46]">
                {brandB.trustScore}<span className="text-xs text-[#667085]">/100</span>
              </span>
            </div>

            <div className="mt-4 flex justify-between text-xs text-[#46526B] px-1">
              <span>Claim Ratio: <strong className="text-[#0A8754]">{brandB.claimSettlementRatio}%</strong></span>
              <span>Resolution: <strong className="text-[#071B46]">{brandB.averageGrievanceResolutionDays}d</strong></span>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DCE2EB]">
              <Link
                href={`/industry/${industry.slug}/${brandB.slug}`}
                className="text-xs font-bold text-[#FF5A0A] hover:underline flex items-center gap-1"
              >
                <span>Inspect Full {brandB.name} Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Point-Delta Comparison Matrix Table */}
        <section className="bg-white border border-[#DCE2EB] rounded-2xl p-6 md:p-8 mb-10 overflow-x-auto shadow-sm">
          <h2 className="text-xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">Point-Delta Performance Matrix</h2>
          <p className="text-xs text-[#667085] mb-6">
            Weighted evaluation across regulatory compliance, payout speed, and verified policyholder volume.
          </p>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#DCE2EB] text-xs text-[#667085] uppercase font-bold">
                <th className="py-3 px-4">Dimension Metric</th>
                <th className="py-3 px-4">{brandA.name}</th>
                <th className="py-3 px-4">{brandB.name}</th>
                <th className="py-3 px-4 text-center">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EB] text-xs">
              {metrics.map((m, idx) => (
                <tr key={idx} className="hover:bg-[#FAFBFD]">
                  <td className="py-4 px-4 font-semibold text-[#071B46]">
                    {m.metricName}
                    <span className="text-[11px] text-[#667085] block font-normal">Weight: {m.importanceWeight}%</span>
                  </td>
                  <td className={`py-4 px-4 font-bold ${m.winner === "A" ? "text-[#0A8754]" : "text-[#46526B]"}`}>
                    {m.brandAValue}
                  </td>
                  <td className={`py-4 px-4 font-bold ${m.winner === "B" ? "text-[#0A8754]" : "text-[#46526B]"}`}>
                    {m.brandBValue}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${m.winner === "A" ? "bg-[#E6F4EA] text-[#0A8754] border border-[#0A8754]/30" : "bg-[#EEF2F7] text-[#071B46] border border-[#DCE2EB]"}`}>
                      {m.winner === "A" ? brandA.name : brandB.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
