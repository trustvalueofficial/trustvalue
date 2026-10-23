import type { Metadata } from "next";
import Link from "next/link";
import { getProviders, getSectors } from "@/lib/cms";
import { paths } from "@/lib/routing";
import { meta } from "@/lib/seo";

export const metadata: Metadata = meta(
  "Global TrustScore Leaderboard",
  "Audited rankings across all 18 sectors. Independent ratings, compliance scores, and delivery track records.",
  paths.rating()
);

export default function RatingPage() {
  const sectors = getSectors();
  const providers = getProviders();

  return (
    <>
      <h1>Global TrustScore Leaderboard</h1>
      <p className="lead">
        Multi-sector benchmark index. Compare top-audited providers across all 18 regulated Indian industries.
      </p>

      <section className="card">
        <h2>How TrustScores Are Calculated</h2>
        <p>
          Each score combines regulatory compliance ratios (IRDAI claim settlement, RERA escrow discipline, RBI turnaround times) with verified evidence submissions. Scores are Bayesian smoothed to prevent sample distortion.
        </p>
      </section>

      <section>
        <h2>Audited Providers Directory</h2>
        <div className="table scroll">
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Active Sectors</th>
                <th>Registration / Jurisdiction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => {
                const activeSectors = Object.keys(p.sectors);
                return (
                  <tr key={p.slug}>
                    <td>
                      <strong>{p.name}</strong>
                      <br />
                      <small className="muted">{p.parentGroup ? `${p.parentGroup} Group` : "Independent"}</small>
                    </td>
                    <td>
                      <div className="chips" style={{ gap: "4px" }}>
                        {activeSectors.map((sec) => (
                          <Link key={sec} href={paths.provider(sec, p.slug)} className="chip" style={{ fontSize: "12px", padding: "2px 8px" }}>
                            {sec}
                          </Link>
                        ))}
                      </div>
                    </td>
                    <td>
                      {activeSectors.map((sec) => (
                        <div key={sec} style={{ fontSize: "12px" }}>
                          {p.sectors[sec]?.registration ? `${sec}: ${p.sectors[sec].registration}` : `${sec}: Verified`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {activeSectors[0] && (
                        <Link href={paths.provider(activeSectors[0], p.slug)}>
                          View Profile &rarr;
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Filter by Sector</h2>
        <div className="chips">
          {sectors.map((s) => (
            <Link key={s.slug} href={paths.providers(s.slug)} className="chip">
              {s.icon} {s.name} ({s.labels.providers})
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
