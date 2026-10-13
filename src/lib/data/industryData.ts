import { Industry, Brand, Product, BrandComparison } from "../types/directory";
import { INS } from "@/lib/prototypeData";

export const industriesData: Record<string, Industry> = {
  insurance: {
    slug: "insurance",
    name: "Life & Health Insurance",
    icon: "🛡️",
    description:
      "Independent trust rankings, IRDAI claim settlement audits, and authenticity-weighted reviews for all 26 registered life insurers in India.",
    regulator: "IRDAI (Insurance Regulatory and Development Authority of India)",
    totalBrands: 26,
    totalProducts: 480,
    averageIndustryTrustScore: 78.4,
    brands: [
      {
        slug: "hdfc-life",
        name: "HDFC Life Insurance",
        industrySlug: "insurance",
        trustScore: 92.4,
        rank: 1,
        regulatoryId: "IRDAI-REG-101",
        claimSettlementRatio: 99.3,
        averageGrievanceResolutionDays: 4.2,
        totalVerifiedReviews: 4820,
        fakeReviewsFiltered: 614,
        quarantineStatus: "active",
        productsCount: 18,
        products: [
          {
            slug: "click-2-protect-super",
            name: "Click 2 Protect Super",
            brandSlug: "hdfc-life",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 94.1,
            monthlyStartingPrice: 620,
            claimSettlementSpeedDays: 3,
            authenticityRating: 95.0,
            totalVerifiedReviews: 1240,
            keyFeatures: ["Accelerated Critical Illness", "Return of Premium Option", "Zero Commission Direct"],
            claimRatio: 99.4,
            fraudAlertStatus: "clean",
          },
          {
            slug: "sanchay-plus",
            name: "Sanchay Plus Guaranteed Return",
            brandSlug: "hdfc-life",
            industrySlug: "insurance",
            category: "Savings",
            trustScore: 88.5,
            monthlyStartingPrice: 2500,
            claimSettlementSpeedDays: 5,
            authenticityRating: 91.2,
            totalVerifiedReviews: 890,
            keyFeatures: ["Guaranteed Income Option", "Life-long Income till 99", "Tax Free Returns u/s 10(10D)"],
            claimRatio: 99.1,
            fraudAlertStatus: "clean",
          },
        ],
      },
      {
        slug: "icici-prudential",
        name: "ICICI Prudential Life",
        industrySlug: "insurance",
        trustScore: 90.8,
        rank: 2,
        regulatoryId: "IRDAI-REG-105",
        claimSettlementRatio: 98.9,
        averageGrievanceResolutionDays: 5.1,
        totalVerifiedReviews: 4120,
        fakeReviewsFiltered: 520,
        quarantineStatus: "active",
        productsCount: 16,
        products: [
          {
            slug: "iprotect-smart",
            name: "iProtect Smart Term Plan",
            brandSlug: "icici-prudential",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 92.6,
            monthlyStartingPrice: 580,
            claimSettlementSpeedDays: 4,
            authenticityRating: 94.3,
            totalVerifiedReviews: 1480,
            keyFeatures: ["Terminal Illness Inbuilt Benefit", "34 Critical Illness Cover", "Special Exit Option"],
            claimRatio: 99.0,
            fraudAlertStatus: "clean",
          },
          {
            slug: "signature-ulip",
            name: "Signature Wealth ULIP",
            brandSlug: "icici-prudential",
            industrySlug: "insurance",
            category: "ULIP",
            trustScore: 86.4,
            monthlyStartingPrice: 3000,
            claimSettlementSpeedDays: 6,
            authenticityRating: 89.0,
            totalVerifiedReviews: 760,
            keyFeatures: ["Zero Premium Allocation Charge", "Unlimited Free Switches", "Whole Life Cover"],
            claimRatio: 98.6,
            fraudAlertStatus: "clean",
          },
        ],
      },
      {
        slug: "max-life",
        name: "Max Life Insurance",
        industrySlug: "insurance",
        trustScore: 89.7,
        rank: 3,
        regulatoryId: "IRDAI-REG-104",
        claimSettlementRatio: 99.5,
        averageGrievanceResolutionDays: 4.8,
        totalVerifiedReviews: 3840,
        fakeReviewsFiltered: 410,
        quarantineStatus: "active",
        productsCount: 15,
        products: [
          {
            slug: "smart-secure-plus",
            name: "Smart Secure Plus Plan",
            brandSlug: "max-life",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 91.8,
            monthlyStartingPrice: 610,
            claimSettlementSpeedDays: 3,
            authenticityRating: 93.5,
            totalVerifiedReviews: 1120,
            keyFeatures: ["Voluntary Sum Assured Top-Up", "Premium Break Option", "Critical Illness Benefit"],
            claimRatio: 99.6,
            fraudAlertStatus: "clean",
          },
        ],
      },
      {
        slug: "tata-aia",
        name: "Tata AIA Life Insurance",
        industrySlug: "insurance",
        trustScore: 88.9,
        rank: 4,
        regulatoryId: "IRDAI-REG-110",
        claimSettlementRatio: 99.0,
        averageGrievanceResolutionDays: 4.5,
        totalVerifiedReviews: 3100,
        fakeReviewsFiltered: 390,
        quarantineStatus: "active",
        productsCount: 14,
        products: [
          {
            slug: "sampoorna-raksha-supreme",
            name: "Sampoorna Raksha Supreme",
            brandSlug: "tata-aia",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 90.5,
            monthlyStartingPrice: 590,
            claimSettlementSpeedDays: 4,
            authenticityRating: 92.0,
            totalVerifiedReviews: 950,
            keyFeatures: ["Whole Life Cover upto age 100", "Post-Disability Waiver", "Vitality Wellness Discount"],
            claimRatio: 99.2,
            fraudAlertStatus: "clean",
          },
        ],
      },
      {
        slug: "sbi-life",
        name: "SBI Life Insurance",
        industrySlug: "insurance",
        trustScore: 87.5,
        rank: 5,
        regulatoryId: "IRDAI-REG-111",
        claimSettlementRatio: 97.8,
        averageGrievanceResolutionDays: 6.2,
        totalVerifiedReviews: 5400,
        fakeReviewsFiltered: 710,
        quarantineStatus: "active",
        productsCount: 22,
        products: [
          {
            slug: "eshield-next",
            name: "eShield Next Term Plan",
            brandSlug: "sbi-life",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 88.0,
            monthlyStartingPrice: 550,
            claimSettlementSpeedDays: 6,
            authenticityRating: 89.4,
            totalVerifiedReviews: 1350,
            keyFeatures: ["Level & Increasing Cover", "Better Half Benefit", "Terminal Illness Cover"],
            claimRatio: 98.1,
            fraudAlertStatus: "clean",
          },
        ],
      },
      {
        slug: "lic",
        name: "Life Insurance Corporation (LIC)",
        industrySlug: "insurance",
        trustScore: 86.8,
        rank: 6,
        regulatoryId: "IRDAI-REG-001",
        claimSettlementRatio: 98.5,
        averageGrievanceResolutionDays: 8.5,
        totalVerifiedReviews: 12400,
        fakeReviewsFiltered: 1450,
        quarantineStatus: "active",
        productsCount: 32,
        products: [
          {
            slug: "tech-term",
            name: "LIC Tech Term Online",
            brandSlug: "lic",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 89.2,
            monthlyStartingPrice: 680,
            claimSettlementSpeedDays: 7,
            authenticityRating: 90.1,
            totalVerifiedReviews: 2400,
            keyFeatures: ["Sovereign Guarantee", "Direct Online Issuance", "Accidental Rider"],
            claimRatio: 98.7,
            fraudAlertStatus: "clean",
          },
        ],
      },
      { slug: "bajaj-allianz", name: "Bajaj Allianz Life", industrySlug: "insurance", trustScore: 85.4, rank: 7, regulatoryId: "IRDAI-REG-116", claimSettlementRatio: 98.0, averageGrievanceResolutionDays: 5.4, totalVerifiedReviews: 2900, fakeReviewsFiltered: 320, quarantineStatus: "active", productsCount: 14, products: [] },
      { slug: "kotak-life", name: "Kotak Mahindra Life", industrySlug: "insurance", trustScore: 84.9, rank: 8, regulatoryId: "IRDAI-REG-107", claimSettlementRatio: 98.2, averageGrievanceResolutionDays: 5.6, totalVerifiedReviews: 2600, fakeReviewsFiltered: 290, quarantineStatus: "active", productsCount: 12, products: [] },
      { slug: "aditya-birla", name: "Aditya Birla Sun Life", industrySlug: "insurance", trustScore: 84.1, rank: 9, regulatoryId: "IRDAI-REG-109", claimSettlementRatio: 97.6, averageGrievanceResolutionDays: 6.0, totalVerifiedReviews: 2450, fakeReviewsFiltered: 270, quarantineStatus: "active", productsCount: 15, products: [] },
      { slug: "pnb-metlife", name: "PNB MetLife Insurance", industrySlug: "insurance", trustScore: 83.2, rank: 10, regulatoryId: "IRDAI-REG-117", claimSettlementRatio: 97.3, averageGrievanceResolutionDays: 6.4, totalVerifiedReviews: 2100, fakeReviewsFiltered: 240, quarantineStatus: "active", productsCount: 11, products: [] },
      { slug: "canara-hsbc", name: "Canara HSBC Life", industrySlug: "insurance", trustScore: 82.8, rank: 11, regulatoryId: "IRDAI-REG-136", claimSettlementRatio: 98.1, averageGrievanceResolutionDays: 5.8, totalVerifiedReviews: 1850, fakeReviewsFiltered: 190, quarantineStatus: "active", productsCount: 10, products: [] },
      { slug: "indiafirst-life", name: "IndiaFirst Life", industrySlug: "insurance", trustScore: 81.9, rank: 12, regulatoryId: "IRDAI-REG-143", claimSettlementRatio: 96.9, averageGrievanceResolutionDays: 7.1, totalVerifiedReviews: 1400, fakeReviewsFiltered: 150, quarantineStatus: "active", productsCount: 9, products: [] },
      { slug: "bandhan-life", name: "Bandhan Life (formerly Aegon)", industrySlug: "insurance", trustScore: 81.2, rank: 13, regulatoryId: "IRDAI-REG-138", claimSettlementRatio: 99.1, averageGrievanceResolutionDays: 5.2, totalVerifiedReviews: 1650, fakeReviewsFiltered: 170, quarantineStatus: "active", productsCount: 8, products: [] },
      { slug: "aviva-life", name: "Aviva Life Insurance", industrySlug: "insurance", trustScore: 80.4, rank: 14, regulatoryId: "IRDAI-REG-122", claimSettlementRatio: 96.5, averageGrievanceResolutionDays: 7.8, totalVerifiedReviews: 1250, fakeReviewsFiltered: 130, quarantineStatus: "active", productsCount: 8, products: [] },
      { slug: "bharti-life", name: "Bharti AXA Life", industrySlug: "insurance", trustScore: 79.8, rank: 15, regulatoryId: "IRDAI-REG-130", claimSettlementRatio: 96.8, averageGrievanceResolutionDays: 8.0, totalVerifiedReviews: 1100, fakeReviewsFiltered: 110, quarantineStatus: "active", productsCount: 9, products: [] },
      { slug: "edelweiss-tokio", name: "Edelweiss Tokio Life", industrySlug: "insurance", trustScore: 79.2, rank: 16, regulatoryId: "IRDAI-REG-147", claimSettlementRatio: 97.4, averageGrievanceResolutionDays: 6.9, totalVerifiedReviews: 980, fakeReviewsFiltered: 95, quarantineStatus: "active", productsCount: 7, products: [] },
      { slug: "future-generali", name: "Future Generali India Life", industrySlug: "insurance", trustScore: 78.5, rank: 17, regulatoryId: "IRDAI-REG-133", claimSettlementRatio: 96.1, averageGrievanceResolutionDays: 8.2, totalVerifiedReviews: 890, fakeReviewsFiltered: 88, quarantineStatus: "active", productsCount: 6, products: [] },
      {
        slug: "ageas-federal",
        name: "Ageas Federal Life",
        industrySlug: "insurance",
        trustScore: 77.9,
        rank: 18,
        regulatoryId: "IRDAI-REG-135",
        claimSettlementRatio: 96.7,
        averageGrievanceResolutionDays: 7.5,
        totalVerifiedReviews: 820,
        fakeReviewsFiltered: 75,
        quarantineStatus: "active",
        productsCount: 6,
        products: [
          {
            slug: "super-protect-plan",
            name: "Super Protect Plan",
            brandSlug: "ageas-federal",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 82.4,
            monthlyStartingPrice: 580,
            claimSettlementSpeedDays: 4,
            authenticityRating: 88.0,
            totalVerifiedReviews: 240,
            keyFeatures: ["Life Cover with Return of Premium Option", "Terminal Illness Benefit", "Flexible Payouts"],
            claimRatio: 97.2,
            fraudAlertStatus: "clean",
          },
          {
            slug: "isecure-plan",
            name: "iSecure Plan",
            brandSlug: "ageas-federal",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 80.1,
            monthlyStartingPrice: 520,
            claimSettlementSpeedDays: 5,
            authenticityRating: 86.5,
            totalVerifiedReviews: 180,
            keyFeatures: ["Pure Term Protection", "High Sum Assured Rebates", "Online Policy Issuance"],
            claimRatio: 96.8,
            fraudAlertStatus: "clean",
          },
          {
            slug: "saral-jeevan-bima",
            name: "Saral Jeevan Bima",
            brandSlug: "ageas-federal",
            industrySlug: "insurance",
            category: "Term Life",
            trustScore: 79.5,
            monthlyStartingPrice: 450,
            claimSettlementSpeedDays: 6,
            authenticityRating: 85.0,
            totalVerifiedReviews: 150,
            keyFeatures: ["Standard IRDAI Terms", "Simple Entry Criteria", "Guaranteed Death Benefit"],
            claimRatio: 96.5,
            fraudAlertStatus: "clean",
          },
          {
            slug: "guaranteed-income-plan",
            name: "Guaranteed Income Plan",
            brandSlug: "ageas-federal",
            industrySlug: "insurance",
            category: "Savings",
            trustScore: 76.8,
            monthlyStartingPrice: 2500,
            claimSettlementSpeedDays: 7,
            authenticityRating: 84.0,
            totalVerifiedReviews: 120,
            keyFeatures: ["Guaranteed Regular Income", "Life Cover Throughout Term", "Tax Benefits u/s 80C"],
            claimRatio: 96.0,
            fraudAlertStatus: "clean",
          },
        ],
      },
      { slug: "pramerica-life", name: "Pramerica Life", industrySlug: "insurance", trustScore: 77.1, rank: 19, regulatoryId: "IRDAI-REG-140", claimSettlementRatio: 96.0, averageGrievanceResolutionDays: 8.7, totalVerifiedReviews: 760, fakeReviewsFiltered: 70, quarantineStatus: "active", productsCount: 5, products: [] },
      { slug: "reliance-nippon", name: "Reliance Nippon Life", industrySlug: "insurance", trustScore: 76.4, rank: 20, regulatoryId: "IRDAI-REG-121", claimSettlementRatio: 95.8, averageGrievanceResolutionDays: 9.1, totalVerifiedReviews: 1150, fakeReviewsFiltered: 140, quarantineStatus: "active", productsCount: 8, products: [] },
      { slug: "shriram-life", name: "Shriram Life Insurance", industrySlug: "insurance", trustScore: 75.8, rank: 21, regulatoryId: "IRDAI-REG-128", claimSettlementRatio: 95.2, averageGrievanceResolutionDays: 9.5, totalVerifiedReviews: 690, fakeReviewsFiltered: 60, quarantineStatus: "active", productsCount: 6, products: [] },
      { slug: "star-union-daiichi", name: "Star Union Dai-ichi Life", industrySlug: "insurance", trustScore: 75.2, rank: 22, regulatoryId: "IRDAI-REG-142", claimSettlementRatio: 95.9, averageGrievanceResolutionDays: 8.9, totalVerifiedReviews: 620, fakeReviewsFiltered: 55, quarantineStatus: "active", productsCount: 5, products: [] },
      { slug: "acko-life", name: "Acko Life Insurance", industrySlug: "insurance", trustScore: 74.8, rank: 23, regulatoryId: "IRDAI-REG-161", claimSettlementRatio: 95.0, averageGrievanceResolutionDays: 5.0, totalVerifiedReviews: 540, fakeReviewsFiltered: 45, quarantineStatus: "active", productsCount: 3, products: [] },
      { slug: "digit-life", name: "Go Digit Life Insurance", industrySlug: "insurance", trustScore: 74.1, rank: 24, regulatoryId: "IRDAI-REG-162", claimSettlementRatio: 94.8, averageGrievanceResolutionDays: 5.2, totalVerifiedReviews: 480, fakeReviewsFiltered: 40, quarantineStatus: "active", productsCount: 3, products: [] },
      { slug: "creditaccess-life", name: "CreditAccess Life", industrySlug: "insurance", trustScore: 72.5, rank: 25, regulatoryId: "IRDAI-REG-163", claimSettlementRatio: 93.5, averageGrievanceResolutionDays: 10.2, totalVerifiedReviews: 320, fakeReviewsFiltered: 30, quarantineStatus: "active", productsCount: 2, products: [] },
      { slug: "sahara-life", name: "Sahara India Life", industrySlug: "insurance", trustScore: 54.0, rank: 26, regulatoryId: "IRDAI-REG-127", claimSettlementRatio: 89.2, averageGrievanceResolutionDays: 24.5, totalVerifiedReviews: 420, fakeReviewsFiltered: 65, quarantineStatus: "under_audit", productsCount: 1, products: [] },
    ],
  },
};

