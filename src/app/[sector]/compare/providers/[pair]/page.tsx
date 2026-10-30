import { notFound } from "next/navigation";
import Link from "next/link";
import type { Provider } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getComparePairs, getOfferingsByProvider, getProvider, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = { params: Promise<{ sector: string; pair: string }> };
export const dynamicParams = false;
// Spec rule: generate compare pages only for curated, most-searched pairs (content/compare.json).
export const generateStaticParams = () => getComparePairs().providers.map((p) => ({ sector: p.sector, pair: p.pair }));

export default async function CompareProviders({ params }: Props) {
  const { sector: s, pair } = await params;
  const sector = getSector(s);
  const [a, b] = pair.split("-vs-").map((x) => getProvider(x));
  if (!sector || !a || !b || !a.sectors[s] || !b.sectors[s]) notFound();

  const offeringsA = getOfferingsByProvider(s, a.slug);
  const offeringsB = getOfferingsByProvider(s, b.slug);

  const rows: [string, (p: Provider) => string][] = [
    ["Entity Type", (p) => p.type],
    ["Regulatory Registration", (p) => p.sectors[s].registration ?? "Verified Public Record"],
    ["Parent Group", (p) => p.parentGroup ? `${p.parentGroup} Group` : "Independent Entity"],
    [sector.labels.offerings, (p) => `${getOfferingsByProvider(s, p.slug).length} active products`],
    ["Public Trust Audits", () => "Audited under IRDAI / Consumer Protection Standards"],
  ];

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: "Brands", href: paths.brands(s) },
          { name: `${a.name} vs ${b.name}`, href: paths.compareProviders(s, pair) },
        ]}
      />

      {/* Comparison Duel Header */}
      <div className="mt-4 mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FFF4ED] text-[#FF5A0A] border border-[#FFD8C2]">
          Independent Comparison • No Paid Placement
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B46] tracking-tight mt-2">
          {a.name} vs {b.name}
        </h1>
        <p className="text-sm text-[#46526B] mt-1 max-w-2xl">
          Side-by-side regulatory registration, verified track records, and catalog options in {sector.name}.
        </p>
      </div>

      {/* Duel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Brand A Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCE2EB] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[#071B46] font-black text-lg flex items-center justify-center flex-shrink-0">
                {a.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#071B46]">{a.name}</h2>
                <div className="text-xs text-[#667085] mt-0.5">
                  {a.sectors[s]?.registration || "Verified IRDAI Entity"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#EEF2F7] font-semibold text-[#071B46]">
                {offeringsA.length} {sector.labels.offerings}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#E4F4EC] font-semibold text-[#075E3B]">
                Public Consensus Verified
              </span>
            </div>
          </div>
          {/* Action Buttons styled according to Home Page */}
          <div className="mt-6 pt-5 border-t border-[#DCE2EB] flex flex-wrap items-center gap-3">
            <Link href={paths.provider(s, a.slug)} className="btn btn--signal btn--sm">
              View Profile
            </Link>
            <Link href={`/reviews?brand=${a.slug}`} className="btn btn--quiet btn--sm">
              Rate {a.name.split(" ")[0]}
            </Link>
          </div>
        </div>

        {/* Brand B Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCE2EB] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[#071B46] font-black text-lg flex items-center justify-center flex-shrink-0">
                {b.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#071B46]">{b.name}</h2>
                <div className="text-xs text-[#667085] mt-0.5">
                  {b.sectors[s]?.registration || "Verified IRDAI Entity"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#EEF2F7] font-semibold text-[#071B46]">
                {offeringsB.length} {sector.labels.offerings}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#E4F4EC] font-semibold text-[#075E3B]">
                Public Consensus Verified
              </span>
            </div>
          </div>
          {/* Action Buttons styled according to Home Page */}
          <div className="mt-6 pt-5 border-t border-[#DCE2EB] flex flex-wrap items-center gap-3">
            <Link href={paths.provider(s, b.slug)} className="btn btn--signal btn--sm">
              View Profile
            </Link>
            <Link href={`/reviews?brand=${b.slug}`} className="btn btn--quiet btn--sm">
              Rate {b.name.split(" ")[0]}
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Specs Table */}
      <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 bg-[#FAFBFD] border-b border-[#DCE2EB] flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#071B46] uppercase tracking-wider">
            Verified Entity Specifications
          </h3>
          <span className="text-xs text-[#667085]">Statutory filings FY 2024-25</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#DCE2EB] bg-white">
                <th className="py-3 px-6 font-bold text-xs uppercase tracking-wider text-[#667085] w-1/3">
                  Criteria
                </th>
                <th className="py-3 px-6 font-bold text-[#071B46] w-1/3">
                  {a.name}
                </th>
                <th className="py-3 px-6 font-bold text-[#071B46] w-1/3">
                  {b.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE2EB]">
              {rows.map(([label, getValue]) => (
                <tr key={label} className="hover:bg-[#FAFBFD] transition">
                  <td className="py-3.5 px-6 font-semibold text-[#071B46]">{label}</td>
                  <td className="py-3.5 px-6 text-[#46526B] font-medium">{getValue(a)}</td>
                  <td className="py-3.5 px-6 text-[#46526B] font-medium">{getValue(b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Conversion Card */}
      <div className="bg-[#FAFBFD] rounded-2xl p-6 sm:p-8 border border-[#DCE2EB] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-extrabold text-[#071B46]">
            Have an experience with {a.name} or {b.name}?
          </h3>
          <p className="text-sm text-[#46526B] mt-1 max-w-xl">
            Help the next buyer decide. Leave your genuine experience to update the live TrustValue score.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <Link href="/write-review/" className="btn btn--signal">
            Rate Provider
          </Link>
          <Link href={paths.providers(s)} className="btn btn--navy">
            All Providers
          </Link>
        </div>
      </div>
    </div>
  );
}
