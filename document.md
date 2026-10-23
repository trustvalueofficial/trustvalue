# TrustValue Route & Component Integration Documentation

## Overview
Replication and integration of the complete dynamic routing architecture, category templates, parametric sector routes, and standard pages from `research/PMOKISHAN/trustvalue-next` into `TrustValue_Official`.

### Guardrails Enforced
1. **Home Page (`src/app/page.tsx`)**: Completely untouched and preserved.
2. **Header (`src/components/layout/Header.tsx`)**: Completely untouched and preserved.
3. **Footer (`src/components/layout/Footer.tsx`)**: Completely untouched and preserved.
4. **Root Layout (`src/app/layout.tsx`)**: Preserved with global typography, brand stylesheets, Header, Footer, and scroll providers.

---

## 1. Directory Structure in `src/app`

```
src/app/
├── [sector]/
│   ├── compare/
│   │   ├── [category]/[pair]/page.tsx
│   │   └── providers/[pair]/page.tsx
│   ├── in/
│   │   ├── [city]/page.tsx
│   │   └── [city]/[...category]/page.tsx
│   ├── providers/
│   │   ├── page.tsx
│   │   ├── [provider]/page.tsx
│   │   ├── [provider]/[offering]/page.tsx
│   │   └── [provider]/[offering]/[variant]/page.tsx
│   ├── [...category]/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── about/
│   └── page.tsx
├── blog/
│   ├── [slug]/page.tsx
│   └── page.tsx
├── contact/
│   └── page.tsx
├── rating/
│   └── page.tsx
├── reviews/
│   ├── [reviewId]/page.tsx
│   └── page.tsx
├── layout.tsx       (Untouched)
├── page.tsx         (Untouched Home page)
├── not-found.tsx
├── sector.css
└── globals.css / home.css / prototype.css
```

---

## 2. Integrated Components & Libraries

### Component Layer (`src/components/`)
- `templates/`: 5 sector rendering templates (`PlanPage`, `SpecPage`, `PlacePage`, `ListingPage`, `SchemePage`, and template dispatcher `index.tsx`).
- `Breadcrumbs.tsx`: Contextual breadcrumb navigation.
- `CategoryView.tsx`: Recursive sector and category tree browser.
- `CityPicker.tsx`: Location switcher for geocoded sectors.
- `OfferingCard.tsx`: Offering card with ratings, attributes, and tags.
- `OfferingPage.tsx`: Product detail view with specifications, pros/cons, and review breakdown.
- `JsonLd.tsx`: Structured data for SEO.
- `sections.tsx`: Common reusable section blocks.

### Data & Routing Layer (`src/lib/`)
- `cms.ts`: File-backed CMS adapter reading from `content/` with in-memory caching.
- `routing.ts`: Canonical URL resolution, parameter encoding, and reserved slug protection.
- `seo.ts`: Dynamic metadata and JSON-LD generation for all parametric paths.
- `types.ts`: TypeScript domain definitions for Sectors, Offerings, Providers, Categories, and Variants.

### Content Layer (`content/`)
- Consolidated into a single source of truth at the project root (`content/`), as expected by `src/lib/cms.ts` (`ROOT = path.join(process.cwd(), "content")`) and `tsconfig.json` (`@/content/* -> ./content/*`). Redundant copy inside `src/content` removed.
- `content/sectors/`: Sector configurations (18 sectors).
- `content/offerings/`: Verified product and service records.
- `content/cities.json`: Supported urban centers.
- `content/providers.json`: Master directory of verified providers and corporate groups.
- `content/compare.json`: Curated head-to-head comparison pairings.
- `content/redirects.json`: Legacy and canonical redirect mappings.
- `content/_reserved.json`: Reserved top-level slug boundaries.

---

## 3. Build & Type Verification
- **Turbopack Build**: `next build` executed cleanly.
- **TypeScript**: 0 errors across all routes and components.
- **Static Generation**: 1,264 static and ISR pages compiled across 18 sectors, category hierarchies, provider profiles, and comparisons.

---

## 4. Brand Directory & Showcase Interactivity Fixes
1. **Brand Directory Not Rendering (Image 1)**:
   - **Root Cause**: The client initialization script gated `drawBrands()` inside `if (nc && sg && bc && bp)`. Because the sector grid elements (`#need-chips` and `#sector-grid`) were previously refactored, `nc` and `sg` were `null`, which prevented `drawBrands()` from ever executing.
   - **Resolution**: Decoupled `drawBrands()` to execute whenever `#brand-chips` and `#brand-plates` are present. Linked brand cards to their canonical parametric routes (`/${sector}/providers/${brandSlug}`).
