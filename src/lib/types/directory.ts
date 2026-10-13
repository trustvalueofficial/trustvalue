export interface Product {
  slug: string;
  name: string;
  brandSlug: string;
  industrySlug: string;
  category: "Term Life" | "ULIP" | "Savings" | "Health" | "Retirement";
  trustScore: number;
  monthlyStartingPrice: number;
  claimSettlementSpeedDays: number;
  authenticityRating: number;
  totalVerifiedReviews: number;
  keyFeatures: string[];
  claimRatio: number;
  fraudAlertStatus: "clean" | "monitored" | "quarantined";
}

export interface Brand {
  slug: string;
  name: string;
  industrySlug: string;
  logoUrl?: string;
  trustScore: number;
  rank: number;
  regulatoryId: string; // e.g. IRDAI Registration No.
  claimSettlementRatio: number; // e.g. 99.3%
  averageGrievanceResolutionDays: number;
  totalVerifiedReviews: number;
  fakeReviewsFiltered: number;
  quarantineStatus: "active" | "frozen" | "under_audit";
  productsCount: number;
  products: Product[];
}

export interface Industry {
  slug: string;
  name: string;
  icon: string;
  description: string;
  regulator: string;
  totalBrands: number;
  totalProducts: number;
  averageIndustryTrustScore: number;
  brands: Brand[];
}

export interface ComparisonMetric {
  metricName: string;
  brandAValue: number | string;
  brandBValue: number | string;
  winner: "A" | "B" | "tie";
  importanceWeight: number;
}

export interface BrandComparison {
  industrySlug: string;
  brandA: Brand;
  brandB: Brand;
  scoreDelta: number;
  metrics: ComparisonMetric[];
  verdictSummary: string;
}
