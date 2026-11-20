import fs from "node:fs";
import path from "node:path";
import { API_CONFIG } from "@/config";
import type {
  AttributeDef, CategoryNode, City, ComparePairs, LocationMode, Offering, Provider,
  RedirectRule, ResolvedCategory, SectorConfig, SectorFile, TemplateKey,
} from "./types";

/**
 * File-backed CMS adapter. Everything the site renders comes through the functions
 * exported from this file, so swapping to Sanity / Strapi / Payload / a database later
 * means rewriting ONLY this file. Pages and templates never touch content/ directly.
 */
const ROOT = path.join(process.cwd(), "content");

function readJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")) as T;
}
function listJson(dir: string): string[] {
  const full = path.join(ROOT, dir);
  return fs.existsSync(full) ? fs.readdirSync(full).filter((f) => f.endsWith(".json")).sort() : [];
}
/** Cache in production builds; re-read on every call in dev so content edits show up instantly. */
const memoClearers: (() => void)[] = [];
function memo<T>(fn: () => T): () => T {
  if (process.env.NODE_ENV !== "production") return fn;
  let v: T | undefined;
  memoClearers.push(() => { v = undefined; });
  return () => (v ??= fn());
}

/** Clear all in-memory cache so file updates on disk are read fresh on next access. */
export function clearCmsCache(): void {
  for (const clear of memoClearers) {
    clear();
  }
}

/* ----------------------------- sectors & categories ----------------------------- */

interface Loaded { config: SectorConfig; categories: ResolvedCategory[] }

function resolveTree(file: SectorFile): ResolvedCategory[] {
  const out: ResolvedCategory[] = [];
  const walk = (
    nodes: CategoryNode[], parent: string[], level: number,
    inh: { template: TemplateKey; location: LocationMode; attributes: AttributeDef[] },
  ) => {
    for (const n of nodes) {
      const p = [...parent, n.slug];
      const cur = {
        template: n.template ?? inh.template,
        location: n.location ?? inh.location,
        attributes: n.attributes ?? inh.attributes,
      };
      out.push({
        sector: file.slug, path: p, slug: n.slug, name: n.name, level,
        ...cur, intro: n.intro, faqs: n.faqs ?? [],
        childSlugs: (n.children ?? []).map((c) => c.slug),
      });
      if (n.children) walk(n.children, p, level + 1, cur);
    }
  };
  walk(file.categories, [], 1, {
    template: file.defaultTemplate, location: file.location, attributes: file.attributes,
  });
  return out;
}

const loadAll = memo((): Map<string, Loaded> => {
  const map = new Map<string, Loaded>();
  for (const f of listJson("sectors")) {
    const file = readJson<SectorFile>(`sectors/${f}`);
    const { categories: _tree, ...config } = file;
    map.set(file.slug, { config, categories: resolveTree(file) });
  }
  return map;
});

export const getSectors = (): SectorConfig[] => [...loadAll().values()].map((l) => l.config);
export const getSector = (slug: string): SectorConfig | undefined => loadAll().get(slug)?.config;

export const getCategories = (sector: string): ResolvedCategory[] => loadAll().get(sector)?.categories ?? [];
export const getCategory = (sector: string, p: string[]): ResolvedCategory | undefined =>
  getCategories(sector).find((c) => c.path.join("/") === p.join("/"));
/** Direct children of a category path ([] = top level). */
export const getChildren = (sector: string, p: string[]): ResolvedCategory[] =>
  getCategories(sector).filter(
    (c) => c.level === p.length + 1 && p.every((seg, i) => c.path[i] === seg),
  );
/** Category slugs are unique per sector, so a leaf slug identifies exactly one category. */
export const getCategoryBySlug = (sector: string, slug: string): ResolvedCategory | undefined =>
  getCategories(sector).find((c) => c.slug === slug);
export const getAncestors = (sector: string, p: string[]): ResolvedCategory[] =>
  p.map((_, i) => getCategory(sector, p.slice(0, i + 1))).filter(Boolean) as ResolvedCategory[];

/* ---------------------------------- providers ---------------------------------- */

const loadProviders = memo(() => readJson<Provider[]>("providers.json"));
export const getProviders = () => loadProviders();
export const getProvider = (slug: string) => loadProviders().find((p) => p.slug === slug);
/** Providers that have a ProviderProfile in the given sector. */
export const getProvidersForSector = (sector: string) =>
  loadProviders().filter((p) => sector in p.sectors);

