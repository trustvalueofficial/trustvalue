import React from "react";

export interface FactItem {
  key: string;
  val: string;
  citation?: string;
}

interface TheFactsTableProps {
  title?: string;
  subtitle?: string;
  facts: FactItem[];
}

export default function TheFactsTable({
  title = "The facts",
  subtitle = "From the insurer's own documents. Each fact names its source. No premiums or quotes: TrustValue does not sell insurance.",
  facts,
}: TheFactsTableProps) {
  return (
    <section className="facts-table-section">
      <h2 className="facts-table-title">{title}</h2>
      <p className="facts-table-sub">{subtitle}</p>

      <div className="facts-table-clean">
        {facts.map((fact, index) => (
          <div key={index} className="facts-clean-row">
            <div className="facts-clean-key">{fact.key}</div>
            <div className="facts-clean-val">
              <span>{fact.val}</span>
              {fact.citation && (
                <sup className="facts-cite-sup">[{fact.citation}]</sup>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
