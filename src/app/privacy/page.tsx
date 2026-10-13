import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Shield, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | TrustValue.ai",
  description: "Privacy policy for TrustValue.ai. Compliance with the Digital Personal Data Protection (DPDP) Act 2023. Zero data selling, client-side document scrubbing.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-4 h-4" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#46526B]">
            Your privacy is non-negotiable. TrustValue does not sell policyholder data, monetise user phone numbers, or provide lead lists to third-party telemarketers.
          </p>
        </header>

        <section className="space-y-6 text-sm text-[#46526B] leading-relaxed mb-12">
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              1. What We Collect &amp; Why
            </h2>
            <p>
              When you submit a review or report a claim dispute, we collect verification details (such as policy certificate hashes and contact tokens) strictly to establish proof of transaction under IS 19000:2022. Personal identification details are scrubbed and anonymised before publication.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              2. Absolute Ban on Data Brokering
            </h2>
            <p>
              Unlike traditional insurance portals that sell your phone number to dozens of insurance telemarketers the moment you compare a plan, TrustValue has an absolute technical and legal ban on selling user data.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              3. Data Retention &amp; Right to Erasure
            </h2>
            <p>
              In full compliance with India's Digital Personal Data Protection Act, you retain the complete right to request the deletion or correction of your personal data at any time through our privacy desk.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
