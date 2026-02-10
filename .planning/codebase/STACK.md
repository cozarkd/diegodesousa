# Technology Stack

**Analysis Date:** 2026-02-10

## Languages

**Primary:**
- TypeScript 5.3.3 - Type-safe JavaScript used throughout components and configuration files
- JavaScript (ES Module) - Build configuration and build scripts

**Secondary:**
- HTML5 - Template markup in Astro components
- CSS3 - Styling via Tailwind CSS and PostCSS
- Bash - Build and update automation scripts (`update_date.sh`)

## Runtime

**Environment:**
- Node.js (version not explicitly pinned, requires pnpm compatible version)
- PNPM package manager - Used for dependency management (lockfile: `pnpm-lock.yaml`)

**Package Manager:**
- pnpm 9.0+ (based on lockfileVersion 9.0 in `pnpm-lock.yaml`)
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- Astro 4.5.4 - Meta-framework for static site generation and component-based architecture
- React 18.2.0 - UI library for interactive components (integrated via `@astrojs/react`)

**Integrations:**
- @astrojs/mdx 2.0.3 - Markdown with JSX support for content pages
- @astrojs/sitemap 3.1.6 - Automatic sitemap generation for SEO
- @astrojs/rss 4.0.1 - RSS feed generation
- @astrojs/check 0.3.4 - Astro type-checking utility
- astro-robots-txt 1.0.0 - Robots.txt generation from configuration
- astro-navbar 2.3.3 - Navigation bar component
- astro-fathom 2.0.0 - Fathom Analytics integration

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- @astrojs/tailwind 5.1.0 - Astro integration for Tailwind
- tailwindcss-animate 1.0.7 - Animation utilities for Tailwind
- tailwind-merge 2.2.2 - Smart Tailwind class merging utility
- tailwind-scrollbar 3.1.0 - Scrollbar styling plugin
- autoprefixer 10.4.17 - CSS vendor prefix automation
- tailwindcss/nesting - Native nesting support in Tailwind
- PostCSS 8.4+ - CSS transformation tool

**UI Components:**
- @radix-ui/react-dialog 1.0.5 - Accessible dialog component
- @radix-ui/react-dropdown-menu 2.0.6 - Dropdown menu component
- @radix-ui/react-label 2.0.2 - Form label component
- @radix-ui/react-slot 1.0.2 - Radix UI slot utility
- class-variance-authority 0.7.0 - Type-safe component class management
- lucide-react 0.323.0 - Icon library for React

**Development:**
- TypeScript ESLint support - `@typescript-eslint/parser` 6.21.0
- Prettier 3.2.5 - Code formatter with plugins:
  - prettier-plugin-astro 0.13.0
  - prettier-plugin-tailwindcss 0.5.13
  - prettier-plugin-css-order 2.0.1
  - prettier-config-standard 7.0.0

**Type Safety:**
- zod 3.23.8 - Runtime schema validation for content collections

**Animation & Interaction:**
- gsap 3.12.5 - JavaScript animation library
- lozad 1.16.0 - Lightweight lazy loader for images and iframes

**Fonts:**
- @fontsource-variable/recursive 5.0.16 - Variable font (Recursive) for typography

**Image Processing:**
- sharp 0.33.4 - High-performance image processing library

**Utilities:**
- clsx 2.1.0 - Utility for combining CSS class names

## Configuration

**Environment:**
- Configuration via TypeScript files:
  - `site.config.ts` - Site-wide configuration (indexing, robots settings)
  - `robots-txt.config.ts` - Robots.txt rules
  - `astro.config.mjs` - Astro framework configuration
- No .env file for secrets (integrations using public configs only)

**Build:**
- Build config files:
  - `astro.config.mjs` - Framework configuration with i18n (4 locales: es, en, pt, gl), integrations, and Vite CSS settings
  - `tsconfig.json` - TypeScript compiler options with path alias `@/*` → `./src/*`
  - `tailwind.config.cjs` - Tailwind theming, dark mode (class-based), custom plugins
  - `postcss.config.cjs` - PostCSS plugins (preset-env stage 2, autoprefixer)
  - `prettier.config.cjs` - Code formatting rules for Astro, Tailwind, and CSS
  - `.eslintrc.cjs` - ESLint configuration with Astro support and JSX a11y rules
  - `.editorconfig` - Editor configuration for consistent formatting
  - `jsconfig.json` - JavaScript config with path aliases

**Server:**
- Dev server port: 4321 (configured in `astro.config.mjs`)
- Vite configuration with PostCSS nesting support

## Platform Requirements

**Development:**
- Node.js (compatible with pnpm v9.0+)
- pnpm package manager
- Git (for version control and automated updates)
- Bash shell (for update automation scripts)

**Production:**
- Static site hosting (no runtime server required)
- Deployment target: `https://diegodesousa.com`
- Supports SEO with sitemap, robots.txt, canonical URLs
- Compatible with any static hosting (Vercel, Netlify, GitHub Pages, etc.)

## Scripts

**Development:**
```bash
npm run dev          # Start development server on port 4321
npm start            # Alias for dev
```

**Build:**
```bash
npm run build        # Type-check with astro check, then build for production
npm run preview      # Preview production build locally
npm run astro        # Run Astro CLI commands
npm run lint         # Format code with Prettier and lint with ESLint
```

## Seasonal/Automated Features

**Scheduling:**
- Automated seasonal style updates via GitHub Actions
- Cron jobs trigger on season/holiday changes (Christmas, Winter, Spring, Summer, Autumn, Halloween)
- Updates managed by `update_date.sh` and `.github/workflows/update.yml`

---

*Stack analysis: 2026-02-10*
