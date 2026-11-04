import type { RefObject } from "react";
import type { LegalNavSlug } from "./legalNav";
import { LEGAL_HERO, LEGAL_NAV } from "./legalNav";

type LegalPageShellProps = {
  active: LegalNavSlug;
  html: string;
  onSelect: (slug: LegalNavSlug) => void;
  contentRef: RefObject<HTMLElement | null>;
  wrapRef?: RefObject<HTMLDivElement | null>;
};

export function LegalPageShell({ active, html, onSelect, contentRef, wrapRef }: LegalPageShellProps) {
  const hero = LEGAL_HERO[active];

  return (
    <div className="legal-centre">
      <section className="legal-hero" aria-labelledby="legal-hero-title">
        <div className="legal-hero-inner">
          <span className="legal-eyebrow">{hero.eyebrow}</span>
          <h1 id="legal-hero-title">{hero.title}</h1>
          <p>{hero.description}</p>
        </div>
      </section>

      <div className="legal-wrap" ref={wrapRef}>
        <aside className="legal-side" aria-label="Legal navigation">
          <h2>Policies</h2>
          {LEGAL_NAV.map((item) => (
            <button
              key={item.slug}
              type="button"
              className="legal-side-link"
              onClick={() => onSelect(item.slug)}
              aria-current={item.slug === active ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <article
          ref={contentRef}
          className="legal-panel"
          id="legal-panel"
          aria-live="polite"
          aria-busy={false}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
