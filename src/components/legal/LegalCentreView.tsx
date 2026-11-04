"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import type { LegalNavSlug } from "@/components/legal/legalNav";
import { getLegalHtml, isLegalNavSlug } from "@/components/legal/pages";

export function LegalCentreView() {
  const [active, setActive] = useState<LegalNavSlug>("hub");
  const contentRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selectTab = useCallback((slug: LegalNavSlug) => {
    setActive(slug);
    requestAnimationFrame(() => {
      const header = document.querySelector(".hdr");
      const headerBottom =
        header instanceof HTMLElement ? header.getBoundingClientRect().bottom + window.scrollY : 0;
      const wrapTop = wrapRef.current?.offsetTop ?? 0;
      const target = Math.max(0, wrapTop - headerBottom - 8);
      window.scrollTo({ top: target, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element).closest("[data-legal-tab]");
      if (!target || !root.contains(target)) return;
      event.preventDefault();
      const slug = target.getAttribute("data-legal-tab");
      if (slug && isLegalNavSlug(slug)) selectTab(slug);
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [active, selectTab]);

  return (
    <LegalPageShell
      active={active}
      html={getLegalHtml(active)}
      onSelect={selectTab}
      contentRef={contentRef}
      wrapRef={wrapRef}
    />
  );
}
