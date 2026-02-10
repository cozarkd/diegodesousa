# Feature Migration Research

**Domain:** Dependency Migration for Astro Portfolio Site
**Researched:** 2026-02-10
**Confidence:** HIGH

## Migration Impact Matrix

This document analyzes how existing features are affected by major dependency migrations: Astro 4→5, React 18→19, Tailwind CSS 3→4, ESLint 8→9.

### Migration Overview

| Migration | Complexity | Breaking Changes | Expected Behavior Change |
|-----------|-----------|------------------|-------------------------|
| Astro 4.5→5.x | HIGH | Content collections API, image config | None (internal refactor) |
| React 18→19 | MEDIUM | Unused (installed but not actively used) | None |
| Tailwind 3→4 | HIGH | Config format, utility renames, plugin system | None (visual parity) |
| ESLint 8→9 | HIGH | Config format (.eslintrc→flat config) | None (same rules) |
| Sharp 0.34→latest | LOW | Already using Sharp (default in Astro 5) | None |
| GSAP 3.14→latest | LOW | No breaking changes in minor versions | None |

---

## Feature 1: Content Collections with Zod Schemas

**Current implementation:**
- `src/content/config.ts` with `defineCollection()`
- Zod schemas for project metadata validation
- Using legacy Content Collections v2.0 API

### Astro 4→5 Impact

**Breaking Changes:**

1. **File location change**
   - Move `src/content/config.ts` → `src/content.config.ts`

2. **Loader API required**
   ```typescript
   // BEFORE (Astro 4)
   const projects = defineCollection({
     schema: ({ image }) => z.object({...})
   })

   // AFTER (Astro 5)
   import { glob } from 'astro/loaders'

   const projects = defineCollection({
     loader: glob({
       pattern: '**/[^_]*.{md,mdx}',
       base: "./src/content/projects"
     }),
     schema: ({ image }) => z.object({...})
   })
   ```

3. **Field changes**
   - `slug` field → `id` field
   - `entry.render()` method → `render(entry)` function
   - Layout field no longer supported in frontmatter

**Migration Steps:**

| Step | Action | Complexity | Files Affected |
|------|--------|-----------|----------------|
| 1 | Rename file | LOW | `src/content/config.ts` |
| 2 | Add glob loader import | LOW | New `src/content.config.ts` |
| 3 | Update collection definition | MEDIUM | `src/content.config.ts` |
| 4 | Replace `entry.slug` with `entry.id` | MEDIUM | All pages using `getCollection()` |
| 5 | Replace `entry.render()` with `render(entry)` | MEDIUM | Project detail pages |

**Expected Behavior:**
- **User-facing:** None (same content, same rendering)
- **Developer-facing:** Cleaner API, better TypeScript types
- **Performance:** Improved build times (Content Layer API is optimized)

**Source:** [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)

---

## Feature 2: 4-Language i18n Routing (es, en, pt, gl)

**Current implementation:**
- `astro.config.mjs` with `i18n` config (defaultLocale: "es", locales: ["es", "en", "pt", "gl"])
- `@astrojs/sitemap` with i18n locale mappings
- Custom language switcher component

### Astro 4→5 Impact

**Breaking Changes:** None identified

**Configuration Compatibility:**
```javascript
// Astro 4 & 5 - No changes required
i18n: {
  defaultLocale: "es",
  locales: ["es", "en", "pt", "gl"],
}
```

**Known Issues:**
- Bug reported with `getRelativeLocaleUrlList()` giving unexpected paths in Astro 5.x
- May need to test language switcher thoroughly after upgrade

**Migration Steps:**

| Step | Action | Complexity | Impact |
|------|--------|-----------|---------|
| 1 | Test locale routing after upgrade | LOW | Verify all 4 locales work |
| 2 | Test language switcher component | LOW | Verify URL generation |
| 3 | Verify sitemap locale mappings | LOW | Check generated sitemap |

**Expected Behavior:**
- **User-facing:** None (same routing, same URLs)
- **Developer-facing:** Same API (no changes needed)

