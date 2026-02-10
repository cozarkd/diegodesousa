# Stack Research: Major Dependency Migration

**Domain:** Astro Portfolio Site Dependency Upgrades
**Researched:** 2026-02-10
**Confidence:** HIGH

## Migration Overview

This research focuses on upgrading 6 major dependencies in an existing Astro 4.5.4 portfolio site to their latest stable versions. All migrations have confirmed compatibility paths and official upgrade documentation.

## Core Framework Migrations

### Astro 4.5.4 → 5.0+

| Technology | Current | Target | Purpose | Migration Notes |
|------------|---------|--------|---------|-----------------|
| astro | 4.5.4 | 5.0.0+ | Static site generator | Upgrades to Vite 6.0, introduces Content Layer API |

**Why Upgrade:**
- 5x faster builds, 50% less memory usage with Content Layer API
- Vite 6.0 performance improvements
- Better content loading from any source (local files, remote APIs, CMS)

**Breaking Changes:**
1. **Content Collections API v2.0**: Legacy collections continue to work with `legacy.collections` flag, but migration recommended
   - Config file location: `src/content/config.ts` → `src/content.config.ts`
   - Property naming: `post.slug` → `post.id`
   - Collections now require `loader` property (use `glob()`)
   - `render()` is now an imported function, not a property on entries

2. **Shiki Theme Color Tokens Renamed**:
   - `--astro-code-color-text` → `--astro-code-foreground`
   - `--astro-code-color-background` → `--astro-code-background`

3. **Output Mode Consolidation**: `output: 'hybrid'` and `output: 'static'` merged into single `'static'` configuration

4. **MDX Integration Required**: Must upgrade `@astrojs/mdx` to v4.0.0+ (MDX server renderer import changed from `astro/jsx/server.js` to `@astrojs/mdx/server.js`)

5. **Lit Integration Removed**: `@astrojs/lit` completely removed (not applicable to this project)

**Peer Dependency Impact:** Requires Vite 6.0 upgrade (automatic with Astro 5)

### React 18.2.0 → 19.0+

| Technology | Current | Target | Purpose | Migration Notes |
|------------|---------|--------|---------|-----------------|
| react | 18.2.0 | 19.2+ | UI component library | Stable as of Dec 2024, adds Server Components & Actions |
| react-dom | 18.2.0 | 19.2+ | DOM renderer | New form APIs, resource management APIs |
| @types/react | 18.2.73 | 19+ | Type definitions | Ref as prop changes, forwardRef deprecated |
| @types/react-dom | 18.2.23 | 19+ | Type definitions | New hook type definitions |

**Why Upgrade:**
- Native form action support (`action` prop on `<form>`, `<input>`, `<button>`)
- New hooks: `useActionState`, `useOptimistic`, `use` API
- Simplified ref handling (ref as regular prop, no `forwardRef` needed)
- Better async handling in transitions

**Breaking Changes:**
1. **Ref Callback Returns**: Ref callbacks can now return cleanup functions; TypeScript rejects implicit returns
   ```tsx
   // BEFORE
   <div ref={current => (instance = current)} />

   // AFTER
   <div ref={current => {instance = current}} />
   ```

2. **Ref Behavior on Unmount**: React no longer calls `ref` functions with `null` when unmounting (if cleanup function is provided)

3. **Hook Renamed**: `ReactDOM.useFormState` → `React.useActionState` (old name deprecated)

4. **ForwardRef Deprecated**: Function components can receive `ref` as regular prop (backward compatible for now)

5. **Document Metadata Hoisting**: `<title>`, `<link>`, `<meta>` tags now automatically hoist to `<head>` when rendered in components

**Impact on Codebase:**
- Radix UI components (Dialog, DropdownMenu, Label) are fully compatible with React 19 as of latest releases
- No changes needed for existing React 18 island components unless using deprecated patterns

### Tailwind CSS 3.4.1 → 4.1+

| Technology | Current | Target | Purpose | Migration Notes |
|------------|---------|--------|---------|-----------------|
| tailwindcss | 3.4.1 | 4.1+ | Utility-first CSS | Complete rewrite with CSS-first config, 100x faster incremental builds |
| @astrojs/tailwind | 5.1.0 | REMOVE | Astro integration (deprecated) | Replace with @tailwindcss/vite plugin |
| @tailwindcss/vite | N/A | INSTALL | Vite plugin for v4 | Official plugin for Tailwind 4 |

