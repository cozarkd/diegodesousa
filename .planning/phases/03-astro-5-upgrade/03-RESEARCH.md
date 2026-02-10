# Phase 3: Astro 5 Upgrade - Research

**Researched:** 2026-02-10
**Domain:** Astro framework upgrade, Content Layer API migration, Vite 6 integration
**Confidence:** HIGH

## Summary

Astro 5.0 represents a significant architectural shift, introducing the Content Layer API to replace the legacy v2.0 Content Collections system. The upgrade path is well-documented with clear migration steps, though it requires careful attention to breaking changes in content configuration, rendering patterns, and integration versions. The most impactful changes involve moving content configuration files, replacing `.render()` method calls with the imported `render()` function, and updating dynamic route parameters from `slug` to `id`.

Performance improvements are substantial: Markdown builds are 5x faster, MDX 2x faster, with 25-50% less memory usage compared to Astro 4. The new Content Layer API decouples content location from the `src/content/` directory, enabling more flexible content sourcing while maintaining type safety.

Critical integrations require major version updates: @astrojs/mdx must upgrade to v4+ (handles JSX internally), @astrojs/react to v4+, while @astrojs/sitemap remains at v3.7+ (no v4 exists). Vite 6.0 brings breaking changes to custom plugins and build configuration that may require attention.

**Primary recommendation:** Migrate content collections to Content Layer API immediately rather than using the `legacy.collections` flag, as Astro 6 (currently in beta) will remove legacy support entirely.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^5.0.0+ | Core framework | Required for Content Layer API, Vite 6, performance improvements |
| @astrojs/mdx | ^4.0.0+ | MDX integration | Moved JSX handling from core to integration, required for Astro 5 |
| @astrojs/react | ^4.2.0+ | React integration | Updated for Astro 5 compatibility |
| @astrojs/sitemap | ^3.7.0 | Sitemap generation | Latest version (no v4 exists), actively maintained for Astro 5+ |
| zod | ^4.0.0+ | Schema validation | Already upgraded in Phase 2, required for Content Layer schemas |
| vite | 6.0.0 | Build tool | Bundled with Astro 5, brings breaking changes to plugins |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/check | ^0.9.6+ | Type checking | Run via `astro check` command, validates TypeScript across project |
| sharp | ^0.34.0+ | Image optimization | Required for Astro 5 (Squoosh removed), already standard for production |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Content Layer API | `legacy.collections` flag | Temporary postponement only — Astro 6 removes legacy support entirely |
| Immediate migration | Gradual (mixed legacy + new) | Both can coexist temporarily, but increases complexity and technical debt |

**Installation:**

```bash
# Use Astro's official upgrade tool (recommended)
npx @astrojs/upgrade

# Or manual upgrade
npm install astro@latest @astrojs/mdx@latest @astrojs/react@latest @astrojs/sitemap@latest
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── content.config.ts      # NEW LOCATION (was src/content/config.ts)
├── content/
│   └── projects/          # Collections can still live here
│       └── *.md
├── data/                  # NEW: Content can live anywhere now
│   └── blog/
│       └── *.mdx
├── components/
└── pages/
    └── [...id].astro      # RENAMED (was [...slug].astro)
```

### Pattern 1: Content Layer API Migration

**What:** Replace type-based collection definitions with loader-based definitions

**When to use:** All content collections in Astro 5+

**Example:**

```typescript
// OLD (Astro 4 - Legacy API)
// src/content/config.ts
import { z, defineCollection } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image().optional()
  })
})

export const collections = { projects }
```

```typescript
// NEW (Astro 5 - Content Layer API)
// src/content.config.ts
import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects'
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image().optional()
  })
})

export const collections = { projects }
```

**Source:** [Official Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)

### Pattern 2: Rendering Content with New API

**What:** Import `render()` function instead of calling `.render()` method on entries

**When to use:** All content rendering in Astro 5+

**Example:**

```typescript
// OLD (Astro 4)
---
import { getEntry } from 'astro:content'
const entry = await getEntry('blog', 'post-1')
const { Content } = await entry.render()
---
<Content />

// NEW (Astro 5)
---
import { getEntry, render } from 'astro:content'
const entry = await getEntry('blog', 'post-1')
const { Content } = await render(entry)
---
<Content />
```

