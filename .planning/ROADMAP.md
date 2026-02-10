# Roadmap: Portfolio Website

## Milestones

- ✅ **v1.0 Portfolio Profile Update** — Phase 1 (shipped 2026-02-10)
- 🚧 **v2.0 Full Stack Migration** — Phases 2-5 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

<details>
<summary>✅ v1.0 Portfolio Profile Update (Phase 1) — SHIPPED 2026-02-10</summary>

- [x] Phase 1: Profile Content Update (2/2 plans) — completed 2026-02-10

</details>

---

## 🚧 v2.0 Full Stack Migration (Phases 2-5)

**Goal:** Migrate all major dependencies to their latest versions — Astro 5, React 19, Tailwind CSS 4, ESLint 10 — while preserving identical site functionality and appearance.

**Depth:** Quick (4 phases, aggressive compression)

### Phase 2: Zod 4 Migration

**Goal:** Content collection schemas work correctly with Zod 4 API

**Dependencies:** None (blocks Phase 3)

**Requirements:**
- ZOD-01: Content collection schemas work with Zod 4 API (optional+default behavior, error handling)
- ZOD-02: All content entries load and validate correctly after Zod upgrade

**Success Criteria:**
1. All content collections load without schema validation errors
2. Content entry validation produces expected output structure
3. Type checking passes for all schema definitions
4. Error messages display correctly when invalid data is encountered

**Plans:** 1 plan

Plans:
- [x] 02-01-PLAN.md — Upgrade Zod to v4 and verify content collections

**Status:** ✓ Complete | **Completed:** 2026-02-10

---

### Phase 3: Astro 5 Upgrade

**Goal:** Site builds and renders on Astro 5 with Content Layer API

**Dependencies:** Phase 2 (requires Zod 4 stable)

**Requirements:**
- ASTRO-01: Astro upgraded to v5 with Vite 6 build system
- ASTRO-02: Content collections migrated to Content Layer API
- ASTRO-03: All 4 locale pages build and render correctly (/, /en/, /pt/, /gl/)
- ASTRO-04: Integrations updated — @astrojs/mdx v4, @astrojs/react v4, @astrojs/sitemap v4+

**Success Criteria:**
1. All 4 locale pages render correctly without errors (es, en, pt, gl)
2. Content collections return expected data in deterministic sort order
3. Type checking passes with `astro check`
4. Dev server hot module reload works correctly
5. Contact form submits and redirects correctly

**Status:** Pending | **Effort:** 4-6 hours

---

### Phase 4: Styling & Linting Modernization

**Goal:** Site uses Tailwind CSS 4 and ESLint 10 with identical visual output

**Dependencies:** Phase 3 (Tailwind benefits from Vite 6)

**Requirements:**
- TW-01: Tailwind CSS 4 installed via @tailwindcss/vite plugin (replacing @astrojs/tailwind integration)
- TW-02: All utility classes migrated (shadow, blur, rounded, ring, opacity, important modifier, CSS variable syntax)
- TW-03: Seasonal theming system (spring, summer, autumn, winter) works in Tailwind 4
- TW-04: Dark mode functions correctly with Tailwind 4
- TW-05: tailwind-merge and tailwind-scrollbar updated to Tailwind 4 compatible versions
- LINT-01: ESLint 10 with mandatory flat config (eslint.config.js replacing .eslintrc.cjs)
- LINT-02: All plugins updated to flat-config-compatible versions (@typescript-eslint v8, eslint-plugin-astro v1, import, jsx-a11y, n, promise)
- LINT-03: All file types linted correctly including .ts, .tsx, .astro, and dotfiles

**Success Criteria:**
1. All pages render with visually identical styles in production build
2. All 4 seasonal themes display correctly (spring, summer, autumn, winter)
3. Dark mode toggle works correctly across all themes
4. Custom scrollbar styles apply correctly
5. ESLint passes for all file types including TypeScript, Astro, and dotfiles
6. Production build includes all Tailwind classes (no silent disappearances)

**Status:** Pending | **Effort:** 6-9 hours

---

### Phase 5: React 19 & PostCSS Upgrade

**Goal:** React islands work with React 19 and modern PostCSS

**Dependencies:** Phase 3 (requires Astro 5 integration)

**Requirements:**
- REACT-01: React 19 and react-dom 19 installed with @types/react v19 and @types/react-dom v19
- REACT-02: Radix UI components functional (Dialog, DropdownMenu, Label) — updated before React upgrade
- REACT-03: No infinite loops, ref callback issues, or console errors in React islands
- PCSS-01: postcss-preset-env upgraded to v11 with correct CSS processing

**Success Criteria:**
1. All React islands render correctly without errors
2. Radix UI components work correctly (dialogs open/close, dropdowns function)
3. No infinite loop errors in browser console
4. Type checking passes for all React components
5. Modern CSS features process correctly through PostCSS

**Status:** Pending | **Effort:** 3-4 hours

---

## Progress

| Phase | Milestone | Status | Requirements | Completed |
|-------|-----------|--------|--------------|-----------|
| 1. Profile Content Update | v1.0 | ✓ Complete | — | 2026-02-10 |
| 2. Zod 4 Migration | v2.0 | ✓ Complete | ZOD-01, ZOD-02 | 2/2 |
| 3. Astro 5 Upgrade | v2.0 | Pending | ASTRO-01, ASTRO-02, ASTRO-03, ASTRO-04 | 0/4 |
| 4. Styling & Linting Modernization | v2.0 | Pending | TW-01–05, LINT-01–03 | 0/8 |
| 5. React 19 & PostCSS Upgrade | v2.0 | Pending | REACT-01, REACT-02, REACT-03, PCSS-01 | 0/4 |

**v2.0 Progress:** 2/18 requirements completed (11%)

## Critical Dependencies

```
Phase 2 (Zod 4) → Phase 3 (Astro 5) → Phase 4 (Styling & Linting)
                                    → Phase 5 (React 19 & PostCSS)
```

Phase 4 and Phase 5 are independent of each other but both depend on Phase 3.

## Next Steps

1. Plan Phase 3: Astro 5 Upgrade
2. Run `/gsd:plan-phase 3` to create detailed execution plan
3. Follow critical dependency path through remaining phases

---
*Roadmap created: 2026-02-10*
*Last updated: 2026-02-10 after Phase 2 execution complete*
