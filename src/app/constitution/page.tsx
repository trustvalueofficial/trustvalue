import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ShieldCheck, Scale, Lock, Award, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "The Constitution of TrustValue.ai | Statutory Neutrality Charter",
  description: "The TrustValue Constitution: Our binding commitment to algorithmic neutrality, zero commercial tampering, and compliance with Bureau of Indian Standards IS 19000:2022.",
};

export default function ConstitutionPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "The Constitution" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Charter of Neutrality • IS 19000:2022</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            The TrustValue Constitution
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] leading-relaxed">
            A binding institutional declaration governing our independence, algorithmic transparency, and total immunity from commercial influence.
          </p>
        </header>

        <section className="space-y-6 mb-12">
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
              <span className="text-[#FF5A0A]">Article I.</span> Prohibition of Paid Ratings &amp; Sponsored Badges
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              No brand, corporation, insurer, or financial institution may ever purchase, boost, or sponsor a TrustScore. Ratings are derived strictly through public algorithms and verified customer experiences. Advertisers do not receive preferential algorithmic weighting.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
              <span className="text-[#FF5A0A]">Article II.</span> Inviolability of Verified Customer Reviews
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              A review that passes identity verification, KYC, and document proof cannot be deleted, hidden, or suppressed by commercial request. Insurers possess the absolute right of public reply and structured dispute resolution, but may never censor verified policyholders.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
              <span className="text-[#FF5A0A]">Article III.</span> Zero Lead-Brokerage &amp; Conflict of Interest
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              TrustValue is not an insurance broker, agent, or policy aggregator. We do not accept commissions on policy sales, meaning our index has zero financial incentive to recommend one insurer over another.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
              <span className="text-[#FF5A0A]">Article IV.</span> Algorithmic Transparency &amp; Public Documentation
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              All mathematical formulas used to derive TrustScores are openly published in our public methodology documentation. Formulas apply identically to every entity within a sector without discretion or executive override.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
