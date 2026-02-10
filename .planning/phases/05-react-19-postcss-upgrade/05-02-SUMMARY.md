---
phase: 05-react-19-postcss-upgrade
plan: 02
subsystem: build-tools
tags: [postcss, css-processing, bug-fix, upgrade]

dependency-graph:
  requires:
    - postcss-preset-env@^11.1.3
  provides:
    - PostCSS v11 CSS processing
    - Stage 2 modern CSS features
  affects:
    - CSS compilation pipeline
    - Production build output

tech-stack:
  added:
    - postcss-preset-env: "11.1.3"
  patterns:
    - PostCSS plugin configuration with function invocation
    - Node.js require(esm) for ESM-only packages

key-files:
  created: []
  modified:
    - postcss.config.cjs: "Fixed plugin invocation syntax"
    - package.json: "Updated postcss-preset-env to v11.1.3"
    - pnpm-lock.yaml: "Dependency lockfile update"

decisions:
  - what: "Keep autoprefixer package despite redundancy"
    why: "postcss-preset-env v11 includes autoprefixer, but keeping separate package avoids risk if other configs reference it"
    impact: "No-op duplication, minimal impact"
  - what: "Keep postcss.config.cjs as CommonJS"
    why: "Node v25.2.1 supports require(esm) natively, no need to migrate to ESM config"
    impact: "Simpler migration, works transparently"

metrics:
  duration: "87 seconds (1 min 27s)"
  tasks: 2
  commits: 1
  files-modified: 3
  completed: "2026-02-10T19:57:21Z"
---

# Phase 05 Plan 02: PostCSS Preset-Env v11 Upgrade Summary

**One-liner:** Upgraded postcss-preset-env from v9.5.2 to v11.1.3 and fixed config bug where options were passed to require() instead of plugin function.

## What Was Done

### Task 1: Upgrade postcss-preset-env to v11 and fix config
**Status:** Complete
**Commit:** e10a2c0

Fixed critical bug in postcss.config.cjs where options were incorrectly passed as second argument to Node's `require()` function instead of to the PostCSS plugin:

**Before (broken):**
```js
require('postcss-preset-env', { stage: 2 })
```

**After (correct):**
```js
require('postcss-preset-env')({ stage: 2 })
```

This bug meant stage 2 features were never actually configured. Fortunately, postcss-preset-env defaults to stage 2, so behavior was unchanged, but the config was still incorrect.

**Changes:**
- Upgraded postcss-preset-env from v9.5.2 to v11.1.3 (+77 packages, -73 packages)
- Fixed plugin invocation syntax in postcss.config.cjs
- Kept file as .cjs (CommonJS) - Node v25.2.1 supports require(esm) natively

**Verification:**
- `pnpm list postcss-preset-env` shows 11.1.3
- PostCSS config contains correct syntax: `require('postcss-preset-env')({ stage: 2 })`
- Production build succeeds with no PostCSS warnings

### Task 2: Verify CSS feature processing and build output
**Status:** Complete
**Commit:** None (verification only)

Verified PostCSS v11 processes CSS correctly through the full pipeline:

**Build verification:**
- Production build succeeds in 1.23s
- CSS output file generated: dist/_astro/index.ChJpJt69.css (67KB)
- No PostCSS errors or warnings in build output
- Preview server returns HTTP 200

**CSS processing stack:**
- @tailwindcss/vite handles Tailwind utility classes
- postcss-preset-env handles modern CSS syntax transpilation
- No conflicts between processors (complementary responsibilities)

## Deviations from Plan

None - plan executed exactly as written.

## Success Criteria

- [x] PCSS-01: postcss-preset-env upgraded to v11 with correct CSS processing
- [x] PostCSS config bug fixed (options properly passed to plugin)
- [x] Production build succeeds with processed CSS
- [x] No regressions in CSS output

## Technical Notes

### PostCSS v11 ESM Compatibility

postcss-preset-env v11 is ESM-only, but Node v25.2.1 supports `require(esm)` natively through experimental feature that's stable enough for production use. This means:
- No need to convert postcss.config.cjs to ESM (.mjs)
- `require('postcss-preset-env')` works transparently
- Simpler migration path

### Autoprefixer Redundancy

package.json contains autoprefixer in both `dependencies` and `devDependencies`. postcss-preset-env v11 includes autoprefixer by default, making the separate package redundant. However, we kept it to avoid risk if other configs reference it directly.

**Decision:** Leave autoprefixer in place. It will be a no-op if preset-env handles prefixing.

### Bug Impact Assessment

The original bug (`require('postcss-preset-env', { stage: 2 })`) passed options to Node's require() function, not to the PostCSS plugin. This meant:
- Stage 2 was never actually configured
- postcss-preset-env used its default stage (which is stage 2)
- **Result:** No actual behavior difference, but config was incorrect

The fix ensures explicit stage 2 configuration and is more maintainable.

## Self-Check: PASSED

### Created files verified:
- N/A (no new files created)

### Modified files verified:
- FOUND: /Volumes/SSD/dev/diegodesousa/postcss.config.cjs
- FOUND: /Volumes/SSD/dev/diegodesousa/package.json
- FOUND: /Volumes/SSD/dev/diegodesousa/pnpm-lock.yaml

### Commits verified:
- FOUND: e10a2c0 (feat(05-02): upgrade postcss-preset-env to v11 and fix config)

### Build artifacts verified:
- FOUND: dist/_astro/index.ChJpJt69.css (67KB)
- HTTP 200 on preview server

All claims verified successfully.
