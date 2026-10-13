import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Cookie, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | TrustValue.ai",
  description: "Cookie policy for TrustValue.ai. Zero third-party behavioral ad tracking. Strict privacy compliance.",
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Cookie Policy" }]} />

        <header className="py-8 border-b border-[#DCE2EB] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FFD9C7] text-[#FF5A0A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Cookie className="w-4 h-4" />
            <span>Telemetry &amp; Session Storage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B46] tracking-tight font-[family-name:var(--font-manrope)]">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#46526B]">
            We keep cookie usage to the bare legal and technical minimum. TrustValue does not employ third-party behavioral retargeting or surveillance ad pixels.
          </p>
        </header>

        <section className="space-y-6 text-sm text-[#46526B] leading-relaxed mb-12">
          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              1. Essential System Cookies
            </h2>
            <p>
              These cookies are strictly required to ensure core functionality, such as keeping you logged into your Consumer Trust Passport or Insurer Reputation Desk, handling security CSRF tokens, and remembering theme preferences.
            </p>
          </div>

          <div className="bg-white border border-[#DCE2EB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
              2. First-Party Anonymised Telemetry
            </h2>
            <p>
              We measure basic aggregate site performance metrics (e.g., page load speeds, search response latency) using self-hosted, cookieless telemetry that does not link back to personal profiles or cross-site tracking IDs.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