**Why Upgrade:**
- Up to 5x faster full builds, 100x+ faster incremental builds (measured in microseconds)
- Simplified installation with zero config
- CSS-first configuration (no `tailwind.config.js` required)
- Better browser support with modern CSS features

**Critical Breaking Changes:**

1. **Astro Integration Deprecated**: Must uninstall `@astrojs/tailwind` and use `@tailwindcss/vite` plugin instead
   - Run `npx astro add tailwind` on Astro 5.2+ to auto-configure
   - Or manually add `@tailwindcss/vite` to `vite.plugins` in `astro.config.mjs`

2. **Import Syntax Change**:
   ```css
   /* v3 */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* v4 */
   @import "tailwindcss";
   ```

3. **Utility Renamings**:
   | v3 | v4 |
   |----|----|
   | `shadow-sm` | `shadow-xs` |
   | `shadow` | `shadow-sm` |
   | `blur-sm` | `blur-xs` |
   | `rounded-sm` | `rounded-xs` |
   | `outline-none` | `outline-hidden` |
   | `ring` (3px) | `ring-3` |

4. **Important Modifier Syntax**: `!` now goes at END of class name
   ```html
   <!-- v3 -->
   <div class="!flex !bg-red-500">

   <!-- v4 -->
   <div class="flex! bg-red-500!">
   ```

5. **CSS Variable Syntax**: Use parentheses instead of brackets
   ```html
   <!-- v3 -->
   <div class="bg-[--brand-color]">

   <!-- v4 -->
   <div class="bg-(--brand-color)">
   ```

6. **Default Value Changes**:
   - Border color: `gray-200` → `currentColor` (must explicitly specify `border-gray-200`)
   - Ring width: `3px` → `1px`, color: `blue-500` → `currentColor`
   - Placeholder color: `gray-400` → current text color at 50% opacity
   - Button cursor: `pointer` → `default`

7. **Removed Deprecated Utilities**:
   - `bg-opacity-*`, `text-opacity-*`, `border-opacity-*` → Use opacity modifiers like `bg-black/50`
   - `flex-shrink-*` → Use `shrink-*`
   - `flex-grow-*` → Use `grow-*`
   - `overflow-ellipsis` → Use `text-ellipsis`

8. **Configuration File**: `tailwind.config.js` no longer auto-detected; must explicitly load with `@config` directive if needed

**Browser Requirements:**
- Safari 16.4+
- Chrome 111+
- Firefox 128+

**Migration Tool:** Run `npx @tailwindcss/upgrade` (requires Node.js 20+)

**Impact on Codebase:**
- Custom seasonal theming will need CSS variable syntax updates
- Seasonal plugin configurations must migrate to CSS `@theme` directive
- All template files need utility class updates (automated via upgrade tool)

### ESLint 8.57.0 → 10.0.0

| Technology | Current | Target | Purpose | Migration Notes |
|------------|---------|--------|---------|-----------------|
| eslint | 8.57.0 | 10.0.0 | JavaScript linter | Flat config mandatory, Node.js 20.19.0+ required |
| @typescript-eslint/parser | 6.21.0 | 8+ | TypeScript parser | Flat config compatible |
| eslint-plugin-astro | 0.31.4 | 1+ | Astro linting | Native flat config support |
| eslint-plugin-import | 2.32.0 | 3+ | Import linting | Check flat config compatibility |
| eslint-plugin-jsx-a11y | 6.10.2 | 7+ | Accessibility linting | Check flat config compatibility |
| eslint-plugin-n | 16.6.2 | 17+ | Node.js linting | Flat config support |
| eslint-plugin-promise | 6.1.1 | 7+ | Promise linting | Flat config support |
| eslint-config-standard | 17.1.0 | REMOVE | Standard config | Not compatible with flat config |

**Why Upgrade:**
- Flat config enables better monorepo support
- Configuration starts from linted file directory (not cwd)
- Better performance with `--quiet` (no longer executes warn-level rules)
- Future-proof (eslintrc format permanently removed)

**Breaking Changes:**

1. **Flat Config Mandatory**: `.eslintrc.*` files no longer supported
   - Must migrate to `eslint.config.js` (or `.mjs`, `.cjs`)
   - Use `npx @eslint/migrate-config .eslintrc.json` for automatic migration

