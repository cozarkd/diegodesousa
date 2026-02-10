# External Integrations

**Analysis Date:** 2026-02-10

## APIs & External Services

**Form Processing:**
- Web3Forms - Email form backend for contact form submissions
  - SDK/Client: Direct HTTPS API calls via browser fetch
  - Endpoint: `https://api.web3forms.com/submit`
  - Implementation: HTML form with hidden access_key field
  - Files: `src/components/ContactForm.astro`
  - Access Key: Embedded in form (hardcoded in markup - `45ee6310-e703-43b2-9fd5-530e8134cab1`)
  - Form Fields: name, email, DETALLES (message), PRESUPUESTO (budget), DEADLINE
  - Validation: Client-side form validation before submission
  - Response Handling: JSON response with success indicator and custom messages per locale

**Analytics:**
- Fathom Analytics - Privacy-focused website analytics
  - SDK/Client: astro-fathom package v2.0.0
  - Site ID: `PBVGUENI`
  - Implementation: Fathom component in `src/components/BaseHead.astro`
  - Status: Currently disabled (`enabled={false}`)
  - Domains: Configured for `diegodesousa.com`
  - Event Tracking: Form submission tracked via `fathom.trackEvent('form submit')` in `src/components/ContactForm.astro`
  - Files:
    - `src/components/BaseHead.astro` (initialization)
    - `src/components/ContactForm.astro` (event tracking)

## Data Storage

**Databases:**
- None detected - Static site with no persistent data storage

**File Storage:**
- Local filesystem only - Static assets served from `/public` directory
- Image assets:
  - WebP format images in `src/content/projects/` (project covers)
  - Static PNG/WebP images in `src/assets/`
  - Background images and seasonal assets in `/public/images/bgs/`
- Content Management: Markdown files with Astro Content Collections (`src/content/projects/`)
  - Multi-language support: `en/`, `es/`, `pt/`, `gl/` directories

**Caching:**
- Astro build-time caching - No runtime caching service
- Browser caching via static assets

## Authentication & Identity

**Auth Provider:**
- None detected - No user authentication system
- No login/session management
- Web3Forms access key embedded in form for public API endpoint

## Monitoring & Observability

**Error Tracking:**
- Fathom Analytics provides basic analytics (currently disabled)
- No dedicated error tracking service detected (Sentry, Rollbar, etc.)

**Logs:**
- GitHub Actions logs for automated seasonal updates
- No persistent application logging detected
- Runtime logs: Browser console only

## CI/CD & Deployment

**Hosting:**
- Static site hosting required
- Live at: `https://diegodesousa.com`
- Deployment-agnostic (works with Vercel, Netlify, GitHub Pages, etc.)

**CI Pipeline:**
- GitHub Actions - Automated seasonal style updates
  - Workflow: `.github/workflows/update.yml`
  - Triggers:
    - Scheduled cron jobs (season/holiday changes)
    - Manual workflow_dispatch trigger
  - Actions:
    1. Checkout repository
    2. Run `update_date.sh` bash script
    3. Auto-commit and push changes to current branch
  - Environment: ubuntu-latest
  - Permissions: Write access to repository contents

## Environment Configuration

**Required env vars:**
- None explicitly required for runtime
- GitHub Token: Automatically provided by GitHub Actions (`secrets.GITHUB_TOKEN`) for CI/CD

**Secrets location:**
- GitHub Actions secrets (if needed in future)
- Web3Forms access key: Currently hardcoded in `src/components/ContactForm.astro` (line 43)
  - Risk: Public exposure in source code
  - Recommendation: Move to environment variable

**Configuration files:**
- `site.config.ts` - Robots indexing configuration
- `astro.config.mjs` - Site URL, integrations, i18n setup
- `robots-txt.config.ts` - SEO robots.txt rules

## Webhooks & Callbacks

**Incoming:**
- Web3Forms callback - Contact form receives JSON response from Web3Forms API
- GitHub webhook - Triggers update workflow on schedule

**Outgoing:**
- Web3Forms API call - POST to `https://api.web3forms.com/submit` on form submission
- GitHub push - Automated commits via GitHub Actions (in `update_date.sh`)

## Content Management

**Content Collections:**
- Astro Content Collections with TypeScript schema validation
- Location: `src/content/config.ts` and `src/content/projects/`
- Collection: `projects` with schema:
  - `title` (required) - Project title
  - `description` (required) - Project description
  - `link` (optional) - Project URL
  - `video` (optional) - Video file reference
  - `cover` (optional) - Image asset with validation (min 300px width)
  - `tags` (required) - Array of tag objects with name, class, optional icon
  - `isDraft` (required) - Draft status flag
  - `github` (optional) - GitHub repository link
  - `language` (required) - Content language identifier

## International Configuration

**Localization:**
- I18N configuration in `astro.config.mjs`
- Supported locales: `es` (Spanish, default), `en` (English), `pt` (Portuguese), `gl` (Galician)
- Locale mapping:
  - `es` → `es-ES`
  - `en` → `en-US`
  - `pt` → `pt-PT`
  - `gl` → `gl-ES`
- Sitemap generation with locale awareness via `@astrojs/sitemap`
- Content files organized by language directories in `src/content/projects/`

## SEO & Discovery

**Sitemap:**
- Automatic generation via `@astrojs/sitemap` v3.1.6
- Filename: `sitemap-index.xml`
- Includes i18n locale metadata

**RSS Feed:**
- RSS feed generation via `@astrojs/rss` v4.0.1

**Robots.txt:**
- Generated via `astro-robots-txt` v1.0.0
- Configuration: `robots-txt.config.ts`
- Indexing: Controlled by `site.config.ts` (`disableIndexing` flag)
- Current status: Indexing enabled (`disableIndexing: false`)

---

*Integration audit: 2026-02-10*
