"use client";

import React, { useState, useEffect, useMemo } from "react";

export type CompareMode = "brands" | "products" | "plans";

export interface CompareAttributeDef {
  key: string;
  label: string;
  type: "n" | "b" | "t"; // number | boolean | text
  direction?: "h" | "l"; // higher is better | lower is better
  unit?: string;
  max?: number;
  prefix?: string;
}

export interface CompareSectionDef {
  title: string;
  rows: CompareAttributeDef[];
}

export interface CompareItem {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
  score: number | null;
  tag: string;
  data: Record<string, string | number | boolean | null | undefined>;
}

export interface CompareModeData {
  title: string;
  lede: string;
  sections: CompareSectionDef[];
  items: CompareItem[];
}

export interface CompareViewProps {
  sectorSlug?: string;
  sectorName?: string;
  initialMode?: CompareMode;
  initialPair?: string; // e.g. "a-vs-b"
  lockedEntity?: string; // Slug/ID of locked benchmark entity (e.g. "lic")
  modesData?: Record<CompareMode, CompareModeData>;
}

const BRAND_COLORS = ["#FF5A0A", "#0F2C6E"];

function resolveInitialIndices(
  items: CompareItem[],
  pair: string,
  lock: string
): { a: number; b: number } {
  if (!items || items.length === 0) return { a: 0, b: 0 };

  let m0 = 0;
  let m1 = items.length > 1 ? 1 : 0;

  if (pair && pair.includes("-vs-")) {
    const parts = pair.split("-vs-");
    const s0 = parts[0]?.trim().toLowerCase();
    const s1 = parts[1]?.trim().toLowerCase();
    if (s0) {
      const found0 = items.findIndex((it) => it.id.toLowerCase() === s0 || it.name.toLowerCase().includes(s0));
      if (found0 !== -1) m0 = found0;
    }
    if (s1) {
      const found1 = items.findIndex((it) => it.id.toLowerCase() === s1 || it.name.toLowerCase().includes(s1));
      if (found1 !== -1) m1 = found1;
    }
    if (m0 === m1 && items.length > 1) {
      m1 = m0 === 0 ? 1 : 0;
    }
  }

  // If a locked benchmark is specified, ensure it sits at index A (left side)
  if (lock) {
    const l = lock.toLowerCase();
    const isLockMatch = (it?: CompareItem) =>
      Boolean(it && (it.id.toLowerCase() === l || it.name.toLowerCase().includes(l)));

    if (isLockMatch(items[m1])) {
      // Swapped so the locked entity is on Side A (left)
      return { a: m1, b: m0 };
    }
    if (isLockMatch(items[m0])) {
      return { a: m0, b: m1 };
    }
    // Search the rest of items
    const foundLock = items.findIndex(isLockMatch);
    if (foundLock !== -1) {
      const other = m0 !== foundLock ? m0 : m1 !== foundLock ? m1 : (foundLock === 0 ? 1 : 0);
      return { a: foundLock, b: other < items.length ? other : 0 };
    }
  }

  return { a: m0, b: m1 };
}

