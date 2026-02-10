# Architecture Research: Major Dependency Migration

**Domain:** Astro Portfolio - Dependency Migration Architecture
**Researched:** 2026-02-10
**Confidence:** HIGH

## Migration Architecture Overview

This migration involves upgrading 5 major dependencies with significant architectural changes:
- Astro 4.5.4 → 5.x (Vite 6, Content Layer API)
- React 18.2.0 → 19.x (ref as prop, JSX transform)
- Tailwind CSS 3.4.1 → 4.x (CSS-based config)
- ESLint 8.56.0 → 9.x (flat config)
- TypeScript 5.9.3 → latest (type inference improvements)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Build-Time Layer                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Astro 5 │→ │ Vite 6   │→ │TypeScript│→ │ ESLint 9 │     │
│  │ Compiler│  │ (bundler)│  │ Compiler │  │ (linter) │     │
│  └────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘     │
│       │            │               │             │           │
├───────┴────────────┴───────────────┴─────────────┴──────────┤
│                    Runtime Layer                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │           React 19 Islands (client:*)               │    │
│  │  - Ref as prop (no forwardRef)                      │    │
│  │  - New JSX transform                                │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    Styling Layer                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐          │
│  │ Tailwind 4  │→ │@tailwindcss/ │→ │ Vite       │          │
│  │ CSS Config  │  │vite (plugin) │  │ (bundler)  │          │
│  └─────────────┘  └──────────────┘  └────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Current Architecture State

### File Structure
```
/
├── astro.config.mjs          # Astro 4 config with integrations
├── tailwind.config.cjs       # Tailwind 3 JS config (CJS)
├── .eslintrc.cjs             # ESLint 8 eslintrc format (CJS)
├── postcss.config.cjs        # PostCSS with autoprefixer (CJS)
├── tsconfig.json             # TypeScript strict config
├── src/
│   ├── pages/
│   │   └── [lang]/           # Locale-based routing
│   ├── components/           # .astro and .tsx (React) components
│   ├── i18n/                 # JSON translation files
│   └── content/
│       └── config.ts         # Content collections v2.0 (legacy)
```

### Integration Points

| Integration | Current Version | Current Method | Post-Migration Method |
|-------------|-----------------|----------------|----------------------|
| Astro → React | @astrojs/react 3.0.9 | React 18.2.0 islands | React 19.x islands with ref prop |
| Astro → Tailwind | @astrojs/tailwind 5.1.0 | PostCSS plugin | @tailwindcss/vite plugin |
| Astro → MDX | @astrojs/mdx 2.0.3 | Astro JSX rendering | MDX self-rendering |
| Vite → PostCSS | Vite config plugins | postcss-import, autoprefixer | Built into Tailwind 4 |
| Tailwind → PostCSS | tailwindcss plugin | PostCSS chain | Standalone Vite plugin |
| TypeScript → Astro | astro/tsconfigs/strict | baseUrl paths | Content collections .d.ts |

## Migration Architecture Patterns

### Pattern 1: Configuration File Migration (CJS → ESM/CSS)

**What:** Move from CommonJS JavaScript config files to ESM or CSS-based configuration.

**When to use:** Required for Tailwind 4 (CSS), ESLint 9 (flat config), optional for PostCSS.

**Trade-offs:**
- **Pros:** Better performance (Tailwind), more modern tooling, type safety
- **Cons:** Breaking change, requires file structure updates, learning curve

**Example - Tailwind 3 to 4:**
```javascript
// BEFORE: tailwind.config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#1a1a1a',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), seasonalStylesPlugin]
}
```

```css
/* AFTER: src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-brand: #1a1a1a;
}

@plugin "tailwindcss-animate";
@plugin "../plugins/tailwind/seasonalStylesPlugin.ts";
```

### Pattern 2: Plugin Chain Consolidation

**What:** Replace multiple PostCSS plugins with consolidated Vite plugins.

