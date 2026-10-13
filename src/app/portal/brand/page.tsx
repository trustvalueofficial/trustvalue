import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Building2, TrendingUp, AlertTriangle, MessageSquare, ShieldCheck, Lock } from "lucide-react";

export const metadata = {
  title: "Insurer CRM Reputation Desk | TrustValue.ai",
  description: "Official Insurer Reputation Management Portal. Access TrustScore Drag Analytics, consented lead inboxes, and 1-on-1 dispute mediation.",
  robots: { index: false, follow: false },
};

export default function BrandPortalPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Portals" },
            { label: "Insurer B2B Desk" },
          ]}
        />

        <header className="py-6 border-b border-[#DCE2EB] mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#FF5A0A] block mb-1">ENTERPRISE CRM</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B46] font-[family-name:var(--font-manrope)]">
              Insurer Reputation &amp; Dispute Desk
            </h1>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#E6F4EA] border border-[#0A8754]/30 text-[#0A8754] text-xs font-bold">
              Profile Claimed: Verified Insurer
            </span>
          </div>
        </header>

        {/* 4 Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs">
          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">Current TrustScore</span>
            <span className="text-2xl font-bold text-[#0A8754] mt-1 block">92.4 / 100</span>
            <span className="text-[11px] text-[#667085]">Class A: High Trust</span>
          </div>

          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">TrustScore Drag Penalty</span>
            <span className="text-2xl font-bold text-[#FF5A0A] mt-1 block">-1.2 Points</span>
            <span className="text-[11px] text-[#667085]">From 2 unresolved grievances</span>
          </div>

          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">Consented High-Intent Leads</span>
            <span className="text-2xl font-bold text-[#071B46] mt-1 block">148 Leads</span>
            <span className="text-[11px] text-[#667085]">Active this month</span>
          </div>

          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">Filtered Bot Reviews</span>
            <span className="text-2xl font-bold text-[#071B46] mt-1 block">614 Filtered</span>
            <span className="text-[11px] text-[#667085]">Zero reputation damage</span>
          </div>
        </div>

        {/* 1-on-1 Customer Dispute Mediation Desk */}
        <section className="bg-white border border-[#DCE2EB] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#071B46] mb-2 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
            <MessageSquare className="w-4 h-4 text-[#FF5A0A]" />
            <span>Active Policyholder Disputes Requiring SLA Action (2)</span>
          </h2>
          <p className="text-xs text-[#667085] mb-6">
            Resolving verified policyholder complaints restores TrustScore points within 24 hours of settlement confirmation.
          </p>

          <div className="space-y-3 text-xs">
            <div className="bg-[#FAFBFD] border border-[#DCE2EB] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <strong className="text-[#071B46] block text-sm">Dispute #DIS-9021: Tele-Medical Mis-communication</strong>
                <span className="text-[#667085]">Policyholder: R. Sharma • Plan: Click 2 Protect Super</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-[#FF5A0A] text-white text-xs font-bold hover:bg-[#F12A0A] transition-all">
                Open 1-on-1 Mediation
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
