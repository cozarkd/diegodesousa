# Portfolio Website — Diego de Sousa

## What This Is

Personal portfolio website for Diego de Sousa, a Full-Stack Developer & Product Designer based in Galicia, Spain. The site showcases projects, collaborations, and services across 4 languages (es, en, pt, gl). Built with Astro 5, React 19, Tailwind CSS 4, and a seasonal theming system.

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
- ✓ Astro 5 with Vite 6 build system and Content Layer API — v2.0
- ✓ React 19 with @astrojs/react integration and Radix UI compatibility — v2.0
- ✓ Tailwind CSS 4 with @tailwindcss/vite plugin and CSS-first @theme configuration — v2.0
- ✓ ESLint 10 with flat config (eslint.config.js) and updated plugins — v2.0
- ✓ Zod 4 with verified content collection schema compatibility — v2.0
- ✓ postcss-preset-env v11 with correct plugin invocation — v2.0
- ✓ Seasonal theming migrated to client-side CSS custom properties (6 themes, light/dark) — v2.0
- ✓ All 4 locale pages build and render correctly after full migration — v2.0
- ✓ All 18 migration requirements satisfied with zero visual regressions — v2.0

### Active

(None — start next milestone to define new requirements)

### Out of Scope

- Mobile native app — web-first approach, PWA works well
- Video chat integration — use external tools
- Offline mode — static site serves from CDN
- New features beyond current functionality — migration milestone completed feature parity

## Context

Shipped v2.0 with 2,580 LOC across Astro, TypeScript, and CSS.

**Tech stack (current):**
- Astro 5.17.1 with Vite 6
- React 19.2.4 with @astrojs/react 4.4.2
- Tailwind CSS 4.1.18 with @tailwindcss/vite plugin
- ESLint 10.0.0 with flat config
- Zod 4.3.6
- postcss-preset-env 11.1.3
- Content Layer API with glob loader
- Seasonal theming via CSS custom properties (6 themes, light/dark)

**Known tech debt:**
- 9 ESLint errors in existing code (pre-existing, accepted)
- ESLint plugin peer dependency warnings (transitional)
- Redundant autoprefixer package (safety measure)
- ViewTransitions deprecation warnings (pre-existing)

## Constraints

- **Tech stack**: Astro static site — no framework changes
- **i18n system**: Must update all 4 language files consistently
- **HTML in JSON**: About section and hero use inline HTML — must preserve correct HTML structure
- **Existing structure**: No changes to component files or page layout

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Spanish positioning "Desarrollador Full-Stack & Diseñador de Producto" | User wants Spanish-first positioning matching default site language | ✓ Good |
| Rewrite About from LinkedIn, not keep storytelling | User prefers professional tone based on LinkedIn summary | ✓ Good |
| Update all 4 languages at once | Consistency across all locales | ✓ Good |
| Content update only, no structural changes | User explicitly chose minimal scope | ✓ Good |
| European Portuguese "programador" not "desenvolvedor" | pt-PT convention for target market | ✓ Good |
| Professional Galician with normativa orthography | Treat Galician as fully professional language | ✓ Good |
| v2.0 migration order: Zod → Astro → (Tailwind ‖ ESLint) → React | Content collections depend on Zod, Astro controls React version, styling/linting independent | ✓ Good — prevented cascade failures |
| Phase compression: 4 phases instead of 6 | Quick depth favors aggressive compression, Tailwind/ESLint independent, PostCSS trivial | ✓ Good — efficient execution |
| Content Layer API full migration (not legacy flag) | 5x faster Markdown builds, glob loader processes all locales correctly | ✓ Good — better performance |
| Seasonal theming via client-side CSS custom properties | Tailwind 4 changed plugin API; CSS vars more flexible, eliminates cron rebuild | ✓ Good — more maintainable |
| Tailwind CSS 4 CSS-first @theme directive | Vite plugin provides 100x+ faster incremental builds, native nesting | ✓ Good — modern architecture |
| ESLint 10 flat config | Mandatory in ESLint 10, better multi-file-type support | ✓ Good — standard approach |
| Keep autoprefixer despite postcss-preset-env v11 redundancy | Low risk, avoids breaking if other configs reference it | — Pending review |

---
*Last updated: 2026-02-10 after v2.0 milestone*