// Default full reference dataset from the design prototype
const DEFAULT_MODES_DATA: Record<CompareMode, CompareModeData> = {
  brands: {
    title: "Brands",
    lede: "Insurers head to head: claims record, service speed and how customers rate them.",
    sections: [
      {
        title: "TrustValue standing",
        rows: [
          { key: "score", label: "TrustValue Score", type: "n", direction: "h", unit: "", max: 100 },
          { key: "ratings", label: "Locked ratings", type: "n", direction: "h", unit: "", max: 3000 },
        ],
      },
      {
        title: "Claims and service",
        rows: [
          { key: "csr", label: "Claim settlement ratio", type: "n", direction: "h", unit: "%", max: 100 },
          { key: "days", label: "Average days to settle", type: "n", direction: "l", unit: " days", max: 30 },
          { key: "comp", label: "Complaints per 10,000 policies", type: "n", direction: "l", unit: "", max: 60 },
          { key: "resolved", label: "Complaints resolved in 30 days", type: "n", direction: "h", unit: "%", max: 100 },
        ],
      },
      {
        title: "The company",
        rows: [
          { key: "yrs", label: "Years in business", type: "n", direction: "h", unit: " yrs", max: 40 },
          { key: "plansN", label: "Audited plans on sale", type: "n", direction: "h", unit: "", max: 12 },
          { key: "solv", label: "Solvency ratio", type: "n", direction: "h", unit: "x", max: 3 },
          { key: "app", label: "Policy app support", type: "b" },
          { key: "hq", label: "Headquarters", type: "t" },
        ],
      },
      {
        title: "Trust and transparency",
        rows: [
          { key: "irdai", label: "IRDAI registered", type: "b" },
          { key: "pub", label: "Publishes claim data", type: "b" },
          { key: "ver", label: "Reviews verified on TrustValue", type: "b" },
        ],
      },
    ],
    items: [
      {
        id: "icici",
        name: "ICICI Life Insurance",
        initials: "IL",
        subtitle: "Formerly ICICI Prudential Life",
        score: null,
        tag: "Not rated yet",
        data: {
          score: null,
          ratings: 0,
          csr: 98.4,
          days: 5,
          comp: 12,
          resolved: 97,
          yrs: 24,
          plansN: 8,
          solv: 2.1,
          app: true,
          hq: "Mumbai",
          irdai: true,
          pub: true,
          ver: false,
        },
      },
      {
        id: "north",
        name: "Northstar Life",
        initials: "NL",
        subtitle: "Private Life Insurer",
        score: 78,
        tag: "Strong",
        data: {
          score: 78,
          ratings: 2140,
          csr: 98.4,
          days: 6,
          comp: 14,
          resolved: 96,
          yrs: 22,
          plansN: 5,
          solv: 2.1,
          app: true,
          hq: "Mumbai",
          irdai: true,
          pub: true,
          ver: true,
        },
      },
      {
        id: "kavach",
        name: "Kavach Assurance",
        initials: "KA",
        subtitle: "General & Life Underwriter",
        score: 71,
        tag: "Solid",
        data: {
          score: 71,
          ratings: 1320,
          csr: 97.1,
          days: 9,
          comp: 22,
          resolved: 93,
          yrs: 18,
          plansN: 4,
          solv: 1.9,
          app: true,
          hq: "Pune",
          irdai: true,
          pub: true,
          ver: false,
        },
      },
      {
        id: "samarth",
        name: "Samarth Life",
        initials: "SL",
        subtitle: "National Composite Insurer",
        score: 64,
        tag: "Mixed",
        data: {
          score: 64,
          ratings: 880,
          csr: 95.6,
          days: 12,
          comp: 31,
          resolved: 88,
          yrs: 25,
          plansN: 7,
          solv: 1.7,
          app: false,
          hq: "Delhi",
          irdai: true,
          pub: false,
          ver: false,
        },
      },
    ],
  },
  products: {
    title: "Products",
    lede: "Compare term products across brands, or two products from the same insurer.",
    sections: [
      {
        title: "TrustValue standing",
        rows: [
          { key: "score", label: "TrustValue Score", type: "n", direction: "h", unit: "", max: 100 },
          { key: "ratings", label: "Locked ratings", type: "n", direction: "h", unit: "", max: 3000 },
        ],
      },
      {
        title: "What it pays",
        rows: [
          { key: "pay", label: "Payout options", type: "n", direction: "h", unit: "", max: 6 },
          { key: "early", label: "Early payout on a claim", type: "b" },
          { key: "terminal", label: "Terminal illness built in", type: "b" },
          { key: "accident", label: "Accidental death cover", type: "b" },
        ],
      },
      {
        title: "Flexibility and price",
        rows: [
          { key: "premium", label: "Monthly premium, age 30, ₹1 crore", type: "n", direction: "l", unit: "", max: 2000, prefix: "₹" },
          { key: "entry", label: "Entry age", type: "t" },
          { key: "brk", label: "Premium break allowed", type: "b" },
          { key: "free", label: "Free-look period", type: "n", direction: "h", unit: " days", max: 30 },
        ],
      },
      {
        title: "Fine print",
        rows: [
          { key: "med", label: "Medical test requirement", type: "t" },
          { key: "excl", label: "Main exclusion", type: "t" },
          { key: "wait", label: "Waiting period on death claim", type: "t" },
          { key: "bestfor", label: "Who it suits best", type: "t" },
        ],
      },
    ],
    items: [
      {
        id: "ip",
        name: "iProtect Smart Plus",
        initials: "IP",
        subtitle: "ICICI Life · Comprehensive Term",
        score: null,
        tag: "Not rated yet",
        data: {
          score: null,
          ratings: 0,
          pay: 4,
          early: true,
          terminal: true,
          accident: true,
          premium: 790,
          entry: "18 to 65 years",
          brk: true,
          free: 30,
          med: "Based on age, cover and health",
          excl: "Suicide within first 12 months",
          wait: "None on accidental or immediate cover",
          bestfor: "Families who want income, not just a lump sum",
        },
      },
      {
        id: "shield",
        name: "Shield Max",
        initials: "SM",
        subtitle: "Northstar Life · Core Plan",
        score: 81,
        tag: "Strong",
        data: {
          score: 81,
          ratings: 1280,
          pay: 3,
          early: false,
          terminal: true,
          accident: true,
          premium: 845,
          entry: "18 to 60 years",
          brk: false,
          free: 30,
          med: "Tele-medical above ₹1 crore",
          excl: "Suicide in first 12 months",
          wait: "90 days for critical illness",
          bestfor: "Salaried buyers wanting broad cover",
        },
      },
      {
        id: "lite",
        name: "Shield Lite",
        initials: "SL",
        subtitle: "Northstar Life · Budget Plan",
        score: 72,
        tag: "Solid",
        data: {
          score: 72,
          ratings: 640,
          pay: 2,
          early: false,
          terminal: false,
          accident: false,
          premium: 690,
          entry: "18 to 55 years",
          brk: false,
          free: 15,
          med: "Declaration only up to ₹50 lakh",
          excl: "Suicide in first 12 months",
          wait: "None",
          bestfor: "First-time buyers on a budget",
        },
      },
      {
        id: "secure",
        name: "SecureTerm",
        initials: "ST",
        subtitle: "Kavach Assurance · Return of Premium",
        score: 74,
        tag: "Solid",
        data: {
          score: 74,
          ratings: 710,
          pay: 3,
          early: true,
          terminal: true,
          accident: false,
          premium: 780,
          entry: "18 to 65 years",
          brk: true,
          free: 30,
          med: "Tele-medical",
          excl: "Suicide in first 12 months",
          wait: "90 days for critical illness",
          bestfor: "Buyers who want money back at the end",
        },
      },
    ],
  },
  plans: {
    title: "Plans",
    lede: "Compare plan variants and cover levels: the same product, or different brands.",
    sections: [
      {
        title: "TrustValue standing",
        rows: [
          { key: "score", label: "TrustValue Score", type: "n", direction: "h", unit: "", max: 100 },
        ],
      },
      {
        title: "Cover",
        rows: [
          { key: "cover", label: "Sum assured", type: "n", direction: "h", unit: " crore", max: 3, prefix: "₹" },
          { key: "till", label: "Cover until age", type: "n", direction: "h", unit: " yrs", max: 100 },
          { key: "accident", label: "Accidental death cover", type: "b" },
          { key: "ci", label: "Critical illness cover", type: "b" },
          { key: "income", label: "Monthly income to family", type: "b" },
        ],
      },
      {
        title: "Price",
        rows: [
          { key: "premium", label: "Monthly premium, age 30", type: "n", direction: "l", unit: "", max: 2500, prefix: "₹" },
          { key: "per", label: "Premium per ₹1 crore of cover", type: "n", direction: "l", unit: "", max: 2500, prefix: "₹" },
        ],
      },
      {
        title: "Fine details",
        rows: [
          { key: "payout", label: "How family receives payout", type: "t" },
          { key: "best", label: "Best suited for", type: "t" },
        ],
      },
    ],
    items: [
      {
        id: "ipl",
        name: "iProtect Smart Plus · Life Plus",
        initials: "LP",
        subtitle: "ICICI Life · Accidental death up to ₹3 crore",
        score: null,
        tag: "Not rated yet",
        data: {
          score: null,
          cover: 1,
          till: 85,
          accident: true,
          ci: false,
          income: true,
          premium: 980,
          per: 980,
          payout: "Lump sum, income, both, or rising income",
          best: "Families who also want accident cover",
        },
      },
      {
        id: "ipb",
        name: "iProtect Smart Plus · Life",
        initials: "IL",
        subtitle: "ICICI Life · Core variant",
        score: null,
        tag: "Not rated yet",
        data: {
          score: null,
          cover: 1,
          till: 85,
          accident: false,
          ci: false,
          income: true,
          premium: 790,
          per: 790,
          payout: "Lump sum, income, both, or rising income",
          best: "Families who want flexible payouts",
        },
      },
      {
        id: "nc",
        name: "Shield Max · Classic",
        initials: "MC",
        subtitle: "Northstar Life · Core Tier",
        score: 80,
        tag: "Strong",
        data: {
          score: 80,
          cover: 1,
          till: 85,
          accident: false,
          ci: false,
          income: false,
          premium: 845,
          per: 845,
          payout: "Lump sum only",
          best: "Simple cover at the lowest price",
        },
      },
      {
        id: "np",
        name: "Shield Max · Plus",
        initials: "MP",
        subtitle: "Northstar Life · Comprehensive Tier",
        score: 82,
        tag: "Strong",
        data: {
          score: 82,
          cover: 2,
          till: 90,
          accident: true,
          ci: true,
          income: true,
          premium: 1750,
          per: 875,
          payout: "Lump sum plus income",
          best: "Buyers wanting cover that does more",
        },
      },
    ],
  },
};

