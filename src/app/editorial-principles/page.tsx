import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { FileCheck, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Editorial Principles & Fact Verification | TrustValue.ai",
  description: "Our standards for fact-checking, review validation, regulatory source cross-referencing, and independence from financial institutions.",
};

export default function EditorialPrinciplesPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Editorial Principles" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <FileCheck className="w-4 h-4" />
            <span>Fact Verification Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Editorial Principles &amp; Verification
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#46526B] leading-relaxed">
            How TrustValue ensures every fact, metric, and review displayed on our platform meets legal-grade evidentiary standards.
          </p>
        </header>

        <section className="space-y-6 mb-12">
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              1. Primary Statutory Source Mandate
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              All financial and regulatory figures — including Claim Settlement Ratios, Solvency Ratios, and Grievance Disposals — are extracted directly from official IRDAI annual reports, public disclosures (Form NL-1 to NL-40), and audited balance sheets. We do not accept self-reported insurer marketing claims.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              2. Review Verification Hierarchy
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              Every customer submission passes through our multi-stage verification pipeline:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#46526B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A8754] flex-shrink-0" />
                <strong>Stage 1: Identity KYC:</strong> Phone and email OTP verification.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A8754] flex-shrink-0" />
                <strong>Stage 2: Policy Proof:</strong> Policy document hash verification.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A8754] flex-shrink-0" />
                <strong>Stage 3: NLP Forensics:</strong> Detection of bot rings, PR blasts, and AI text generators.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              3. Right of Insurer Response &amp; Closed-Loop Mediation
            </h2>
            <p className="text-sm text-[#46526B] leading-relaxed">
              Insurers are provided with an official, audited channel to respond to customer grievances. When an insurer successfully resolves a disputed claim, the resolution is logged publicly in the audit trail, and the policyholder is prompted to confirm satisfaction.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
