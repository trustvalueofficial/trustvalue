"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 198;
const LERP_FACTOR = 0.10;

function padNum(n) {
  return String(n).padStart(3, "0");
}

function smoothStep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ─── Countdown Hook ───────────────────────────────────────────
function useCountdown() {
  const [days, setDays] = useState("90");
  const [hms, setHms] = useState("00 : 00 : 00");

  useEffect(() => {
    const KEY = "wip_target_date";
    let target;
    const stored = localStorage.getItem(KEY);

    if (stored) {
      target = new Date(stored);
      if (isNaN(target.getTime()) || target.getTime() <= Date.now()) {
        target = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        localStorage.setItem(KEY, target.toISOString());
      }
    } else {
      target = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      localStorage.setItem(KEY, target.toISOString());
    }

    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now());
      const totalSec = Math.floor(diff / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setDays(String(d));
      setHms(
        String(h).padStart(2, "0") +
        " : " +
        String(m).padStart(2, "0") +
        " : " +
        String(s).padStart(2, "0")
      );
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return { days, hms };
}

// ─── Particle System Hook ─────────────────────────────────────
function useParticles(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const COUNT = 24;
    const particles = [];

    function makeShape() {
      const el = document.createElement("div");
      el.classList.add("particle");
      const isLeaf = Math.random() > 0.4;
      const size = 6 + Math.random() * 16;
      if (isLeaf) {
        el.style.width = size + "px";
        el.style.height = size * 1.7 + "px";
        el.style.borderRadius = "65% 2% 65% 2%";
        const hue = 25 + Math.random() * 32;
        el.style.background = `hsla(${hue}, 55%, 45%, 0.45)`;
      } else {
        el.style.width = size + "px";
        el.style.height = size * 1.3 + "px";
        el.style.borderRadius = "3px";
        el.style.background = `rgba(240, 230, 210, ${0.08 + Math.random() * 0.12})`;
      }
      container.appendChild(el);
      return el;
    }

    for (let i = 0; i < COUNT; i++) {
      const el = makeShape();
      particles.push({
        el,
        x: Math.random() * window.innerWidth,
        y: -30 - Math.random() * window.innerHeight,
        vx: 0.2 + Math.random() * 0.5,
        vy: 0.18 + Math.random() * 0.45,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.2,
        wobbleAmp: 14 + Math.random() * 28,
        wobbleFreq: 0.004 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }

    let frame = 0;
    let animId;

    function animateParticles() {
      frame++;
      const W = window.innerWidth;
      const H = window.innerHeight;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        const wobble =
          Math.sin(frame * p.wobbleFreq + p.phase) * p.wobbleAmp;
        if (p.x > W + 50) {
          p.x = -40;
          p.y = Math.random() * H;
        }
        if (p.y > H + 50) {
          p.y = -40;
          p.x = Math.random() * W;
        }
        p.el.style.transform = `translate(${p.x + wobble}px, ${p.y}px) rotate(${p.rot}deg)`;
        p.el.style.opacity = p.opacity;
      }
      animId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    return () => {
      cancelAnimationFrame(animId);
      particles.forEach((p) => p.el.remove());
    };
  }, [containerRef]);
}

// ─── Main Page Component ──────────────────────────────────────
export default function HomePage() {
  const { days, hms } = useCountdown();

  // Refs
  const canvasRef = useRef(null);
  const wipTextRef = useRef(null);
  const wipWRef = useRef(null);
  const wipIRef = useRef(null);
  const wipPRef = useRef(null);
  const progressBarRef = useRef(null);
  const frameCounterRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  const loaderTextRef = useRef(null);
  const particlesLayerRef = useRef(null);

  // Loading state
  const [loadingPct, setLoadingPct] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use particles
  useParticles(particlesLayerRef);

  // ─── Frame Engine + Scroll + WIP Text positioning ──────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    const framesArr = [];
    let loadedCount = 0;
    let isReady = false;

    // Physics / Lerp state
    let targetFraction = 0;
    let smoothFraction = 0;
    let currentRenderedIndex = -1;
    let lastProgress = 0;

    // ── WIP text sizing ──
    function sizeWipText() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const base = Math.min(w * 0.15, h * 0.14);
      if (wipWRef.current) wipWRef.current.style.fontSize = base + "px";
      if (wipIRef.current) wipIRef.current.style.fontSize = base * 0.86 + "px";
      if (wipPRef.current) wipPRef.current.style.fontSize = base * 0.7 + "px";
      updateWipTextPosition(lastProgress);
    }

    function updateWipTextPosition(progress) {
      lastProgress = progress;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = wipTextRef.current;
      if (!el) return;

      const tw = el.offsetWidth;
      const th = el.offsetHeight;

      // Position 1 (Upper-left, beside countdown timer)
      const x1 = Math.max(185, vw * 0.14);
      const y1 = Math.max(28, vh * 0.08);

      // Position 2 (Bottom-right quadrant)
      const x2 = Math.max(20, vw - tw - Math.max(35, vw * 0.05));
      const y2 = Math.max(20, vh - th - Math.max(45, vh * 0.08));

      const curX = x1 + (x2 - x1) * progress;
      const curY = y1 + (y2 - y1) * progress;

      el.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    }

    // ── Canvas sizing ──
    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(viewportW * dpr);
      canvas.height = Math.round(viewportH * dpr);
      canvas.style.width = viewportW + "px";
      canvas.style.height = viewportH + "px";

      if (currentRenderedIndex >= 0) {
        const idx = currentRenderedIndex;
        currentRenderedIndex = -1;
        drawFrame(idx);
      }
    }

    // ── Draw frame ──
    function drawFrame(index) {
      if (index === currentRenderedIndex) return;
      currentRenderedIndex = index;

      const img = framesArr[index];
      if (!img || !img.complete || !img.naturalWidth) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Object-fit: cover sizing
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) * 0.5;
      const sy = (ch - sh) * 0.5;

      ctx.drawImage(img, sx, sy, sw, sh);

      // Update HUD elements
      if (frameCounterRef.current) {
        frameCounterRef.current.textContent = `${padNum(index + 1)} / ${padNum(TOTAL_FRAMES)}`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(index / (TOTAL_FRAMES - 1)) * 100}%`;
      }
    }

    // ── Scroll position ──
    function updateScrollTarget() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));

      if (scrollIndicatorRef.current) {
        if (scrollTop > 40) {
          scrollIndicatorRef.current.classList.add("hidden");
        } else {
          scrollIndicatorRef.current.classList.remove("hidden");
        }
      }
    }

    // ── All frames ready ──
    function onAllFramesReady() {
      isReady = true;
      const overlay = loadingOverlayRef.current;
      if (overlay) {
        overlay.classList.add("hidden");
        setTimeout(() => {
          if (overlay.parentNode) overlay.remove();
        }, 800);
      }
      setIsLoaded(true);
      resizeCanvas();
      updateScrollTarget();
      smoothFraction = targetFraction;
      drawFrame(Math.round(smoothFraction * (TOTAL_FRAMES - 1)));
      startAnimationLoop();
    }

    // ── Load frames ──
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/cat/frame_${padNum(i)}.jpg`;
      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadingPct(pct);
        if (loaderTextRef.current) {
          loaderTextRef.current.textContent = `Loading Website… ${pct}%`;
        }
        if (loadedCount === TOTAL_FRAMES) {
          onAllFramesReady();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          onAllFramesReady();
        }
      };
      framesArr.push(img);
    }

    // ── Animation loop ──
    let animId;

    function startAnimationLoop() {
      function render() {
        if (isReady) {
          const diff = targetFraction - smoothFraction;
          if (Math.abs(diff) > 0.0001) {
            smoothFraction += diff * LERP_FACTOR;
          } else {
            smoothFraction = targetFraction;
          }

          const currentFrameFloat = smoothFraction * (TOTAL_FRAMES - 1);
          const targetFrame = Math.round(currentFrameFloat);
          drawFrame(targetFrame);

          // WIP text transition from upper-left (frame 1..40) to bottom-right by frame 110
          const textTransitionProgress = smoothStep(40, 110, currentFrameFloat);
          updateWipTextPosition(textTransitionProgress);
        }
        animId = requestAnimationFrame(render);
      }
      animId = requestAnimationFrame(render);
    }

    // ── Event listeners ──
    function handleResize() {
      sizeWipText();
      resizeCanvas();
    }

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial sizing
    sizeWipText();

    return () => {
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Viewport with Fullscreen Canvas & Overlays */}
      <div id="viewport">
        {/* Fullscreen Cat Canvas */}
        <div id="cat-canvas-container">
          <canvas id="cat-canvas" ref={canvasRef} />
        </div>

        {/* Ambient Light / Vignette / Contrast Overlay */}
        <div id="ambient-overlay" />

        {/* "WORK IN PROGRESS" Text Layer with Drop Shadow */}
        <div id="text-section">
          <div id="wip-text" ref={wipTextRef}>
            <span id="wip-w" ref={wipWRef} data-text="WORK">
              WORK
            </span>
            <span id="wip-i" ref={wipIRef} data-text="IN">
              IN
            </span>
            <span id="wip-p" ref={wipPRef} data-text="PROGRESS">
              PROGRESS
            </span>
          </div>
        </div>
      </div>

      {/* Floating Atmospheric Particles */}
      <div id="particles-layer" ref={particlesLayerRef} />

      {/* Progress Bar */}
      <div id="progress-bar" ref={progressBarRef} />

      {/* Countdown Overlay */}
      <div id="countdown-overlay">
        <div className="days-label">Days remaining</div>
        <div className="days-num" id="cd-days">
          {days}
        </div>
        <div className="hms" id="cd-hms">
          {hms}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div id="scroll-indicator" ref={scrollIndicatorRef}>
        <div className="scroll-pill">
          <div className="scroll-dot" />
          <span className="scroll-text">Scroll to animate</span>
        </div>
      </div>

      {/* Frame Counter */}
      <div id="frame-counter" ref={frameCounterRef}>
        001 / 198
      </div>

      {/* Loading Screen */}
      <div id="loading-overlay" ref={loadingOverlayRef}>
        <div className="loader-spinner" />
        <div className="loader-text" ref={loaderTextRef}>
          website is Loading … 0%
        </div>
      </div>
    </>
  );
}
