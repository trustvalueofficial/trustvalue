import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Star, CheckCircle2, Clock } from "lucide-react";

interface SingleReviewProps {
  params: Promise<{ reviewId: string }>;
}

export async function generateMetadata({ params }: SingleReviewProps) {
  const { reviewId } = await params;
  return {
    title: `Verified Review #${reviewId} & Dispute Resolution Audit | TrustValue.ai`,
    description: `Verified policyholder claim thread #${reviewId} with full insurer settlement timeline.`,
  };
}

export default async function SingleReviewResolutionPage({ params }: SingleReviewProps) {
  const { reviewId } = await params;

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Insurance", href: "/insurance" },
            { label: "Reviews", href: "/reviews" },
            { label: "Review #" + reviewId },
          ]}
        />

        <article className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 my-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DCE2EB] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#071B46] text-base">Vikram R. (Bangalore)</span>
              <span className="text-xs font-semibold text-[#0A8754] bg-[#E6F4EA] border border-[#0A8754]/30 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Policyholder KYC Verified
              </span>
            </div>
            <span className="text-xs text-[#667085]">September 2026</span>
          </div>

          <div className="flex items-center gap-1 text-[#FFAA00] mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-xs text-[#667085] ml-2 font-medium">Rating: 5.0 / 5.0</span>
          </div>

          <h1 className="text-2xl font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
            Settled term life claim within 4 days with zero friction
          </h1>
          <p className="text-[#46526B] leading-relaxed text-sm">
            My father held a policy for 6 years. Submitted death certificate and hospital records online. Relationship manager was proactive and payment was credited on the 4th day directly to nominee account. No physical branch visit was required.
          </p>

          {/* Closed-Loop Resolution Timeline */}
          <div className="mt-8 pt-6 border-t border-[#DCE2EB]">
            <h2 className="text-sm uppercase text-[#FF5A0A] font-bold mb-4 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
              <Clock className="w-4 h-4" />
              <span>Closed-Loop Resolution Audit Trail</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 bg-[#FAFBFD] p-3 rounded-xl border border-[#DCE2EB]">
                <span className="text-[#0A8754] font-bold">Day 1</span>
                <div>
                  <strong className="text-[#071B46] block">Claim Documents Uploaded</strong>
                  <span className="text-[#667085]">Digital KYC verified against Aadhaar / Nominee PAN</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#FAFBFD] p-3 rounded-xl border border-[#DCE2EB]">
                <span className="text-[#0A8754] font-bold">Day 3</span>
                <div>
                  <strong className="text-[#071B46] block">Medical Underwriting Clearance</strong>
                  <span className="text-[#667085]">Section 45 indisputability clause validated</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#FAFBFD] p-3 rounded-xl border border-[#DCE2EB]">
                <span className="text-[#0A8754] font-bold">Day 4</span>
                <div>
                  <strong className="text-[#0A8754] block">Funds Disbursed to Nominee</strong>
                  <span className="text-[#667085]">NEFT UTR settlement logged • Case Closed</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