**Source:** [Astro i18n Documentation](https://docs.astro.build/en/guides/internationalization/)

---

## Feature 3: React Islands (Radix UI Components)

**Current implementation:**
- React 18.2.0 with ReactDOM
- Radix UI components installed: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-slot`
- `@astrojs/react` integration

### React 18→19 Impact

**Critical Note:** React and Radix UI are installed but **NOT actively used** in the codebase. Dropdowns and theme toggles use vanilla Astro components with inline scripts, not React islands.

**If/When React Islands Are Used:**

1. **Astro Integration Update**
   - Update `@astrojs/react` from v3.x to v4.x for React 19 support

2. **Radix UI Compatibility**
   - Radix Primitives has React 19 support as of latest releases
   - Known issue: `ref` callback behavior changed in React 19 causing infinite loops in some Radix components
   - **Risk:** May need to update all Radix UI packages to latest versions

3. **ReactDOM API Changes**
   - Astro handles React rendering internally (no direct `ReactDOM.render` calls in user code)
   - No manual migration needed for island hydration

**Migration Steps:**

| Step | Action | Complexity | Impact |
|------|--------|-----------|---------|
| 1 | Verify React islands aren't used | LOW | Code audit |
| 2 | Update `@astrojs/react` to v4.x | LOW | `package.json` |
| 3 | Update all Radix UI packages to latest | MEDIUM | Peer dependency resolution |
| 4 | Test if creating React islands in future | LOW | Component testing |

**Expected Behavior:**
- **Current:** No impact (React not actively used)
- **Future:** React islands work with React 19 APIs

**Sources:**
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Radix UI React 19 Compatibility Issue](https://github.com/radix-ui/primitives/issues/3295)
- [@astrojs/react Changelog](https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md)

---

## Feature 4: Tailwind CSS Styling with Custom Config

**Current implementation:**
- Tailwind CSS 3.4.1 with custom config in `tailwind.config.cjs`
- Dark mode: `['class']`
- Custom theme colors using CSS variables (`hsl(var(--border))`, etc.)
- Custom plugins: `tailwindcss-animate`, `seasonalStylesPlugin`, `tailwind-scrollbar`
- PostCSS with `tailwindcssNesting()`

### Tailwind 3→4 Impact

**Breaking Changes:**

1. **Configuration Format**
   - JavaScript config no longer auto-detected
   - Must use `@config` directive in CSS or migrate to CSS-based config

   ```css
   /* Option A: Keep JS config, load explicitly */
   @config "../../tailwind.config.js";
   @import "tailwindcss";

   /* Option B: Migrate to CSS @theme */
   @import "tailwindcss";

   @theme {
     --color-border: hsl(var(--border));
     --color-input: hsl(var(--input));
     /* ... migrate all theme.extend.colors */
   }
   ```

2. **Utility Class Renames (CRITICAL)**

   These classes are used throughout the codebase and MUST be updated:

   | v3 Class | v4 Class | Usage Locations |
   |----------|----------|----------------|
   | `shadow` | `shadow-sm` | Button components, cards |
   | `shadow-sm` | `shadow-xs` | Dropdown menus |
   | `rounded` | `rounded-sm` | Various elements |
   | `rounded-sm` | `rounded-xs` | Input fields |
   | `outline-none` | `outline-hidden` | Focus states |
   | `ring` | `ring-3` | Focus rings (if used) |

3. **Dark Mode Configuration**
   - Class-based dark mode needs explicit variant definition

   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```

4. **PostCSS Changes**
   - Remove `autoprefixer` (now built-in)
   - Remove `postcss-import` (now built-in)
   - Replace `tailwindcss` plugin with `@tailwindcss/postcss`

   ```javascript
   // BEFORE
   plugins: [
     tailwindcssNesting(),
     tailwindcss(),
     autoprefixer()
   ]

   // AFTER
   plugins: [
     tailwindcssNesting(),
     '@tailwindcss/postcss'
   ]
   ```

5. **Plugin Compatibility (HIGH RISK)**

   - **`tailwindcss-animate`:** Needs v4 update (check compatibility)
   - **`tailwind-scrollbar`:** Needs v4 update (check compatibility)
   - **`seasonalStylesPlugin`:** Custom plugin needs rewrite for v4 API

   ```css
   /* Old plugin API */
   addUtilities({ '.custom': {...} })

   /* New v4 API */
   @utility custom {
     /* styles */
   }
   ```

6. **Background Image Paths**
   - Current config uses `url("/images/bgs/Spring-light.png")`
   - May need adjustment in v4 theme syntax

**Migration Steps:**

| Step | Action | Complexity | Files Affected |
|------|--------|-----------|----------------|
| 1 | Install `@tailwindcss/postcss` | LOW | `package.json`, `postcss.config.js` |
| 2 | Update PostCSS config | MEDIUM | `postcss.config.js` or `astro.config.mjs` |
| 3 | Add `@config` directive OR migrate to CSS | HIGH | Main CSS file OR new theme CSS |
| 4 | Find & replace utility class renames | HIGH | All `.astro`, `.html`, `.jsx` files |
| 5 | Update dark mode variant | MEDIUM | Main CSS file |
| 6 | Migrate custom theme colors to CSS | HIGH | New CSS theme file |
| 7 | Rewrite `seasonalStylesPlugin` to v4 API | HIGH | `plugins/tailwind/seasonalStylesPlugin.ts` |
| 8 | Check `tailwindcss-animate` compatibility | MEDIUM | May need alternative |
| 9 | Check `tailwind-scrollbar` compatibility | MEDIUM | May need alternative |
| 10 | Remove deprecated deps | LOW | `package.json` |

**Expected Behavior:**
- **User-facing:** None (visual parity maintained)
- **Developer-facing:** New CSS-first workflow, cleaner config
- **Performance:** Faster builds (v4 is optimized)

**Risk Areas:**
- Custom seasonal theming plugin needs complete rewrite
- Third-party plugins may not have v4 support yet
- Extensive find/replace for utility class renames

**Sources:**
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Plugin Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/13292)
- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

