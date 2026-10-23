"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getAllIndustries } from "@/lib/data/industryData";
import { GLOSSARY, ARTICLES, QUESTIONS, TYPES } from "@/lib/prototypeData";

interface SearchResult {
  kind: string;
  title: string;
  sub: string;
  url: string;
}

// 18 Regulated Consumer Sectors Catalog
const SECTORS_LIST = [
  { id: "insurance", name: "Life Insurance", icon: "fa-shield-halved", count: "26 Brands", url: "/insurance" },
  { id: "banking", name: "Banking & Loans", icon: "fa-building-columns", count: "12 Banks", url: "/banking" },
  { id: "investments", name: "Investments", icon: "fa-chart-line", count: "9 Funds", url: "/investments" },
  { id: "healthcare", name: "Hospital Chains", icon: "fa-hospital", count: "9 Chains", url: "/healthcare" },
  { id: "pharma", name: "Pharma & Pharmacy", icon: "fa-pills", count: "8 Brands", url: "/pharma" },
  { id: "telecom", name: "Telecom & Fiber", icon: "fa-tower-broadcast", count: "7 Telcos", url: "/telecom" },
  { id: "internet-ott", name: "Internet & OTT", icon: "fa-film", count: "7 Platforms", url: "/internet-ott" },
  { id: "food", name: "Food & Grocery", icon: "fa-bowl-food", count: "8 Brands", url: "/food" },
  { id: "agriculture", name: "Agriculture", icon: "fa-wheat-awn", count: "8 Brands", url: "/agriculture" },
  { id: "real-estate", name: "Real Estate", icon: "fa-building", count: "10 Builders", url: "/real-estate" },
  { id: "utilities", name: "Home & Utilities", icon: "fa-bolt", count: "8 Utilities", url: "/utilities" },
  { id: "automobiles", name: "Automobile Makers", icon: "fa-car", count: "14 OEMs", url: "/automobiles" },
  { id: "travel", name: "Travel & Transport", icon: "fa-plane-departure", count: "11 Brands", url: "/travel" },
  { id: "education", name: "Education & EdTech", icon: "fa-graduation-cap", count: "6 Brands", url: "/education" },
  { id: "electronics", name: "Consumer Tech", icon: "fa-mobile-screen", count: "12 Brands", url: "/electronics" },
  { id: "retail", name: "Retail & E-Commerce", icon: "fa-bag-shopping", count: "8 Brands", url: "/retail" },
  { id: "jobs-skilling", name: "Jobs & Skilling", icon: "fa-briefcase", count: "6 Portals", url: "/jobs-skilling" },
  { id: "government", name: "Government Services", icon: "fa-landmark", count: "8 Portals", url: "/government" }
];

const SECTOR_BRANDS_RECORD: Record<string, string[]> = {
  insurance: [
    "ACKO Life", "Aditya Birla Sun Life", "Ageas Federal Life", "Aviva Life",
    "Axis Max Life", "Bajaj Life", "Bandhan Life", "Bharti AXA Life",
    "Canara HSBC Life", "CreditAccess Life", "Digit Life", "Edelweiss Life",
    "Generali Central Life", "HDFC Life", "ICICI Prudential Life", "IndiaFirst Life",
    "IndusInd Nippon Life", "Kotak Life", "LIC", "PNB MetLife",
    "Pramerica Life", "Sahara Life", "SBI Life", "Shriram Life",
    "SUD Life", "Tata AIA Life"
  ],
  banking: [
    "HDFC Bank", "State Bank of India (SBI)", "ICICI Bank", "Axis Bank",
    "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank",
    "IndusInd Bank", "IDFC FIRST Bank", "Yes Bank", "Bajaj Finance"
  ],
  investments: [
    "SBI Mutual Fund", "HDFC Mutual Fund", "ICICI Prudential Mutual Fund",
    "Nippon India Mutual Fund", "Axis Mutual Fund", "Zerodha", "Groww",
    "Upstox", "Angel One"
  ],
  healthcare: [
    "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Manipal Hospitals",
    "Narayana Health", "Medanta - The Medicity", "Dr Lal PathLabs", "Metropolis Healthcare", "Thyrocare"
  ],
  pharma: [
    "Tata 1mg", "PharmEasy", "Apollo Pharmacy", "Netmeds",
    "MedPlus", "Cipla", "Sun Pharma", "Dr. Reddy's"
  ],
  telecom: [
    "Reliance Jio", "Bharti Airtel", "Vodafone Idea (Vi)", "BSNL",
    "ACT Fibernet", "Tata Play Fiber", "Hathway"
  ],
  "internet-ott": [
    "Netflix", "Amazon Prime Video", "JioHotstar", "Sony LIV",
    "ZEE5", "Spotify", "YouTube Premium"
  ],
  food: [
    "Zomato", "Swiggy", "Blinkit", "Zepto",
    "BigBasket", "Amul", "Britannia", "Nestlé India"
  ],
  agriculture: [
    "Coromandel International", "UPL", "Dhanuka Agritech", "Escorts Kubota",
    "TAFE", "John Deere India", "DeHaat", "BigHaat"
  ],
  "real-estate": [
    "Godrej Properties", "DLF Limited", "Prestige Estates", "Sobha Limited",
    "Lodha (Macrotech)", "Brigade Group", "Oberoi Realty", "MagicBricks",
    "NoBroker", "99acres"
  ],
  utilities: [
    "Tata Power", "Adani Electricity", "BSES Delhi", "Mahanagar Gas",
    "Indraprastha Gas", "Indane LPG", "Bharat Gas", "HP Gas"
  ],
  automobiles: [
    "Tata Motors", "Mahindra & Mahindra", "Maruti Suzuki", "Hyundai India",
    "Kia India", "Toyota Kirloskar", "Honda Cars India", "MG Motor India",
    "Hero MotoCorp", "Bajaj Auto", "TVS Motor", "Royal Enfield",
    "Ather Energy", "Ola Electric"
  ],
  travel: [
    "IndiGo Airlines", "Air India", "Akasa Air", "SpiceJet",
    "IRCTC Rail", "MakeMyTrip", "Goibibo", "OYO Rooms",
    "Taj Hotels", "Uber India", "Rapido"
  ],
  education: [
    "Physics Wallah", "Unacademy", "upGrad", "Coursera",
    "Vedantu", "BYJU'S"
  ],
  electronics: [
    "Samsung", "Apple India", "Sony India", "LG Electronics",
    "OnePlus", "Xiaomi", "Voltas", "Daikin India",
    "Havells", "Whirlpool", "Bosch India", "Panasonic"
  ],
  retail: [
    "Amazon India", "Flipkart", "Myntra", "Nykaa",
    "Meesho", "Tata CLiQ", "Reliance Retail", "DMart"
  ],
  "jobs-skilling": [
    "Naukri.com", "LinkedIn India", "Indeed India", "Foundit (Monster)",
    "Internshala", "Scaler Academy"
  ],
  government: [
    "DigiLocker", "UMANG", "Aadhaar (UIDAI)", "Parivahan Sewa",
    "Income Tax e-Filing", "EPFO Portal", "CoWIN", "IRCTC Rail Connect"
  ]
};