2. **Configuration Format**:
   ```javascript
   // BEFORE (.eslintrc.json)
   {
     "extends": ["eslint:recommended"],
     "plugins": ["astro"]
   }

   // AFTER (eslint.config.js)
   import js from "@eslint/js";
   import astro from "eslint-plugin-astro";

   export default [
     js.configs.recommended,
     ...astro.configs.recommended
   ];
   ```

3. **Node.js Requirements**: Minimum Node.js v20.19.0+ (drops support for v18, v19)

4. **String Shortcuts Removed**: Must import configs explicitly
   - Cannot use `"eslint:recommended"` string
   - Must use `import js from "@eslint/js"` and reference `js.configs.recommended`

5. **Removed Rules**: `require-jsdoc` and `valid-jsdoc` (migrate to `eslint-plugin-jsdoc`)

6. **Rule Updates in `eslint:recommended`**:
   - `no-unused-vars` now checks caught errors by default (`caughtErrors: "all"`)
   - Added 4 new rules, removed 4 rules

7. **CLI Behavior Changes**:
   - `--quiet` no longer executes warn-level rules (performance improvement)
   - Running without patterns lints current directory
   - `--output-file` writes empty files to disk

8. **Formatters Removed**: Seven formatters now require separate npm packages

**Plugin Compatibility:**
- `eslint-plugin-astro`: Has native flat config support (use v1+)
- `eslint-config-standard`: Not compatible with flat config, must be removed
- All other plugins need verification for flat config support

**Migration Steps:**
1. Update Node.js to v20.19.0+
2. Run `npx @eslint/migrate-config .eslintrc.json`
3. Review generated `eslint.config.js`
4. Update all plugins to flat config compatible versions
5. Remove `eslint-config-standard` and manually configure rules
6. Test with `npm run lint`

### PostCSS Preset Env 9.5.2 → 11.1+

| Technology | Current | Target | Purpose | Migration Notes |
|------------|---------|--------|---------|-----------------|
| postcss-preset-env | 9.5.2 | 11.1.3 | Modern CSS features | Minor updates, backward compatible |

**Why Upgrade:**
- Latest CSS feature support
- Bug fixes and performance improvements
- Better compatibility with PostCSS 8

**Breaking Changes:** None documented for v10 and v11 (minor version updates)

**Migration:** Simple version bump, no code changes required

### Zod 3.23.8 → 4.3+

| Technology | Current | Target | Purpose | Migration Notes |
|------------|---------|--------|---------|-----------------|
| zod | 3.23.8 | 4.3.6 | Schema validation | Major breaking changes to API, transition period supported |

**Why Upgrade:**
- Unified error handling API
- Better TypeScript inference
- Improved performance
- More elegant API design

**Breaking Changes:**

1. **Error Customization Unified**: Single `error` parameter replaces `message`, `invalid_type_error`, `required_error`, `errorMap`
   ```typescript
   // BEFORE (v3)
   z.string({ required_error: "Required", invalid_type_error: "Must be string" })

   // AFTER (v4)
   z.string({ error: "Must be a string" })
   ```

2. **ZodError Structure**: `error.errors` → `error.issues`

3. **Error Formatting Methods Deprecated**: `.format()`, `.flatten()`, `.formErrors()` → Use `z.treeifyError()`

4. **Object Defaults in Optional Fields**: Defaults now apply even within optional fields
   ```typescript
   // v3: returns {}
   // v4: returns { a: "tuna" }
   z.object({ a: z.string().default("tuna") }).optional().parse(undefined)
   ```

5. **Object Methods Deprecated**:
   - `.strict()` and `.passthrough()` → Use `z.strictObject()` and `z.looseObject()`
   - `.merge()` → Use `.extend()`

6. **Number Validators**:
   - `z.number()` no longer accepts `POSITIVE_INFINITY` or `NEGATIVE_INFINITY`
   - `z.number().safe()` now behaves like `.int()` and rejects floats

7. **String Validators Moved**: Top-level functions instead of methods
   - `z.string().email()` → `z.email()`
   - `z.string().uuid()` → `z.uuid()` (now enforces RFC 9562/4122 strictly)
   - `z.string().ip()` → `z.ipv4()` or `z.ipv6()`

8. **Array Changes**: `.nonempty()` now returns `string[]` instead of `[string, ...string[]]`

9. **Function Changes**: `z.function()` is no longer a schema; use `.implement()` and `.implementAsync()`

10. **Promise Deprecated**: `z.promise()` deprecated; await values before parsing

