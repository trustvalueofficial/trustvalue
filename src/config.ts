/**
 * Application Configuration & API Endpoints
 * Centralizes all CMS, backend, and external API integrations for TrustValue frontend.
 *
 * Environments:
 * - Production:
 *     CMS: https://trustcms.cloud.run
 *     Site: https://trustvalue.ai
 * - Local Development:
 *     CMS: http://localhost:3001
 *     Site: http://localhost:3000
 */

const isProduction = process.env.NODE_ENV === "production";

export const CMS_BASE_URL =
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_CMS_URL ||
  (isProduction ? "https://trustcms.cloud.run" : "http://localhost:3001");

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (isProduction ? "https://trustvalue.ai" : "http://localhost:3000");

export const API_CONFIG = {
  cms: {
    baseUrl: CMS_BASE_URL,
    endpoints: {
      blogs: `${CMS_BASE_URL}/api/v1/blogs`,
      blogBySlug: (slug: string) => `${CMS_BASE_URL}/api/v1/blogs/${encodeURIComponent(slug)}`,
      blogsBulk: `${CMS_BASE_URL}/api/v1/blogs/bulk`,
      categories: `${CMS_BASE_URL}/api/v1/categories`,
      sectors: `${CMS_BASE_URL}/api/v1/sectors`,
      providers: `${CMS_BASE_URL}/api/v1/providers`,
      offerings: `${CMS_BASE_URL}/api/v1/offerings`,
    },
    timeouts: {
      defaultMs: 4000,
      bulkMs: 30000,
    },
    revalidateSeconds: 60,
  },
  frontend: {
    siteUrl: SITE_URL,
    revalidateEndpoint: "/api/revalidate",
  },
} as const;

export default API_CONFIG;
