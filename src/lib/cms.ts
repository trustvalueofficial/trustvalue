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
function memo<T>(fn: () => T): () => T {
  if (process.env.NODE_ENV !== "production") return fn;
  let v: T | undefined;
  return () => (v ??= fn());
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
  status: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  directAnswer?: string;
  featuredImage?: string;
  faqData?: BlogFAQ[];
  categoryId?: string;
  views?: number;
  commentsCount?: number;
  indexedAt?: string;
  relatedSlugs?: string[];
  seo?: {
    title?: string;
    description?: string;
    focusKeyword?: string;
    keywords?: string[];
    schemaType?: string;
  };
}

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
    ? article.faqData.map((f: any) => ({
        question: f.question || f.q || "",
        answer: f.answer || f.a || "",
      }))
    : undefined;

  return {
    ...article,
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
  try {
    const query = new URLSearchParams({ status: "published" });
    if (params?.sector) query.set("sector", params.sector);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${API_CONFIG.cms.endpoints.blogs}?${query.toString()}`, {
      next: { revalidate: API_CONFIG.cms.revalidateSeconds, tags: ["blogs"] },
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

  return loadBlogs().filter((b) => b.status === "published");
}

export async function getBlog(slug: string): Promise<BlogArticle | undefined> {
  try {
    const res = await fetch(API_CONFIG.cms.endpoints.blogBySlug(slug), {
      next: { revalidate: API_CONFIG.cms.revalidateSeconds, tags: ["blogs", `blog-${slug}`] },
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

  return getBlogFromLocal(slug);
}

/* ----------------------------------- helpers ----------------------------------- */

/** Merge offering attributes with a variant's overrides. */
export const mergeAttributes = (o: Offering, variantSlug?: string) => ({
  ...o.attributes,
  ...(o.variants?.find((v) => v.slug === variantSlug)?.attributes ?? {}),
});

