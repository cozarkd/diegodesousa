---
phase: 04-styling-linting-modernization
plan: 02
subsystem: tooling
tags: [eslint, linting, typescript, astro, flat-config]

# Dependency graph
requires:
  - phase: 03-astro-5-upgrade
    provides: Astro 5 with updated tooling ecosystem
provides:
  - ESLint 10 with native flat config for all file types (.ts, .tsx, .astro)
  - @typescript-eslint v8 for modern TypeScript linting
  - eslint-plugin-astro v1 with flat config support
affects: [05-react-19-upgrade, future-feature-development]

# Tech tracking
tech-stack:
  added:
    - eslint@10.0.0
    - @typescript-eslint/parser@8.55.0
    - @typescript-eslint/eslint-plugin@8.55.0
    - eslint-plugin-astro@1.5.0
    - astro-eslint-parser@1.2.2
    - eslint-plugin-n@17.23.2
    - eslint-plugin-promise@7.2.1
  patterns:
    - ESLint flat config pattern for multi-file-type projects
    - Native ESM imports for plugin configuration
    - Dotfile exclusion in linting

key-files:
  created:
    - eslint.config.js
  modified:
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Native flat config over FlatCompat backwards-compatibility layer"
  - "Accepted plugin peer dependency warnings with ESLint 10"
  - "No type-aware linting to avoid performance penalties"
  - "Explicit dotfile ignores to maintain current behavior"
  - "Existing code linting issues accepted as per plan goals"

patterns-established:
  - "Flat config structure: global ignores → TypeScript files → Astro plugin spreads → JSX accessibility"
  - "No type-aware linting (no parserOptions.project) for performance and scope reasons"
  - "Existing code issues accepted as per plan goals (ESLint runs, not zero warnings)"

# Metrics
duration: 5min
completed: 2026-02-10
---

# Phase 04 Plan 02: ESLint 10 Flat Config Migration Summary

**ESLint 10 with native flat config for TypeScript, Astro, and JSX files using @typescript-eslint v8 and eslint-plugin-astro v1**

## Performance

- **Duration:** 5 min 20 sec (320 seconds)
- **Started:** 2026-02-10T16:34:30Z
- **Completed:** 2026-02-10T16:39:51Z
- **Tasks:** 1
- **Files modified:** 5 (3 ESLint configs, 2 package files)

## Accomplishments
- Upgraded ESLint from 8.57.0 to 10.0.0 with mandatory flat config
- Upgraded all plugins to flat-config-compatible versions (@typescript-eslint v8, eslint-plugin-astro v1)
- Created native ESLint flat config without backwards-compatibility shims
- Removed legacy .eslintrc.cjs, .eslintignore, and eslint-config-standard
- Verified linting works correctly for all file types (.ts, .astro, .js)

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade ESLint and plugins, convert to flat config** - `feee2bf` (feat)
   - Upgraded ESLint and 9 plugins to flat-config-compatible versions
   - Removed unnecessary eslint-config-standard
   - Created native ESLint flat config with TypeScript, Astro, import, jsx-a11y, n, promise plugins
   - Configured TypeScript, Astro, and JSX accessibility rules
   - Added dotfile ignores to maintain current behavior
   - Deleted legacy .eslintrc.cjs and .eslintignore
   - Verified ESLint v10.0.0 runs on all file types

## Files Created/Modified
- `eslint.config.js` - Native ESLint 10 flat config with TypeScript, Astro, import, jsx-a11y, n, promise plugins
- `package.json` - Updated ESLint and plugin versions to flat-config-compatible releases
- `pnpm-lock.yaml` - Lock file with new dependency versions
- `.eslintrc.cjs` - DELETED (legacy config)
- `.eslintignore` - DELETED (replaced by ignores in flat config)

## Decisions Made

**Native flat config over FlatCompat:** Wrote a native flat config using ESM imports and plugin spreads instead of using FlatCompat backwards-compatibility layer for cleaner, ESM-native configuration.

**Accepted plugin peer dependency warnings:** ESLint 10 just released, so plugins like @typescript-eslint (requiring ^8.57.0 || ^9.0.0) show warnings with v10. All plugins work correctly despite warnings - transitional state until plugins update peer dependencies.

**No type-aware linting:** Did not set `parserOptions.project: './tsconfig.json'` to avoid performance penalties and scope issues with config files outside tsconfig. Current codebase doesn't use type-aware rules.

**Explicit dotfile ignores:** ESLint 10 flat config lints dotfiles by default. Added `'**/.*'` to ignores to maintain current behavior where files like `.editorconfig` are not linted.

**Existing code issues accepted:** ESLint found errors in existing code (logical AND expressions for side effects in Astro components). Per plan goals, these are acceptable - objective is "ESLint runs successfully, not zero warnings."

## Deviations from Plan

None - plan executed exactly as written. Automated migration tool was considered but native flat config written directly for cleaner result.

## Issues Encountered

None - migration proceeded smoothly. Plugin peer dependency warnings are expected and do not affect functionality.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

ESLint 10 flat config fully operational. Ready to proceed with remaining Phase 4 plans:
- Plan 04-01: Tailwind CSS 4 migration (separate parallel track)
- Plan 04-03: Verification of both Tailwind and ESLint migrations

No blockers. All verification criteria passed:
- ESLint v10.0.0 installed and runs without config errors
- TypeScript files linted with @typescript-eslint v8.55.0 rules
- Astro files linted with eslint-plugin-astro v1.5.0 recommended rules
- JSX accessibility rules configured for React components
- Legacy .eslintrc.cjs and .eslintignore removed
- pnpm lint script works end-to-end (prettier + eslint)

## Self-Check: PASSED

Verified claims from this summary:
- ✓ Created file exists: eslint.config.js
- ✓ Deleted files removed: .eslintrc.cjs, .eslintignore
- ✓ Commit exists: feee2bf
- ✓ ESLint 10.0.0 installed
- ✓ @typescript-eslint/parser 8.55.0 in package.json
- ✓ eslint-plugin-astro 1.5.0 in package.json

---
*Phase: 04-styling-linting-modernization*
*Completed: 2026-02-10*
