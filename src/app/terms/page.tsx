import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { FileText, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | TrustValue.ai",
  description: "Terms and conditions of use for the TrustValue.ai Global Trust Index, neutrality declarations, user submissions, and intellectual property.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#46526B]">
            Last updated: October 2026. Please read these terms carefully before accessing TrustValue.ai telemetry or submitting review audits.
          </p>
        </header>

        <section className="space-y-6 text-sm text-[#46526B] leading-relaxed mb-12">
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              1. Independent Telemetry Status &amp; Non-Intermediation
            </h2>
            <p>
              TrustValue.ai is an independent telemetry index. TrustValue is not an insurance company, insurance broker, corporate agent, or financial adviser registered under IRDAI. TrustValue does not sell, solicit, or issue insurance policies. Information provided on this site is for educational and consumer transparency purposes.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              2. Authentic User Review Submissions
            </h2>
            <p>
              By submitting a review, rating, or policy audit, you warrant that you are a genuine policyholder or nominee with personal experience of the reviewed product. You agree not to submit fraudulent, compensated, or commercially incentivized reviews. Reviews violating these provisions will be quarantined and removed.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              3. Neutrality &amp; Bureau of Indian Standards Compliance
            </h2>
            <p>
              TrustValue operates strictly in adherence to the guidelines of IS 19000:2022 (Online Consumer Reviews — Principles and Requirements for their Collection, Moderation and Publication). No entity may pay to alter ratings or suppress authentic user sentiment.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