## Feature 5: ESLint Rules (TypeScript, Astro, JSX a11y)

**Current implementation:**
- ESLint 8.56.0 with `.eslintrc.cjs` config
- Plugins: `eslint-plugin-astro`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-n`, `eslint-plugin-promise`
- Parser: `@typescript-eslint/parser`

### ESLint 8→9 Impact

**Breaking Changes:**

1. **Configuration Format (CRITICAL)**
   - `.eslintrc.cjs` → `eslint.config.js` (flat config)
   - Complete rewrite of config structure

   ```javascript
   // BEFORE (.eslintrc.cjs)
   module.exports = {
     extends: ['plugin:astro/recommended'],
     parser: '@typescript-eslint/parser',
     parserOptions: {
       tsconfigRootDir: __dirname,
       sourceType: 'module',
       ecmaVersion: 'latest'
     },
     overrides: [...]
   }

   // AFTER (eslint.config.js)
   import eslintPluginAstro from 'eslint-plugin-astro'
   import tsParser from '@typescript-eslint/parser'

   export default [
     ...eslintPluginAstro.configs.recommended,
     {
       languageOptions: {
         parser: tsParser,
         ecmaVersion: 'latest',
         sourceType: 'module',
       }
     },
     {
       files: ['*.astro'],
       languageOptions: {
         parser: eslintPluginAstro.parser,
         parserOptions: {
           parser: tsParser,
           extraFileExtensions: ['.astro']
         }
       }
     }
   ]
   ```

2. **Node.js Requirement**
   - Requires Node.js v18.18+ (drop support for v16, v17, v19)

3. **Plugin Updates Required**
   - All plugins must support flat config
   - `eslint-plugin-astro` has flat config support (confirmed)
   - Check other plugins for compatibility

4. **Rule Behavior Changes**
   - `--quiet` flag now skips "warn" rules entirely (performance gain)
   - `no-unused-vars`: `caughtErrors` defaults to "all" (was "none")

5. **Removed Features**
   - `require-jsdoc` and `valid-jsdoc` rules removed (use `eslint-plugin-jsdoc`)

**Migration Steps:**

| Step | Action | Complexity | Files Affected |
|------|--------|-----------|----------------|
| 1 | Check plugin flat config support | MEDIUM | Research all plugins |
| 2 | Create `eslint.config.js` | HIGH | New config file |
| 3 | Migrate parser config to `languageOptions` | MEDIUM | Config structure |
| 4 | Migrate Astro overrides | HIGH | Astro-specific rules |
| 5 | Test all plugins work | HIGH | Full codebase lint |
| 6 | Update `package.json` scripts if needed | LOW | `package.json` |
| 7 | Remove `.eslintrc.cjs` | LOW | Delete old config |

**Plugin Compatibility Status:**

| Plugin | Flat Config Support | Notes |
|--------|-------------------|-------|
| `eslint-plugin-astro` | ✅ YES | Use `.configs.recommended` or `.configs['flat/recommended']` |
| `eslint-plugin-import` | ⚠️ CHECK | May need `eslint-plugin-import-x` (ESM fork) |
| `eslint-plugin-jsx-a11y` | ⚠️ CHECK | Verify v6.10.2+ supports flat config |
| `eslint-plugin-n` | ⚠️ CHECK | Verify v16.6.2+ supports flat config |
| `eslint-plugin-promise` | ⚠️ CHECK | Verify v6.1.1+ supports flat config |
| `@typescript-eslint/parser` | ✅ YES | Use in `languageOptions.parser` |

**Expected Behavior:**
- **User-facing:** None (linting still works)
- **Developer-facing:** New config format, same rules
- **CI/CD:** Linting commands unchanged, same exit codes

**Migration Tool:**
```bash
npx @eslint/migrate-config .eslintrc.cjs
```

**Sources:**
- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [ESLint Flat Config Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [eslint-plugin-astro Flat Config](https://github.com/ota-meshi/eslint-plugin-astro)

---

## Feature 6: Sharp Image Optimization

**Current implementation:**
- Sharp 0.34.5 as image optimization backend
- Used automatically by Astro for `<Image>` and `<Picture>` components

### Sharp 0.34→Latest Impact

**Breaking Changes:** None

**Astro 5 Changes:**
- Sharp is now the **only** image service (Squoosh removed)
- Image config structure updated:

  ```javascript
  // If using custom image endpoint
  image: {
    endpoint: {
      route: "/image",
      entrypoint: "./src/image_endpoint.ts"
    }
  }
  ```

**Migration Steps:**

| Step | Action | Complexity | Impact |
|------|--------|-----------|---------|
| 1 | Update Sharp to latest | LOW | `package.json` |
| 2 | Verify image optimization works | LOW | Test build |
| 3 | No config changes needed | LOW | Already using Sharp |

**Expected Behavior:**
- **User-facing:** None (same optimized images)
- **Developer-facing:** None (Sharp already in use)

**Source:** [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)

---

## Feature 7: GSAP Scroll Animations

**Current implementation:**
- GSAP 3.14.2 for scroll-triggered animations
- Used in inline `<script>` tags in `.astro` components

### GSAP 3.14→Latest Impact

**Breaking Changes:** None (minor version updates are backward compatible)

**Compatibility with Astro 5:**
- GSAP works with Astro View Transitions
- Requires cleanup using `astro:after-swap` event
- No migration needed for basic scroll animations

**Migration Steps:**

| Step | Action | Complexity | Impact |
|------|--------|-----------|---------|
| 1 | Update GSAP to latest 3.x | LOW | `package.json` |
| 2 | Test scroll animations after upgrade | LOW | Visual QA |
| 3 | Verify View Transitions compatibility | MEDIUM | Navigation testing |

**Expected Behavior:**
- **User-facing:** None (same animations)
- **Developer-facing:** None (same GSAP API)

**Best Practice:**
```javascript
// Cleanup pattern for Astro View Transitions
document.addEventListener('astro:after-swap', () => {
  // Re-initialize GSAP animations
  ScrollTrigger.refresh()
})
```

**Sources:**
- [GSAP with Astro View Transitions](https://gsap.com/community/forums/topic/40950-compatibility-with-gsap-scrolltrigger-astro-view-transitiosn-api/)
- [Building Scroll Animations with GSAP and Astro](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)

---

## Feature 8: Seasonal Theming System

**Current implementation:**
- Custom Tailwind plugin: `seasonalStylesPlugin.ts`
- Dark mode with CSS variables
- Background images in theme config

### Tailwind 3→4 Impact (CRITICAL)

**Breaking Changes:**

1. **Plugin API Complete Rewrite**
   - Old `addUtilities`, `addComponents`, `matchUtilities` APIs don't work in v4
   - Must rewrite plugin using CSS `@utility` and `@custom-variant` directives

2. **Custom CSS Variables**
   - Theme colors already use CSS variables (good for v4)
   - But defined in JS config - must migrate to `@theme`

3. **Background Images**
   - `backgroundImage` theme config must move to CSS

   ```css
   @theme {
     --background-image-spring-light: url("/images/bgs/Spring-light.png");
     --background-image-spring-dark: url("/images/bgs/Spring-dark.png");
   }
   ```

**Migration Steps:**

| Step | Action | Complexity | Impact |
|------|--------|-----------|---------|
| 1 | Analyze current plugin code | MEDIUM | Understand seasonal theme logic |
| 2 | Rewrite plugin as CSS directives | HIGH | Complete plugin rewrite |
| 3 | Migrate background images to CSS | MEDIUM | Theme configuration |
| 4 | Test seasonal theme switching | HIGH | Manual QA all seasons |
| 5 | Test dark mode transitions | HIGH | Visual QA |

**Expected Behavior:**
- **User-facing:** None (same seasonal themes)
- **Developer-facing:** CSS-based theming instead of JS plugin

**Risk:** High complexity rewrite - seasonal plugin may need significant refactoring

**Source:** [Tailwind CSS v4 Plugin Guide](https://pow.kim/articles/tailwind-css-plugin-v4)

---

## Feature Dependencies

```
Astro 5 Migration
    ├──requires──> Content Collections Loader Migration
    ├──requires──> Image Config Update (Sharp)
    ├──enables───> React 19 (via @astrojs/react v4.x)
    └──enhances──> Build Performance