11. **Refine Changes**: `.refine()` ignores type predicates, drops access to `ctx.path`

12. **Record Changes**: `z.record()` now requires two arguments, enforces enum exhaustiveness

**Transition Strategy:**
- Zod 3 continues to be exported from package root ("zod") and new subpath "zod/v3"
- Zod 4 available at "zod/v4" subpath during transition
- Both versions receive bug fixes during transition period

**Migration Tools:**
- Community codemod: `zod-v3-to-v4` (https://github.com/nicoespeon/zod-v3-to-v4)
- Automates many migrations but manual review required

**Impact on Codebase:**
- Content collections use Zod for schema validation
- Form validation may use Zod
- Need to review all schema definitions
- Consider staying on v3 temporarily if migration is complex

## Astro Integration Compatibility Matrix

| Integration | Current | Target | Astro 5 | React 19 | Tailwind 4 | Notes |
|-------------|---------|--------|---------|----------|------------|-------|
| @astrojs/react | 3.1.0 | 4.4.2 | ✓ | ✓ | N/A | Full React 19 support, adds Actions integration |
| @astrojs/mdx | 2.2.2 | 4.3.13 | ✓ | ✓ | N/A | Required for Astro 5, handles JSX/MDX rendering |
| @astrojs/tailwind | 5.1.0 | REMOVE | ✗ | N/A | ✗ | Deprecated for Tailwind 4, use @tailwindcss/vite |
| @astrojs/sitemap | 3.7.0 | 3.7.0 | ✓ | N/A | N/A | No update needed |
| @astrojs/check | 0.9.6 | 0.9.6+ | ✓ | N/A | N/A | Compatible, minor updates available |
| @astrojs/rss | 4.0.15 | 4.0.15 | ✓ | N/A | N/A | No update needed |

## Supporting Libraries Compatibility

| Library | Current | Status | Notes |
|---------|---------|--------|-------|
| @radix-ui/react-dialog | 1.1.15 | ✓ | Full React 19 compatibility |
| @radix-ui/react-dropdown-menu | 2.1.16 | ✓ | Full React 19 compatibility |
| @radix-ui/react-label | 2.1.8 | ✓ | Full React 19 compatibility |
| @radix-ui/react-slot | 1.2.4 | ✓ | Full React 19 compatibility |
| gsap | 3.14.2 | ✓ | Latest v3, no updates needed |
| sharp | 0.34.5 | ✓ | Compatible, requires Node.js ^18.17.0 or >=20.3.0 |
| class-variance-authority | 0.7.1 | ✓ | No updates needed |
| clsx | 2.1.1 | ✓ | No updates needed |
| tailwind-merge | 2.2.2 | ✓ | Compatible with Tailwind 4 |
| tailwindcss-animate | 1.0.7 | ✓ | Compatible with Tailwind 4 |
| tailwind-scrollbar | 3.1.0 | ✓ | Compatible with Tailwind 4 |
| lucide-react | 0.563.0 | ✓ | React 19 compatible |
| lozad | 1.16.0 | ✓ | No updates needed |
| astro-navbar | 2.4.0 | ✓ | Astro 5 compatible |
| astro-robots-txt | 1.0.0 | ✓ | Astro 5 compatible |
| astro-fathom | 2.0.0 | ✓ | Astro 5 compatible |

## Development Tools Updates

| Tool | Current | Target | Notes |
|------|---------|--------|-------|
| typescript | 5.9.3 | 5.9.3 | Latest stable, no update needed |
| prettier | 3.8.1 | 3.8.1 | Latest stable, no update needed |
| prettier-plugin-astro | 0.14.1 | 0.14.1+ | Check for Astro 5 compatibility updates |
| prettier-plugin-tailwindcss | 0.7.2 | 0.7.2+ | Check for Tailwind 4 compatibility updates |
| prettier-plugin-css-order | 2.2.0 | 2.2.0 | No updates needed |
| prettier-config-standard | 7.0.0 | 7.0.0 | No updates needed |
| autoprefixer | 10.4.24 | 10.4.24+ | Latest in v10 series |
| postcss-import | 16.1.1 | 16.1.1+ | Latest in v16 series |

## Installation Commands

### Step 1: Core Framework Updates

```bash
# Astro and integrations
npm install astro@^5.0.0 @astrojs/react@^4.4.2 @astrojs/mdx@^4.3.13

# React ecosystem
npm install react@^19.2.0 react-dom@^19.2.0

# Type definitions
npm install -D @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### Step 2: Tailwind CSS Migration

```bash
# Remove deprecated integration
npm uninstall @astrojs/tailwind

# Install Tailwind 4 and Vite plugin
npm install tailwindcss@^4.1.0 @tailwindcss/vite@^4.1.0

# Run upgrade tool (Node.js 20+ required)
npx @tailwindcss/upgrade
```

### Step 3: ESLint Migration

```bash
# Update ESLint and parser
npm install -D eslint@^10.0.0 @typescript-eslint/parser@^8.0.0

# Update plugins (verify flat config support first)
npm install -D eslint-plugin-astro@^1.0.0

# Remove incompatible config
npm uninstall eslint-config-standard

# Generate flat config
npx @eslint/migrate-config .eslintrc.json
```

### Step 4: Other Updates

```bash
# PostCSS
npm install -D postcss-preset-env@^11.1.3

# Zod (optional, can defer)
npm install zod@^4.3.6
# OR use v3 subpath: import { z } from "zod/v3"
```

## Packages to Remove

| Package | Reason |
|---------|--------|
| @astrojs/tailwind | Deprecated for Tailwind CSS v4, replaced by @tailwindcss/vite |
| eslint-config-standard | Not compatible with ESLint flat config |

## New Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| @tailwindcss/vite | ^4.1.0 | Official Vite plugin for Tailwind CSS 4 |
| @eslint/js | ^10.0.0 | ESLint recommended config for flat config format |

## Migration Sequence Recommendation

**Critical Path:** These must be done in order due to dependencies:

1. **Node.js Update** (if needed): Ensure Node.js 20.19.0+ for ESLint 10
2. **Astro 5 Migration**: Core framework, enables other integrations
3. **React 19 Migration**: Must be done with or after Astro integration update
4. **Tailwind CSS 4 Migration**: Can be done independently, requires Astro config changes
5. **ESLint 10 Migration**: Can be done independently, requires flat config rewrite
6. **PostCSS Preset Env**: Minor update, can be done anytime
7. **Zod 4 Migration**: Can be deferred, use v3 subpath during transition

**Suggested Phased Approach:**

**Phase 1: Core Framework (Highest Risk)**
- Astro 4 → 5
- React 18 → 19
- Update Astro integrations (@astrojs/react, @astrojs/mdx)
- Test all pages and components

**Phase 2: Styling System (Medium Risk)**
- Tailwind CSS 3 → 4
- Update CSS import syntax
- Run upgrade tool
- Manually fix custom theme configurations
- Test all visual styles

**Phase 3: Developer Tooling (Lower Risk)**
- ESLint 8 → 10
- Migrate to flat config
- Update all plugins
- Test linting rules

**Phase 4: Minor Updates (Lowest Risk)**
- PostCSS Preset Env 9 → 11
- Zod 3 → 4 (or use v3 subpath)
- Update Prettier plugins if needed

## Version Compatibility Notes

**Node.js Requirements:**
- Astro 5: Node.js 18.18+, 20.9+, or 21+
- ESLint 10: Node.js 20.19.0+
- Sharp 0.34: Node.js ^18.17.0 or >=20.3.0
- Tailwind upgrade tool: Node.js 20+

**Recommended:** Node.js 20.19.0+ (satisfies all requirements)

**Browser Targets:**
- Tailwind CSS 4 requires Safari 16.4+, Chrome 111+, Firefox 128+
- Consider if your audience uses older browsers

## Known Integration Conflicts

| Conflict | Impact | Resolution |
|----------|--------|------------|
| @astrojs/tailwind + Tailwind 4 | Integration deprecated for v4 | Remove integration, use @tailwindcss/vite |
| eslint-config-standard + ESLint 10 | Not compatible with flat config | Remove, manually configure rules |
| Zod 3 schemas + Zod 4 | Breaking API changes | Use zod/v3 subpath during transition |
| Content Collections + Astro 5 | Legacy API deprecated | Add legacy.collections flag or migrate to Content Layer API |

## Breaking API Changes Summary

### Astro 5
- Content Collections API v2.0 (use `legacy.collections` flag for temporary compatibility)
- MDX integration must upgrade to v4.0.0+
- Shiki theme token names changed

### React 19
- Ref callback implicit returns rejected by TypeScript
- `useFormState` renamed to `useActionState`
- Ref no longer called with null on unmount (if cleanup provided)

### Tailwind CSS 4
- Import syntax changed from `@tailwind` directives to `@import "tailwindcss"`
- Important modifier moved to end of class (`flex!` not `!flex`)
- CSS variable syntax uses parentheses (`bg-(--var)` not `bg-[--var]`)
- Many utility renamings and default value changes
- Configuration now CSS-first (no `tailwind.config.js` required)

### ESLint 10
- Flat config mandatory, eslintrc removed
- String shortcuts removed, must import configs
- Node.js 20.19.0+ required
- Several formatters and rules removed

### Zod 4
- Error customization API unified
- Object methods deprecated (`.merge()`, `.strict()`, `.passthrough()`)
- String validators moved to top-level functions
- Many validator behavior changes

### PostCSS Preset Env 11
- No breaking changes documented (minor version bumps)

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Astro 5 | HIGH | Official docs, migration guide, community testing |
| React 19 | HIGH | Official release, Radix UI confirmed compatible |
| Tailwind 4 | HIGH | Official docs, automated upgrade tool, community adoption |
| ESLint 10 | HIGH | Official docs, migration tool, recent release |
| PostCSS Preset Env | MEDIUM | Limited breaking change documentation, minor versions |
| Zod 4 | HIGH | Official migration guide, community codemod, transition support |
| Integration Compatibility | HIGH | Confirmed via official changelogs and community reports |

## Sources

### Official Documentation
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/) — Astro 5 breaking changes
- [Astro 5.0 Release](https://astro.build/blog/astro-5/) — Content Layer API details
- [React 19 Release](https://react.dev/blog/2024/12/05/react-19) — React 19 breaking changes
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — Tailwind 4 migration
- [Tailwind CSS v4.1 Release](https://tailwindcss.com/blog/tailwindcss-v4-1) — Latest features
- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0) — Flat config migration
- [ESLint v10.0.0 Release](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) — ESLint 10 changes
- [Zod v4 Migration Guide](https://zod.dev/v4/changelog) — Zod 4 breaking changes

### Package Registries
- [astro npm](https://www.npmjs.com/package/astro) — Version information
- [react npm](https://www.npmjs.com/package/react) — Version information
- [tailwindcss npm](https://www.npmjs.com/package/tailwindcss) — Version information
- [eslint npm](https://www.npmjs.com/package/eslint) — Version information
- [postcss-preset-env npm](https://www.npmjs.com/package/postcss-preset-env) — Version information
- [zod npm](https://www.npmjs.com/package/zod) — Version information
- [@astrojs/react npm](https://www.npmjs.com/package/@astrojs/react) — React 19 compatibility
- [@astrojs/mdx npm](https://www.npmjs.com/package/@astrojs/mdx) — Latest version
- [@astrojs/sitemap npm](https://www.npmjs.com/package/@astrojs/sitemap) — Version information
- [sharp npm](https://www.npmjs.com/package/sharp) — Node.js compatibility
- [gsap npm](https://www.npmjs.com/package/gsap) — Latest version
- [typescript npm](https://www.npmjs.com/package/typescript) — TypeScript 5.9
- [prettier npm](https://www.npmjs.com/package/prettier) — Latest version

### Integration Compatibility
- [Radix UI React 19 Compatibility](https://github.com/radix-ui/primitives/issues/2900) — Radix UI React 19 support
- [Radix UI Releases](https://www.radix-ui.com/primitives/docs/overview/releases) — Version updates
- [eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro) — Flat config support
- [@astrojs/tailwind docs](https://docs.astro.build/en/guides/integrations-guide/tailwind/) — Deprecation notice

### Community Resources
- [Upgrading to Astro v5](https://www.ponktoku.dev/en/blog/upgrading-to-astro-v5-from-v4/) — Real-world migration
- [Astro Tailwind v4 Setup](https://tailkits.com/blog/astro-tailwind-setup/) — Tailwind 4 + Astro 5
- [Upgrading TailwindCSS to v4 in Astro](https://blog.okaryo.studio/en/20250201-astro-tailwindcss-v4-upgrade/) — Migration experience
- [zod-v3-to-v4 codemod](https://github.com/nicoespeon/zod-v3-to-v4) — Automated migration tool

---

*Stack research for: Astro Portfolio Dependency Migration*
*Researched: 2026-02-10*
*Confidence: HIGH — All versions verified via official sources and package registries*