const SECTOR_TITLES: Record<string, string> = {
  insurance: "Showing 26 Registered Life Insurers",
  banking: "Showing 12 Commercial & Retail Banks",
  investments: "Showing 9 Mutual Funds & Broker Platforms",
  healthcare: "Showing 9 Super-Specialty Hospital Chains & Labs",
  pharma: "Showing 8 Online Pharmacies & Medicine Makers",
  telecom: "Showing 7 Telecom Providers & Fiber Networks",
  "internet-ott": "Showing 7 Streaming Platforms & Content Networks",
  food: "Showing 8 Food Delivery & Quick Commerce Platforms",
  agriculture: "Showing 8 Agricultural & Farming Enterprises",
  "real-estate": "Showing 10 RERA-Audited Real Estate Builders",
  utilities: "Showing 8 Electricity & Piped Gas Utilities",
  automobiles: "Showing 14 Automobile & EV Manufacturers",
  travel: "Showing 11 Airlines, Railways & Travel Portals",
  education: "Showing 6 Online Learning Platforms & EdTechs",
  electronics: "Showing 12 Consumer Electronics & Appliance Brands",
  retail: "Showing 8 E-Commerce Marketplaces & Retailers",
  "jobs-skilling": "Showing 6 Job Portals & Skilling Platforms",
  government: "Showing 8 Citizen Services & Government Portals"
};

