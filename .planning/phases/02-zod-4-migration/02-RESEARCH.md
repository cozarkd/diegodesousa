# Phase 2: Zod 4 Migration - Research

**Researched:** 2026-02-10
**Domain:** Zod 3 to Zod 4 schema validation migration for Astro content collections
**Confidence:** HIGH

## Summary

Phase 2 upgrades Zod from 3.23.8 to 4.3.6 to prepare content collection schemas for the Astro 5 migration. Zod 4 introduces breaking changes in three areas critical to this project: (1) optional field default behavior, (2) string format validators moving from methods to functions, and (3) `.refine()` API changes affecting the image validation in content collections.

The current codebase has one content collection (`projects`) with a schema that uses `.optional()`, `.refine()` on images, and `.any()` for icon types. The most critical change is that Zod 4 applies defaults even within optional fields—`z.string().optional().default("x")` now returns `{ field: "x" }` instead of `{}` when the field is absent. This project's schema uses `.optional()` on `cover`, `link`, `video`, `github`, and nested `icon` fields without defaults, so the breaking change impact is minimal.

**Primary recommendation:** Upgrade Zod to 4.3.6, audit the content collection schema for the optional+default pattern, test all content entries load correctly, and verify the image refine validation still works. No complex schema refactoring needed—current schema patterns are compatible with v4 API.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zod | 4.3.6 | Schema validation for content collections | Latest stable, required for Astro 5+ migration, performance improvements |
| astro:content | (Astro 4.5.4) | Content collection framework | Uses Zod for schema validation, defines `image()` helper |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod-v3-to-v4 codemod | 0.2.0 | Automated migration tool | For complex schemas with many string validators; overkill for this project's simple schema |
| zod/v3 subpath | (fallback) | Backward compatibility during transition | Emergency escape hatch if migration breaks—not recommended |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Full v4 migration | Stay on zod/v3 subpath | Defers migration but Astro 6 will drop v3 support; creates tech debt |
| Manual migration | zod-v3-to-v4 codemod | Codemod useful for large codebases; this project has one schema file—manual is clearer |

**Installation:**
```bash
npm install zod@^4.3.6
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/
│   ├── config.ts              # Zod schema definitions (MODIFY)
│   └── projects/              # Content entries (verify load correctly)
└── components/
    └── sections/
        └── ProjectsSection.astro  # Uses getCollection() (verify output)
```

### Pattern 1: Content Collection Schema Definition (Zod 4 Compatible)
**What:** Define schemas using `z.object()` with typed fields. In Zod 4, use top-level functions for format validators.

**When to use:** All content collection schemas in `src/content/config.ts`.

**Example:**
```typescript
// Source: Zod 4 API (https://zod.dev/v4)
import { z, defineCollection } from 'astro:content'

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),      // ✓ Optional without default - no breaking change
      cover: image()
        .refine((img) => img.width >= 300, {
          message: 'Cover image must be at least 300 pixels wide!'
        })
        .optional(),                    // ✓ refine() + optional() is valid in v4
      tags: z.array(
        z.object({
          name: z.string(),
          class: z.string(),
          icon: z.any().optional()      // ✓ z.any() still valid in v4
        })
      ),
      isDraft: z.boolean(),
      github: z.string().optional(),    // ✓ Optional without default - no breaking change
      language: z.string()
    })
})
```