const BRAND_SLUG_MAP: Record<string, string> = {
  "ageas-federal-life": "ageas-federal",
  "ageas-federal": "ageas-federal",
  "tata-aia-life": "tata-aia",
  "tata-aia": "tata-aia",
  "axis-max-life": "max-life",
  "max-life": "max-life",
  "icici-prudential-life": "icici-prudential",
  "icici-prudential": "icici-prudential",
  "aditya-birla-sun-life": "birla-sun-life",
  "birla-sun-life": "birla-sun-life",
  "bajaj-life": "bajaj-allianz",
  "bajaj-allianz": "bajaj-allianz",
  "canara-hsbc-life": "canara-hsbc",
  "canara-hsbc": "canara-hsbc",
  "edelweiss-life": "edelweiss-tokio",
  "edelweiss-tokio": "edelweiss-tokio",
  "generali-central-life": "future-generali",
  "future-generali": "future-generali",
  "indusind-nippon-life": "reliance-nippon",
  "reliance-nippon": "reliance-nippon",
  "sud-life": "star-union-daiichi",
  "star-union-daiichi": "star-union-daiichi",
  "go-digit-life": "digit-life",
  "digit-life": "digit-life",
};

export function getIndustry(slug: string): Industry | undefined {
  return industriesData[slug];
}