const NEWS_DATABASE: Record<string, [string, string, string][]> = {
  icici: [
    ["13 Oct 2026", "iProtect Smart Plus is listed on TrustValue with transparent disclosures", "TrustValue"],
    ["4 Sep 2025", "GST exemption on life policies: what it means for term premiums", "Business Standard"],
  ],
  north: [
    ["28 Oct 2026", "Northstar Life reports faster turnaround time in latest regulatory filing", "Official Gazette"],
    ["15 Sep 2026", "Shield Max adds enhanced critical illness rider with zero wait", "Financial Express"],
  ],
  kavach: [
    ["20 Oct 2026", "Kavach Assurance expands cashless network to 220 hospital centers", "Consumer Watch"],
    ["2 Sep 2026", "SecureTerm introduces flexible premium pause options for customers", "Mint"],
  ],
  samarth: [
    ["18 Oct 2026", "Samarth Life widens branch footprint across tier-2 cities", "Economic Times"],
    ["10 Aug 2026", "Annual solvency margin audited comfortably above IRDAI norms", "Reuters"],
  ],
};

export default function CompareView({
  sectorSlug = "insurance",
  sectorName = "Insurance",
  initialMode = "products",
  initialPair = "",
  lockedEntity = "",
  modesData = DEFAULT_MODES_DATA,
}: CompareViewProps) {
  const [mode, setMode] = useState<CompareMode>(initialMode);
  const currentModeData = modesData[mode] || modesData.products;

  // Read locked benchmark from prop or URL search param
  const effectiveLock = useMemo(() => {
    if (lockedEntity) return lockedEntity.trim().toLowerCase();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return (params.get("lock") || params.get("from") || "").trim().toLowerCase();
    }
    return "";
  }, [lockedEntity]);

  const [unlocked, setUnlocked] = useState<boolean>(false);

  // Initialize indices placing locked entity on Side A
  const [indices, setIndices] = useState(() =>
    resolveInitialIndices(currentModeData.items, initialPair, effectiveLock)
  );

  const idxA = indices.a;
  const idxB = indices.b;

  const setIdxA = (val: number) => setIndices((prev) => ({ ...prev, a: val }));
  const setIdxB = (val: number) => setIndices((prev) => ({ ...prev, b: val }));

  // Check if Side A is currently locked as a reference benchmark
  const isLockedA = useMemo(() => {
    if (unlocked || !effectiveLock) return false;
    const currentItemA = currentModeData.items[idxA];
    if (!currentItemA) return false;
    const l = effectiveLock.toLowerCase();
    return currentItemA.id.toLowerCase() === l || currentItemA.name.toLowerCase().includes(l);
  }, [unlocked, effectiveLock, currentModeData.items, idxA]);

  const [diffOnly, setDiffOnly] = useState<boolean>(false);
  const [pickSide, setPickSide] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Entities on left and right
  const itemA = currentModeData.items[idxA] || currentModeData.items[0];
  const itemB = currentModeData.items[idxB] || currentModeData.items[1] || currentModeData.items[0];

  // Reset indices if mode changes
  const handleModeChange = (newMode: CompareMode) => {
    setMode(newMode);
    const resolved = resolveInitialIndices(modesData[newMode].items, "", effectiveLock);
    setIndices(resolved);
    setPickSide(null);
  };

  const handleSwap = () => {
    if (isLockedA) {
      showToast(`${itemA?.name} is locked on the left as your source benchmark.`);
      return;
    }
    setIndices((prev) => ({ a: prev.b, b: prev.a }));
    setPickSide(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handlePick = (side: 0 | 1) => {
    setPickSide(side);
    const chosen = side === 0 ? itemA : itemB;
    showToast(`Noted. ${chosen.name} is your pick. Rate it to make your voice count.`);
  };

  // Helper formatting for values
  const formatCellValue = (val: unknown, rowDef: CompareAttributeDef): string => {
    if (val === undefined || val === null || val === "") return "";
    if (rowDef.type === "b") return val ? "✔" : "✕";
    const prefix = rowDef.prefix || "";
    const unit = rowDef.unit || "";
    if (typeof val === "number") {
      return `${prefix}${val >= 1000 ? val.toLocaleString("en-IN") : val}${unit}`;
    }
    return String(val);
  };

  // Compare rule: returns 1 if A wins, -1 if B wins, 0 if tie or not comparable
  const compareRule = (rowDef: CompareAttributeDef, valA: unknown, valB: unknown): number => {
    if (rowDef.type === "t") return 0;
    if (rowDef.type === "b") {
      if (valA === null || valB === null || valA === undefined || valB === undefined || valA === valB) return 0;
      return valA ? 1 : -1;
    }
    if (valA === null || valB === null || valA === undefined || valB === undefined || valA === valB) return 0;
    const numA = typeof valA === "number" ? valA : parseFloat(String(valA));
    const numB = typeof valB === "number" ? valB : parseFloat(String(valB));
    if (isNaN(numA) || isNaN(numB)) return 0;
    const higherIsBetter = rowDef.direction !== "l";
    return higherIsBetter ? (numA > numB ? 1 : -1) : (numA < numB ? 1 : -1);
  };

  // Evaluation computation
  const evaluation = useMemo(() => {
    let winsA = 0;
    let winsB = 0;
    let levelTies = 0;

    const sectionsEvaluated = currentModeData.sections.map((sec) => {
      let secWinsA = 0;
      let secWinsB = 0;

      const evaluatedRows = sec.rows
        .map((row) => {
          const valA = itemA?.data?.[row.key];
          const valB = itemB?.data?.[row.key];
          const result = compareRule(row, valA, valB);

          if (result > 0) {
            winsA++;
            secWinsA++;
          } else if (result < 0) {
            winsB++;
            secWinsB++;
          } else {
            levelTies++;
          }

          // Compute progress bar width for numeric attributes
          let barPctA = 0;
          let barPctB = 0;
          if (row.type === "n" && row.max) {
            if (typeof valA === "number") barPctA = Math.min(100, Math.round((valA / row.max) * 100));
            if (typeof valB === "number") barPctB = Math.min(100, Math.round((valB / row.max) * 100));
          }

          return {
            row,
            valA,
            valB,
            result,
            isDiff: valA !== valB,
            barPctA,
            barPctB,
          };
        })
        .filter((r) => {
          if (!diffOnly) return true;
          return r.isDiff;
        });

      return {
        sec,
        rows: evaluatedRows,
        secWinsA,
        secWinsB,
      };
    });

    const total = winsA + winsB + levelTies || 1;
    const widthA = Math.round((winsA / total) * 100);
    const widthTie = Math.round((levelTies / total) * 100);
    const widthB = Math.max(0, 100 - widthA - widthTie);

    let summaryText = "";
    if (winsA === winsB) {
      summaryText = "Too close to call on what we know today";
    } else if (winsA > winsB) {
      summaryText = `${itemA.name} leads on ${winsA} of ${winsA + winsB + levelTies} details`;
    } else {
      summaryText = `${itemB.name} leads on ${winsB} of ${winsA + winsB + levelTies} details`;
    }

    return {
      winsA,
      winsB,
      levelTies,
      widthA,
      widthTie,
      widthB,
      summaryText,
      sectionsEvaluated,
    };
  }, [currentModeData, itemA, itemB, diffOnly]);

  const newsA = NEWS_DATABASE[itemA?.id] || [
    ["Latest", `${itemA?.name} disclosures and quarterly performance filing verified.`, "Public Record"],
    ["Regulatory", "Annual consumer protection and claim turnaround standards audited.", "IRDAI"],
  ];
  const newsB = NEWS_DATABASE[itemB?.id] || [
    ["Latest", `${itemB?.name} disclosures and quarterly performance filing verified.`, "Public Record"],
    ["Regulatory", "Annual consumer protection and claim turnaround standards audited.", "IRDAI"],
  ];

  return (
    <div className="cmp-page">
      {/* Hero Section */}
      <section className="cmp-hero" id="top">
        <div className="cmp-wrap">
          <p className="cmp-kick">
            <i />
            Head to head
          </p>
          <h1>Pick two. See who earns it.</h1>
          <p className="cmp-lede">Choose any two from the menus and every detail lines up side by side.</p>

          <div className="cmp-seg" role="radiogroup" aria-label="What to compare">
            <button
              type="button"
              role="radio"
              aria-checked={mode === "brands"}
              onClick={() => handleModeChange("brands")}
            >
              Brands
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "products"}
              onClick={() => handleModeChange("products")}
            >
              Products
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "plans"}
              onClick={() => handleModeChange("plans")}
            >
              Plans
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Arena */}
      <div className="cmp-wrap" id="cmp-main">
        {/* Arena Dual Cards */}
        <div className="cmp-arena">
          <div className="cmp-arena__row">
            {/* Side A */}
            <div
              className={`cmp-side ${evaluation.winsA > evaluation.winsB ? "win" : ""} ${pickSide === 0 ? "picked" : ""}`}
              style={{ ["--c" as string]: BRAND_COLORS[0] }}
            >
              <div className="cmp-mono" style={{ background: BRAND_COLORS[0] }}>
                {itemA?.initials || "A"}
              </div>
              <div className="w-full">
                <select
                  className={`cmp-sel ${isLockedA ? "cmp-sel--locked" : ""}`}
                  aria-label={isLockedA ? "Locked benchmark provider" : "Choose left side"}
                  value={idxA}
                  disabled={isLockedA}
                  onChange={(e) => {
                    if (isLockedA) return;
                    setIdxA(Number(e.target.value));
                    setPickSide(null);
                  }}
                >
                  {currentModeData.items.map((opt, i) => (
                    <option key={opt.id} value={i} disabled={i === idxB}>
                      {opt.name} {isLockedA && i === idxA ? " 🔒 (Locked)" : ""}
                    </option>
                  ))}
                </select>

                {isLockedA && (
                  <div className="cmp-lock-badge-wrap">
                    <span className="cmp-lock-badge" title="Locked reference benchmark">
                      <i className="fa-solid fa-lock text-[10px]" /> Locked Benchmark
                    </span>
                    <button
                      type="button"
                      className="cmp-unlock-btn"
                      onClick={() => {
                        setUnlocked(true);
                        showToast("Benchmark unlocked. You can now select any provider on the left.");
                      }}
                      title="Unlock left benchmark"
                    >
                      Unlock
                    </button>
                  </div>
                )}
              </div>
              <p className="cmp-side__sub">{itemA?.subtitle}</p>

              <div
                className="cmp-ring"
                style={{
                  background: `conic-gradient(${BRAND_COLORS[0]} ${itemA?.score || 0}%, var(--cmp-mist) 0)`,
                }}
              >
                <b>
                  {itemA?.score ?? "–"}
                  <small>score</small>
                </b>
              </div>
              <span className="cmp-tag">{itemA?.tag}</span>
            </div>

            {/* Floating VS Orb */}
            <div className="cmp-vs" aria-hidden="true">
              VS
            </div>

            {/* Side B */}
            <div
              className={`cmp-side ${evaluation.winsB > evaluation.winsA ? "win" : ""} ${pickSide === 1 ? "picked" : ""}`}
              style={{ ["--c" as string]: BRAND_COLORS[1] }}
            >
              <div className="cmp-mono" style={{ background: BRAND_COLORS[1] }}>
                {itemB?.initials || "B"}
              </div>
              <select
                className="cmp-sel"
                aria-label="Choose competitor to benchmark"
                value={idxB}
                onChange={(e) => {
                  setIdxB(Number(e.target.value));
                  setPickSide(null);
                }}
              >
                {currentModeData.items.map((opt, i) => (
                  <option key={opt.id} value={i} disabled={i === idxA}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <p className="cmp-side__sub">{itemB?.subtitle}</p>

              <div
                className="cmp-ring"
                style={{
                  background: `conic-gradient(${BRAND_COLORS[1]} ${itemB?.score || 0}%, var(--cmp-mist) 0)`,
                }}
              >
                <b>
                  {itemB?.score ?? "–"}
                  <small>score</small>
                </b>
              </div>
              <span className="cmp-tag">{itemB?.tag}</span>
            </div>
          </div>
        </div>

        {/* Action Tools Bar */}
        <div className="cmp-tools">
          <button
            className="cmp-chip"
            aria-pressed={diffOnly}
            type="button"
            onClick={() => setDiffOnly(!diffOnly)}
          >
            ◐ Show differences only
          </button>
          <button
            className={`cmp-chip ${isLockedA ? "opacity-60" : ""}`}
            type="button"
            onClick={handleSwap}
            title={isLockedA ? "Benchmark side is locked" : "Swap sides"}
          >
            ⇄ Swap sides {isLockedA ? "(Locked)" : ""}
          </button>
        </div>

        {/* Split Score Tally Section */}
        <section className="cmp-score" aria-live="polite">
          <h2>{evaluation.summaryText}</h2>
          <div className="cmp-split">
            <i style={{ width: `${evaluation.widthA}%`, background: BRAND_COLORS[0] }} />
            <i style={{ width: `${evaluation.widthTie}%`, background: "#C7CFDB" }} />
            <i style={{ width: `${evaluation.widthB}%`, background: BRAND_COLORS[1] }} />
          </div>
          <div className="cmp-split__l">
            <span style={{ color: BRAND_COLORS[0] }}>{evaluation.winsA} wins</span>
            <span style={{ color: "var(--cmp-ink-3)" }}>{evaluation.levelTies} level</span>
            <span style={{ color: BRAND_COLORS[1] }}>{evaluation.winsB} wins</span>
          </div>
        </section>

        {/* Dynamic Comparison Sections & Rows */}
        <div id="rows">
          {evaluation.sectionsEvaluated.map((secWrap, sIdx) => {
            if (secWrap.rows.length === 0) return null;
            return (
              <section key={sIdx} className="cmp-sec">
                <h3>
                  {secWrap.sec.title}
                  {secWrap.secWinsA + secWrap.secWinsB > 0 && (
                    <span>
                      <b style={{ color: BRAND_COLORS[0] }}>{secWrap.secWinsA}</b> –{" "}
                      <b style={{ color: BRAND_COLORS[1] }}>{secWrap.secWinsB}</b>
                    </span>
                  )}
                </h3>

                {secWrap.rows.map(({ row, valA, valB, result, barPctA, barPctB }, rIdx) => {
                  const isWinnerA = result > 0;
                  const isWinnerB = result < 0;

                  return (
                    <div key={rIdx} className="cmp-row">
                      <p className="cmp-row__l">
                        {row.label}
                        {row.direction === "l" && " · lower is better"}
                      </p>

                      <div className="cmp-row__v">
                        {/* Cell A */}
                        <div
                          className={`cmp-cell ${isWinnerA ? "w" : ""}`}
                          style={{ ["--c" as string]: BRAND_COLORS[0] }}
                        >
                          {valA === undefined || valA === null || valA === "" ? (
                            <span className="cmp-nil">Not available yet</span>
                          ) : row.type === "b" ? (
                            <span className={valA ? "cmp-yes" : "cmp-no"}>{valA ? "✔" : "✕"}</span>
                          ) : (
                            formatCellValue(valA, row)
                          )}
                          {row.type === "n" && barPctA > 0 && (
                            <div className="cmp-bar" style={{ ["--c" as string]: BRAND_COLORS[0] }}>
                              <i style={{ width: `${barPctA}%` }} />
                            </div>
                          )}
                        </div>

                        {/* Cell B */}
                        <div
                          className={`cmp-cell ${isWinnerB ? "w" : ""}`}
                          style={{ ["--c" as string]: BRAND_COLORS[1] }}
                        >
                          {valB === undefined || valB === null || valB === "" ? (
                            <span className="cmp-nil">Not available yet</span>
                          ) : row.type === "b" ? (
                            <span className={valB ? "cmp-yes" : "cmp-no"}>{valB ? "✔" : "✕"}</span>
                          ) : (
                            formatCellValue(valB, row)
                          )}
                          {row.type === "n" && barPctB > 0 && (
                            <div className="cmp-bar" style={{ ["--c" as string]: BRAND_COLORS[1] }}>
                              <i style={{ width: `${barPctB}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        {/* Voting Question & CTA */}
        <p className="cmp-pick" id="rate">
          Which one would you pick?
        </p>
        <div className="cmp-cta">
          <button
            className="cmp-btn"
            style={{ ["--c" as string]: BRAND_COLORS[0] }}
            type="button"
            onClick={() => handlePick(0)}
          >
            I’d pick {itemA?.name}
          </button>
          <button
            className="cmp-btn"
            style={{ ["--c" as string]: BRAND_COLORS[1] }}
            type="button"
            onClick={() => handlePick(1)}
          >
            I’d pick {itemB?.name}
          </button>
        </div>

        {/* Current News Block */}
        <section className="cmp-blk cmp-news" aria-labelledby="news-title">
          <h2 id="news-title">Current news</h2>
          <p className="cmp-blk__s">Latest on each side of this comparison from verified sources.</p>

          <div className="cmp-news__g">
            <div style={{ ["--c" as string]: BRAND_COLORS[0] }}>
              <p className="cmp-news__h">{itemA?.name}</p>
              {newsA.map(([date, title, source], idx) => (
                <div key={idx} className="cmp-nw">
                  <time>{date}</time>
                  <p>{title}</p>
                  <em>{source}</em>
                </div>
              ))}
            </div>

            <div style={{ ["--c" as string]: BRAND_COLORS[1] }}>
              <p className="cmp-news__h">{itemB?.name}</p>
              {newsB.map(([date, title, source], idx) => (
                <div key={idx} className="cmp-nw">
                  <time>{date}</time>
                  <p>{title}</p>
                  <em>{source}</em>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Block */}
        <section className="cmp-blk cmp-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Frequently asked questions</h2>
          <p className="cmp-blk__s">Quick answers about this comparison.</p>

          <details open>
            <summary>How does TrustValue compare {itemA?.name} and {itemB?.name}?</summary>
            <p>
              Both sides are lined up on the same details. The better value in each row gets a tick.
              Rows where lower is better, such as premium or days to settle, say so. Rows that are plain
              text have no winner.
            </p>
          </details>

          <details>
            <summary>Why do I see “Not available yet”? </summary>
            <p>
              We only show a figure when we have a source for it. A blank never counts as a win or a loss.
              Ratings appear once verified policyholders lock them in.
            </p>
          </details>

          <details>
            <summary>What does the TrustValue Score mean?</summary>
            <p>
              It reflects ratings that verified policyholders have locked in. A plan with no ratings yet has
              no score, so it is shown as not rated.
            </p>
          </details>

          <details>
            <summary>Can I compare two options from the same insurer?</summary>
            <p>
              Yes. Pick any two from the menus above, including two from the same brand. Use Swap sides to flip them.
            </p>
          </details>

          <details>
            <summary>How do I use this to choose?</summary>
            <p>
              Start with Show differences only, then read the section tallies. Check the Fine print and
              Best for sections before you decide, and rate your own policy to help others.
            </p>
          </details>
        </section>
      </div>

      {/* Floating Toast Notification */}
      <div className={`cmp-toast ${toastMessage ? "on" : ""}`} role="status">
        {toastMessage}
      </div>
    </div>
  );
}
