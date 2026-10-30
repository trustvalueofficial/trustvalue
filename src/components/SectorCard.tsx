import Link from "next/link";
import { getSectorFaIcon } from "@/lib/icons";
import { paths } from "@/lib/routing";
import type { SectorConfig } from "@/lib/types";

interface SectorCardProps {
  sector: SectorConfig;
  providerCount?: number;
  offeringCount?: number;
  categoryCount?: number;
  isCurrent?: boolean;
}

export function SectorCard({
  sector,
  providerCount,
  offeringCount,
  categoryCount,
  isCurrent = false,
}: SectorCardProps) {
  const isLive = sector.slug === "insurance";
  const iconClass = getSectorFaIcon(sector.slug);

  return (
    <Link
      href={paths.sector(sector.slug)}
      className={`sector-card ${isCurrent ? "is-current" : ""}`}
    >
      <div>
        <div className="sector-card__head">
          <div className="sector-card__icon" aria-hidden="true">
            <i className={`fa-solid ${iconClass}`} style={{ color: isCurrent || isLive ? "#FF5A0A" : "#071B46" }} />
          </div>
          <span
            className={`sector-card__badge ${
              isCurrent
                ? "is-active-sector"
                : isLive
                ? "is-live"
                : ""
            }`}
          >
            {isCurrent ? "Current Sector" : isLive ? "Live Audit" : "Monitored"}
          </span>
        </div>
        <h3 className="sector-card__title">{sector.name}</h3>
        <p className="sector-card__desc">{sector.description}</p>
      </div>

      <div className="sector-card__foot">
        <span>
          {providerCount !== undefined && providerCount > 0
            ? `${providerCount} ${sector.labels?.providers || "Providers"}`
            : categoryCount !== undefined && categoryCount > 0
            ? `${categoryCount} Categories`
            : "Verified Directory"}
        </span>
        <span className="sector-card__action">
          Explore <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
