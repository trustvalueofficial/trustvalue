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

export default function Header() {
  const industries = getAllIndustries();
  const insuranceIndustry = industries.find((i) => i.slug === "insurance") || industries[0];
  const brands = insuranceIndustry?.brands || [];

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [mobileBrandFilter, setMobileBrandFilter] = useState("");
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
          url: `/industry/insurance/${b.slug}`,
        });
      }
      // Search products inside brand
      b.products?.forEach((p) => {
        if (p.name.toLowerCase().includes(q)) {
          out.push({
            kind: "Product",
            title: p.name,
            sub: `${b.name} · ${p.category} · TrustScore ${p.trustScore}`,
            url: `/industry/insurance/${b.slug}/${p.slug}`,
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
          url: `/products?type=${t.slug}`,
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
          url: `/glossary/${g.slug}`,
        });
      }
    });

    ARTICLES.forEach((a) => {
      if (a.title.toLowerCase().includes(q)) {
        out.push({
          kind: "Guide",
          title: a.title,
          sub: "Encyclopedia",
          url: `/learn/${a.slug}`,
        });
      }
    });

    QUESTIONS.forEach((x) => {
      if (x.q.toLowerCase().includes(q)) {
        out.push({
          kind: "Question",
          title: x.q,
          sub: x.answered ? "Verified Answer" : "Community Question",
          url: `/questions/${x.slug}`,
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
                Products
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

            {/* 3. Learn Nav Item */}
            <div
              className="nav-item"
              onMouseEnter={() => handleNavMouseEnter("learn")}
            >
              <button
                type="button"
                className={`nav-btn ${activeMenu === "learn" ? "on" : ""}`}
                onClick={(e) => toggleMenu("learn", e)}
                aria-expanded={activeMenu === "learn"}
                aria-controls="hdr-mega-panel"
              >
                Learn
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    transform: activeMenu === "learn" ? "rotate(180deg)" : "rotate(0deg)",
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

            <Link className="btn btn-primary btn-sm hdr-desk-only" href="/write-review">
              Write a review
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
              {/* 1. BRANDS FULL WIDTH PANEL */}
              {activeMenu === "brands" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Life Insurance Brands</h3>
                      <span>All 26 IRDAI-registered life insurers in India · Regulated and Bayesian scored</span>
                    </div>
                    <Link
                      href="/industry/insurance"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      All 26 Brands Directory →
                    </Link>
                  </div>

                  <div className="mega-brands-full">
                    <div className="mega-brands-columns">
                      {brands.map((b, idx) => (
                        <Link
                          key={b.slug}
                          href={`/industry/insurance/${b.slug}`}
                          className="mega-brand-link"
                          onClick={() => setActiveMenu(null)}
                        >
                          <span className="mega-brand-num">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="mega-brand-name">{b.name}</span>
                          <span className="mega-brand-arrow">↗</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      No insurer can sponsor, edit or pay for a TrustScore. Commercial relations are strictly separated.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/industry/insurance"
                        onClick={() => setActiveMenu(null)}
                      >
                        All 26 Brands Directory
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/methodology"
                        onClick={() => setActiveMenu(null)}
                      >
                        Scoring Methodology
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
                      href="/products"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      Browse All Categories →
                    </Link>
                  </div>

                  <div className="mega-scroll-body">
                    <div className="mega-cards-grid">
                      <Link
                        href="/products?type=term-insurance"
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
                        href="/products?type=savings-plans"
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
                        href="/products?type=ulips"
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
                        href="/products?type=retirement-pension"
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
                        href="/products?type=child-plans"
                        className="mega-card-item mega-card--cyan"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Child Education.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Goal-oriented milestone funds with premium waiver protection.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Milestone Funding</span>
                        </div>
                      </Link>

                      <Link
                        href="/products?type=health-critical-illness"
                        className="mega-card-item mega-card--emerald"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Critical Illness.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Lump-sum payouts covering major cardiac, cancer, and organ events.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Fixed Benefit</span>
                        </div>
                      </Link>

                      <Link
                        href="/products?type=riders"
                        className="mega-card-item mega-card--slate"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Riders &amp; Add-ons.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Accidental disability, waiver of premium, and surgical riders.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Policy Add-ons</span>
                        </div>
                      </Link>

                      <Link
                        href="/products"
                        className="mega-card-item mega-card--navy"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">All Audited Products.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Filter 100+ on-sale plans with real customer sentiment scores.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Browse Entire Index</span>
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
                        href="/products"
                        onClick={() => setActiveMenu(null)}
                      >
                        All Categories
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/tools"
                        onClick={() => setActiveMenu(null)}
                      >
                        Cover Calculator
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. LEARN FULL WIDTH PANEL */}
              {activeMenu === "learn" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Insurance Encyclopedia &amp; Research</h3>
                      <span>Independent masterclasses, diagnostic tools, and regulatory circulars</span>
                    </div>
                    <Link
                      href="/learn"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      All Articles &amp; Guides →
                    </Link>
                  </div>

                  <div className="mega-scroll-body">
                    <div className="mega-cards-grid">
                      {/* 1. Encyclopedia */}
                      <Link
                        href="/learn"
                        className="mega-card-item mega-card--blue"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Encyclopedia.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Guides, masterclasses, and verified claim workflows by topic.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Guides by topic</span>
                        </div>
                      </Link>

                      {/* 2. Glossary */}
                      <Link
                        href="/glossary"
                        className="mega-card-item mega-card--purple"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Glossary.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Plain-English definitions of critical insurance clauses and conditions.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">78 terms, A to Z</span>
                        </div>
                      </Link>

                      {/* 3. Questions */}
                      <Link
                        href="/questions"
                        className="mega-card-item mega-card--pink"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Questions.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Real policyholder queries answered with official IRDAI regulatory citations.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Asked and answered</span>
                        </div>
                      </Link>

                      {/* 4. Tools */}
                      <Link
                        href="/tools"
                        className="mega-card-item mega-card--amber"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Tools.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Diagnostic tools to calculate human life value and audit agent pitch promises.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Cover &amp; Pitch Checkers</span>
                        </div>
                      </Link>

                      {/* 5. Claim rejected help */}
                      <Link
                        href="/learn/claim-rejected-what-now"
                        className="mega-card-item mega-card--cyan"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Claim Rejected Help.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Step-by-step guidance on Ombudsman escalation and repudiation appeals.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Steps &amp; Escalation</span>
                        </div>
                      </Link>

                      {/* 6. Open data */}
                      <Link
                        href="/data"
                        className="mega-card-item mega-card--emerald"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Open Data.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Public datasets on CSR ratios, complaints, and claim repudiation rates.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Datasets anyone can cite</span>
                        </div>
                      </Link>

                      {/* 7. News */}
                      <Link
                        href="/news"
                        className="mega-card-item mega-card--slate"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">News &amp; Updates.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Latest IRDAI circulars, master guidelines, and insurance industry developments.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Regulator &amp; Insurer</span>
                        </div>
                      </Link>

                      {/* 8. How TrustScores work */}
                      <Link
                        href="/methodology"
                        className="mega-card-item mega-card--navy"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">How TrustScores Work.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Bayesian authenticity math, evidence weighting, and anti-gaming formulas.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Method &amp; Formula</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      Everything in our Encyclopedia is independent and backed by IRDAI regulations.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/learn"
                        onClick={() => setActiveMenu(null)}
                      >
                        Encyclopedia
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/glossary"
                        onClick={() => setActiveMenu(null)}
                      >
                        Glossary
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COMMUNITY FULL WIDTH PANEL */}
              {activeMenu === "community" && (
                <div className="mega-panel-content">
                  <div className="mega-head-bar">
                    <div className="mega-head-title">
                      <h3>Community Telemetry &amp; Reviews</h3>
                      <span>Real policyholder experiences, locked ratings, and verified dispute resolutions</span>
                    </div>
                    <Link
                      href="/community"
                      className="mega-head-link"
                      onClick={() => setActiveMenu(null)}
                    >
                      Community Hub →
                    </Link>
                  </div>

                  <div className="mega-scroll-body">
                    <div className="mega-cards-grid">
                      {/* 1. All community */}
                      <Link
                        href="/community"
                        className="mega-card-item mega-card--blue"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">All Community.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Live stream of verified ratings and experiences across 26 insurers.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Reviews, Videos, Photos</span>
                        </div>
                      </Link>

                      {/* 2. Video reviews */}
                      <Link
                        href="/community?filter=video"
                        className="mega-card-item mega-card--purple"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Video Reviews.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Policyholders explaining hospital cashless and claim experiences on camera.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Video Proof</span>
                        </div>
                      </Link>

                      {/* 3. Photos */}
                      <Link
                        href="/community?filter=photos"
                        className="mega-card-item mega-card--pink"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Photo Evidence.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Redacted settlement receipts, hospital discharge letters, and policy schedules.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Document Proof</span>
                        </div>
                      </Link>

                      {/* 4. Voice reviews */}
                      <Link
                        href="/community?filter=voice"
                        className="mega-card-item mega-card--amber"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Voice Reviews.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Recorded voice testimonials in 11 Indian regional languages from verified buyers.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">In 11 languages</span>
                        </div>
                      </Link>

                      {/* 5. Claim stories */}
                      <Link
                        href="/community?filter=stories"
                        className="mega-card-item mega-card--cyan"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Claim Stories.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Unvarnished narratives of claim approvals, wrongful delays, and Ombudsman wins.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Real Experiences</span>
                        </div>
                      </Link>

                      {/* 6. Questions & Answers */}
                      <Link
                        href="/questions"
                        className="mega-card-item mega-card--emerald"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Questions &amp; Q&amp;A.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Ask experienced policyholders and claim advisors about any contract dispute.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Active Forum</span>
                        </div>
                      </Link>

                      {/* 7. Guidelines & Rules */}
                      <Link
                        href="/guidelines"
                        className="mega-card-item mega-card--slate"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Community Rules.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">The anti-fraud standards and proof criteria keeping TrustValue reliable.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Review Standards</span>
                        </div>
                      </Link>

                      {/* 8. Share Your Story */}
                      <Link
                        href="/write-review"
                        className="mega-card-item mega-card--navy"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div>
                          <div className="mega-card-item-top">
                            <h4 className="mega-card-title">Share Your Story.</h4>
                            <span className="mega-card-arrow">↗</span>
                          </div>
                          <p className="mega-card-desc">Rate your insurance company in 7 seconds. No insurer can buy or edit it.</p>
                        </div>
                        <div className="mega-card-meta">
                          <span className="mega-card-tag">Rate in 7 Seconds</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="mega-panel-foot">
                    <span className="mega-panel-foot-text">
                      Only the policyholder can update a review once resolved. Every edit preserves full revision history.
                    </span>
                    <div className="mega-panel-foot-links">
                      <Link
                        className="btn btn-navy btn-sm"
                        href="/write-review"
                        onClick={() => setActiveMenu(null)}
                      >
                        Share Your Story
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href="/guidelines"
                        onClick={() => setActiveMenu(null)}
                      >
                        Community Rules
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

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
                    href="/write-review"
                    onClick={() => {
                      setDrawerOpen(false);
                      setMobileSubMenu(null);
                    }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 700 }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Write a review
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
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>Encyclopedia, Glossary &amp; Tools</div>
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
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#64748B" }}>Videos, Photos, Ombudsman Proof</div>
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
                    href="/industry/insurance"
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
                    href="/methodology"
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
                    }}
                    aria-label="Back to main menu"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back</span>
                  </button>
                  <span style={{ font: "700 0.95rem/1 var(--f-display)", color: "#071B46" }}>
                    {mobileSubMenu === "brands" && "Insurers Directory"}
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
                          placeholder="Quick search 26 insurers..."
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

                    <div style={{ padding: "6px 16px 8px 16px" }}>
                      <Link
                        href="/industry/insurance"
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
                        <span><i className="fa-solid fa-compass" style={{ marginRight: "8px" }}></i> View All 26 Insurers Directory</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 20px 0" }}>
                      {brands
                        .filter((b) =>
                          b.name.toLowerCase().includes(mobileBrandFilter.toLowerCase()) ||
                          b.regulatoryId.toLowerCase().includes(mobileBrandFilter.toLowerCase())
                        )
                        .map((b) => (
                          <Link
                            key={b.slug}
                            href={`/industry/insurance/${b.slug}`}
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
                        ))}
                    </div>
                  </div>
                )}

                {/* SUB CONTENT 2: PRODUCTS */}
                {mobileSubMenu === "products" && (
                  <div style={{ padding: "8px 0 24px 0", flex: 1, overflowY: "auto" }}>
                    <div style={{ padding: "8px 16px 12px 16px" }}>
                      <Link
                        href="/products"
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
                        <span><i className="fa-solid fa-cubes" style={{ marginRight: "8px" }}></i> Browse All 100+ Plans</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>

                    {TYPES.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/products?type=${t.slug}`}
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
                            <i
                              className={
                                t.slug === "term"
                                  ? "fa-solid fa-umbrella"
                                  : t.slug === "ulip"
                                  ? "fa-solid fa-chart-line"
                                  : t.slug === "savings"
                                  ? "fa-solid fa-piggy-bank"
                                  : t.slug === "annuity"
                                  ? "fa-solid fa-coins"
                                  : "fa-solid fa-heart-pulse"
                              }
                            ></i>
                          </div>
                          <div>
                            <div className="mobile-sub-item-title">{t.name}</div>
                            <div className="mobile-sub-item-desc">{t.plain}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* SUB CONTENT 3: LEARN */}
                {mobileSubMenu === "learn" && (
                  <div style={{ padding: "12px 0 24px 0", flex: 1, overflowY: "auto" }}>
                    <Link
                      href="/learn"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-graduation-cap" style={{ color: "#2563EB", marginRight: "8px" }}></i>
                        Insurance Encyclopedia
                      </div>
                      <div className="mobile-sub-item-desc">
                        Deep-dive master guides on claims, policyholder rights, and hidden policy clauses.
                      </div>
                    </Link>

                    <Link
                      href="/glossary"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-spell-check" style={{ color: "#7C3AED", marginRight: "8px" }}></i>
                        Plain-English Glossary
                      </div>
                      <div className="mobile-sub-item-desc">
                        100+ insurance terms explained simply — CSR, Solvency Ratio, Free Look, Riders.
                      </div>
                    </Link>

                    <Link
                      href="/questions"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-circle-question" style={{ color: "#D97706", marginRight: "8px" }}></i>
                        Policyholder Q&amp;A
                      </div>
                      <div className="mobile-sub-item-desc">
                        Real customer questions answered with official IRDAI regulatory citations.
                      </div>
                    </Link>

                    <Link
                      href="/tools"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-calculator" style={{ color: "#059669", marginRight: "8px" }}></i>
                        Calculators &amp; Estimators
                      </div>
                      <div className="mobile-sub-item-desc">
                        Calculate Human Life Value (HLV) coverage needs and claim settlement probability.
                      </div>
                    </Link>

                    <Link
                      href="/data"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-database" style={{ color: "#DC2626", marginRight: "8px" }}></i>
                        Open Data &amp; Reports
                      </div>
                      <div className="mobile-sub-item-desc">
                        Independent audits, IRDAI annual reports, and claim settlement databases.
                      </div>
                    </Link>
                  </div>
                )}

                {/* SUB CONTENT 4: COMMUNITY */}
                {mobileSubMenu === "community" && (
                  <div style={{ padding: "12px 0 24px 0", flex: 1, overflowY: "auto" }}>
                    <Link
                      href="/community"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-comments" style={{ color: "#2563EB", marginRight: "8px" }}></i>
                        All Community Stream
                      </div>
                      <div className="mobile-sub-item-desc">
                        Live stream of verified policyholder ratings and experiences across 26 insurers.
                      </div>
                    </Link>

                    <Link
                      href="/community?filter=video"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-circle-play" style={{ color: "#7C3AED", marginRight: "8px" }}></i>
                        Video Proof Reviews
                      </div>
                      <div className="mobile-sub-item-desc">
                        Policyholders explaining hospital cashless and claim experiences on camera.
                      </div>
                    </Link>

                    <Link
                      href="/community?filter=photos"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-camera" style={{ color: "#DB2777", marginRight: "8px" }}></i>
                        Photo Evidence
                      </div>
                      <div className="mobile-sub-item-desc">
                        Redacted settlement receipts, discharge vouchers, and policy schedules.
                      </div>
                    </Link>

                    <Link
                      href="/community?filter=stories"
                      onClick={() => {
                        setDrawerOpen(false);
                        setMobileSubMenu(null);
                      }}
                      className="mobile-sub-item-card"
                    >
                      <div className="mobile-sub-item-title">
                        <i className="fa-solid fa-book-bookmark" style={{ color: "#0891B2", marginRight: "8px" }}></i>
                        Claim Settlement Stories
                      </div>
                      <div className="mobile-sub-item-desc">
                        Real experiences with insurer claim departments, wrongful delays, and Ombudsman cases.
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