export default function Header() {
  const industries = getAllIndustries();
  const insuranceIndustry = industries.find((i) => i.slug === "insurance") || industries[0];
  const brands = insuranceIndustry?.brands || [];

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeBrandSector, setActiveBrandSector] = useState("insurance");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoSector, setVideoSector] = useState("insurance");
  const [videoFileStatus, setVideoFileStatus] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [mobileBrandFilter, setMobileBrandFilter] = useState("");
  const [mobileSectorFilter, setMobileSectorFilter] = useState("");
  const [signInOpen, setSignInOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tv-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // Close menus on outside click or escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setSearchOpen(false);
        setDrawerOpen(false);
        setMobileSubMenu(null);
        setSignInOpen(false);
        setVideoModalOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Live search index matching
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const out: SearchResult[] = [];

    // Search brands
    brands.forEach((b) => {
      if (b.name.toLowerCase().includes(q) || b.regulatoryId.toLowerCase().includes(q)) {
        out.push({
          kind: "Brand",
          title: b.name,
          sub: `${b.regulatoryId} · Claim Ratio ${b.claimSettlementRatio}%`,
          url: `/insurance/providers/${b.slug}`,
        });
      }
      // Search products inside brand
      b.products?.forEach((p) => {
        if (p.name.toLowerCase().includes(q)) {
          out.push({
            kind: "Product",
            title: p.name,
            sub: `${b.name} · ${p.category} · TrustScore ${p.trustScore}`,
            url: `/insurance/providers/${b.slug}`,
          });
        }
      });
    });

    // Search categories
    TYPES.forEach((t) => {
      if (t.name.toLowerCase().includes(q)) {
        out.push({
          kind: "Category",
          title: t.name,
          sub: t.plain.slice(0, 70) + "…",
          url: `/insurance/life/term-insurance`,
        });
      }
    });

    // Search glossary & guides
    GLOSSARY.forEach((g) => {
      if ((g.term + " " + g.def).toLowerCase().includes(q)) {
        out.push({
          kind: "Glossary",
          title: g.term,
          sub: g.def.slice(0, 80) + "…",
          url: `/blog`,
        });
      }
    });

    ARTICLES.forEach((a) => {
      if (a.title.toLowerCase().includes(q)) {
        out.push({
          kind: "Guide",
          title: a.title,
          sub: "Research Desk",
          url: `/blog/irdai-3-year-incontestability-rule-explained`,
        });
      }
    });

    QUESTIONS.forEach((x) => {
      if (x.q.toLowerCase().includes(q)) {
        out.push({
          kind: "Question",
          title: x.q,
          sub: x.answered ? "Verified Guidance" : "Regulatory Query",
          url: `/contact`,
        });
      }
    });

    setSearchResults(out.slice(0, 8));
  }, [searchQuery, brands]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavMouseEnter = (menuName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menuName);
  };

  const handleNavMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const handleWheelHorizontal = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  const toggleMenu = (menuName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setSearchQuery("");
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");
    const cleanPhone = phone.replace(/\D/g, "");
    if (!otpSent) {
      if (cleanPhone.length !== 10) {
        setSignInError("Enter a valid 10-digit mobile number.");
        return;
      }
      setOtpSent(true);
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setSignInError("Enter the 6-digit confirmation code.");
      return;
    }
    if (!agreeTerms) {
      setSignInError("Please confirm you are 18 or older and accept the terms.");
      return;
    }
    const displayName = name.trim() || "Policyholder";
    const loggedUser = { name: displayName, phone: cleanPhone };
    try {
      localStorage.setItem("tv-user", JSON.stringify(loggedUser));
    } catch {}
    setUser(loggedUser);
    setSignInOpen(false);
  };

  return (
    <>
      <header
        id="hdr"
        className="hdr"
        ref={headerRef}
        onMouseLeave={handleNavMouseLeave}
      >
        <div className="wrap hdr-row">
          <Link className="hdr-logo" href="/" aria-label="TrustValue.ai home">
            <img
              src="/brand/logo.webp"
              alt="TrustValue.ai"
              width={170}
              height={26}
              style={{ height: "26px", width: "auto" }}
            />
          </Link>

          <nav className="nav" aria-label="Main">
            {/* 0. All Sectors (Unified Multi-Sector Hub) */}
            <div
              className="nav-item"
              onMouseEnter={() => handleNavMouseEnter("sectors")}
            >
              <button
                type="button"
                className={`nav-btn nav-btn--sectors ${activeMenu === "sectors" ? "on" : ""}`}
                onClick={(e) => toggleMenu("sectors", e)}
                aria-expanded={activeMenu === "sectors"}
                aria-controls="hdr-mega-panel"
              >
                All Sectors
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    transform: activeMenu === "sectors" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 1. Brands Nav Item */}
            <div
              className="nav-item"
              onMouseEnter={() => handleNavMouseEnter("brands")}
            >
              <button
                type="button"
                className={`nav-btn ${activeMenu === "brands" ? "on" : ""}`}
                onClick={(e) => toggleMenu("brands", e)}
                aria-expanded={activeMenu === "brands"}
                aria-controls="hdr-mega-panel"
              >
                Brands
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    transform: activeMenu === "brands" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 2. Products Nav Item */}
            <div
              className="nav-item"
              onMouseEnter={() => handleNavMouseEnter("products")}
            >
              <button
                type="button"
                className={`nav-btn ${activeMenu === "products" ? "on" : ""}`}
                onClick={(e) => toggleMenu("products", e)}
                aria-expanded={activeMenu === "products"}
                aria-controls="hdr-mega-panel"
              >
                Products &amp; Plans
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    transform: activeMenu === "products" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 3. Research Desk Nav Item */}
            <div
              className="nav-item"
              onMouseEnter={() => handleNavMouseEnter("research")}
            >
              <button
                type="button"
                className={`nav-btn ${activeMenu === "research" || activeMenu === "learn" ? "on" : ""}`}
                onClick={(e) => toggleMenu("research", e)}
                aria-expanded={activeMenu === "research" || activeMenu === "learn"}
                aria-controls="hdr-mega-panel"
              >
                Research Desk
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    transform: activeMenu === "research" || activeMenu === "learn" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 4. Community Nav Item */}
            <div
              className="nav-item"
              onMouseEnter={() => handleNavMouseEnter("community")}
            >
              <button
                type="button"
                className={`nav-btn ${activeMenu === "community" ? "on" : ""}`}
                onClick={(e) => toggleMenu("community", e)}
                aria-expanded={activeMenu === "community"}
                aria-controls="hdr-mega-panel"
              >
                Community
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    transform: activeMenu === "community" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </nav>

          <div className="hdr-end">
            <button
              className="icon-btn"
              type="button"
              onClick={handleOpenSearch}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16.5 16.5 21 21" />
                </g>
              </svg>
            </button>

            {user ? (
              <span className="avatar" title={`Signed in as ${user.name}`}>
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            ) : (
              <button
                className="btn btn-ghost btn-sm hdr-desk-only"
                type="button"
                onClick={() => setSignInOpen(true)}
              >
                Sign in
              </button>
            )}

            <Link className="btn btn-primary btn-sm hdr-desk-only" href="/#experience">
              Rate Experience
            </Link>

            <button
              className="icon-btn hdr-burger-only"
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* FULL-WIDTH MEGA DROPDOWN PANEL */}
        {activeMenu && (
          <div
            className="mega-fullwidth"
            id="hdr-mega-panel"
            role="region"
            aria-label={`${activeMenu} menu`}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="wrap mega-inner">
              {/* 0. ALL SECTORS FULL WIDTH PANEL */}
              {activeMenu === "sectors" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>All 18 Regulated Consumer Sectors</h3>
                      <span>Select any industry to browse verified audits, statutory ratios, and pricing transparency</span>
                    </div>
                  </div>

                  <div className="sector-category-grid">
                    {/* Cluster 1: Money & Financial Protection */}
                    <div className="sector-cluster">
                      <div className="sector-cluster-head">
                        <i className="fa-solid fa-vault mr-1" aria-hidden="true" /> Money &amp; Protection
                      </div>

                      <Link className="sector-item-card" href="/insurance" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#2563EB", background: "#EFF6FF" }}>
                          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Insurance</span>
                            <span className="sector-status-pill pill--live">Live Audit</span>
                          </div>
                          <div className="sector-item-sub">Term, health, motor, travel · 26 Insurers</div>
                        </div>
                      </Link>

                      <Link className="sector-item-card" href="/banking" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#0D9488", background: "#F0FDFA" }}>
                          <i className="fa-solid fa-building-columns" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Banking &amp; Loans</span>
                            <span className="sector-status-pill pill--vote">Next to Open</span>
                          </div>
                          <div className="sector-item-sub">Savings, credit cards, home &amp; personal loans</div>
                        </div>
                      </Link>

                      <Link className="sector-item-card" href="/investments" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#7C3AED", background: "#FAF5FF" }}>
                          <i className="fa-solid fa-chart-line" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Investments</span>
                            <span className="sector-status-pill pill--vote">Pledge Vote</span>
                          </div>
                          <div className="sector-item-sub">Mutual funds, stocks, NPS, corporate FDs</div>
                        </div>
                      </Link>
                    </div>

                    {/* Cluster 2: Health & Life Essentials */}
                    <div className="sector-cluster">
                      <div className="sector-cluster-head">
                        <i className="fa-solid fa-heart-pulse mr-1" aria-hidden="true" /> Health &amp; Everyday Life
                      </div>

                      <Link className="sector-item-card" href="/healthcare" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#E11D48", background: "#FFF1F2" }}>
                          <i className="fa-solid fa-hospital" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Healthcare</span>
                            <span className="sector-status-pill pill--vote">1,000 Signals</span>
                          </div>
                          <div className="sector-item-sub">Hospitals, diagnostics, cashless turnarounds</div>
                        </div>
                      </Link>

                      <Link className="sector-item-card" href="/pharma" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#D97706", background: "#FFFBEB" }}>
                          <i className="fa-solid fa-pills" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Pharma &amp; Pharmacy</span>
                            <span className="sector-status-pill pill--vote">Pledge Vote</span>
                          </div>
                          <div className="sector-item-sub">Medicines, generics, online pharmacies</div>
                        </div>
                      </Link>

                      <Link className="sector-item-card" href="/food" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#059669", background: "#ECFDF5" }}>
                          <i className="fa-solid fa-basket-shopping" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Food &amp; Grocery</span>
                            <span className="sector-status-pill pill--vote">Pledge Vote</span>
                          </div>
                          <div className="sector-item-sub">Packaged foods, quick commerce, quality tests</div>
                        </div>
                      </Link>
                    </div>

                    {/* Cluster 3: Mobility & Housing */}
                    <div className="sector-cluster">
                      <div className="sector-cluster-head">
                        <i className="fa-solid fa-car mr-1" aria-hidden="true" /> Mobility, Housing &amp; Infra
                      </div>

                      <Link className="sector-item-card" href="/automobiles" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#2563EB", background: "#EFF6FF" }}>
                          <i className="fa-solid fa-car" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Automobiles</span>
                            <span className="sector-status-pill pill--vote">Opens 4th</span>
                          </div>
                          <div className="sector-item-sub">Cars, EVs, safety crash ratings (B-NCAP)</div>
                        </div>
                      </Link>

                      <Link className="sector-item-card" href="/real-estate" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#EA580C", background: "#FFF7ED" }}>
                          <i className="fa-solid fa-city" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Real Estate</span>
                            <span className="sector-status-pill pill--vote">RERA Audits</span>
                          </div>
                          <div className="sector-item-sub">Housing projects, possession dates, carpet area</div>
                        </div>
                      </Link>

                      <Link className="sector-item-card" href="/telecom" onClick={() => setActiveMenu(null)}>
                        <div className="sector-item-icon" style={{ color: "#0284C7", background: "#F0F9FF" }}>
                          <i className="fa-solid fa-tower-broadcast" aria-hidden="true" />
                        </div>
                        <div className="sector-item-body">
                          <div className="sector-item-title">
                            <span>Telecom &amp; Fiber</span>
                            <span className="sector-status-pill pill--vote">Opens 3rd</span>
                          </div>
                          <div className="sector-item-sub">Prepaid, 5G coverage, broadband latency</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      Explore all 18 regulated consumer sectors with statutorily indexed audits &amp; Ombudsman metrics.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-primary btn-sm"
                        href="/insurance"
                        onClick={() => setActiveMenu(null)}
                      >
                        Explore All Sectors
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. BRANDS FULL WIDTH PANEL (18 Sectors Tabbed Matrix) */}
              {activeMenu === "brands" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Verified Brands Directory</h3>
                      <span>Statutorily regulated providers cross-referenced with IRDAI, RBI, RERA, and NABH filings</span>
                    </div>
                    <Link
                      href="/insurance/providers"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      Browse All Providers →
                    </Link>
                  </div>

                  <div className="mega-brands-layout">
                    {/* Sector Selector Rail (All 18 Regulated Sectors) */}
                    <div className="sector-filter-sidebar">
                      {SECTORS_LIST.map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          className={`sector-tab-btn ${activeBrandSector === sec.id ? "active" : ""}`}
                          onClick={() => setActiveBrandSector(sec.id)}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className={`fa-solid ${sec.icon} text-xs`} aria-hidden="true" />
                            {sec.name}
                          </span>
                          <span className="tab-count">{sec.count}</span>
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Brands Grid */}
                    <div className="brands-stage">
                      <div className="brands-stage-header">
                        <strong style={{ fontSize: "0.95rem", color: "#071B46" }}>
                          {SECTOR_TITLES[activeBrandSector] || `Showing ${SECTOR_BRANDS_RECORD[activeBrandSector]?.length || 0} Brands`}
                        </strong>
                        <small style={{ color: "#64748B" }}>Bayesian Authenticity Weighted</small>
                      </div>

                      <div className="brands-grid-4col">
                        {(SECTOR_BRANDS_RECORD[activeBrandSector] || []).map((bName, idx) => {
                          const num = String(idx + 1).padStart(2, "0");
                          const slug = bName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                          return (
                            <Link
                              key={slug}
                              href={`/${activeBrandSector}/providers/${slug}`}
                              className="brand-cell-link"
                              onClick={() => setActiveMenu(null)}
                            >
                              <span className="brand-cell-num">{num}</span>
                              <span className="brand-cell-name">{bName}</span>
                              <span style={{ color: "#CBD5E1", fontSize: "0.75rem", marginLeft: "auto" }}>↗</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      No brand can pay, sponsor, or alter their TrustScore. Commercial teams are legally separated from audits.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/insurance/providers"
                        onClick={() => setActiveMenu(null)}
                      >
                        Full Provider Directory
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/rating"
                        onClick={() => setActiveMenu(null)}
                      >
                        Auditing Methodology
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PRODUCTS FULL WIDTH PANEL */}
              {activeMenu === "products" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Audited Products &amp; Plan Categories</h3>
                      <span>Explore policies across term life, savings, investments, and health</span>
                    </div>
                    <Link
                      href="/insurance"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      Browse All Categories →
                    </Link>
                  </div>

                  <div className="mega-scroll-body">
                    <div className="mega-cards-grid">
                      <Link
                        href="/insurance/life/term-insurance"
                        className="mega-card-item mega-card--blue"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Term Insurance.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Pure life protection with maximum sum assured at lowest cost.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Pure Protection</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/life/savings-plans"
                        className="mega-card-item mega-card--purple"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Savings &amp; Endowment.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Guaranteed money-back and capital preservation life plans.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Guaranteed Returns</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/life/ulip"
                        className="mega-card-item mega-card--pink"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">ULIPs.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Market-linked equity and debt funds with integrated cover.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Wealth Creation</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/life/pension-plans"
                        className="mega-card-item mega-card--amber"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Retirement &amp; Pension.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Guaranteed annuities and lifelong post-retirement income.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Lifelong Annuity</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/health/individual-health"
                        className="mega-card-item mega-card--cyan"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Individual Health.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Personal medical coverage with cashless network hospital admissions.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Cashless Hospitalization</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/health/family-floater"
                        className="mega-card-item mega-card--emerald"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Family Floater.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Shared sum insured covering spouse, dependent children, and parents.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Family Protection</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/health/senior-citizen-health"
                        className="mega-card-item mega-card--slate"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Senior Citizen Cover.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Specialized medical policies for elderly family members with pre-existing illness.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Elder Care</span>
                        </div>
                      </Link>

                      <Link
                        href="/insurance/compare/providers/hdfc-life-vs-max-life"
                        className="mega-card-item mega-card--navy"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Compare Insurers.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Side-by-side claim turnaround times, solvency ratios, and dispute data.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">HDFC Life vs Max Life</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      Compare plans side-by-side or inspect claim ratios before locking a contract.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/insurance"
                        onClick={() => setActiveMenu(null)}
                      >
                        All Categories
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/rating"
                        onClick={() => setActiveMenu(null)}
                      >
                        Trust Leaderboard
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RESEARCH DESK FULL WIDTH PANEL */}
              {(activeMenu === "research" || activeMenu === "learn") && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Regulatory Explainers &amp; Consumer Playbooks</h3>
                      <span>Statutory circular breakdowns, legal rights, and Ombudsman escalation guides</span>
                    </div>
                    <Link
                      href="/blog"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      Browse All Research →
                    </Link>
                  </div>

                  <div className="mega-scroll-body">
                    <div className="mega-cards-grid">
                      {/* 1. Research Desk */}
                      <Link
                        href="/blog"
                        className="mega-card-item"
                        style={{ background: "#F0F6FE", borderColor: "#DBEAFE" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Research Desk.</h4>
                          <span style={{ color: "#2563EB", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">Evidence-backed explainers and statutory circular breakdowns.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#DBEAFE", color: "#1E40AF" }}>
                            Research &amp; Guides
                          </span>
                        </div>
                      </Link>

                      {/* 2. Section 45 Rule */}
                      <Link
                        href="/blog/irdai-3-year-incontestability-rule-explained"
                        className="mega-card-item"
                        style={{ background: "#F5F3FF", borderColor: "#EDE9FE" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Section 45 Rule.</h4>
                          <span style={{ color: "#7C3AED", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">Why life insurers cannot reject claims after 36 months of policy inception.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#EDE9FE", color: "#5B21B6" }}>
                            Incontestability
                          </span>
                        </div>
                      </Link>

                      {/* 3. RERA Carpet Area */}
                      <Link
                        href="/blog/rera-carpet-area-vs-built-up-guide"
                        className="mega-card-item"
                        style={{ background: "#FDF2F8", borderColor: "#FCE7F3" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">RERA Carpet Area.</h4>
                          <span style={{ color: "#DB2777", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">Statutory carpet area measurements and RERA escrow protections.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#FCE7F3", color: "#9D174D" }}>
                            Real Estate Audit
                          </span>
                        </div>
                      </Link>

                      {/* 4. NABH Cashless Standards */}
                      <Link
                        href="/blog/nabh-cashless-hospital-turnaround-times"
                        className="mega-card-item"
                        style={{ background: "#FEFCE8", borderColor: "#FEF08A" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">NABH Cashless Standards.</h4>
                          <span style={{ color: "#CA8A04", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">TPA query resolution timelines, discharge procedures, and repudiation appeals.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#FEF08A", color: "#854D0E" }}>
                            Hospital Discharges
                          </span>
                        </div>
                      </Link>

                      {/* 5. Claim Dispute Help */}
                      <Link
                        href="/contact"
                        className="mega-card-item"
                        style={{ background: "#ECFEFF", borderColor: "#CFFAFE" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Claim Dispute Help.</h4>
                          <span style={{ color: "#0891B2", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">Step-by-step guidance on Ombudsman escalation and repudiation appeals.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#CFFAFE", color: "#155E75" }}>
                            Ombudsman Escalation
                          </span>
                        </div>
                      </Link>

                      {/* 6. TrustScore Leaderboard */}
                      <Link
                        href="/rating"
                        className="mega-card-item"
                        style={{ background: "#F0FDF4", borderColor: "#DCFCE7" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">TrustScore Leaderboard.</h4>
                          <span style={{ color: "#16A34A", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">Multi-sector benchmark index across 18 regulated consumer sectors.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#DCFCE7", color: "#166534" }}>
                            18 Regulated Sectors
                          </span>
                        </div>
                      </Link>

                      {/* 7. Consumer Telemetry */}
                      <Link
                        href="/reviews"
                        className="mega-card-item"
                        style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Consumer Telemetry.</h4>
                          <span style={{ color: "#475569", fontWeight: 700, fontSize: "1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc">Verified policyholder experiences backed by settlement receipts.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "#E2E8F0", color: "#334155" }}>
                            Evidence Backed
                          </span>
                        </div>
                      </Link>

                      {/* 8. How TrustScores Work (Navy Hero Card) */}
                      <Link
                        href="/rating"
                        className="mega-card-item"
                        style={{ background: "#071B46", borderColor: "#0F2D6B", color: "#FFFFFF" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title" style={{ color: "#FFFFFF" }}>How TrustScores Work.</h4>
                          <span style={{ color: "#FF5A0A", fontWeight: 800, fontSize: "1.1rem" }}>↗</span>
                        </div>
                        <p className="mega-card-desc" style={{ color: "#CBD5E1" }}>Bayesian authenticity math, evidence weighting, and anti-gaming formulas.</p>
                        <div>
                          <span className="mega-card-tag" style={{ background: "rgba(255,255,255,0.12)", color: "#93C5FD" }}>
                            Bayesian Formula
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      All research written and verified by former ombudsman officers and legal researchers.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/blog"
                        onClick={() => setActiveMenu(null)}
                      >
                        Research Desk
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/contact"
                        onClick={() => setActiveMenu(null)}
                      >
                        Escalate a Dispute
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COMMUNITY FULL WIDTH PANEL (With Video Upload) */}
              {activeMenu === "community" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Community Telemetry &amp; Evidence</h3>
                      <span>On-camera consumer proof, cashless hospital slips, and tamper-proof ratings across 18 sectors</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setVideoModalOpen(true)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <i className="fa-solid fa-video"></i> Upload Video Review
                      </button>
                      <Link
                        href="/reviews"
                        className="mega-head-link"
                        onClick={() => setActiveMenu(null)}
                      >
                        Telemetry Feed →
                      </Link>
                    </div>
                  </div>

                  <div className="mega-scroll-body">
                    <div className="mega-cards-grid-3col">
                      {/* 1. Video Upload Action Card */}
                      <div
                        className="mega-card-item"
                        style={{ border: "2px solid #FF5A0A", background: "#FFF9F5", cursor: "pointer" }}
                        onClick={() => setVideoModalOpen(true)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title" style={{ color: "#E04E00", display: "flex", alignItems: "center", gap: "6px" }}>
                            <i className="fa-solid fa-video" style={{ color: "#FF5A0A" }}></i> Video Proof Upload.
                          </h4>
                          <span className="sector-status-pill" style={{ background: "#FF5A0A", color: "#fff" }}>Upload Now</span>
                        </div>
                        <p className="mega-card-desc">
                          Record or upload a 60-second video on camera explaining your cashless hospital admission, car delivery, or claim payout.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                          <span className="mega-card-tag" style={{ background: "rgba(255,90,10,0.15)", color: "#E04E00", fontWeight: 700 }}>
                            Camera &amp; Video Proof
                          </span>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FF5A0A" }}>Start Recording →</span>
                        </div>
                      </div>

                      {/* 2. Video Reviews Stream */}
                      <Link
                        href="/reviews"
                        className="mega-card-item"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Verified Video Reviews.</h4>
                          <i className="fa-solid fa-circle-play" style={{ color: "#7C3AED", fontSize: "1.2rem" }}></i>
                        </div>
                        <p className="mega-card-desc">Watch authentic policyholders and consumers explain cashless turnaround speeds and claim delays on camera.</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                          <span className="mega-card-tag">On-Camera Telemetry</span>
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>Watch Feed ↗</span>
                        </div>
                      </Link>

                      {/* 3. Live Telemetry Stream */}
                      <Link
                        href="/reviews"
                        className="mega-card-item"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Live Telemetry Stream.</h4>
                          <i className="fa-solid fa-wave-square" style={{ color: "#2563EB", fontSize: "1.2rem" }}></i>
                        </div>
                        <p className="mega-card-desc">Real-time cryptographic stream of verified consumer ratings across all 18 regulated sectors.</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                          <span className="mega-card-tag">Reviews &amp; Telemetry</span>
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>Browse Stream ↗</span>
                        </div>
                      </Link>

                      {/* 4. Settlement Receipts & Photos */}
                      <Link
                        href="/reviews"
                        className="mega-card-item"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Settlement Evidence.</h4>
                          <i className="fa-solid fa-file-invoice" style={{ color: "#059669", fontSize: "1.2rem" }}></i>
                        </div>
                        <p className="mega-card-desc">Redacted settlement receipts, hospital discharge letters, and RERA escrow delivery certificates.</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                          <span className="mega-card-tag">Document Proof</span>
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>View Receipts ↗</span>
                        </div>
                      </Link>

                      {/* 5. One Gesture 7-Second Rating */}
                      <Link
                        href="/#experience"
                        className="mega-card-item"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">One Gesture Rating.</h4>
                          <i className="fa-solid fa-bolt" style={{ color: "#FF5A0A", fontSize: "1.2rem" }}></i>
                        </div>
                        <p className="mega-card-desc">Lock your 7-second rating with zero corporate influence, salesperson callbacks, or spam.</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                          <span className="mega-card-tag">Fast &amp; Pure</span>
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>Rate Experience ↗</span>
                        </div>
                      </Link>

                      {/* 6. Ombudsman Escalation Desk */}
                      <Link
                        href="/contact"
                        className="mega-card-item"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="mega-card-item-top">
                          <h4 className="mega-card-title">Ombudsman Escalation.</h4>
                          <i className="fa-solid fa-gavel" style={{ color: "#0EA5E9", fontSize: "1.2rem" }}></i>
                        </div>
                        <p className="mega-card-desc">Free consumer grievance support and Ombudsman escalation workflows for rejected claims or disputes.</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                          <span className="mega-card-tag">Grievance Support</span>
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>File Dispute ↗</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      Only verified buyers can upload video proof or lock ratings. All revisions are publicly audit-trailed.
                    </span>
                    <div className="mega-panel-foot-links">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setVideoModalOpen(true)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <i className="fa-solid fa-video"></i> Upload Video Review
                      </button>
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/#experience"
                        onClick={() => setActiveMenu(null)}
                      >
                        Rate Experience
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/reviews"
                        onClick={() => setActiveMenu(null)}
                      >
                        All Reviews
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* VIDEO UPLOAD MODAL DIALOG */}
      {videoModalOpen && (
        <div
          className="video-modal-backdrop open"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="video-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Upload Video Review"
          >
            <button
              type="button"
              className="video-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#FFF1E8",
                  color: "#FF5A0A",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.25rem",
                }}
              >
                <i className="fa-solid fa-video"></i>
              </span>
              <div>
                <h3 style={{ font: "800 1.25rem/1.2 var(--f-display)", color: "var(--navy)" }}>
                  Upload Video Review &amp; Proof
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--slate)" }}>
                  60-second authentic customer proof · Indexed across 18 sectors
                </p>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", font: "700 0.82rem/1.2 var(--f-display)", color: "var(--navy)", marginBottom: "6px" }}>
                Select Sector
              </label>
              <select
                value={videoSector}
                onChange={(e) => setVideoSector(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  fontFamily: "var(--f-body)",
                  fontSize: "0.88rem",
                  color: "var(--ink)",
                  background: "#FAFBFD",
                }}
              >
                {SECTORS_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>

            <label
              className="video-dropzone"
              style={{ display: "block" }}
            >
              <input
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setVideoFileStatus(`Selected: ${e.target.files[0].name} (${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB)`);
                  }
                }}
              />
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "2.2rem", color: "#FF5A0A", marginBottom: "8px", display: "block" }}></i>
              <h4 style={{ font: "700 0.95rem/1.2 var(--f-display)", color: "var(--navy)" }}>
                Choose video file or drag &amp; drop here
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--slate)", marginTop: "4px" }}>
                {videoFileStatus || "MP4, MOV, WebM up to 150MB · Up to 3 minutes"}
              </p>
            </label>

            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ flex: 1, borderColor: "#CBD5E1", color: "var(--navy)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                onClick={() => alert("Camera recording: WebRTC video stream ready to record up to 60 seconds.")}
              >
                <i className="fa-solid fa-camera"></i> Record on Camera
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                onClick={() => {
                  alert(`Video proof submitted for ${videoSector}! Authenticity indexing initiated.`);
                  setVideoModalOpen(false);
                  setVideoFileStatus(null);
                }}
              >
                <i className="fa-solid fa-check"></i> Submit Video Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Smooth Sliding Drill-Down Architecture) */}
      {drawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => {
            setDrawerOpen(false);
            setMobileSubMenu(null);
            setMobileBrandFilter("");
          }}
        >
          <div
            className="mobile-drawer-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-viewport">
              {/* SCREEN 1: PRIMARY MAIN MENU */}
              <div className={`mobile-drawer-panel mobile-drawer-panel--main ${mobileSubMenu ? "is-shifted" : ""}`}>
                <div className="mobile-drawer-header">
                  <Link
                    href="/"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img src="/brand/logo.webp" alt="TrustValue" style={{ height: "26px", width: "auto" }} />
                  </Link>
                  <button
                    className="mobile-drawer-close-btn"
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                    aria-label="Close menu"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                {/* Primary Action Button */}
                <div style={{ padding: "16px 20px 8px 20px" }}>
                  <Link
                    className="btn btn-primary btn-block"
                    href="/#experience"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 700 }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Rate Experience
                  </Link>

                  {user ? (
                    <div style={{ marginTop: "12px", padding: "10px 14px", background: "#F1F5F9", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem" }}>
                      <span className="avatar" style={{ width: "28px", height: "28px", fontSize: "0.8rem" }}>
                        {user.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span>Signed in as <b>{user.name}</b></span>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-block"
                      style={{ marginTop: "10px", border: "1px solid #E2E8F0" }}
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                        setSignInOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: "6px" }}></i>
                      Sign in / Register
                    </button>
                  )}
                </div>

                {/* Section Title */}
                <div style={{ padding: "14px 20px 4px 20px", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94A3B8" }}>
                  Explore Directories
                </div>

                {/* Sliding Category Triggers */}
                <nav style={{ display: "flex", flexDirection: "column" }}>
                  <button
                    type="button"
                    className="mobile-nav-item-btn"
                    onClick={() => setMobileSubMenu("sectors")}
                  >
                    <div className="mobile-nav-item-left">
                      <div className="mobile-nav-item-icon" style={{ background: "#FFF1E8", color: "#FF5A0A" }}>
                        <i className="fa-solid fa-shapes"></i>
                      </div>
                      <div>
                        <div>All 18 Sectors</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>Browse All Regulated Consumer Verticals</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: "#94A3B8", fontSize: "0.85rem" }}></i>
                  </button>

                  <button
                    type="button"
                    className="mobile-nav-item-btn"
                    onClick={() => setMobileSubMenu("brands")}
                  >
                    <div className="mobile-nav-item-left">
                      <div className="mobile-nav-item-icon" style={{ background: "#EFF6FF", color: "#2563EB" }}>
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div>
                        <div>Brands Directory</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>26 Life Insurers &amp; Claim Ratios</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: "#94A3B8", fontSize: "0.85rem" }}></i>
                  </button>

                  <button
                    type="button"
                    className="mobile-nav-item-btn"
                    onClick={() => setMobileSubMenu("products")}
                  >
                    <div className="mobile-nav-item-left">
                      <div className="mobile-nav-item-icon" style={{ background: "#F0FDF4", color: "#16A34A" }}>
                        <i className="fa-solid fa-cubes-stacked"></i>
                      </div>
                      <div>
                        <div>Products &amp; Plans</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>Term, ULIP, Pension &amp; Savings</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: "#94A3B8", fontSize: "0.85rem" }}></i>
                  </button>

                  <button
                    type="button"
                    className="mobile-nav-item-btn"
                    onClick={() => setMobileSubMenu("learn")}
                  >
                    <div className="mobile-nav-item-left">
                      <div className="mobile-nav-item-icon" style={{ background: "#FAF5FF", color: "#9333EA" }}>
                        <i className="fa-solid fa-book-open-reader"></i>
                      </div>
                      <div>
                        <div>Learn &amp; Research</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>Research Desk &amp; Legal Guides</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: "#94A3B8", fontSize: "0.85rem" }}></i>
                  </button>

                  <button
                    type="button"
                    className="mobile-nav-item-btn"
                    onClick={() => setMobileSubMenu("community")}
                  >
                    <div className="mobile-nav-item-left">
                      <div className="mobile-nav-item-icon" style={{ background: "#FFF7ED", color: "#EA580C" }}>
                        <i className="fa-solid fa-users"></i>
                      </div>
                      <div>
                        <div>Community &amp; Reviews</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>Verified Telemetry &amp; Proof</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: "#94A3B8", fontSize: "0.85rem" }}></i>
                  </button>
                </nav>

                {/* Section Title */}
                <div style={{ padding: "20px 20px 4px 20px", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94A3B8" }}>
                  Institutional &amp; Trust
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link
                    className="mobile-nav-link"
                    href="/insurance"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                  >
                    <span><i className="fa-solid fa-building-columns" style={{ width: "20px", color: "#64748B", marginRight: "10px" }}></i> Life Insurance Sector</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", opacity: 0.5 }}></i>
                  </Link>
                  <Link
                    className="mobile-nav-link"
                    href="/rating"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                  >
                    <span><i className="fa-solid fa-square-poll-vertical" style={{ width: "20px", color: "#64748B", marginRight: "10px" }}></i> TrustScore Methodology</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", opacity: 0.5 }}></i>
                  </Link>
                  <Link
                    className="mobile-nav-link"
                    href="/about"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                  >
                    <span><i className="fa-solid fa-circle-info" style={{ width: "20px", color: "#64748B", marginRight: "10px" }}></i> About TrustValue</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", opacity: 0.5 }}></i>
                  </Link>
                  <Link
                    className="mobile-nav-link"
                    href="/contact"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                  >
                    <span><i className="fa-solid fa-envelope" style={{ width: "20px", color: "#64748B", marginRight: "10px" }}></i> Contact Support</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", opacity: 0.5 }}></i>
                  </Link>
                </div>

                {/* Trust Footer Notice */}
                <div style={{ margin: "24px 20px 10px 20px", padding: "14px 16px", borderRadius: "12px", background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#071B46", marginBottom: "4px" }}>
                    <i className="fa-solid fa-scale-balanced" style={{ color: "#2563EB" }}></i>
                    Independent &amp; Non-Sponsored
                  </div>
                  Zero sponsored rankings or distributor commissions. All metrics cross-referenced with IRDAI regulatory filings.
                </div>
              </div>

              {/* SCREEN 2: ANIMATED SUB-MENU (Slides in from right) */}
              <div className={`mobile-drawer-panel mobile-drawer-panel--sub ${mobileSubMenu ? "is-active" : ""}`}>
                {/* Sub Header with Back Arrow */}
                <div className="mobile-drawer-header">
                  <button
                    className="mobile-drawer-back-btn"
                    type="button"
                    onClick={() => {
                      setMobileSubMenu(null);
                      setMobileBrandFilter("");
                      setMobileSectorFilter("");
                    }}
                    aria-label="Back to main menu"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back</span>
                  </button>
                  <span style={{ font: "700 0.95rem/1 var(--f-display)", color: "#071B46" }}>
                    {mobileSubMenu === "sectors" && "All 18 Sectors"}
                    {mobileSubMenu === "brands" && "Brands Directory"}
                    {mobileSubMenu === "products" && "Products & Plans"}
                    {mobileSubMenu === "learn" && "Learn & Research"}
                    {mobileSubMenu === "community" && "Community Hub"}
                  </span>
                  <button
                    className="mobile-drawer-close-btn"
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                    aria-label="Close menu"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                {/* SUB CONTENT 0: ALL 18 SECTORS */}
                {mobileSubMenu === "sectors" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ padding: "14px 16px 8px 16px" }}>
                      <div style={{ position: "relative" }}>
                        <i
                          className="fa-solid fa-magnifying-glass"
                          style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94A3B8",
                            fontSize: "0.88rem",
                          }}
                        ></i>
                        <input
                          type="text"
                          placeholder="Quick search 18 sectors..."
                          value={mobileSectorFilter}
                          onChange={(e) => setMobileSectorFilter(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 14px 10px 38px",
                            borderRadius: "10px",
                            border: "1px solid #CBD5E1",
                            background: "#F8FAFC",
                            fontSize: "0.88rem",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ padding: "6px 16px 8px 16px" }}>
                      <Link
                        href="/insurance"
                        onClick={() => {
                          setDrawerOpen(false);
                          setMobileSubMenu(null);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: "#071B46",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        <span><i className="fa-solid fa-compass" style={{ marginRight: "8px" }}></i> Explore All 18 Sectors Directory</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 20px 0" }}>
                      {SECTORS_LIST.filter((sec) =>
                        sec.name.toLowerCase().includes(mobileSectorFilter.toLowerCase()) ||
                        sec.count.toLowerCase().includes(mobileSectorFilter.toLowerCase())
                      ).map((sec) => (
                        <Link
                          key={sec.id}
                          href={sec.url}
                          onClick={() => {
                            setDrawerOpen(false);
                            setMobileSubMenu(null);
                          }}
                          className="mobile-sub-item-card"
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "8px",
                                background: "#EEF2F6",
                                color: "#071B46",
                                display: "grid",
                                placeItems: "center",
                                fontSize: "0.9rem",
                                flexShrink: 0,
                              }}
                            >
                              <i className={`fa-solid ${sec.icon}`}></i>
                            </div>
                            <div>
                              <div className="mobile-sub-item-title">{sec.name}</div>
                              <div className="mobile-sub-item-desc">{sec.count}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                              className={`sector-status-pill ${sec.id === "insurance" ? "pill--live" : "pill--vote"}`}
                            >
                              {sec.id === "insurance" ? "Live" : "Vote"}
                            </span>
                            <i className="fa-solid fa-chevron-right" style={{ color: "#94A3B8", fontSize: "0.8rem" }}></i>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB CONTENT 1: BRANDS */}
                {mobileSubMenu === "brands" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ padding: "14px 16px 8px 16px" }}>
                      <div style={{ position: "relative" }}>
                        <i
                          className="fa-solid fa-magnifying-glass"
                          style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94A3B8",
                            fontSize: "0.88rem",
                          }}
                        ></i>
                        <input
                          type="text"
                          placeholder={`Quick search ${SECTOR_BRANDS_RECORD[activeBrandSector]?.length || 26} brands...`}
                          value={mobileBrandFilter}
                          onChange={(e) => setMobileBrandFilter(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 14px 10px 38px",
                            borderRadius: "10px",
                            border: "1px solid #CBD5E1",
                            background: "#F8FAFC",
                            fontSize: "0.88rem",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    {/* Sector Selector Dropdown */}
                    <div style={{ padding: "0 16px 8px 16px" }}>
                      <select
                        value={activeBrandSector}
                        onChange={(e) => setActiveBrandSector(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          fontFamily: "var(--f-display)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#071B46",
                        }}
                      >
                        {SECTORS_LIST.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ padding: "0 16px 8px 16px" }}>
                      <Link
                        href="/insurance/providers"
                        onClick={() => {
                          setDrawerOpen(false);
                          setMobileSubMenu(null);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: "#071B46",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        <span><i className="fa-solid fa-compass" style={{ marginRight: "8px" }}></i> Full Provider Directory</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 20px 0" }}>
                      {activeBrandSector === "insurance" ? (
                        brands
                          .filter((b) =>
                            b.name.toLowerCase().includes(mobileBrandFilter.toLowerCase()) ||
                            b.regulatoryId.toLowerCase().includes(mobileBrandFilter.toLowerCase())
                          )
                          .map((b) => (
                            <Link
                              key={b.slug}
                              href={`/insurance/providers/${b.slug}`}
                              onClick={() => {
                                setDrawerOpen(false);
                                setMobileSubMenu(null);
                              }}
                              className="mobile-sub-item-card"
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div className="mobile-sub-item-title">{b.name}</div>
                                <span
                                  style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    background: "#EFF6FF",
                                    color: "#1E40AF",
                                  }}
                                >
                                  CSR {b.claimSettlementRatio}%
                                </span>
                              </div>
                              <div className="mobile-sub-item-desc" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <span>TrustScore: <strong style={{ color: "#071B46" }}>{b.trustScore}</strong></span>
                                <span>·</span>
                                <span>IRDAI #{b.regulatoryId}</span>
                              </div>
                            </Link>
                          ))
                      ) : (
                        (SECTOR_BRANDS_RECORD[activeBrandSector] || [])
                          .filter((name) => name.toLowerCase().includes(mobileBrandFilter.toLowerCase()))
                          .map((bName, idx) => (
                            <Link
                              key={bName}
                              href={`/${activeBrandSector}`}
                              onClick={() => {
                                setDrawerOpen(false);
                                setMobileSubMenu(null);
                              }}
                              className="mobile-sub-item-card"
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div className="mobile-sub-item-title">{bName}</div>
                                <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>
                                  #{idx + 1}
                                </span>
                              </div>
                            </Link>
                          ))
                      )}
                    </div>
                  </div>
                )}

                {/* SUB CONTENT 2: PRODUCTS */}
                {mobileSubMenu === "products" && (
                  <div style={{ padding: "8px 0 24px 0", flex: 1, overflowY: "auto" }}>
                    <div style={{ padding: "8px 16px 12px 16px" }}>
                      <Link
                        href="/insurance"
                        onClick={() => {
                          setDrawerOpen(false);
                          setMobileSubMenu(null);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: "#071B46",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        <span><i className="fa-solid fa-cubes" style={{ marginRight: "8px" }}></i> Browse Insurance Categories</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>

                    <Link
                      href="/insurance/life/term-insurance"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#EEF2F6",
                            color: "#071B46",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-umbrella"></i>
                        </div>
                        <div>
                          <div className="mobile-sub-item-title">Term Insurance</div>
                          <div className="mobile-sub-item-desc">Pure life cover with maximum sum assured</div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/insurance/life/savings-plans"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#EEF2F6",
                            color: "#071B46",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-piggy-bank"></i>
                        </div>
                        <div>
                          <div className="mobile-sub-item-title">Savings &amp; Endowment</div>
                          <div className="mobile-sub-item-desc">Guaranteed returns and money-back plans</div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/insurance/life/ulip"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#EEF2F6",
                            color: "#071B46",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div>
                          <div className="mobile-sub-item-title">ULIPs</div>
                          <div className="mobile-sub-item-desc">Market-linked equity funds with life cover</div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/insurance/health/individual-health"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#EEF2F6",
                            color: "#071B46",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-heart-pulse"></i>
                        </div>
                        <div>
                          <div className="mobile-sub-item-title">Health Insurance</div>
                          <div className="mobile-sub-item-desc">Cashless network hospital hospitalization</div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/insurance/compare/providers/hdfc-life-vs-max-life"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#EEF2F6",
                            color: "#071B46",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-scale-balanced"></i>
                        </div>
                        <div>
                          <div className="mobile-sub-item-title">Compare Insurers</div>
                          <div className="mobile-sub-item-desc">HDFC Life vs Max Life side-by-side audit</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* SUB CONTENT 3: LEARN */}
                {mobileSubMenu === "learn" && (
                  <div style={{ padding: "12px 0 24px 0", flex: 1, overflowY: "auto" }}>
                    <Link
                      href="/blog"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-graduation-cap" style={{ color: "#2563EB", marginRight: "8px" }}></i>
                        Research Desk &amp; Guides
                      </div>
                      <div className="mobile-sub-item-desc">
                        Deep-dive explainers on claims, policyholder rights, and hidden clauses.
                      </div>
                    </Link>

                    <Link
                      href="/blog/irdai-3-year-incontestability-rule-explained"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-shield-halved" style={{ color: "#7C3AED", marginRight: "8px" }}></i>
                        Section 45 Incontestability
                      </div>
                      <div className="mobile-sub-item-desc">
                        Why life insurers cannot reject claims after 36 months of inception.
                      </div>
                    </Link>

                    <Link
                      href="/blog/rera-carpet-area-vs-built-up-guide"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-building" style={{ color: "#D97706", marginRight: "8px" }}></i>
                        MahaRERA Carpet Area
                      </div>
                      <div className="mobile-sub-item-desc">
                        Statutory carpet area measurements and builder escrow rules.
                      </div>
                    </Link>

                    <Link
                      href="/blog/nabh-cashless-hospital-turnaround-times"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-hospital" style={{ color: "#059669", marginRight: "8px" }}></i>
                        NABH Cashless Standards
                      </div>
                      <div className="mobile-sub-item-desc">
                        TPA query resolution limits, discharge turnaround, and claim appeals.
                      </div>
                    </Link>

                    <Link
                      href="/rating"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-database" style={{ color: "#DC2626", marginRight: "8px" }}></i>
                        TrustScore Leaderboard
                      </div>
                      <div className="mobile-sub-item-desc">
                        Multi-sector benchmark index across 18 regulated consumer industries.
                      </div>
                    </Link>
                  </div>
                )}

                {/* SUB CONTENT 4: COMMUNITY */}
                {mobileSubMenu === "community" && (
                  <div style={{ padding: "12px 0 24px 0", flex: 1, overflowY: "auto" }}>
                    <button
                      type="button"
                      className="mobile-sub-item-card"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                        setVideoModalOpen(true);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "1.5px solid #FF5A0A",
                        background: "#FFF9F5",
                        cursor: "pointer",
                      }}
                    >
                      <div className="mobile-sub-item-title" style={{ color: "#E04E00" }}>
                        <i className="fa-solid fa-video" style={{ color: "#FF5A0A", marginRight: "8px" }}></i>
                        Upload Video Review
                      </div>
                      <div className="mobile-sub-item-desc">
                        Record 60-second on-camera customer proof with proof receipts.
                      </div>
                    </button>

                    <Link
                      href="/reviews"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-comments" style={{ color: "#2563EB", marginRight: "8px" }}></i>
                        All Telemetry Stream
                      </div>
                      <div className="mobile-sub-item-desc">
                        Live stream of verified policyholder ratings and experiences across 26 insurers.
                      </div>
                    </Link>

                    <Link
                      href="/#experience"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-bolt" style={{ color: "#7C3AED", marginRight: "8px" }}></i>
                        One Gesture Rating
                      </div>
                      <div className="mobile-sub-item-desc">
                        Submit your friction-free 7-second rating with zero corporate influence.
                      </div>
                    </Link>

                    <Link
                      href="/reviews"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-file-invoice" style={{ color: "#DB2777", marginRight: "8px" }}></i>
                        Settlement Evidence
                      </div>
                      <div className="mobile-sub-item-desc">
                        Redacted settlement receipts, discharge vouchers, and policy schedules.
                      </div>
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-book-bookmark" style={{ color: "#0891B2", marginRight: "8px" }}></i>
                        Ombudsman &amp; Grievances
                      </div>
                      <div className="mobile-sub-item-desc">
                        Escalation support for wrongful repudiations, delays, and disputes.
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Search Overlay */}
      <div className="overlay" hidden={!searchOpen}>
        <div className="overlay-panel" role="dialog" aria-modal="true" aria-label="Search">
          <form
            className="row"
            style={{ flexWrap: "nowrap" }}
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setSearchOpen(false);
                window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
          >
            <label className="sr" htmlFor="sq">Search TrustValue</label>
            <input
              id="sq"
              ref={searchInputRef}
              className="input"
              placeholder="Brand, product, category, or question..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
            <button
              className="icon-btn"
              type="button"
              style={{ color: "var(--ink)" }}
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          <div className="stack" style={{ marginTop: "12px" }}>
            {searchResults.length > 0 ? (
              <div className="list">
                {searchResults.map((r, idx) => (
                  <Link
                    key={idx}
                    className="li"
                    href={r.url}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span className="tag">{r.kind}</span>
                    <span className="li-main">
                      <b>{r.title}</b>
                      <span>{r.sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="small muted">
                Try: HDFC Life, Click 2 Protect, LIC, claim settlement ratio, free-look
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sign-in Modal */}
      <div className="modal" hidden={!signInOpen}>
        <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Sign in">
          <div className="modal-head">
            <h2 style={{ fontSize: "1.25rem" }}>Sign in to continue</h2>
            <button
              className="icon-btn"
              type="button"
              onClick={() => setSignInOpen(false)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p className="muted small">Sign in to publish verified reviews, complaints, and questions.</p>

          <form className="stack" style={{ marginTop: "14px" }} onSubmit={handleSignIn} noValidate>
            <div className="field">
              <label htmlFor="si-phone">Mobile number</label>
              <div className="row" style={{ flexWrap: "nowrap" }}>
                <span className="tag" style={{ minHeight: "46px", paddingInline: "12px" }}>+91</span>
                <input
                  id="si-phone"
                  className="input"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {otpSent && (
              <div className="field" id="si-otp-wrap">
                <label htmlFor="si-otp">Confirmation code</label>
                <input
                  id="si-otp"
                  className="input"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 digits (e.g. 123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <span className="hint">Simulation: any 6 digits succeed.</span>
              </div>
            )}

            <div className="field">
              <label htmlFor="si-name">Display name</label>
              <input
                id="si-name"
                className="input"
                placeholder="Shown on your reviews (e.g. Priya S.)"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <label className="check">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I am 18 or older and agree to the <Link href="/terms" onClick={() => setSignInOpen(false)}>terms</Link> and <Link href="/privacy" onClick={() => setSignInOpen(false)}>privacy notice</Link>.
            </label>

            {signInError && <p className="err">{signInError}</p>}

            <button className="btn btn-primary btn-block" type="submit">
              {otpSent ? "Verify and continue" : "Send code"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