/* ---------------------------------- offerings ---------------------------------- */

const loadOfferings = memo((): Offering[] => {
  const all: Offering[] = [];
  for (const f of listJson("offerings")) {
    const sector = f.replace(/\.json$/, "");
    for (const o of readJson<Omit<Offering, "sector">[]>(`offerings/${f}`)) all.push({ ...o, sector });
  }
  return all;
});

export const getOfferings = (sector: string) =>
  loadOfferings().filter((o) => o.sector === sector && o.status === "published");
export const getOffering = (sector: string, provider: string, slug: string) =>
  getOfferings(sector).find((o) => o.provider === provider && o.slug === slug);
export const getOfferingsByProvider = (sector: string, provider: string) =>
  getOfferings(sector).filter((o) => o.provider === provider);

const startsWith = (full: string[], prefix: string[]) => prefix.every((s, i) => full[i] === s);
/** Offerings in a category, including everything in its descendants. Optionally scoped to a city. */
export function getOfferingsInCategory(sector: string, p: string[], city?: string): Offering[] {
  return getOfferings(sector).filter((o) => {
    const cats = [o.primaryCategory, ...(o.extraCategories ?? [])].map((c) => c.split("/"));
    return cats.some((c) => startsWith(c, p)) && (!city || o.cities?.includes(city));
  });
}
export const getOfferingsInCity = (sector: string, city: string) =>
  getOfferings(sector).filter((o) => o.cities?.includes(city));

/* ----------------------------- cities, compare, redirects ----------------------------- */

const loadCities = memo(() => readJson<City[]>("cities.json"));
export const getCities = () => loadCities();
export const getCity = (slug: string) => loadCities().find((c) => c.slug === slug);

const loadCompare = memo(() => readJson<ComparePairs>("compare.json"));
export const getComparePairs = () => loadCompare();

export const getRedirects = (): RedirectRule[] => readJson<RedirectRule[]>("redirects.json");

/* ---------------------------------- blogs ---------------------------------- */

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  sector: string;
  readTime: string;
  summary: string;
  body: string;
  content?: string;
  status: string;
  author?: string;
  authors?: string[] | string;
  categoryName?: string;
  categorySlug?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  directAnswer?: string;
  featuredImage?: string;
  faqData?: BlogFAQ[];
  views?: number;
  commentsCount?: number;
  relatedSlugs?: string[];
  relatedArticles?: string;
  seo?: {
    title?: string;
    description?: string;
    focusKeyword?: string;
    keywords?: string[];
    schemaType?: string;
  };
}

import { getAuthors, DEFAULT_EDITORIAL_ANALYSTS } from "./blog-utils";
export { getAuthors, DEFAULT_EDITORIAL_ANALYSTS };

const loadBlogs = memo((): BlogArticle[] => {
  // Try manifest.json first for high-scale performance (10K+ articles)
  const manifestPath = path.join(ROOT, "blogs", "manifest.json");
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as BlogArticle[];
    } catch {
      // fallback
    }
  }

  // Fallback to monolithic articles.json
  const full = path.join(ROOT, "blogs", "articles.json");
  if (!fs.existsSync(full)) return [];
  try {
    return JSON.parse(fs.readFileSync(full, "utf8")) as BlogArticle[];
  } catch {
    return [];
  }
});

function normalizeArticle(article: any): BlogArticle {
  if (!article) return article;
  // Normalize FAQ format if CMS or bulk import passed { q, a } instead of { question, answer }
  const faqData = Array.isArray(article.faqData)
    ? article.faqData
        .map((f: any) => ({
          question: f.question || f.q || "",
          answer: f.answer || f.a || "",
        }))
        .filter((f: any) => f.question || f.answer)
    : [];

  const authors = getAuthors(article);
  const bodyText = article.body || article.content || "";

  const relatedSlugs = Array.isArray(article.relatedSlugs)
    ? article.relatedSlugs
    : typeof article.related_articles === "string" && article.related_articles.trim()
    ? article.related_articles.split(",").map((s: string) => s.trim()).filter(Boolean)
    : typeof article.relatedArticles === "string" && article.relatedArticles.trim()
    ? article.relatedArticles.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  return {
    ...article,
    body: bodyText,
    content: bodyText,
    author: authors[0] || (article.author !== undefined ? article.author : ""),
    authors,
    summary: article.summary ?? "",
    directAnswer: article.directAnswer !== undefined ? article.directAnswer : (article.direct_answer ?? ""),
    featuredImage: article.featuredImage !== undefined ? article.featuredImage : (article.featured_image ?? ""),
    categoryName: article.categoryName !== undefined ? article.categoryName : (article.category_name ?? ""),
    categorySlug: article.categorySlug !== undefined ? article.categorySlug : (article.category_slug ?? ""),
    relatedSlugs,
    faqData,
  };
}

