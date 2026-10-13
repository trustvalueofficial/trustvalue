import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Search, ArrowRight } from "lucide-react";
import { getAllIndustries } from "@/lib/data/industryData";

export const metadata = {
  title: "Search & Filter Trust Directory | TrustValue.ai",
  description: "Search 26+ life insurers and 480+ plans by claim settlement speed, authenticity score, and verified ratings.",
  robots: { index: false, follow: true },
};

export default function SearchDirectoryPage() {
  const industries = getAllIndustries();
  const allBrands = industries.flatMap((i) => i.brands);

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Search Directory" }]} />

        <header className="py-6 border-b border-[#DCE2EB] mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Universal Search &amp; Trust Explorer
          </h1>
          <p className="mt-2 text-[#46526B] text-sm">
            Filter entities by regulatory registration, claim settlement speed, or verified fraud-filtered reviews.
          </p>

          {/* Search Bar Input */}
          <div className="mt-6 max-w-2xl relative">
            <input
              type="text"
              placeholder="Search by insurer name, policy term, or IRDAI code (e.g. HDFC, Click 2 Protect)..."
              className="w-full bg-white border border-[#DCE2EB] rounded-xl px-5 py-3.5 pl-12 text-sm text-[#06132F] placeholder-[#667085] focus:outline-none focus:border-[#FF5A0A] shadow-sm"
            />
            <Search className="w-5 h-5 text-[#667085] absolute left-4 top-3.5" />
          </div>
        </header>

        {/* Results grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBrands.slice(0, 12).map((brand) => (
            <div
              key={brand.slug}
              className="bg-white border border-[#DCE2EB] rounded-xl p-5 hover:border-[#071B46]/30 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[#667085] bg-[#EEF2F7] px-2 py-0.5 rounded">
                    {brand.regulatoryId}
                  </span>
                  <span className="text-xs font-bold text-[#0A8754]">
                    Score: {brand.trustScore}/100
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">{brand.name}</h3>
                <div className="text-xs text-[#46526B] space-y-1">
                  <div>Claim Ratio: <strong className="text-[#0A8754]">{brand.claimSettlementRatio}%</strong></div>
                  <div>Grievance Resolution: <strong className="text-[#071B46]">{brand.averageGrievanceResolutionDays}d</strong></div>
                  <div>Verified Reviews: <strong className="text-[#071B46]">{brand.totalVerifiedReviews}</strong></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#DCE2EB] flex items-center justify-between">
                <Link
                  href={`/industry/${brand.industrySlug}/${brand.slug}`}
                  className="text-xs font-bold text-[#FF5A0A] hover:underline flex items-center gap-1"
                >
                  <span>View Brand Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