Tailwind 4 Migration
    ├──requires──> PostCSS Config Update
    ├──requires──> Utility Class Renames (global find/replace)
    ├──requires──> Seasonal Plugin Rewrite
    ├──requires──> Dark Mode Variant Definition
    └──conflicts─> Third-party plugins (check compatibility)

ESLint 9 Migration
    ├──requires──> Flat Config Rewrite
    ├──requires──> Plugin Compatibility Check
    └──independent──> Other migrations (can be done separately)

React 19 Migration
    ├──depends_on──> Astro 5 (@astrojs/react v4.x)
    ├──requires──> Radix UI Updates
    └──low_priority──> Not actively used in codebase
```

### Dependency Notes

- **Astro 5 → Content Collections:** Content collections must migrate to Loader API (breaking change)
- **Astro 5 → React 19:** @astrojs/react v4.x enables React 19 support
- **Tailwind 4 → Seasonal Plugin:** Custom seasonal plugin requires complete rewrite
- **Tailwind 4 → Third-party Plugins:** `tailwindcss-animate` and `tailwind-scrollbar` may not support v4 yet
- **ESLint 9 is independent:** Can be migrated separately from other dependencies

---

## Migration Priority Matrix

| Migration | User Value | Implementation Cost | Risk Level | Priority |
|-----------|------------|---------------------|------------|----------|
| Astro 4→5 | HIGH (performance, DX) | HIGH | MEDIUM | P1 (required) |
| Tailwind 3→4 | MEDIUM (modern tooling) | HIGH | HIGH | P1 (extensive changes) |
| ESLint 8→9 | LOW (DX, modern config) | MEDIUM | MEDIUM | P2 (independent) |
| React 18→19 | LOW (unused feature) | LOW | LOW | P3 (nice to have) |
| Sharp update | LOW (already optimal) | LOW | LOW | P3 (automatic) |
| GSAP update | LOW (minor version) | LOW | LOW | P3 (compatible) |

**Priority key:**
- P1: Must migrate (breaking changes, required by other migrations)
- P2: Should migrate (modernization, independent)
- P3: Nice to have (low impact, minimal changes)

---

## Testing Matrix

| Feature | Test Type | Test Cases | Success Criteria |
|---------|-----------|-----------|------------------|
| Content Collections | Unit | Query projects, render entries | All projects load, no 404s |
| i18n Routing | Integration | Navigate all 4 locales | URLs correct, content displays |
| React Islands | Component | (If used) Radix UI interactions | Components hydrate, interact |
| Tailwind Styling | Visual | All pages, dark mode, seasonal themes | Pixel-perfect parity |
| ESLint Rules | Lint | Run `npm run lint` | Same errors/warnings as before |
| Image Optimization | Build | Build site, check image outputs | Images optimized, correct formats |
| GSAP Animations | Visual | Scroll animations, page transitions | Animations smooth, no jank |
| Seasonal Theming | Visual | All seasons, dark/light mode | Themes switch correctly |

---

## Anti-Features (Do NOT Implement During Migration)

| Anti-Feature | Why Avoid | Alternative |
|--------------|-----------|-------------|
| Migrate to CSS-in-JS | Conflicts with Tailwind philosophy | Keep Tailwind CSS approach |
| Add more React components | React not actively used | Continue with Astro components |
| Rewrite ESLint rules | Unnecessary complexity | Keep same rule set |
| Change color system | Increases testing scope | Maintain existing design tokens |
| Add new Tailwind plugins | Increases migration complexity | Defer to post-migration |

---

## Sources

### Official Documentation
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

### Community Resources
- [Migrating Content Collections Astro 4→5](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/)
- [Tailwind CSS 4 Plugin Guide](https://pow.kim/articles/tailwind-css-plugin-v4)
- [ESLint Flat Config with Astro](https://github.com/ota-meshi/eslint-plugin-astro)
- [Radix UI React 19 Compatibility](https://github.com/radix-ui/primitives/issues/3295)

### Specific Issues & Discussions
- [Astro i18n Unexpected Paths Issue](https://github.com/withastro/astro/issues/12897)
- [Tailwind v4 Dark Mode Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/15083)
- [GSAP Astro View Transitions Compatibility](https://gsap.com/community/forums/topic/40950-compatibility-with-gsap-scrolltrigger-astro-view-transitiosn-api/)

---

*Feature migration research for: Diego de Sousa Portfolio Site*
*Researched: 2026-02-10*
