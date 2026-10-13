import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustry } from "@/lib/data/industryData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import NewsAndRatings from "@/components/dossier/NewsAndRatings";

interface IndustryPageProps {
  params: Promise<{
    industrySlug: string;
  }>;
}

export async function generateMetadata({ params }: IndustryPageProps) {
  const { industrySlug } = await params;
  const industry = getIndustry(industrySlug);
  if (!industry) return { title: "Industry Not Found — TrustValue.ai" };

  return {
    title: `${industry.name} Trust Rankings & Authenticity Directory | TrustValue.ai`,
    description: `Official ranking of registered ${industry.name} brands based on audited IRDAI claim settlement ratios and verified policyholder telemetry.`,
  };
}

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
  const { industrySlug } = await params;
  const industry = getIndustry(industrySlug);

  if (!industry) {
    notFound();
  }

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10 font-[family-name:var(--font-body)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Industries", href: "/industry" },
            { label: industry.name },
          ]}
        />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider">
              <span>{industry.icon}</span>
              <span>{industry.regulator}</span>
            </div>
            <span className="text-xs font-semibold text-[#071B46] bg-[#EEF2F7] border border-[#DCE2EB] px-3 py-1.5 rounded-full">
              Audited: <strong>{industry.totalBrands} Insurers</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            {industry.name} Trust Directory
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] max-w-3xl leading-relaxed">
            {industry.description}
          </p>
        </header>

        {/* Leaderboard Table / Card Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#071B46] flex items-center gap-2 font-[family-name:var(--font-manrope)]">
              <i className="fa-solid fa-award text-amber-500" aria-hidden="true" />
              <span>Registered Insurers Ranked by TrustScore</span>
            </h2>
            <span className="text-xs font-medium text-[#667085] hidden sm:inline">Statutory Neutrality IS 19000:2022</span>
          </div>

          <div className="space-y-4">
            {industry.brands.map((brand) => (
              <div
                key={brand.slug}
                className="bg-white border border-[#DCE2EB] hover:border-[#071B46]/30 rounded-2xl p-5 md:p-6 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Brand Info */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className="w-12 h-12 rounded-xl bg-[#EEF2F7] border border-[#DCE2EB] flex items-center justify-center font-bold text-lg text-[#071B46]">
                    #{brand.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#071B46] hover:text-[#FF5A0A] transition-colors font-[family-name:var(--font-manrope)]">
                        <Link href={`/industry/${industry.slug}/${brand.slug}`}>
                          {brand.name}
                        </Link>
                      </h3>
                      {brand.quarantineStatus === "under_audit" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700">
                          <i className="fa-solid fa-triangle-exclamation text-xs" aria-hidden="true" />
                          <span>Audit Quarantine</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#667085] mt-1">
                      {brand.regulatoryId} • {brand.productsCount} Indexed Plans
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-xs">
                  <div>
                    <span className="text-[#667085] block">Claim Settlement</span>
                    <span className="text-[#0A8754] font-bold text-base">
                      {brand.claimSettlementRatio}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Avg Resolution</span>
                    <span className="text-[#071B46] font-bold text-base">
                      {brand.averageGrievanceResolutionDays} days
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-[#667085] block">Verified Reviews</span>
                    <span className="text-[#071B46] font-bold text-base">
                      {brand.totalVerifiedReviews.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#DCE2EB]">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#667085] block">
                      TrustScore
                    </span>
                    <span className="text-2xl font-extrabold text-[#071B46]">
                      {brand.trustScore}
                      <span className="text-xs text-[#667085]">/100</span>
                    </span>
                  </div>

                  <Link
                    href={`/industry/${industry.slug}/${brand.slug}`}
                    className="px-4 py-2.5 rounded-xl border border-[#DCE2EB] bg-white text-[#071B46] text-sm font-semibold hover:border-[#071B46] hover:bg-[#EEF2F7]/50 transition-all flex items-center gap-1.5"
                  >
                    <span>View</span>
                    <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Image 3 Component: News & Ratings on Industry Page */}
        <div className="mt-8 pt-8 border-t border-[#DCE2EB]">
          <NewsAndRatings rateUrl="/write-review" />
        </div>
      </div>
    </div>
  );
}