**When to use:** When migrating to Tailwind 4, which handles PostCSS internally.

**Trade-offs:**
- **Pros:** Fewer dependencies, better performance, simplified config
- **Cons:** Less granular control over PostCSS pipeline

**Example:**
```javascript
// BEFORE: astro.config.mjs + postcss.config.cjs
vite: {
  css: {
    postcss: {
      plugins: [tailwindcssNesting()]
    }
  }
}
// + separate postcss.config.cjs with autoprefixer, postcss-preset-env

// AFTER: astro.config.mjs only
import tailwindcss from "@tailwindcss/vite";

integrations: [mdx(), sitemap(...), robotsTxt(...), tailwindcss()],
// PostCSS handled internally by Tailwind 4
```

### Pattern 3: Content Collections API Migration

**What:** Migrate from Content Collections v2.0 (legacy) to Content Layer API.

**When to use:** Required for Astro 5 (can use legacy flag temporarily).

**Trade-offs:**
- **Pros:** Better performance, more flexible data loading, improved caching
- **Cons:** Breaking API changes, file relocation, new patterns

**Example:**
```typescript
// BEFORE: src/content/config.ts
import { z, defineCollection } from 'astro:content'

const projects = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image().refine(...),
  })
})

export const collections = { projects }

// Access via: entry.slug
```

```typescript
// AFTER: src/content.config.ts (new location)
import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image().refine(...),
  })
})

export const collections = { projects }

// Access via: entry.id (not slug)
```

### Pattern 4: Ref Forwarding Elimination

**What:** Remove `forwardRef` wrappers in React components, use `ref` as a regular prop.

**When to use:** React 19 migration - all function components support ref directly.

**Trade-offs:**
- **Pros:** Simpler component code, less boilerplate, better DX
- **Cons:** Breaking change for component APIs, requires refactor

**Example:**
```typescript
// BEFORE: React 18
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>
  }
)

// AFTER: React 19
const Button = ({ children, ref, ...props }: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => {
  return <button ref={ref} {...props}>{children}</button>
}
```

### Pattern 5: ESLint Configuration Flattening

**What:** Convert from eslintrc hierarchy to flat config array.

**When to use:** ESLint 9 migration (required).

**Trade-offs:**
- **Pros:** More explicit, easier debugging, better for monorepos
- **Cons:** More verbose, requires import all plugins

**Example:**
```javascript
// BEFORE: .eslintrc.cjs
module.exports = {
  extends: ['plugin:astro/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
    }
  ]
}

// AFTER: eslint.config.js
import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro']
      }
    },
    plugins: { astro },
    rules: astro.configs.recommended.rules
  }
]
```

## Data Flow Changes

### Pre-Migration Build Flow
```
Source Files
    ↓
Astro 4 Compiler → Vite 5 → TypeScript 5.9
    ↓                ↓
React 18 Islands    PostCSS → Tailwind 3 → autoprefixer
    ↓                         ↓
Static HTML + Islands JS + Bundled CSS
    ↓
ESLint 8 (post-check)
```

### Post-Migration Build Flow
```
Source Files
    ↓
Astro 5 Compiler → Vite 6 → TypeScript 5.9+
    ↓                ↓
React 19 Islands    @tailwindcss/vite → Tailwind 4 CSS
    ↓                         ↓
Static HTML + Islands JS + Optimized CSS
    ↓
ESLint 9 (flat config check)
```

### Key Data Flow Changes

1. **Content Collections Access:** `entry.slug` → `entry.id`, async `render()` function
2. **Tailwind Processing:** PostCSS chain → Vite plugin direct processing
3. **React Refs:** `forwardRef` wrapper → direct `ref` prop
4. **MDX Rendering:** Astro JSX processor → MDX self-rendering
5. **Script Hoisting:** Auto-hoist to `<head>` → explicit placement (no hoist)

## Migration Order & Dependencies

### Critical Path Analysis

