"use client";

import Link from "next/link";
import { useState } from "react";

export interface SectorHelpCard {
  slug: string;
  name: string;
  icon: string;
  route: string;
  pageHref: string;
  href?: string;
  linkLabel?: string;
}

const PAGE_SIZE = 3;

export function SectorHelpList({ cards }: { cards: SectorHelpCard[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = cards.slice(0, visible);
  const remaining = cards.length - shown.length;

  return (
    <>
      <div className="sector-help-grid">
        {shown.map((card) => (
          <article className="sector-help" key={card.slug}>
            <h3>
              <i className={`fa-solid ${card.icon}`} aria-hidden="true" />
              {card.name}
            </h3>
            <p>{card.route}</p>
            <p>
              <Link href={card.pageHref}>See {card.name} on TrustValue</Link>
              {card.href && card.linkLabel ? (
                <>
                  {" · "}
                  <a href={card.href} target="_blank" rel="noopener noreferrer">{card.linkLabel}</a>
                </>
              ) : null}
            </p>
          </article>
        ))}
      </div>
      {remaining > 0 && (
        <button
          type="button"
          className="sector-more"
          onClick={() => setVisible((count) => Math.min(count + PAGE_SIZE, cards.length))}
        >
          Read more
        </button>
      )}
    </>
  );
}