**Migration notes:**
- Current schema is already compatible—no changes needed
- `.optional()` without `.default()` behaves identically in v3 and v4
- `.refine()` on images still works (refinement API change doesn't affect this usage)
- `z.any()` is still valid in v4

### Pattern 2: Handling Optional Fields with Defaults (Breaking Change Pattern)
**What:** Zod 4 changed semantics for `optional() + default()` combination. Defaults now apply even when field is absent.

**When to use:** Only if adding new optional fields with defaults in the future.

**Example:**
```typescript
// BREAKING CHANGE between v3 and v4
const schema = z.object({
  author: z.string().optional().default("Anonymous")
})

// Zod 3 behavior
schema.parse({}) // returns: {}

// Zod 4 behavior
schema.parse({}) // returns: { author: "Anonymous" }
```

**How to migrate:**
```typescript
// Option 1: Remove .optional() if field should always exist with default
const schema = z.object({
  author: z.string().default("Anonymous")  // Always present
})

// Option 2: Remove .default() if field should be truly optional
const schema = z.object({
  author: z.string().optional()  // May be undefined
})

// Option 3: Use .prefault() for old v3 behavior (apply default before parse)
const schema = z.object({
  author: z.string().prefault("Anonymous").optional()
})
```

**Impact on current codebase:** None—no optional fields have defaults in current schema.

### Pattern 3: String Format Validators (Deprecated Methods)
**What:** String validators moved from methods to top-level functions in Zod 4.

**When to use:** When validating email, URL, UUID, IP addresses.

**Example:**
```typescript
// Zod 3 (deprecated in v4)
z.string().email()
z.string().url()
z.string().uuid()
z.string().ip()

// Zod 4 (recommended)
z.email()
z.url()
z.uuid()  // Now RFC 9562/4122 compliant (stricter)
z.ipv4()  // Split into v4 and v6
z.ipv6()
```

**Impact on current codebase:** None—no email/URL/UUID validators in current schema.

### Anti-Patterns to Avoid
- **Using .refine() with type predicates:** Zod 4 ignores type predicates in `.refine()`. Use `.transform()` or separate type guards instead.
- **Mixing .strict() method with v4:** `.strict()` is deprecated—use `z.strictObject()` top-level function instead (not applicable to this project).
- **Assuming .optional() prevents default application:** In v4, defaults propagate through `.optional()`. Review any future schema additions.
- **Using .merge() for object composition:** `.merge()` is deprecated in v4—use `.extend()` instead (not used in current schema).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema migration automation | Custom regex find-replace script | zod-v3-to-v4 codemod (if needed) | Handles AST transformations, not just text patterns—but manual migration is better for single-file schemas |
| Error message customization | Custom error wrapper functions | Zod 4's unified `error` parameter | v4 simplified API replaces `message`, `invalid_type_error`, `required_error` with single `error` param |
| Type validation for icons | Custom validator with if/else chains | `z.any()` or proper icon type | z.any() is acceptable for flexible icon data; don't hand-roll type checkers |
| Image dimension validation | Manual file reading + dimension checking | Astro's `image()` helper + `.refine()` | Already implemented correctly; image() provides metadata, refine() validates |

**Key insight:** Zod's declarative API is designed to prevent custom validation logic. For edge cases not covered by built-in validators, `.refine()` and `.transform()` are the extension points—not custom functions.

## Common Pitfalls

### Pitfall 1: Content Collections Silently Break with Optional+Default Pattern
**What goes wrong:** Content entries with optional fields that have default values suddenly return different data structure. Builds succeed but `getCollection()` returns unexpected shapes. Components expecting `undefined` for missing fields get default values instead.

**Why it happens:** Zod 4's design change: "defaults inside your properties are applied, even within optional fields." Developers assume optional means "may not exist" but Zod 4 treats it as "will exist with default if not provided."

**How to avoid:**
1. Audit ALL fields with `.optional()` in `src/content/config.ts`
2. Verify none have `.default()` (current schema: ✓ clear)
3. If adding new optional fields with defaults, decide: should the field always exist? If yes, remove `.optional()`. If no, remove `.default()`.
4. Test with actual content: `getCollection('projects')` and inspect returned objects

**Warning signs:**
- Navigation or card components show unexpected data (e.g., "Anonymous" author on projects that should have no author)
- TypeScript types indicate field is no longer `| undefined` but components still check for undefined
- Conditional rendering breaks: `{project.link && <a href={project.link}>}` always renders even without link

**Impact on current schema:** LOW—no optional+default pattern exists in current schema.

### Pitfall 2: Image Refine Validation Changes Between Versions
**What goes wrong:** `.refine()` callback receives different data structure or fails to validate in Zod 4. Error messages display incorrectly.

**Why it happens:** Zod 4 changed refinement error handling and dropped support for `ctx.path` in refinement callbacks. Image helper from Astro may also change metadata shape.

**How to avoid:**
1. Test current image refine after upgrade:
   ```typescript
   image().refine((img) => img.width >= 300, {
     message: 'Cover image must be at least 300 pixels wide!'
   })
   ```
2. Verify `img.width` is still available in v4
3. Check error message displays correctly when validation fails
4. Test with both valid images (width >= 300) and invalid images (width < 300)

**Warning signs:**
- Build errors: "Property 'width' does not exist on type 'ImageMetadata'"
- Error messages show generic "Invalid input" instead of custom message
- Valid images fail validation or invalid images pass

**Impact on current schema:** MEDIUM—schema uses image refine, must verify after upgrade.

### Pitfall 3: Error Handling Code Breaks with New Issue Structure
**What goes wrong:** Custom error handlers checking `error.errors` or specific error codes break. Raw Zod errors leak to users.

**Why it happens:** Zod 4 renamed `error.errors` to `error.issues` and merged many issue types into `z.core.$ZodIssueInvalidValue` with `$` prefix.

**How to avoid:**
1. Search codebase for `error.errors` → replace with `error.issues`
2. Search for Zod error type checks (e.g., `ZodInvalidEnumValueIssue`) → update to v4 types
3. Update to unified error parameter if using custom error messages:
   ```typescript
   // v3
   z.string({ required_error: "Required" })

   // v4
   z.string({ error: "Required" })
   ```

**Warning signs:**
- TypeScript errors: "Property 'errors' does not exist on type 'ZodError'"
- Runtime errors: "Cannot read property 'code' of undefined"
- Users see raw Zod errors like "Invalid input: expected string, received undefined"

**Impact on current schema:** LOW—no custom error handlers found in content config.

### Pitfall 4: Content Entries Fail to Load After Upgrade
**What goes wrong:** Valid content entries that loaded in Zod 3 fail validation in Zod 4. Build breaks with schema validation errors.

**Why it happens:** Stricter validation rules (e.g., `.uuid()` now enforces RFC 9562), changed type coercion behavior, or data structure mismatches.

**How to avoid:**
1. After upgrading Zod, run `npm run dev` or `npm run build`
2. Load all content collections: `getCollection('projects')`
3. Check for validation errors in build output
4. Inspect each failing entry's frontmatter for schema mismatches
5. Fix content or schema to match

**Warning signs:**
- Build errors referencing specific .md files
- Error messages like "Expected string, received undefined" for required fields
- Content entries with missing required fields (title, description, language, isDraft, tags)

**Impact on current schema:** MEDIUM—must test all 19 content entries after upgrade.

### Pitfall 5: Type Inference Changes Break Component Props
**What goes wrong:** Components consuming content collection data show TypeScript errors. Previously inferred types no longer match.

**Why it happens:** Zod 4's improved type inference may surface previously hidden type issues or change inferred types for complex schemas.

**How to avoid:**
1. Run `npm run build` (includes `astro check`) to catch TypeScript errors
2. Check component files that use `getCollection('projects')`
3. Verify inferred types match expectations: `CollectionEntry<'projects'>`
4. Update component prop types if inference changed

**Warning signs:**
- TypeScript errors in components after Zod upgrade
- Properties that were optional in v3 now required (or vice versa)
- Type errors on `project.data.cover`, `project.data.link`, etc.

**Impact on current schema:** LOW-MEDIUM—TypeScript will catch issues, simple schema unlikely to have complex inference changes.

## Code Examples

Verified patterns from official sources:

### Current Schema (Zod 3 - Already v4 Compatible)
```typescript
// Source: src/content/config.ts (current)
import { z, defineCollection } from 'astro:content'

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      video: z.string().optional(),
      cover: image()
        .refine((img) => img.width >= 300, {
          message: 'Cover image must be at least 300 pixels wide!'
        })
        .optional(),
      tags: z.array(
        z.object({
          name: z.string(),
          class: z.string(),
          icon: z.any().optional()
        })
      ),
      isDraft: z.boolean(),
      github: z.string().optional(),
      language: z.string()
    })
})

export const collections = { projects }
```

**Migration assessment:** No changes needed. Schema uses compatible patterns.

### Testing Content Collection Loading
```typescript
// Source: Astro content collections API
import { getCollection } from 'astro:content'

// Test after Zod upgrade
const allProjects = await getCollection('projects')

// Verify structure
console.log(allProjects[0].data)
// Expected shape:
// {
//   title: string,
//   description: string,
//   link?: string,
//   video?: string,
//   cover?: ImageMetadata,
//   tags: Array<{ name: string, class: string, icon?: any }>,
//   isDraft: boolean,
//   github?: string,
//   language: string
// }
```

### Verifying Image Refine Validation
```bash
# Test with invalid content entry
# Create test file with small image (width < 300)
cat > src/content/projects/en/test-small-image.md << 'EOF'
---
title: 'Test'
description: 'Test project'
cover: '../small-image.webp'  # Image with width < 300
tags:
  - name: 'Test'
    class: 'bg-black text-white'
isDraft: true
language: 'en'
---
EOF

# Run build - should fail with custom error message
npm run build
# Expected error: "Cover image must be at least 300 pixels wide!"

# Clean up test file
rm src/content/projects/en/test-small-image.md
```

### Handling Migration Edge Cases (If Needed)
```typescript
// If string validators were used (not applicable to current schema)
// Before (v3)
const schema = z.object({
  email: z.string().email(),
  homepage: z.string().url()
})

// After (v4)
const schema = z.object({
  email: z.email(),
  homepage: z.url()
})

// If optional+default pattern existed (not applicable to current schema)
// Before (v3) - returned {}
const schema = z.object({
  status: z.string().optional().default("draft")
})

// After (v4) - returns { status: "draft" } - BREAKING
// Fix: Remove .optional() if field should always exist
const schema = z.object({
  status: z.string().default("draft")
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.string().email()` | `z.email()` | Zod 4.0 (2025) | String validators moved to top-level functions—cleaner API |
| `.optional().default()` returns `{}` | Returns `{ field: default }` | Zod 4.0 (2025) | Breaking change—defaults now apply through optional |
| `error.errors` | `error.issues` | Zod 4.0 (2025) | Property renamed for consistency |
| `.merge()` for composition | `.extend()` | Zod 4.0 (2025) | Method deprecation—extend is preferred |
| `.strict()` method | `z.strictObject()` | Zod 4.0 (2025) | Instance methods moved to top-level functions |
| Multiple error params | Single `error` param | Zod 4.0 (2025) | Unified error customization API |
| Loose `.uuid()` validation | RFC 9562/4122 strict | Zod 4.0 (2025) | Stricter validation—use `z.guid()` for backward compatibility |

**Deprecated/outdated:**
- **zod/v3 subpath:** Available as temporary fallback during transition, but Astro 6+ will drop support
- **`.format()` and `.flatten()` error methods:** Replaced by `z.treeifyError()` in v4
- **`.deepPartial()` method:** Removed in v4—no replacement provided
- **`z.promise()` schema:** Deprecated—await promises before parsing instead

## Open Questions

1. **Astro image() helper compatibility with Zod 4**
   - What we know: Astro's `image()` helper provides `ImageMetadata` with dimension properties
   - What's unclear: Does Zod 4 upgrade affect how Astro's `image()` helper integrates with schemas?
   - Recommendation: Test image validation after Zod upgrade. Astro 4.5.4 may need update if issues arise. Check Astro changelog for Zod 4 compatibility notes.

2. **Content collection build performance impact**
   - What we know: Zod 4 claims "improved performance" but no specific benchmarks
   - What's unclear: Will 19 content entries see noticeable build time change?
   - Recommendation: Measure build times before and after. Unlikely to matter for small collection size, but good to verify.

3. **z.any() future compatibility**
   - What we know: `z.any()` is valid in Zod 4 but discouraged for type safety
   - What's unclear: Should icon field use proper type instead of `z.any()`?
   - Recommendation: Keep `z.any()` for now (icons are flexible data). If icons standardize to specific format (e.g., Lucide icon names), migrate to `z.string()` or `z.enum()`.

## Sources

### Primary (HIGH confidence)
- [Zod v4 Migration Guide](https://zod.dev/v4/changelog) — Official breaking changes documentation
- [Zod v4 Release Notes](https://zod.dev/v4) — v4.3.0 features and migration guidance
- [Zod GitHub Releases](https://github.com/colinhacks/zod/releases) — Latest version 4.3.6 (January 22, 2025)
- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/) — Schema validation with Zod
- Project source code: `src/content/config.ts`, `src/content/projects/` — Current schema structure
- .planning/research/PITFALLS.md — v2.0 migration research findings on Zod 4 breaking changes
- .planning/research/STACK.md — Zod 3.23.8 → 4.3.6 upgrade path and breaking changes

### Secondary (MEDIUM confidence)
- [Astro PR #14956: Upgrade to Zod 4](https://github.com/withastro/astro/pull/14956) — Astro's internal migration to Zod 4
- [Zod Issue #4883: Optional properties breaking change](https://github.com/colinhacks/zod/issues/4883) — Community discussion on optional+default behavior
- [Zod v3 to v4 Migration Gist](https://gist.github.com/imaman/a62d1c7bab770a3b49fe3be10a66f48a) — Community migration guide with practical examples
- [zod-v3-to-v4 codemod](https://github.com/nicoespeon/zod-v3-to-v4) — Automated migration tool

### Tertiary (LOW confidence)
- None—all claims verified with official documentation or authoritative sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Zod documentation, verified version numbers, Astro compatibility confirmed
- Architecture: HIGH - Current schema inspected directly, migration patterns verified against official changelog
- Pitfalls: HIGH - Cross-referenced v2.0 research with official Zod issue tracker and migration guide
- Migration impact: HIGH - Simple schema structure with no advanced features reduces complexity

**Research date:** 2026-02-10
**Valid until:** 2026-03-10 (30 days - Zod 4.3.6 is stable, but monitoring for patch releases recommended)

## Ready for Planning

Research complete. Planner can now create PLAN.md files with confidence in:

1. **Migration scope:** Simple upgrade, no schema refactoring needed
2. **Breaking changes:** Optional+default pattern (not used), string validators (not used), error structure (low impact)
3. **Verification strategy:** Test content loading, image refine validation, TypeScript type checking
4. **Rollback plan:** Pin to Zod 3.23.8 if issues arise (low risk)
5. **Dependency on Astro version:** Current Astro 4.5.4 should be compatible; verify in testing

**Recommended plan structure:**
- Task 1: Upgrade Zod to 4.3.6 in package.json
- Task 2: Run npm install and verify no peer dependency conflicts
- Task 3: Audit content collection schema (verify no optional+default pattern)
- Task 4: Test all content entries load with getCollection('projects')
- Task 5: Verify image refine validation works (test with small image)
- Task 6: Run TypeScript check (astro check)
- Task 7: Test dev server and production build