```
Phase 1: Foundation (no dependencies)
├── TypeScript (minor updates)
└── ESLint 9 (flat config)

Phase 2: Build System (depends on Phase 1)
└── Astro 5 + Vite 6
    ├── Requires: Vite 6 compatibility check
    └── Enables: Content Layer API, new integrations

Phase 3: UI Framework (depends on Phase 2)
└── React 19
    ├── Requires: Astro 5 with updated @astrojs/react integration
    └── Enables: Ref as prop, new JSX features

Phase 4: Styling (depends on Phase 2)
└── Tailwind 4
    ├── Requires: Astro 5 + Vite 6 for @tailwindcss/vite plugin
    ├── Conflicts: @astrojs/tailwind integration (remove)
    └── Removes: postcss.config.cjs, tailwind.config.cjs
```

### Dependency Justification

| Migration | Must Come After | Reason |
|-----------|-----------------|--------|
| Astro 5 | TypeScript minor updates | Astro 5 requires specific TS config structure |
| Astro 5 | ESLint 9 (optional but recommended) | New file structure easier with flat config |
| React 19 | Astro 5 | Requires @astrojs/react 4.x+ which needs Astro 5 |
| Tailwind 4 | Astro 5 + Vite 6 | Requires @tailwindcss/vite plugin (Vite 5+) |
| Tailwind 4 | React 19 (optional but safer) | Avoids double-refactoring React components |

### Build Order Considerations

**Sequential (cannot parallelize):**
1. Astro 5 migration (blocks React 19, Tailwind 4)
2. Content Collections migration (requires Astro 5)
3. Integration updates (requires Astro 5)

**Parallel (can be done independently after Astro 5):**
- React 19 migration
- Tailwind 4 migration
- ESLint 9 migration (can even be done before Astro 5)

**Recommended order:**
```
1. TypeScript updates (quick wins)
2. ESLint 9 flat config (independent)
3. Astro 5 + Vite 6 (critical path)
   ├── Update integrations
   └── Migrate content collections
4. React 19 (parallel option A)
5. Tailwind 4 (parallel option B)
6. Final testing & cleanup
```

## Configuration File Changes

### Files to Modify

| File | Change Type | Pre-Migration | Post-Migration |
|------|-------------|---------------|----------------|
| `astro.config.mjs` | **MODIFY** | Astro 4 syntax | Astro 5 syntax, new integrations |
| `tsconfig.json` | **MODIFY** | astro/tsconfigs/strict | Include .astro/types.d.ts |
| `.eslintrc.cjs` | **DELETE & REPLACE** | eslintrc format | eslint.config.js (flat) |
| `tailwind.config.cjs` | **DELETE** | JS config | Removed (CSS config in global.css) |
| `postcss.config.cjs` | **DELETE** | PostCSS plugins | Handled by @tailwindcss/vite |
| `src/content/config.ts` | **MOVE & MODIFY** | Legacy API | src/content.config.ts (Content Layer) |
| `src/styles/global.css` | **MODIFY** | @tailwind directives | @import "tailwindcss" + @theme |
| `package.json` | **MODIFY** | Old versions | New major versions |

### New Files Created

| File | Purpose | Example Content |
|------|---------|-----------------|
| `eslint.config.js` | ESLint 9 flat config | Export default array of config objects |
| `src/content.config.ts` | Content Layer API config | Moved from src/content/config.ts |
| `.astro/types.d.ts` | Auto-generated types | Created by Astro 5 (git-ignored) |

### Example: astro.config.mjs Changes

```javascript
// BEFORE: Astro 4
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind"; // OLD INTEGRATION
import tailwindcssNesting from 'tailwindcss/nesting';

export default defineConfig({
  integrations: [mdx(), react(), tailwind()],
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcssNesting()]
      }
    }
  }
});

// AFTER: Astro 5
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite"; // NEW VITE PLUGIN

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    tailwindcss() // Vite plugin in integrations array
  ],
  // Removed vite.css.postcss config - handled by Tailwind 4
});
```

