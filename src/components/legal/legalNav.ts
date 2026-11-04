export type LegalNavSlug =
  | "hub"
  | "terms-of-use"
  | "review-policy"
  | "trustscore-methodology"
  | "grievances-corrections"
  | "privacy-notice"
  | "sources-editorial";

export const LEGAL_NAV: { slug: LegalNavSlug; label: string }[] = [
  { slug: "hub", label: "Legal Centre" },
  { slug: "terms-of-use", label: "Terms of Use" },
  { slug: "review-policy", label: "Review & Community Policy" },
  {
    slug: "trustscore-methodology",
    label: "TrustScore & Index Methodology",
  },
  {
    slug: "grievances-corrections",
    label: "Grievances & Corrections",
  },
  { slug: "privacy-notice", label: "Privacy Notice" },
  {
    slug: "sources-editorial",
    label: "Source Rights & Editorial Policy",
  },
];

export const LEGAL_HERO: Record<
  LegalNavSlug,
  { eyebrow: string; title: string; description: string }
> = {
  hub: {
    eyebrow: "Transparency by design",
    title: "TrustValue Legal Centre",
    description:
      "The rules behind genuine reviews, independent TrustScores, data privacy and fair corrections.",
  },
  "terms-of-use": {
    eyebrow: "Transparency by design",
    title: "Terms of Use",
    description: "The terms governing your use of TrustValue.ai and contributions to the platform.",
  },
  "review-policy": {
    eyebrow: "Transparency by design",
    title: "Review & Community Policy",
    description: "How authentic reviews are submitted, moderated and challenged.",
  },
  "trustscore-methodology": {
    eyebrow: "Transparency by design",
    title: "TrustScore & Index Methodology",
    description: "How ratings, evidence, Not Rated and independent indices are distinguished.",
  },
  "grievances-corrections": {
    eyebrow: "Transparency by design",
    title: "Grievances & Corrections",
    description: "Free, transparent ways to raise errors and submit lawful notices.",
  },
  "privacy-notice": {
    eyebrow: "Transparency by design",
    title: "Privacy Notice",
    description: "How contributor details, private evidence and site data are handled.",
  },
  "sources-editorial": {
    eyebrow: "Transparency by design",
    title: "Source Rights & Editorial Policy",
    description: "How sources, intellectual property and factual corrections are managed.",
  },
};