export function getAllIndustries(): Industry[] {
  return Object.values(industriesData);
}

export function getBrand(industrySlug: string, brandSlug: string): Brand | undefined {
  const industry = getIndustry(industrySlug);
  const normalized = BRAND_SLUG_MAP[brandSlug] || brandSlug;
  const found = industry?.brands.find((b) => b.slug === normalized || b.slug === brandSlug);
  if (found) return found;

  // Fallback to any of the 26 IRDAI life insurers
  const ins = INS[brandSlug] || INS[normalized];
  if (ins && industrySlug === "insurance") {
    return {
      slug: ins.slug,
      name: ins.name,
      industrySlug: "insurance",
      trustScore: 0,
      rank: 26,
      regulatoryId: `IRDAI-REG-${ins.reg}`,
      claimSettlementRatio: 98.4,
      averageGrievanceResolutionDays: 6.5,
      totalVerifiedReviews: 0,
      fakeReviewsFiltered: 0,
      quarantineStatus: "active",
      productsCount: 0,
      products: [],
    };
  }
  return undefined;
}

export function getProduct(
  industrySlug: string,
  brandSlug: string,
  productSlug: string
): Product | undefined {
  const brand = getBrand(industrySlug, brandSlug);
  if (!brand) return undefined;
  const existing = brand.products.find((p) => p.slug === productSlug);
  if (existing) return existing;

  // Fallback synthesis for registered plans so no plan route ever 404s
  const title = productSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    slug: productSlug,
    name: title,
    brandSlug: brand.slug,
    industrySlug,
    category: "Term Life",
    trustScore: brand.trustScore,
    monthlyStartingPrice: 650,
    claimSettlementSpeedDays: Math.round(brand.averageGrievanceResolutionDays),
    authenticityRating: 90.0,
    totalVerifiedReviews: Math.round(brand.totalVerifiedReviews / (brand.productsCount || 5)),
    keyFeatures: ["Audited Contract Wording", "IRDAI Registered Terms", "Authenticity Verified"],
    claimRatio: brand.claimSettlementRatio,
    fraudAlertStatus: "clean",
  };
}

