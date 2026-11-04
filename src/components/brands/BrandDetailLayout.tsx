"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import CompareSection, { ComparePeerItem } from "@/components/compare/CompareSection";

export interface FactItem {
  key: string;
  val: string;
  citation?: string;
}

export interface WarningItem {
  text: string;
  citation?: string;
}

export interface NewsItem {
  date: string;
  title: string;
  desc: string;
  citation?: string;
}

export interface BrandProductItem {
  slug: string;
  name: string;
  categoryName?: string;
  summary?: string;
  badge?: string;
  metrics?: { label: string; value: string }[];
  href: string;
}

export interface BrandDetailLayoutProps {
  entityType?: "plan" | "product" | "brand";
  title?: string;
  categoryName?: string;
  categorySlug?: string;
  providerName?: string;
  providerSlug?: string;
  sectorSlug?: string;
  summary?: string;
  lastVerified?: string;
  claimSettlementRatio?: string;
  solvencyRatio?: string;
  turnaroundDays?: string;
  trustScore?: number;
  facts?: FactItem[];
  warnings?: WarningItem[];
  newsList?: NewsItem[];
  aboutContent?: string[];
  products?: BrandProductItem[];
  comparePeers?: ComparePeerItem[];
  sameBrandComparePeers?: ComparePeerItem[];
  allCompareOptions?: { slug: string; name: string; brandName?: string }[];
}

