/**
 * Centralized FontAwesome 6 icon resolver for TrustValue sectors, categories, and utilities.
 */

const SECTOR_ICONS: Record<string, string> = {
  insurance: "fa-shield-halved",
  banking: "fa-building-columns",
  investments: "fa-chart-line",
  healthcare: "fa-hospital",
  pharma: "fa-capsules",
  automobiles: "fa-car",
  "real-estate": "fa-city",
  telecom: "fa-tower-broadcast",
  "internet-ott": "fa-clapperboard",
  food: "fa-utensils",
  retail: "fa-bag-shopping",
  travel: "fa-plane-departure",
  utilities: "fa-bolt",
  education: "fa-graduation-cap",
  electronics: "fa-mobile-screen-button",
  "jobs-skilling": "fa-briefcase",
  agriculture: "fa-tractor",
  government: "fa-landmark",
};

const CATEGORY_ICONS: Record<string, string> = {
  // Insurance
  "term-insurance": "fa-shield-halved",
  "savings-plans": "fa-piggy-bank",
  ulip: "fa-arrow-trend-up",
  "pension-plans": "fa-umbrella-beach",
  "individual-health": "fa-heart-pulse",
  "family-floater": "fa-people-roof",
  "senior-citizen-health": "fa-hand-holding-heart",
  "dental-care-plan": "fa-tooth",
  "motor-insurance": "fa-car-side",
  "travel-insurance": "fa-plane",
  "home-insurance": "fa-house-chimney",
  life: "fa-heart",
  health: "fa-notes-medical",
  general: "fa-shield",

  // Banking & Loans
  accounts: "fa-wallet",
  cards: "fa-credit-card",
  loans: "fa-building-columns",
  deposits: "fa-vault",

  // Healthcare
  hospitals: "fa-hospital",
  diagnostics: "fa-microscope",

  // Automobiles
  cars: "fa-car",
  evs: "fa-charging-station",
  "two-wheelers": "fa-motorcycle",

  // Real Estate
  residential: "fa-house",
  commercial: "fa-building",
  plots: "fa-map-location-dot",

  // Utilities
  electricity: "fa-bolt",
  gas: "fa-fire-flame-simple",
  water: "fa-faucet-drip",
};

export function getSectorFaIcon(slug: string): string {
  return SECTOR_ICONS[slug] || "fa-shapes";
}

export function getCategoryFaIcon(slug: string): string {
  return CATEGORY_ICONS[slug] || "fa-layer-group";
}
