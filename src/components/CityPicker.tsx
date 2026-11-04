import Link from "next/link";
import { getCities } from "@/lib/cms";

export function CityPicker({
  href,
  title = "Browse by city",
}: {
  href: (citySlug: string) => string;
  title?: string;
}) {
  const cities = getCities();

  return (
    <section
      className="card city-picker-card"
      style={{
        background: "#ffffff",
        border: "1px solid #DCE2EB",
        borderRadius: "16px",
        padding: "24px",
        marginTop: "28px",
        boxShadow: "0 1px 3px rgba(7, 27, 70, 0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "#FFF4EE",
            color: "#FF5A0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#071B46", margin: 0 }}>
            {title}
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "#667085", margin: "2px 0 0 0" }}>
            Compare localized service turnarounds, cashless network hospitals, and branches
          </p>
        </div>
      </div>

      <div className="chips" style={{ gap: "8px" }}>
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={href(c.slug)}
            className="chip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px",
              fontSize: "0.875rem",
              borderRadius: "999px",
              border: "1px solid #DCE2EB",
              background: "#FAFBFD",
              color: "#071B46",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            <i className="fa-solid fa-map-pin" style={{ fontSize: "10px", color: "#98A2B3" }} aria-hidden="true" />
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