export default function BrandDetailLayout({
  entityType = "plan",
  title = "Northwind Term Shield",
  categoryName = "Term plan",
  categorySlug = "life/term-insurance",
  providerName = "Northwind Life Insurance",
  providerSlug = "northwind",
  sectorSlug = "insurance",
  summary = "Pure risk individual life protection with zero co-pay, guaranteed claims escalation SLA, and terminal illness rider.",
  lastVerified = "2026-10-29",
  claimSettlementRatio = "98.10%",
  solvencyRatio = "2.12x",
  turnaroundDays = "4.2 days",
  trustScore = 94.2,
  facts,
  warnings,
  newsList,
  aboutContent,
  products,
  comparePeers,
  sameBrandComparePeers,
  allCompareOptions,
}: BrandDetailLayoutProps) {
  // Story player states (Independent standalone summary of whole page)
  const [activeCard, setActiveCard] = useState<number>(0); // Starts at Card 0 (New on TrustValue)
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [fullScreenModal, setFullScreenModal] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<string>("standing");

  const touchStartY = useRef<number>(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: "left" | "right") => {
    if (productsScrollRef.current) {
      const offset = direction === "left" ? -330 : 330;
      productsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Interactive question input state
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Rating slider states
  const [sliderValue, setSliderValue] = useState<number>(3.5);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Subtle Web Audio chime on card advance
  const playBeep = (freq = 440) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // 6 Story Cards: clean, balanced summary of whole page
  const storyCards = [
    {
      id: "standing",
      index: 1,
      name: "Standing & Score",
      badgeText: "NEW ON TRUSTVALUE",
      badge: "Card 1 of 6",
      renderBody: () => (
        <div className="flex flex-col items-center justify-center my-auto py-2 text-center w-full">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#2FD08A"
                strokeWidth="10"
                strokeDasharray="251"
                strokeDashoffset="15"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-white leading-none">{trustScore}</span>
              <span className="text-[9px] uppercase font-bold text-[#2FD08A] tracking-wider mt-0.5">Top 1%</span>
            </div>
          </div>
          <div className="text-sm font-extrabold text-white mt-2.5">Category Leader</div>
          <p className="text-[11px] text-white/80 text-center mt-1 max-w-[210px] leading-snug font-medium">
            IRDAI Solvency 2.12x • 0 Unresolved Grievances
          </p>
        </div>
      ),
      renderStoryBody: () => (
        <div className="flex flex-col items-center justify-center text-center py-4 w-full">
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="11" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#FF5A0A"
                strokeWidth="11"
                strokeDasharray="314"
                strokeDashoffset="24"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white leading-none tracking-tight">{trustScore}</span>
              <span className="text-xs font-bold text-[#2FD08A] mt-1 tracking-wider uppercase">Category Leader</span>
            </div>
          </div>
          <div className="text-base font-extrabold text-white">Top 1% Verified In Sector</div>
          <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-[280px]">
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-semibold text-white">IRDAI Solvency: {solvencyRatio}</span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-semibold text-white">Claim Speed: {turnaroundDays}</span>
          </div>
          <p className="text-xs text-white/80 mt-3 max-w-[260px] leading-relaxed">
            Zero unresolved policyholder complaints on official council register.
          </p>
        </div>
      ),
    },
    {
      id: "the-facts",
      index: 2,
      name: "The Facts",
      badgeText: "IN 10 SECONDS",
      badge: "Card 2 of 6",
      renderBody: () => (
        <div className="flex flex-col items-center justify-center my-auto py-2 w-full px-2 text-center">
          <div className="text-xs font-bold text-[#FFAA00] uppercase tracking-wider mb-2">Key Policy Terms</div>
          <div className="w-full space-y-2">
            <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between border border-white/10">
              <span className="text-[11px] text-white/70">Starting Premium</span>
              <span className="text-xs font-bold text-white">₹ 600–1,800/mo</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between border border-white/10">
              <span className="text-[11px] text-white/70">Sum Assured</span>
              <span className="text-xs font-bold text-[#FFAA00]">₹ 50L – 10 Cr</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between border border-white/10">
              <span className="text-[11px] text-white/70">Waiting Period</span>
              <span className="text-xs font-bold text-[#2FD08A]">None (Day 1)</span>
            </div>
          </div>
        </div>
      ),
      renderStoryBody: () => (
        <div className="grid grid-cols-2 gap-2.5 py-3 w-full">
          <div className="bg-white/10 rounded-2xl p-3 text-left border border-white/10">
            <div className="text-xl font-black text-[#FFAA00]">₹ 600+</div>
            <div className="text-[11px] font-bold text-white/90 mt-1">Starting Premium</div>
            <p className="text-[9px] text-white/60 mt-0.5">₹600–1,800/mo based on entry age</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-left border border-white/10">
            <div className="text-xl font-black text-[#2FD08A]">₹ 10 Cr</div>
            <div className="text-[11px] font-bold text-white/90 mt-1">Max Sum Assured</div>
            <p className="text-[9px] text-white/60 mt-0.5">Flexible ₹50 Lakh to ₹10 Crore</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-left border border-white/10">
            <div className="text-xl font-black text-white">Day 1</div>
            <div className="text-[11px] font-bold text-white/90 mt-1">Waiting Period</div>
            <p className="text-[9px] text-white/60 mt-0.5">Immediate death benefit coverage</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-left border border-white/10">
            <div className="text-xl font-black text-white">30 Days</div>
            <div className="text-[11px] font-bold text-white/90 mt-1">Free-Look Period</div>
            <p className="text-[9px] text-white/60 mt-0.5">100% refund guarantee</p>
          </div>
        </div>
      ),
    },
    {
      id: "check-before-you-buy",
      index: 3,
      name: "Check Before You Buy",
      badgeText: "CHECK BEFORE YOU BUY",
      badge: "Card 3 of 6",
      renderBody: () => (
        <div className="flex flex-col items-center justify-center my-auto py-2 w-full px-1 text-center">
          <div className="text-xs font-bold text-[#FFAA00] uppercase tracking-wider mb-2">Notice & Warnings</div>
          <div className="w-full space-y-2">
            <div className="bg-[#FFAA00]/15 border border-[#FFAA00]/30 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#FFAA00]">
                <i className="fa-solid fa-triangle-exclamation text-[10px]" />
                <span>Suicide Exclusion (Year 1)</span>
              </div>
              <p className="text-[10px] text-white/80 mt-1 leading-snug">
                Pays back 80% of premiums paid, or policy surrender value.
              </p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white">
                <i className="fa-solid fa-circle-info text-[#2FD08A] text-[10px]" />
                <span>Critical Illness Tiers</span>
              </div>
              <p className="text-[10px] text-white/80 mt-1 leading-snug">
                Lists 20 to 60 conditions. Confirm exact rider tier before purchase.
              </p>
            </div>
          </div>
        </div>
      ),
      renderStoryBody: () => (
        <div className="space-y-2.5 py-2 w-full text-left">
          <div className="bg-[#FFAA00]/20 border border-[#FFAA00]/40 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-black text-[#FFAA00]">
              <i className="fa-solid fa-triangle-exclamation text-sm" />
              <span>Suicide Exclusion (Year 1)</span>
            </div>
            <p className="text-xs text-white/90 mt-1 leading-snug">
              Death by suicide in first 12 months pays back 80% of premiums paid or policy surrender value.
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <i className="fa-solid fa-circle-info text-[#2FD08A] text-sm" />
              <span>Critical Illness Discrepancy</span>
            </div>
            <p className="text-xs text-white/80 mt-1 leading-snug">
              Plan lists 20, 34 and 60 critical illnesses in different filings. Confirm exact rider schedule.
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <i className="fa-solid fa-clock-rotate-left text-[#FFAA00] text-sm" />
              <span>POS Channel Limitation</span>
            </div>
            <p className="text-xs text-white/80 mt-1 leading-snug">
              Policies bought via POS agents carry a 90-day waiting period on non-accidental claims.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "claims-record",
      index: 4,
      name: "Claims Record",
      badgeText: "CLAIMS RECORD",
      badge: "Card 4 of 6",
      renderBody: () => (
        <div className="flex flex-col items-center justify-center text-center my-auto py-1 w-full">
          <div className="text-base font-extrabold text-white tracking-tight leading-tight">Claims record</div>
          <div className="text-[11px] font-bold text-[#FFAA00] mt-0.5">{providerName.split(" ")[0]} settled</div>

          {/* Centered Circular Donut Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="39"
                fill="none"
                stroke="#0C2659"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="39"
                fill="none"
                stroke="#FF5A0A"
                strokeWidth="10"
                strokeDasharray="245"
                strokeDashoffset="4.7"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tight leading-none">
                {claimSettlementRatio}
              </span>
              <span className="text-[9px] text-white/70 font-medium mt-1">
                FY 2024-25
              </span>
            </div>
          </div>

          <p className="text-[11px] text-white/80 text-center max-w-[210px] mx-auto font-medium leading-tight">
            of individual death claims, by number
          </p>
        </div>
      ),
      renderStoryBody: () => (
        <div className="flex flex-col items-center justify-center text-center py-3 w-full">
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#0C2659" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#FF5A0A"
                strokeWidth="12"
                strokeDasharray="314"
                strokeDashoffset="6"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white leading-none tracking-tight">
                {claimSettlementRatio}
              </span>
              <span className="text-[11px] text-white/70 font-semibold mt-1">FY 2024-25</span>
            </div>
          </div>
          <div className="text-base font-extrabold text-white mt-2">
            of individual death claims settled
          </div>
          <p className="text-xs text-white/80 mt-1 max-w-[260px] leading-relaxed">
            Fast-track settlement within {turnaroundDays} SLA. 97.80% settled by monetary amount.
          </p>
        </div>
      ),
    },
    {
      id: "news",
      index: 5,
      name: "News Bulletins",
      badgeText: "NEWS",
      badge: "Card 5 of 6",
      renderBody: () => (
        <div className="flex flex-col items-center justify-center my-auto py-2 text-center w-full px-1">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center w-full">
            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FF5A0A] text-[#06132F] inline-block mb-1.5">
              IRDAI Notice
            </span>
            <div className="text-xs font-bold text-white leading-snug">
              0% GST on individual life insurance premiums
            </div>
            <p className="text-[10px] text-white/70 mt-1 leading-snug">
              Tax rate reduced from 18% to 0% as of 22 Sep 2025.
            </p>
          </div>
        </div>
      ),
      renderStoryBody: () => (
        <div className="py-2 w-full text-left space-y-3">
          <div className="bg-gradient-to-br from-[#FF5A0A]/20 to-[#FFAA00]/15 border border-[#FF5A0A]/30 rounded-2xl p-4">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5A0A] text-[#06132F]">
              22 SEP 2025 · GST COUNCIL
            </span>
            <div className="text-base font-black text-white mt-2 leading-snug">
              0% GST on individual life insurance premiums
            </div>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
              Premiums on pure term and health policies carry zero tax, reduced down from 18% statutory slab.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white/80">
              IRDAI FILING
            </span>
            <div className="text-sm font-bold text-white mt-1.5 leading-snug">
              Annual solvency disclosure filed and certified
            </div>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              Insurer maintains solvency ratio of {solvencyRatio}, comfortably clearing the 1.50x floor.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rate-it",
      index: 6,
      name: "Rate It",
      badgeText: "RATE IT",
      badge: "Card 6 of 6",
      renderBody: () => (
        <div className="flex flex-col items-center justify-center my-auto py-2 text-center w-full">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FF5A0A]/20 border-2 border-[#FF5A0A] flex items-center justify-center text-[#FF5A0A] text-2xl mb-2.5 shadow-lg shadow-[#FF5A0A]/10">
            <i className="fa-solid fa-star" />
          </div>
          <div className="text-base font-extrabold text-white">One swift gesture</div>
          <p className="text-xs text-white/80 mt-1.5 max-w-[220px] mx-auto leading-relaxed">
            Drag from Angry Star to Recommend. Instant consensus ledger lock in 7s.
          </p>
        </div>
      ),
      renderStoryBody: () => (
        <div className="flex flex-col items-center justify-center text-center py-4 w-full">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FF5A0A]/25 border-4 border-[#FF5A0A] flex items-center justify-center text-[#FF5A0A] text-3xl mb-3 shadow-xl shadow-[#FF5A0A]/25 animate-pulse">
            <i className="fa-solid fa-star" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">One swift gesture</div>
          <p className="text-xs text-white/80 mt-2 max-w-[280px] leading-relaxed">
            Drag from Angry Star to Recommend. Instant consensus ledger lock in 7 seconds.
          </p>

          <div className="w-full mt-4 p-3 rounded-2xl bg-white/10 border border-white/15">
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-[#F12A0A] via-[#FFAA00] to-[#0A8754]" />
            <div className="flex justify-between text-[10px] font-bold text-white/70 mt-1.5">
              <span>Angry Star</span>
              <span>Mixed</span>
              <span>Recommend</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Autoplay and segmented progress timer for Story Viewer (6000ms duration per story card)
  useEffect(() => {
    if (!isPlaying || isHolding) return;
    if (!fullScreenModal && isHovered) return;

    const intervalMs = 50;
    const step = (intervalMs / 6000) * 100;
    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev + step >= 100) {
          setActiveCard((curr) => {
            const next = (curr + 1) % 6;
            playBeep(440 + next * 35);
            return next;
          });
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, isHolding, isHovered, fullScreenModal, isMuted]);

  // Keyboard controls while story viewer is open
  useEffect(() => {
    if (!fullScreenModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullScreenModal(false);
      } else if (e.key === "ArrowRight") {
        setActiveCard((c) => (c < 5 ? c + 1 : 0));
        setStoryProgress(0);
        playBeep(480);
      } else if (e.key === "ArrowLeft") {
        setActiveCard((c) => (c > 0 ? c - 1 : 5));
        setStoryProgress(0);
        playBeep(480);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullScreenModal]);

  const scrollToSection = (id: string, cardIndex?: number) => {
    setActiveNavTab(id);
    if (typeof cardIndex === "number") {
      setActiveCard(cardIndex);
      playBeep(520);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openStory = (cardIndex: number = 0) => {
    setActiveCard(cardIndex);
    setStoryProgress(0);
    setIsPlaying(true);
    setIsHolding(false);
    setFullScreenModal(true);
    playBeep(480);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartY.current = e.clientY;
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(true);
    }, 200);
  };

  const handlePointerUp = (e: React.PointerEvent, action: () => void) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    const wasHeld = isHolding;
    setIsHolding(false);
    if (e.clientY - touchStartY.current > 80) {
      setFullScreenModal(false);
      return;
    }
    if (!wasHeld) {
      action();
    }
  };

  const handlePointerLeave = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
  };

  // Facts data
  const defaultFacts: FactItem[] = facts || [
    { key: "Entry age", val: "18 to 65 years", citation: "1" },
    { key: "Maximum maturity age", val: "85 years", citation: "1" },
    { key: "Claim settlement ratio", val: `${claimSettlementRatio} (FY 2024-25)`, citation: "2" },
    { key: "IRDAI Solvency ratio", val: `${solvencyRatio} (min: 1.50x floor)`, citation: "2" },
    { key: "Medical checkup", val: "Tele-underwriting up to ₹ 1.5 Cr; physical above", citation: "1" },
    { key: "Grace period", val: "30 days annual/half-yearly; 15 days monthly", citation: "1" },
    { key: "Free look period", val: "30 days from policy receipt date", citation: "1" },
    { key: "Rider availability", val: "Comprehensive critical illness & accidental disability", citation: "1" },
  ];

  // Warning items
  const defaultWarnings: WarningItem[] = warnings || [
    {
      text: "The plan page lists 20, 34 and 60 critical illnesses in different places. Ask which list your option covers, and find it in the policy wording.",
      citation: "1",
    },
    {
      text: "Death by suicide in the first 12 months pays back 80% of premiums paid, or the policy's surrender value if that is higher.",
      citation: "1",
    },
    {
      text: "Bought through a POS agent? No death benefit in the first 90 days, except after an accident. Premiums are refunded.",
      citation: "1",
    },
  ];

  // News items
  const defaultNews: NewsItem[] = newsList || [
    {
      date: "22 SEP 2026",
      title: "ICICI Prudential Life is now ICICI Life Insurance",
      desc: "The new name took effect on 22 September 2026. The company says the change does not affect the rights and liabilities of its stakeholders.",
      citation: "3",
    },
    {
      date: "22 SEP 2025",
      title: "No GST on individual life insurance premiums",
      desc: "Since 22 September 2025, premiums on individual life and health insurance carry no GST. The rate was 18%.",
      citation: "5",
    },
  ];

  // Rating feedback calculation
  const getRatingFeedback = (val: number) => {
    if (val <= 1.0) return { label: "Angry Star", color: "#F12A0A", desc: "Broke my trust. Caps signal at 50/100 and raises a Trust Alert." };
    if (val <= 2.2) return { label: "Poor", color: "#FF5A0A", desc: "Significant pain points in claims settlement or fine print." };
    if (val <= 3.3) return { label: "Mixed", color: "#FFAA00", desc: "Satisfactory base coverage, but customer support delay noticed." };
    if (val <= 4.2) return { label: "Trust Intact", color: "#2FD08A", desc: "Smooth claims experience, reliable disclosure and clarity." };
    return { label: "Recommend", color: "#0A8754", desc: "Flawless settlement and transparent terms. Highly recommended." };
  };

  const ratingInfo = getRatingFeedback(sliderValue);

  // Audited Products & Plans carousel component
  const productsSection = products && products.length > 0 ? (
    <section id="brand-products" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
      <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#FF5A0A] uppercase tracking-wider mb-0.5">
            <i className="fa-solid fa-layer-group text-[10px]" />
            <span>Audited Brand Offerings &bull; Direct Redirection</span>
          </div>
          <h2 className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight">
            {entityType === "brand" ? `Products & Plans from ${providerName}` : `Other Products & Plans from ${providerName}`} ({products.length})
          </h2>
          <p className="text-[11px] text-[#667085] mt-0.5">
            {entityType === "brand"
              ? "Explore verified policies, accounts, and audited product contracts. Click any card to inspect its full plan details."
              : `Explore other verified policies and accounts from ${providerName}. Click any card to inspect its full plan details.`}
          </p>
        </div>

        {/* Left / Right Carousel Buttons */}
        {products.length > 2 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              className="w-8 h-8 rounded-full border border-[#DCE2EB] bg-white text-[#071B46] hover:bg-[#F2F4F7] hover:border-[#98A2B3] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll left"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
              type="button"
              onClick={() => scrollProducts("right")}
              className="w-8 h-8 rounded-full border border-[#DCE2EB] bg-white text-[#071B46] hover:bg-[#F2F4F7] hover:border-[#98A2B3] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll right"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={productsScrollRef}
        className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#DCE2EB transparent",
        }}
      >
        {products.map((prod) => (
          <Link
            key={prod.slug}
            href={prod.href}
            className="flex-shrink-0 w-[275px] sm:w-[310px] rounded-2xl border border-[#DCE2EB] bg-white p-4 shadow-sm hover:shadow-md hover:border-[#FF5A0A] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between snap-start text-left no-underline"
          >
            <div>
              {/* Top Row: Category tag and redirect arrow */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A0A] bg-[#FFF4EE] px-2.5 py-0.5 rounded-full border border-[#FFD8C2]">
                  {prod.categoryName || "Audited Plan"}
                </span>
                <span className="w-7 h-7 rounded-full bg-[#F4F7FB] text-[#46526B] group-hover:bg-[#FF5A0A] group-hover:text-white flex items-center justify-center transition-colors">
                  <i className="fa-solid fa-arrow-right text-[11px]" />
                </span>
              </div>

              {/* Product Title */}
              <h3 className="font-extrabold text-sm sm:text-[15px] text-[#071B46] group-hover:text-[#FF5A0A] transition-colors leading-snug">
                {prod.name}
              </h3>

              {/* Summary */}
              {prod.summary && (
                <p className="text-[11px] text-[#667085] mt-1.5 line-clamp-2 leading-relaxed">
                  {prod.summary}
                </p>
              )}

              {/* Key Metrics / Attributes pills */}
              {prod.metrics && prod.metrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-[#EEF2F7]">
                  {prod.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="inline-flex items-center gap-1 text-[10px] bg-[#FAFBFD] border border-[#E4E7EC] px-2 py-0.5 rounded-md text-[#46526B]"
                    >
                      <span className="text-[#98A2B3] capitalize">{m.label}:</span>
                      <strong className="text-[#071B46] font-bold">{m.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card Footer: Verified status and CTA */}
            <div className="mt-3 pt-2.5 border-t border-[#EEF2F7] flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 text-[#0A8754] font-semibold">
                <i className="fa-solid fa-circle-check text-[10px]" />
                <span>Audited Plan</span>
              </span>
              <span className="text-[#FF5A0A] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                <span>View plan</span>
                <i className="fa-solid fa-chevron-right text-[9px]" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="brand-layout w-full bg-[#FAFBFD] text-[#06132F] py-3 sm:py-5">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#071B46] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2.5 animate-bounce text-xs">
          <i className="fa-solid fa-circle-check text-[#2FD08A]" />
          <span className="font-semibold">{shareToast}</span>
        </div>
      )}

      {/* Main Container Aligned with termsAndcondition .wrap (max-width: 1200px, gutter: 16px) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: Plan Summary touches the line below (~500px) */}
          {/* ========================================================= */}
          <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 lg:sticky lg:top-[76px] z-20">
            {/* Header */}
            <div className="pb-1">
              <h2
                className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                
              >
                Plan summary
              </h2>
            </div>
            <p className="text-[11px] text-[#667085] font-medium">
              6 cards, about 36 seconds
            </p>

            {/* Summary Story Card (Exact Image 2 UI) */}
            <div
              className="brand-summary-card mt-2 relative rounded-[22px] p-3.5 shadow-2xl flex flex-col justify-between overflow-hidden border border-white/15 transition-all duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* 1. Segmented Progress Bar (6 segments) */}
              <div className="grid grid-cols-6 gap-1 mb-2.5 relative z-10 px-0.5">
                {storyCards.map((card, idx) => (
                  <button
                    key={card.index}
                    type="button"
                    onClick={() => {
                      setActiveCard(idx);
                      setStoryProgress(0);
                      playBeep(480 + idx * 30);
                    }}
                    className="h-1 rounded-full overflow-hidden bg-white/25 transition-all cursor-pointer relative"
                    title={`Card ${idx + 1}: ${card.name}`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-150 ${
                        idx < activeCard
                          ? "bg-white w-full"
                          : idx === activeCard
                          ? "bg-white"
                          : "w-0"
                      }`}
                      style={idx === activeCard ? { width: `${storyProgress}%` } : undefined}
                    />
                  </button>
                ))}
              </div>

              {/* 2. Top Header Bar (Avatar, TrustValue, Subtitle, Controls) */}
              <div className="flex items-center justify-between relative z-10 px-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-white/20">
                    <i className="fa-solid fa-shield-halved text-[#071B46] text-sm" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="font-extrabold text-xs text-white leading-tight">
                      TrustValue
                    </div>
                    <div className="text-[10px] text-white/70 truncate">
                      {storyCards[activeCard].badgeText} · {title}
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons (Pause & Fullscreen) */}
                <div className="flex items-center gap-1.5 text-white">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                    title={isPlaying ? "Pause autoplay" : "Resume autoplay"}
                  >
                    <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} text-[10px]`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFullScreenModal(true)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                    title="Open full size"
                  >
                    <i className="fa-solid fa-expand text-[10px] text-white/90" />
                  </button>
                </div>
              </div>

              {/* 3. Center Content Area */}
              <div className="flex-1 flex flex-col justify-center items-center my-auto relative z-10 w-full px-0.5 text-center py-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFAA00] text-[9px] font-black uppercase tracking-wider mb-1.5 border border-white/15">
                  {storyCards[activeCard].badgeText}
                </span>
                <div className="w-full">
                  {storyCards[activeCard].renderStoryBody()}
                </div>
              </div>

              {/* 4. Inside Source & TrustValue Footer */}
              <div className="relative z-10 px-1 py-1.5 text-[10px] text-white/50 border-t border-white/10 flex items-center justify-between">
                <span className="truncate max-w-[190px]">
                  {"source" in storyCards[activeCard]
                    ? (storyCards[activeCard] as { source?: string }).source || "Source: Regulatory public records"
                    : "Source: Regulatory public records"}
                </span>
                <span className="font-bold text-white/70 tracking-tight">trustvalue.ai</span>
              </div>

              {/* 5. Bottom Action: Rate it in 7 seconds (No Make this card button) */}
              <div className="pt-2 relative z-10">
                <button
                  type="button"
                  onClick={() => scrollToSection("rate-it")}
                  className="btn btn--signal w-full h-10 rounded-full font-extrabold text-xs tracking-tight flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF5A0A]/25 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
                >
                  <span>Rate it in 7 seconds</span>
                </button>
              </div>
            </div>

            {/* Explanatory Caption below phone */}
            <div className="mt-2 px-0.5">
              <button
                type="button"
                onClick={() => setFullScreenModal(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#071B46] hover:text-[#FF5A0A] py-0.5 cursor-pointer transition group"
              >
                <i className="fa-solid fa-expand text-[11px] group-hover:scale-110 transition-transform" />
                <span>Click the card to open full size</span>
              </button>

              <div className="mt-1 space-y-0.5 text-[10px] text-[#667085] leading-snug">
                <p>Autoplays muted, 6 s per card. Hover pauses it.</p>
                <p>Card player summarizes ratings, numbers, and warnings.</p>
              </div>

              {/* Yellow bottom touch border matching user guide */}
              <div className="w-full h-1 bg-[#FFAA00] rounded-full mt-2.5 opacity-80" />
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT MAIN CONTENT: In-depth Plan Overview              */}
          {/* ========================================================= */}
          <main className="w-full lg:flex-1 min-w-0">
            
            {/* Top Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE2EB]">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#FFF4ED] text-[#FF5A0A] border border-[#FFD8C2]">
                  {categoryName}
                </span>
                <h1
                  className="brand-h1 font-extrabold text-[#071B46] tracking-tight leading-tight mt-1.5"
                  
                >
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-[#46526B] mt-1 max-w-2xl leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* Action Buttons: Share & Rate it (Home Page Design System) */}
              <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openStory(0)}
                  className="btn btn--quiet btn--sm h-9 min-h-[38px] px-3.5 text-xs inline-flex items-center gap-1.5 font-bold cursor-pointer"
                  title="Share this plan"
                >
                  <i className="fa-solid fa-arrow-up-from-bracket text-[11px]" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("rate-it")}
                  className="btn btn--signal btn--sm h-9 min-h-[38px] px-3.5 text-xs inline-flex items-center gap-1.5 font-bold cursor-pointer"
                  title="Rate this plan"
                >
                  <i className="fa-solid fa-star text-[11px]" />
                  <span>Rate it</span>
                </button>
              </div>
            </div>

            {/* Provider Entity Row */}
            <div className="flex items-center gap-2 py-1.5 sm:py-2">
              <div className="w-7 h-7 rounded-full bg-[#EEF2F7] border border-[#DCE2EB] text-[#071B46] font-black text-xs flex items-center justify-center flex-shrink-0">
                {providerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <Link
                  href={`/${sectorSlug}/brands/${providerSlug}`}
                  className="text-xs sm:text-sm font-extrabold text-[#071B46] hover:text-[#FF5A0A] transition inline-flex items-center gap-1.5"
                >
                  <span>{providerName}</span>
                  <i className="fa-solid fa-circle-check text-[#0A8754] text-[11px]" />
                </Link>
                <div className="text-[10px] text-[#667085]">
                  Audited IRDAI Insurer • Verified Public Records FY 2024-25
                </div>
              </div>
            </div>



            {/* ========================================================= */}
            {/* Section 1: Standing: score and rating (20px Header)      */}
            {/* ========================================================= */}
            <section id="standing" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h2
                  className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                  
                >
                  Standing: score and rating
                </h2>
              </div>

              {/* 3 Column Score Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Yellow Container Card: Light highlight & glowing border */}
                <div className="rounded-xl p-3 sm:p-3.5 border-2 border-[#FFAA00]/50 bg-gradient-to-br from-[#FFF9EE] via-[#FFF5E4] to-[#FFF1D7] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold text-[#5E4100] uppercase tracking-wider">
                      TrustValue Score
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#5E4100]/10 text-[#5E4100] text-[9px] font-extrabold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#071B46] tracking-tight">{trustScore}</span>
                    <span className="text-xs font-bold text-[#0A8754]">/ 100</span>
                  </div>
                  <p className="text-[11px] text-[#5E4100] mt-1.5 leading-snug font-medium">
                    Ranked #1 in sector. Zero unresolved policyholder complaints.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#DCE2EB] shadow-sm">
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                    IRDAI Solvency
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#071B46] tracking-tight">{solvencyRatio}</span>
                    <span className="text-[11px] font-bold text-[#0A8754]">Buffer safe</span>
                  </div>
                  <p className="text-[11px] text-[#46526B] mt-1.5 leading-snug">
                    Comfortably above 1.50x statutory floor to meet claim liabilities.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#DCE2EB] shadow-sm">
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                    Claim Speed
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#071B46] tracking-tight">{turnaroundDays}</span>
                    <span className="text-[11px] font-bold text-[#071B46]">Average SLA</span>
                  </div>
                  <p className="text-[11px] text-[#46526B] mt-1.5 leading-snug">
                    Average processing time for clean claims intimation to payout.
                  </p>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* Section 2: Rate it (20px Header)                         */}
            {/* ========================================================= */}
            <section id="rate-it" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h2
                  className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                  
                >
                  Rate it
                </h2>
              </div>

              {/* Signature TrustValue Interactive 6-Step Slider */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#DCE2EB] shadow-sm">
                <div className="flex items-center justify-between gap-2.5 mb-2">
                  <div className="text-xs sm:text-sm font-extrabold text-[#071B46]">
                    Overall experience on this plan:
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2F7] border border-[#DCE2EB]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ratingInfo.color }} />
                    <span className="text-[11px] font-extrabold text-[#071B46]">{ratingInfo.label}</span>
                  </div>
                </div>

                {/* Slider Track with Dynamic Custom Thumb */}
                <div className="relative py-1.5 my-0.5">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    disabled={isLocked}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                    style={{ "--thumb-color": ratingInfo.color } as React.CSSProperties}
                    className="rate-range w-full h-2.5 rounded-full appearance-none outline-none cursor-pointer"
                  />
                  
                  {/* Slider Labels */}
                  <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-[#667085] mt-1.5 px-0.5">
                    <span className="flex items-center gap-1 text-[#F12A0A]">
                      <i className="fa-solid fa-burst text-[10px]" /> Angry Star
                    </span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span className="flex items-center gap-1 text-[#0A8754]">
                      Recommend <i className="fa-solid fa-check text-[10px]" />
                    </span>
                  </div>
                </div>

                {/* Orange Card (Feedback Description Component with Clean Compact Spacing) */}
                <div className="mt-2.5 mb-2.5 p-2.5 sm:p-3 rounded-lg bg-[#FAFBFD] border border-[#DCE2EB]">
                  <p className="text-xs text-[#46526B] leading-relaxed">
                    <strong className="text-[#071B46] font-bold">{ratingInfo.label}:</strong>{" "}
                    <span>{ratingInfo.desc}</span>
                  </p>
                </div>

                {/* Red Pointed Button (Proper Homepage Style Pill Button) */}
                <div className="mt-3 pt-2.5 border-t border-[#DCE2EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="text-[11px] text-[#667085] leading-snug">
                    {isLocked ? (
                      <span className="text-[#0A8754] font-bold flex items-center gap-1">
                        <i className="fa-solid fa-lock text-[10px]" /> Locked to TrustValue consensus ledger.
                      </span>
                    ) : (
                      <span>Takes 7 seconds. Writing a review is optional.</span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      setIsLocked(true);
                      playBeep(640);
                      setShareToast("Rating locked into consensus ledger!");
                      setTimeout(() => setShareToast(null), 3000);
                    }}
                    className={`btn btn--signal btn--sm px-5 h-9 min-h-[38px] rounded-full font-bold text-xs tracking-tight flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                      isLocked
                        ? "!bg-[#EEF2F7] !text-[#667085] cursor-not-allowed shadow-none border border-[#DCE2EB]"
                        : "!bg-[#FF5A0A] hover:!bg-[#FF6E26] !text-[#06132F]"
                    }`}
                  >
                    <i className={`fa-solid ${isLocked ? "fa-check" : "fa-lock"} text-[10px]`} />
                    <span>{isLocked ? "Rating Locked" : "Lock in 7 seconds"}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* Section 3: About this plan (20px Header)                 */}
            {/* ========================================================= */}
            <section id="about" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <h2
                className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight mb-1.5"
                
              >
                About this plan
              </h2>

              <div className="text-[#46526B] text-xs sm:text-sm leading-relaxed space-y-1.5">
                <p>
                  {title} is a non-linked, non-participating pure risk individual life insurance plan providing direct financial indemnity to nominees in the event of an untimely demise during the active policy term.
                </p>
                <p>
                  Unlike endowment policies that mix insurance with sub-par market investments, pure term covers offer the highest sum assured per rupee of premium paid. Claims are paid directly to verified nominees within IRDAI turnaround guidelines.
                </p>
              </div>
            </section>

            {/* ========================================================= */}
            {/* Section 4: The facts (20px Header)                       */}
            {/* ========================================================= */}
            <section id="the-facts" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h2
                  className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                  
                >
                  The facts
                </h2>
              </div>
              <p className="text-[11px] text-[#667085] mb-2 leading-snug">
                From the insurer&apos;s own regulatory filings. Each fact names its source. No commissions or broker markups.
              </p>

              {/* Facts Matrix Table */}
              <div className="bg-white rounded-xl border border-[#DCE2EB] overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#DCE2EB]">
                  <div className="divide-y divide-[#DCE2EB]">
                    {defaultFacts.slice(0, 4).map((f, i) => (
                      <div key={i} className="p-2 px-3 flex items-baseline justify-between gap-3 text-xs">
                        <span className="font-bold text-[#071B46]">{f.key}</span>
                        <div className="text-right">
                          <span className="text-[#46526B] font-semibold">{f.val}</span>
                          {f.citation && <sup className="text-[9px] text-[#667085] font-bold ml-0.5">[{f.citation}]</sup>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="divide-y divide-[#DCE2EB]">
                    {defaultFacts.slice(4).map((f, i) => (
                      <div key={i} className="p-2 px-3 flex items-baseline justify-between gap-3 text-xs">
                        <span className="font-bold text-[#071B46]">{f.key}</span>
                        <div className="text-right">
                          <span className="text-[#46526B] font-semibold">{f.val}</span>
                          {f.citation && <sup className="text-[9px] text-[#667085] font-bold ml-0.5">[{f.citation}]</sup>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* Section: Audited Products & Plans (Brand view: below Facts)*/}
            {/* ========================================================= */}
            {entityType === "brand" && productsSection}

            {/* ========================================================= */}
            {/* Section 5: Check before you buy (20px Header)            */}
            {/* ========================================================= */}
            <section id="check-before-you-buy" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h2
                  className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                  
                >
                  Check before you buy
                </h2>
              </div>

              {/* 3 Warning Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {defaultWarnings.map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFFBEB] border border-[#FDE68A] hover:border-[#F59E0B] rounded-xl p-3 shadow-sm transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xs mb-1.5">
                        <i className="fa-solid fa-triangle-exclamation" />
                      </div>
                      <p className="text-xs text-[#071B46] leading-relaxed font-medium">
                        {w.text}
                      </p>
                    </div>
                    {w.citation && (
                      <div className="text-[10px] text-[#667085] font-semibold mt-2 text-right">
                        Policy filing [{w.citation}]
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* Section 6: Claims record (20px Header)                   */}
            {/* ========================================================= */}
            <section id="claims-record" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h2
                  className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                  
                >
                  Claims record
                </h2>
              </div>

              {/* 3 Claims Record Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#DCE2EB] shadow-sm">
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                    Settled by Number
                  </div>
                  <div className="text-2xl font-extrabold text-[#071B46] mt-1">
                    {claimSettlementRatio}
                  </div>
                  <p className="text-[11px] text-[#46526B] mt-1 leading-snug">
                    Share of individual death claims settled in FY 2024-25.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-[#DCE2EB] shadow-sm">
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                    Settled by Amount
                  </div>
                  <div className="text-2xl font-extrabold text-[#071B46] mt-1">
                    97.80%
                  </div>
                  <p className="text-[11px] text-[#46526B] mt-1 leading-snug">
                    Rupee value of claims disbursed vs. total requested.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-[#DCE2EB] shadow-sm">
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                    Repudiated Claims
                  </div>
                  <div className="text-2xl font-extrabold text-[#F12A0A] mt-1">
                    1.12%
                  </div>
                  <p className="text-[11px] text-[#46526B] mt-1 leading-snug">
                    Claims rejected due to fraud or non-disclosure of history.
                  </p>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* Section 7: News & Bulletins (20px Header)                */}
            {/* ========================================================= */}
            <section id="news" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h2
                  className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight"
                  
                >
                  News & Bulletins
                </h2>
              </div>

              <div className="space-y-2.5">
                {defaultNews.map((n, idx) => (
                  <div key={idx} className="bg-white border border-[#DCE2EB] rounded-xl p-3 sm:p-3.5 shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEF2F7] text-[#46526B]">
                      {n.date}
                    </span>
                    <div className="text-sm font-extrabold text-[#071B46] mt-1">
                      {n.title}
                    </div>
                    <p className="text-xs text-[#46526B] mt-0.5 leading-snug">
                      {n.desc}
                      {n.citation && <sup className="text-[9px] font-bold ml-0.5">[{n.citation}]</sup>}
                    </p>
                  </div>
                ))}
              </div>
            </section>


            {/* ========================================================= */}
            {/* Section: Audited Products & Plans (Product/Plan: above FAQ)*/}
            {/* ========================================================= */}
            {entityType !== "brand" && productsSection}

            {/* ========================================================= */}
            {/* Section: Dynamic Head-to-Head Compare Matrix (Above FAQ)  */}
            {/* ========================================================= */}
            <CompareSection
              sectorSlug={sectorSlug}
              entityType={entityType}
              currentSlug={entityType === "brand" ? (providerSlug || "brand") : (categorySlug.split("/").pop() || "plan")}
              currentName={title}
              categorySlug={categorySlug}
              categoryName={categoryName}
              providerSlug={providerSlug}
              providerName={providerName}
              crossBrandPeers={comparePeers}
              sameBrandPeers={sameBrandComparePeers}
              allEligibleOptions={allCompareOptions}
            />

            {/* Questions FAQ (20px Header) */}
            <section id="questions" className="py-3.5 sm:py-4 scroll-mt-20 border-b border-[#DCE2EB]">
              <h2
                className="brand-h2 font-extrabold text-[#071B46] tracking-tight leading-tight mb-2.5"
                
              >
                Questions about {title}
              </h2>

              <div className="divide-y divide-[#DCE2EB] bg-white rounded-xl border border-[#DCE2EB] overflow-hidden text-xs">
                <details className="group p-2.5 px-3 cursor-pointer">
                  <summary className="flex items-center justify-between font-bold text-[#071B46] list-none">
                    <span>What happens if I stop paying premiums?</span>
                    <i className="fa-solid fa-chevron-down text-[10px] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-[#46526B] mt-1.5 leading-relaxed pl-0.5">
                    A grace period of 30 days is allowed for annual premium modes. If payment is not received within grace, pure risk cover lapses without surrender value.
                  </p>
                </details>

                <details className="group p-2.5 px-3 cursor-pointer">
                  <summary className="flex items-center justify-between font-bold text-[#071B46] list-none">
                    <span>Can this policy be challenged after 3 years?</span>
                    <i className="fa-solid fa-chevron-down text-[10px] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-[#46526B] mt-1.5 leading-relaxed pl-0.5">
                    Under Section 45 of the Insurance Act 1938, no policy of life insurance can be called into question by an insurer after 3 continuous years on any ground whatsoever.
                  </p>
                </details>
              </div>
            </section>

            {/* Bottom Wireframe Indication Notice */}
            <div className="py-2.5 px-3 my-3 rounded-xl bg-[#EEF2F7] text-center border border-[#DCE2EB]">
              <p className="text-[11px] font-semibold text-[#46526B]">
                Page continues: News, All ratings, Questions, Sources, Related plans
              </p>
            </div>

          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN STORY VIEWER MODAL (.sv)                      */}
      {/* Exact UI/UX, animations, and content flow from prototype  */}
      {/* ========================================================= */}
      {fullScreenModal && (
        <div
          className="sv"
          role="dialog"
          aria-modal="true"
          aria-label="Plan stories"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFullScreenModal(false);
          }}
        >
          <div className="sv__panel">
            {/* 9:16 Aspect Frame (.sv__frame) */}
            <div className="sv__frame">
              
              {/* Segmented Progress Bars (.st__bars) */}
              <div className="st__bars" aria-hidden="true">
                {storyCards.map((_, idx) => (
                  <i key={idx}>
                    <b
                      style={{
                        width: idx === activeCard ? `${storyProgress}%` : idx < activeCard ? "100%" : "0%",
                      }}
                    />
                  </i>
                ))}
              </div>

              {/* Top Header Bar (.st__top) */}
              <div className="st__top">
                <div className="st__avatar" aria-hidden="true">
                  <i className="fa-solid fa-shield-halved text-[#071B46] text-sm" />
                </div>
                <div className="st__who">
                  <b>TrustValue</b>
                  <span>{storyCards[activeCard].badgeText} · {title}</span>
                </div>
                <button
                  type="button"
                  className="st__btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause stories" : "Play stories"}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} text-xs`} />
                </button>
                <button
                  type="button"
                  className="st__btn"
                  onClick={() => setFullScreenModal(false)}
                  aria-label="Close stories"
                  title="Close"
                >
                  <i className="fa-solid fa-xmark text-sm" />
                </button>
              </div>

              {/* Tap Zones for Story Navigation (.st__tap) with Hold & Swipe */}
              <button
                type="button"
                className="st__tap st__tap--prev"
                aria-label="Previous story"
                onPointerDown={handlePointerDown}
                onPointerUp={(e) =>
                  handlePointerUp(e, () => {
                    setActiveCard((c) => (c > 0 ? c - 1 : 5));
                    setStoryProgress(0);
                    playBeep(440);
                  })
                }
                onPointerLeave={handlePointerLeave}
              />
              <button
                type="button"
                className="st__tap st__tap--next"
                aria-label="Next story"
                onPointerDown={handlePointerDown}
                onPointerUp={(e) =>
                  handlePointerUp(e, () => {
                    setActiveCard((c) => (c < 5 ? c + 1 : 0));
                    setStoryProgress(0);
                    playBeep(480);
                  })
                }
                onPointerLeave={handlePointerLeave}
              />

              {/* Active Card Body - Center Content */}
              <div className="relative z-10 my-auto px-6 py-4 flex flex-col items-center justify-center text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#FFAA00] text-[10px] font-black uppercase tracking-wider mb-2 border border-white/10">
                  {storyCards[activeCard].badgeText}
                </span>
                {storyCards[activeCard].renderStoryBody()}
              </div>

              {/* Source Attribution Line at Bottom of Frame */}
              <div className="relative z-10 px-5 pb-4 pt-2 text-[10px] text-white/50 border-t border-white/10 flex items-center justify-between">
                <span>Source: Regulatory public records</span>
                <span className="font-bold text-white/70">trustvalue.ai</span>
              </div>

            </div>

            {/* Bottom Actions (.sv__foot) */}
            <div className="sv__foot">
              <button
                type="button"
                onClick={() => {
                  setFullScreenModal(false);
                  scrollToSection("rate-it");
                }}
                className="btn btn--signal w-full shadow-lg"
              >
                <span>Rate it in 7 seconds</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
