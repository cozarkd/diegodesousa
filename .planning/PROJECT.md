# Portfolio Website — Diego de Sousa

## What This Is

Personal portfolio website for Diego de Sousa, a Full-Stack Developer & Product Designer based in Galicia, Spain. The site showcases projects, collaborations, and services across 4 languages (es, en, pt, gl). Built with Astro, Tailwind CSS, and a seasonal theming system.

## Core Value

The website must accurately represent Diego's current professional profile — Full-Stack Developer & Product Designer — so potential clients and collaborators immediately understand what he does and how to work with him.

## Requirements

### Validated

- ✓ Multi-language support (es, en, pt, gl) — existing
- ✓ Seasonal theming system — existing
- ✓ Dark mode toggle — existing
- ✓ Project showcase with content collections — existing
- ✓ Collaborations section with brand logos — existing
- ✓ Contact form via Web3Forms — existing
- ✓ SEO (sitemap, robots.txt, meta tags) — existing
- ✓ Responsive design with lazy loading — existing
- ✓ Hero section with portrait image — existing
- ✓ About section — existing
- ✓ Language switcher — existing
- ✓ SEO title and description with "Full-Stack Developer & Product Designer" positioning (all 4 languages) — v1.0
- ✓ Hero headline with new positioning and dual service offering (all 4 languages) — v1.0
- ✓ About section with design-first narrative, 10+ years experience, two service lines (all 4 languages) — v1.0
- ✓ Contact form help placeholder includes SaaS, applications, dashboards (all 4 languages) — v1.0

### Active

- [ ] Migrate Astro 4 → 5 with all Astro integrations (`@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/sitemap`)
- [ ] Migrate React 18 → 19 with type definitions
- [ ] Migrate Tailwind CSS 3 → 4 with ecosystem (`tailwind-merge`, `tailwind-scrollbar`)
- [ ] Migrate ESLint 8 → 10 with flat config and all plugins
- [ ] Migrate `postcss-preset-env` 9 → 11
- [ ] Migrate `zod` 3 → 4

### Out of Scope

- New features or functionality — migration only, no new capabilities
- Visual/design changes — site must look identical after migration
- Content changes — all i18n content preserved as-is
- New pages or sections — structural parity with pre-migration site

## Current Milestone: v2.0 Full Stack Migration

**Goal:** Migrate all major dependencies to their latest versions — Astro 5, React 19, Tailwind CSS 4, ESLint 10 — while preserving identical site functionality and appearance.

**Target features:**
- Astro 5 migration (Content Layer API, new integration versions)
- React 19 migration (new JSX transform, updated hooks)
- Tailwind CSS 4 migration (new engine, CSS-first config)
- ESLint 10 flat config migration (new plugin ecosystem)
- PostCSS and Zod major upgrades

## Context

The site is built with Astro 4.5.4 and uses a JSON-based i18n system. All user-facing text lives in 4 JSON files:
- `src/i18n/es.json` (Spanish — default/fallback)
- `src/i18n/en.json` (English)
- `src/i18n/pt.json` (Portuguese)
- `src/i18n/gl.json` (Galician)

The About section content is stored as HTML strings within these JSON files. The hero headline also uses HTML (with `<span>` and `<em>` tags).

Shipped v1.0 with profile content update across all 4 languages. All i18n files have 29 consistent key paths. Site builds successfully with 4 pages (/, /en/, /pt/, /gl/).

## Constraints

- **Tech stack**: Astro static site — no framework changes
- **i18n system**: Must update all 4 language files consistently
- **HTML in JSON**: About section and hero use inline HTML — must preserve correct HTML structure
- **Existing structure**: No changes to component files or page layout

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Spanish positioning "Desarrollador Full-Stack & Diseñador de Producto" | User wants Spanish-first positioning matching default site language | ✓ Good — clear, professional |
| Rewrite About from LinkedIn, not keep storytelling | User prefers professional tone based on LinkedIn summary over personal anecdotes | ✓ Good — design-first narrative reads naturally |
| Update all 4 languages at once | Consistency across all locales | ✓ Good — all 4 files consistent |
| Content update only, no structural changes | User explicitly chose minimal scope | ✓ Good — clean, focused update |
| European Portuguese "programador" not "desenvolvedor" | pt-PT convention for target market | ✓ Good — appropriate for European audience |
| Professional Galician with normativa orthography | Treat Galician as fully professional language | ✓ Good — carries regional authenticity |

---
*Last updated: 2026-02-10 after v2.0 milestone start*
