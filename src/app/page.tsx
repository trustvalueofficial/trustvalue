"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TrustValueBottomCta from "@/components/common/TrustValueBottomCta";
import {
  INSURERS,
  INS,
  TYPES,
  PLANS,
  STOPS,
  ARTICLES,
  GLOSSARY,
  stats,
  band,
  plural,
  loadStore,
  getLiveReviews,
  SCORE,
} from "@/lib/prototypeData";

const HTONE: Record<string, string> = { low: "#F12A0A", mid: "#FFAA00", rec: "#0A8754", none: "#C5CEDC" };
const HMOUTH = [
  "M48 86Q60 72 72 86",
  "M48 84Q60 74 72 84",
  "M48 82Q60 77 72 82",
  "M48 79Q60 80 72 79",
  "M47 77Q60 88 73 77",
  "M45 75Q60 94 75 75",
];
const HFILL = ["#F12A0A", "#FF5A0A", "#FF7A2E", "#FFAA00", "#FFB21F", "#0A8754"];

interface SearchSuggestion {
  kind: string;
  title: string;
  sub: string;
  url: string;
}

export default function HomePage() {
  const store = loadStore();
  const [selectedInsurer, setSelectedInsurer] = useState<string>("ageas-federal-life");
  const [selectedStop, setSelectedStop] = useState<number | null>(4); // default to Good for active preview
  const [showAllInsurers, setShowAllInsurers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const searchBoxRef = useRef<HTMLFormElement>(null);

  const allReviews = getLiveReviews(store, () => true);
  const totalRatings = allReviews.length;
  const plansListed = PLANS.filter((p) => p.status === "on-sale" && p.type !== "riders").length;
  const recentReviews = allReviews.sort((a, b) => b.created - a.created).slice(0, 3);
  const resolvedComplaints = store.complaints.filter((c) => c.status === "Resolved");

  const scoredInsurers = INSURERS.map((i) => ({ i, st: stats(store, "insurer", i.slug) }))
    .filter((x) => x.st.score != null)
    .sort((a, b) => b.st.score! - a.st.score!);

  const selInsObj = INS[selectedInsurer] || INS["ageas-federal-life"];
  const curStopObj = selectedStop !== null ? STOPS[selectedStop] : null;
  const curTone = selectedStop !== null ? (selectedStop === 0 || selectedStop <= 2 ? "low" : selectedStop <= 4 ? "mid" : "rec") : "none";

  // Autocomplete search suggestions
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // Default top suggestions when focused with empty query
      setSearchSuggestions([
        { kind: "Brand", title: "LIC", sub: "IRDAI reg. 512 · Public Sector", url: "/industry/insurance/lic" },
        { kind: "Brand", title: "HDFC Life", sub: "IRDAI reg. 101 · Mumbai", url: "/industry/insurance/hdfc-life" },
        { kind: "Brand", title: "SBI Life", sub: "IRDAI reg. 111 · Mumbai", url: "/industry/insurance/sbi-life" },
        { kind: "Plan", title: "Super Protect Plan", sub: "Ageas Federal Life · Pure Term", url: "/industry/insurance/ageas-federal-life/super-protect-plan" },
        { kind: "Category", title: "Term Insurance", sub: "Pure protection plans", url: "/products?type=term-insurance" },
      ]);
      return;
    }
    const out: SearchSuggestion[] = [];

    // Match brands
    INSURERS.forEach((ins) => {
      if (ins.name.toLowerCase().includes(q) || ins.reg.includes(q) || (ins.former && ins.former.toLowerCase().includes(q))) {
        out.push({
          kind: "Brand",
          title: ins.name,
          sub: `IRDAI reg. ${ins.reg} · ${ins.former ? `Formerly ${ins.former}` : ins.city}`,
          url: `/industry/insurance/${ins.slug}`,
        });
      }
    });

    // Match plans
    PLANS.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) {
        out.push({
          kind: "Plan",
          title: p.name,
          sub: `${INS[p.insurer]?.name || p.insurer} · ${p.sub}`,
          url: `/industry/insurance/${p.insurer}/${p.slug}`,
        });
      }
    });

    // Match categories
    TYPES.forEach((t) => {
      if (t.name.toLowerCase().includes(q)) {
        out.push({
          kind: "Category",
          title: t.name,
          sub: t.plain.slice(0, 65) + "…",
          url: `/products?type=${t.slug}`,
        });
      }
    });

    // Match glossary
    GLOSSARY.forEach((g) => {
      if (g.term.toLowerCase().includes(q)) {
        out.push({
          kind: "Glossary",
          title: g.term,
          sub: g.def.slice(0, 70) + "…",
          url: `/glossary/${g.slug}`,
        });
      }
    });

    setSearchSuggestions(out.slice(0, 6));
  }, [searchQuery]);

  // Click outside search suggestions
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="tvh">
      {/* 1. HERO SECTION */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div>
            <p className="descriptor">
              <img
                src="/brand/descriptor-icon.webp"
                alt=""
                width={26}
                height={26}
                style={{ width: "26px", height: "26px" }}
              />
              The Global Trust Index
            </p>
            <h1 id="hero-title">
              <span className="display">
                Know before you <span>trust.</span>
              </span>
            </h1>
            <p className="lead">
              Rate the life insurance policy you hold in about seven seconds. Ten ratings publish a plan&apos;s first TrustValue Score, and no insurer can edit, hide or buy one.
            </p>

            <form
              ref={searchBoxRef}
              className="search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <label className="sr-only" htmlFor="h-q">Search brands, plans and products</label>
              <div className="search__field">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M16.5 16.5 21 21" />
                  </g>
                </svg>
                <input
                  id="h-q"
                  type="search"
                  placeholder="Search brands, plans and products..."
                  autoComplete="off"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn--signal" type="submit">Search</button>
              </div>

              {/* Autocomplete Dropdown */}
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="search__panel" role="listbox">
                  {searchSuggestions.map((s) => (
                    <Link
                      key={s.url + s.title}
                      href={s.url}
                      className="opt"
                      onClick={() => setSearchFocused(false)}
                    >
                      <span className="opt__kind">{s.kind}</span>
                      <div style={{ minWidth: 0, overflow: "hidden" }}>
                        <span className="opt__name">{s.title}</span>
                        <span className="opt__sub">{s.sub}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <p className="try">
              <span>Try</span>
              <Link href="/products?type=term-insurance">Term insurance</Link>
              <Link href="/products?type=savings-plans">Savings plans</Link>
              <Link href="/products?type=ulips">ULIPs</Link>
              <Link href="/products?type=retirement-pension">Retirement</Link>
              <Link href="/industry/insurance">All 26 brands</Link>
            </p>

            <ul className="promises" aria-label="What we keep to">
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No paid ratings or rankings
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Insurers can reply, never edit
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Every change stays on the record
              </li>
            </ul>
          </div>

          {/* Status Mascot Box */}
          <aside className="status" aria-labelledby="status-title">
            <div className="status__top">
              <div>
                <p className="tag tag--navy">
                  <span className="dot dot--signal" />
                  Life Insurance Trust Index
                </p>
                <h2 id="status-title">Opens at 1,000 ratings.</h2>
                <p className="status__text">
                  An index has to earn its first number. Ours opens at a base of 1,000 the day the thousandth rating is locked.
                </p>
              </div>
              <img
                className="status__mascot"
                src="/brand/status__mascot.webp"
                alt="TrustValue Mascot"
                width={132}
                height={180}
              />
            </div>

            <div className="run" role="img" aria-label={`${totalRatings} of 1,000 ratings locked`}>
              <div className="run__track">
                <div className="run__fill" style={{ width: `${Math.max(6, Math.min(100, (totalRatings / 1000) * 100))}%` }} />
                <span className="run__dot" style={{ left: `${Math.max(6, Math.min(100, (totalRatings / 1000) * 100))}%` }} />
              </div>
              <p className="run__ends">
                <span><b>{totalRatings.toLocaleString("en-IN")}</b> locked so far</span>
                <span><b>1,000</b> to open</span>
              </p>
            </div>

            <dl className="counts">
              <div><dt>Brands listed</dt><dd>26</dd></div>
              <div><dt>Plans listed</dt><dd>{plansListed}</dd></div>
            </dl>

            <p className="status__cta">
              <a className="btn btn--signal" href="#rate">Rate your policy</a>
              <Link className="u" href="/methodology">How scores work</Link>
            </p>
          </aside>
        </div>
      </section>

      {/* 2. RATE INTERACTIVE SECTION & LADDER */}
      <section className="section section--mist" id="rate" aria-labelledby="rate-title">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <h2 className="h2" id="rate-title">One gesture. One truth. Then move on.</h2>
              <p className="lead">Pick your insurer brand, tap how it felt, lock it. Writing anything is optional.</p>
            </div>
          </header>

          <div className="rate">
            <div className="rate__main">
              <div className="field">
                <label htmlFor="h-ins">Who is your insurer brand?</label>
                <div className="select">
                  <select
                    id="h-ins"
                    value={selectedInsurer}
                    onChange={(e) => setSelectedInsurer(e.target.value)}
                  >
                    <option value="">Choose from 26 life insurance brands</option>
                    {INSURERS.map((i) => (
                      <option key={i.slug} value={i.slug}>{i.name} (IRDAI reg. {i.reg})</option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <h3 className="rate__q">How did it feel?</h3>
              <p className="rate__hint">Don&apos;t overthink it. Your first instinct is the signal.</p>

              {/* Expressive Face */}
              <div className="face">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <path
                    d="M60 14 76.8 39.9 106.6 47.9 87.1 71.8 88.8 102.6 60 91.5 31.2 102.6 32.9 71.8 13.4 47.9 43.2 39.9Z"
                    fill={selectedStop !== null ? HFILL[selectedStop] : "#E2E8F1"}
                    stroke={selectedStop !== null ? HFILL[selectedStop] : "#E2E8F1"}
                    strokeWidth="11"
                    strokeLinejoin="round"
                  />
                  <g fill="none" stroke="#06132F" strokeWidth="5.4" strokeLinecap="round">
                    <path d="M38 47 52 53" opacity={selectedStop === 0 ? 1 : 0} />
                    <path d="M82 47 68 53" opacity={selectedStop === 0 ? 1 : 0} />
                    <path d={selectedStop !== null ? HMOUTH[selectedStop] : HMOUTH[3]} />
                  </g>
                  <ellipse cx="49" cy="62" rx="4.8" ry="4.8" fill="#06132F" />
                  <ellipse cx="71" cy="62" rx="4.8" ry="4.8" fill="#06132F" />
                </svg>
                <div>
                  <p className="face__state">{curStopObj ? curStopObj.label : "Tap a stop"}</p>
                  <p className="face__desc">
                    {curStopObj ? curStopObj.sub : "Six steps, from Angry Star to Recommend."}
                  </p>
                </div>
              </div>

              {/* Spectrum Track */}
              <div className="track" role="presentation">
                <span
                  className="track__thumb"
                  style={{
                    left: `${selectedStop !== null ? (selectedStop / 5) * 100 : 50}%`,
                    ["--tone" as string]: HTONE[curTone],
                  }}
                >
                  <i />
                </span>
              </div>

              {/* 6 Stops */}
              <div className="stops" role="group" aria-label="Rating stops">
                {STOPS.map((st, idx) => {
                  const toneClass = idx <= 2 ? "tone-low" : idx <= 4 ? "tone-mid" : "tone-rec";
                  return (
                    <button
                      key={st.v}
                      type="button"
                      className={`stop ${selectedStop === idx ? `is-on ${toneClass}` : ""}`}
                      onClick={() => setSelectedStop(idx)}
                    >
                      {idx === 0 ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" style={{ width: "22px", height: "22px", color: "#F12A0A" }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ) : idx === 5 ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#0A8754" strokeWidth="2.5" style={{ width: "22px", height: "22px" }}>
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span>{st.v}</span>
                      )}
                      <small>{st.label}</small>
                    </button>
                  );
                })}
              </div>

              {/* Foot & Lock Button */}
              <div className="rate__foot">
                <p className="timer"><b>About seven seconds.</b> Next you add your plan and confirm.</p>
                {selectedStop !== null ? (
                  <Link
                    className={`lock tone-${curTone}`}
                    href={selectedInsurer ? `/write-review?insurer=${selectedInsurer}&stop=${STOPS[selectedStop].v}` : `/write-review?stop=${STOPS[selectedStop].v}`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Lock my rating
                  </Link>
                ) : (
                  <button className="lock tone-none" disabled>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Tap a stop to lock
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Live Ladder */}
            <div className="ladder">
              <div className="ladder__head">
                <h3>What your rating moves</h3>
                <span className="tag tag--navy">Live counts</span>
              </div>

              <div className="signal">
                <div>
                  <p className="signal__label">Your Trust Signal</p>
                  <p className="signal__value">
                    <b>{selectedStop !== null ? STOPS[selectedStop].v : "–"}</b>
                    <span>/100</span>
                  </p>
                </div>
                <p className="signal__chip" style={{ ["--tone" as string]: HTONE[curTone] }}>
                  <i />
                  <span>{curStopObj ? curStopObj.label : "Tap a stop"}</span>
                </p>
                <p className="signal__note">
                  {selectedStop === null
                    ? "Each step is worth 20 points."
                    : selectedStop === 0
                    ? "An Angry Star scores 0 and flags a public request for the insurer to respond."
                    : selectedStop === 5
                    ? "Recommend scores 100: you would tell someone to choose it."
                    : "Each step contributes an authenticity-weighted 20-point interval."}
                </p>
              </div>

              <ol className="rungs">
                <li className={`rung ${selectedStop !== null ? "is-hit" : ""}`}>
                  <div>
                    <p className="rung__name">Your plan</p>
                    <p className="rung__meta">The tenth rating publishes its first TrustScore.</p>
                  </div>
                  <p className="rung__vals"><span>0 of 10</span> → <b>1 of 10</b></p>
                </li>
                <li className={`rung ${selectedStop !== null ? "is-hit" : ""}`}>
                  <div>
                    <p className="rung__name">{selInsObj ? selInsObj.name : "Your insurer brand"}</p>
                    <p className="rung__meta">Its score appears once one of its plans is scored.</p>
                  </div>
                  <p className="rung__vals">
                    <span>{selInsObj ? stats(store, "insurer", selInsObj.slug).n : 0}</span> →{" "}
                    <b>{(selInsObj ? stats(store, "insurer", selInsObj.slug).n : 0) + 1} ratings</b>
                  </p>
                </li>
                <li className={`rung ${selectedStop !== null ? "is-hit" : ""}`}>
                  <div>
                    <p className="rung__name">Life Insurance Trust Index</p>
                    <p className="rung__meta">Opens at 1,000 once 1,000 ratings are locked.</p>
                  </div>
                  <p className="rung__vals"><span>{totalRatings}</span> → <b>{totalRatings + 1} of 1,000</b></p>
                </li>
              </ol>

              <p className="ladder__foot">
                No insurer can buy, edit or delete a rating. Only the customer can update what they lived through.
              </p>
            </div>
          </div>

          {/* 3 Step Cards Below Ladder */}
          <ol className="steps3 mt-xl">
            <li>
              <h3>Tap how it felt</h3>
              <p>Six stops from Angry Star to Recommend. No essay required; pick what fits your experience.</p>
            </li>
            <li>
              <h3>Lock it in seven seconds</h3>
              <p>Signed in with your mobile phone. One rating per plan, updated whenever you want.</p>
            </li>
            <li>
              <h3>See what moved</h3>
              <p>Your signal immediately nudges the plan, the brand and the Life Insurance Trust Index.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* 3. RECENT VERIFIED RATINGS STRIP */}
      <section className="section section--white">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <p className="eyebrow">Real Policyholders</p>
              <h2 className="h2">Recent verified ratings locked</h2>
              <p className="lead">Every rating is anchored to a real policyholder. No anonymous bots, no paid promotional reviews.</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/community">Browse all community ratings</Link>
          </header>

          <div className="auto-3">
            {recentReviews.map((r) => {
              const ins = INS[r.insurer];
              const stopClass = r.overall === 0 ? "sm0" : r.overall <= 40 ? "sm2" : r.overall <= 80 ? "sm4" : "sm5";
              return (
                <article key={r.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`stopmark ${stopClass}`}>
                      {r.overall === 0 ? "⚠️ Angry Star" : `${r.overall}/100`}
                    </span>
                    <span className="tag tag-green">
                      {r.verify === "policy" ? "Policy-verified" : "ID-verified"}
                    </span>
                  </div>
                  <h3 style={{ marginTop: "4px", fontSize: "1.0625rem" }}>{r.title || "Policyholder feedback"}</h3>
                  <p className="small muted" style={{ flex: 1, minHeight: "44px" }}>
                    &ldquo;{r.body.slice(0, 120)}…&rdquo;
                  </p>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--text-3)" }}>
                    <b>{ins ? ins.name : r.insurer}</b>
                    <span>@{r.author || "policyholder"}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LEADERBOARD (COMMENTED OUT)
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <div>
              <p className="eyebrow">Leaderboard</p>
              <h2 className="h2">Top brands by TrustScore</h2>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/industry/insurance">All 26 brands</Link>
          </div>

          {scoredInsurers.length >= 5 ? (
            <div className="list">
              {scoredInsurers.slice(0, 5).map((x, n) => (
                <Link key={x.i.slug} className="li" href={`/industry/insurance/${x.i.slug}`}>
                  <span className="reg">{n + 1}</span>
                  <span className="li-main">
                    <b>{x.i.name}</b>
                    <span>{plural(x.st.n, "review")}{x.st.alert ? " · Trust Alert" : ""}</span>
                  </span>
                  <span className={`score-num ${band(x.st.score).c}`} style={{ width: "54px", height: "54px", fontSize: "1.2rem", borderRadius: "14px" }}>
                    {x.st.score}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>The leaderboard opens when 5 brands have a TrustScore</h3>
              <p>Each brand needs 10 reviews first. {scoredInsurers.length} of 5 so far. Until then, nothing here is ranked.</p>
              <div className="row" style={{ marginTop: "14px" }}>
                <Link className="btn btn-primary btn-sm" href="/write-review">Review your brand</Link>
                <Link className="btn btn-ghost btn-sm" href="/industry/insurance">See all 26 brands</Link>
              </div>
            </div>
          )}
        </div>
      </section>
      */}



      {/* 5. 26 BRANDS DIRECTORY */}
      <section className="section" id="brands">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <p className="eyebrow">Insurers</p>
              <h2 className="h2">Find your insurance brand</h2>
              <p className="lead">All 26 life insurance brands in India. The number is each brand&apos;s official IRDAI registration number.</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/industry/insurance">View full directory</Link>
          </header>

          <ul className={`plates ${showAllInsurers ? "" : "plates--clip"}`}>
            {INSURERS.map((i) => {
              const st = stats(store, "insurer", i.slug);
              return (
                <li key={i.slug}>
                  <Link className="plate" href={`/industry/insurance/${i.slug}`}>
                    <span className="plate__reg">{i.reg}</span>
                    <span>
                      <span className="plate__name">{i.name}</span>
                      <span className="plate__sub">{i.former ? `Formerly ${i.former}` : i.city}</span>
                    </span>
                    <span className={`plate__state ${i.status === "admin" ? "plate__state--warn" : ""}`}>
                      {i.status === "admin" ? "Under administration" : st.score != null ? `${SCORE} ${st.score}` : `${st.n} reviews`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {!showAllInsurers && (
            <p className="more-phone">
              <button className="btn btn--quiet" type="button" onClick={() => setShowAllInsurers(true)}>
                Show all 26 brands
              </button>
            </p>
          )}
        </div>
      </section>

      {/* 6. PLAN TYPES */}
      <section className="section section--mist" id="types">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <p className="eyebrow">Categories</p>
              <h2 className="h2">Browse by category</h2>
              <p className="lead">Each policy category has its own page: what it covers, plans listed, and how to rate yours.</p>
            </div>
          </header>

          <div className="types">
            {TYPES.map((t) => (
              <Link key={t.slug} className="type" href={`/products?type=${t.slug}`}>
                <h3>{t.name}</h3>
                <p>{t.plain}</p>
                <span className="subtypes">
                  {t.subs.map((s) => <span key={s} className="tag">{s}</span>)}
                </span>
                <span className="type__meta">
                  <span>{plural(PLANS.filter((p) => p.type === t.slug && p.status === "on-sale").length, "plan")} listed</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW A TRUSTVALUE SCORE IS BUILT */}
      <section className="section" id="how" aria-labelledby="how-title">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <p className="eyebrow">Methodology</p>
              <h2 className="h2" id="how-title">How a TrustValue Score is built</h2>
              <p className="lead">A Bayesian authenticity engine designed to prevent review tampering, bot storms, and pay-to-play scores.</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/methodology">Full methodology</Link>
          </header>

          <div className="split">
            {/* Left: 5 Steps */}
            <div>
              <ol className="build">
                <li>
                  <b>Every review is weighted for authenticity.</b>
                  <span>e-Insurance Account policy verification carries 1.0 weight; ID verification carries 0.9; phone verification carries 0.7. Low authenticity reviews are filtered from the score.</span>
                </li>
                <li>
                  <b>Filtered reviews stay viewable.</b>
                  <span>Nothing is buried in a private black box. If an outlier review is filtered for low authenticity or expectation gap, it remains readable on the public record with an explanatory label.</span>
                </li>
                <li>
                  <b>Few reviews cannot swing a score.</b>
                  <span>Early ratings are stabilized against the category prior mean until the threshold of 10 ratings is crossed, preventing single 1-star or 5-star swings.</span>
                </li>
                <li>
                  <b>No insurer can pay to change a score.</b>
                  <span>There are no sponsor tiers, no featured badges, and no pay-for-removal services. Insurers have full rights to reply in public for free.</span>
                </li>
                <li>
                  <b>Only the customer can update a rating.</b>
                  <span>If an insurer resolves a dispute, only the policyholder can unlock and adjust their rating. Every edit preserves the historic timeline.</span>
                </li>
              </ol>
            </div>

            {/* Right: Trust Bands Table & Alert Callout */}
            <div>
              <div className="table-wrap">
                <table className="table table--bands">
                  <thead>
                    <tr>
                      <th scope="col">Score band</th>
                      <th scope="col">Meaning</th>
                      <th scope="col">Visual tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>85 – 100</td>
                      <td>Very High Trust</td>
                      <td><span className="tag tag-green">Very High</span></td>
                    </tr>
                    <tr>
                      <td>70 – 84</td>
                      <td>High Trust</td>
                      <td><span className="tag tag-green">High</span></td>
                    </tr>
                    <tr>
                      <td>55 – 69</td>
                      <td>Moderate Trust</td>
                      <td><span className="tag tag-amber">Moderate</span></td>
                    </tr>
                    <tr>
                      <td>40 – 54</td>
                      <td>Low Trust</td>
                      <td><span className="tag tag-amber">Low</span></td>
                    </tr>
                    <tr>
                      <td>0 – 39</td>
                      <td>Very Low Trust</td>
                      <td><span className="tag tag-red">Very Low</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="callout mt-m">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <p>
                  <b>Trust Alert.</b> Triggered on any plan or brand where 10% or more of reviewers award an Angry Star, alerting consumers regardless of the overall score average.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. THE TRUSTVALUE CONSTITUTION */}
      <section className="section section--navy const" id="const" aria-labelledby="const-title">
        <div className="wrap const__grid">
          <div className="const__sticky">
            <h2 className="h2" id="const-title">The TrustValue Constitution</h2>
            <p className="const__claim">
              <span>People share experiences.</span>
              <span>TrustValue measures trust.</span>
            </p>
            <p className="lead mt-m">
              Six immutable rules we publish in the open, because the index is worth nothing the day one of them is compromised.
            </p>
            <p className="hrow mt-l">
              <Link className="btn btn--signal" href="/methodology">Read the Constitution</Link>
              <Link className="btn btn--line" href="/guidelines">Review guidelines</Link>
            </p>
          </div>

          <ol className="articles">
            <li>
              <h3>Every rating has a person behind it.</h3>
              <p>Each rating is locked by a signed-in person, and each person has one current rating per plan. No score appears before ten people have rated.</p>
            </li>
            <li>
              <h3>Insurers can reply. They cannot edit.</h3>
              <p>No insurer can edit, hide or delete a rating. They can read it and reply in public with their verified badge.</p>
            </li>
            <li>
              <h3>No one can buy a score.</h3>
              <p>There are no paid rankings, no sponsored results and no fees for a better number. Commercial relationships are strictly separated.</p>
            </li>
            <li>
              <h3>One method for everyone.</h3>
              <p>Every insurer and plan is scored by the same published method under IS 19000:2022 standards. No custom algorithms.</p>
            </li>
            <li>
              <h3>Only you can change your rating.</h3>
              <p>Update it whenever you like, for example after a problem is fixed. The original stays on the record with its audit date.</p>
            </li>
            <li>
              <h3>We remove only what breaks the rules.</h3>
              <p>A rating comes down only if it breaks published rules (e.g. personal info, hate speech). Every removal is logged in the public ledger.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* 9. BEFORE YOU BUY OR CLAIM (DECISION GUIDES) */}
      <section className="section" id="guides">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <p className="eyebrow">Encyclopedia</p>
              <h2 className="h2">Guides before you buy or claim</h2>
              <p className="lead">Plain-English, verifiable guides answering the most critical questions life insurance buyers face.</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/learn">All articles</Link>
          </header>

          <div className="ncards">
            {ARTICLES.slice(0, 6).map((a) => (
              <article key={a.slug} className="ncard">
                <span className="tag">{a.pillar.replace(/-/g, " ").toUpperCase()}</span>
                <h3 style={{ marginTop: "4px" }}>
                  <Link href={`/learn/${a.slug}`}>{a.title}</Link>
                </h3>
                <p>{a.answer.slice(0, 115)}…</p>
                <div className="ncard__foot">
                  <span className="tiny faint">Updated {a.updated}</span>
                  <Link href={`/learn/${a.slug}`} className="inline-link" style={{ marginLeft: "auto", fontSize: "0.8125rem" }}>
                    Read guide →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="chips mt-l">
            <Link className="chip" href="/glossary">Glossary ({GLOSSARY.length} terms)</Link>
            <Link className="chip" href="/questions">Questions &amp; Answers</Link>
            <Link className="chip" href="/tools">Cover calculator</Link>
            <Link className="chip" href="/data">Open Data audits</Link>
          </div>
        </div>
      </section>

      {/* 10. QUESTIONS PEOPLE ASK (FAQ) & THE WORDS WE USE */}
      <section className="section section--mist" id="faq" aria-labelledby="faq-title">
        <div className="wrap">
          <header className="shead">
            <div className="shead__txt">
              <p className="eyebrow">Clarity</p>
              <h2 className="h2" id="faq-title">Questions people ask</h2>
              <p className="lead">Direct answers to the common questions about how TrustValue works and your rights as a policyholder.</p>
            </div>
          </header>

          <div className="split">
            {/* Accordion List */}
            <div className="faq">
              <details open>
                <summary>
                  <h3>What is TrustValue?</h3>
                </summary>
                <p>
                  TrustValue is an independent trust index and verified consumer review platform for life insurance in India. We track all 26 IRDAI-registered insurers and their audited plans, calculating scores that no brand can edit, hide or buy.
                </p>
              </details>

              <details>
                <summary>
                  <h3>Is TrustValue an insurance broker or agent?</h3>
                </summary>
                <p>
                  No. TrustValue does not sell insurance, does not recommend specific agents, and does not accept commissions or referral fees for quotes. We are an audit and rating index.
                </p>
              </details>

              <details>
                <summary>
                  <h3>Can an insurer pay to delete or hide a negative review?</h3>
                </summary>
                <p>
                  Never. Insurers cannot delete, hide or alter consumer reviews. They receive the right to reply publicly for free. Only the policyholder who wrote the review can modify their rating.
                </p>
              </details>

              <details>
                <summary>
                  <h3>What is the Angry Star?</h3>
                </summary>
                <p>
                  The Angry Star is Stop 0 on our rating spectrum. It signals a severe breach of trust (such as mis-selling or an unjustified claim rejection). When 10% or more of reviewers award an Angry Star, a prominent Trust Alert is automatically shown on the plan.
                </p>
              </details>

              <details>
                <summary>
                  <h3>What does &ldquo;Policy-verified&rdquo; mean?</h3>
                </summary>
                <p>
                  Policy-verified means the reviewer confirmed they hold the policy, either through their e-Insurance Account repository or by submitting the first page of their policy document. Policy-verified reviews carry the highest mathematical weight (1.0) in our algorithm.
                </p>
              </details>

              <details>
                <summary>
                  <h3>What is Section 45 of the Insurance Act?</h3>
                </summary>
                <p>
                  Section 45 states that once three years have passed from policy issuance or revival, no insurer can reject a life insurance claim on any grounds, including non-disclosure. It is one of the strongest protections for Indian families.
                </p>
              </details>

              <details>
                <summary>
                  <h3>Why do some brands show &ldquo;0 of 10 ratings&rdquo; instead of a score?</h3>
                </summary>
                <p>
                  To prevent premature statistical bias, an insurer or plan must receive at least 10 authentic reviews before its TrustScore is unlocked. Until then, we display the exact number of verified ratings locked.
                </p>
              </details>

              <details>
                <summary>
                  <h3>Can I review a policy that is no longer sold?</h3>
                </summary>
                <p>
                  Yes. Many policyholders hold legacy plans bought 10 or 20 years ago. Existing holders can review their policy, which contributes to the insurer brand&apos;s overall TrustScore.
                </p>
              </details>
            </div>

            {/* Right: The Words We Use (Glossary Callouts) */}
            <aside className="stack">
              <div className="card">
                <p className="eyebrow">The words we use</p>
                <h3 style={{ marginTop: "6px" }}>Authenticity Score</h3>
                <p className="small muted">
                  Our 0 to 1 algorithm estimating genuine policyholder intent based on verification tier, account age, and review consistency.
                </p>
              </div>

              <div className="card">
                <p className="eyebrow">The words we use</p>
                <h3 style={{ marginTop: "6px" }}>Expectation Gap</h3>
                <p className="small muted">
                  When a policyholder files a complaint about something the policy explicitly excludes in its contract. The review stays public with the clause cited.
                </p>
              </div>

              <div className="card">
                <p className="eyebrow">The words we use</p>
                <h3 style={{ marginTop: "6px" }}>Free-look period</h3>
                <p className="small muted">
                  The mandatory 30-day window after policy receipt during which you can cancel for a full refund if the plan was mis-sold.
                </p>
              </div>

              <div className="card card--navy" style={{ background: "#071B46", borderColor: "transparent", color: "#fff" }}>
                <h3 style={{ color: "#fff" }}>Have a question not listed?</h3>
                <p className="small" style={{ color: "#AEBBD6", marginTop: "6px" }}>
                  Ask the community or our editorial team. Verified answers become permanent reference pages.
                </p>
                <Link className="btn btn--signal btn--sm mt-m" href="/questions/ask">
                  Ask a question
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 11. BOTTOM CTA (IMAGE 1 DESIGN) */}
      <TrustValueBottomCta />
    </div>
  );
}
