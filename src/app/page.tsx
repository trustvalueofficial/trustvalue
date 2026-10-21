// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./home.css";
import {
  TV_SECTORS,
  TV_BRANDS,
  RAW_PRODUCTS_STRING,
  SUBJECTS_CONFIG,
  SECTORS_SHOWCASE
} from "@/lib/data/universalData";

export default function HomePage() {
  const [nudgeOpen, setNudgeOpen] = useState(true);
  const [mobileStatusOpen, setMobileStatusOpen] = useState(false);
  const [pledgeSector, setPledgeSector] = useState("Hospitals & Healthcare Chains");
  const [pledgeEmail, setPledgeEmail] = useState("");
  const [pledgeDone, setPledgeDone] = useState(false);
  const [inTopSections, setInTopSections] = useState(true);

  useEffect(() => {
    // Only show rating button in sections 1 & 2 (Hero and Sectors showcase)
    const handleScrollSections = () => {
      const sectorsEl = document.getElementById("sectors");
      if (sectorsEl) {
        const rect = sectorsEl.getBoundingClientRect();
        // Visible while in section 1 & 2, disappears when scrolled past section 2
        setInTopSections(rect.bottom > 80);
      } else {
        setInTopSections(window.scrollY < 1200);
      }
    };
    window.addEventListener("scroll", handleScrollSections, { passive: true });
    handleScrollSections();
    return () => window.removeEventListener("scroll", handleScrollSections);
  }, []);

  useEffect(() => {
    // Mobile FAB scroll visibility
    const fb = document.getElementById("fab");
    const onFabScroll = () => {
      if (!fb) return;
      if (window.scrollY > 400) {
        fb.classList.add("is-on");
      } else {
        fb.classList.remove("is-on");
      }
    };
    window.addEventListener("scroll", onFabScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onFabScroll);
    };
  }, []);
  useEffect(() => {
    const d = document, root = d.documentElement;
    const $ = (s, c) => (c || d).querySelector(s);
    const $$ = (s, c) => Array.prototype.slice.call((c || d).querySelectorAll(s));
    const reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    // Toast Notification
    const toastEl = $("#toast");
    let toastT;
    function toast(msg) {
      if (!toastEl) return;
      toastEl.textContent = msg;
      toastEl.classList.add("is-on");
      clearTimeout(toastT);
      toastT = setTimeout(() => toastEl.classList.remove("is-on"), 3400);
    }

    // Lead capture system
    window.tvCtx = window.tvCtx || {};
    function lf(el) {
      const src = el.dataset.lf;
      const ph = el.dataset.ph || "Email or WhatsApp number";
      const n = el.dataset.note || "No spam. One message when it matters. Unsubscribe any time.";
      el.innerHTML = `<form class="lf" novalidate>
        <div class="lf__row">
          <label class="sr-only" for="lf-${src}">${ph}</label>
          <input type="text" id="lf-${src}" name="contact" placeholder="${ph}" autocomplete="email" required />
          <button class="btn btn--signal" type="submit">${el.dataset.cta}</button>
        </div>
        <small>${n}</small>
      </form>`;

      $("form", el).addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target;
        const v = f.contact.value.trim();
        if (!/^\S+@\S+\.\S+$/.test(v) && !/^[+\d][\d\s-]{8,}$/.test(v)) {
          f.contact.setAttribute("aria-invalid", "true");
          f.contact.focus();
          return;
        }
        const data = { contact: v, source: src, context: window.tvCtx[src] || "", at: new Date().toISOString() };
        if (src === "founder") {
          const b = $("#fd-who [aria-checked=true]");
          data.context = b ? b.dataset.v : "";
        }
        try {
          const q = JSON.parse(localStorage.getItem("tv-leads") || "[]");
          q.push(data);
          localStorage.setItem("tv-leads", JSON.stringify(q));
        } catch (x) {}
        try {
          fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), keepalive: true }).catch(() => {});
        } catch (x) {}

        const ok = {
          founder: "You are on the Founding list. We will confirm your seat number when the index opens.",
          "duel-compare": "Done. We will send the comparison when either brand publishes a score.",
          "sector-notify": "Noted. We will message you the day that sector opens."
        }[src] || "Done. We will message you when it matters.";
        f.outerHTML = `<p class="lf__ok"><svg aria-hidden="true"><use href="#i-check"/></svg><span>${ok}</span></p>`;
      });
    }
    $$("[data-lf]").forEach(lf);

    // Sectors & Brands Data Processing
    const S = TV_SECTORS;
    const B = TV_BRANDS;
    const needs = [];
    S.forEach((s) => { if (needs.indexOf(s[1]) < 0) needs.push(s[1]); });
    const ORD = { 1: "first", 2: "second", 3: "third", 4: "fourth" };
    let cur = "all", need = "All", q = "", open = false;
    const LIM = 12;
    let mode = "b";

    const PR = RAW_PRODUCTS_STRING.split(";").map((x) => {
      const p = x.split("|");
      const sl = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      p.push("/product/" + sl(p[1]) + "/" + sl(p[2]) + "/");
      return p;
    });

    const nc = $("#need-chips");
    const sg = $("#sector-grid");
    const bc = $("#brand-chips");
    const bp = $("#brand-plates");
    const totalBrands = S.reduce((a, s) => a + B[s[0]].length, 0);

    function chips(el, items, sel, key) {
      if (!el) return;
      el.innerHTML = items.map((it) => `<button class="chip" type="button" data-${key}="${esc(it[0])}" aria-pressed="${it[0] === sel}">${esc(it[1])}</button>`).join("");
    }

    function drawSectors() {
      if (!nc || !sg) return;
      chips(nc, [["All", "All sectors"]].concat(needs.map((n) => [n, n])), need, "need");
      sg.innerHTML = S.filter((s) => need === "All" || s[1] === need).map((s) => {
        const st = s[4] ? "Opens " + ORD[s[4]] : "Planned";
        return `<li><button class="sec" type="button" data-sec="${s[0]}" aria-pressed="${cur === s[0]}"><span class="sec__need">${esc(s[1])}</span><h3>${esc(s[2])}</h3><p>${esc(s[3])}</p><span class="sec__st${s[4] ? " is-first" : ""}"><i></i>${st} · ${B[s[0]].length} brands</span></button></li>`;
      }).join("");
    }

    function mono(n) {
      const w = n.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean);
      return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
    }

    function items() {
      const out = [];
      if (cur === "all") {
        for (let r = 0; r < 15; r++) {
          S.forEach((s) => {
            const b = B[s[0]][r];
            if (b) out.push({ s, b });
          });
        }
      } else {
        (B[cur] || []).forEach((b) => out.push({ s: S[+cur], b }));
      }
      if (q) {
        return out.filter((o) => (o.b[0] + " " + o.b[1] + " " + o.s[2]).toLowerCase().indexOf(q) >= 0);
      }
      return out;
    }

    function pitems() {
      const g = {};
      PR.forEach((p) => {
        if (cur === "all" || p[0] === cur) (g[p[0]] = g[p[0]] || []).push(p);
      });
      const out = [];
      let r = 0, more = true;
      while (more) {
        more = false;
        S.forEach((s) => {
          const p = (g[s[0]] || [])[r];
          if (p) { out.push(p); more = true; }
        });
        r++;
      }
      if (q) {
        return out.filter((p) => (p[1] + " " + p[2] + " " + p[3] + " " + S[+p[0]][2]).toLowerCase().indexOf(q) >= 0);
      }
      return out;
    }

    function drawProducts() {
      if (!bc || !bp) return;
      chips(bc, [["all", "All sectors"]].concat(S.map((s) => [s[0], s[2]])), cur, "bs");
      const l = pitems();
      const shown = open || q ? l : l.slice(0, LIM);
      bp.innerHTML = shown.length ? shown.map((p) => `<li><a class="plate" href="${p[4]}" title="${esc(p[1] + " " + p[2])}"><span class="plate__reg">${esc(mono(p[2]))}</span><span><span class="plate__name">${esc(p[2])}</span><span class="plate__sub">${esc(p[1])} · ${esc(p[3])}</span></span><span class="plate__state">Early signals</span></a></li>`).join("") : '<li><p class="search__empty">Products for this sector are being added. Switch to Brands to rate the brand now.</p></li>';
      const w = $("#brand-more-wrap");
      if (w) w.hidden = open || !!q || l.length <= LIM;
      const bm = $("#brand-more");
      if (bm) bm.textContent = "Show all " + l.length + " products";
      const bcCount = $("#brand-count");
      if (bcCount) bcCount.textContent = cur === "all" ? PR.length + " products listed so far" : l.length + " products in " + S[+cur][2];
    }

    function drawBrands() {
      if (mode === "p") return drawProducts();
      if (!bc || !bp) return;
      chips(bc, [["all", "All sectors"]].concat(S.map((s) => [s[0], s[2]])), cur, "bs");
      const l = items();
      const shown = open || q ? l : l.slice(0, LIM);
      bp.innerHTML = shown.length ? shown.map((o) => `<li><a class="plate" href="/brand/${o.b[2]}/" title="${esc(o.b[0])}"><span class="plate__reg">${esc(mono(o.b[0]))}</span><span><span class="plate__name">${esc(o.b[0])}</span><span class="plate__sub">${esc(o.b[1])}${cur === "all" ? " · " + esc(o.s[2]) : ""}</span></span><span class="plate__state">Early signals</span></a></li>`).join("") : '<li><p class="search__empty">No brand matches that. <a href="/brands/">Suggest it for the index</a>.</p></li>';
      const w = $("#brand-more-wrap");
      if (w) w.hidden = open || !!q || l.length <= LIM;
      const bm = $("#brand-more");
      if (bm) bm.textContent = "Show all " + l.length + " brands";
      const bcCount = $("#brand-count");
      if (bcCount) bcCount.textContent = cur === "all" ? totalBrands + " brands across 18 sectors" : (B[cur]?.length || 0) + " brands in " + S[+cur][2];
    }

    function pick(id) {
      cur = id; open = false; q = "";
      const bq = $("#brand-q");
      if (bq) bq.value = "";
      if (id !== "all") {
        window.tvCtx["sector-notify"] = S[+id][2];
        if (need !== "All" && S[+id][1] !== need) need = "All";
      }
      drawSectors();
      drawBrands();
    }

    if (nc && sg && bc && bp) {
      drawSectors();
      drawBrands();
      nc.addEventListener("click", (e) => {
        const b = e.target.closest("[data-need]");
        if (b) { need = b.dataset.need; drawSectors(); }
      });
      sg.addEventListener("click", (e) => {
        const b = e.target.closest("[data-sec]");
        if (!b) return;
        pick(b.dataset.sec);
        const secBrands = $("#brands");
        if (secBrands) secBrands.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      bc.addEventListener("click", (e) => {
        const b = e.target.closest("[data-bs]");
        if (b) pick(b.dataset.bs);
      });
      const bm = $("#brand-more");
      if (bm) bm.addEventListener("click", () => { open = true; drawBrands(); });
      const bq = $("#brand-q");
      if (bq) bq.addEventListener("input", (e) => { q = e.target.value.trim().toLowerCase(); drawBrands(); });
      $$("#brand-mode button").forEach((b) => {
        b.addEventListener("click", () => {
          mode = b.dataset.mode;
          open = false;
          $$("#brand-mode button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
          const bqInput = $("#brand-q");
          if (bqInput) bqInput.placeholder = mode === "p" ? "Filter products in this view" : "Filter brands in this view";
          drawBrands();
        });
      });
      d.addEventListener("click", (e) => {
        const a = e.target.closest("[data-pick]");
        if (a) pick(a.getAttribute("data-pick"));
      });
    }

    // Compare Duel
    const ds = $("#duel-sector"), da = $("#duel-a"), db = $("#duel-b"), dt = $("#duel-body");
    const DIM = [
      ["Angry Star rate", "Share of ratings where trust broke"],
      ["Delivered as promised", "Did it match what was sold"],
      ["Honest about price and charges", "Fees, terms and fine print"],
      ["Service and resolution", "How problems were handled"]
    ];
    function drawDuel() {
      if (!ds || !da || !db || !dt) return;
      const l = B[ds.value] || [];
      const A = l[da.value] || l[0];
      const C = l[db.value] || l[1] || A;
      if (!A || !C) return;
      const h1 = $("#duel-h1"), h2 = $("#duel-h2");
      if (h1) h1.textContent = A[0];
      if (h2) h2.textContent = C[0];
      const cell = '<td><span class="pill">Early signals</span> <span class="first__n">0 of 10</span></td>';
      dt.innerHTML = DIM.map((dm) => `<tr><td><strong>${dm[0]}</strong><br><small>${dm[1]}</small></td>${cell}${cell}</tr>`).join("");
      window.tvCtx["duel-compare"] = A[0] + " vs " + C[0];
    }
    function fillDuel() {
      if (!ds || !da || !db) return;
      const o = (B[ds.value] || []).map((b, i) => `<option value="${i}">${esc(b[0])}</option>`).join("");
      da.innerHTML = o;
      db.innerHTML = o;
      db.selectedIndex = 1;
      drawDuel();
    }
    if (ds && da && db && dt) {
      ds.innerHTML = S.map((s) => `<option value="${s[0]}"${s[0] === "1" ? " selected" : ""}>${esc(s[2])}</option>`).join("");
      ds.addEventListener("change", fillDuel);
      da.addEventListener("change", drawDuel);
      db.addEventListener("change", drawDuel);
      fillDuel();
    }

    // Founders Section Seats
    const seats = $("#seats");
    if (seats && seats.children.length === 0) {
      for (let i = 0; i < 100; i++) seats.appendChild(d.createElement("i"));
    }
    $$("#fd-who button").forEach((b) => {
      b.onclick = () => {
        $$("#fd-who button").forEach((x) => { x.setAttribute("aria-checked", "false"); x.tabIndex = -1; });
        b.setAttribute("aria-checked", "true");
        b.tabIndex = 0;
      };
    });

    // Exit Intent & Scroll Nudge
    const nd = $("#nudge");
    let nudgeShown = false;
    try { nudgeShown = !!sessionStorage.getItem("tv-nudge"); } catch (e) {}
    function showNudge() {
      if (nudgeShown || !nd) return;
      if (location.hash === "#founders") return;
      nudgeShown = true;
      nd.hidden = false;
      try { sessionStorage.setItem("tv-nudge", "1"); } catch (e) {}
    }
    window.addEventListener("scroll", () => {
      const f = $("#founders");
      if (f && scrollY > (d.body.scrollHeight - innerHeight) * 0.45 && f.getBoundingClientRect().top > innerHeight) {
        showNudge();
      }
    }, { passive: true });
    d.addEventListener("mouseleave", (e) => { if (e.clientY <= 0) showNudge(); });
    const nx = $("#nudge-x"), ng = $("#nudge-go");
    if (nx) nx.onclick = () => { nd.hidden = true; };
    if (ng) ng.onclick = () => { nd.hidden = true; };

    // Floating Action Button (#fab) observer
    const fab = $("#fab"), hero = $(".hero"), demo = $("#instrument");
    const foot = $("#ftr") || $(".footer");
    if (fab && hero && "IntersectionObserver" in window) {
      let pastHero = false, atFoot = false, inDemo = false;
      function syncFab() { fab.classList.toggle("is-on", pastHero && !atFoot && !inDemo); }
      new IntersectionObserver((es) => { pastHero = !es[0].isIntersecting; syncFab(); }).observe(hero);
      if (foot) new IntersectionObserver((es) => { atFoot = es[0].isIntersecting; syncFab(); }).observe(foot);
      if (demo) new IntersectionObserver((es) => { inDemo = es[0].isIntersecting; syncFab(); }).observe(demo);
    }

    // Hero Search Form
    (function initSearch() {
      const form = $("#search"), input = $("#q"), panel = $("#q-panel"), list = $("#q-list"), empty = $("#q-empty");
      if (!form || !input) return;
      let index = [];
      try { index = JSON.parse($("#tv-index").textContent); } catch (e) {}
      const KIND = { b: "Brand", p: "Product", c: "Category", g: "Guide" };
      let shownItems = [], active = -1;
      const FIRST = ["Search a brand, product or category", "Search a brand or product", "Search a brand", "Search"];
      const ROTATE = ["Search “Jio”", "Search “home loan”", "Search a hospital by name", "Search “Maruti Suzuki”"];
      let meter = null, exI = -1;
      try { meter = d.createElement("canvas").getContext("2d"); } catch (e) {}
      function fits(t) {
        if (!meter || !input.clientWidth) return true;
        const cs = getComputedStyle(input);
        meter.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
        return meter.measureText(t).width + 8 <= input.clientWidth;
      }
      function pool() {
        let first = FIRST[FIRST.length - 1];
        for (let i = 0; i < FIRST.length; i++) { if (fits(FIRST[i])) { first = FIRST[i]; break; } }
        return [first].concat(ROTATE.filter(fits));
      }
      function nextPlaceholder(restart) {
        const p = pool();
        exI = restart ? 0 : (exI + 1) % p.length;
        input.placeholder = p[exI];
      }
      nextPlaceholder(true);
      if (!reduce) setInterval(() => { if (d.activeElement !== input && !input.value) nextPlaceholder(); }, 3200);

      function match(qStr) {
        qStr = qStr.trim().toLowerCase();
        if (!qStr) return index.filter((r) => r.f).slice(0, 7);
        const out = [];
        index.forEach((r) => {
          const hay = (r.n + " " + (r.a || "")).toLowerCase();
          const i = hay.indexOf(qStr);
          if (i < 0) return;
          const score = (r.n.toLowerCase().indexOf(qStr) === 0 ? 0 : (/(^|\s)/.test(hay.charAt(i - 1) || " ") ? 1 : 2));
          out.push({ r, s: score + (r.k === "b" ? 0 : r.k === "c" ? 0.2 : 0.4) });
        });
        out.sort((a, b) => a.s - b.s || a.r.n.localeCompare(b.r.n));
        return out.slice(0, 7).map((o) => o.r);
      }

      function renderSearch() {
        const query = input.value;
        shownItems = match(query);
        active = -1;
        list.textContent = "";
        shownItems.forEach((r, i) => {
          const li = d.createElement("li");
          li.className = "opt";
          li.id = "q-opt-" + i;
          li.setAttribute("role", "option");
          li.setAttribute("aria-selected", "false");
          const k = d.createElement("span");
          k.className = "opt__kind";
          k.textContent = KIND[r.k] || "";
          const t = d.createElement("span"), n = d.createElement("span"), s = d.createElement("span");
          n.className = "opt__name"; n.textContent = r.n;
          s.className = "opt__sub"; s.textContent = r.s || "";
          t.appendChild(n); t.appendChild(s);
          li.appendChild(k); li.appendChild(t);
          li.addEventListener("mousedown", (e) => { e.preventDefault(); choose(i); });
          list.appendChild(li);
        });
        const none = !shownItems.length && query.trim();
        empty.hidden = !none;
        if (none) {
          empty.textContent = "Nothing is listed for “" + query.trim() + "” yet. ";
          const a = d.createElement("a");
          a.href = "#brands";
          a.textContent = "See what is listed";
          empty.appendChild(a);
          a.addEventListener("click", closeSearch);
        }
        panel.hidden = !(shownItems.length || none);
        input.setAttribute("aria-expanded", String(!panel.hidden));
        input.removeAttribute("aria-activedescendant");
      }

      function closeSearch() {
        panel.hidden = true;
        input.setAttribute("aria-expanded", "false");
        active = -1;
      }
      function choose(i) {
        const r = shownItems[i];
        if (!r) return;
        input.value = r.n;
        closeSearch();
        window.location.href = r.u;
      }

      input.addEventListener("input", renderSearch);
      input.addEventListener("focus", renderSearch);
      input.addEventListener("blur", () => setTimeout(closeSearch, 120));
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (panel.hidden) renderSearch();
          const opts = $$(".opt", list);
          if (!opts.length) return;
          active = (active + 1) % opts.length;
          opts.forEach((o, j) => o.setAttribute("aria-selected", String(j === active)));
          opts[active].scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const opts = $$(".opt", list);
          if (!opts.length) return;
          active = (active - 1 + opts.length) % opts.length;
          opts.forEach((o, j) => o.setAttribute("aria-selected", String(j === active)));
          opts[active].scrollIntoView({ block: "nearest" });
        } else if (e.key === "Escape") {
          if (!panel.hidden) { e.preventDefault(); closeSearch(); }
        } else if (e.key === "Enter" && active > -1) {
          e.preventDefault();
          choose(active);
        }
      });
      form.addEventListener("submit", (e) => {
        const qVal = input.value.trim();
        if (!qVal) { e.preventDefault(); input.focus(); return; }
      });

      function focusSearch(e) {
        if (e) e.preventDefault();
        form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        setTimeout(() => input.focus({ preventScroll: true }), reduce ? 0 : 350);
      }
      $$("[data-focus-search]").forEach((b) => b.addEventListener("click", focusSearch));
      d.addEventListener("keydown", (e) => {
        if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
        const tg = e.target, tag = tg && tg.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (tg && tg.isContentEditable)) return;
        focusSearch(e);
      });
    })();

    // Experience Simulator
    (function initSimulator() {
      const inst = $("#instrument");
      if (!inst) return;
      const master = $("#master"), wrap = $("#master-wrap"), stops = $$("#stops button"), feats = $$("#feats .feat");
      const lockBtn = $("#lock"), lockLabel = $("#lock-label"), lockIcon = $("#lock-icon"), timerEl = $("#timer");
      const ladder = $("#ladder"), tcard = $("#tcard");
      const nf1 = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const nf2 = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const STATES = [
        { n: "Angry Star", d: "This should not have happened.", c: "#F12A0A" },
        { n: "Let down", d: "It did not deliver what it promised.", c: "#F6480A" },
        { n: "Trust challenged", d: "The experience disappointed you.", c: "#FF6A0A" },
        { n: "Mixed", d: "Some things worked. Some did not.", c: "#FFAA00" },
        { n: "Good experience", d: "You would feel positive about doing this again.", c: "#F5B800" },
        { n: "Recommend", d: "You would confidently recommend this.", c: "#0A8754" }
      ];
      const MAXV = STATES.length - 1;
      const SUBJECTS = SUBJECTS_CONFIG;
      const MODEL = {
        n: 24, mean: 72.0, sd: 17, priorAngry: 1,
        brand: { W: 5, others: 69.0 },
        cat: { W: 18, others: 70.5, index: 1012.40 },
        ind: { W: 64, others: 68.9, index: 1004.10 }
      };
      let subject = "policy", k = 1, locked = false, t0 = 0, tick = null, elapsed = 0, lastFrom = "master";

      function mixColor(a, b, t) { return "color-mix(in oklch, " + b + " " + Math.round(t * 100) + "%, " + a + ")"; }
      const canMix = !!(window.CSS && CSS.supports && CSS.supports("color", "color-mix(in oklch, red 50%, blue)"));
      function colorAt(v) {
        const lo = Math.floor(v), hi = Math.min(MAXV, lo + 1), t = v - lo;
        if (!canMix || t < 0.02) return STATES[t < 0.5 ? lo : hi].c;
        return mixColor(STATES[lo].c, STATES[hi].c, t);
      }
      function featVals() { return feats.map((f) => +$("input", f).value); }
      function avg(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
      function trustSignal(vals) {
        const s = avg(vals) / MAXV * 100, angry = vals.indexOf(0) > -1;
        return { raw: s, value: angry ? Math.min(s, 50) : s, angry, capped: angry && s > 50 };
      }
      function consequence(s, kk) {
        const m = MODEL, n1 = m.n + kk, mean1 = (m.mean * m.n + s * kk) / n1;
        function lvl(g, p) { return (p + g.others * (g.W - 1)) / g.W; }
        const b0 = lvl(m.brand, m.mean), b1 = lvl(m.brand, mean1);
        const c0 = lvl(m.cat, m.mean), c1 = lvl(m.cat, mean1);
        const i0 = lvl(m.ind, m.mean), i1 = lvl(m.ind, mean1);
        return {
          product: [m.mean, mean1], brand: [b0, b1],
          cat: [m.cat.index, m.cat.index * c1 / c0], ind: [m.ind.index, m.ind.index * i1 / i0], n: n1
        };
      }
      function history(end, spread, seed) {
        const out = []; let v = end, x = seed;
        for (let i = 0; i < 15; i++) { x = (x * 9301 + 49297) % 233280; v -= (x / 233280 - 0.52) * spread; out.unshift(v); }
        out.push(end); return out;
      }
      const HIST = {
        product: history(MODEL.mean, 2.2, 7), brand: history(69.6, 1.1, 19),
        cat: history(MODEL.cat.index, 3.4, 43), ind: history(MODEL.ind.index, 2.1, 71)
      };
      function spark(svg, hist, after, dir) {
        const pts = hist.concat([after]); let lo = Math.min(...pts), hi = Math.max(...pts);
        const pad = (hi - lo) * 0.12 || 1; lo -= pad; hi += pad;
        const W = 96, H = 34, n = pts.length;
        const X = (i) => 4 + i * (W - 10) / (n - 1);
        const Y = (v) => 4 + (H - 8) * (1 - (v - lo) / (hi - lo));
        const past = hist.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join("");
        const col = dir === "up" ? "#2FD08A" : dir === "down" ? "#FF7A5C" : "#93A3C4";
        const ax = X(n - 2), ay = Y(hist[hist.length - 1]), bx = X(n - 1), by = Y(after);
        svg.innerHTML = `<path d="${past}" fill="none" stroke="#5F74A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="4" fill="${col}" stroke="#071B46" stroke-width="2"/>`;
      }
      const starBody = $("#star-body"), mouth = $("#star-mouth"), browL = $("#star-brow-l"), browR = $("#star-brow-r"), eyeL = $("#star-eye-l"), eyeR = $("#star-eye-r"), star = $("#truststar");
      const CURVE = [-1, -0.62, -0.3, 0.08, 0.6, 1];
      let lastRound = -1;
      function face(v) {
        const lo = Math.floor(v), hi = Math.min(MAXV, lo + 1), t = v - lo;
        const c = CURVE[lo] + (CURVE[hi] - CURVE[lo]) * t;
        const y = 80 - c * 2.5, ctrl = y + c * 14;
        mouth.setAttribute("d", `M46 ${y.toFixed(1)}Q60 ${ctrl.toFixed(1)} 74 ${y.toFixed(1)}`);
        const brow = Math.max(0, 1 - v / 0.9);
        browL.setAttribute("opacity", brow.toFixed(2));
        browR.setAttribute("opacity", brow.toFixed(2));
        const squash = v > 4 ? 4.8 - (v - 4) * 1.7 : 4.8;
        eyeL.setAttribute("ry", squash.toFixed(2));
        eyeR.setAttribute("ry", squash.toFixed(2));
        const col = colorAt(v);
        starBody.style.fill = col;
        starBody.style.stroke = col;
      }
      function fmtDelta(x, dp) {
        const f = dp === 2 ? nf2 : nf1, lim = dp === 2 ? 0.005 : 0.05;
        if (Math.abs(x) < lim) return ["flat", "no change"];
        return [x > 0 ? "up" : "down", (x > 0 ? "+" : "−") + f.format(Math.abs(x))];
      }
      function updateSim(from) {
        lastFrom = from;
        const vals = featVals();
        let v = avg(vals);
        if (from !== "master") master.value = v.toFixed(1);
        else v = +master.value;
        const r = Math.round(v), st = STATES[r];
        const tone = v < 2.5 ? "low" : v < 4.5 ? "mid" : "rec";
        inst.setAttribute("data-tone", tone);
        $("#state-name").textContent = st.n;
        $("#state-desc").textContent = st.d;
        master.setAttribute("aria-valuetext", (r === 0 || r === MAXV ? st.n : r + " of 4, " + st.n));
        stops.forEach((b) => {
          if (+b.getAttribute("data-stop") === r) b.setAttribute("aria-current", "true");
          else b.removeAttribute("aria-current");
        });
        face(v);
        if (r === 0 && lastRound !== 0 && !reduce) {
          star.classList.remove("is-angry");
          void star.getBoundingClientRect();
          star.classList.add("is-angry");
        }
        lastRound = r;
        feats.forEach((f, i) => {
          const x = vals[i], out = $("output", f);
          f.style.setProperty("--c", STATES[x].c);
          f.style.setProperty("--p", `calc(11px + (100% - 22px) * ${(x / MAXV).toFixed(2)})`);
          if (x === 0) out.innerHTML = '<svg aria-hidden="true"><use href="#i-angry"/></svg><span class="sr-only">Angry Star</span>';
          else if (x === MAXV) out.innerHTML = '<svg aria-hidden="true"><use href="#i-rec"/></svg><span class="sr-only">Recommend</span>';
          else out.textContent = String(x);
          $("input", f).setAttribute("aria-valuetext", x === 0 ? "Angry Star" : x === MAXV ? "Recommend" : x + " of 4");
        });
        const sig = trustSignal(from === "master" ? vals.map(() => v) : vals);
        if (from === "master") { sig.angry = r === 0; sig.capped = false; sig.value = sig.raw; }
        $("#sig").textContent = String(Math.round(sig.value));
        $("#sig-state").textContent = st.n;
        $("#sig-note").textContent = sig.capped ? "One Angry Star caps a signal at 50." : "";
        const c = consequence(sig.value, k);
        const angryShare = (MODEL.priorAngry + (sig.angry ? k : 0)) / c.n;
        $$(".rung", ladder).forEach((li) => {
          const key = li.getAttribute("data-level"), pair = c[key], dp = (key === "cat" || key === "ind") ? 2 : 1, f = dp === 2 ? nf2 : nf1;
          $("[data-before]", li).textContent = f.format(pair[0]);
          $("[data-after]", li).textContent = f.format(pair[1]);
          const dl = fmtDelta(pair[1] - pair[0], dp), de = $(".rung__delta", li);
          de.setAttribute("data-dir", dl[0]);
          $("[data-delta]", li).textContent = dl[1];
          spark($(".rung__spark", li), HIST[key], pair[1], dl[0]);
          if (key === "product") {
            $("[data-n]", li).textContent = nf1.format(locked ? c.n : MODEL.n).replace(/\.0$/, "");
            $("[data-alert]", li).hidden = !(sig.angry && angryShare >= 0.10);
          }
        });
        return { sig, state: st, vals, v };
      }

      function startTimer() {
        if (t0 || locked) return;
        t0 = performance.now();
        wrap.classList.remove("is-hint");
        tick = setInterval(() => {
          elapsed = (performance.now() - t0) / 1000;
          timerEl.innerHTML = `<b>${elapsed.toFixed(1)} s</b> so far`;
        }, 100);
      }

      function snapTo(val) {
        master.value = String(val);
        feats.forEach((f) => { $("input", f).value = String(Math.round(val)); });
        updateSim("master");
      }

      master.addEventListener("input", () => {
        startTimer();
        const v = +master.value;
        feats.forEach((f) => { $("input", f).value = String(Math.round(v)); });
        updateSim("master");
      });
      master.addEventListener("change", () => snapTo(Math.round(+master.value)));
      stops.forEach((b) => b.addEventListener("click", () => {
        if (locked) return;
        startTimer();
        snapTo(+b.getAttribute("data-stop"));
      }));
      feats.forEach((f) => $("input", f).addEventListener("input", () => {
        startTimer();
        updateSim("feat");
      }));

      function radios(group, onPick) {
        const btns = $$("button", group);
        function pickBtn(b, focus) {
          btns.forEach((x) => { const on = x === b; x.setAttribute("aria-checked", String(on)); x.tabIndex = on ? 0 : -1; });
          if (focus) b.focus();
          onPick(b);
        }
        btns.forEach((b, i) => {
          b.addEventListener("click", () => pickBtn(b));
          b.addEventListener("keydown", (e) => {
            const dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
            if (!dir) return;
            e.preventDefault();
            pickBtn(btns[(i + dir + btns.length) % btns.length], true);
          });
        });
      }

      radios($(".seg--subject", inst), (b) => {
        if (locked) return;
        subject = b.getAttribute("data-subject");
        const s = SUBJECTS[subject] || SUBJECTS.policy;
        feats.forEach((f, i) => { $("label", f).textContent = s.feats[i]; });
        $$(".rung [data-name]", ladder).forEach((el, i) => { el.textContent = s.rungs[i]; });
      });

      radios($("#crowd"), (b) => {
        k = +b.getAttribute("data-k");
        $("#crowd-tail").textContent = k === 1 ? "person felt this way" : "people felt this way";
        updateSim(lastFrom);
      });

      function lockSim() {
        if (locked) return;
        locked = true;
        clearInterval(tick);
        const res = updateSim(lastFrom);
        const secs = t0 ? (performance.now() - t0) / 1000 : 0;
        inst.classList.add("is-locked");
        ladder.classList.add("is-locked");
        lockBtn.disabled = true;
        lockLabel.textContent = "Locked";
        lockIcon.setAttribute("href", "#i-lock");
        $$("input", inst).forEach((i) => { i.disabled = true; });
        timerEl.innerHTML = secs ? `Locked in <b>${secs.toFixed(1)} seconds</b>` : "Locked";
        $("#ladder-title").textContent = "What your signal moved";
        $("#result-line").textContent = "You moved four numbers" + (secs ? ` in ${secs.toFixed(1)} seconds.` : ".");
        $("#ladder-result").hidden = false;
        $$(".rung", ladder).forEach((li, i) => setTimeout(() => li.classList.add("is-hit"), reduce ? 0 : 160 + i * 230));

        const score = Math.round(res.sig.value), s = SUBJECTS[subject] || SUBJECTS.policy;
        const angryAt = lastFrom !== "master" ? res.vals.indexOf(0) : -1;
        const label = res.state.n + (res.sig.capped ? ", with an Angry Star" : "");
        $("#tc-score").textContent = String(score);
        $("#tc-state").textContent = label;
        $("#tc-subject").textContent = s.name;
        const when = new Date().toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
        const hi = Math.max(...res.vals), lo = Math.min(...res.vals);
        let extra = "";
        if (hi !== lo && lastFrom !== "master") {
          extra = ` Strongest: ${s.feats[res.vals.indexOf(hi)]}. ${angryAt > -1 ? "Angry Star: " : "Weakest: "}${s.feats[res.vals.indexOf(lo)]}.`;
        }
        $("#tc-meta").textContent = "Locked " + when + (secs ? `, in ${secs.toFixed(1)} seconds.` : ".") + extra;
        tcard.hidden = false;
        tcard.setAttribute("data-text", `My TrustCard: ${s.name}, ${score}/100 (${label}). Locked ${when} on TrustValue.ai. Demo card.`);
      }

      function resetSim() {
        locked = false; t0 = 0; elapsed = 0;
        clearInterval(tick);
        inst.classList.remove("is-locked");
        ladder.classList.remove("is-locked");
        lockBtn.disabled = false;
        lockLabel.textContent = "Lock my experience";
        lockIcon.setAttribute("href", "#i-unlock");
        $$("input", inst).forEach((i) => { i.disabled = false; });
        timerEl.textContent = "Designed for 5 to 7 seconds";
        $("#ladder-title").textContent = "What your signal would move";
        $("#ladder-result").hidden = true;
        $$(".rung", ladder).forEach((li) => li.classList.remove("is-hit"));
        tcard.hidden = true;
        snapTo(3);
        inst.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }

      lockBtn.addEventListener("click", lockSim);
      $("#tc-again")?.addEventListener("click", resetSim);
      $("#tc-copy")?.addEventListener("click", () => {
        const text = tcard.getAttribute("data-text") || "";
        try {
          navigator.clipboard.writeText(text).then(() => toast("TrustCard copied"), () => toast(text));
        } catch (e) { toast(text); }
      });

      updateSim("master");
    })();
  }, []);

  return (
    <>
      {/* TICKER */}
      <div className="ticker" role="region" aria-label="Trust Index strip, all sectors, pre-live">
        <div className="ticker__row">
          <p className="ticker__state"><span className="dot dot--signal" />Every-Sector Index</p>
          <div className="ticker__viewport" tabIndex={0} role="group" aria-label="Indices waiting to open across industries. Focus or hover to pause.">
            <ul className="ticker__track">
              <li className="tick tick--note"><span class="dot dot--signal" /><span><b>Insurance opens first</b>, then banking, telecom and automobiles · 183 brands listed</span></li>
              <li className="tick"><span className="tick__name">Insurance</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens first</span></li>
              <li className="tick"><span className="tick__name">Banking &amp; loans</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens second</span></li>
              <li className="tick"><span className="tick__name">Investments</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Healthcare</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Pharma &amp; pharmacy</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Telecom</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens third</span></li>
              <li className="tick"><span className="tick__name">Internet &amp; OTT</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Food &amp; grocery</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Agriculture</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Real estate</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Home &amp; utilities</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Automobiles</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens fourth</span></li>
              <li className="tick"><span className="tick__name">Travel &amp; transport</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Education</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Consumer electronics</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Retail &amp; e-commerce</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Jobs &amp; skilling</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Government services</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
            </ul>
            <ul className="ticker__track" aria-hidden="true">
              <li className="tick tick--note"><span class="dot dot--signal" /><span><b>Insurance opens first</b>, then banking, telecom and automobiles · 183 brands listed</span></li>
              <li className="tick"><span className="tick__name">Insurance</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens first</span></li>
              <li className="tick"><span className="tick__name">Banking &amp; loans</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens second</span></li>
              <li className="tick"><span className="tick__name">Investments</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Healthcare</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Pharma &amp; pharmacy</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Telecom</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens third</span></li>
              <li className="tick"><span className="tick__name">Internet &amp; OTT</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Food &amp; grocery</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Agriculture</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Real estate</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Home &amp; utilities</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Automobiles</span><span className="tick__val">1,000.00</span><span className="tick__tag">opens fourth</span></li>
              <li className="tick"><span className="tick__name">Travel &amp; transport</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Education</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Consumer electronics</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Retail &amp; e-commerce</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Jobs &amp; skilling</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
              <li className="tick"><span className="tick__name">Government services</span><span className="tick__val">1,000.00</span><span className="tick__tag">planned</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 1. HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <h1 id="hero-title">
              <span className="descriptor">
                <img src="/brand/descriptor-icon.webp" alt="" width={26} height={26} />
                The Global Trust Index
              </span>
              <span className="sr-only">: </span>
              <span className="display">Know before you <span>trust.</span></span>
            </h1>
            <p className="lead">
              TrustValue is where people rate and review brands, in public. Real experiences become a Trust Index for every brand and product. See what people actually lived through before you choose, whether it is a policy, a loan, a phone plan, a car or a hospital.
            </p>

            <form className="search" id="search" role="search" action="/search/" method="get">
              <label className="sr-only" htmlFor="q">Search a brand, product or category</label>
              <div className="search__field">
                <svg aria-hidden="true"><use href="#i-search" /></svg>
                <input
                  id="q"
                  name="q"
                  type="search"
                  placeholder="Search a brand, product or category"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  enterKeyHint="search"
                  role="combobox"
                  aria-expanded="false"
                  aria-controls="q-list"
                  aria-autocomplete="list"
                />
                <kbd className="search__kbd" aria-hidden="true">/</kbd>
                <button className="btn btn--signal" type="submit">Search</button>
              </div>
              <div className="search__panel" id="q-panel" hidden>
                <ul id="q-list" role="listbox" aria-label="Suggestions" />
                <p className="search__empty" id="q-empty" hidden />
              </div>
            </form>
            <p className="try">
              <span>Try</span>
              <a href="#brands" data-pick="0">Insurance</a>
              <a href="#brands" data-pick="1">Banking &amp; loans</a>
              <a href="#brands" data-pick="5">Telecom</a>
              <a href="#brands" data-pick="11">Automobiles</a>
              <a href="#sectors">All 18 sectors</a>
            </p>
            <ul className="promises" aria-label="What we will never compromise">
              <li><svg aria-hidden="true"><use href="#i-shield" /></svg>No paid influence</li>
              <li><svg aria-hidden="true"><use href="#i-shield" /></svg>No rating ownership by businesses</li>
              <li><svg aria-hidden="true"><use href="#i-shield" /></svg>No rewritten history</li>
            </ul>
          </div>

          {/* Desktop Status Card */}
          <aside className="status hidden lg:block" aria-labelledby="status-title">
            <div className="status__top">
              <div>
                <p className="tag tag--onnavy"><span className="dot dot--idle" />Trust Index, pre-live</p>
                <h2 id="status-title">Goes live at 1,000 reviews.</h2>
                <p className="status__text">
                  An index has to earn its first number. Ours opens at a base of 1,000 the day the thousandth experience is locked.
                </p>
              </div>
              <img
                className="status__mascot"
                src="/brand/status__mascot.webp"
                alt="The TrustValue mascot waiting at the 1,000-review mark"
                width={365}
                height={760}
                fetchPriority="high"
              />
            </div>
            <div className="run" role="img" aria-label="0 of 1,000 experiences locked so far">
              <div className="run__track">
                <div className="run__fill" style={{ width: "0%" }} />
                <span className="run__dot" style={{ left: "0%" }} />
              </div>
              <p className="run__ends">
                <span><b>0</b> locked so far</span>
                <span><b>1,000</b> to go live</span>
              </p>
            </div>
            <dl className="counts" aria-label="Listed today">
              <div><dt>Articles published</dt><dd>0</dd></div>
              <div><dt>Brands listed</dt><dd>183</dd></div>
              <div><dt>Products listed</dt><dd>84</dd></div>
              <div><dt>Sectors mapped</dt><dd>18</dd></div>
            </dl>
            <p className="status__cta">
              <Link className="btn btn--signal" href="/write-review/">Write the first review</Link>
              <a href="#explained">How the index works</a>
            </p>
          </aside>
        </div>
      </section>

      {/* Mobile Floating Rating Pop Tab (Image 4) - only visible in Sections 1 & 2 */}
      {inTopSections && (
        <button
          type="button"
          className="status-pop-tab lg:hidden"
          aria-label="Open Index Status"
          onClick={() => setMobileStatusOpen(true)}
        >
          {/* Standing Mascot on top of button (Image 4) */}
          <div className="status-pop-mascot-wrap" aria-hidden="true">
            <img
              src="/brand/status__mascot.webp"
              alt=""
              className="status-pop-mascot"
              width={56}
              height={116}
            />
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF5A0A" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="status-pop-badge">1,000</span>
        </button>
      )}

      {/* Mobile Slide-over Status Drawer (Image 3) */}
      {mobileStatusOpen && (
        <div className="status-drawer-backdrop lg:hidden" onClick={() => setMobileStatusOpen(false)}>
          <div className="status-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="status-drawer-close"
              onClick={() => setMobileStatusOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="status-drawer-body">
              <div className="status-drawer-hero">
                <div className="status-drawer-info">
                  <span className="tag tag--onnavy"><span className="dot dot--idle" />Trust Index, pre-live</span>
                  <h2 id="status-title-mob" className="status-drawer-title">
                    Goes live at 1,000 reviews.
                  </h2>
                  <p className="status-drawer-desc">
                    An index has to earn its first number. Ours opens at a base of 1,000 the day the thousandth experience is locked.
                  </p>
                </div>
                <div className="status-drawer-mascot-box">
                  <img
                    className="status-drawer-mascot"
                    src="/brand/status__mascot.webp"
                    alt="The TrustValue mascot"
                    width={280}
                    height={580}
                  />
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="run status-drawer-run">
                <div className="run__track">
                  <div className="run__fill" style={{ width: "0%" }} />
                  <span className="run__dot" style={{ left: "0%" }} />
                </div>
                <p className="run__ends">
                  <span><b>0</b> locked so far</span>
                  <span><b>1,000</b> to go live</span>
                </p>
              </div>

              {/* Metrics Grid */}
              <dl className="counts status-drawer-counts">
                <div><dt>Articles published</dt><dd>0</dd></div>
                <div><dt>Brands listed</dt><dd>183</dd></div>
                <div><dt>Products listed</dt><dd>84</dd></div>
                <div><dt>Sectors mapped</dt><dd>18</dd></div>
              </dl>

              {/* Action Buttons */}
              <div className="status-drawer-cta">
                <Link className="btn btn--signal btn--block" href="/write-review/">
                  Write the first review
                </Link>
                <a
                  href="#explained"
                  className="status-drawer-link"
                  onClick={() => setMobileStatusOpen(false)}
                >
                  How the index works
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTORS SHOWCASE (IMAGE 1 SPEC) */}
      <section className="sectors-showcase-section" id="sectors" aria-labelledby="sectors-title">
        <div className="wrap">
          <header className="section__head">
            <span className="tag tag--onnavy"><span className="dot dot--signal" />One index, every sector</span>
            <h2 id="sectors-title" style={{ color: "#fff" }}>Trust, measured wherever you spend your life.</h2>
            <p className="lead" style={{ color: "#AEBBD6" }}>
              18 daily-life sectors mapped. Only active sectors can be explored; pledge your vote to unlock the rest.
            </p>
          </header>

          <div className="showcase-grid">
            {SECTORS_SHOWCASE.map((sec, idx) => (
              sec.isLive ? (
                <Link
                  key={sec.id}
                  href={sec.link || "/industry/insurance"}
                  className="showcase-card showcase-card--live"
                  style={{ "--card-index": idx } as React.CSSProperties}
                  title="Explore live audit for Life & Health Insurance"
                >
                  <div className="showcase-badge">
                    <span className="dot-live" />
                    <span>{sec.badge}</span>
                  </div>
                  <h3 className="showcase-title">{sec.name}</h3>
                  <p className="showcase-desc">{sec.desc}</p>
                  <p className="showcase-footer-signal">{sec.footerText}</p>
                </Link>
              ) : (
                <div
                  key={sec.id}
                  className="showcase-card showcase-card--inactive"
                  style={{ "--card-index": idx } as React.CSSProperties}
                >
                  <div className="showcase-badge">
                    <span>{sec.badge}</span>
                  </div>
                  <h3 className="showcase-title">{sec.name}</h3>
                  <p className="showcase-desc">{sec.desc}</p>
                  <div className="showcase-progress">
                    <div className="showcase-progress-track">
                      <div className="showcase-progress-fill" style={{ width: `${sec.goalPct}%` }} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="showcase-btn-vote"
                    onClick={() => {
                      setPledgeSector(sec.name);
                      document.getElementById("pledge-email-input")?.focus();
                      document.getElementById("pledge-email-input")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    Pledge Vote to Unlock
                  </button>
                </div>
              )
            ))}
          </div>

          {/* Bottom Pledge Card (Image 1 Bottom) */}
          <div className="pledge-box" id="pledge-card">
            <h3>Pledge your vote to unlock an industry</h3>
            <p>
              We will notify you the exact day the public audit ledger opens for {pledgeSector}.
            </p>
            <form
              className="pledge-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!pledgeEmail) return;
                setPledgeDone(true);
                try {
                  const q = JSON.parse(localStorage.getItem("tv-pledges") || "[]");
                  q.push({ email: pledgeEmail, sector: pledgeSector, at: new Date().toISOString() });
                  localStorage.setItem("tv-pledges", JSON.stringify(q));
                } catch {}
              }}
            >
              <input
                id="pledge-email-input"
                type="email"
                placeholder="Enter your email address"
                value={pledgeEmail}
                onChange={(e) => setPledgeEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn--signal">Confirm My Vote</button>
            </form>
            {pledgeDone && (
              <p className="pledge-ok">
                ✓ Your vote for {pledgeSector} has been confirmed. We will message you at launch.
              </p>
            )}
            <small>No spam. One message when it matters. Unsubscribe any time.</small>
          </div>
        </div>
      </section>

      {/* 3. BRANDS */}
      <section className="section" id="brands" aria-labelledby="brands-title">
        <div className="wrap">
          <header className="section__head section__head--split">
            <div className="section__head" style={{ marginBottom: 0 }}>
              <h2 id="brands-title">Rate and review any brand</h2>
              <p className="lead">
                Every brand and every product starts with no score and ten empty signals. The first ten people to rate it publish its first TrustValue Score. No brand pays to be listed, and none can edit what people say.
              </p>
            </div>
            <Link className="link" href="/brands/">Open the brand directory <svg aria-hidden="true"><use href="#i-arrow" /></svg></Link>
          </header>
          <div className="board">
            <div className="board__bar">
              <div className="seg" id="brand-mode" role="radiogroup" aria-label="Show brands or products">
                <button type="button" role="radio" aria-checked="true" data-mode="b">Brands</button>
                <button type="button" role="radio" aria-checked="false" data-mode="p">Products</button>
              </div>
              <div className="chips" id="brand-chips" role="group" aria-label="Filter brands by sector" />
              <p className="board__count" id="brand-count" aria-live="polite" />
            </div>
            <div className="brand-find">
              <svg aria-hidden="true"><use href="#i-search" /></svg>
              <label className="sr-only" htmlFor="brand-q">Filter brands</label>
              <input id="brand-q" type="search" placeholder="Filter brands in this view" autoComplete="off" />
            </div>
            <ul className="plates" id="brand-plates" />
            <p className="board-more" id="brand-more-wrap">
              <button className="btn btn--quiet" type="button" id="brand-more" />
            </p>
            <p className="board__note note">
              Brand names belong to their owners and are shown for identification only. Insurer registration numbers come from the Life Insurance Council member list and each insurer&apos;s documents, checked <time dateTime="2026-09-30">30 Sep 2026</time>. Listing is not an endorsement or a rating.
            </p>
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCE SIMULATOR */}
      <section className="section demo" id="experience" aria-labelledby="demo-title">
        <div className="wrap">
          <header className="section__head">
            <h2 id="demo-title" className="wide"><span className="nb">One gesture.</span> <span className="nb">One truth.</span> <span className="nb">Then move on.</span></h2>
            <p className="lead">Rating here takes about seven seconds. Drag once, fine-tune if you care to, lock it. Try it now. This is a demo and nothing is submitted.</p>
          </header>

          <div className="instrument" id="instrument" data-tone="mid">
            <div className="rate">
              <div className="rate__top">
                <div className="seg seg--subject" role="radiogroup" aria-label="What contract or product are you rating?">
                  <button type="button" role="radio" aria-checked="true" data-subject="policy">Insurance</button>
                  <button type="button" role="radio" aria-checked="false" data-subject="loan" tabIndex={-1}>Banking &amp; loans</button>
                  <button type="button" role="radio" aria-checked="false" data-subject="tel" tabIndex={-1}>Telecom</button>
                  <button type="button" role="radio" aria-checked="false" data-subject="car" tabIndex={-1}>Automobiles</button>
                  <button type="button" role="radio" aria-checked="false" data-subject="phone" tabIndex={-1}>Electronics</button>
                  <button type="button" role="radio" aria-checked="false" data-subject="hospital" tabIndex={-1}>Healthcare</button>
                  <button type="button" role="radio" aria-checked="false" data-subject="edu" tabIndex={-1}>Education</button>
                </div>
                <span className="tag">Demo. Nothing is submitted.</span>
              </div>
              <h3 className="rate__q">How did it feel?</h3>
              <p className="rate__hint">Don&apos;t overthink it. Your first instinct is the signal.</p>

              <div className="verdict">
                <svg className="truststar" id="truststar" viewBox="0 0 120 120" aria-hidden="true">
                  <path className="truststar__body" id="star-body" d="M60.0 14.0L76.8 39.9L106.6 47.9L87.1 71.8L88.8 102.6L60.0 91.5L31.2 102.6L32.9 71.8L13.4 47.9L43.2 39.9Z" fill="#FFAA00" stroke="#FFAA00" strokeWidth="11" strokeLinejoin="round" />
                  <g fill="none" stroke="#06132F" strokeWidth="5.4" strokeLinecap="round">
                    <path id="star-brow-l" d="M38 47 52 53" opacity="0" />
                    <path id="star-brow-r" d="M82 47 68 53" opacity="0" />
                    <path id="star-mouth" d="M48 79Q60 80 72 79" />
                  </g>
                  <ellipse id="star-eye-l" cx="49" cy="62" rx="4.8" ry="4.8" fill="#06132F" />
                  <ellipse id="star-eye-r" cx="71" cy="62" rx="4.8" ry="4.8" fill="#06132F" />
                </svg>
                <div>
                  <p className="verdict__state" id="state-name">Mixed</p>
                  <p className="verdict__desc" id="state-desc">Some things worked. Some did not.</p>
                </div>
              </div>

              <div className="master is-hint" id="master-wrap">
                <input type="range" id="master" min="0" max="5" step="0.1" defaultValue="3" aria-label="Overall experience, from Angry Star to Recommend" aria-valuetext="3 of 4, Mixed" />
                <div className="master__ticks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
              </div>
              <div className="stops" id="stops" role="group" aria-label="Jump to a rating">
                <button type="button" data-stop="0" aria-label="Angry Star"><span><svg aria-hidden="true"><use href="#i-angry" /></svg><em>Angry Star</em></span></button>
                <button type="button" data-stop="1"><span>1</span></button>
                <button type="button" data-stop="2"><span>2</span></button>
                <button type="button" data-stop="3" aria-current="true"><span>3</span></button>
                <button type="button" data-stop="4"><span>4</span></button>
                <button type="button" data-stop="5" aria-label="Recommend"><span><em>Recommend</em><svg aria-hidden="true"><use href="#i-rec" /></svg></span></button>
              </div>
              <p className="stops-ends" aria-hidden="true"><span>Angry Star</span><span>Recommend</span></p>

              <div className="features" role="group" aria-labelledby="features-title">
                <p className="features__title" id="features-title">Fine-tune by feature <span>Optional. The slider above follows.</span></p>
                <div id="feats">
                  <div className="feat"><label htmlFor="f0">Delivered as promised</label><input type="range" id="f0" min="0" max="5" step="1" defaultValue="3" /><output htmlFor="f0">3</output></div>
                  <div className="feat"><label htmlFor="f1">Premium worth it</label><input type="range" id="f1" min="0" max="5" step="1" defaultValue="3" /><output htmlFor="f1">3</output></div>
                  <div className="feat"><label htmlFor="f2">Buying and issuance</label><input type="range" id="f2" min="0" max="5" step="1" defaultValue="3" /><output htmlFor="f2">3</output></div>
                  <div className="feat"><label htmlFor="f3">Honest about charges</label><input type="range" id="f3" min="0" max="5" step="1" defaultValue="3" /><output htmlFor="f3">3</output></div>
                  <div className="feat"><label htmlFor="f4">Service and claims</label><input type="range" id="f4" min="0" max="5" step="1" defaultValue="3" /><output htmlFor="f4">3</output></div>
                </div>
              </div>

              <div className="rate__foot">
                <p className="timer" id="timer">Designed for 5 to 7 seconds</p>
                <button className="lock" id="lock" type="button"><svg aria-hidden="true"><use id="lock-icon" href="#i-unlock" /></svg><span id="lock-label">Lock my experience</span></button>
              </div>
              <noscript><p className="note" style={{ marginTop: "16px" }}>Turn on JavaScript to try the demo. The rest of this page works without it.</p></noscript>
            </div>

            <div className="ladder" id="ladder" aria-labelledby="ladder-title">
              <div className="ladder__head">
                <h3 id="ladder-title">What your signal would move</h3>
                <span className="tag tag--onnavy">Illustration. Not live data.</span>
              </div>
              <div className="signal">
                <div>
                  <p className="signal__label">Your Trust Signal</p>
                  <p className="signal__value"><b id="sig">60</b><span>/100</span></p>
                </div>
                <p className="signal__chip"><i /><span id="sig-state">Mixed</span></p>
                <p className="signal__note" id="sig-note" aria-live="polite" />
              </div>
              <ol className="rungs" id="rungs">
                <li className="rung" data-level="product">
                  <div><p className="rung__name"><span data-name>This policy</span><em data-alert hidden>Trust Alert</em></p><p className="rung__meta"><span data-kind>TrustValue Score</span>, <span data-n>24</span> signals</p></div>
                  <svg className="rung__spark" viewBox="0 0 96 34" aria-hidden="true" />
                  <div className="rung__nums"><p className="rung__vals"><span data-before>72.0</span><svg aria-hidden="true"><use href="#i-arrow" /></svg><b data-after>72.0</b></p><p className="rung__delta" data-dir="flat"><svg aria-hidden="true"><use href="#i-tri" /></svg><span data-delta>no change</span></p></div>
                </li>
                <li className="rung" data-level="brand">
                  <div><p className="rung__name"><span data-name>Its insurer</span></p><p className="rung__meta"><span data-kind>Brand TrustValue</span></p></div>
                  <svg className="rung__spark" viewBox="0 0 96 34" aria-hidden="true" />
                  <div className="rung__nums"><p className="rung__vals"><span data-before>69.6</span><svg aria-hidden="true"><use href="#i-arrow" /></svg><b data-after>69.6</b></p><p className="rung__delta" data-dir="flat"><svg aria-hidden="true"><use href="#i-tri" /></svg><span data-delta>no change</span></p></div>
                </li>
                <li className="rung" data-level="cat">
                  <div><p className="rung__name"><span data-name>Insurance category</span></p><p className="rung__meta"><span data-kind>Trust Index</span>, base 1,000</p></div>
                  <svg className="rung__spark" viewBox="0 0 96 34" aria-hidden="true" />
                  <div className="rung__nums"><p className="rung__vals"><span data-before>1,012.40</span><svg aria-hidden="true"><use href="#i-arrow" /></svg><b data-after>1,012.40</b></p><p className="rung__delta" data-dir="flat"><svg aria-hidden="true"><use href="#i-tri" /></svg><span data-delta>no change</span></p></div>
                </li>
                <li className="rung" data-level="ind">
                  <div><p className="rung__name"><span data-name>Insurance Trust Index</span></p><p className="rung__meta"><span data-kind>Trust Index</span>, base 1,000</p></div>
                  <svg className="rung__spark" viewBox="0 0 96 34" aria-hidden="true" />
                  <div className="rung__nums"><p className="rung__vals"><span data-before>1,004.10</span><svg aria-hidden="true"><use href="#i-arrow" /></svg><b data-after>1,004.10</b></p><p className="rung__delta" data-dir="flat"><svg aria-hidden="true"><use href="#i-tri" /></svg><span data-delta>no change</span></p></div>
                </li>
              </ol>
              <div className="crowd">
                <span id="crowd-label">If</span>
                <div className="seg seg--navy" id="crowd" role="radiogroup" aria-label="How many people felt the same">
                  <button type="button" role="radio" aria-checked="true" data-k="1">1</button>
                  <button type="button" role="radio" aria-checked="false" data-k="10" tabIndex={-1}>10</button>
                  <button type="button" role="radio" aria-checked="false" data-k="100" tabIndex={-1}>100</button>
                  <button type="button" role="radio" aria-checked="false" data-k="1000" tabIndex={-1}>1,000</button>
                </div>
                <span id="crowd-tail">person felt this way</span>
              </div>
              <p className="ladder__result" id="ladder-result" hidden>
                <img src="/brand/result-icon.webp" alt="" width={40} height={40} />
                <span><b id="result-line">You moved four numbers.</b><span>That is what locking does. A real experience is counted the same way.</span></span>
              </p>
              <p className="ladder__foot">A single voice contributes. A repeated pattern moves trust. When trust falls, the index turns red instead of hiding it.</p>
            </div>

            <div className="tcard" id="tcard" hidden>
              <div className="tcard__card">
                <p className="tcard__score"><b id="tc-score">60</b><span>/100</span></p>
                <p className="tcard__label">My TrustCard <span className="tag">Demo</span></p>
                <p className="tcard__state"><span id="tc-state">Mixed</span><span className="tcard__subject" id="tc-subject">A life insurance policy</span></p>
                <p className="tcard__meta" id="tc-meta" />
                <p className="tcard__fine">This card represents the customer&apos;s experience. It is not an advertisement, endorsement or paid placement.</p>
              </div>
              <p className="tcard__actions">
                <Link className="btn btn--signal" href="/write-review/">Score a real experience</Link>
                <button className="btn btn--navy" type="button" id="tc-copy">Copy TrustCard</button>
                <button className="btn btn--quiet" type="button" id="tc-again">Rate again</button>
              </p>
            </div>
          </div>

          <ol className="steps">
            <li><h3>Express</h3><p>Drag once. Your first instinct is the master signal, and every detail after it is optional.</p></li>
            <li><h3>Lock</h3><p>Locking timestamps your experience and makes it yours. Share it as a TrustCard if you want to.</p></li>
            <li><h3>See the consequence</h3><p>Watch your signal reach the product, its brand and the index above them.</p></li>
          </ol>
        </div>
      </section>

      {/* 5. SITUATIONS */}
      <section className="section situ" id="situations" aria-labelledby="situ-title">
        <div className="wrap">
          <header className="section__head">
            <h2 id="situ-title">Start with what you are unsure about.</h2>
            <p className="lead">You do not need a shortlist. Pick the decision in front of you and see how its brands are trusted.</p>
          </header>
          <div className="topics">
            <a className="topic" href="#brands" data-pick="5"><h3>Choosing a phone or broadband plan</h3><p>Check telecom brands before you recharge or sign a lock-in.</p></a>
            <a className="topic" href="#brands" data-pick="1"><h3>Taking a loan or opening an account</h3><p>See how banks and lenders treat people after the sale.</p></a>
            <a className="topic" href="#brands" data-pick="0"><h3>Buying cover for your family</h3><p>Look at insurers before you pay the first premium.</p></a>
            <a className="topic" href="#brands" data-pick="3"><h3>Booking a hospital or a test</h3><p>Compare hospitals and labs on billing, speed and honesty.</p></a>
            <a className="topic" href="#brands" data-pick="11"><h3>Buying a car or a two-wheeler</h3><p>Warranty, service and real-world use, from owners.</p></a>
            <a className="topic" href="#brands" data-pick="13"><h3>Signing up for a course</h3><p>Know how institutes deliver before you pay the fee.</p></a>
          </div>
        </div>
      </section>

      {/* 6. HOW REVIEWING WORKS */}
      <section className="section" id="how-review" aria-labelledby="how-title" style={{ paddingBlock: "clamp(24px, 4vw, 48px)" }}>
        <div className="wrap">
          <div className="how">
            <p className="how__eye">How reviewing works</p>
            <h2 id="how-title">A simple 5-minute review that helps the next person</h2>
            <ol className="how__steps">
              <li className="how__step"><span className="how__n">01</span><h3>Pick the brand and product</h3><p>Choose the brand, and the exact product or plan you used, in any sector.</p></li>
              <li className="how__step"><span className="how__n">02</span><h3>Tell us how it went</h3><p>Rate your experience, then add detail on the features that mattered to you.</p></li>
              <li className="how__step"><span className="how__n">03</span><h3>Lock your review</h3><p>It is timestamped and counted in the brand&apos;s score. No business can edit or delete it.</p></li>
            </ol>
            <p className="how__cta"><Link className="btn btn--signal" href="/write-review/">Review now <span><svg aria-hidden="true"><use href="#i-arrow" /></svg></span></Link></p>
            <p className="how__note">Takes about 5 minutes · Free · No paid influence</p>
          </div>
        </div>
      </section>

      {/* 7. RECENT REVIEWS */}
      <section className="section band-mist" id="reviews" aria-labelledby="rv-title">
        <div className="wrap">
          <header className="section__head">
            <span className="tag"><span className="dot dot--signal" />Recent reviews</span>
            <h2 id="rv-title">Real people. Real experiences. On the record.</h2>
            <p className="lead">No review has been locked yet, and we will not invent any. The first ones will appear here the moment they are locked, newest first, with the brand&apos;s reply beside them.</p>
          </header>
          <div className="rvs" aria-label="What a review will look like">
            <div className="rv"><div className="rv__top"><span className="tag">Any sector</span><span className="tag">Date locked</span></div><b>Brand and product name</b><div className="rv__bar" /><p>The rating, from Angry Star to Recommend, with what the person lived through.</p></div>
            <div className="rv"><div className="rv__top"><span className="tag">Any sector</span><span className="tag">Date locked</span></div><b>Brand and product name</b><div className="rv__bar" /><p>The brand&apos;s public reply sits right below, visible to everyone.</p></div>
            <div className="rv"><div className="rv__top"><span className="tag">Any sector</span><span className="tag">Date locked</span></div><b>Brand and product name</b><div className="rv__bar" /><p>If the problem is fixed, the original review stays and the update is added.</p></div>
          </div>
          <p className="rvs-cta"><Link className="btn btn--signal" href="/write-review/">Review now</Link><span>Be one of the first 1,000 voices on the record.</span></p>
        </div>
      </section>

      {/* 8. PUBLIC ACCOUNTABILITY (JUSTICE) */}
      <section className="section" id="justice" aria-labelledby="jus-title">
        <div className="wrap">
          <header className="section__head">
            <span className="tag">Public accountability</span>
            <h2 id="jus-title">When a brand lets people down, the record shows it.</h2>
            <p className="lead">Complaints get lost in call centres and buried in feeds. Here, every experience stays in public view, and every brand answers to the same open record.</p>
          </header>
          <div className="topics">
            <div className="topic"><h3>Heard in public</h3><p>Every locked experience is visible, dated and counted. It cannot be hidden or deleted by the brand.</p></div>
            <div className="topic"><h3>Brands must answer</h3><p>A brand can reply openly and fix the problem. It cannot edit what you said.</p></div>
            <div className="topic"><h3>Patterns raise alerts</h3><p>One bad day is a voice. When many people report the same failure, the product shows a Trust Alert.</p></div>
            <div className="topic"><h3>Fixed, never erased</h3><p>Resolution can rebuild trust. It cannot rewrite history, and only you can update your rating.</p></div>
            <div className="topic"><h3>Same rules for all</h3><p>Every brand, big or small, is scored by the same published method. No one can buy a better score.</p></div>
            <div className="topic"><h3>Your voice counts</h3><p>One honest experience takes about five minutes and helps the next person decide.</p></div>
          </div>
          <p className="rvs-cta"><Link className="btn btn--signal" href="/write-review/">Review now</Link><a className="link" href="#constitution">Read the Constitution <svg aria-hidden="true"><use href="#i-arrow" /></svg></a></p>
        </div>
      </section>

      {/* 9. COMPARE DUEL */}
      <section className="section band-mist" id="compare-duel" aria-labelledby="duel-title">
        <div className="wrap">
          <div className="section__head">
            <span className="tag">No paid placement</span>
            <h2 id="duel-title">Put any two brands side by side.</h2>
            <p className="lead">Many comparison sites earn money from the brands they list. TrustValue takes none from the brands it scores. Pick a sector, pick two brands, and see what people have rated.</p>
          </div>
          <div className="duel-pick duel-sector"><label htmlFor="duel-sector">Sector</label><select id="duel-sector" className="tv-select" /></div>
          <div className="duel-selector">
            <div className="duel-pick"><label htmlFor="duel-a">Brand A</label><select id="duel-a" className="tv-select" /></div>
            <div className="duel-vs">VS</div>
            <div className="duel-pick"><label htmlFor="duel-b">Brand B</label><select id="duel-b" className="tv-select" /></div>
          </div>
          <div className="duel-table-wrap">
            <table className="table duel-table">
              <thead><tr><th>What people rate</th><th id="duel-h1">Brand A</th><th id="duel-h2">Brand B</th></tr></thead>
              <tbody id="duel-body" />
            </table>
          </div>
          <p className="note" style={{ marginTop: "14px" }}>A score appears once a brand has ten experiences. Until then we show the count, never a guess.</p>
          <div className="duel-cta-card">
            <div><h3>Deciding between these two?</h3><p>Get a one-page side-by-side summary the day either brand publishes its first score.</p></div>
            <div data-lf="duel-compare" data-cta="Notify me" data-ph="Work or personal email" />
          </div>
        </div>
      </section>

      {/* 10. FOUNDERS */}
      <section className="section fd" id="founders" aria-labelledby="fd-title">
        <div className="wrap fd__grid">
          <div>
            <p className="tag tag--onnavy"><span className="dot dot--signal" />Founding 1,000 · 1,000 seats open</p>
            <h2 id="fd-title" style={{ marginTop: "16px" }}>The index is empty. Seat 1 is yours.</h2>
            <p className="lead">The first 1,000 locked experiences switch the Trust Index on across all industries. The people who start it are recorded as Founders, permanently.</p>
            <div className="seats" id="seats" aria-hidden="true" />
            <p className="seats__cap">Each dot is 10 seats. 100 dots. All still empty.</p>
            <ul className="perks">
              <li><svg aria-hidden="true"><use href="#i-check" /></svg><span><b>A permanent Founder badge</b> on your profile and public signals.</span></li>
              <li><svg aria-hidden="true"><use href="#i-check" /></svg><span><b>Priority Trust Alert briefings</b> whenever tracked brands trigger risk spikes.</span></li>
              <li><svg aria-hidden="true"><use href="#i-check" /></svg><span><b>Voting power</b> to prioritize which industry opens next.</span></li>
            </ul>
          </div>
          <div className="fd__card">
            <h3>Reserve your Founding seat</h3>
            <p className="s">Takes ten seconds. We message you the day the index opens and when your provider earns its first score.</p>
            <div className="seg seg--navy" id="fd-who" role="radiogroup" aria-label="You are" style={{ marginTop: "18px" }}>
              <button type="button" role="radio" aria-checked="true" data-v="Buyer">Buyer</button>
              <button type="button" role="radio" aria-checked="false" data-v="Customer" tabIndex={-1}>Existing Customer</button>
              <button type="button" role="radio" aria-checked="false" data-v="Aggrieved" tabIndex={-1}>Had a dispute</button>
            </div>
            <div data-lf="founder" data-cta="Reserve My Founding Seat" data-note="Email only. Your name is never shown without your say. Leave any time." />
          </div>
        </div>
      </section>

      {/* 11. CONSTITUTION */}
      <section className="section const" id="constitution" aria-labelledby="const-title">
        <div className="wrap const__grid">
          <div className="const__intro">
            <h2 id="const-title">The TrustValue Constitution</h2>
            <p className="const__claim"><span>People share experiences.</span> <span>TrustValue measures trust.</span></p>
            <p className="lead">Six rules we cannot trade away, because the index is worth nothing the day one of them breaks.</p>
            <p className="const__links">
              <Link className="btn btn--signal" href="/constitution/">Read the full Constitution</Link>
              <Link href="/terms/">Terms &amp; Conditions</Link>
            </p>
          </div>
          <ol className="articles">
            <li><h3>Nothing is fake.</h3><p>A score is built only from experiences people locked themselves. No score is shown until ten people have rated, and every score shows how much evidence stands behind it.</p></li>
            <li><h3>Nothing is editable.</h3><p>No business can edit, hide or delete your experience. It can read it and respond to it. Nothing more.</p></li>
            <li><h3>Nothing is compromised.</h3><p>No one can buy a better Trust Index. There are no paid rankings and no sponsored results. A business can pay for insight, never for a score.</p></li>
            <li><h3>Nothing is customised.</h3><p>Every brand is scored by the same published method. No brand can tailor how its score is worked out or how it is shown.</p></li>
            <li><h3>Only you can change it.</h3><p>Once you lock an experience, it stands until the brand comes to you and solves the problem. Even then, only you can decide to update your rating.</p></li>
            <li><h3>Nothing is rewritten.</h3><p>Resolution can rebuild trust. It cannot rewrite history. The original experience stays on the record with its date.</p></li>
          </ol>
        </div>
      </section>

      {/* 12. EXPLAINED */}
      <section className="section" id="explained" aria-labelledby="explained-title">
        <div className="wrap explained__grid">
          <div className="explained__side">
            <h2 id="explained-title">What is TrustValue?</h2>
            <p className="answer" id="definition">TrustValue.ai is a trust intelligence platform that turns real customer experiences into a measurable Trust Index. People rate a product or service in one gesture, from Angry Star to Recommend, and lock it. Locked experiences roll up into a product score, a brand score and a category index that moves like a market index. No one can buy, edit or delete a score.</p>
            <dl className="facts" aria-label="TrustValue at a glance">
              <div><dt>What it is</dt><dd>A trust intelligence platform, known as The Global Trust Index</dd></div>
              <div><dt>Sectors</dt><dd>18 daily-life sectors mapped; insurance opens first</dd></div>
              <div><dt>Rating scale</dt><dd>Angry Star, 1 to 4, Recommend</dd></div>
              <div><dt>Time to rate</dt><dd>About 7 seconds</dd></div>
              <div><dt>Score</dt><dd>0 to 100, published from 10 experiences</dd></div>
              <div><dt>Index</dt><dd>Base 1,000, live at 1,000 reviews</dd></div>
              <div><dt>Paid placement</dt><dd>None</dd></div>
              <div><dt>Who can change a rating</dt><dd>Only the person who gave it</dd></div>
            </dl>
            <p className="note" style={{ marginTop: "14px" }}>Method v1. Page updated <time dateTime="2026-10-08">8 October 2026</time>. <Link className="inline-link" href="/methodology/">Read the full methodology</Link></p>
            <h3 id="how-read">How to read a score</h3>
            <div className="table-wrap">
              <table className="table table--bands">
                <thead><tr><th scope="col">Score</th><th scope="col">What it means</th></tr></thead>
                <tbody>
                  <tr><td>85 to 100</td><td><span className="band" style={{ "--b": "#0A8754" } as React.CSSProperties}><i />Very high trust</span></td></tr>
                  <tr><td>70 to 84</td><td><span className="band" style={{ "--b": "#58B368" } as React.CSSProperties}><i />High trust</span></td></tr>
                  <tr><td>55 to 69</td><td><span className="band" style={{ "--b": "#FFAA00" } as React.CSSProperties}><i />Moderate trust</span></td></tr>
                  <tr><td>40 to 54</td><td><span className="band" style={{ "--b": "#FF5A0A" } as React.CSSProperties}><i />Low trust</span></td></tr>
                  <tr><td>0 to 39</td><td><span className="band" style={{ "--b": "#F12A0A" } as React.CSSProperties}><i />Very low trust</span></td></tr>
                  <tr><td>No number</td><td><span className="band band--none"><i />Early signals: fewer than 10 experiences so far</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="explained__main">
            <h3 id="how-built">How a TrustValue Score is built</h3>
            <ol className="build">
              <li><b>You rate.</b><span>One gesture on a six-step scale, from Angry Star to Recommend, with optional ratings for five features.</span></li>
              <li><b>It becomes a Trust Signal.</b><span>Your rating converts to a signal from 0 to 100. An Angry Star caps that signal at 50.</span></li>
              <li><b>Signals make the product score.</b><span>A product&apos;s TrustValue Score is the plain average of its eligible signals, counting only your newest one. It appears once ten people have rated, with a range that narrows as evidence grows.</span></li>
              <li><b>Products make the brand score.</b><span>A brand&apos;s score is the weighted average of the scores of its products.</span></li>
              <li><b>Brands make the index.</b><span>Each category and industry index starts at 1,000 and moves with the trust of everything inside it.</span></li>
            </ol>
            <h3 id="vs">TrustValue and star ratings: the difference</h3>
            <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="vs">
              <table className="table table--vs" role="table">
                <thead><tr role="row"><th scope="col" role="columnheader"><span className="sr-only">What is compared</span></th><th scope="col" role="columnheader">Typical star ratings</th><th scope="col" role="columnheader">TrustValue</th></tr></thead>
                <tbody>
                  <tr role="row"><th scope="row" role="rowheader">What you give</th><td role="cell" data-h="Typical star ratings">Stars and a written review</td><td role="cell" data-h="TrustValue">One gesture. Details are optional</td></tr>
                  <tr role="row"><th scope="row" role="rowheader">Time it takes</th><td role="cell" data-h="Typical star ratings">Minutes</td><td role="cell" data-h="TrustValue">About seven seconds</td></tr>
                  <tr role="row"><th scope="row" role="rowheader">What comes out</th><td role="cell" data-h="Typical star ratings">An average rating</td><td role="cell" data-h="TrustValue">A score with its evidence, a brand score and an index that moves</td></tr>
                  <tr role="row"><th scope="row" role="rowheader">Severe failures</th><td role="cell" data-h="Typical star ratings">Averaged away</td><td role="cell" data-h="TrustValue">Flagged by an Angry Star. A pattern raises a Trust Alert</td></tr>
                  <tr role="row"><th scope="row" role="rowheader">Who can change it</th><td role="cell" data-h="Typical star ratings">Varies by site</td><td role="cell" data-h="TrustValue">Only the person who gave it</td></tr>
                  <tr role="row"><th scope="row" role="rowheader">Paid influence</th><td role="cell" data-h="Typical star ratings">Varies by site</td><td role="cell" data-h="TrustValue">None. No paid rankings and no score changes</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 13. GUIDES */}
      <section className="section band-mist" id="guides" aria-labelledby="guides-title">
        <div className="wrap">
          <header className="section__head section__head--split">
            <div className="section__head" style={{ marginBottom: 0 }}>
              <h2 id="guides-title">Before you buy</h2>
              <p className="lead">Plain-language guides to the decisions that are hard to undo, grouped by the sector you came from.</p>
            </div>
            <Link className="link" href="/guides/">All guides <svg aria-hidden="true"><use href="#i-arrow" /></svg></Link>
          </header>
          <div className="topics">
            <Link className="topic" href="/guides/insurance/"><h3>Insurance</h3><p>How much cover is enough, what a claim involves, and how to exit a policy you regret.</p></Link>
            <Link className="topic" href="/guides/banking-and-loans/"><h3>Banking and loans</h3><p>What an interest rate really costs, and what to check before you sign or switch.</p></Link>
            <Link className="topic" href="/guides/investments/"><h3>Investments</h3><p>Fees, lock-ins, and what past returns do and do not tell you.</p></Link>
            <Link className="topic" href="/guides/telecom/"><h3>Telecom and broadband</h3><p>Plans, validity and the charges that appear after you sign up.</p></Link>
            <Link className="topic" href="/guides/automobiles/"><h3>Cars and two-wheelers</h3><p>Warranty terms, service costs and what to ask a dealer.</p></Link>
            <Link className="topic" href="/guides/reading-reviews/"><h3>Reading a review</h3><p>How to tell a real experience from noise, and how a TrustValue Score is built.</p></Link>
          </div>
        </div>
      </section>

      {/* 14. QUESTIONS & FAQ */}
      <section className="section" id="questions" aria-labelledby="faq-title">
        <div className="wrap qa__grid">
          <div>
            <header className="section__head">
              <h2 id="faq-title">Questions people ask</h2>
            </header>
            <div className="faq">
              <details id="faq-what-is-trustvalue-ai" open><summary><h3>What is TrustValue.ai?</h3></summary><p>TrustValue.ai is a trust intelligence platform, also called The Global Trust Index. It turns real customer experiences into a score for each product, a score for each brand and an index for each category, so you can check how much something is trusted before you choose it.</p></details>
              <details id="faq-how-is-trustvalue-different-from-review-sites"><summary><h3>How is TrustValue different from review sites?</h3></summary><p>Review sites collect stars and written opinions and show an average. TrustValue collects one fast gesture, converts it into a Trust Signal, and shows how that signal moves a product score, a brand score and a category index. Severe failures are flagged with an Angry Star instead of being averaged away, and no business can pay to change a score.</p></details>
              <details id="faq-how-do-i-rate-something-on-trustvalue"><summary><h3>How do I rate something on TrustValue?</h3></summary><p>Drag one slider from Angry Star to Recommend. If you want, rate five features as well. Then press Lock my experience. It takes about seven seconds, and writing anything is optional.</p></details>
              <details id="faq-what-is-an-angry-star"><summary><h3>What is an Angry Star?</h3></summary><p>The Angry Star is the lowest point on the TrustValue scale. Use it when an experience broke your trust, not just when it disappointed you. An Angry Star caps your Trust Signal at 50 out of 100, and when 10% or more of a product&apos;s raters give one, the product shows a Trust Alert.</p></details>
              <details id="faq-how-is-a-trustvalue-score-calculated"><summary><h3>How is a TrustValue Score calculated?</h3></summary><p>Each rating becomes a Trust Signal from 0 to 100. A product&apos;s TrustValue Score is the plain average of its eligible signals, counting only the newest signal from each person. The score is published once ten people have rated and is shown with a range that narrows as more evidence comes in.</p></details>
              <details id="faq-when-does-the-trust-index-go-live"><summary><h3>When does the Trust Index go live?</h3></summary><p>The Trust Index goes live when TrustValue crosses 1,000 locked experiences. Each index then opens at a base of 1,000 and moves as trust in its brands and products rises or falls.</p></details>
              <details id="faq-can-a-company-pay-to-improve-or-remove-its-score"><summary><h3>Can a company pay to improve or remove its score?</h3></summary><p>No. Nobody can buy a better score or a better Trust Index, and there are no paid rankings. A business can respond to an experience, but it cannot edit, hide or delete it.</p></details>
              <details id="faq-can-a-rating-be-changed-later"><summary><h3>Can a rating be changed later?</h3></summary><p>Only by the person who gave it. If the brand resolves your problem you can update your rating, and the original stays in the history with its date.</p></details>
              <details id="faq-which-brands-and-products-are-listed-today"><summary><h3>Which sectors and brands are listed today?</h3></summary><p>TrustValue maps 18 daily-life sectors, including insurance, banking and loans, telecom, automobiles, healthcare, education and consumer electronics. 183 brands are listed across them. Insurance opens first, then banking and loans, telecom and automobiles.</p></details>
              <details id="faq-why-does-a-product-show-no-score"><summary><h3>Why does a product show no score?</h3></summary><p>A product shows Early signals until ten people have rated it. Publishing a number on less evidence would be noise, so TrustValue shows the count instead.</p></details>
            </div>
          </div>
          <aside className="gloss" aria-labelledby="gloss-title">
            <h3 id="gloss-title">The words we use</h3>
            <dl>
              <div id="term-trust-signal"><dt>Trust Signal</dt><dd>One person&apos;s experience of one product, converted to a number from 0 to 100.</dd></div>
              <div id="term-trustvalue-score"><dt>TrustValue Score</dt><dd>A product&apos;s score from 0 to 100: the plain average of its Trust Signals, shown with its evidence.</dd></div>
              <div id="term-brand-trustvalue"><dt>Brand TrustValue</dt><dd>A brand&apos;s score: the weighted average of the scores of its products.</dd></div>
              <div id="term-trust-index"><dt>Trust Index</dt><dd>A category or industry measure that starts at 1,000 and moves as trust in its brands and products changes.</dd></div>
              <div id="term-angry-star"><dt>Angry Star</dt><dd>The lowest mark on the scale, for an experience that broke your trust. It caps your signal at 50, and a pattern of them raises a Trust Alert.</dd></div>
              <div id="term-recommend"><dt>Recommend</dt><dd>The highest mark on the scale. More than a top rating: you would tell someone else to choose it.</dd></div>
              <div id="term-lock"><dt>Lock</dt><dd>The moment you confirm your experience. It is timestamped and added to the record.</dd></div>
              <div id="term-resolution"><dt>Resolution</dt><dd>A brand fixing the problem behind a low rating. Only you can then update your rating, and the original stays in the history.</dd></div>
              <div id="term-trustcard"><dt>TrustCard</dt><dd>A shareable card of your locked experience.</dd></div>
              <div id="term-early-signals"><dt>Early signals</dt><dd>The state of a product with fewer than ten experiences: no score yet.</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {/* 15. BRANDS BIZ */}
      <section className="section band-mist" id="brands-biz" aria-labelledby="biz-title">
        <div className="wrap calc">
          <div>
            <h2 id="biz-title">Brands across any sector: you cannot buy this score. You can earn it.</h2>
            <p className="lead" style={{ marginTop: "14px" }}>
              Listen to verified customer telemetry at the exact moment trust breaks. Reply publicly. Resolve grievances. Embed tamper-proof TrustBadges on your checkout funnels.
            </p>
          </div>
          <div className="pain" style={{ margin: 0 }}>
            <b>Get the Corporate Trust Telemetry Preview</b>
            <p>A sample enterprise intelligence report, built from the exact same mathematical rules everyone is benchmarked by.</p>
            <div data-lf="business" data-cta="Request Corporate Preview" data-ph="Work email" />
          </div>
        </div>
      </section>

      {/* 16. NORTH */}
      <section className="north" aria-labelledby="north-title">
        <div className="wrap">
          <h2 id="north-title">Before you experience anything, check its TrustValue.</h2>
          <p className="lead">And after you&apos;ve experienced it, leave its TrustValue for the next person. That is how a Trust Index gets built: one genuine experience at a time.</p>
          <p className="north__cta">
            <Link className="btn btn--signal" href="/write-review/">Write the first review</Link>
            <a className="btn btn--navy" href="#search" data-focus-search>Search a brand</a>
          </p>
          <img className="north__mascot" src="/brand/north__mascot.webp" alt="" width={365} height={760} loading="lazy" />
        </div>
      </section>

      {/* OVERLAYS */}
      <div className="fab sm:hidden" id="fab">
        <Link className="btn btn--signal" href="/write-review/">Write the first review</Link>
      </div>
      <div className="toast" id="toast" role="status" aria-live="polite" />
      {nudgeOpen && (
        <aside className="nudge" id="nudge" role="dialog" aria-label="Founding seat notification">
          <button
            className="x"
            type="button"
            aria-label="Dismiss"
            id="nudge-x"
            onClick={() => setNudgeOpen(false)}
          >
            ×
          </button>
          <b>Seat 1 of 1,000 is still empty.</b>
          <span>Be a Founder of the Global Trust Index.</span>
          <a
            className="btn btn--signal btn--sm"
            href="#founders"
            id="nudge-go"
            onClick={(e) => {
              e.preventDefault();
              setNudgeOpen(false);
              document.querySelector("#founders")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Reserve my seat
          </a>
        </aside>
      )}
    </>
  );
}