## Integration-Specific Changes

### Astro 5 Integration Points

**Breaking changes affecting integrations:**
- `@astrojs/mdx` must upgrade to v4.0.0+
- `@astrojs/react` must upgrade to v4.x+ for React 19 support
- `@astrojs/tailwind` deprecated for Tailwind 4 (use @tailwindcss/vite)
- `@astrojs/sitemap` requires i18n config review (locale handling)

**Content Collections integration:**
- Move `src/content/config.ts` → `src/content.config.ts`
- Update imports: `getCollection()` returns different order (must sort manually)
- Update access: `entry.slug` → `entry.id`
- Add `loader` property to each collection definition

### React 19 Integration Points

**Component API changes:**
- Remove all `forwardRef` wrappers
- Update ref callback cleanup functions (explicit return)
- Remove `propTypes` and `defaultProps` from function components
- Update TypeScript: `useRef()` now requires argument

**Astro-React boundary:**
- No changes to `client:*` directives
- JSX transform handled automatically by Vite 6
- Ref props work across Astro-React boundary

### Tailwind 4 Integration Points

**Plugin system changes:**
- Custom plugins: `require('./plugin.js')` → `@plugin "./plugin.ts"` in CSS
- `tailwindcss-animate`: Compatible via `@plugin "tailwindcss-animate"`
- `tailwind-scrollbar`: Check v4 compatibility (may need fork/alternative)
- Custom `seasonalStylesPlugin`: Migrate to Tailwind 4 plugin API

**Nesting syntax:**
- Remove `tailwindcssNesting` from PostCSS config
- Nesting now built-in to Tailwind 4

**Dark mode:**
- `darkMode: ['class']` → `@media (prefers-color-scheme: dark)` or continue using class strategy via CSS

### ESLint 9 Integration Points

**Parser integration:**
- `@typescript-eslint/parser`: Import and assign to `languageOptions.parser`
- `astro-eslint-parser`: Import and assign per-file-pattern
- Remove `parserOptions.tsconfigRootDir` (use absolute path in `project`)

**Plugin integration:**
- `eslint-plugin-astro`: Import and use in `plugins` object
- `eslint-plugin-jsx-a11y`: Import and apply to React/JSX files
- Verify all plugins are ESLint 9 compatible (check npm versions)

## Anti-Patterns

### Anti-Pattern 1: Migrating All Dependencies Simultaneously

**What people do:** Update all major versions at once in package.json and run npm install.

**Why it's wrong:** Cannot isolate which migration caused build failures. Debugging becomes exponentially harder with each simultaneous change.

**Do this instead:** Sequential migration with testing checkpoints. Commit after each successful phase.

### Anti-Pattern 2: Keeping Old Config Files

**What people do:** Keep `tailwind.config.cjs` alongside new CSS config "just in case."

**Why it's wrong:** Tailwind 4 may load both configs causing conflicts. ESLint 9 will ignore `.eslintrc.cjs` but it causes confusion.

**Do this instead:** Delete old config files after migration is confirmed working. Use git to recover if needed.

### Anti-Pattern 3: Ignoring Content Collections Migration

**What people do:** Enable `legacy.collections` flag and defer migration indefinitely.

**Why it's wrong:** Future Astro updates may remove legacy support. Performance improvements lost. Technical debt accumulates.

**Do this instead:** Migrate to Content Layer API as part of Astro 5 migration. It's a one-time cost with long-term benefits.

### Anti-Pattern 4: Manual Codemod Changes

**What people do:** Manually update React components for ref changes without using codemods.

**Why it's wrong:** Time-consuming, error-prone, misses edge cases that codemods catch.

**Do this instead:** Run official codemods first, then handle remaining edge cases manually.

```bash
# React 19 codemod
npx codemod@latest react/19/migration-recipe

# TypeScript React codemod
npx types-react-codemod@latest preset-19 ./src
```

