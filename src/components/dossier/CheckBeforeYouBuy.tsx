import React from "react";

export interface WarningItem {
  text: string;
  citation?: string;
}

interface CheckBeforeYouBuyProps {
  title?: string;
  warnings?: WarningItem[];
}

const defaultWarnings: WarningItem[] = [
  {
    text: "The plan page lists 20, 34 and 60 critical illnesses in different places. Ask which list your option covers, and find it in the policy wording.",
    citation: "1",
  },
  {
    text: "Death by suicide in the first 12 months pays back 80% of premiums paid, or the policy's value if that is higher.",
    citation: "1",
  },
  {
    text: "Bought through a POS agent? No death benefit in the first 90 days, except after an accident. Premiums are refunded.",
    citation: "1",
  },
];

export default function CheckBeforeYouBuy({
  title = "Check before you buy",
  warnings = defaultWarnings,
}: CheckBeforeYouBuyProps) {
  return (
    <section className="check-buy-section">
      <h2 className="check-buy-title">{title}</h2>

      <div className="space-y-3">
        {warnings.map((w, idx) => (
          <div key={idx} className="check-buy-card">
            <i className="fa-solid fa-triangle-exclamation check-buy-icon" aria-hidden="true" />
            <div>
              <span>{w.text}</span>
              {w.citation && (
                <sup className="facts-cite-sup">[{w.citation}]</sup>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
