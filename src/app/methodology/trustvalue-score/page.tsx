import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Award, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "How the TrustScore Works — Mathematical Formulation | TrustValue.ai",
  description: "Granular mathematical documentation of the TrustValue TrustScore algorithm: Population-Weighted Blending, Star Point-Delta Matrix, and Anti-Fraud Quarantine.",
};

export default function HowScoreWorksPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Methodology", href: "/methodology" },
            { label: "How the Score Works" },
          ]}
        />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Deterministic Scoring Algorithm</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            How the TrustValue Score Works
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] leading-relaxed">
            The TrustScore is an absolute mathematical metric bounded between 0 and 100. Unlike simple average star ratings that can be gamed with 5-star blast campaigns, TrustValue evaluates four distinct mathematical dimensions.
          </p>
        </header>

        <section className="space-y-8 mb-12">
          {/* Dimension 1 */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#FF5A0A] bg-[#FFF4ED] border border-[#FFD9C7] px-3 py-1 rounded-full">
                DIMENSION 1 (40% Weight)
              </span>
              <span className="text-xs text-[#667085] font-semibold">Statutory Records</span>
            </div>
            <h2 className="text-xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
              IRDAI Claim Settlement Ratio &amp; Repudiation Velocity
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed mb-4">
              Direct ingestion of annual public disclosures submitted by insurers to the Insurance Regulatory and Development Authority of India. We evaluate claims settled, claims repudiated (rejected), and pending claims exceeding 30 days.
            </p>
            <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#DCE2EB] text-xs font-mono text-[#071B46]">
              Claim_Score = (Settled_Ratio * 0.7) + ((1 - Repudiation_Ratio) * 0.3)
            </div>
          </div>

          {/* Dimension 2 */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#FF5A0A] bg-[#FFF4ED] border border-[#FFD9C7] px-3 py-1 rounded-full">
                DIMENSION 2 (30% Weight)
              </span>
              <span className="text-xs text-[#667085] font-semibold">Customer Forensics</span>
            </div>
            <h2 className="text-xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
              Authenticity-Weighted Point-Delta Calibration
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed mb-4">
              Reviews without proof carry virtually zero weight. Each review's contribution is scaled by KYC authenticity ($A_i$), document verification (policy certificate upload), and sentiment consistency.
            </p>
            <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#DCE2EB] text-xs font-mono text-[#071B46]">
              Review_Delta = (Rating_Stars - Mean) * Authenticity_Weight * Volume_Dampener
            </div>
          </div>

          {/* Dimension 3 */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#FF5A0A] bg-[#FFF4ED] border border-[#FFD9C7] px-3 py-1 rounded-full">
                DIMENSION 3 (20% Weight)
              </span>
              <span className="text-xs text-[#667085] font-semibold">Grievance SLA</span>
            </div>
            <h2 className="text-xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
              Dispute Resolution Turnaround Time
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed mb-4">
              How quickly does an insurer acknowledge and resolve escalated consumer grievances? Measured in calendar days from initial filing to closed-loop settlement.
            </p>
          </div>

          {/* Dimension 4 */}
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#FF5A0A] bg-[#FFF4ED] border border-[#FFD9C7] px-3 py-1 rounded-full">
                DIMENSION 4 (10% Weight)
              </span>
              <span className="text-xs text-[#667085] font-semibold">Solvency Health</span>
            </div>
            <h2 className="text-xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
              Regulatory Solvency Ratio
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              Every insurer must maintain capital adequacy above the IRDAI mandatory minimum of 1.50 (150%). Insurers with higher solvency ratios ensure complete claim liquidity during catastrophic national claim surges.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