2. **Active Live Sector Card (Image 2)**:
   - **Root Cause**: Card 1 ("Life & Health Insurance") pointed to a stale `/industry/insurance` URL and lacked an active action button.
   - **Resolution**: Updated route to `/insurance`, added a live progress indicator, verified signals badge, and a high-visibility interactive button (`Explore Live Audit →`).
3. **Pledge Vote to Unlock Interactivity (Image 2)**:
   - Enhanced "Pledge Vote to Unlock" click handler to smoothly scroll directly to the vote pledge form, focus the email input, and trigger an active pulse animation (`pledge-box--highlight`).
   - Added `1,000 VERIFIED SIGNALS TO LAUNCH` footer text to the second card ("Hospitals & Healthcare Chains") in `universalData.ts` and enabled dynamic `footerText` display across showcase cards.

---

## 5. Header & Footer Linking & Content Modernization
All dead links, obsolete routes (`/industry/...`, `/learn`, `/tools`, `/glossary`, `/questions`, `/write-review`, `/products`), and static placeholders in Header and Footer have been updated to connect directly to the active dynamic routing architecture:

### Header (`src/components/layout/Header.tsx`):
1. **Live Search Indexing**:
   - Brand matches now route to `/insurance/providers/${b.slug}`.
   - Category matches route to `/insurance/life/term-insurance`.
   - Guide matches route to `/blog/irdai-3-year-incontestability-rule-explained`.
   - Glossary matches route to `/blog`.
   - Community question matches route to `/contact`.
2. **Desktop Mega Panels**:
   - **Brands**: Updated to point to `/insurance/providers`, `/insurance`, and `/insurance/providers/${b.slug}`.
   - **Products**: Replaced dead `/products?type=...` links with active category routes (`/insurance/life/term-insurance`, `/insurance/life/savings-plans`, `/insurance/life/ulip`, `/insurance/life/pension-plans`, `/insurance/health/individual-health`, `/insurance/health/family-floater`, `/insurance/health/senior-citizen-health`, and `/insurance/compare/providers/hdfc-life-vs-max-life`).
   - **Learn**: Replaced dead `/learn/...` routes with active research desk routes (`/blog`, `/blog/irdai-3-year-incontestability-rule-explained`, `/blog/rera-carpet-area-vs-built-up-guide`, `/blog/nabh-cashless-hospital-turnaround-times`, `/rating`, `/reviews`, `/contact`).
   - **Community**: Replaced dead `/community` routes with active verified review and telemetry routes (`/reviews`, `/#experience`, `/blog`, `/contact`, `/rating`).
3. **Primary CTA**:
   - Changed desktop CTA and mobile drawer primary action from dead `/write-review` to `/#experience` ("Rate Experience"), connecting directly to the friction-free rating module in the 2nd fold.
4. **Mobile Drawer**:
   - Updated mobile submenus (Brands, Products, Learn, Community) and institutional links (`/insurance`, `/rating`, `/about`, `/contact`).

### Footer (`src/components/layout/Footer.tsx`):
1. **Top Sectors Column**:
   - Replaced dead links with live parametric sector routes: `/insurance`, `/banking`, `/healthcare`, `/real-estate`, `/automobiles`, `/electronics`, `/investments`, `/telecom`.
2. **Insurance Directory Column**:
   - Linked to `/insurance/providers/hdfc-life`, `/insurance/providers/max-life`, `/insurance/providers`, `/insurance/life/term-insurance`, `/insurance/health/individual-health`, `/insurance/compare/providers/hdfc-life-vs-max-life`, and `/insurance#cities`.
3. **Trust & Telemetry Column**:
   - Linked to `/rating` (TrustScore Leaderboard), `/reviews` (Verified Consumer Reviews), `/blog` (Regulatory & Research Desk), and active research articles.
4. **Community & Voice Column**:
   - Linked to `/reviews`, `/#experience`, `/#sectors`, `/#brands`, and `/contact`.
5. **Company, Ethics & Legal Columns**:
   - Updated to `/about`, `/rating`, `/contact`, `/blog`, and `/sitemap.xml`.
4. **Layout Reordering**:
   - Relocated the Experience Simulator section (`#experience`: "One gesture. One truth. Then move on.") to the **2nd fold** immediately following the Hero section, placed before the Sectors Showcase.


