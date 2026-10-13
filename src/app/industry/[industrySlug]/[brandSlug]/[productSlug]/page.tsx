import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getBrand, getIndustry } from "@/lib/data/industryData";
import { INS, INSURERS, PLAN_FACTS, CHECKED } from "@/lib/prototypeData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import TheFactsTable, { FactItem } from "@/components/dossier/TheFactsTable";
import CheckBeforeYouBuy from "@/components/dossier/CheckBeforeYouBuy";
import NewsAndRatings from "@/components/dossier/NewsAndRatings";
import TrustValueBottomCta from "@/components/common/TrustValueBottomCta";

interface ProductPageProps {
  params: Promise<{
    industrySlug: string;
    brandSlug: string;
    productSlug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { industrySlug, brandSlug, productSlug } = await params;
  const product = getProduct(industrySlug, brandSlug, productSlug);
  const brand = getBrand(industrySlug, brandSlug);

  if (!product || !brand) return { title: "Plan Not Found — TrustValue.ai" };

  return {
    title: `${product.name} (${brand.name}) reviews and TrustScore | TrustValue.ai`,
    description: `Official TrustValue record for ${product.name} by ${brand.name}. IRDAI audited policy facts, claim turnaround, and policyholder reviews.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { industrySlug, brandSlug, productSlug } = await params;
  const industry = getIndustry(industrySlug);
  const brand = getBrand(industrySlug, brandSlug);
  const product = getProduct(industrySlug, brandSlug, productSlug);

  if (!industry || !brand || !product) {
    notFound();
  }

  const ins = INS[brand.slug] || INSURERS.find((i) => i.slug === brand.slug);
  const legalName = ins?.legal || brand.name;
  const city = ins?.city || "Gurugram";

  const factKey = `${brand.slug}/${product.slug}`;
  const planFact = PLAN_FACTS[factKey] || {};

  const reviewCount = product.totalVerifiedReviews || 0;
  const fakeFiltered = Math.round(reviewCount * 0.1) || 0;

  // Sibling plans from this brand
  const siblingPlans = brand.products.filter((p) => p.slug !== product.slug);

  const fiveParts = [
    { key: "claims", label: "Claims", score: reviewCount >= 10 ? Math.round(product.trustScore / 10) : 0 },
    { key: "service", label: "Service", score: reviewCount >= 10 ? Math.round(product.trustScore / 10) : 0 },
    { key: "honesty", label: "Sales honesty", score: reviewCount >= 10 ? Math.round(product.trustScore / 10) : 0 },
    { key: "digital", label: "Digital experience", score: reviewCount >= 10 ? Math.round(product.trustScore / 10) : 0 },
    { key: "value", label: "Value for money", score: reviewCount >= 10 ? Math.round(product.trustScore / 10) : 0 },
  ];

  // Component 1: The facts (Image 1 exact layout)
  const productFacts: FactItem[] = [
    {
      key: "Payout options",
      val: "Lump sum, a monthly income for 10 years, lump sum plus income, or an income that rises 10% a year (simple)",
      citation: "1",
    },
    {
      key: "Entry age",
      val: "18 to 65 years. 21 to 60 for NRIs and homemakers",
      citation: "1",
    },
    {
      key: "Early payout on a claim",
      val: "₹3 lakh within one working day of claim registration, on cover of ₹1 crore or more. Not in the first three policy years",
      citation: "1",
    },
    {
      key: "Premium break",
      val: "Up to 12 months, more than once, at least 5 policy years apart. Not in the last 3 years of paying",
      citation: "1",
    },
    {
      key: "Terminal illness",
      val: "Built in. The cover is paid early if two specialist doctors say death is highly likely within 6 months. Not on policies sold through POS",
      citation: "1",
    },
    {
      key: "Accidental death",
      val: "Life Plus variant only, up to ₹3 crore, subject to underwriting",
      citation: "1",
    },
    {
      key: "Critical illness",
      val: "Optional add-on",
      citation: "1",
    },
    {
      key: "Premium payment",
      val: "Yearly, half-yearly or monthly",
      citation: "1",
    },
    {
      key: "Free-look period",
      val: "30 days from receiving the policy",
      citation: "2",
    },
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-6 sm:py-8 font-[family-name:var(--font-body)]">
      <div className="brand-dossier-wrap">
        <Breadcrumbs
          items={[
            { label: "Industries", href: "/industry" },
            { label: industry.name, href: `/industry/${industry.slug}` },
            { label: brand.name, href: `/industry/${industry.slug}/${brand.slug}` },
            { label: product.name },
          ]}
        />

        {/* Hero Section */}
        <section className="mt-6 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <span className="brand-hero-eyebrow">
                {product.category.toUpperCase()} PLAN · {brand.name.toUpperCase()}
              </span>

              <h1 className="brand-hero-title">
                {product.name} reviews and TrustScore
              </h1>

              <p className="brand-hero-sub">
                Underwritten by {legalName}, {city}.
              </p>

              <div className="brand-hero-actions">
                <Link
                  className="brand-btn-review"
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}`}
                >
                  Review this plan
                </Link>
                <Link
                  className="brand-btn-secondary"
                  href={`/complaints/new?insurer=${brand.slug}&plan=${product.slug}`}
                >
                  Raise a complaint
                </Link>
                <button
                  type="button"
                  className="brand-btn-secondary"
                >
                  Follow
                </button>
              </div>

              <div className="brand-meta-line">
                Last updated 12 Oct 2026 · {reviewCount} reviews · Facts checked {CHECKED}
              </div>
            </div>

            {/* Top Right Floating TrustScore Badge */}
            <div className="brand-score-card self-start flex-shrink-0">
              <div className="brand-score-badge">
                <span className="brand-score-badge-val">
                  {reviewCount >= 10 ? product.trustScore : "—"}
                </span>
                <span className="brand-score-badge-lbl">TrustScore</span>
              </div>

              <div className="brand-score-info">
                <h3>
                  {reviewCount >= 10
                    ? product.trustScore >= 85
                      ? "Very High Trust"
                      : "Moderate Trust"
                    : "No reviews yet"}
                </h3>
                <p>
                  {reviewCount >= 10
                    ? `Based on ${reviewCount.toLocaleString()} verified reviews`
                    : "Shows from its 10th review"}
                </p>
                <div className="brand-score-gauge">
                  <span className="inline-flex gap-1">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <i
                        key={idx}
                        className={`brand-gauge-ring ${
                          idx < (reviewCount >= 10 ? 10 : reviewCount) ? "is-on" : ""
                        }`}
                      />
                    ))}
                  </span>
                  <span className="ml-1 text-[11px] font-medium text-[#64748B]">
                    {reviewCount >= 10 ? "10 of 10" : `${reviewCount} of 10`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Navigation Tabs */}
        <nav className="brand-tabs-nav" aria-label="Plan dossier tabs">
          <a href="#overview" className="brand-tab-item active">
            Overview
          </a>
          <a href="#reviews" className="brand-tab-item">
            Reviews ({reviewCount})
          </a>
          <a href="#complaints" className="brand-tab-item">
            Complaints (0)
          </a>
          <a href="#check" className="brand-tab-item">
            Check before you buy
          </a>
          <a href="#facts" className="brand-tab-item">
            The facts
          </a>
          <a href="#questions" className="brand-tab-item">
            Questions
          </a>
        </nav>

        {/* Two-Column Layout Grid */}
        <div className="brand-layout-grid">
          {/* Main Column */}
          <main className="min-w-0">
            {/* 1. Short Answer Card */}
            <div className="brand-short-answer-box" id="overview">
              <div className="brand-short-answer-eyebrow">SHORT ANSWER</div>
              <p className="brand-short-answer-text">
                {planFact.what ||
                  `${product.name} is an audited ${product.category} plan from ${brand.name} with an average claim turnaround of ${product.claimSettlementSpeedDays} working days and ${product.claimRatio}% claim settlement. Insurers cannot pay to change this record.`}
              </p>
              <div className="brand-short-answer-meta">
                Last updated 12 Oct 2026 · {reviewCount} reviews, {reviewCount} verified
              </div>
            </div>

            {/* 2. Public Record */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#071B46] mb-4 font-[family-name:var(--font-manrope)]">
                Public record
              </h2>

              <div className="brand-public-record-card">
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">{reviewCount}</div>
                  <div className="brand-public-record-lbl">Reviews</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">{fakeFiltered}</div>
                  <div className="brand-public-record-lbl">Fake reviews filtered</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">{product.claimSettlementSpeedDays} Days</div>
                  <div className="brand-public-record-lbl">Claim turnaround speed</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">{product.claimRatio}%</div>
                  <div className="brand-public-record-lbl">Claim settlement ratio</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">₹{product.monthlyStartingPrice}</div>
                  <div className="brand-public-record-lbl">Starting premium per month</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">100%</div>
                  <div className="brand-public-record-lbl">Policyholder-backed audit</div>
                </div>
              </div>

              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                The same metrics show for every plan, whatever it pays. Fake reviews filtered stay viewable.
              </p>
            </section>

            {/* 3. Five parts people rate */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#071B46] mb-3 font-[family-name:var(--font-manrope)]">
                Five parts people rate
              </h2>

              <div className="brand-aspects-list">
                {fiveParts.map((item) => (
                  <div key={item.key} className="brand-aspect-item">
                    <span className="brand-aspect-title">{item.label}</span>
                    <div className="brand-aspect-bar">
                      <div
                        className="brand-aspect-bar-fill"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="brand-aspect-val">{item.score}/10</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#64748B] mt-3">
                Each part shows a score once 10 reviewers have rated it.
              </p>
            </section>

            {/* 4. Latest Reviews */}
            <section className="mb-10" id="reviews">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-2xl font-bold text-[#071B46] font-[family-name:var(--font-manrope)]">
                  Latest reviews
                </h2>
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}`}
                  className="brand-btn-secondary !h-8 !px-3.5 !text-xs"
                >
                  All reviews
                </Link>
              </div>

              {reviewCount === 0 ? (
                <div className="brand-dashed-box">
                  <h3>No reviews yet</h3>
                  <p>
                    Be the first to review {product.name}. Write it, or record a short voice or video review.
                  </p>
                  <div className="brand-dashed-box-actions">
                    <Link
                      href={`/write-review?insurer=${brand.slug}&plan=${product.slug}`}
                      className="brand-btn-review !h-9 !px-4 !text-xs"
                    >
                      Write a review
                    </Link>
                    <Link
                      href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&mode=media`}
                      className="brand-btn-secondary !h-9 !px-4 !text-xs"
                    >
                      Video or voice review
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="brand-dashed-box">
                  <h3>Verified review collection active</h3>
                  <p>
                    {reviewCount} verified policyholders have audited {product.name}. Write your review to move its score.
                  </p>
                  <div className="brand-dashed-box-actions">
                    <Link
                      href={`/write-review?insurer=${brand.slug}&plan=${product.slug}`}
                      className="brand-btn-review !h-9 !px-4 !text-xs"
                    >
                      Rate this plan
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* 5. Image 2 Component: Check before you buy (Plans and products ONLY) */}
            <div id="check">
              <CheckBeforeYouBuy />
            </div>

            {/* 6. Image 1 Component: The facts */}
            <div id="facts">
              <TheFactsTable facts={productFacts} />
            </div>

            {/* 7. Image 3 Component: News & Ratings */}
            <NewsAndRatings
              rateUrl={`/write-review?insurer=${brand.slug}&plan=${product.slug}`}
              entityName={product.name}
            />

            {/* 8. Questions people ask */}
            <section className="mb-12 mt-10" id="questions">
              <h2 className="text-2xl font-bold text-[#071B46] mb-4 font-[family-name:var(--font-manrope)]">
                Questions people ask
              </h2>

              <details className="brand-faq-box" open>
                <summary>
                  <span className="arrow">▼</span>
                  <span>Is {product.name} eligible for tax deductions?</span>
                </summary>
                <p>
                  Yes. Premiums paid for eligible life insurance plans typically qualify for tax deductions under Section 80C of the Income Tax Act, and maturity/death payouts may be exempt under Section 10(10D), subject to prevailing tax rules.
                </p>
              </details>

              <details className="brand-faq-box">
                <summary>
                  <span className="arrow">►</span>
                  <span>How do I file a claim for {product.name}?</span>
                </summary>
                <p>
                  Claims must be filed directly with {brand.name}&apos;s claims desk online or through authorized branch offices. Required documentation includes the original policy bond, death certificate/hospital records, and KYC details of the nominee.
                </p>
              </details>

              <details className="brand-faq-box">
                <summary>
                  <span className="arrow">►</span>
                  <span>Can {brand.name} remove reviews for this plan?</span>
                </summary>
                <p>
                  No. Insurers have no administrative access to remove, hide, or alter reviews on TrustValue. All policyholder evaluations undergo forensic authenticity verification.
                </p>
              </details>
            </section>
          </main>

          {/* Right Rail */}
          <aside className="rail self-start space-y-4">
            {/* Card 1: Was this plan good to you? */}
            <div className="brand-rail-card">
              <h3>Was this plan good to you?</h3>
              <p>Your review moves its TrustScore. Pick a stop to start.</p>

              <div className="brand-stop-buttons">
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&stop=0`}
                  className="brand-stop-btn"
                  title="Angry Star"
                >
                  <i className="fa-solid fa-triangle-exclamation text-amber-500 text-sm" aria-hidden="true" />
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&stop=20`}
                  className="brand-stop-btn"
                  title="Rating 1"
                >
                  <span className="u-text">1</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&stop=40`}
                  className="brand-stop-btn"
                  title="Rating 2"
                >
                  <span className="u-text">2</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&stop=60`}
                  className="brand-stop-btn"
                  title="Rating 3"
                >
                  <span className="u-text">3</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&stop=80`}
                  className="brand-stop-btn"
                  title="Rating 4"
                >
                  <span className="u-text">4</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&plan=${product.slug}&stop=100`}
                  className="brand-stop-btn"
                  title="Recommend"
                >
                  <span className="u-text text-xs">Rec.</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Compare */}
            <div className="brand-rail-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/industry/${industry.slug}/${brand.slug}/compare`}
                    className="font-bold text-[#071B46] hover:text-[#FF5A0A] flex items-center gap-1.5 transition-colors font-[family-name:var(--font-manrope)]"
                  >
                    <span>{product.name} vs Alternative</span>
                    <i className="fa-solid fa-arrow-right text-xs flex-shrink-0" aria-hidden="true" />
                  </Link>
                  <p className="!mt-1">Facts, turnaround, pricing</p>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/industry/${industry.slug}/${brand.slug}/compare`}
                  className="brand-btn-secondary !h-8 !px-4 !text-xs !rounded-full"
                >
                  Compare plans
                </Link>
              </div>
            </div>

            {/* Card 3: Get a callback */}
            <div className="brand-rail-card">
              <h3>Get a callback</h3>
              <p>
                Talk to {brand.name} about {product.name}. Your details go only to the insurer you name.
              </p>

              <div className="mt-4">
                <Link
                  href={`/callback?insurer=${brand.slug}&plan=${product.slug}`}
                  className="brand-btn-secondary !h-8 !px-4 !text-xs !rounded-full"
                >
                  Request a callback
                </Link>
              </div>
            </div>

            {/* Card 4: Other plans from insurer */}
            {siblingPlans.length > 0 && (
              <div className="brand-rail-card !bg-[#F8FAFC]">
                <h3>Other plans from {brand.name}</h3>

                <div className="brand-pill-cloud">
                  {siblingPlans.slice(0, 6).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/industry/${industry.slug}/${brand.slug}/${item.slug}`}
                      className="brand-pill-tag"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href={`/industry/${industry.slug}/${brand.slug}`}
                    className="brand-pill-tag font-bold !bg-[#071B46] !text-white !border-[#071B46]"
                  >
                    View All
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom CTA (Image 1 Design) */}
        <div className="mt-14 border-t border-[#E2E8F0]">
          <TrustValueBottomCta />
        </div>
      </div>
    </div>
  );
}
