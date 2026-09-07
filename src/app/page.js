"use client";

import { useState, useEffect, useRef } from "react";

const ratingMeta = {
  1: {
    name: "Angry Star",
    explain: "This should not have happened.",
    color: "#C63C3C",
    score: 20,
    verdict: "ANGRY STAR",
  },
  2: {
    name: "Trust challenged",
    explain: "The experience disappointed you.",
    color: "#D97706",
    score: 40,
    verdict: "TRUST CHALLENGED",
  },
  3: {
    name: "Mixed",
    explain: "Some things worked. Some did not.",
    color: "#6366F1",
    score: 60,
    verdict: "MIXED EXPERIENCE",
  },
  4: {
    name: "Good experience",
    explain: "You would feel positive about doing this again.",
    color: "#2563EB",
    score: 80,
    verdict: "POSITIVE EXPERIENCE",
  },
  5: {
    name: "Recommend",
    explain: "You would confidently recommend this experience.",
    color: "#10B981",
    score: 100,
    verdict: "RECOMMENDED",
  },
};

const chipList = [
  "Launches",
  "Innovation",
  "Price relevance",
  "Presentation",
  "Other",
];

const counts = [1, 10, 100, 1000, 10000];

export default function Home() {
  // Dual countdown state
  const [cd, setCd] = useState({ d: "01", h: "00", m: "00", s: "00" });
  const [mainCd, setMainCd] = useState({ d: "79", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const roomOpen = new Date("2026-09-09T00:00:00+05:30").getTime();
    const mainLaunch = new Date("2026-11-25T00:00:00+05:30").getTime();

    function calc(target) {
      const x = Math.max(0, target - Date.now());
      const d = Math.floor(x / 86400000);
      const h = Math.floor((x % 86400000) / 3600000);
      const m = Math.floor((x % 3600000) / 60000);
      const s = Math.floor((x % 60000) / 1000);
      return {
        d: String(d).padStart(2, "0"),
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      };
    }

    function tick() {
      setCd(calc(roomOpen));
      setMainCd(calc(mainLaunch));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prototype state
  const [master, setMaster] = useState(3);
  const [driver, setDriver] = useState("");
  const [locked, setLocked] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [details, setDetails] = useState({
    launches: 3,
    innovation: 3,
    price: 3,
    presentation: 3,
  });

  const [lockedData, setLockedData] = useState({
    score: 60,
    verdict: "MIXED EXPERIENCE",
    driver: "Master signal only",
    isBad: false,
    isGood: false,
    showAngryBridge: false,
  });

  const [simIndex, setSimIndex] = useState(0);
  const [showBridgeFlow, setShowBridgeFlow] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  const showToastNotification = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 1600);
  };

  // Email join state
  const [emailInput, setEmailInput] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [isNewMember, setIsNewMember] = useState(true);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleMasterChange = (val) => {
    const num = Number(val);
    setMaster(num);
    setDetails({
      launches: num,
      innovation: num,
      price: num,
      presentation: num,
    });
  };

  const handleDetailStarClick = (key, val) => {
    setDetails((prev) => ({ ...prev, [key]: val }));
  };

  const handleChipClick = (chip) => {
    setDriver(chip);
  };

  const currentMeta = ratingMeta[master];

  const handleLockExperience = () => {
    setLocked(true);
    setLockedData({
      score: currentMeta.score,
      verdict: currentMeta.verdict,
      driver: driver ? `${driver} shaped this rating most` : "Master signal only",
      isBad: master === 1,
      isGood: master === 5,
      showAngryBridge: master === 1,
    });
    setTimeout(() => {
      const resEl = document.getElementById("result");
      if (resEl) {
        resEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 120);
  };

  // Simulation calculation
  const n = counts[simIndex];
  const experienceScore = master * 20;
  const eventBase = 84.6;
  const eventBaseN = 20000;
  const eventAfter = (eventBase * eventBaseN + experienceScore * n) / (eventBaseN + n);
  const brandBase = 91.2;
  const brandAfter = brandBase + (eventAfter - eventBase) * 0.12;

  const eventFillWidth = Math.max(0, Math.min(100, eventAfter));
  const eventFillClass =
    eventAfter < 60 ? "low" : eventAfter < 75 ? "mid" : "high";
  const eventDeltaClass =
    eventAfter < eventBase ? "down" : eventAfter > eventBase ? "up" : "";
  const brandDeltaClass =
    brandAfter < brandBase ? "down" : brandAfter > brandBase ? "up" : "";

  const shareText = `Apple Event 2026 — ${currentMeta.verdict}${
    driver ? ` · ${driver} influenced my rating` : ""
  }. My TrustValue experience score: ${currentMeta.score}/100.`;

  const handleCopyCard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}
    showToastNotification("TrustCard copied for your circle");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My TrustValue",
          text: shareText,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}
    showToastNotification("TrustCard copied for your circle");
  };

  const handleJoin = async () => {
    const trimmed = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setJoinMsg("Enter a valid email to continue.");
      return;
    }

    setSubmitting(true);
    setJoinMsg("Saving your access request...");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "founding_build" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("trustvalue_founding_interest", "1");
        }
        setModalEmail(trimmed);
        setIsNewMember(data.isNew !== false);
        setShowSuccessModal(true);
        setJoinMsg(data.message || "You have been successfully added to the early access list!");
        setEmailInput("");
      } else {
        setJoinMsg(data.error || "Could not save email. Please try again.");
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.setItem("trustvalue_founding_interest", "1");
      }
      setJoinMsg("Founding interest saved on this device.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="shell nav-in">
          <div className="brand-lock">
            <svg className="mark" viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <linearGradient id="lg" x1="8" y1="8" x2="58" y2="58">
                  <stop offset="0" stopColor="#2563EB" />
                  <stop offset="0.58" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#00B6D4" />
                </linearGradient>
              </defs>
              <path
                d="M11 14H45"
                fill="none"
                stroke="#0B1D63"
                strokeWidth="7.5"
                strokeLinecap="round"
              />
              <path
                d="M28 14V28"
                fill="none"
                stroke="#0B1D63"
                strokeWidth="7.5"
                strokeLinecap="round"
              />
              <path
                d="M10 30L27.5 48L53 20"
                fill="none"
                stroke="url(#lg)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="53" cy="20" r="4.5" fill="#10B981" />
            </svg>
            <div className="word">
              TrustValue<i>.ai</i>
            </div>
          </div>
          <button className="nav-cta" onClick={() => scrollTo("#join")}>
            Join the Founding Build
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="kicker">
              <span className="kicker-dot"></span> Building in public
            </div>
            <h1>Your experience should not disappear.</h1>
            <p className="hero-copy">
              TrustValue is being built so a genuine human experience can be
              expressed in <strong>seconds</strong>, stay attached to history, be
              shared with people who matter to you, and contribute to a measurable
              Trust Index.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
                fontSize: "11px",
                fontWeight: 800,
                color: "#07133B",
                background: "rgba(30, 80, 255, 0.07)",
                border: "1px solid rgba(30, 80, 255, 0.2)",
                borderRadius: "999px",
                padding: "8px 14px",
                letterSpacing: "0.06em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#1E50FF",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(30, 80, 255, 0.6)",
                }}
              ></span>
              MAIN WEBSITE LIVE · 25 NOVEMBER 2026
            </div>
            <div className="hero-actions">
              <button
                className="primary"
                onClick={() => scrollTo("#prototype")}
              >
                Try the 7-second experience
              </button>
              <button
                className="secondary"
                onClick={() => scrollTo("#constitution")}
              >
                See what we will never compromise
              </button>
            </div>
            <div className="hero-proof">
              <div className="proof">No paid influence</div>
              <div className="proof">No rating ownership by businesses</div>
              <div className="proof">No rewritten history</div>
            </div>
          </div>

          <div className="launch-card">
            <div className="launch-label">Two milestones. One TrustValue.</div>
            <h3>First public trust experiment</h3>
            <p>
              <strong style={{ color: "#fff" }}>09 September 2026</strong> — Apple
              Event 2026 becomes the first live experience room in this founding
              concept.
            </p>
            <div className="clock">
              <div>
                <b id="cdD">{cd.d}</b>
                <span>Days</span>
              </div>
              <div>
                <b id="cdH">{cd.h}</b>
                <span>Hours</span>
              </div>
              <div>
                <b id="cdM">{cd.m}</b>
                <span>Minutes</span>
              </div>
              <div>
                <b id="cdS">{cd.s}</b>
                <span>Seconds</span>
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "22px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                position: "relative",
                zIndex: 2,
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  fontSize: "9.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#7DD3FC",
                  fontWeight: 800,
                }}
              >
                Main TrustValue website goes live
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginTop: "8px",
                }}
              >
                25 November 2026
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94A3B8",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                Current founding target · full public website launch
              </div>

              <div className="clock" style={{ marginTop: "16px" }}>
                <div>
                  <b id="mainD">{mainCd.d}</b>
                  <span>Days</span>
                </div>
                <div>
                  <b id="mainH">{mainCd.h}</b>
                  <span>Hours</span>
                </div>
                <div>
                  <b id="mainM">{mainCd.m}</b>
                  <span>Minutes</span>
                </div>
                <div>
                  <b id="mainS">{mainCd.s}</b>
                  <span>Seconds</span>
                </div>
              </div>
            </div>

            <div className="build-note">
              09 Sep: first public experience experiment. 25 Nov: main TrustValue
              website launch.
            </div>
          </div>
        </div>
      </header>

      {/* Prototype Section */}
      <section className="section" id="prototype">
        <div className="shell">
          <div className="eyebrow">The TrustStar Prototype</div>
          <h2>One gesture. One truth. Then move on.</h2>
          <p className="lead">
            The core TrustValue action should feel closer to a reel interaction
            than a review website. Drag once, optionally tell us what shaped the
            experience, lock it, see the consequence, share it, and continue.
          </p>

          <div className="experience-wrap">
            <div className="exp-head">
              <div>
                <div className="exp-title">Apple Event 2026</div>
                <div className="exp-sub">
                  Founding demonstration · no live data · no rating is being
                  submitted
                </div>
              </div>
              <div className="live-pill">7-second model</div>
            </div>

            <div className="prototype">
              <div
                className={`stage ${
                  master === 1 ? "danger" : master === 5 ? "recommend" : ""
                }`}
                id="stage"
              >
                <div className="step">01 / 03 · Express</div>
                <div className="prompt">How did the experience feel?</div>
                <div className="prompt-sub">
                  Do not overthink it. Your first instinct is the master signal.
                  Everything else is optional.
                </div>

                <div className="truststar">
                  <div className="star-hero">
                    <div
                      className="big-star"
                      id="bigStar"
                      style={{ background: currentMeta.color }}
                    ></div>
                    <div>
                      <div className="star-state" id="starState">
                        {currentMeta.name}
                        <small id="starExplain">{currentMeta.explain}</small>
                      </div>
                    </div>
                  </div>

                  <input
                    className="scale"
                    id="masterScale"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={master}
                    aria-label="Master experience rating"
                    onChange={(e) => handleMasterChange(e.target.value)}
                  />
                  <div className="scale-labels">
                    <span className="left">Angry Star</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span className="right">Recommend</span>
                  </div>

                  <div className="influence">
                    <div className="influence-label">
                      What shaped this rating most?{" "}
                      <span style={{ fontWeight: 500, color: "#98A2B3" }}>
                        Optional · one tap
                      </span>
                    </div>
                    <div className="chips" id="chips">
                      {chipList.map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          className={`chip ${driver === ch ? "active" : ""}`}
                          onClick={() => handleChipClick(ch)}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="detail-toggle"
                    id="detailToggle"
                    onClick={() => setShowDetailPanel((prev) => !prev)}
                  >
                    Fine-tune the details
                  </button>

                  <div
                    className={`detail-panel ${showDetailPanel ? "show" : ""}`}
                    id="detailPanel"
                  >
                    {[
                      { key: "launches", label: "Launches" },
                      { key: "innovation", label: "Innovation" },
                      { key: "price", label: "Price relevance" },
                      { key: "presentation", label: "Presentation" },
                    ].map(({ key, label }) => (
                      <div key={key} className="detail-row" data-key={key}>
                        <label>{label}</label>
                        <div className="detail-stars">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button
                              key={i}
                              type="button"
                              className={`dstar ${
                                i <= details[key] ? "on" : ""
                              }`}
                              onClick={() => handleDetailStarClick(key, i)}
                            >
                              <i></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="submit-row">
                    <div className="time-note">
                      Designed for <b>5–10 seconds</b>
                    </div>
                    <button
                      type="button"
                      className={`lock-btn ${
                        master === 1 ? "danger" : master === 5 ? "good" : ""
                      }`}
                      id="lockBtn"
                      onClick={handleLockExperience}
                    >
                      Lock my experience
                    </button>
                  </div>
                </div>

                {/* Angry Bridge */}
                <div
                  className={`angry-bridge ${
                    lockedData.showAngryBridge ? "show" : ""
                  }`}
                  id="angryBridge"
                >
                  <h4>You gave an Angry Star.</h4>
                  <p>
                    Recording a bad experience is not enough. TrustValue is being
                    designed to give the customer a path to be heard without
                    giving the other side control over the rating.
                  </p>
                  <div className="bridge-actions">
                    <button
                      type="button"
                      className="help-btn"
                      id="helpBtn"
                      onClick={() => setShowBridgeFlow(true)}
                    >
                      I want this heard
                    </button>
                    <button
                      type="button"
                      className="record-btn"
                      id="recordBtn"
                      onClick={() => {
                        setShowBridgeFlow(false);
                        showToastNotification(
                          "Experience remains recorded in this prototype"
                        );
                      }}
                    >
                      Just record it
                    </button>
                  </div>
                  <div
                    className={`bridge-flow ${showBridgeFlow ? "show" : ""}`}
                    id="bridgeFlow"
                  >
                    <div className="flow-row">
                      <span className="flow-step">Angry Star</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step">TrustValue Record</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step">Resolution Request</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step">Response</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step">You Decide</span>
                    </div>
                    <div className="bridge-rule">
                      Nobody changes your Angry Star except you.
                    </div>
                  </div>
                </div>
              </div>

              {/* Result side */}
              <div className="result-side">
                {!locked && (
                  <div className="result-placeholder" id="placeholder">
                    <b>Your payoff appears here.</b>
                    Rate once. Then TrustValue shows what your experience means,
                    how it can be shared, and how repeated experiences can move
                    trust.
                  </div>
                )}

                <div
                  className={`result ${locked ? "show" : ""}`}
                  id="result"
                >
                  <div className="step">02 / 03 · Own & Share</div>
                  <div
                    className={`trustcard ${
                      lockedData.isBad ? "bad" : lockedData.isGood ? "good" : ""
                    }`}
                    id="trustcard"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="tc-kicker">My TrustCard</div>
                      <span style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: "0.1em", color: "#BAE6FD", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#38BDF8", display: "inline-block" }}></span>
                        VERIFIED EXPERIMENTAL
                      </span>
                    </div>
                    <div className="tc-name">Apple Event 2026</div>
                    <div className="tc-score">
                      <span id="tcScore">{lockedData.score}</span>
                      <small>/100</small>
                    </div>
                    <div className="tc-verdict" id="tcVerdict">
                      {lockedData.verdict}
                    </div>
                    <div className="tc-driver" id="tcDriver">
                      {lockedData.driver}
                    </div>
                    <div className="tc-line"></div>
                    <div className="tc-owner">
                      This card represents the customer&apos;s experience. It is
                      not an advertisement, endorsement or paid placement.
                    </div>
                    <div className="share-set">
                      <button
                        type="button"
                        className="share-native"
                        id="shareNative"
                        onClick={handleNativeShare}
                      >
                        Share to my circle
                      </button>
                      <button
                        type="button"
                        className="share-copy"
                        id="shareCopy"
                        onClick={handleCopyCard}
                      >
                        Copy TrustCard
                      </button>
                    </div>
                  </div>

                  <div className="impact-box">
                    <div className="step">03 / 03 · See the consequence</div>
                    <div className="impact-head">
                      <b>How collective experience can affect trust</b>
                      <span>
                        Illustrative model
                        <br />
                        not live Apple data
                      </span>
                    </div>

                    <div className="metric">
                      <div className="metric-block">
                        <small>Apple Event Trust</small>
                        <strong>84.60</strong>
                      </div>
                      <div className="metric-arrow">→</div>
                      <div className="metric-block right">
                        <small>After similar experiences</small>
                        <strong
                          id="eventAfter"
                          className={eventDeltaClass}
                        >
                          {eventAfter.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                    <div className="impact-bar">
                      <div
                        className={`impact-fill ${eventFillClass}`}
                        id="eventFill"
                        style={{ width: `${eventFillWidth}%` }}
                      ></div>
                    </div>

                    <div className="metric" style={{ marginTop: "18px" }}>
                      <div className="metric-block">
                        <small>Apple Trust Index</small>
                        <strong>91.20</strong>
                      </div>
                      <div className="metric-arrow">→</div>
                      <div className="metric-block right">
                        <small>Cumulative impact</small>
                        <strong
                          id="brandAfter"
                          className={brandDeltaClass}
                        >
                          {brandAfter.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    <div className="simulate">
                      <div className="sim-label">
                        <span>What if people experienced the same thing?</span>
                        <b id="simCount">
                          {n.toLocaleString()} similar{" "}
                          {n === 1 ? "experience" : "experiences"}
                        </b>
                      </div>
                      <input
                        className="sim-range"
                        id="simRange"
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={simIndex}
                        onChange={(e) => setSimIndex(Number(e.target.value))}
                      />
                      <div className="delta-note">
                        A single voice contributes. A repeated pattern moves
                        trust. When the experience score enters a low-trust zone,
                        the index turns red instead of hiding the deterioration.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="micro-why">
            <div className="micro-card">
              <div className="n">01 · SPEED</div>
              <h3>Voice first. Detail later.</h3>
              <p>
                People should not need to write a paragraph before their
                experience counts. One master signal is enough to start.
              </p>
            </div>
            <div className="micro-card">
              <div className="n">02 · SOCIAL</div>
              <h3>Your experience becomes shareable.</h3>
              <p>
                The TrustCard is designed to travel through a person&apos;s own
                circle without turning TrustValue into another
                attention-maximising social network.
              </p>
            </div>
            <div className="micro-card">
              <div className="n">03 · CONSEQUENCE</div>
              <h3>The payoff is visible immediately.</h3>
              <p>
                The customer sees how one experience contributes and how
                repeated experiences can materially strengthen or weaken
                collective trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Constitution Section */}
      <section className="section" id="constitution">
        <div className="shell constitution">
          <div className="eyebrow">The TrustValue Constitution</div>
          <h2>People share experiences. TrustValue measures trust.</h2>
          <div className="rules">
            <div className="rule">No one can buy a better Trust Index.</div>
            <div className="rule">
              No business can edit or delete your experience.
            </div>
            <div className="rule">
              Only the person who lived the experience can change the rating.
            </div>
            <div className="rule">
              Resolution can rebuild trust. It cannot rewrite history.
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="final" id="join">
        <div className="shell">
          <div className="eyebrow">Our North Star</div>
          <h2>Before you experience anything, check its TrustValue.</h2>
          <p>
            And after you&apos;ve experienced it, leave its TrustValue for the
            next person. That is how a Trust Index gets built — one genuine
            experience at a time.
          </p>
          <div className="email-box">
            <input
              id="email"
              type="email"
              placeholder="Enter your email for founding access"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
            />
            <button
              id="joinBtn"
              type="button"
              onClick={handleJoin}
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Joining..." : "Join the founding build"}
            </button>
          </div>
          <div className="join-msg" id="joinMsg">
            {joinMsg}
          </div>
        </div>
      </section>

      {/* Toast */}
      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        {toastMsg}
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="modal-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="modal-tag">
              {isNewMember ? "Early Access Reserved" : "Welcome Back"}
            </div>
            <h3 className="modal-heading">
              {isNewMember ? "You're in the Founding Build" : "Already in Founding Circle"}
            </h3>
            <p className="modal-body-text">
              {isNewMember
                ? "Thank you for standing for genuine human truth. Your place on our founding waitlist is secured — you will be first to test live experience rooms and access the Trust Index."
                : "You are already registered on our early access list. We have your spot locked and will notify you as new experience rooms open."}
            </p>
            <div className="modal-email-pill">
              <span></span>
              {modalEmail}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