export function getBlogFromLocal(slug: string): BlogArticle | undefined {
  // 1. O(1) Fast path: Direct single-file lookup in content/blogs/posts/{slug}.json
  const postFile = path.join(ROOT, "blogs", "posts", `${slug}.json`);
  if (fs.existsSync(postFile)) {
    try {
      const raw = fs.readFileSync(postFile, "utf8");
      return normalizeArticle(JSON.parse(raw));
    } catch (e) {
      console.error(`Failed to read post file ${postFile}:`, e);
    }
  }

  // 2. Check articles.json for full post if not in posts/
  const articlesFile = path.join(ROOT, "blogs", "articles.json");
  if (fs.existsSync(articlesFile)) {
    try {
      const articles: any[] = JSON.parse(fs.readFileSync(articlesFile, "utf8"));
      const found = articles.find((b) => b.slug === slug);
      if (found) return normalizeArticle(found);
    } catch {}
  }

  // 3. Fallback to full loadBlogs array
  const fromList = loadBlogs().find((b) => b.slug === slug);
  return fromList ? normalizeArticle(fromList) : undefined;
}

export async function getBlogs(params?: {
  sector?: string;
  page?: number;
  limit?: number;
}): Promise<BlogArticle[]> {
  // In development, load from local storage first for 0ms latency sync with CMS edits
  if (process.env.NODE_ENV !== "production" && !params?.page) {
    let list = loadBlogs().filter((b) => b.status === "published");
    if (params?.sector) {
      list = list.filter((b) => b.sector?.toLowerCase() === params.sector?.toLowerCase());
    }
    return list.map(normalizeArticle);
  }

  try {
    const query = new URLSearchParams({ status: "published" });
    if (params?.sector) query.set("sector", params.sector);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${API_CONFIG.cms.endpoints.blogs}?${query.toString()}`, {
      cache: process.env.NODE_ENV !== "production" ? "no-store" : undefined,
      next: process.env.NODE_ENV === "production" ? { revalidate: API_CONFIG.cms.revalidateSeconds, tags: ["blogs"] } : undefined,
      signal: AbortSignal.timeout(API_CONFIG.cms.timeouts.defaultMs),
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(normalizeArticle);
      }
    }
  } catch {
    // CMS API unreachable or timeout — seamless fallback to local high-scale partition storage
  }

  return loadBlogs().filter((b) => b.status === "published").map(normalizeArticle);
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  sectorSlug?: string;
  description?: string;
  heroTitle?: string;
  badge?: string;
  seoTitle?: string;
  seoDescription?: string;
  articleCount?: number;
  updatedAt?: string;
}

export function getBlogCategories(): BlogCategory[] {
  const sectors = getSectors();
  const blogs = loadBlogs().filter((b) => b.status === "published");

  let saved: BlogCategory[] = [];
  const catFile = path.join(ROOT, "blogs", "categories.json");
  if (fs.existsSync(catFile)) {
    try {
      saved = JSON.parse(fs.readFileSync(catFile, "utf8"));
    } catch {}
  }

  const map = new Map<string, BlogCategory>();
  for (const c of saved) {
    map.set(c.slug, c);
  }

  const result: BlogCategory[] = [];
  for (const s of sectors) {
    const existing = map.get(s.slug);
    const count = blogs.filter(
      (b) => b.sector?.toLowerCase() === s.slug.toLowerCase() || b.categorySlug?.toLowerCase() === s.slug.toLowerCase()
    ).length;

    if (existing) {
      result.push({
        ...existing,
        sectorSlug: s.slug,
        articleCount: count,
      });
      map.delete(s.slug);
    } else {
      result.push({
        id: s.slug,
        slug: s.slug,
        sectorSlug: s.slug,
        name: s.name,
        description: s.description || `Independent regulatory audit and research guides for the ${s.name} sector.`,
        heroTitle: `${s.name} Research & Regulatory Audits`,
        badge: "Regulatory Silo",
        seoTitle: `${s.name} Research & Consumer Guides | TrustValue`,
        seoDescription: `In-depth consumer research, statutory circulars, and regulatory audits across the ${s.name} sector.`,
        articleCount: count,
      });
    }
  }

  for (const extra of map.values()) {
    const count = blogs.filter(
      (b) => b.categorySlug?.toLowerCase() === extra.slug.toLowerCase() || b.sector?.toLowerCase() === extra.slug.toLowerCase()
    ).length;
    result.push({
      ...extra,
      articleCount: count,
    });
  }

  return result;
}

export function getBlogCategory(slug: string): BlogCategory | undefined {
  return getBlogCategories().find((c) => c.slug === slug);
}

export async function getBlog(slug: string): Promise<BlogArticle | undefined> {
  // Direct partition lookup on local filesystem for instant hot-reload sync in development
  const local = getBlogFromLocal(slug);
  if (local && (process.env.NODE_ENV !== "production" || !API_CONFIG.cms.baseUrl)) {
    return local;
  }

  try {
    const res = await fetch(API_CONFIG.cms.endpoints.blogBySlug(slug), {
      cache: process.env.NODE_ENV !== "production" ? "no-store" : undefined,
      next: process.env.NODE_ENV === "production" ? { revalidate: API_CONFIG.cms.revalidateSeconds, tags: ["blogs", `blog-${slug}`] } : undefined,
      signal: AbortSignal.timeout(API_CONFIG.cms.timeouts.defaultMs),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return normalizeArticle(json.data);
      }
    }
  } catch {
    // CMS API unreachable or timeout — seamless fallback to local high-scale partition storage
  }

  return local || getBlogFromLocal(slug);
}

/* ----------------------------------- helpers ----------------------------------- */

/** Merge offering attributes with a variant's overrides. */
export const mergeAttributes = (o: Offering, variantSlug?: string) => ({
  ...o.attributes,
  ...(o.variants?.find((v) => v.slug === variantSlug)?.attributes ?? {}),
});

/* ----------------------------- SEO & Crawl Directives ----------------------------- */

export interface GlobalSeoConfig {
  canonicalBase: string;
  siteTitleTemplate: string;
  allowAiBots: boolean;
  robotsTxt: string;
  llmsTxt: string;
  updatedAt?: string;
}

export const DEFAULT_SEO_CONFIG: GlobalSeoConfig = {
  canonicalBase: "https://trustvalue.ai",
  siteTitleTemplate: "%s | TrustValue Legal & Regulatory Audit",
  allowAiBots: true,
  robotsTxt: `# Default TrustValue Production robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Disallow: /

Sitemap: https://trustvalue.ai/sitemap.xml`,
  llmsTxt: `# TrustValue.ai - Statutory Audit & Telemetry Knowledge Base

> TrustValue is an independent regulatory compliance and telemetry audit engine covering Insurance, Real Estate, Banking, and Healthcare sectors in India.

## Knowledge Graph & Primary Archives
- [Insurance & Claims SLA](/category/insurance): IRDAI Master Circular, 30-Day SLA, Section 45 Incontestability Precedence.
- [Real Estate & Escrow](/category/real-estate): MahaRERA Usable Carpet Area guidelines, builder delay compensation, Section 18 penalty norms.
- [Banking & Lending](/category/banking): RBI floating rate home loan reset directives, ombudsman escalation tiers.

## Verified Telemetry & Data Sources
- Empirical Benchmark Matrix: ISO/IEC 25010 Evaluated, IS 19000:2022 Statutory Standard.
- Independent Audit Ledger: Cryptographically verified telemetry logs.

## API & Feeds
- JSON Data: Available via /api/v1/ endpoints.
- Sitemap: /sitemap.xml`,
};

export async function getSeoConfig(): Promise<GlobalSeoConfig> {
  const cwd = process.cwd();
  const localDirs = [
    path.resolve(cwd, "content", "seo"),
    path.resolve(cwd, "cms", "content", "seo"),
    path.resolve(cwd, "..", "content", "seo"),
  ];
  for (const d of localDirs) {
    const f = path.join(d, "seo-config.json");
    if (fs.existsSync(f)) {
      try {
        const data = JSON.parse(fs.readFileSync(f, "utf8"));
        return { ...DEFAULT_SEO_CONFIG, ...data };
      } catch {}
    }
  }

  try {
    const cmsUrl = process.env.CMS_API_URL || "http://localhost:3001";
    const res = await fetch(`${cmsUrl}/api/v1/seo`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return { ...DEFAULT_SEO_CONFIG, ...json.data };
    }
  } catch {}

  return DEFAULT_SEO_CONFIG;
}

export async function getRobotsTxt(): Promise<string> {
  const cwd = process.cwd();
  const fileCandidates = [
    path.resolve(cwd, "content", "seo", "robots.txt"),
    path.resolve(cwd, "cms", "content", "seo", "robots.txt"),
    path.resolve(cwd, "..", "content", "seo", "robots.txt"),
  ];
  for (const p of fileCandidates) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, "utf8").trim();
        if (content) return content;
      } catch {}
    }
  }
  const config = await getSeoConfig();
  return config.robotsTxt || DEFAULT_SEO_CONFIG.robotsTxt;
}

