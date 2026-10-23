import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getSector } from "@/lib/cms";
import { paths } from "@/lib/routing";
import "@/app/sector.css";

/** Sector context bar. An unknown sector slug is a 404 here, before any page runs. */
export default async function SectorLayout({ children, params }: { children: ReactNode; params: Promise<{ sector: string }> }) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();
  return (
    <>
      <nav className="subnav">
        <Link href={paths.sector(slug)} className="pill">{sector.icon} {sector.name}</Link>
        <Link href={paths.sector(slug)}>{sector.nav.categories}</Link>
        <Link href={paths.providers(slug)}>{sector.nav.providers}</Link>
        {sector.location !== "none" && <Link href={paths.sector(slug) + "#cities"}>Cities</Link>}
      </nav>
      {children}
    </>
  );
}
