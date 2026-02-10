# Portfolio Website — Profile Update

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

### Active

- [ ] Update SEO title and description to reflect "Full-Stack Developer & Product Designer" role (all 4 languages)
- [ ] Update hero headline from "desarrollador frontend" to "Desarrollador Full-Stack & Diseñador de Producto" positioning (all 4 languages)
- [ ] Rewrite About section based on LinkedIn summary — professional tone, covering full-stack + product design dual focus, 10+ years experience, two service lines (all 4 languages)
- [ ] Update contact form help placeholder to include SaaS, apps, dashboards alongside web development (all 4 languages)

### Out of Scope

- Structural/layout changes — content update only
- New sections or pages — keeping existing structure
- Design/visual changes — no CSS or component modifications
- Project content updates — only updating profile-related text
- New features or functionality — purely textual changes

## Context

The site is built with Astro 4.5.4 and uses a JSON-based i18n system. All user-facing text lives in 4 JSON files:
- `src/i18n/es.json` (Spanish — default/fallback)
- `src/i18n/en.json` (English)
- `src/i18n/pt.json` (Portuguese)
- `src/i18n/gl.json` (Galician)

The About section content is stored as HTML strings within these JSON files. The hero headline also uses HTML (with `<span>` and `<em>` tags).

Diego's new LinkedIn profile emphasizes:
- "Full-Stack Developer & Product Designer"
- Two service lines: high-performance websites (Astro/Next.js) AND SaaS products (Next.js + Supabase + Stripe + OpenAI)
- 10+ years designing and developing digital products
- Design systems, accessibility (WCAG AA+), documentation
- Based in Galicia, freelance, open to remote collaborations

## Constraints

- **Tech stack**: Astro static site — no framework changes
- **i18n system**: Must update all 4 language files consistently
- **HTML in JSON**: About section and hero use inline HTML — must preserve correct HTML structure
- **Existing structure**: No changes to component files or page layout

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Spanish positioning "Desarrollador Full-Stack & Diseñador de Producto" | User wants Spanish-first positioning matching default site language | — Pending |
| Rewrite About from LinkedIn, not keep storytelling | User prefers professional tone based on LinkedIn summary over personal anecdotes | — Pending |
| Update all 4 languages at once | Consistency across all locales | — Pending |
| Content update only, no structural changes | User explicitly chose minimal scope | — Pending |

---
*Last updated: 2026-02-10 after initialization*
