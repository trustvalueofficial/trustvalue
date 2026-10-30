import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getSector } from "@/lib/cms";
import { getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import "@/app/sector.css";

/** Sector context bar. An unknown sector slug is a 404 here, before any page runs. */
export default async function SectorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const iconClass = getSectorFaIcon(slug);

  return (
    <>
      <nav className="subnav">
        <div className="subnav-inner max-w-[1200px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <Link href={paths.sector(slug)} className="pill">
              <i className={`fa-solid ${iconClass}`} aria-hidden="true" />
              <span>{sector.name}</span>
            </Link>
            <Link
              href={paths.segments(slug)}
              className="text-sm font-semibold text-[#46526B] hover:text-[#071B46] transition-colors inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-layer-group text-xs text-[#98A2B3]" aria-hidden="true" />
              <span>Segments</span>
            </Link>
            <Link
              href={paths.brands(slug)}
              className="text-sm font-semibold text-[#46526B] hover:text-[#071B46] transition-colors inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-building-shield text-xs text-[#98A2B3]" aria-hidden="true" />
              <span>Brands</span>
            </Link>
            {sector.location !== "none" && (
              <Link
                href={paths.sector(slug) + "#cities"}
                className="text-sm font-semibold text-[#46526B] hover:text-[#071B46] transition-colors inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-location-dot text-xs text-[#98A2B3]" aria-hidden="true" />
                <span>Cities</span>
              </Link>
            )}
          </div>

          <Link
            href="/sectors"
            className="text-xs font-bold text-[#FF5A0A] hover:text-[#071B46] transition-colors inline-flex items-center gap-1.5 ml-auto py-1 px-3 rounded-full bg-[#FFF4EE] hover:bg-[#EEF2F7]"
          >
            <i className="fa-solid fa-shapes text-xs" aria-hidden="true" />
            <span>All Sectors</span>
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}
