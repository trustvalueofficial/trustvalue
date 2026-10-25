"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./terms.css";
import { MASCOT_HERO_DATA_URI } from "./assets";

const TOTAL = 8;
const DWELL = 8;
const TERMS_URL = "https://trustvalue.ai/termsAndcondition";

const BADGES = [
  { id: "first", name: "First steps", icon: "fa-play", desc: "Finish level 1" },
  { id: "proof", name: "Proof Pro", icon: "fa-camera", desc: "Ace the proof checkpoint" },
  { id: "fair", name: "Fair Play", icon: "fa-shield-halved", desc: "Finish level 5" },
  { id: "ninja", name: "Fine Print Ninja", icon: "fa-scroll", desc: "Finish level 7" },
  { id: "ace", name: "Quiz Ace", icon: "fa-bolt", desc: "Clear all 8 checkpoints" },
  { id: "master", name: "Terms Master", icon: "fa-trophy", desc: "Finish all 8 levels" },
];

const RANKS = [
  [0, "Newbie"],
  [200, "Skimmer"],
  [500, "Reader"],
  [800, "Rules nerd"],
  [1100, "Fine print pro"],
] as const;

const LEVEL_DATA = [
  { level: 1, title: "The basics", icon: "fa-user" },
  { level: 2, title: "What you can rate", icon: "fa-tag" },
  { level: 3, title: "Proof", icon: "fa-camera" },
  { level: 4, title: "Your words", icon: "fa-comment-dots" },
  { level: 5, title: "Businesses and the numbers", icon: "fa-chart-line" },
  { level: 6, title: "Sharing, privacy and fair play", icon: "fa-lock" },
  { level: 7, title: "The fine print", icon: "fa-scroll" },
  { level: 8, title: "Rights and complaints", icon: "fa-scale-balanced" },
];

interface QuizState {
  pick: string;
  ok: boolean;
}

interface ToastItem {
  id: number;
  big: string;
  small: string;
  badge?: boolean;
}

