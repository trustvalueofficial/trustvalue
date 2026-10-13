import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Newspaper, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

interface NewsProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} — Regulatory Bulletin — TrustValue.ai`,
    description: `Regulatory analysis and policyholder impact review for ${title}.`,
  };
}

export default async function NewsDetailPage({ params }: NewsProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="min-h-screen bg-[#060911] text-slate-100 px-6 py-10 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "News & Bulletins", href: "/news" },
          { label: title },
        ]}
      />

      <article className="mt-8">
        <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 mb-3">
          <Newspaper className="w-4 h-4" />
          <span>IRDAI Regulatory Dispatch</span>
          <span>•</span>
          <span className="text-slate-500">October 2026</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {title}
        </h1>

        <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 text-slate-300 space-y-4 text-base leading-relaxed">
          <p>
            The insurance regulator has issued updated guidelines regarding digital KYC verification and expedited death claim settlements. Under the new circular, any claim filed with valid digital hospital death certificates must undergo provisional clearance within 72 hours.
          </p>
          <p>
            TrustValue's Agent 2 scoring engine has automatically recalibrated grievance resolution weights to penalize insurers lagging behind this new standard.
          </p>
        </div>
      </article>
    </main>
  );
}
