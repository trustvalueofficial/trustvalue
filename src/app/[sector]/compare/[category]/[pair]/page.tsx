import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatValue } from "@/components/sections";
import { getCategoryBySlug, getComparePairs, getOfferingsInCategory, getProvider, getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";

type Props = { params: Promise<{ sector: string; category: string; pair: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getComparePairs().offerings.map((o) => ({ sector: o.sector, category: o.category, pair: o.pair }));

export default async function CompareOfferings({ params }: Props) {
  const { sector: s, category: catSlug, pair } = await params;
  const sector = getSector(s);
  const cat = getCategoryBySlug(s, catSlug); // leaf slug is unique per sector
  if (!sector || !cat) notFound();
  const pool = getOfferingsInCategory(s, cat.path);
  const [a, b] = pair.split("-vs-").map((slug) => pool.find((o) => o.slug === slug));
  if (!a || !b) notFound();

  const providerA = getProvider(a.provider);
  const providerB = getProvider(b.provider);

  const comparableAttrs = cat.attributes.filter((x) => x.comparable);

  return (
    <div className="page max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { name: "Home", href: paths.home() },
          { name: sector.name, href: paths.sector(s) },
          { name: "Segments", href: paths.segments(s) },
          { name: cat.name, href: paths.category(s, cat.path) },
          { name: `${a.name} vs ${b.name}`, href: paths.compareOfferings(s, catSlug, pair) },
        ]}
      />

      {/* Header */}
      <div className="mt-4 mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FFF4ED] text-[#FF5A0A] border border-[#FFD8C2]">
          {cat.name} • Direct Policy Comparison
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B46] tracking-tight mt-2">
          {a.name} vs {b.name}
        </h1>
        <p className="text-sm text-[#46526B] mt-1 max-w-2xl">
          Side-by-side comparison of coverage limits, deductibles, waiting periods, and insurer disclosures.
        </p>
      </div>

      {/* Duel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Plan A Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCE2EB] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5A0A] to-[#FFAA00] text-[#06132F] font-black text-lg flex items-center justify-center flex-shrink-0">
                {a.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#071B46]">{a.name}</h2>
                <div className="text-xs text-[#667085] mt-0.5">
                  by {providerA?.name || a.provider}
                </div>
              </div>
            </div>
            {a.summary && (
              <p className="text-xs text-[#46526B] mt-3 leading-relaxed">
                {a.summary}
              </p>
            )}
          </div>
          {/* Action Buttons styled according to Home Page */}
          <div className="mt-6 pt-5 border-t border-[#DCE2EB] flex flex-wrap items-center gap-3">
            <Link href={paths.offering(s, a.provider, a.slug)} className="btn btn--signal btn--sm">
              View Plan Details
            </Link>
            <Link href={paths.provider(s, a.provider)} className="btn btn--quiet btn--sm">
              Brand Profile
            </Link>
          </div>
        </div>

        {/* Plan B Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCE2EB] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5A0A] to-[#FFAA00] text-[#06132F] font-black text-lg flex items-center justify-center flex-shrink-0">
                {b.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#071B46]">{b.name}</h2>
                <div className="text-xs text-[#667085] mt-0.5">
                  by {providerB?.name || b.provider}
                </div>
              </div>
            </div>
            {b.summary && (
              <p className="text-xs text-[#46526B] mt-3 leading-relaxed">
                {b.summary}
              </p>
            )}
          </div>
          {/* Action Buttons styled according to Home Page */}
          <div className="mt-6 pt-5 border-t border-[#DCE2EB] flex flex-wrap items-center gap-3">
            <Link href={paths.offering(s, b.provider, b.slug)} className="btn btn--signal btn--sm">
              View Plan Details
            </Link>
            <Link href={paths.provider(s, b.provider)} className="btn btn--quiet btn--sm">
              Brand Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Specs Table */}
      <div className="bg-white rounded-2xl border border-[#DCE2EB] shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 bg-[#FAFBFD] border-b border-[#DCE2EB] flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#071B46] uppercase tracking-wider">
            Comparable Plan Attributes
          </h3>
          <span className="text-xs text-[#667085]">Verified Terms & Benefits</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#DCE2EB] bg-white">
                <th className="py-3 px-6 font-bold text-xs uppercase tracking-wider text-[#667085] w-1/3">
                  Specification
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
              {comparableAttrs.map((x) => (
                <tr key={x.key} className="hover:bg-[#FAFBFD] transition">
                  <td className="py-3.5 px-6 font-semibold text-[#071B46]">{x.label}</td>
                  <td className="py-3.5 px-6 text-[#46526B] font-medium">
                    {formatValue(x, a.attributes[x.key])}
                  </td>
                  <td className="py-3.5 px-6 text-[#46526B] font-medium">
                    {formatValue(x, b.attributes[x.key])}
                  </td>
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
            Deciding between these two {cat.name.toLowerCase()} options?
          </h3>
          <p className="text-sm text-[#46526B] mt-1 max-w-xl">
            Check real user claims experiences and transparent ratings before locking your policy.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <Link href="/write-review/" className="btn btn--signal">
            Rate a Plan
          </Link>
          <Link href={paths.category(s, cat.path)} className="btn btn--navy">
            Browse All {cat.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
