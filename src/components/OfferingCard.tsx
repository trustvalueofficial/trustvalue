import Link from "next/link";
import { getProvider } from "@/lib/cms";
import { paths } from "@/lib/routing";
import type { Offering } from "@/lib/types";

export function OfferingCard({ offering }: { offering: Offering }) {
  const provider = getProvider(offering.provider);
  const premium = offering.attributes?.premium;
  const sumAssured = offering.attributes?.sum_assured;

  return (
    <Link
      className="card link-card offering-card-item"
      href={paths.offering(offering.sector, offering.provider, offering.slug)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "190px",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF5A0A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {provider?.name || offering.provider}
          </span>
          <i className="fa-solid fa-arrow-right text-xs text-[#FF5A0A]" aria-hidden="true" />
        </div>
        <strong style={{ fontSize: "1.0625rem", color: "#071B46", display: "block", marginBottom: "6px", lineHeight: "1.3" }}>
          {offering.name}
        </strong>
        {offering.summary && (
          <p style={{ fontSize: "0.8125rem", color: "#667085", lineHeight: "1.4", margin: "0 0 12px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {offering.summary}
          </p>
        )}
      </div>

      {(premium || sumAssured) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "10px", borderTop: "1px solid #F1F4F9", fontSize: "0.75rem", color: "#46526B" }}>
          {premium && <span style={{ background: "#F4F7FB", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>{String(premium)}</span>}
          {sumAssured && <span style={{ background: "#F4F7FB", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Cover: {String(sumAssured)}</span>}
        </div>
      )}
    </Link>
  );
}
