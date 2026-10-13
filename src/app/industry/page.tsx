import Link from "next/link";
import { getAllIndustries } from "@/lib/data/industryData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Industry Directory | TrustValue.ai - The Global Trust Index",
  description: "Explore independent authenticity audits and trust rankings across major sectors. Audited under IS 19000:2022 standards.",
};

export default function IndustryDirectoryPage() {
  const industries = getAllIndustries();

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Industries" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Universal Industry Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Industries &amp; Authenticity Audits
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] max-w-3xl leading-relaxed">
            Select an industry to inspect authenticity-weighted TrustScores, regulatory claim grievance telemetry, and verified policyholder sentiment.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industry/${ind.slug}`}
              className="group bg-white border border-[#DCE2EB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#071B46]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 bg-[#EEF2F7] border border-[#DCE2EB] rounded-xl">{ind.icon}</span>
                  <span className="text-xs font-bold text-[#071B46] bg-[#EEF2F7] border border-[#DCE2EB] px-2.5 py-1 rounded-full">
                    Avg: {ind.averageIndustryTrustScore}/100
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#071B46] group-hover:text-[#FF5A0A] transition-colors font-[family-name:var(--font-manrope)]">
                  {ind.name}
                </h2>
                <p className="mt-2 text-sm text-[#46526B] line-clamp-2 leading-relaxed">
                  {ind.description}
                </p>

                <div className="mt-6 pt-4 border-t border-[#DCE2EB] grid grid-cols-2 gap-2 text-xs text-[#667085]">
                  <div>
                    <span className="block text-[#667085]">Audited Brands</span>
                    <span className="text-[#071B46] font-bold text-sm">{ind.totalBrands} registered</span>
                  </div>
                  <div>
                    <span className="block text-[#667085]">Catalog Plans</span>
                    <span className="text-[#071B46] font-bold text-sm">{ind.totalProducts}+ indexed</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-[#FF5A0A] group-hover:translate-x-1 transition-transform">
                <span>Explore {ind.name}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
