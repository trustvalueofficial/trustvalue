import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { User, Building2, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Log in to TrustValue | Consumer & Insurer Portals",
  description: "Log in to your Consumer Trust Passport or Insurer Reputation CRM Desk on TrustValue.ai.",
};

export default function LoginPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Log in" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Authentication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Choose Your Portal
          </h1>
          <p className="mt-3 text-base text-[#46526B]">
            Select your account type to access verified review histories or official insurer reputation management.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Consumer Portal */}
          <div className="bg-white border border-[#DCE2EB] hover:border-[#071B46]/30 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF4ED] text-[#FF5A0A] flex items-center justify-center mb-6">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
                For Policyholders
              </h2>
              <p className="text-sm text-[#46526B] leading-relaxed mb-6">
                Manage your verified reviews, track ongoing claim disputes, monitor your insurer’s TrustScore changes, and earn verified reviewer badges.
              </p>
            </div>

            <Link
              href="/portal/consumer"
              className="w-full py-3 rounded-xl bg-[#FF5A0A] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F12A0A] transition-all shadow-sm"
            >
              <span>Consumer Trust Passport</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Insurer Business Portal */}
          <div className="bg-white border border-[#DCE2EB] hover:border-[#071B46]/30 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF2F7] text-[#071B46] flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
                For Insurers &amp; Brands
              </h2>
              <p className="text-sm text-[#46526B] leading-relaxed mb-6">
                Access your official corporate reputation desk, respond to verified policyholder reviews, analyze competitor benchmarks, and manage claim mediation.
              </p>
            </div>

            <Link
              href="/portal/brand"
              className="w-full py-3 rounded-xl border border-[#DCE2EB] bg-white text-[#071B46] font-bold text-sm flex items-center justify-center gap-2 hover:border-[#071B46] transition-all"
            >
              <span>Insurer Reputation Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