export async function getLlmsTxt(): Promise<string> {
  const cwd = process.cwd();
  const fileCandidates = [
    path.resolve(cwd, "content", "seo", "llms.txt"),
    path.resolve(cwd, "cms", "content", "seo", "llms.txt"),
    path.resolve(cwd, "..", "content", "seo", "llms.txt"),
  ];
  for (const p of fileCandidates) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, "utf8").trim();
        if (content) return content;
      } catch {}
    }
  }
  const config = await getSeoConfig();
  return config.llmsTxt || DEFAULT_SEO_CONFIG.llmsTxt;
}

/* ---------------------------------- Static Pages (Home Page) ---------------------------------- */

export interface HomePageContent {
  hero: {
    descriptor: string;
    titlePrimary: string;
    titleAccent: string;
    lead: string;
    searchPlaceholder: string;
    tryChips: string[];
    promises: string[];
  };
  ticker: {
    stateLabel: string;
    highlightNote: string;
  };
  statusCard: {
    tagLabel: string;
    title: string;
    description: string;
    targetReviews: number;
    lockedReviews: number;
    counts: {
      articlesPublished: number;
      brandsListed: number;
      productsListed: number;
      sectorsMapped: number;
    };
  };
  simulator: {
    title: string;
    lead: string;
    tag: string;
    question: string;
    hint: string;
  };
  seo: {
    title: string;
    description: string;
    focusKeyword: string;
  };
  updatedAt?: string;
  lastEditedBy?: string;
}

