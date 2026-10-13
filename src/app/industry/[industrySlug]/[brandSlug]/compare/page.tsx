import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustry, getBrand } from "@/lib/data/industryData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

interface CompareHubProps {
  params: Promise<{
    industrySlug: string;
    brandSlug: string;
  }>;
}

export async function generateMetadata({ params }: CompareHubProps) {
  const { industrySlug, brandSlug } = await params;
  const brand = getBrand(industrySlug, brandSlug);
  if (!brand) return { title: "Compare — TrustValue.ai" };

  return {
    title: `Compare ${brand.name} with Peers | TrustValue.ai`,
    description: `Side-by-side TrustScore, claim settlement, and customer satisfaction comparison between ${brand.name} and other licensed providers.`,
  };
}

export default async function BrandCompareHubPage({ params }: CompareHubProps) {
  const { industrySlug, brandSlug } = await params;
  const industry = getIndustry(industrySlug);
  const brand = getBrand(industrySlug, brandSlug);

  if (!industry || !brand) {
    notFound();
  }

  const competitors = industry.brands.filter((b) => b.slug !== brand.slug);

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Industries", href: "/industry" },
            { label: industry.name, href: `/industry/${industry.slug}` },
            { label: brand.name, href: `/industry/${industry.slug}/${brand.slug}` },
            { label: "Compare" },
          ]}
        />

        <div className="mt-8 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#071B46]/5 text-[#071B46] mb-4">
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF5A0A]" />
            Side-by-Side Benchmark Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071B46] tracking-tight">
            Compare {brand.name} with Industry Peers
          </h1>
          <p className="mt-2 text-base text-[#667085] max-w-3xl">
            Select an insurer below to compare real claim settlement rates, grievance resolutions,
            regulatory compliance, and algorithmic TrustScores side-by-side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map((peer) => (
            <Link
              key={peer.slug}
              href={`/industry/${industry.slug}/${brand.slug}/compare/${peer.slug}`}
              className="bg-white border border-[#DCE2EB] rounded-2xl p-6 hover:shadow-lg hover:border-[#071B46] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#667085]">Head-to-Head</span>
                  <span className="text-xs font-mono font-bold text-[#FF5A0A]">
                    {brand.trustScore} vs {peer.trustScore}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071B46] group-hover:text-[#FF5A0A] transition-colors">
                  {brand.name} vs {peer.name}
                </h3>
                <p className="text-xs text-[#667085] mt-2">
                  CSR: {peer.claimSettlementRatio}% · Resolution: {peer.averageGrievanceResolutionDays}d avg
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F2F4F7] flex items-center justify-between text-xs font-bold text-[#071B46] group-hover:text-[#FF5A0A]">
                <span>View Full Comparison</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