### Anti-Pattern 5: Skipping React 18.3 Intermediate Step

**What people do:** Jump directly from React 18.2.0 to React 19.0.0.

**Why it's wrong:** React 18.3 provides deprecation warnings that help identify issues before they become breaking errors.

**Do this instead:** Upgrade to React 18.3 first, fix warnings, then upgrade to React 19.

## Testing Strategy for Migration

### Build-Time Verification

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| TypeScript compilation | `npm run build` (includes astro check) | No type errors |
| Astro build | `npm run build` | Static site generates successfully |
| Content collections | `astro sync` | .astro/types.d.ts generated |
| ESLint | `npm run lint` | No lint errors |
| Development server | `npm run dev` | Server starts without errors |

### Runtime Verification

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| React islands hydration | Browser DevTools | No hydration errors |
| Tailwind styles | Visual inspection | Styles render correctly |
| Dark mode | Toggle dark mode | Theme switches properly |
| Locale routing | Visit /en, /pt, /gl | Routes resolve correctly |
| Content collections | Visit project pages | Projects load and render |
| React refs | Inspect interactive components | Refs attach to DOM elements |

### Integration Points Testing

| Integration | Test Case | Expected Behavior |
|-------------|-----------|-------------------|
| Astro + React | `<ReactComponent client:load />` | Hydrates on page load |
| Astro + MDX | MDX content rendering | Markdown + JSX both work |
| Tailwind + React | Tailwind classes in .tsx | Styles apply correctly |
| Content + i18n | Multi-locale content | Content loads per locale |
| Sitemap + i18n | Generated sitemap.xml | Includes all locale URLs |

## Rollback Strategy

### Per-Phase Rollback Points

```
Commit 1: TypeScript updates
  ├─ Rollback: git revert <commit>
  └─ Risk: Low (minor updates)

Commit 2: ESLint 9 flat config
  ├─ Rollback: git checkout <commit-1> -- .eslintrc.cjs eslint.config.js
  └─ Risk: Low (linting only)

Commit 3: Astro 5 + Vite 6
  ├─ Rollback: git revert <commit>, npm install
  └─ Risk: HIGH (affects build system)

Commit 4: Content Collections migration
  ├─ Rollback: git revert <commit>, restore src/content/config.ts
  └─ Risk: Medium (content loading)

Commit 5: React 19
  ├─ Rollback: git revert <commit>, npm install react@18
  └─ Risk: Medium (component changes)

Commit 6: Tailwind 4
  ├─ Rollback: git revert <commit>, restore configs, npm install
  └─ Risk: Medium (styling changes)
```

### Emergency Rollback (Full Revert)

```bash
# Return to pre-migration state
git reset --hard <commit-before-migration>
npm install
npm run build
```

## Sources

### Official Documentation
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [ESLint Configuration Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)

### Integration-Specific Documentation
- [Astro + React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Tailwind 4 with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [ESLint Flat Config for CommonJS](https://tsmx.net/migrating-eslintrc-to-flat-config-in-commonjs/)

### Migration Guides & Best Practices
- [Astro Content Collections v4 to v5 Migration](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/)
- [Tailwind v4 Migration Guide](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)
- [React 19 Migration Codemod](https://docs.codemod.com/guides/migrations/react-18-19)
- [Automated Astro Dependencies Update](https://www.56kode.com/posts/automated-astro-dependencies-update-cursor-claude/)

### Community Resources
- [Upgrading AstroPaper from v4 to v5](https://rebecca-powell.com/posts/upgrade-astropaper-v5/)
- [Tailwind v4 with Astro Setup](https://dipankarmaikap.com/how-to-use-tailwind-css-v4-in-astro/)
- [Astro 5 Migration Blog](https://www.dabiddo.net/blog/astro_5_migration/)

---
*Architecture research for: Astro Portfolio Major Dependency Migration*
*Researched: 2026-02-10*
*Confidence: HIGH*
