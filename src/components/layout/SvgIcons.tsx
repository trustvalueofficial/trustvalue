import React from "react";

/**
 * Global SVG Symbol Sprite definitions for TrustValue.ai.
 * Injected once in RootLayout so all icons (<use href="#i-..." />) render without missing asset warnings.
 */
export default function SvgIcons() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-search" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5 21 21" />
          </g>
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </g>
        </symbol>
        <symbol id="i-close" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </g>
        </symbol>
        <symbol id="i-chevron" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2.6" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </g>
        </symbol>
        <symbol id="i-unlock" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2.6" />
            <path d="M8 11V8a4 4 0 0 1 7.6-1.7" />
          </g>
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v5.5c0 4.4-2.9 7.8-7 9.5-4.1-1.7-7-5.1-7-9.5V6l7-3z" />
            <path d="m9 12 2.2 2.2L15.2 10" />
          </g>
        </symbol>
        <symbol id="i-tri" viewBox="0 0 12 12">
          <path d="M6 1.5 11.2 10.5H.8z" fill="currentColor" />
        </symbol>
        <symbol id="i-angry" viewBox="0 0 24 24">
          <path d="M12.0 3.6L14.7 8.9L20.6 9.8L16.4 14.0L17.3 19.9L12.0 17.2L6.7 19.9L7.6 14.0L3.4 9.8L9.3 8.9Z" fill="#F12A0A" stroke="#F12A0A" strokeWidth="2" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-rec" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#0A8754" />
          <path d="m7.5 12.4 3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      </defs>
    </svg>
  );
}
