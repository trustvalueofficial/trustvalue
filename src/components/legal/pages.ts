import type { LegalNavSlug } from "./legalNav";
import { LEGAL_GRIEVANCES_CORRECTIONS_HTML } from "./content/grievances-corrections";
import { LEGAL_HUB_HTML } from "./content/hub";
import { LEGAL_PRIVACY_NOTICE_HTML } from "./content/privacy-notice";
import { LEGAL_REVIEW_POLICY_HTML } from "./content/review-policy";
import { LEGAL_SOURCES_EDITORIAL_HTML } from "./content/sources-editorial";
import { LEGAL_TERMS_OF_USE_HTML } from "./content/terms-of-use";
import { LEGAL_TRUSTSCORE_METHODOLOGY_HTML } from "./content/trustscore-methodology";

export const LEGAL_POLICY_PAGES: Record<
  Exclude<LegalNavSlug, "hub">,
  { title: string; description: string; html: string }
> = {
  "terms-of-use": {
    title: "Terms of Use | TrustValue.ai",
    description: "The terms governing your use of TrustValue.ai and contributions to the platform.",
    html: LEGAL_TERMS_OF_USE_HTML,
  },
  "review-policy": {
    title: "Review & Community Policy | TrustValue.ai",
    description: "How authentic reviews are submitted, moderated and challenged.",
    html: LEGAL_REVIEW_POLICY_HTML,
  },
  "trustscore-methodology": {
    title: "TrustScore & Index Methodology | TrustValue.ai",
    description: "How ratings, evidence, Not Rated and independent indices are distinguished.",
    html: LEGAL_TRUSTSCORE_METHODOLOGY_HTML,
  },
  "grievances-corrections": {
    title: "Grievances & Corrections | TrustValue.ai",
    description: "Free, transparent ways to raise errors and submit lawful notices.",
    html: LEGAL_GRIEVANCES_CORRECTIONS_HTML,
  },
  "privacy-notice": {
    title: "Privacy Notice | TrustValue.ai",
    description: "How contributor details, private evidence and site data are handled.",
    html: LEGAL_PRIVACY_NOTICE_HTML,
  },
  "sources-editorial": {
    title: "Source Rights & Editorial Policy | TrustValue.ai",
    description: "How sources, intellectual property and factual corrections are managed.",
    html: LEGAL_SOURCES_EDITORIAL_HTML,
  },
};

export const LEGAL_HUB = {
  title: "TrustValue Legal Centre | TrustValue.ai",
  description:
    "The rules behind genuine reviews, independent TrustScores, data privacy and fair corrections.",
  html: LEGAL_HUB_HTML,
};

export const LEGAL_POLICY_SLUGS = Object.keys(LEGAL_POLICY_PAGES) as Exclude<LegalNavSlug, "hub">[];

const ALL_LEGAL_SLUGS: LegalNavSlug[] = ["hub", ...LEGAL_POLICY_SLUGS];

export function isLegalNavSlug(value: string): value is LegalNavSlug {
  return (ALL_LEGAL_SLUGS as string[]).includes(value);
}

export function getLegalHtml(slug: LegalNavSlug): string {
  if (slug === "hub") return LEGAL_HUB.html;
  return LEGAL_POLICY_PAGES[slug].html;
}
