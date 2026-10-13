import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getIndustry } from "@/lib/data/industryData";
import { INS, INSURERS, EXTRA_FACTS, CHECKED } from "@/lib/prototypeData";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import TheFactsTable, { FactItem } from "@/components/dossier/TheFactsTable";
import NewsAndRatings from "@/components/dossier/NewsAndRatings";
import TrustValueBottomCta from "@/components/common/TrustValueBottomCta";

interface BrandPageProps {
  params: Promise<{
    industrySlug: string;
    brandSlug: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { industrySlug, brandSlug } = await params;
  const brand = getBrand(industrySlug, brandSlug);
  if (!brand) return { title: "Insurer Not Found — TrustValue.ai" };

  return {
    title: `${brand.name} reviews and TrustScore | TrustValue.ai`,
    description: `Official TrustValue record for ${brand.name}. IRDAI audited data, public complaint records, and verified policyholder reviews.`,
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { industrySlug, brandSlug } = await params;
  const industry = getIndustry(industrySlug);
  const brand = getBrand(industrySlug, brandSlug);

  if (!industry || !brand) {
    notFound();
  }

  const ins = INS[brand.slug] || INSURERS.find((i) => i.slug === brand.slug);
  const legalName = ins?.legal || brand.name;
  const regNumber = ins?.reg || brand.regulatoryId.replace(/^IRDAI-REG-/, "") || "122";
  const city = ins?.city || "Gurugram";
  const extraFacts = EXTRA_FACTS[brand.slug] || [];

  const reviewCount = brand.totalVerifiedReviews || 0;
  const fakeFiltered = brand.fakeReviewsFiltered || 0;
  const hasPublishedPlans = brand.products && brand.products.length > 0;

  // Comparison partner for side rail
  const compareTarget =
    brand.slug === "bajaj-life"
      ? { name: "HDFC Life", slug: "hdfc-life" }
      : { name: "Bajaj Life", slug: "bajaj-life" };

  // Other insurers for side rail pill cloud (screenshot order)
  const otherInsurersList = [
    { name: "ACKO Life", slug: "acko-life" },
    { name: "Aditya Birla Sun Life Insurance", slug: "aditya-birla-sun-life" },
    { name: "Ageas Federal Life", slug: "ageas-federal-life" },
    { name: "Axis Max Life", slug: "axis-max-life" },
    { name: "Bajaj Life", slug: "bajaj-life" },
    { name: "Bandhan Life", slug: "bandhan-life" },
    { name: "Bharti AXA Life", slug: "bharti-axa-life" },
    { name: "Canara HSBC Life", slug: "canara-hsbc-life" },
  ].filter((item) => item.slug !== brand.slug);

  const fiveParts = [
    { key: "claims", label: "Claims", score: reviewCount >= 10 ? Math.round(brand.trustScore / 10) : 0 },
    { key: "service", label: "Service", score: reviewCount >= 10 ? Math.round(brand.trustScore / 10) : 0 },
    { key: "honesty", label: "Sales honesty", score: reviewCount >= 10 ? Math.round(brand.trustScore / 10) : 0 },
    { key: "digital", label: "Digital experience", score: reviewCount >= 10 ? Math.round(brand.trustScore / 10) : 0 },
    { key: "value", label: "Value for money", score: reviewCount >= 10 ? Math.round(brand.trustScore / 10) : 0 },
  ];

  // Component 1: The facts (Image 1 style)
  const factsList: FactItem[] = [
    { key: "Legal name", val: legalName, citation: "1" },
    { key: "IRDAI registration no.", val: regNumber, citation: "1" },
    { key: "Head office city", val: city, citation: "2" },
    { key: "Claim settlement ratio", val: `${brand.claimSettlementRatio}% audited death settlement`, citation: "1" },
    { key: "Grievance resolution SLA", val: `${brand.averageGrievanceResolutionDays} average working days`, citation: "3" },
    ...extraFacts.map((ef) => ({
      key: ef[0],
      val: ef[1],
      citation: ef[2],
    })),
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-6 sm:py-8 font-[family-name:var(--font-body)]">
      <div className="brand-dossier-wrap">
        <Breadcrumbs
          items={[
            { label: "Industries", href: "/industry" },
            { label: industry.name, href: `/industry/${industry.slug}` },
            { label: brand.name },
          ]}
        />

        {/* Hero Section */}
        <section className="mt-6 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <span className="brand-hero-eyebrow">
                LIFE INSURER · IRDAI REG. {regNumber}
              </span>

              <h1 className="brand-hero-title">
                {brand.name} reviews and TrustScore
              </h1>

              <p className="brand-hero-sub">
                {legalName}, {city}.
              </p>

              <div className="brand-hero-actions">
                <Link
                  className="brand-btn-review"
                  href={`/write-review?insurer=${brand.slug}`}
                >
                  Review {brand.name}
                </Link>
                <Link
                  className="brand-btn-secondary"
                  href={`/complaints/new?insurer=${brand.slug}`}
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
                  {reviewCount >= 10 ? brand.trustScore : "—"}
                </span>
                <span className="brand-score-badge-lbl">TrustScore</span>
              </div>

              <div className="brand-score-info">
                <h3>
                  {reviewCount >= 10
                    ? brand.trustScore >= 85
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
        <nav className="brand-tabs-nav" aria-label="Brand dossier tabs">
          <a href="#overview" className="brand-tab-item active">
            Overview
          </a>
          <a href="#reviews" className="brand-tab-item">
            Reviews ({reviewCount})
          </a>
          <a href="#complaints" className="brand-tab-item">
            Complaints (0)
          </a>
          <a href="#plans" className="brand-tab-item">
            Plans
          </a>
          <a href="#facts" className="brand-tab-item">
            The facts
          </a>
          <a href="#questions" className="brand-tab-item">
            Questions
          </a>
        </nav>

        {/* Two-Column Main Layout Grid */}
        <div className="brand-layout-grid">
          {/* Left Column (Primary Content) */}
          <main className="min-w-0">
            {/* 1. Short Answer Card */}
            <div className="brand-short-answer-box" id="overview">
              <div className="brand-short-answer-eyebrow">SHORT ANSWER</div>
              <p className="brand-short-answer-text">
                {reviewCount < 10
                  ? `${brand.name} has ${reviewCount} reviews on TrustValue so far; its TrustScore shows from the 10th. Insurers cannot pay to change it.`
                  : `${brand.name} holds an audited TrustScore of ${brand.trustScore}/100 across ${reviewCount.toLocaleString()} policy-verified reviews with ${brand.claimSettlementRatio}% IRDAI claim settlement. Insurers cannot pay to change it.`}
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
                  <div className="brand-public-record-val">0</div>
                  <div className="brand-public-record-lbl">Complaints, last 12 months</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">—</div>
                  <div className="brand-public-record-lbl">Complaints resolved</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">—</div>
                  <div className="brand-public-record-lbl">Median first reply</div>
                </div>
                <div className="brand-public-record-cell">
                  <div className="brand-public-record-val">0</div>
                  <div className="brand-public-record-lbl">Negatives turned positive</div>
                </div>
              </div>

              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                The same metrics show for every insurer, whatever it pays. Fake reviews filtered stay viewable.
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
                  href={`/write-review?insurer=${brand.slug}`}
                  className="brand-btn-secondary !h-8 !px-3.5 !text-xs"
                >
                  All reviews
                </Link>
              </div>

              <div className="brand-dashed-box">
                <h3>No reviews yet</h3>
                <p>
                  Be the first to review {brand.name}. Write it, or record a short voice or video review.
                </p>
                <div className="brand-dashed-box-actions">
                  <Link
                    href={`/write-review?insurer=${brand.slug}`}
                    className="brand-btn-review !h-9 !px-4 !text-xs"
                  >
                    Write a review
                  </Link>
                  <Link
                    href={`/write-review?insurer=${brand.slug}&mode=media`}
                    className="brand-btn-secondary !h-9 !px-4 !text-xs"
                  >
                    Video or voice review
                  </Link>
                </div>
              </div>
            </section>

            {/* 5. Plans */}
            <section className="mb-10" id="plans">
              <h2 className="text-2xl font-bold text-[#071B46] mb-2 font-[family-name:var(--font-manrope)]">
                Plans
              </h2>

              {hasPublishedPlans ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {brand.products.map((plan) => (
                    <div
                      key={plan.slug}
                      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-[#071B46] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                            {plan.category}
                          </span>
                          <span className="font-bold text-[#0A8754]">
                            Score: {plan.trustScore}/100
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#071B46] font-[family-name:var(--font-manrope)]">
                          <Link
                            href={`/industry/${industry.slug}/${brand.slug}/${plan.slug}`}
                            className="hover:text-[#FF5A0A] transition-colors"
                          >
                            {plan.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-[#64748B] mt-2">
                          Starting ₹{plan.monthlyStartingPrice}/mo · Turnaround {plan.claimSettlementSpeedDays} days
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                        <Link
                          href={`/industry/${industry.slug}/${brand.slug}/${plan.slug}`}
                          className="text-xs font-bold text-[#FF5A0A] hover:underline inline-flex items-center gap-1.5"
                        >
                          <span>Plan Dossier</span>
                          <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
                        </Link>
                        <Link
                          href={`/write-review?insurer=${brand.slug}&plan=${plan.slug}`}
                          className="text-xs font-semibold text-[#64748B] hover:text-[#071B46]"
                        >
                          Rate this plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="brand-dashed-box">
                  <h3>Plan list not published yet</h3>
                  <p>
                    You can still review a plan from {brand.name} by typing its name or uploading the first page of your policy. It counts once the plan is matched.
                  </p>
                  <div className="brand-dashed-box-actions">
                    <Link
                      href={`/write-review?insurer=${brand.slug}&mode=plan`}
                      className="brand-btn-review !h-9 !px-4 !text-xs"
                    >
                      Review by plan name
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* 6. Image 1 Component: The facts */}
            <div id="facts">
              <TheFactsTable facts={factsList} />
            </div>

            {/* 7. Image 3 Component: News & Ratings */}
            <NewsAndRatings
              rateUrl={`/write-review?insurer=${brand.slug}`}
              entityName={brand.name}
            />

            {/* 8. Questions people ask */}
            <section className="mb-12 mt-10" id="questions">
              <h2 className="text-2xl font-bold text-[#071B46] mb-4 font-[family-name:var(--font-manrope)]">
                Questions people ask
              </h2>

              <details className="brand-faq-box" open>
                <summary>
                  <span className="arrow">▼</span>
                  <span>Is {brand.name} a registered life insurer?</span>
                </summary>
                <p>
                  Yes. {legalName} is registered with IRDAI under number {regNumber}.
                </p>
              </details>

              <details className="brand-faq-box">
                <summary>
                  <span className="arrow">►</span>
                  <span>How do I complain about {brand.name}?</span>
                </summary>
                <p>
                  Submit a formal complaint first to the insurer&apos;s Grievance Redressal Officer (GRO). If you receive no reply within 15 days or are unsatisfied with the resolution, escalate directly to the IRDAI Bima Bharosa portal or the Insurance Ombudsman.
                </p>
              </details>

              <details className="brand-faq-box">
                <summary>
                  <span className="arrow">►</span>
                  <span>Can {brand.name} remove reviews?</span>
                </summary>
                <p>
                  No. Insurers cannot delete, sponsor, or modify ratings on TrustValue. Every policyholder submission passes through automated tamper-detection forensics, and filtered suspicious submissions remain publicly viewable in forensic quarantine.
                </p>
              </details>
            </section>
          </main>

          {/* Right Rail (Sidebar) */}
          <aside className="rail self-start space-y-4">
            {/* Card 1: Was this insurer good to you? */}
            <div className="brand-rail-card">
              <h3>Was this insurer good to you?</h3>
              <p>Your review moves its TrustScore. Pick a stop to start.</p>

              <div className="brand-stop-buttons">
                <Link
                  href={`/write-review?insurer=${brand.slug}&stop=0`}
                  className="brand-stop-btn"
                  title="Angry Star"
                >
                  <i className="fa-solid fa-triangle-exclamation text-amber-500 text-sm" aria-hidden="true" />
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&stop=20`}
                  className="brand-stop-btn"
                  title="Rating 1"
                >
                  <span className="u-text">1</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&stop=40`}
                  className="brand-stop-btn"
                  title="Rating 2"
                >
                  <span className="u-text">2</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&stop=60`}
                  className="brand-stop-btn"
                  title="Rating 3"
                >
                  <span className="u-text">3</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&stop=80`}
                  className="brand-stop-btn"
                  title="Rating 4"
                >
                  <span className="u-text">4</span>
                </Link>
                <Link
                  href={`/write-review?insurer=${brand.slug}&stop=100`}
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
                    href={`/industry/${industry.slug}/${brand.slug}/compare/${compareTarget.slug}`}
                    className="font-bold text-[#071B46] hover:text-[#FF5A0A] flex items-center gap-1.5 transition-colors font-[family-name:var(--font-manrope)]"
                  >
                    <span>{brand.name} vs {compareTarget.name}</span>
                    <i className="fa-solid fa-arrow-right text-xs flex-shrink-0" aria-hidden="true" />
                  </Link>
                  <p className="!mt-1">Facts, reviews, complaints</p>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/industry/${industry.slug}/${brand.slug}/compare`}
                  className="brand-btn-secondary !h-8 !px-4 !text-xs !rounded-full"
                >
                  Choose another
                </Link>
              </div>
            </div>

            {/* Card 3: Get a callback */}
            <div className="brand-rail-card">
              <h3>Get a callback</h3>
              <p>
                Talk to {brand.name} about a plan. Your details go only to the insurer you name.
              </p>

              <div className="mt-4">
                <Link
                  href={`/callback?insurer=${brand.slug}`}
                  className="brand-btn-secondary !h-8 !px-4 !text-xs !rounded-full"
                >
                  Request a callback
                </Link>
              </div>
            </div>

            {/* Card 4: Other insurers */}
            <div className="brand-rail-card !bg-[#F8FAFC]">
              <h3>Other insurers</h3>

              <div className="brand-pill-cloud">
                {otherInsurersList.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/industry/${industry.slug}/${item.slug}`}
                    className="brand-pill-tag"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href={`/industry/${industry.slug}`}
                  className="brand-pill-tag font-bold !bg-[#071B46] !text-white !border-[#071B46]"
                >
                  All 26
                </Link>
              </div>
            </div>
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
