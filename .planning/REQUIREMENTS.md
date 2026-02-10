# Requirements: Portfolio Website — v2.0 Full Stack Migration

**Defined:** 2026-02-10
**Core Value:** The website must accurately represent Diego's current professional profile — Full-Stack Developer & Product Designer — so potential clients and collaborators immediately understand what he does and how to work with him.

## v2.0 Requirements

Requirements for major dependency migration. Each maps to roadmap phases.

### Schema Validation

- [ ] **ZOD-01**: Content collection schemas work with Zod 4 API (optional+default behavior, error handling)
- [ ] **ZOD-02**: All content entries load and validate correctly after Zod upgrade

### Core Framework

- [ ] **ASTRO-01**: Astro upgraded to v5 with Vite 6 build system
- [ ] **ASTRO-02**: Content collections migrated to Content Layer API
- [ ] **ASTRO-03**: All 4 locale pages build and render correctly (/, /en/, /pt/, /gl/)
- [ ] **ASTRO-04**: Integrations updated — @astrojs/mdx v4, @astrojs/react v4, @astrojs/sitemap v4+

### Styling System

- [ ] **TW-01**: Tailwind CSS 4 installed via @tailwindcss/vite plugin (replacing @astrojs/tailwind integration)
- [ ] **TW-02**: All utility classes migrated (shadow, blur, rounded, ring, opacity, important modifier, CSS variable syntax)
- [ ] **TW-03**: Seasonal theming system (spring, summer, autumn, winter) works in Tailwind 4
- [ ] **TW-04**: Dark mode functions correctly with Tailwind 4
- [ ] **TW-05**: tailwind-merge and tailwind-scrollbar updated to Tailwind 4 compatible versions

### Linting

- [ ] **LINT-01**: ESLint 10 with mandatory flat config (eslint.config.js replacing .eslintrc.cjs)
- [ ] **LINT-02**: All plugins updated to flat-config-compatible versions (@typescript-eslint v8, eslint-plugin-astro v1, import, jsx-a11y, n, promise)
- [ ] **LINT-03**: All file types linted correctly including .ts, .tsx, .astro, and dotfiles

### UI Framework

- [ ] **REACT-01**: React 19 and react-dom 19 installed with @types/react v19 and @types/react-dom v19
- [ ] **REACT-02**: Radix UI components functional (Dialog, DropdownMenu, Label) — updated before React upgrade
- [ ] **REACT-03**: No infinite loops, ref callback issues, or console errors in React islands

### PostCSS

- [ ] **PCSS-01**: postcss-preset-env upgraded to v11 with correct CSS processing

## Future Requirements

None — this milestone is a complete dependency migration with no feature additions.

## Out of Scope

| Feature | Reason |
|---------|--------|
| New features or pages | Migration only — functional parity with pre-migration site |
| Visual/design changes | Site must look identical after migration |
| Content changes | All i18n content preserved as-is |
| Performance optimization beyond framework defaults | Capture gains from new versions, but don't add custom optimizations |
| Automated visual regression testing setup | Would be nice, but not required for migration success |
| CI/CD pipeline changes | Out of scope for this milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ZOD-01 | Phase 2 | Pending |
| ZOD-02 | Phase 2 | Pending |
| ASTRO-01 | Phase 3 | Pending |
| ASTRO-02 | Phase 3 | Pending |
| ASTRO-03 | Phase 3 | Pending |
| ASTRO-04 | Phase 3 | Pending |
| TW-01 | Phase 4 | Pending |
| TW-02 | Phase 4 | Pending |
| TW-03 | Phase 4 | Pending |
| TW-04 | Phase 4 | Pending |
| TW-05 | Phase 4 | Pending |
| LINT-01 | Phase 4 | Pending |
| LINT-02 | Phase 4 | Pending |
| LINT-03 | Phase 4 | Pending |
| REACT-01 | Phase 5 | Pending |
| REACT-02 | Phase 5 | Pending |
| REACT-03 | Phase 5 | Pending |
| PCSS-01 | Phase 5 | Pending |

**Coverage:**
- v2.0 requirements: 18 total
- Mapped to phases: 18/18 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-02-10*
*Last updated: 2026-02-10 after roadmap creation*
