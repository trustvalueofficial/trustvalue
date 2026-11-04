export type TemplateKey = "plan" | "spec" | "place" | "listing" | "scheme";
export type LocationMode = "none" | "optional" | "required";
export type AttrType = "text" | "number" | "currency" | "percent" | "boolean" | "date" | "list";
export type AttrValue = string | number | boolean | string[];

export interface AttributeDef {
  key: string;
  label: string;
  type: AttrType;
  unit?: string;
  comparable?: boolean;
  filterable?: boolean;
  higherIsBetter?: boolean;
}
export interface Faq { question: string; answer: string }
export interface SourceRef { title: string; url: string; accessedOn: string }
export interface Review { rating: number; source: string; body: string; date: string }

/** One node of the nested category tree as authored in content/sectors/<slug>.json */
export interface CategoryNode {
  slug: string;
  name: string;
  template?: TemplateKey;
  location?: LocationMode;
  intro?: string;
  faqs?: Faq[];
  attributes?: AttributeDef[];
  children?: CategoryNode[];
}

/** Sector config = the single record that drives labels, depth, template, location and features. */
export interface SectorConfig {
  slug: string;
  name: string;
  icon: string;
  description: string;
  nav: { providers: string; categories: string };
  labels: {
    provider: string; providers: string;
    offering: string; offerings: string;
    variant: string;
    levels: string[];
  };
  maxCategoryDepth: 1 | 2 | 3;
  defaultTemplate: TemplateKey;
  location: LocationMode;
  features: { reviews: boolean; compare: boolean; calculator?: boolean; eligibilityChecker?: boolean };
  indexing: { minFieldsToIndex: number };
  watch?: string;
  attributes: AttributeDef[];
}
export interface SectorFile extends SectorConfig { categories: CategoryNode[] }

/** Flattened category with template/location/attributes already inherited from ancestors. */
export interface ResolvedCategory {
  sector: string;
  path: string[];
  slug: string;
  name: string;
  level: number;
  template: TemplateKey;
  location: LocationMode;
  intro?: string;
  faqs: Faq[];
  attributes: AttributeDef[];
  childSlugs: string[];
}

export interface ProviderProfile {
  description: string;
  registration?: string;
  trust?: Record<string, string>;
}
export interface Provider {
  slug: string;
  name: string;
  type: string;
  parentGroup?: string;
  website?: string;
  sectors: Record<string, ProviderProfile>;
}

export interface Variant { slug: string; name: string; attributes: Record<string, AttrValue> }
export interface PlaceInfo { address: string; locality?: string; city?: string; state?: string }
export interface Offering {
  slug: string;
  provider: string;
  sector: string; // filled in by the loader from the file name
  name: string;
  /** category path inside the sector, e.g. "life/term-insurance" */
  primaryCategory: string;
  extraCategories?: string[];
  status: "published" | "draft";
  lastVerified: string;
  summary?: string;
  attributes: Record<string, AttrValue>;
  variants?: Variant[];
  cities?: string[];
  place?: PlaceInfo;
  pros?: string[];
  cons?: string[];
  faqs?: Faq[];
  sources?: SourceRef[];
  reviews?: Review[];
}

export interface City { slug: string; name: string; state: string }
export interface RedirectRule { fromPath: string; toPath: string; status: 301 | 302 | 307 | 308 }
export interface ComparePairs {
  providers: { sector: string; pair: string }[];
  offerings: { sector: string; category: string; pair: string }[];
}
