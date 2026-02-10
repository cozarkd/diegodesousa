---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - pnpm-lock.yaml
autonomous: true

must_haves:
  truths:
    - "All safe (same-major) dependencies are updated to their latest versions"
    - "No major-version (breaking) dependencies are changed"
    - "The site builds successfully with `pnpm build` after updates"
    - "The lockfile is consistent and committed"
  artifacts:
    - path: "package.json"
      provides: "Updated dependency version ranges"
    - path: "pnpm-lock.yaml"
      provides: "Locked resolved versions matching updated ranges"
  key_links:
    - from: "package.json"
      to: "pnpm-lock.yaml"
      via: "pnpm install resolves and locks versions"
      pattern: "pnpm install"
---

<objective>
Update all project dependencies that have minor or patch updates available (same major version) and verify the site still builds correctly.

Purpose: Keep the project secure and current without introducing breaking changes. Major version upgrades (Astro 4->5, React 18->19, Tailwind 3->4, ESLint 8->10, etc.) are explicitly excluded — those require dedicated migration plans.

Output: Updated package.json, pnpm-lock.yaml, and a verified clean build.
</objective>

<execution_context>
@/Users/mini/.claude/get-shit-done/workflows/execute-plan.md
@/Users/mini/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@package.json
@astro.config.mjs
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update safe dependencies (minor/patch only)</name>
  <files>package.json, pnpm-lock.yaml</files>
  <action>
Update all dependencies that have newer versions within the same major version. These are the safe updates to apply:

**Dependencies (production):**
- @astrojs/check: 0.3.4 -> 0.9.6 (pre-1.0, but same 0.x line — update range to ^0.9.6)
- @astrojs/rss: 4.0.5 -> 4.0.15 (patch)
- @astrojs/sitemap: 3.1.6 -> 3.7.0 (minor)
- @fontsource-variable/recursive: 5.0.17 -> 5.2.8 (minor)
- @radix-ui/react-dialog: 1.0.5 -> 1.1.15 (minor)
- @radix-ui/react-dropdown-menu: 2.0.6 -> 2.1.16 (minor)
- @radix-ui/react-label: 2.0.2 -> 2.1.8 (minor)
- @radix-ui/react-slot: 1.0.2 -> 1.2.4 (minor)
- astro-navbar: 2.3.3 -> 2.4.0 (minor)
- autoprefixer: 10.4.19 -> 10.4.24 (patch)
- class-variance-authority: 0.7.0 -> 0.7.1 (patch)
- clsx: 2.1.0 -> 2.1.1 (patch)
- gsap: 3.12.5 -> 3.14.2 (minor)
- lucide-react: 0.323.0 -> 0.563.0 (pre-1.0 minor — update range to ^0.563.0)
- sharp: 0.33.4 -> 0.34.5 (pre-1.0 minor — update range to ^0.34.5)
- typescript: 5.4.3 -> 5.9.3 (minor)

**DevDependencies:**
- eslint-plugin-import: 2.29.1 -> 2.32.0 (minor)
- eslint-plugin-jsx-a11y: 6.8.0 -> 6.10.2 (minor)
- postcss-import: 16.1.0 -> 16.1.1 (patch)
- prettier: 3.2.5 -> 3.8.1 (minor)
- prettier-plugin-astro: 0.13.0 -> 0.14.1 (pre-1.0 minor — update range to ^0.14.1)
- prettier-plugin-css-order: 2.1.1 -> 2.2.0 (minor)
- prettier-plugin-tailwindcss: 0.5.13 -> 0.7.2 (pre-1.0 minor — update range to ^0.7.2)

**IMPORTANT — Do NOT update these (major version bumps, breaking changes):**
- astro (4.x -> 5.x) — requires migration guide
- @astrojs/mdx (2.x -> 4.x) — tied to Astro 5
- @astrojs/react (3.x -> 4.x) — tied to Astro 5
- @astrojs/tailwind (5.x -> 6.x) — tied to Astro 5
- react / react-dom (18.x -> 19.x) — breaking API changes
- @types/react / @types/react-dom (18.x -> 19.x) — tied to React 19
- tailwindcss (3.x -> 4.x) — complete architecture change
- tailwind-merge (2.x -> 3.x) — tied to Tailwind 4
- tailwind-scrollbar (3.x -> 4.x) — tied to Tailwind 4
- eslint (8.x -> 10.x) — flat config migration
- @typescript-eslint/parser (6.x -> 8.x) — tied to ESLint 9+
- eslint-plugin-astro (0.31.x -> 1.x) — tied to ESLint 9+
- eslint-plugin-n (16.x -> 17.x) — tied to ESLint 9+
- eslint-plugin-promise (6.x -> 7.x) — tied to ESLint 9+
- postcss-preset-env (9.x -> 11.x) — major changes
- zod (3.x -> 4.x) — breaking API changes

**Approach:**
1. Update the version ranges in package.json for all safe packages listed above
2. For pre-1.0 packages (sharp, lucide-react, @astrojs/check, prettier-plugin-astro, prettier-plugin-tailwindcss), update the caret range to the new minor since semver treats 0.x minors as potentially breaking — but these are well-established packages where minor bumps are safe
3. Run `pnpm install` to resolve and lock the new versions
4. If any peer dependency conflicts arise, resolve by keeping the conflicting package at its current version
  </action>
  <verify>
Run `pnpm install` completes without errors. Run `pnpm outdated` and confirm only major-version packages remain listed as outdated.
  </verify>
  <done>All same-major dependencies updated in package.json, pnpm-lock.yaml regenerated cleanly with no peer dependency errors.</done>
</task>

<task type="auto">
  <name>Task 2: Verify build and type-check pass</name>
  <files>package.json</files>
  <action>
Run the full build pipeline to confirm no regressions from the dependency updates:

1. Run `pnpm build` (which runs `astro check && astro build` per the scripts)
   - `astro check` validates TypeScript types across all .astro files
   - `astro build` produces the static site in dist/
2. Verify all 4 pages build: /, /en/, /pt/, /gl/
3. Verify image optimization completes (7 images)
4. Verify sitemap and robots.txt generation

If the build fails:
- Read the error output carefully
- If a specific updated package causes the issue, revert ONLY that package to its previous version in package.json and re-run `pnpm install`
- Re-run the build to confirm the fix
- Document which package was reverted and why in the summary

The build should complete in under 5 seconds (baseline: 1.47s).
  </action>
  <verify>
`pnpm build` exits with code 0. Output contains "4 page(s) built", "sitemap-index.xml created", and "robots.txt is created".
  </verify>
  <done>Site builds successfully with all updated dependencies. 4 pages generated, images optimized, sitemap and robots.txt present. No TypeScript errors.</done>
</task>

</tasks>

<verification>
- `pnpm outdated` shows only major-version packages (astro 5, react 19, tailwind 4, eslint 10, etc.)
- `pnpm build` succeeds with 0 exit code
- All 4 locale pages built: /, /en/, /pt/, /gl/
- No TypeScript type errors from `astro check`
- Git diff shows only package.json and pnpm-lock.yaml changed
</verification>

<success_criteria>
All minor/patch dependency updates applied. Build passes. No functionality regressions. Major version upgrades explicitly deferred for dedicated migration plans.
</success_criteria>

<output>
After completion, create `.planning/quick/1-safely-update-project-dependencies/1-SUMMARY.md`
</output>
