import type { Metadata } from "next";
import BrandDetailLayout from "@/components/brands/BrandDetailLayout";

export const metadata: Metadata = {
  title: "Northwind Term Shield – Plan Brand Page | TrustValue.ai",
  description: "Audited brand and product plan page for Northwind Term Shield with 30/70 interactive story summary and regulatory disclosures.",
};

export default function PlanPreviewPage() {
  return (
    <BrandDetailLayout
      entityType="plan"
      title="Northwind Term Shield"
      categoryName="Term plan"
      categorySlug="life/term-insurance"
      providerName="Northwind Life Insurance"
      providerSlug="northwind"
      sectorSlug="insurance"
      summary="Pure risk individual life protection with zero co-pay, guaranteed claims escalation SLA, and terminal illness rider."
      lastVerified="2026-10-29"
      claimSettlementRatio="98.10%"
      solvencyRatio="2.12x"
      turnaroundDays="4.2 days"
      trustScore={94.2}
    />
  );
}
