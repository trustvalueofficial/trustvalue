import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export const metadata = {
  title: "Consumer Trust Portal & Claims Resolution | TrustValue.ai",
  description: "Track your filed policy grievances, verified review contributions, and dispute mediation status.",
  robots: { index: false, follow: false },
};

export default function ConsumerPortalPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Portals" },
            { label: "Consumer Workspace" },
          ]}
        />

        <header className="py-6 border-b border-[#DCE2EB] mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#FF5A0A] block mb-1">CONSUMER DESK</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B46] font-[family-name:var(--font-manrope)]">
              Policyholder Trust Dashboard
            </h1>
          </div>
          <Link
            href="/write-review"
            className="px-4 py-2.5 rounded-xl bg-[#FF5A0A] text-white hover:bg-[#F12A0A] font-bold text-xs transition-all shadow-sm"
          >
            Submit New Review
          </Link>
        </header>

        {/* 3 Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-xs">
          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">Verified Reviews</span>
            <span className="text-2xl font-bold text-[#071B46] mt-1 block">2 Authored</span>
          </div>
          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">Active Claims Tracked</span>
            <span className="text-2xl font-bold text-[#0A8754] mt-1 block">1 Resolved</span>
          </div>
          <div className="bg-white border border-[#DCE2EB] p-5 rounded-xl shadow-sm">
            <span className="text-[#667085] block">Trust Reward Points</span>
            <span className="text-2xl font-bold text-[#FF5A0A] mt-1 block">450 Points</span>
          </div>
        </div>
      </div>
    </div>
  );
}
