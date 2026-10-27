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
        <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.8-3.8 3.6-5.8 7.2-5.8s6.4 2 7.2 5.8"/></symbol>
        <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3.5 11.6V4.5a1 1 0 0 1 1-1h7.1l9 9-8.1 8.1z"/><circle cx="8" cy="8" r="1.6"/></symbol>
        <symbol id="i-camera" viewBox="0 0 24 24"><path d="M4 8.5h3.2L9 5.8h6l1.8 2.7H20v10.7H4z"/><circle cx="12" cy="13.6" r="3.4"/></symbol>
        <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9h8M8 12.3h5"/></symbol>
        <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 19.5h16"/><path d="M5 15.5l4.2-4.2 3.2 3.2 6.6-7"/><path d="M15.4 7.5H19v3.6"/></symbol>
        <symbol id="i-scroll" viewBox="0 0 24 24"><path d="M7 3.5h7.5L19 8v12.5H7z"/><path d="M14.5 3.5V8H19M10 12.2h6M10 16h6"/></symbol>
        <symbol id="i-scale" viewBox="0 0 24 24"><path d="M12 4v15.5M7.5 19.5h9M5 7.2h14"/><path d="M5 7.2l-2.6 5.6a2.8 2.8 0 0 0 5.2 0zM19 7.2l-2.6 5.6a2.8 2.8 0 0 0 5.2 0z"/></symbol>
        <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></symbol>
        <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.2M12 7.8h.01"/></symbol>
        <symbol id="i-pen" viewBox="0 0 24 24"><path d="M4.5 19.5h3.8L19.4 8.4l-3.8-3.8L4.5 15.7z"/><path d="M14 6.2l3.8 3.8"/></symbol>
        <symbol id="i-trophy" viewBox="0 0 24 24"><path d="M8 4h8v5.2a4 4 0 0 1-8 0z"/><path d="M8 6H5.2a3 3 0 0 0 2.9 4M16 6h2.8a3 3 0 0 1-2.9 4M12 13.2v3.6M8.5 20h7M10 16.8h4"/></symbol>
        <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9.5a1 1 0 0 0 1 1h3.5"/></symbol>
        <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.2l11 6.8-11 6.8z"/></symbol>
        <symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13.2 3L5.5 13.5h6l-1 7.5 8-10.6h-6z"/></symbol>
        <symbol id="i-map" viewBox="0 0 24 24"><path d="M9 4.5L3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/></symbol>
        <symbol id="i-rocket" viewBox="0 0 24 24"><path d="M14 4.5c3-1.2 5.5-.5 5.5-.5s.7 2.5-.5 5.5L13 16l-5-5z"/><path d="M8 11l-3.5.5L3 14l4 1M13 16l-.5 3.5L10 21l-1-4M15.5 8.5h.01"/></symbol>
        <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.3-3.6-8.6S9.6 5.8 12 3.4z"/></symbol>
        <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17 14.3c2 .6 3.2 2.2 3.5 4.7"/></symbol>
      </defs>
    </svg>
  );
}
