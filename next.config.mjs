/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce consistent URLs without duplicate trailing slash versions
  trailingSlash: false,

  // Permanent 301 redirects for shortcuts, legacy routes, and policy anchors
  async redirects() {
    return [
      {
        source: "/termsandcondition/:slug(terms-of-use|review-policy|trustscore-methodology|grievances-corrections|privacy-notice|sources-editorial)",
        destination: "/termsandcondition",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/termsAndcondition",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/termsAndcondition#level-6",
        permanent: true,
      },
      {
        source: "/methodology",
        destination: "/rating",
        permanent: true,
      },
      {
        source: "/constitution",
        destination: "/termsAndcondition#level-1",
        permanent: true,
      },
      {
        source: "/for-business",
        destination: "/contact",
        permanent: false,
      },
    ];
  },

  // Security headers for production hardening (CSP, HSTS, frame protection)
  async headers() {
    const isProd = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production";
    
    // Only apply noindex on non-production staging/preview environments
    const headers = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
    ];

    if (!isProd && process.env.VERCEL_ENV === "preview") {
      headers.push({
        key: "X-Robots-Tag",
        value: "noindex, nofollow",
      });
    }

    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
};

export default nextConfig;