export default function TermsAndConditionPage() {
  const [xp, setXp] = useState(0);
  const [shownXp, setShownXp] = useState(0);
  const [doneLevels, setDoneLevels] = useState<Record<number, boolean>>({});
  const [quizzes, setQuizzes] = useState<Record<number, QuizState>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, boolean>>({});
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [isPlainMode, setIsPlainMode] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [copyFeedback, setCopyFeedback] = useState("Copy link to these Terms");
  const [showCopyFallback, setShowCopyFallback] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dwellTimes = useRef<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 });
  const endSeen = useRef<Record<number, boolean>>({});

  // Compute total done count
  const doneCount = Object.values(doneLevels).filter(Boolean).length;

  // Rank calculation
  const getRank = () => {
    if (doneCount === TOTAL) return "Terms Master";
    let r = "Newbie";
    for (const [thresh, title] of RANKS) {
      if (xp >= thresh) r = title;
    }
    return r;
  };

  // Add toast helper
  const addToast = (big: string, small: string, badge = false) => {
    if (isPlainMode) return;
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, big, small, badge }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Confetti effect on full completion
  const triggerConfetti = () => {
    if (typeof window === "undefined" || isPlainMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);
    const g = canvas.getContext("2d");
    if (!g) return;

    const cols = ["#FF5A0A", "#FFAA00", "#F12A0A", "#0F2C6E", "#0A8754"];
    const particles = Array.from({ length: 150 }).map(() => ({
      x: W / 2,
      y: H * 0.4,
      vx: (Math.random() - 0.5) * 16 * dpr,
      vy: (-4 - Math.random() * 13) * dpr,
      s: (5 + Math.random() * 6) * dpr,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.35,
      c: cols[Math.floor(Math.random() * cols.length)],
    }));

    const t0 = performance.now();
    const frame = (t: number) => {
      const k = (t - t0) / 1800;
      g.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.vy += 0.35 * dpr;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.r);
        g.globalAlpha = Math.max(0, 1 - k);
        g.fillStyle = p.c;
        g.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66);
        g.restore();
      });
      if (k < 1) requestAnimationFrame(frame);
      else g.clearRect(0, 0, W, H);
    };
    requestAnimationFrame(frame);
  };

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tv-terms-game-v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.done) setDoneLevels(parsed.done);
        if (parsed.quiz) setQuizzes(parsed.quiz);
        if (typeof parsed.plain === "boolean") setIsPlainMode(parsed.plain);
      }
    } catch {}
  }, []);

  // Sync XP and badges whenever doneLevels or quizzes change
  useEffect(() => {
    let currentXp = 0;
    for (let i = 1; i <= TOTAL; i++) {
      if (doneLevels[i]) currentXp += 100;
      if (quizzes[i]) {
        currentXp += quizzes[i].ok ? 50 : 10;
      }
    }
    setXp(currentXp);

    // Badges check
    const newBadges: Record<string, boolean> = {
      first: !!doneLevels[1],
      proof: !!(quizzes[3] && quizzes[3].ok),
      fair: !!doneLevels[5],
      ninja: !!doneLevels[7],
      ace: [1, 2, 3, 4, 5, 6, 7, 8].every((lvl) => quizzes[lvl] && quizzes[lvl].ok),
      master: Object.values(doneLevels).filter(Boolean).length === TOTAL,
    };

    setUnlockedBadges((prev) => {
      Object.keys(newBadges).forEach((key) => {
        if (newBadges[key] && !prev[key]) {
          const badgeMeta = BADGES.find((b) => b.id === key);
          if (badgeMeta) {
            addToast("Badge unlocked", badgeMeta.name, true);
            if (key === "master") triggerConfetti();
          }
        }
      });
      return newBadges;
    });

    // Save to localStorage
    try {
      localStorage.setItem(
        "tv-terms-game-v1",
        JSON.stringify({
          done: doneLevels,
          quiz: quizzes,
          plain: isPlainMode,
        })
      );
    } catch {}
  }, [doneLevels, quizzes, isPlainMode]);

  // Animated number counter for XP
  useEffect(() => {
    if (shownXp === xp) return;
    const start = shownXp;
    const target = xp;
    const duration = 650;
    const t0 = performance.now();

    const anim = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const cur = Math.round(start + (target - start) * (1 - Math.pow(1 - k, 3)));
      setShownXp(cur);
      if (k < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }, [xp]);

  // Track dwell time & auto-complete level
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden || !activeLevel) return;
      dwellTimes.current[activeLevel] = (dwellTimes.current[activeLevel] || 0) + 1;
      if (endSeen.current[activeLevel] && dwellTimes.current[activeLevel] >= DWELL) {
        if (!doneLevels[activeLevel]) {
          setDoneLevels((prev) => {
            if (prev[activeLevel]) return prev;
            addToast("+100 XP", `Level ${activeLevel} finished: ${LEVEL_DATA[activeLevel - 1].title}`);
            return { ...prev, [activeLevel]: true };
          });
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeLevel, doneLevels]);

  // Set up IntersectionObservers for level visibility & end markers
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const endObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const levelEl = e.target.closest(".lvl") as HTMLElement;
            if (levelEl && levelEl.dataset.level) {
              const lvl = parseInt(levelEl.dataset.level, 10);
              endSeen.current[lvl] = true;
              if (dwellTimes.current[lvl] >= DWELL && !doneLevels[lvl]) {
                setDoneLevels((prev) => {
                  if (prev[lvl]) return prev;
                  addToast("+100 XP", `Level ${lvl} finished: ${LEVEL_DATA[lvl - 1].title}`);
                  return { ...prev, [lvl]: true };
                });
              }
            }
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll(".lvl__end").forEach((s) => endObserver.observe(s));

    const curObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const lvl = parseInt((e.target as HTMLElement).dataset.level || "0", 10);
            if (lvl) setActiveLevel(lvl);
          }
        });
      },
      { rootMargin: "-38% 0px -58% 0px" }
    );

    document.querySelectorAll(".lvl").forEach((l) => curObserver.observe(l));

    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveLevel(null);
        });
      },
      { rootMargin: "-38% 0px -58% 0px" }
    );

    document.querySelectorAll(".hero, .short").forEach((el) => topObserver.observe(el));

    return () => {
      endObserver.disconnect();
      curObserver.disconnect();
      topObserver.disconnect();
    };
  }, [doneLevels]);

  // Handle quiz option click
  const handleQuiz = (level: number, opt: string, correct: string) => {
    if (quizzes[level]) return;
    const isOk = opt === correct;
    setQuizzes((prev) => ({
      ...prev,
      [level]: { pick: opt, ok: isOk },
    }));
    addToast(isOk ? "+50 XP" : "+10 XP", isOk ? "Checkpoint cleared" : "Thanks for trying");
  };

  // Reset all progress
  const handleReset = () => {
    setDoneLevels({});
    setQuizzes({});
    setUnlockedBadges({});
    dwellTimes.current = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
    endSeen.current = {};
    addToast("Progress reset", "Every level is back to 0 XP");
    try {
      localStorage.removeItem("tv-terms-game-v1");
    } catch {}
  };

  // Copy link handler
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(TERMS_URL)
        .then(() => {
          setCopyFeedback("Link copied");
          setTimeout(() => setCopyFeedback("Copy link to these Terms"), 2200);
        })
        .catch(() => setShowCopyFallback(true));
    } else {
      setShowCopyFallback(true);
    }
  };

  return (
    <div className={`terms-container ${isPlainMode ? "plain" : ""}`}>
      <canvas ref={canvasRef} className="confetti" />

      {/* Sticky HUD Bar */}

      {/* Sticky HUD Bar */}
      {!isPlainMode && (
        <div className="hud" data-game>
          <div className="hud__row wrap">
            <p className="hud__xp" title="Your XP">
              <span className="coin" aria-hidden="true"></span>
              <b>{shownXp.toLocaleString("en-IN")}</b>
              <span className="u">XP</span>
            </p>
            <p className="hud__rank">{getRank()}</p>

            <nav className="segs" aria-label="Jump to a level">
              {LEVEL_DATA.map((lvl) => {
                const isDone = !!doneLevels[lvl.level];
                const isNow = activeLevel === lvl.level;
                return (
                  <a
                    key={lvl.level}
                    className={`seg ${isDone ? "is-done" : ""} ${isNow ? "is-now" : ""}`}
                    href={`#level-${lvl.level}`}
                    aria-label={`Level ${lvl.level}: ${lvl.title}${isDone ? ", finished" : ""}`}
                  />
                );
              })}
            </nav>

            <p className="hud__now">
              {activeLevel ? `Level ${activeLevel} · ${LEVEL_DATA[activeLevel - 1].title}` : ""}
            </p>

            <a className="hud__bdg" href="#finish">
              <i className="fa-solid fa-trophy"></i>
              <b>
                {Object.values(unlockedBadges).filter(Boolean).length}/6
              </b>
              <span className="sr"> badges</span>
            </a>

            <Link className="btn btn--signal btn--sm hud__cta" href="/#experience">
              Rate it
            </Link>
            <p className="sr" aria-live="polite">
              {doneCount} of 8 levels finished
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero" aria-labelledby="page-h">
        <div className="wrap hero__in">
          <div className="hero__copy">
            <p className="eyebrow">TrustValue.ai</p>
            <h1 id="page-h">Terms of Use</h1>
            <p className="hero__kick">
              Read the rules. <span>Level up.</span>
            </p>
            <p className="hero__sub">
              Every rule that keeps ratings honest, in eight short levels. Finish a level to bank XP, clear the checkpoints, and unlock Terms Master.
            </p>
            <div className="hero__cta">
              <a className="btn btn--signal" href="#level-1">
                <i className="fa-solid fa-play"></i>Start level 1
              </a>
              <a className="btn btn--glass" href="#short">
                The 30-second version
              </a>
            </div>
            <ul className="stats" aria-label="At a glance">
              <li>
                <b>8</b> levels
              </li>
              <li>
                <b>26</b> sections
              </li>
              <li>
                <b>18</b> min read
              </li>
              {!isPlainMode && (
                <li data-game>
                  <b>1,200</b> XP to win
                </li>
              )}
            </ul>
            <p className="hero__meta">
              <button
                type="button"
                className="switch"
                aria-pressed={!isPlainMode}
                onClick={() => {
                  const next = !isPlainMode;
                  setIsPlainMode(next);
                  document.documentElement.classList.toggle("plain", next);
                }}
              >
                <span className="switch__t" aria-hidden="true"></span>
                <span>{isPlainMode ? "Game off: plain text" : "Game on"}</span>
              </button>
            </p>
          </div>
          <figure className="hero__fig">
            {!isPlainMode && (
              <p className="bubble" data-game>
                Legal stuff, but make it a game. Finish a level, bank the XP.
              </p>
            )}
            <img
              className="hero__mascot"
              src={MASCOT_HERO_DATA_URI}
              alt="The TrustValue mascot: a smiling U in a navy hoodie"
              width={365}
              height={760}
            />
          </figure>
        </div>
      </section>

      {/* Main Container Layout */}
      <div className="wrap layout">
        {/* Left Sticky Rail */}
        {!isPlainMode && (
          <nav className="rail" data-game aria-label="Level map">
            <p className="rail__k">
              <i className="fa-solid fa-map-location-dot"></i>Level map
            </p>
            <ol>
              {LEVEL_DATA.map((lvl) => {
                const isDone = !!doneLevels[lvl.level];
                const isCur = activeLevel === lvl.level;
                return (
                  <li key={lvl.level}>
                    <a
                      className={`map__a ${isDone ? "is-done" : ""}`}
                      href={`#level-${lvl.level}`}
                      aria-current={isCur ? "true" : "false"}
                    >
                      <span className="map__i" aria-hidden="true">
                        <i className={`fa-solid ${lvl.icon}`}></i>
                      </span>
                      <span className="map__t">
                        <small>Level {lvl.level}</small>
                        {lvl.title}
                      </span>
                      <span className="map__s" aria-hidden="true">
                        <i className="fa-solid fa-check map__ok"></i>
                        <span className="map__xp">+100</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Content Column */}
        <div id="main" className="col">
          {/* 30-Second Version */}
          <section className="short" id="short" aria-labelledby="short-h">
            <div className="short__hd">
              <span className="av" aria-hidden="true"></span>
              <div>
                <p className="short__k">TL;DR</p>
                <h2 id="short-h">The 30-second version</h2>
              </div>
            </div>
            <ul className="short__list">
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-user"></i>
                </span>
                <span>You must be 18 or older and use your own phone number: one person, one account.</span>
              </li>
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-star"></i>
                </span>
                <span>Rate only what you bought or used yourself. Say what happened; don't accuse.</span>
              </li>
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-camera"></i>
                </span>
                <span>A rating counts in the TrustValue and the Trust Index only with proof. Your proof photo is seen only by our trust team and deleted after the check.</span>
              </li>
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-pen"></i>
                </span>
                <span>You own what you write. You let us show it, count it and turn it into shareable cards.</span>
              </li>
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-shield-halved"></i>
                </span>
                <span>We remove content only when it breaks the published rules or when a court or the law requires it. Nobody can pay us to change, hide or reorder a rating.</span>
              </li>
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-circle-info"></i>
                </span>
                <span>TrustValue is information, not advice. We don't sell products, insurance or investments.</span>
              </li>
              <li>
                <span className="ic" aria-hidden="true">
                  <i className="fa-solid fa-scale-balanced"></i>
                </span>
                <span>Indian law applies. Complaints go to our grievance officer, who answers within the times the law sets.</span>
              </li>
            </ul>
            <p className="short__note">A summary to get you started. The Terms below are what apply.</p>
          </section>

          {/* LEVEL 1 */}
          <section className={`lvl ${doneLevels[1] ? "is-done" : ""}`} id="level-1" data-level="1" data-title="The basics" aria-labelledby="lvl1-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-user"></i>
              </span>
              <div>
                <p className="lvl__k">Level 1 of 8 · Sections 1 to 3 · 3 min read</p>
                <h2 id="lvl1-h">The basics</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[1]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[1]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 1 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>TrustValue is a ratings platform, run under Indian law.</li>
                    <li>18+ only: one person, one phone, one account.</li>
                    <li>Ratings are customers' opinions. We host them, and nobody can pay us to change one.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s1" aria-labelledby="s1-h">
                <h3 id="s1-h"><span className="sec__n">1.</span>Who we are and how these Terms work</h3>
                <div className="cl"><span className="cl__n">1.1</span><div className="cl__t"><p>TrustValue (trustvalue.ai and its apps) is run by <mark className="fill">[company legal name]</mark>, a company incorporated in India (CIN <mark className="fill">[number]</mark>), with its registered office at <mark className="fill">[address]</mark> ("TrustValue", "we", "us").</p></div></div>
                <div className="cl"><span className="cl__n">1.2</span><div className="cl__t"><p>These Terms of Use are a contract between you and TrustValue. They include the policies they link to: the Privacy Notice, What We Remove, How Scores Work, the Proof Policy, the Constitution, the Grievance and Takedown Policy and, when they apply to you, the Research Panel Terms, the Pulse Policy and the Business Terms. If a policy conflicts with these Terms, these Terms apply, except that the Business Terms apply to business accounts.</p></div></div>
                <div className="cl"><span className="cl__n">1.3</span><div className="cl__t"><p>You accept these Terms when you create an account or post anything. You can browse without an account, and these Terms still govern how you use TrustValue.</p></div></div>
                <div className="cl"><span className="cl__n">1.4</span><div className="cl__t"><p>We publish these Terms as an intermediary under the Information Technology Act 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021 as amended (the "IT Rules"). They are available in English and Hindi, and in any other language in the Eighth Schedule to the Constitution on request. <span className="cnote"><b>Drafting note:</b> confirm the language wording against the IT Rules and which version prevails.</span></p></div></div>
                <div className="cl"><span className="cl__n">1.5</span><div className="cl__t"><p>We remind every user of these rules at least once every three months.</p></div></div>
              </article>
              <article className="sec" id="s2" aria-labelledby="s2-h">
                <h3 id="s2-h"><span className="sec__n">2.</span>Who can use TrustValue</h3>
                <div className="cl"><span className="cl__n">2.1</span><div className="cl__t"><p>You must be 18 or older. TrustValue is not for children, and we close any account we learn belongs to someone under 18.</p></div></div>
                <div className="cl"><span className="cl__n">2.2</span><div className="cl__t"><p>One person, one account. You sign in with a mobile number confirmed by a one-time code, or with Google or Apple plus a confirmed mobile number. Keep your sign-in secure; you are responsible for what happens through your account.</p></div></div>
                <div className="cl"><span className="cl__n">2.3</span><div className="cl__t"><p>Give us true details. Don't impersonate anyone, and don't create accounts for other people, automated accounts or accounts to get round a suspension.</p></div></div>
                <div className="cl"><span className="cl__n">2.4</span><div className="cl__t"><p>If you act for a business, for example to claim its profile or reply to ratings, you must accept the Business Terms and have the authority to bind that business.</p></div></div>
              </article>
              <article className="sec" id="s3" aria-labelledby="s3-h">
                <h3 id="s3-h"><span className="sec__n">3.</span>What TrustValue is, and what it is not</h3>
                <div className="cl"><span className="cl__n">3.1</span><div className="cl__t"><p>TrustValue is an independent platform where people rate products and organisations they have bought or used. Anyone can read those ratings and two numbers worked out from them: the TrustValue, an average out of 5, and the Trust Index, which shows how that average moves over time.</p></div></div>
                <div className="cl"><span className="cl__n">3.2</span><div className="cl__t"><p>Ratings, words, photos and videos on TrustValue are the experiences and opinions of the people who posted them, not TrustValue's. We host them as an intermediary.</p></div></div>
                <div className="cl"><span className="cl__n">3.3</span><div className="cl__t"><p>The TrustValue and the Trust Index are calculated from verified ratings by the method published on How Scores Work. They report what verified customers said. They are not a certification or a guarantee, and not a statement by TrustValue about the quality, safety, legality or financial strength of anything.</p></div></div>
                <div className="cl"><span className="cl__n">3.4</span><div className="cl__t"><p>TrustValue does not sell, recommend or arrange any product. It is not an insurer, an insurance intermediary or web aggregator, a bank, an investment adviser, a research analyst, a credit rating agency, a broker or a marketplace. It earns nothing from any sale, passes on no leads and gives no personal advice. Read the official documents, and take professional advice before you buy insurance, credit, investments or health care.</p></div></div>
                <div className="cl"><span className="cl__n">3.5</span><div className="cl__t"><p>Nobody can pay TrustValue to add, remove, change, hide, delay or reorder a rating, or to change a TrustValue or Trust Index. Businesses pay only for tools and research, as the Business Terms explain.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="1" data-correct="b">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp1-q">Who can open a TrustValue account?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp1-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[1]?.pick === "a" ? (quizzes[1]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[1]}
                    onClick={() => handleQuiz(1, "a", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>Anyone with a phone number</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[1]?.pick === "b" ? "is-right" : ""}`}
                    disabled={!!quizzes[1]}
                    onClick={() => handleQuiz(1, "b", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>People aged 18 or older</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[1]?.pick === "c" ? (quizzes[1]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[1]}
                    onClick={() => handleQuiz(1, "c", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>Only people who bought something</span>
                  </button>
                </div>
                {quizzes[1] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[1].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 2.1: TrustValue is 18+ only, with one person and one account each.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 2 */}
          <section className={`lvl ${doneLevels[2] ? "is-done" : ""}`} id="level-2" data-level="2" data-title="What you can rate" aria-labelledby="lvl2-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-tag"></i>
              </span>
              <div>
                <p className="lvl__k">Level 2 of 8 · Sections 4 to 5 · 3 min read</p>
                <h2 id="lvl2-h">What you can rate</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[2]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[2]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 2 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>Rate products and companies you actually bought or used. Paid services count too.</li>
                    <li>Some things never get listed: people, tobacco, betting, cures, politics and a few more.</li>
                    <li>No rewards for ratings. Say what happened; don't accuse.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s4" aria-labelledby="s4-h">
                <h3 id="s4-h"><span className="sec__n">4.</span>What can be rated</h3>
                <div className="cl"><span className="cl__n">4.1</span><div className="cl__t"><p>You can rate products and organisations offered to the public in India: goods; services you pay for, such as an insurance policy, a phone plan or a flight, which count as products; and the companies, brands and groups behind them.</p></div></div>
                <div className="cl"><span className="cl__n">4.2</span><div className="cl__t"><p>We don't list, and don't accept ratings of: individual people; courts, judges and tribunals; political parties and candidates; tobacco and nicotine products; online money games, betting and gambling; medicines for diseases listed under the Drugs and Magic Remedies (Objectionable Advertisements) Act 1954, and anything sold as a cure or magic remedy; crypto assets, unregistered investment schemes and unlicensed lenders; weapons, drugs, adult services and anything illegal to sell in India; places of worship and religious bodies; alcohol brands, for now; and security agencies and the armed forces. We may add to this list.</p></div></div>
                <div className="cl"><span className="cl__n">4.3</span><div className="cl__t"><p>Anyone with an account can suggest a missing product, organisation or category. We check the maker, the parent organisation and the category before a listing goes live, and we may correct, merge, rename, move or decline listings to keep them accurate.</p></div></div>
                <div className="cl"><span className="cl__n">4.4</span><div className="cl__t"><p>A listing doesn't mean the business agreed to be listed, endorses TrustValue, or is endorsed by TrustValue.</p></div></div>
              </article>
              <article className="sec" id="s5" aria-labelledby="s5-h">
                <h3 id="s5-h"><span className="sec__n">5.</span>Rating rules</h3>
                <div className="cl"><span className="cl__n">5.1</span><div className="cl__t"><p>Every rating must follow these rules:</p>
                  <ul className="sub">
                    <li><span className="sub__n">(a)</span><span><strong>Your own experience.</strong> Rate only what you bought or used yourself. Don't rate for someone else or ask someone to rate for you.</span></li>
                    <li><span className="sub__n">(b)</span><span><strong>One rating each.</strong> One rating per product or organisation. You can update it; earlier versions stay in your history and only the latest counts.</span></li>
                    <li><span className="sub__n">(c)</span><span><strong>No rewards.</strong> Don't accept money, discounts, gifts, contest entries or any other benefit for rating, or for rating a certain way. A rating linked to a reward doesn't count.</span></li>
                    <li><span className="sub__n">(d)</span><span><strong>Declare connections.</strong> If you work for, act as an agent or distributor for, are paid by, own part of, or compete with the business, say so. Your rating will show that label and won't count.</span></li>
                    <li><span className="sub__n">(e)</span><span><strong>Say what happened.</strong> Describe your experience and give your opinion, for example "my claim was rejected after 40 days". Don't state as fact what you can't show, and don't accuse anyone of a crime.</span></li>
                    <li><span className="sub__n">(f)</span><span><strong>Keep it on topic and private.</strong> Write about the product or organisation, and leave out other people's personal details: staff names, phone numbers, policy or account numbers, addresses.</span></li>
                  </ul>
                </div></div>
                <div className="cl"><span className="cl__n">5.2</span><div className="cl__t"><p>You must not post anything that:</p>
                  <ul className="sub">
                    <li><span className="sub__n">(a)</span><span>belongs to someone else and that you have no right to post;</span></li>
                    <li><span className="sub__n">(b)</span><span>is obscene, pornographic or paedophilic; invades anyone's privacy, including bodily privacy; insults or harasses anyone on the basis of gender; is racially or ethnically objectionable; relates to or encourages money laundering or gambling; or promotes enmity between groups on grounds of religion or caste with intent to incite violence;</span></li>
                    <li><span className="sub__n">(c)</span><span>is harmful to children;</span></li>
                    <li><span className="sub__n">(d)</span><span>infringes a patent, trademark, copyright or other proprietary right;</span></li>
                    <li><span className="sub__n">(e)</span><span>deceives or misleads about where a message came from, or knowingly and intentionally communicates misinformation or information that is patently false, untrue or misleading;</span></li>
                    <li><span className="sub__n">(f)</span><span>impersonates another person;</span></li>
                    <li><span className="sub__n">(g)</span><span>threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign states or public order; incites any cognisable offence; prevents the investigation of any offence; or insults another nation;</span></li>
                    <li><span className="sub__n">(h)</span><span>contains a virus or any code, file or program designed to interrupt, destroy or limit the working of any computer resource;</span></li>
                    <li><span className="sub__n">(i)</span><span>is, advertises or promotes an online game that isn't permitted under Indian law, or any online money game;</span></li>
                    <li><span className="sub__n">(j)</span><span>is made or altered by AI or other tools to look real when it isn't, unless it is clearly labelled, and never as proof;</span></li>
                    <li><span className="sub__n">(k)</span><span>is spam, an advert or a sales link, a threat, hate speech or harassment; or</span></li>
                    <li><span className="sub__n">(l)</span><span>breaks any law in force.</span></li>
                  </ul>
                </div></div>
                <p className="cnote"><span className="cnote"><b>Drafting note:</b> align 5.2(a) to (i) word for word with the current IT Rules, rule 3(1)(b).</span></p>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="2" data-correct="b">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp2-q">A shop offers you a ₹200 voucher for a 5-star rating. What happens to that rating?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp2-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[2]?.pick === "a" ? (quizzes[2]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[2]}
                    onClick={() => handleQuiz(2, "a", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>It counts if you liked the shop</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[2]?.pick === "b" ? "is-right" : ""}`}
                    disabled={!!quizzes[2]}
                    onClick={() => handleQuiz(2, "b", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>It doesn't count</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[2]?.pick === "c" ? (quizzes[2]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[2]}
                    onClick={() => handleQuiz(2, "c", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>It counts if you mention the voucher</span>
                  </button>
                </div>
                {quizzes[2] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[2].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 5.1(c): a rating linked to a reward doesn't count, whatever it says.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 3 */}
          <section className={`lvl ${doneLevels[3] ? "is-done" : ""}`} id="level-3" data-level="3" data-title="Proof" aria-labelledby="lvl3-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-camera"></i>
              </span>
              <div>
                <p className="lvl__k">Level 3 of 8 · Sections 6 to 7 · 3 min read</p>
                <h2 id="lvl3-h">Proof</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[3]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[3]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 3 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>A rating counts only with proof: one photo of the bill, the pack or the policy page.</li>
                    <li>Only our trust team sees it, and it's deleted 30 days after the check.</li>
                    <li>No proof? It becomes a Pulse rating: shown on its own, never moves a number.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s6" aria-labelledby="s6-h">
                <h3 id="s6-h"><span className="sec__n">6.</span>Proof of purchase or use</h3>
                <div className="cl"><span className="cl__n">6.1</span><div className="cl__t"><p>A rating counts in the TrustValue and the Trust Index only if it comes with proof that passes our checks. Proof is one photo, taken in the app, of the product with its label, the bill, the order or booking screen, or the first page of the policy schedule, as How Scores Work lists for each kind of product.</p></div></div>
                <div className="cl"><span className="cl__n">6.2</span><div className="cl__t"><p>Before upload, the app helps you hide account numbers, policy numbers and other personal details. Upload only your own proof, unaltered.</p></div></div>
                <div className="cl"><span className="cl__n">6.3</span><div className="cl__t"><p>We use proof only to check that a rating is genuine. It is encrypted, seen only by our trust team, never shown publicly and never shared with the business. We delete the photo 30 days after the check and keep only the result, for example "Verified on 14 Oct 2026 · bill". If the rating is reported or disputed, or named in a legal notice or order, we keep the proof until the matter closes, and for longer if the law requires.</p></div></div>
                <div className="cl"><span className="cl__n">6.4</span><div className="cl__t"><p>Edited, borrowed or AI-made proof is a serious breach. We will remove the rating, may close the account, and will report it where the law requires.</p></div></div>
              </article>
              <article className="sec" id="s7" aria-labelledby="s7-h">
                <h3 id="s7-h"><span className="sec__n">7.</span>Verified and Pulse ratings</h3>
                <div className="cl"><span className="cl__n">7.1</span><div className="cl__t"><p>A rating whose proof passes our checks is <strong>Verified</strong>. It shows a Verified mark and counts in the TrustValue and the Trust Index.</p></div></div>
                <div className="cl"><span className="cl__n">7.2</span><div className="cl__t"><p>A rating without proof, or whose proof doesn't pass, is a <strong>Pulse</strong> rating. It appears separately, as a count and mix of stars, and never changes any number. You can add proof within 30 days to make it Verified.</p></div></div>
                <div className="cl"><span className="cl__n">7.3</span><div className="cl__t"><p>We may hold a rating for review before it appears, for example during a sudden burst of ratings. We aim to decide within 72 hours.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="3" data-correct="c">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp3-q">What happens to your proof photo?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp3-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[3]?.pick === "a" ? (quizzes[3]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[3]}
                    onClick={() => handleQuiz(3, "a", "c")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>It's shown next to your rating</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[3]?.pick === "b" ? (quizzes[3]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[3]}
                    onClick={() => handleQuiz(3, "b", "c")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>The business gets a copy</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[3]?.pick === "c" ? "is-right" : ""}`}
                    disabled={!!quizzes[3]}
                    onClick={() => handleQuiz(3, "c", "c")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>Only the trust team sees it, then it is deleted</span>
                  </button>
                </div>
                {quizzes[3] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[3].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 6.3: proof is encrypted, never public, never shared with the business, and deleted 30 days after the check unless a dispute needs it kept.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Quick Nudge */}
          <aside className="nudge" aria-label="A shortcut">
            <span className="nudge__i" aria-hidden="true">
              <i className="fa-solid fa-camera"></i>
            </span>
            <p>
              <b>Got a bill or a pack nearby?</b> That is your proof. A verified rating takes about 7 seconds.
            </p>
            <Link className="btn btn--ink btn--sm" href="/#experience">
              Rate something now<i className="fa-solid fa-arrow-right"></i>
            </Link>
          </aside>

          {/* LEVEL 4 */}
          <section className={`lvl ${doneLevels[4] ? "is-done" : ""}`} id="level-4" data-level="4" data-title="Your words" aria-labelledby="lvl4-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-comment-dots"></i>
              </span>
              <div>
                <p className="lvl__k">Level 4 of 8 · Sections 8 to 9 · 3 min read</p>
                <h2 id="lvl4-h">Your words</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[4]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[4]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 4 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>You own what you write. You let us show it, count it and turn it into cards.</li>
                    <li>We never change what you meant.</li>
                    <li>We remove only rule-breakers or what the law orders, and we tell you why.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s8" aria-labelledby="s8-h">
                <h3 id="s8-h"><span className="sec__n">8.</span>Your content and the licence you give us</h3>
                <div className="cl"><span className="cl__n">8.1</span><div className="cl__t"><p>You own the ratings, words, photos and videos you post ("your content"). Nothing in these Terms transfers that ownership to us or limits your right to give an honest review anywhere else.</p></div></div>
                <div className="cl"><span className="cl__n">8.2</span><div className="cl__t"><p>You give TrustValue a worldwide, non-exclusive, royalty-free, transferable licence, which we may pass to our service providers, to host, store, copy, display, translate, publish and distribute your content; to adapt its format, for example into TrustCards, stories and summaries; and to count it in totals, the TrustValue, the Trust Index and research. The licence lasts while your content is on TrustValue and for a reasonable time afterwards for backups and legal records.</p></div></div>
                <div className="cl"><span className="cl__n">8.3</span><div className="cl__t"><p>We never change the meaning of your content. We may hide personal details, shorten it for display with a link to the full version, or remove a part that breaks the rules, and we will tell you when we do.</p></div></div>
                <div className="cl"><span className="cl__n">8.4</span><div className="cl__t"><p>When you delete a rating or your account, we remove your name, words, photos and videos from TrustValue. The star value may stay in totals only as an anonymous number that can't be linked to you, so that published numbers don't change after the fact. <span className="cnote"><b>Drafting note:</b> confirm against the DPDP Act.</span></p></div></div>
                <div className="cl"><span className="cl__n">8.5</span><div className="cl__t"><p>You confirm that you have the rights to post your content and that it follows these Terms. If you post content you know to be false or unlawful, you are responsible for it.</p></div></div>
              </article>
              <article className="sec" id="s9" aria-labelledby="s9-h">
                <h3 id="s9-h"><span className="sec__n">9.</span>How we moderate</h3>
                <div className="cl"><span className="cl__n">9.1</span><div className="cl__t"><p>We review content with automated checks and people. We act on reports from users, businesses and authorities, and on our own checks.</p></div></div>
                <div className="cl"><span className="cl__n">9.2</span><div className="cl__t"><p>We remove or restrict content only when it breaks these Terms or What We Remove, or when a court order, a lawful government notice or the law requires it. We don't remove a rating because it is negative, because a business disagrees with it, or because someone threatens legal action.</p></div></div>
                <div className="cl"><span className="cl__n">9.3</span><div className="cl__t"><p>When we remove or restrict your content or account, we tell you what we did, why, which rule or order we relied on, whether automated tools were involved, and how to appeal. A person who didn't make the first decision decides the appeal.</p></div></div>
                <div className="cl"><span className="cl__n">9.4</span><div className="cl__t"><p>Instead of removing content we may label it, for example "Connected to the business" or "Waiting for the brand", limit a feature or suspend an account, as What We Remove explains.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="4" data-correct="a">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp4-q">Who owns the words in your rating?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp4-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[4]?.pick === "a" ? "is-right" : ""}`}
                    disabled={!!quizzes[4]}
                    onClick={() => handleQuiz(4, "a", "a")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>You do</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[4]?.pick === "b" ? (quizzes[4]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[4]}
                    onClick={() => handleQuiz(4, "b", "a")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>TrustValue</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[4]?.pick === "c" ? (quizzes[4]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[4]}
                    onClick={() => handleQuiz(4, "c", "a")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>The business you rated</span>
                  </button>
                </div>
                {quizzes[4] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[4].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 8.1: you own your content and give TrustValue a licence to show and count it.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 5 */}
          <section className={`lvl ${doneLevels[5] ? "is-done" : ""}`} id="level-5" data-level="5" data-title="Businesses and the numbers" aria-labelledby="lvl5-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-chart-line"></i>
              </span>
              <div>
                <p className="lvl__k">Level 5 of 8 · Sections 10 to 11 · 3 min read</p>
                <h2 id="lvl5-h">Businesses and the numbers</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[5]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[5]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 5 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>Any business can be listed without asking. Claimed businesses can reply, never delete.</li>
                    <li>TrustValue is the average of verified ratings out of 5, shown from 10 ratings.</li>
                    <li>The Trust Index starts at 1,000 and moves daily. A Trust Alert is a count, not a verdict.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s10" aria-labelledby="s10-h">
                <h3 id="s10-h"><span className="sec__n">10.</span>Businesses on TrustValue</h3>
                <div className="cl"><span className="cl__n">10.1</span><div className="cl__t"><p>Any business that offers products to the public may be listed and rated without its consent.</p></div></div>
                <div className="cl"><span className="cl__n">10.2</span><div className="cl__t"><p>A business that claims its profile under the Business Terms can reply publicly to ratings, report ratings that break the rules, and use tools and research. It can't remove, edit, hide, reorder or delay a rating, choose which ratings appear, see a rater's contact details or proof, or reward ratings.</p></div></div>
                <div className="cl"><span className="cl__n">10.3</span><div className="cl__t"><p>Replies must follow these Terms. A business must not threaten or pressure a rater, try to identify one, or offer anything to change or remove a rating. We may remove such a reply, label it, and act under the Business Terms.</p></div></div>
                <div className="cl"><span className="cl__n">10.4</span><div className="cl__t"><p>A business can ask us, with evidence, to correct facts in its listing such as its name, category, parent or status.</p></div></div>
              </article>
              <article className="sec" id="s11" aria-labelledby="s11-h">
                <h3 id="s11-h"><span className="sec__n">11.</span>TrustValue and the Trust Index</h3>
                <div className="cl"><span className="cl__n">11.1</span><div className="cl__t"><p>The TrustValue is the average of verified ratings from the last 24 months, out of 5 with one decimal, shown once a product or organisation has 10 verified ratings. An organisation's TrustValue includes every verified rating of it and of the products under it.</p></div></div>
                <div className="cl"><span className="cl__n">11.2</span><div className="cl__t"><p>The Trust Index starts at 1,000 when a product or organisation reaches 10 verified ratings and moves each day with its recent TrustValue. Indices are shown publicly once TrustValue has 1,000 verified ratings across the platform.</p></div></div>
                <div className="cl"><span className="cl__n">11.3</span><div className="cl__t"><p>A Trust Alert means that at least 10% of the verified ratings in the last 90 days were 1 (Angry Star). It is a count, not a finding of wrongdoing.</p></div></div>
                <div className="cl"><span className="cl__n">11.4</span><div className="cl__t"><p>How Scores Work sets out the full method. We announce method changes there before they apply and never rewrite past values without a public note. If we find a calculation error, we correct it and say so.</p></div></div>
                <div className="cl"><span className="cl__n">11.5</span><div className="cl__t"><p>These numbers are information, not advice or a guarantee, and they change as new ratings arrive.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="5" data-correct="c">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp5-q">Can a business pay to remove a 1-star rating?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp5-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[5]?.pick === "a" ? (quizzes[5]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[5]}
                    onClick={() => handleQuiz(5, "a", "c")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>Yes, on a paid plan</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[5]?.pick === "b" ? (quizzes[5]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[5]}
                    onClick={() => handleQuiz(5, "b", "c")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>Only after it replies</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[5]?.pick === "c" ? "is-right" : ""}`}
                    disabled={!!quizzes[5]}
                    onClick={() => handleQuiz(5, "c", "c")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>Never</span>
                  </button>
                </div>
                {quizzes[5] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[5].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Sections 3.5 and 10.2: no plan can remove, edit, hide, reorder or delay a rating.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Business Nudge */}
          <aside className="nudge" aria-label="A shortcut">
            <span className="nudge__i" aria-hidden="true">
              <i className="fa-solid fa-chart-line"></i>
            </span>
            <p>
              <b>Run a business?</b> Claim your profile for free, reply to ratings and see what customers say.
            </p>
            <Link className="btn btn--ink btn--sm" href="/for-business/">
              Claim your profile<i className="fa-solid fa-arrow-right"></i>
            </Link>
          </aside>

          {/* LEVEL 6 */}
          <section className={`lvl ${doneLevels[6] ? "is-done" : ""}`} id="level-6" data-level="6" data-title="Sharing, privacy and fair play" aria-labelledby="lvl6-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-lock"></i>
              </span>
              <div>
                <p className="lvl__k">Level 6 of 8 · Sections 12 to 15 · 3 min read</p>
                <h2 id="lvl6-h">Sharing, privacy and fair play</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[6]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[6]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 6 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>Share your cards anywhere, but don't edit their numbers.</li>
                    <li>City, age band and gender only with your consent, only in totals. We don't sell personal data.</li>
                    <li>No bots, scraping or rating schemes. Our name and marks stay ours.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s12" aria-labelledby="s12-h">
                <h3 id="s12-h"><span className="sec__n">12.</span>Sharing, TrustCards and links</h3>
                <div className="cl"><span className="cl__n">12.1</span><div className="cl__t"><p>You can share TrustCards, stories and links from TrustValue on other services; their own terms apply there.</p></div></div>
                <div className="cl"><span className="cl__n">12.2</span><div className="cl__t"><p>Don't alter a TrustCard to change its numbers, crop out its source line, or present a card made from sample data as real.</p></div></div>
                <div className="cl"><span className="cl__n">12.3</span><div className="cl__t"><p>A business may show its TrustValue only through the live badge, under the badge licence in the Business Terms. Any other use of TrustValue's name, numbers or marks in advertising needs our written permission.</p></div></div>
              </article>
              <article className="sec" id="s13" aria-labelledby="s13-h">
                <h3 id="s13-h"><span className="sec__n">13.</span>Your privacy, location and research</h3>
                <div className="cl"><span className="cl__n">13.1</span><div className="cl__t"><p>The Privacy Notice explains what personal data we collect, why, how long we keep it, and your rights to access, correct and erase it, to nominate someone, and to complain. We process personal data under the Digital Personal Data Protection Act 2023 and its Rules and, until those apply in full, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules 2011.</p></div></div>
                <div className="cl"><span className="cl__n">13.2</span><div className="cl__t"><p>We ask for your city, age band and gender only with your consent, use them only in totals, and never show them in a way that identifies you.</p></div></div>
                <div className="cl"><span className="cl__n">13.3</span><div className="cl__t"><p>Joining the TrustValue research panel is a separate choice. Research shares only totals from groups of at least 10 people. We don't sell personal data.</p></div></div>
                <div className="cl"><span className="cl__n">13.4</span><div className="cl__t"><p>A public rating shows your display name (a first name and initial, or a handle), your city, the date and the rating, never your phone number or email.</p></div></div>
              </article>
              <article className="sec" id="s14" aria-labelledby="s14-h">
                <h3 id="s14-h"><span className="sec__n">14.</span>Things you must not do</h3>
                <div className="cl cl--p"><div className="cl__t"><p>You must not:</p>
                  <ul className="sub">
                    <li><span className="sub__n">(a)</span><span>scrape, crawl, copy or extract TrustValue's content or data by automated means, or use it to build a competing database or to train AI models, without our written permission;</span></li>
                    <li><span className="sub__n">(b)</span><span>post fake ratings, buy or sell ratings, run rating schemes, or use several accounts, bots or network tricks to manipulate ratings;</span></li>
                    <li><span className="sub__n">(c)</span><span>interfere with or overload TrustValue, probe its security, or get round any limit or block;</span></li>
                    <li><span className="sub__n">(d)</span><span>use TrustValue to harass, threaten or identify raters, or to retaliate against anyone for a rating;</span></li>
                    <li><span className="sub__n">(e)</span><span>use TrustValue for anything unlawful; or</span></li>
                    <li><span className="sub__n">(f)</span><span>suggest that TrustValue endorses you or is connected with you when it isn't.</span></li>
                  </ul>
                </div></div>
              </article>
              <article className="sec" id="s15" aria-labelledby="s15-h">
                <h3 id="s15-h"><span className="sec__n">15.</span>Intellectual property</h3>
                <div className="cl"><span className="cl__n">15.1</span><div className="cl__t"><p>TrustValue, Trust Index, TrustCard, TrustStar, Angry Star, our logo and mascot, the site's design, the scoring method and the database belong to us or are licensed to us. Apart from your content, you may use TrustValue only to read, rate and share as these Terms allow.</p></div></div>
                <div className="cl"><span className="cl__n">15.2</span><div className="cl__t"><p>Brand names and trademarks of the businesses on TrustValue belong to their owners and are used only to identify what is rated.</p></div></div>
                <div className="cl"><span className="cl__n">15.3</span><div className="cl__t"><p>If you believe something on TrustValue infringes your rights, tell the grievance officer (section 21) with the details.</p></div></div>
                <div className="cl"><span className="cl__n">15.4</span><div className="cl__t"><p>If you send us ideas or feedback, we may use them without paying you.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="6" data-correct="b">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp6-q">Can you run a bot that copies TrustValue ratings into your own app?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp6-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[6]?.pick === "a" ? (quizzes[6]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[6]}
                    onClick={() => handleQuiz(6, "a", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>Yes, the ratings are public</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[6]?.pick === "b" ? "is-right" : ""}`}
                    disabled={!!quizzes[6]}
                    onClick={() => handleQuiz(6, "b", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>Only with TrustValue's written permission</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[6]?.pick === "c" ? (quizzes[6]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[6]}
                    onClick={() => handleQuiz(6, "c", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>Yes, if it is for AI training</span>
                  </button>
                </div>
                {quizzes[6] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[6].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 14(a): no scraping or automated copying without written permission.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 7 */}
          <section className={`lvl ${doneLevels[7] ? "is-done" : ""}`} id="level-7" data-level="7" data-title="The fine print" aria-labelledby="lvl7-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-scroll"></i>
              </span>
              <div>
                <p className="lvl__k">Level 7 of 8 · Sections 16 to 19 · 3 min read</p>
                <h2 id="lvl7-h">The fine print</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[7]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[7]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 7 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>Verified means the proof passed our checks, not that every word is true.</li>
                    <li>TrustValue is information, not advice. Our liability is limited where the law allows.</li>
                    <li>Serious rule-breaking can close an account, always with a reason and an appeal.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s16" aria-labelledby="s16-h">
                <h3 id="s16-h"><span className="sec__n">16.</span>Disclaimers</h3>
                <div className="cl"><span className="cl__n">16.1</span><div className="cl__t"><p>TrustValue shows what customers say. We check proof and patterns, but we can't confirm every statement in every rating, and "Verified" means the proof passed our checks, not that everything in the rating is true.</p></div></div>
                <div className="cl"><span className="cl__n">16.2</span><div className="cl__t"><p>We provide TrustValue "as is" and "as available". To the extent the law allows, we make no promise that it is accurate, complete or always available, and we may change or stop any feature.</p></div></div>
                <div className="cl"><span className="cl__n">16.3</span><div className="cl__t"><p>Facts on product and organisation pages come from the sources linked beside them, with the date we last checked them. Check the original before you rely on a fact.</p></div></div>
                <div className="cl"><span className="cl__n">16.4</span><div className="cl__t"><p><strong>Insurance, banking, investments and health.</strong> TrustValue is not an insurer, intermediary, bank, adviser or provider, and earns nothing from sales. Ratings are customers' opinions. Read the policy wording or official documents and take professional advice before you decide.</p></div></div>
              </article>
              <article className="sec" id="s17" aria-labelledby="s17-h">
                <h3 id="s17-h"><span className="sec__n">17.</span>Limits on our liability</h3>
                <div className="cl"><span className="cl__n">17.1</span><div className="cl__t"><p>Nothing in these Terms limits liability for fraud, for death or personal injury caused by negligence, or any liability that the law doesn't allow us to limit.</p></div></div>
                <div className="cl"><span className="cl__n">17.2</span><div className="cl__t"><p>Otherwise, to the extent the law allows: we aren't liable for content posted by users or businesses, or for decisions you make based on TrustValue; we aren't liable for indirect or consequential loss, or loss of profit, data or goodwill; and our total liability to you for all claims about TrustValue is limited to the higher of ₹<mark className="fill">[10,000]</mark> and what you paid us in the 12 months before the claim. <span className="cnote"><b>Drafting note:</b> confirm the amount.</span></p></div></div>
              </article>
              <article className="sec" id="s18" aria-labelledby="s18-h">
                <h3 id="s18-h"><span className="sec__n">18.</span>Your responsibility to us</h3>
                <div className="cl cl--p"><div className="cl__t"><p>If you break these Terms or the law, or post content you knew to be false or unlawful, and someone brings a claim against TrustValue because of it, you will cover TrustValue's reasonable losses and costs from that claim, to the extent the law allows. If you use TrustValue as a consumer, this applies only where you acted deliberately or negligently. <span className="cnote"><b>Drafting note:</b> check against consumer law here and abroad.</span></p></div></div>
              </article>
              <article className="sec" id="s19" aria-labelledby="s19-h">
                <h3 id="s19-h"><span className="sec__n">19.</span>Suspension and closing accounts</h3>
                <div className="cl"><span className="cl__n">19.1</span><div className="cl__t"><p>You can delete your account at any time in My Activity.</p></div></div>
                <div className="cl"><span className="cl__n">19.2</span><div className="cl__t"><p>We may suspend or close an account, remove content or limit features if you seriously or repeatedly break these Terms, if the law or a court requires it, or to protect users or TrustValue. Where we can, we warn you first; we always tell you why and how to appeal, unless the law stops us.</p></div></div>
                <div className="cl"><span className="cl__n">19.3</span><div className="cl__t"><p>After an account closes we keep your registration details for 180 days, as the IT Rules require, and then delete them unless the law needs us to keep them longer.</p></div></div>
                <div className="cl"><span className="cl__n">19.4</span><div className="cl__t"><p>Sections that by their nature should continue, including 8.2 for content already counted and sections 16 to 18 and 20 to 25, continue after an account closes.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="7" data-correct="b">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp7-q">What does the Verified mark tell you?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp7-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[7]?.pick === "a" ? (quizzes[7]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[7]}
                    onClick={() => handleQuiz(7, "a", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>Everything in the rating is true</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[7]?.pick === "b" ? "is-right" : ""}`}
                    disabled={!!quizzes[7]}
                    onClick={() => handleQuiz(7, "b", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>The proof passed TrustValue's checks</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[7]?.pick === "c" ? (quizzes[7]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[7]}
                    onClick={() => handleQuiz(7, "c", "b")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>TrustValue agrees with the rating</span>
                  </button>
                </div>
                {quizzes[7] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[7].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 16.1: Verified means the proof passed our checks, not that every word is true.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 8 */}
          <section className={`lvl ${doneLevels[8] ? "is-done" : ""}`} id="level-8" data-level="8" data-title="Rights and complaints" aria-labelledby="lvl8-h">
            <header className="lvl__hd">
              <span className="lvl__icon" aria-hidden="true">
                <i className="fa-solid fa-scale-balanced"></i>
              </span>
              <div>
                <p className="lvl__k">Level 8 of 8 · Sections 20 to 26 · 3 min read</p>
                <h2 id="lvl8-h">Rights and complaints</h2>
              </div>
              {!isPlainMode && (
                <p data-game>
                  <span className="pill pill--xp" hidden={doneLevels[8]}>
                    <span className="coin" aria-hidden="true"></span>+100 XP
                  </span>
                  <span className="pill pill--done" hidden={!doneLevels[8]}>
                    <i className="fa-solid fa-check"></i>Done
                  </span>
                </p>
              )}
            </header>
            {!isPlainMode && (
              <aside className="tldr" data-game aria-label="Level 8 in short">
                <span className="av" aria-hidden="true"></span>
                <div className="tldr__b">
                  <p className="tldr__k">TL;DR <span>· a summary, the sections below apply</span></p>
                  <ul>
                    <li>We act on court orders and lawful notices, and share your details only when the law requires it.</li>
                    <li>Grievance officer: we acknowledge in 24 hours and resolve in 7 days.</li>
                    <li>Indian law applies, and your consumer rights stay yours wherever you are.</li>
                  </ul>
                </div>
              </aside>
            )}
            <div className="secs">
              <article className="sec" id="s20" aria-labelledby="s20-h">
                <h3 id="s20-h"><span className="sec__n">20.</span>Legal requests and law enforcement</h3>
                <div className="cl"><span className="cl__n">20.1</span><div className="cl__t"><p>We act on court orders and on notices from authorised government agencies under the IT Act, within the times the IT Rules set; for removal orders that is currently three hours.</p></div></div>
                <div className="cl"><span className="cl__n">20.2</span><div className="cl__t"><p>We give information about a user to a government agency only on a lawful written order, and to a business or anyone else only on a court order. Unless the law or the order prevents it, we tell the user first.</p></div></div>
                <div className="cl"><span className="cl__n">20.3</span><div className="cl__t"><p>We keep content removed under an order or our rules, with the related records, for at least 180 days, and longer if a court or agency asks.</p></div></div>
                <div className="cl"><span className="cl__n">20.4</span><div className="cl__t"><p>Our quarterly transparency report counts the orders and requests we receive and what we did with them.</p></div></div>
              </article>
              <article className="sec" id="s21" aria-labelledby="s21-h">
                <h3 id="s21-h"><span className="sec__n">21.</span>Grievance officer and complaints</h3>
                <div className="cl"><span className="cl__n">21.1</span><div className="cl__t"><p>Grievance officer: <mark className="fill">[name]</mark>, <mark className="fill">[designation]</mark>, <mark className="fill">[address in India]</mark>, <mark className="fill">[email]</mark>, <mark className="fill">[phone]</mark>. You can also complain at <mark className="fill">[trustvalue.ai/grievance]</mark>.</p></div></div>
                <div className="cl"><span className="cl__n">21.2</span><div className="cl__t"><p>We acknowledge a complaint within 24 hours and resolve it within 7 days. We resolve requests to remove content within 36 hours, and complaints about content that shows a person's private areas, nudity or sexual acts, or impersonates someone, including morphed images, within 2 hours. <span className="cnote"><b>Drafting note:</b> confirm against the IT Rules in force on launch day.</span></p></div></div>
                <div className="cl"><span className="cl__n">21.3</span><div className="cl__t"><p>If you aren't satisfied with the decision, you may appeal to the Grievance Appellate Committee within 30 days.</p></div></div>
                <div className="cl"><span className="cl__n">21.4</span><div className="cl__t"><p>Before TrustValue opens to users in the EU or UK, we will publish a contact point, our legal representative and the out-of-court options available there.</p></div></div>
              </article>
              <article className="sec" id="s22" aria-labelledby="s22-h">
                <h3 id="s22-h"><span className="sec__n">22.</span>Governing law and disputes</h3>
                <div className="cl"><span className="cl__n">22.1</span><div className="cl__t"><p>Indian law governs these Terms.</p></div></div>
                <div className="cl"><span className="cl__n">22.2</span><div className="cl__t"><p>Before going to court, please write to us at <mark className="fill">[email]</mark>; we aim to settle issues within 30 days.</p></div></div>
                <div className="cl"><span className="cl__n">22.3</span><div className="cl__t"><p>Subject to 22.4, the courts at <mark className="fill">[Mumbai, or the city of the registered office]</mark> have exclusive jurisdiction over any dispute about these Terms or TrustValue.</p></div></div>
                <div className="cl"><span className="cl__n">22.4</span><div className="cl__t"><p>Nothing in these Terms takes away your right to approach a consumer commission or any other forum the law gives you, or any mandatory rights that consumers have in their own country.</p></div></div>
              </article>
              <article className="sec" id="s23" aria-labelledby="s23-h">
                <h3 id="s23-h"><span className="sec__n">23.</span>Users outside India</h3>
                <div className="cl"><span className="cl__n">23.1</span><div className="cl__t"><p>TrustValue is built for users in India. If you use it from elsewhere, you are responsible for following your local laws, and we may limit features in some countries.</p></div></div>
                <div className="cl"><span className="cl__n">23.2</span><div className="cl__t"><p>Where your country's law gives you rights these Terms can't exclude, such as consumer rights in the EU or UK, those rights apply.</p></div></div>
                <div className="cl"><span className="cl__n">23.3</span><div className="cl__t"><p>For users in the United States: nothing in these Terms restricts your right to post an honest review, penalises you for one, or takes the intellectual property rights in it.</p></div></div>
                <div className="cl"><span className="cl__n">23.4</span><div className="cl__t"><p>We will add a section for each region before we open there.</p></div></div>
              </article>
              <article className="sec" id="s24" aria-labelledby="s24-h">
                <h3 id="s24-h"><span className="sec__n">24.</span>Changes to TrustValue and these Terms</h3>
                <div className="cl"><span className="cl__n">24.1</span><div className="cl__t"><p>We may change TrustValue and these Terms. For a change that affects your rights, we give at least 30 days' notice on the site and by email or in-app message, unless the change is needed to comply with the law or to protect safety or security, when it may apply sooner.</p></div></div>
                <div className="cl"><span className="cl__n">24.2</span><div className="cl__t"><p>If you keep using TrustValue after a change takes effect, the new Terms apply. If you don't agree, you can delete your account.</p></div></div>
              </article>
              <article className="sec" id="s25" aria-labelledby="s25-h">
                <h3 id="s25-h"><span className="sec__n">25.</span>General</h3>
                <div className="cl"><span className="cl__n">25.1</span><div className="cl__t"><p>These Terms and the policies they link to are the whole agreement between you and TrustValue about TrustValue.</p></div></div>
                <div className="cl"><span className="cl__n">25.2</span><div className="cl__t"><p>If a court finds any part invalid, the rest stays in force.</p></div></div>
                <div className="cl"><span className="cl__n">25.3</span><div className="cl__t"><p>If we don't enforce a right straight away, we haven't given it up.</p></div></div>
                <div className="cl"><span className="cl__n">25.4</span><div className="cl__t"><p>You may not transfer your rights under these Terms. We may transfer ours to a company that takes over TrustValue, and we will tell you.</p></div></div>
                <div className="cl"><span className="cl__n">25.5</span><div className="cl__t"><p>We aren't responsible for delays caused by events beyond our reasonable control.</p></div></div>
                <div className="cl"><span className="cl__n">25.6</span><div className="cl__t"><p>We may send notices by email, SMS or in-app message to the contact details on your account.</p></div></div>
              </article>
              <article className="sec" id="s26" aria-labelledby="s26-h">
                <h3 id="s26-h"><span className="sec__n">26.</span>Contact</h3>
                <div className="cl cl--p"><div className="cl__t"><p><mark className="fill">[Company legal name]</mark>, <mark className="fill">[registered office address]</mark>. Email: <mark className="fill">[address]</mark>. For complaints, see the grievance officer in section 21.</p></div></div>
              </article>
            </div>
            <div className="lvl__end" aria-hidden="true"></div>
            {!isPlainMode && (
              <div className="cp" data-game data-level="8" data-correct="a">
                <p className="cp__k"><i className="fa-solid fa-bolt"></i>Checkpoint · +50 XP</p>
                <p className="cp__q" id="cp8-q">How quickly must a request to remove content be resolved?</p>
                <div className="cp__opts" role="group" aria-labelledby="cp8-q">
                  <button
                    type="button"
                    className={`opt ${quizzes[8]?.pick === "a" ? "is-right" : ""}`}
                    disabled={!!quizzes[8]}
                    onClick={() => handleQuiz(8, "a", "a")}
                  >
                    <span className="opt__k" aria-hidden="true">a</span><span>Within 36 hours</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[8]?.pick === "b" ? (quizzes[8]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[8]}
                    onClick={() => handleQuiz(8, "b", "a")}
                  >
                    <span className="opt__k" aria-hidden="true">b</span><span>Within 7 days</span>
                  </button>
                  <button
                    type="button"
                    className={`opt ${quizzes[8]?.pick === "c" ? (quizzes[8]?.ok ? "is-right" : "is-wrong") : ""}`}
                    disabled={!!quizzes[8]}
                    onClick={() => handleQuiz(8, "c", "a")}
                  >
                    <span className="opt__k" aria-hidden="true">c</span><span>Within 30 days</span>
                  </button>
                </div>
                {quizzes[8] && (
                  <div className="cp__fb" aria-live="polite">
                    <span className="av" aria-hidden="true"></span>
                    <p>
                      <strong>{quizzes[8].ok ? "Nailed it. +50 XP." : "Not quite. +10 XP for trying."}</strong> Section 21.2: removal requests within 36 hours; other complaints within 7 days.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* FINAL LEVEL: Terms Master */}
          <section className={`fin ${doneCount === TOTAL ? "is-master" : ""}`} id="finish" aria-labelledby="fin-h">
            <div className="fin__copy">
              <p className="fin__k">Final level</p>
              <h2 id="fin-h">
                {doneCount === TOTAL ? "You're a Terms Master" : "Final level: Terms Master"}
              </h2>
              <p className="fin__p" id="fin-p">
                {doneCount === TOTAL
                  ? "You know these rules better than most businesses do. Now use them: rate something you bought this month."
                  : `Finish all eight levels to unlock the badge. You have finished ${doneCount} of 8.`}
              </p>
              <ul className="badges" aria-label="Badges">
                {BADGES.map((b) => {
                  const on = !!unlockedBadges[b.id];
                  return (
                    <li key={b.id} className={`bdg ${on ? "is-on" : ""}`} data-badge={b.id}>
                      <span className="bdg__m" aria-hidden="true">
                        <span className="coin"></span>
                        <span className="bdg__g">
                          <i className={`fa-solid ${b.icon}`}></i>
                        </span>
                      </span>
                      <b>{b.name}</b>
                      <small>{b.desc}</small>
                      <span className="sr">{on ? "unlocked" : "locked"}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="fin__cta">
                <Link className="btn btn--signal" href="/#experience">
                  <i className="fa-solid fa-star"></i>Rate your first product
                </Link>
                <Link className="btn btn--glass" href="/login/">
                  Create your account
                </Link>
                <button type="button" className="btn btn--ghost" id="copy" onClick={handleCopy}>
                  <i className="fa-solid fa-copy"></i>
                  <span>{copyFeedback}</span>
                </button>
              </div>
              {showCopyFallback && (
                <div className="copyfb" id="copy-fallback">
                  <label htmlFor="copy-url">Copy this link:</label>
                  <input id="copy-url" type="text" readOnly value={TERMS_URL} onFocus={(e) => e.target.select()} />
                </div>
              )}
              <div className="fin__row">
                <button
                  type="button"
                  className="switch"
                  aria-pressed={!isPlainMode}
                  onClick={() => {
                    const next = !isPlainMode;
                    setIsPlainMode(next);
                    document.documentElement.classList.toggle("plain", next);
                  }}
                >
                  <span className="switch__t" aria-hidden="true"></span>
                  <span>{isPlainMode ? "Game off: plain text" : "Game on"}</span>
                </button>
                <button type="button" id="reset" onClick={handleReset} data-game>
                  Reset my progress
                </button>
                <span data-game>Progress is saved in this browser only.</span>
              </div>
            </div>
            <img
              className="fin__mascot"
              src={MASCOT_HERO_DATA_URI}
              alt=""
              width={365}
              height={760}
            />
          </section>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.badge ? "toast--badge" : ""}`}>
            <span className="coin" aria-hidden="true"></span>
            <span>
              <b>{t.big}</b> <span>{t.small}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
