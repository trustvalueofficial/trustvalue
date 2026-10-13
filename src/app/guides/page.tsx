import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { BookOpen, ArrowRight, ShieldCheck, Clock, FileText } from "lucide-react";

export const metadata = {
  title: "Consumer Insurance & Trust Guides | TrustValue.ai",
  description: "Essential consumer guides: IRDAI Section 45 3-year rule, claim settlement documents checklist, avoiding policy repudiation, and choosing pure term insurance.",
};

export default function GuidesDirectoryPage() {
  const guides = [
    {
      title: "The Section 45 Shield: Why Insurers Cannot Reject Claims After 3 Years",
      slug: "section-45-indisputability-rule",
      category: "Legal Protection",
      readTime: "5 min read",
      summary: "Understand the Insurance Act Section 45 amendment that prevents life insurers from questioning or repudiating any death claim once a policy completes 3 continuous years.",
    },
    {
      title: "Death Claim Checklist: Every Document Required for Fast Payout",
      slug: "death-claim-settlement-checklist",
      category: "Claim Settlement",
      readTime: "7 min read",
      summary: "A practical step-by-step checklist of death certificate, medical reports, nominee KYC, and NEFT mandates to achieve a 3-day claim settlement turnaround.",
    },
    {
      title: "Term Insurance vs ULIP: Where Are You Really Losing Money?",
      slug: "term-vs-ulip-truth",
      category: "Plan Comparison",
      readTime: "6 min read",
      summary: "An unvarnished financial breakdown comparing pure risk cover with market-linked unit plans. How mortality charges and fund management fees eat into your returns.",
    },
    {
      title: "How to Spot Fake Reviews on Insurance Portals & Aggregators",
      slug: "fake-insurance-reviews-forensics",
      category: "Consumer Forensics",
      readTime: "4 min read",
      summary: "Learn the common telltale signs of PR-planted reviews, 5-star rating spikes before quarter-end, and how TrustValue filters commercial bias under IS 19000:2022.",
    },
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Guides" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Independent Consumer Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Consumer Guides &amp; Policy Intelligence
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] max-w-3xl leading-relaxed">
            Unfiltered, legal-grade guides designed to protect Indian policyholders before buying insurance and during claim settlement.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guides.map((g, idx) => (
            <article
              key={idx}
              className="bg-white border border-[#DCE2EB] hover:border-[#071B46]/30 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#FF5A0A] bg-[#FFF4ED] border border-[#FFD9C7] px-3 py-1 rounded-full">
                    {g.category}
                  </span>
                  <span className="text-xs text-[#667085] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {g.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#071B46] mb-3 leading-snug font-[family-name:var(--font-manrope)]">
                  {g.title}
                </h2>
                <p className="text-sm text-[#46526B] leading-relaxed mb-6">
                  {g.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DCE2EB] flex items-center justify-between">
                <Link
                  href={`/questions/${g.slug}`}
                  className="text-xs font-bold text-[#FF5A0A] hover:underline flex items-center gap-1"
                >
                  <span>Read Full Evidence Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
