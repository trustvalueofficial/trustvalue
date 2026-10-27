"use client";

import { useCallback } from "react";

export function useAboutBoot() {
  return useCallback(bootAboutPage, []);
}

function bootAboutPage(root: HTMLElement) {
  if (!root) return;
  window.TV_RIG = {
    w: 365,
    h: 760,
    cut: 111,
    neck: 300,
    mouth: [
      { p0: [99.0, 198.5], p1: [185.5, 295.2], p2: [272.0, 197.5], w: 14.0 },
      { p0: [106.0, 246.4], p1: [184.0, 302.0], p2: [262.0, 247.6], w: 14.0 },
    ],
    orbs: [[76.9, 56.1], [293.8, 56.5]],
  };
  const RIG = window.TV_RIG;
  const KEY = "tv-about-quests-v1";
  const $ = (s: string, r?: ParentNode | null) => (r || root).querySelector(s);
  const qq = (s: string, r?: ParentNode | null) =>
    Array.prototype.slice.call((r || root).querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n: number, d: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const K: Record<number, number> = { 1: -0.85, 2: -0.42, 3: 0.05, 4: 1, 5: 1.32 };

  function mouthD(c: { p0: number[]; p1: number[]; p2: number[] }, k: number) {
    const my = (c.p0[1] + c.p2[1]) / 2;
    const qy = my + (c.p1[1] - my) * k;
    return `M${c.p0[0]} ${c.p0[1]}Q${c.p1[0]} ${qy.toFixed(1)} ${c.p2[0]} ${c.p2[1]}`;
  }

  function setMood(rig: HTMLElement | null, m: number) {
    if (!rig) return;
    const paths = qq(".rig__mouth path", rig) as SVGPathElement[];
    const k1 = K[m];
    const k0 = parseFloat(rig.dataset.k || "1");
    rig.dataset.mood = String(m);
    rig.dataset.k = String(k1);
    rig.style.animation = "none";
    void rig.offsetWidth;
    rig.style.animation = "";
    if (reduce) {
      paths.forEach((p, i) => p.setAttribute("d", mouthD(RIG.mouth[i], k1)));
      return;
    }
    const t0 = performance.now();
    (function step(t: number) {
      const u = Math.min(1, (t - t0) / 420);
      const e = 1 - Math.pow(1 - u, 3);
      const k = k0 + (k1 - k0) * e;
      paths.forEach((p, i) => p.setAttribute("d", mouthD(RIG.mouth[i], k)));
      if (u < 1) requestAnimationFrame(step);
    })(t0);
  }

  const Q: Record<number, string> = {
    1: "Make U angry",
    2: "Make U smile",
    3: "Play a story",
    4: "See the future",
    5: "Pick your side",
  };
  let done: Record<number, boolean> = {};
  try {
    done = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    done = {};
  }

  function count() {
    let n = 0;
    for (let i = 1; i <= 5; i++) if (done[i]) n++;
    return n;
  }

  function paintQuests(animate?: boolean) {
    const n = count();
    const xp = n * 100;
    const el = $("[data-xp]") as HTMLElement | null;
    if (el) el.textContent = fmt(xp, 0);
    qq(".seg").forEach((s: HTMLElement) => {
      const i = s.dataset.q;
      if (!i) return;
      s.classList.toggle("is-done", !!done[+i]);
      s.setAttribute(
        "aria-label",
        `Quest ${i}: ${Q[+i]}${done[+i] ? ", done" : ""}`,
      );
    });
    qq("[data-quest-count]").forEach((e: HTMLElement) => {
      e.textContent = String(n);
    });
    qq("[data-rank]").forEach((e: HTMLElement) => {
      e.textContent = n === 5 ? "Trust Insider" : `Quests ${n}/5`;
    });
    const qd = $(".quest-done");
    if (qd) qd.classList.toggle("is-win", n === 5);
    const qt = $("[data-quest-text]") as HTMLElement | null;
    if (qt) {
      qt.textContent =
        n === 5
          ? "All five quests done. You are a Trust Insider."
          : `Quests done: ${n} of 5. ${n ? "Keep going." : "Start with the Mood Lab."}`;
    }
    if (animate) {
      const b = $(".hud__xp");
      if (b) {
        b.classList.remove("is-bump");
        void (b as HTMLElement).offsetWidth;
        b.classList.add("is-bump");
      }
    }
  }

  function quest(i: number) {
    if (done[i]) return;
    done[i] = true;
    try {
      localStorage.setItem(KEY, JSON.stringify(done));
    } catch {
      /* ignore */
    }
    paintQuests(true);
    toast("+100 XP", `Quest done: ${Q[i]}`);
    if (count() === 5) {
      setTimeout(() => {
        toast("Badge unlocked", "Trust Insider", true);
        confetti();
      }, 600);
    }
  }

  qq('[data-quest="5"]').forEach((a: HTMLElement) => {
    a.addEventListener("click", () => quest(5));
  });

  function toast(big: string, small: string, badge?: boolean) {
    const box = $(".toasts");
    if (!box) return;
    const t = document.createElement("div");
    t.className = "toast" + (badge ? " toast--badge" : "");
    t.innerHTML =
      '<span class="coin" aria-hidden="true"></span><span><b></b> <span></span></span>';
    const title = $("b", t) as HTMLElement | null;
    const detail = $("span span", t) as HTMLElement | null;
    if (title) title.textContent = big;
    if (detail) detail.textContent = small;
    box.appendChild(t);
    while (box.children.length > 2) box.removeChild(box.firstChild!);
    setTimeout(() => {
      t.classList.add("is-out");
      setTimeout(() => {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 320);
    }, 2600);
  }

  function confetti() {
    if (reduce) return;
    const c = document.createElement("canvas");
    c.className = "confetti";
    document.body.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (c.width = innerWidth * dpr);
    const H = (c.height = innerHeight * dpr);
    const g = c.getContext("2d");
    if (!g) return;
    const cols = ["#FF5A0A", "#FFAA00", "#F12A0A", "#1240C8", "#0A8754"];
    const P: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      s: number;
      r: number;
      vr: number;
      c: string;
    }[] = [];
    for (let i = 0; i < 150; i++) {
      P.push({
        x: W / 2,
        y: H * 0.4,
        vx: (Math.random() - 0.5) * 16 * dpr,
        vy: (-4 - Math.random() * 13) * dpr,
        s: (5 + Math.random() * 6) * dpr,
        r: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.35,
        c: cols[i % 5],
      });
    }
    const t0 = performance.now();
    (function f(t: number) {
      const k = (t - t0) / 1800;
      g.clearRect(0, 0, W, H);
      P.forEach((p) => {
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
      if (k < 1) requestAnimationFrame(f);
      else c.remove();
    })(t0);
  }

  const SIM = { n24: 412, avg24: 4.21, n30: 38, avg30: 4.05, index: 1042.6, ones90: 9, n90: 104 };
  const NAME: Record<number, string> = {
    1: "Angry Star",
    2: "Let down",
    3: "Mixed",
    4: "Good",
    5: "Recommend",
  };
  const SAY: Record<number, string> = {
    1: "Ouch, an Angry Star! Tell them what went wrong.",
    2: "Let down. Honest beats polite, every time.",
    3: "Mixed? Useful too. It shows what to check.",
    4: "Good! Solid ratings help good stuff get found.",
    5: "Recommend! You just lifted the index.",
  };

  const labRig = $("#lab .rig") as HTMLElement | null;
  const say = $("#lab-say") as HTMLElement | null;
  let picked: number | null = null;
  const labFootEl = $("#lab-foot") as HTMLElement | null;
  const FOOT = labFootEl ? labFootEl.textContent : "";

  function simulate(r: number) {
    const tv = (SIM.n24 * SIM.avg24 + r) / (SIM.n24 + 1);
    const r30 = (SIM.n30 * SIM.avg30 + r) / (SIM.n30 + 1);
    const idx = SIM.index * r30 / SIM.avg30;
    const d = idx - SIM.index;
    return {
      tv,
      idx,
      d,
      share: ((SIM.ones90 + (r === 1 ? 1 : 0)) / (SIM.n90 + 1)) * 100,
    };
  }

  function showLab(r: number, commit?: boolean) {
    setMood(labRig, r);
    if (say) {
      say.textContent = SAY[r];
      say.classList.remove("is-new");
      void say.offsetWidth;
      say.classList.add("is-new");
    }
    if (!commit) return;
    picked = r;
    const s = simulate(r);
    const up = s.d >= 0;
    const labTv = $("#lab-tv") as HTMLElement | null;
    if (labTv) labTv.textContent = fmt(s.tv, 1);
    const dt = s.tv - SIM.avg24;
    const labTvD = $("#lab-tv-d") as HTMLElement | null;
    if (labTvD) {
      labTvD.textContent =
        `${SIM.n24 + 1} ratings · ${dt >= 0 ? "▲ +" : "▼ −"}${Math.abs(dt).toFixed(3)}`;
    }
    const labIdx = $("#lab-idx") as HTMLElement | null;
    if (labIdx) labIdx.textContent = fmt(s.idx, 1);
    const dl = $("#lab-idx-d") as HTMLElement | null;
    if (dl) {
      dl.textContent = `${up ? "▲ +" : "▼ −"}${fmt(Math.abs(s.d), 1)} today`;
      dl.className = "delta " + (up ? "up" : "down");
    }
    const ft = $("#lab-foot") as HTMLElement | null;
    if (ft) {
      ft.classList.toggle("is-alert", r === 1);
      ft.textContent =
        r === 1
          ? `1-star share in the last 90 days: 8.7% → ${fmt(s.share, 1)}%. At 10%, the page shows a Trust Alert.`
          : FOOT;
    }
    qq(".mb").forEach((b: HTMLElement) => {
      b.setAttribute("aria-pressed", String(+b.dataset.r! === r));
    });
    const labLive = $("#lab-live") as HTMLElement | null;
    if (labLive) {
      labLive.textContent = `You picked ${NAME[r]}. TrustValue ${fmt(s.tv, 1)}, Trust Index ${fmt(s.idx, 1)}.`;
    }
    plotYou(s.idx);
    if (r === 1) quest(1);
    if (r === 5) quest(2);
  }

  qq(".mb").forEach((b: HTMLElement) => {
    const r = +b.dataset.r!;
    b.addEventListener("click", () => showLab(r, true));
    b.addEventListener("mouseenter", () => {
      if (picked !== r) setMood(labRig, r);
    });
    b.addEventListener("mouseleave", () => setMood(labRig, picked || 4));
  });

  function plotYou(v: number) {
    qq("[data-v1]").forEach((ch: HTMLElement) => {
      const g = ch.dataset;
      const pct = (x: number) => ((+g.v1! - x) / (+g.v1! - +g.v0!)) * 100;
      const y = pct(v);
      const ny = pct(SIM.index);
      const you = $(".pin--you", ch) as HTMLElement | null;
      const ln = $(".you-line", ch) as HTMLElement | null;
      const tx = $(".you-tx", ch) as HTMLElement | null;
      const nt = $(".now-tx", ch) as HTMLElement | null;
      if (!you || !ln) return;
      you.style.top = y.toFixed(2) + "%";
      you.hidden = false;
      you.style.animation = "none";
      void you.offsetWidth;
      you.style.animation = "";
      ln.style.top = Math.min(y, ny).toFixed(2) + "%";
      ln.style.height = Math.abs(y - ny).toFixed(2) + "%";
      ln.hidden = false;
      if (tx) {
        tx.style.top = y.toFixed(2) + "%";
        tx.textContent = `After your rating: ${fmt(v, 1)}`;
        tx.hidden = false;
      }
      if (nt) nt.hidden = true;
    });
    const chartSay = $("#chart-say") as HTMLElement | null;
    if (chartSay) {
      chartSay.textContent = `Your simulated rating moved today's index from 1,042.6 to ${fmt(v, 1)}. Real indices move only with real, verified ratings.`;
    }
  }

  qq(".mood").forEach((m: HTMLElement) => {
    m.addEventListener("click", () => {
      const rig = $(".rig", m) as HTMLElement | null;
      if (rig) setMood(rig, +rig.dataset.mood!);
    });
  });

  qq(".story").forEach((st: HTMLElement) => {
    const btn = $(".play", st) as HTMLButtonElement | null;
    const steps = qq(".chap li", st) as HTMLElement[];
    const rig = $(".rig", st) as HTMLElement | null;
    const moods = (st.dataset.moods || "").split(",");
    if (!btn) return;
    btn.addEventListener("click", () => {
      btn.disabled = true;
      steps.forEach((s) => s.classList.remove("is-on"));
      steps.forEach((s, i) => {
        setTimeout(
          () => {
            steps.forEach((o) => o.classList.toggle("is-on", o === s));
            if (rig && moods[i]) setMood(rig, +moods[i]);
            if (i === steps.length - 1) {
              btn.disabled = false;
              const span = $("span", btn) as HTMLElement | null;
              if (span) span.textContent = "Play again";
              quest(3);
            }
          },
          reduce ? 0 : i * 1300,
        );
      });
    });
  });

  const ff = $("#ff") as HTMLButtonElement | null;
  if (ff) {
    ff.addEventListener("click", () => {
      const stops = qq(".stop") as HTMLElement[];
      const fill = $(".road__fill") as HTMLElement | null;
      ff.disabled = true;
      stops.forEach((s, i) => {
        setTimeout(
          () => {
            s.classList.add("is-on");
            if (fill) fill.style.width = `${(i / (stops.length - 1)) * 100}%`;
            if (i === stops.length - 1) {
              ff.disabled = false;
              quest(4);
            }
          },
          reduce ? 0 : i * 700,
        );
      });
    });
  }

  const sh = $("#share") as HTMLButtonElement | null;
  const shareUrl = window.location.origin + "/about";

  function showLink() {
    const f = $("#share-fallback") as HTMLElement | null;
    const i = $("#share-url") as HTMLInputElement | null;
    if (!f || !i) return;
    f.hidden = false;
    i.focus();
    i.select();
  }

  function copyLink() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => toast("Link copied", "Send it to a friend"),
        showLink,
      );
    } else showLink();
  }

  if (sh) {
    sh.addEventListener("click", () => {
      const data = {
        title: "TrustValue.ai",
        text: "The trust score for everything you buy. Rate with proof and see what you move.",
        url: shareUrl,
      };
      if (navigator.share) {
        try {
          navigator.share(data).catch((e) => {
            if (!e || e.name !== "AbortError") copyLink();
          });
        } catch {
          copyLink();
        }
      } else copyLink();
    });
  }

  paintQuests(false);
  if (labRig) setMood(labRig, 4);
}

declare global {
  interface Window {
    TV_RIG?: {
      w: number;
      h: number;
      cut: number;
      neck: number;
      mouth: { p0: number[]; p1: number[]; p2: number[]; w: number }[];
      orbs: number[][];
    };
  }
}
