import reserved from "@/content/_reserved.json";

/** Slugs a category may never use (static folders win over the [...category] catch-all). */
export const RESERVED_CATEGORY_SLUGS: readonly string[] = reserved.category;
/** Slugs a sector may never use (they would collide with other top-level routes). */
export const RESERVED_SECTOR_SLUGS: readonly string[] = reserved.sector;

/**
 * Single source of truth for every URL on the site.
 * Never hand-write a path in a component - call one of these.
 */
export const paths = {
  home: () => "/",
  sector: (s: string) => `/${s}`,
  category: (s: string, p: string[]) => `/${s}/${p.join("/")}`,
  providers: (s: string) => `/${s}/brands`,
  provider: (s: string, p: string) => `/${s}/brands/${p}`,
  brands: (s: string) => `/${s}/brands`,
  brand: (s: string, p: string) => `/${s}/brands/${p}`,
  offering: (s: string, p: string, o: string) => `/${s}/brands/${p}/${o}`,
  variant: (s: string, p: string, o: string, v: string) => `/${s}/brands/${p}/${o}/${v}`,
  city: (s: string, c: string) => `/${s}/in/${c}`,
  cityCategory: (s: string, c: string, p: string[]) => `/${s}/in/${c}/${p.join("/")}`,
  compareProviders: (s: string, pair: string) => `/${s}/compare/providers/${pair}`,
  compareOfferings: (s: string, cat: string, pair: string) => `/${s}/compare/${cat}/${pair}`,
  about: () => "/about",
  blog: () => "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  contact: () => "/contact",
  reviews: () => "/reviews",
  rating: () => "/rating",
};