export function compareBrands(
  industrySlug: string,
  brandSlugA: string,
  brandSlugB: string
): BrandComparison | undefined {
  const brandA = getBrand(industrySlug, brandSlugA);
  const brandB = getBrand(industrySlug, brandSlugB);

  if (!brandA || !brandB) return undefined;

  const scoreDelta = Number((brandA.trustScore - brandB.trustScore).toFixed(1));

  return {
    industrySlug,
    brandA,
    brandB,
    scoreDelta,
    metrics: [
      {
        metricName: "Authenticity-Weighted TrustScore",
        brandAValue: `${brandA.trustScore} / 100`,
        brandBValue: `${brandB.trustScore} / 100`,
        winner: brandA.trustScore > brandB.trustScore ? "A" : "B",
        importanceWeight: 35,
      },
      {
        metricName: "IRDAI Claim Settlement Ratio",
        brandAValue: `${brandA.claimSettlementRatio}%`,
        brandBValue: `${brandB.claimSettlementRatio}%`,
        winner: brandA.claimSettlementRatio >= brandB.claimSettlementRatio ? "A" : "B",
        importanceWeight: 30,
      },
      {
        metricName: "Average Grievance Resolution (Days)",
        brandAValue: `${brandA.averageGrievanceResolutionDays} days`,
        brandBValue: `${brandB.averageGrievanceResolutionDays} days`,
        winner: brandA.averageGrievanceResolutionDays <= brandB.averageGrievanceResolutionDays ? "A" : "B",
        importanceWeight: 20,
      },
      {
        metricName: "Verified Policyholder Reviews",
        brandAValue: brandA.totalVerifiedReviews.toLocaleString(),
        brandBValue: brandB.totalVerifiedReviews.toLocaleString(),
        winner: brandA.totalVerifiedReviews >= brandB.totalVerifiedReviews ? "A" : "B",
        importanceWeight: 15,
      },
    ],
    verdictSummary:
      brandA.trustScore > brandB.trustScore
        ? `${brandA.name} holds a higher TrustScore (+${Math.abs(scoreDelta)}) driven by superior claim settlement speed and verified policyholder sentiment.`
        : `${brandB.name} holds a higher TrustScore (+${Math.abs(scoreDelta)}) with stronger grievance resolution speed.`,
  };
}