**Source:** [Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/)

### Pattern 3: Dynamic Routes with ID

**What:** Replace `slug` parameter with `id` in dynamic routes

**When to use:** All dynamic content routes

**Example:**

```typescript
// OLD (Astro 4)
// src/pages/[...slug].astro
export async function getStaticPaths() {
  const entries = await getCollection('projects')
  return entries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry }
  }))
}
const { entry } = Astro.props

// NEW (Astro 5)
// src/pages/[...id].astro
export async function getStaticPaths() {
  const entries = await getCollection('projects')
  return entries.map(entry => ({
    params: { id: entry.id },
    props: { entry }
  }))
}
const { entry } = Astro.props
```

**Source:** [Migrating content collections from Astro 4 to 5](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/)

### Pattern 4: Glob Loader Configuration

**What:** Configure glob patterns to load content from filesystem

**When to use:** Local Markdown/MDX content collections

**Example:**

```typescript
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.(md|mdx)',      // Match .md and .mdx files
    base: './src/data/blog',       // Base directory (can be anywhere)
    // Optional: custom ID generation
    generateId: ({ entry, base }) => {
      return entry.replace(/^.*\//, '').replace(/\.(md|mdx)$/, '')
    }
  }),
  schema: z.object({ /* ... */ })
})
```

**Source:** [Astro Content Loader API Reference](https://docs.astro.build/en/reference/content-loader-reference/)

### Pattern 5: TypeScript Configuration Update

**What:** Update tsconfig.json to use new Astro 5 type generation

**When to use:** All Astro 5 projects

**Example:**

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Remove or ignore legacy `src/env.d.ts` as types are now auto-generated in `.astro/types.d.ts`.

**Source:** [Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/)

### Anti-Patterns to Avoid

- **Using `entry.slug` instead of `entry.id`:** The slug field no longer exists in Content Layer API entries. Use `entry.id` for routing.

- **Calling `.render()` as a method:** Entries are now plain serializable objects without methods. Import and call `render(entry)` instead.

- **Keeping config in `src/content/config.ts`:** File must move to `src/content.config.ts` for Content Layer API to work.

- **Accessing `astro:content` client-side:** Removed in Astro 5. Pass needed data through props to client components.

- **Using `layout` in Markdown frontmatter:** This field is deprecated. Import layout components directly in route files.

- **Prefixing entry files with underscore (`_`):** No longer prevents route building. Use `isDraft` field in schema and filter with `getCollection()` instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content collection migration | Custom content parsing system | Content Layer API loaders | Handles caching, incremental updates, and type safety automatically |
| Image optimization | Custom Sharp wrappers | Astro's built-in `Image` component | Handles responsive images, formats, lazy loading, and optimization |
| Markdown rendering | Custom MD/MDX processors | `render()` function from `astro:content` | Handles frontmatter, heading extraction, and remark/rehype plugins |
| Route generation | Custom static path builders | `getStaticPaths()` with `getCollection()` | Type-safe, optimized for build performance |
| Schema validation | Manual type checking | Zod schemas in `defineCollection()` | Runtime validation + TypeScript inference |

**Key insight:** The Content Layer API is fundamentally about separation of concerns — it handles data fetching, caching, and incremental updates so you can focus on schemas and presentation. Custom solutions miss critical edge cases around build-time caching, HMR updates, and deterministic builds.

## Common Pitfalls

### Pitfall 1: 404 Errors After Migration Due to Slug/ID Mismatch

**What goes wrong:** Dynamic route files still use `[...slug].astro` filename but entries now provide `id` instead of `slug`, causing route matching to fail.

**Why it happens:** The Content Layer API changed the primary identifier field from `slug` to `id`, but route filenames don't automatically update.

**How to avoid:**
1. Rename `[...slug].astro` to `[...id].astro`
2. Update `getStaticPaths()` to use `entry.id` instead of `entry.slug`
3. Update any frontmatter or data references from `slug` to `id`

**Warning signs:**
- 404 errors on previously working content routes
- `getStaticPaths()` returning params that don't match URL structure
- TypeScript errors about missing `slug` property

**Source:** [Migrating content collections from Astro 4 to 5](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/)

### Pitfall 2: MDX Files Not Rendering After Upgrade

**What goes wrong:** MDX content fails to render or shows JSX syntax errors after upgrading to Astro 5.

**Why it happens:** Astro 5 moved JSX handling from core to the @astrojs/mdx integration. Old integration versions are incompatible.

**How to avoid:**
1. Upgrade @astrojs/mdx to v4.0.0 or later immediately
2. Update import for MDX server renderer: `"@astrojs/mdx/server.js"` (was `"astro/jsx/server.js"`)
3. Verify MDX integration is properly registered in astro.config.mjs

**Warning signs:**
- MDX files not processing JSX
- Build errors about missing JSX handlers
- Import errors for `astro/jsx/server.js`

**Source:** [Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/)

### Pitfall 3: Form Submission Confirmation Dialogs on Refresh

**What goes wrong:** After submitting forms, users see "Confirm form resubmission?" browser dialog when refreshing the page.

**Why it happens:** Astro 5 removed automatic cookie-based redirects for form actions. Forms now render results as POST responses without forwarding, leaving the page in POST state.

**How to avoid:**
1. Implement client-side form handling (as currently done in project with Web3Forms)
2. Use `Astro.getActionResult()` for server actions
3. Manually redirect using `redirect()` from action handlers if needed
4. Store results in session storage via middleware for persistence

**Warning signs:**
- Browser resubmission dialogs appearing
- Form state persisting after refresh
- Users accidentally resubmitting forms

**Note:** Current project already uses client-side fetch for forms, so this pitfall is avoided.

**Source:** [Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/)

### Pitfall 4: Type Checking Fails After Migration

**What goes wrong:** `astro check` reports TypeScript errors about missing types or incorrect imports after upgrading.

**Why it happens:** Astro 5 changed type generation from `src/env.d.ts` to auto-generated `.astro/types.d.ts`.

**How to avoid:**
1. Update `tsconfig.json` to include `.astro/types.d.ts`
2. Remove manual type references from `src/env.d.ts`
3. Run `astro sync` to regenerate types after config changes
4. Update `include`/`exclude` arrays to prevent checking build artifacts

**Warning signs:**
- `astro check` errors about missing module declarations
- IDE showing import errors for `astro:content`
- Incorrect type inference for collection entries

**Source:** [TypeScript - Astro Docs](https://docs.astro.build/en/guides/typescript/)

### Pitfall 5: Build Performance Regression with Large Collections

**What goes wrong:** Build times increase or memory usage spikes with large content collections despite Astro 5's promised performance improvements.

**Why it happens:** Default glob loader behavior includes `retainBody: true`, storing raw file contents in addition to rendered HTML, bloating the data store for large collections.

**How to avoid:**
1. Set `retainBody: false` in glob loader config for large collections
2. Only retain body if you need access to `entry.body` at runtime
3. Monitor data store size in `.astro/data-store.json`

**Warning signs:**
- Unexpectedly large build artifacts
- Memory pressure during builds
- Slower than expected build times despite claims of 5x improvement

**Source:** [Astro 5.17 Release Notes](https://astro.build/blog/astro-5170/)

### Pitfall 6: CSRF Errors on Form Submissions

**What goes wrong:** Forms fail to submit with CSRF or origin errors after upgrading.

**Why it happens:** Astro 5 enables CSRF protection by default (`security.checkOrigin: true`).

**How to avoid:**
1. Ensure forms submit to same origin or configure allowed origins
2. Use correct `Content-Type` headers for form submissions
3. Update to Astro 5+ (4.16.17 fixed CSRF bypass vulnerability)
4. For external form services (like Web3Forms), ensure proper CORS configuration

**Warning signs:**
- Console errors about origin mismatch
- Forms submitting but getting rejected by server
- CSRF token validation failures

**Note:** Current project uses external Web3Forms service, which handles CORS correctly.

**Source:** [Astro CSRF Middleware Advisory](https://github.com/withastro/astro/security/advisories/GHSA-c4pw-33h3-35xw)

### Pitfall 7: Vite Plugin Compatibility Issues

**What goes wrong:** Custom Vite plugins fail or cause build errors after Astro 5 upgrade.

**Why it happens:** Astro 5 upgrades to Vite 6.0, which has breaking changes in plugin API and build conditions.

**How to avoid:**
1. Review [Vite 6 Migration Guide](https://vite.dev/guide/migration) before upgrading
2. Update custom Vite plugins to Vite 6 compatibility
3. Check build configuration for deprecated options
4. Test dev server and build separately

**Warning signs:**
- Plugin initialization errors
- Build failures with Vite-related stack traces
- Dev server not starting or HMR broken

**Source:** [Vite 6.0 Migration Guide](https://vite.dev/guide/migration)

## Code Examples

Verified patterns from official sources:

### Complete Content Collection Migration

```typescript
// src/content.config.ts
import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects'
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    link: z.string().optional(),
    video: z.string().optional(),
    cover: image().refine((img) => img.width >= 300, {
      message: 'Cover image must be at least 300 pixels wide!'
    }).optional(),
    tags: z.array(z.object({
      name: z.string(),
      class: z.string(),
      icon: z.any().optional()
    })),
    isDraft: z.boolean(),
    github: z.string().optional(),
    language: z.string()
  })
})

export const collections = { projects }
```

**Source:** [Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/)

### Query and Render Content

```typescript
---
// src/components/sections/ProjectsSection.astro
import { getCollection, render } from 'astro:content'
import { Image } from 'astro:assets'

// Get all projects
const projects = await getCollection('projects')

// Filter by locale and draft status
const filteredProjects = projects
  .filter((project) =>
    project.data.language === Astro.currentLocale &&
    !project.data.isDraft
  )

// For rendering individual entries (if needed)
// const entry = await getEntry('projects', 'my-project')
// const { Content, headings } = await render(entry)
---

<div>
  {filteredProjects.map((project) => (
    <article>
      <h3>{project.data.title}</h3>
      {project.data.cover && (
        <Image
          src={project.data.cover}
          alt={project.data.title}
        />
      )}
    </article>
  ))}
</div>
```

**Source:** Current project structure adapted for Astro 5

### Dynamic Route Generation

```typescript
---
// src/pages/projects/[...id].astro
import { getCollection, getEntry, render } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

export async function getStaticPaths() {
  const projects = await getCollection('projects')
  return projects
    .filter(p => !p.data.isDraft)
    .map(entry => ({
      params: { id: entry.id },
      props: { entry }
    }))
}

type Props = {
  entry: CollectionEntry<'projects'>
}

const { entry } = Astro.props
const { Content, headings } = await render(entry)
---

<article>
  <h1>{entry.data.title}</h1>
  <Content />
</article>
```

**Source:** [Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/)

### Optimized Glob Loader for Large Collections

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    retainBody: false  // Reduce data store size (Astro 5.17+)
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string()
  })
})
```

**Source:** [Astro 5.17 Release](https://astro.build/blog/astro-5170/)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `type: 'content'` in collection config | `loader: glob()` with explicit patterns | Astro 5.0 (Dec 2024) | Content can live anywhere, not just `src/content/` |
| `entry.render()` method | `render(entry)` imported function | Astro 5.0 | Entries are serializable plain objects |
| `entry.slug` for routing | `entry.id` for routing | Astro 5.0 | More predictable IDs, custom generation supported |
| `src/content/config.ts` location | `src/content.config.ts` location | Astro 5.0 | Separates content config from content directory |
| Squoosh image service | Sharp (required) | Astro 5.0 | Better performance, active maintenance |
| `output: 'hybrid'` mode | Merged into `output: 'static'` | Astro 5.0 | Simplified configuration |
| `Astro.glob()` for imports | `import.meta.glob()` (Vite native) | Astro 5.0 | Better Vite integration, standard API |
| Manual type generation | Auto-generated `.astro/types.d.ts` | Astro 5.0 | Automatic, always in sync |
| Cookie-based form redirects | POST response or manual redirect | Astro 5.0 | Removes 4KB cookie limit, better UX control |

**Deprecated/outdated:**
- **Squoosh image service:** Removed entirely, replaced by Sharp
- **`legacy.collections` flag:** Temporary only, Astro 6 removes support
- **`layout` frontmatter field:** Deprecated, import layouts directly
- **Underscore prefix for unpublished files:** Use schema fields instead
- **Client-side `astro:content` access:** Never officially supported, now removed

## Open Questions

1. **HMR Stability in Astro 5**
   - What we know: Historical issues with HMR across Astro versions, some integration-specific problems
   - What's unclear: Current state of HMR reliability with Astro 5 + Vite 6 in February 2026
   - Recommendation: Test HMR thoroughly during development, especially with React integration

2. **i18n Routing Changes in Astro 5**
   - What we know: i18n routing exists and is documented, middleware-based implementation
   - What's unclear: Whether Astro 5 introduced any breaking changes to i18n configuration
   - Recommendation: Verify current i18n config is compatible, test all 4 locale routes (es, en, pt, gl)

3. **Third-Party Integration Compatibility**
   - What we know: Some integrations like @vite-pwa/astro may not support Astro 5 yet
   - What's unclear: Current compatibility status of project integrations (astro-fathom, astro-navbar, astro-robots-txt)
   - Recommendation: Test each integration after upgrade, check for Astro 5 compatibility notices

4. **Vite 6 Plugin Impact**
   - What we know: Vite 6 has breaking changes to plugin API and build conditions
   - What's unclear: Whether project's current Vite configuration or plugins need updates
   - Recommendation: Review current vite config (uses tailwindcssNesting), test build pipeline

## Sources

### Primary (HIGH confidence)

- [Upgrade to Astro v5 | Docs](https://docs.astro.build/en/guides/upgrade-to/v5/) - Official upgrade guide with breaking changes
- [Content Layer: A Deep Dive | Astro](https://astro.build/blog/content-layer-deep-dive/) - Architecture and design decisions
- [Astro Content Loader API Reference](https://docs.astro.build/en/reference/content-loader-reference/) - Complete API documentation for glob loader
- [Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) - getCollection, getEntry, render API
- [Vite 6.0 Migration Guide](https://vite.dev/guide/migration) - Official Vite breaking changes
- [@astrojs/mdx | Docs](https://docs.astro.build/en/guides/integrations-guide/mdx/) - MDX integration documentation
- [@astrojs/react | Docs](https://docs.astro.build/en/guides/integrations-guide/react/) - React integration documentation

### Secondary (MEDIUM confidence)

- [Migrating content collections from Astro 4 to 5 | Chen Hui Jing](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/) - Real-world migration experience
- [Upgrading to Astro v5 from v4 | ponktoku.dev](https://www.ponktoku.dev/en/blog/upgrading-to-astro-v5-from-v4/) - Community migration guide
- [Astro 5.17 Release Notes](https://astro.build/blog/astro-5170/) - retainBody option documentation
- [Astro CSRF Middleware Advisory](https://github.com/withastro/astro/security/advisories/GHSA-c4pw-33h3-35xw) - Security fix details

### Tertiary (LOW confidence)

- Various GitHub issues about HMR - Historical context, not Astro 5 specific
- Community blog posts about migration - Varied quality, useful for real-world context

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs and npm registry data confirm versions
- Architecture: HIGH - Official migration guide and API reference provide clear patterns
- Pitfalls: MEDIUM-HIGH - Mix of official docs (HIGH) and community experience (MEDIUM)
- Performance claims: HIGH - Official Astro blog with benchmarks
- Integration compatibility: MEDIUM - Based on npm versions and community reports

**Research date:** 2026-02-10
**Valid until:** 2026-03-12 (30 days - stable framework)

**Notes:**
- Astro 6 is currently in beta (as of Feb 2026), will remove legacy collections entirely
- Project currently uses Astro 4.5.4, Zod 4.3.6 (upgraded in Phase 2)
- Content collections use simple schema, migration should be straightforward
- Form handling already client-side (Web3Forms), avoids Astro Actions pitfalls
- No custom Vite plugins beyond tailwindcssNesting (should be compatible)