export const DEFAULT_HOME_PAGE: HomePageContent = {
  hero: {
    descriptor: "The Global Trust Index",
    titlePrimary: "Know before you",
    titleAccent: "trust.",
    lead: "TrustValue is where people rate and review brands, in public. Real experiences become a Trust Index for every brand and product. See what people actually lived through before you choose, whether it is a policy, a loan, a phone plan, a car or a hospital.",
    searchPlaceholder: "Search a brand, product or category",
    tryChips: ["Insurance", "Banking & loans", "Telecom", "Automobiles", "All 18 sectors"],
    promises: [
      "No paid influence",
      "No rating ownership by businesses",
      "No rewritten history",
    ],
  },
  ticker: {
    stateLabel: "Every-Sector Index",
    highlightNote: "Insurance opens first, then banking, telecom and automobiles · 183 brands listed",
  },
  statusCard: {
    tagLabel: "Trust Index, pre-live",
    title: "Goes live at 1,000 reviews.",
    description: "An index has to earn its first number. Ours opens at a base of 1,000 the day the thousandth experience is locked.",
    targetReviews: 1000,
    lockedReviews: 0,
    counts: {
      articlesPublished: 0,
      brandsListed: 183,
      productsListed: 84,
      sectorsMapped: 18,
    },
  },
  simulator: {
    title: "One gesture. One truth. Then move on.",
    lead: "Rating here takes about seven seconds. Drag once, fine-tune if you care to, lock it. Try it now. This is a demo and nothing is submitted.",
    tag: "Demo. Nothing is submitted.",
    question: "How did it feel?",
    hint: "Don't overthink it. Your first instinct is the signal.",
  },
  seo: {
    title: "TrustValue | The Global Consumer Regulatory & Trust Index",
    description: "Independent regulatory audit, consumer trust scores, and statutory telemetries across India's core sectors.",
    focusKeyword: "Global Trust Index",
  },
};

const loadHomePage = memo((): HomePageContent => {
  const p = path.join(ROOT, "static", "home.json");
  if (fs.existsSync(p)) {
    try {
      return { ...DEFAULT_HOME_PAGE, ...JSON.parse(fs.readFileSync(p, "utf8")) };
    } catch {}
  }
  return DEFAULT_HOME_PAGE;
});

export const getHomePageContent = (): HomePageContent => loadHomePage();


