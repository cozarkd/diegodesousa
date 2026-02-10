# Coding Conventions

**Analysis Date:** 2026-02-10

## Naming Patterns

**Files:**
- Astro components: PascalCase (e.g., `ModeToggle.astro`, `FormattedDate.astro`, `LinkButton.astro`)
- TypeScript files: camelCase (e.g., `utils.ts`, `config.ts`)
- Icon components: PascalCase (e.g., `Sun.astro`, `Moon.astro`, `GitHub.astro`)
- Utility/config files at root: camelCase with optional file type suffix (e.g., `site.config.ts`, `robots-txt.config.ts`)
- Directories: kebab-case for grouped features (e.g., `sections/`, `collaborations/`, `icons/`)

**Functions:**
- camelCase for function names (e.g., `getLangFromUrl()`, `useTranslations()`, `getI18N()`)
- Hook-like functions use `use` prefix (e.g., `useTranslations()`, `useTranslatedPath()`)
- Getter functions prefixed with `get` (e.g., `getLangFromUrl()`, `getRouteFromUrl()`, `getI18N()`)
- Helper functions without special prefix (e.g., `cn()` for class name utility)

**Variables:**
- camelCase for regular variables and constants in TypeScript files
- UPPERCASE for constant names at module level (e.g., `LANG`, `LANGUAGES`)
- Type variables use `T` prefix for generics (standard TypeScript convention)
- Descriptive names for data objects (e.g., `filteredProjects`, `seasonalStyles`, `projectData`)

**Types:**
- Interfaces: PascalCase (e.g., `Props`, `SeasonalStyle`, `SeasonalStyles`)
- Type aliases: PascalCase
- Union/enum-like objects: camelCase keys with UPPERCASE constants for semantic values (e.g., `LANG.PORTUGUESE`, `LANG.ENGLISH`)

## Code Style

**Formatting:**
- Prettier with `prettier-config-standard` + plugins
- Plugins used:
  - `prettier-plugin-astro` - for `.astro` file formatting
  - `prettier-plugin-tailwindcss` - sorts Tailwind classes
  - `prettier-plugin-css-order` - organizes CSS properties
- Indentation: tabs with width 2 (configured in `.editorconfig`)
- Line endings: LF (Unix style)
- Final newline: always inserted

**Linting:**
- ESLint with `eslint-config-standard`
- Parser: `@typescript-eslint/parser` for TypeScript
- Plugins:
  - `eslint-plugin-astro` - Astro file linting with recommended rules + jsx-a11y-recommended
  - `eslint-plugin-import` - Import statement rules
  - `eslint-plugin-jsx-a11y` - Accessibility rules
  - `eslint-plugin-n` - Node.js rules
  - `eslint-plugin-promise` - Promise handling rules
- Override for `.astro` files: uses `astro-eslint-parser` with TypeScript parser as fallback

## Import Organization

**Order:**
1. Framework imports (e.g., `import { defineCollection, z } from 'astro:content'`)
2. Component imports (e.g., `import GitHub from '@/components/icons/GitHub.astro'`)
3. Utility/helper imports (e.g., `import { Image } from 'astro:assets'`, `import { getI18N } from '@/i18n'`)
4. Local file imports (e.g., `import lozad from 'lozad'`)

**Path Aliases:**
- `@/*` resolves to `./src/*` (configured in `tsconfig.json`)
- Used consistently across all imports (e.g., `@/components`, `@/i18n`, `@/lib`)

**Import Style:**
- Named imports preferred for utilities and type definitions
- Default imports for components and modules
- Type imports use `import type` syntax when appropriate (TypeScript strict mode)

## Error Handling

**Patterns:**
- No global error handler detected at codebase level
- Individual components handle null/undefined checks locally (e.g., in `ProjectsSection.astro`: `project.cover && (...)`)
- Validation using Zod schema in `content/config.ts` for type safety on content collections
- Optional chaining (`?.`) used for safe property access
- Logical operators for conditional rendering (`&&`, `||` ternary operators)

**Data Validation:**
- Zod schemas define strict content validation in `src/content/config.ts`
- Image width validation enforced (minimum 300px)
- Type coercion through `z.object()` with specific field validators

## Logging

**Framework:** No centralized logging framework
- Limited use of console logging, restricted to plugin code for development
- `console.log()` used in `plugins/tailwind/seasonalStylesPlugin.ts` for seasonal detection debugging
- No production logging infrastructure detected

**Patterns:**
- Logging for development/debugging only in plugin code
- No logging calls in component or utility files in `src/`
- Recommendation: Remove debug logs before production deployment

## Comments

**When to Comment:**
- Comments explain WHY, not WHAT (code should be self-explanatory for WHAT)
- Spanish comments used in some files reflecting bilingual codebase
- Inline comments for complex logic (e.g., in `seasonalStylesPlugin.ts`: "// JavaScript cuenta los meses desde 0")
- JSDoc-style comments for i18n descriptions (e.g., `// src/i18n/index.ts`)

**Commented-Out Code:**
- Preserved in some files for reference (e.g., `MenuIcon.astro` has commented alternative implementation)
- Should be cleaned up before final commits

**JSDoc/TSDoc:**
- Not widely used in codebase
- Interface props documented through TypeScript interfaces (e.g., `Props` in Astro components)
- Function documentation minimal; types provide clarity

## Function Design

**Size:**
- Functions kept relatively small and focused
- Example: `getLangFromUrl()` is 3 lines (logic extraction)
- Example: `useTranslations()` returns a closure for type-safe translations

**Parameters:**
- Destructuring used for object parameters (e.g., in Astro components: `const { date } = Astro.props`)
- Optional parameters use `?: Type` notation
- Rest parameters used where appropriate (e.g., `...inputs: ClassValue[]` in `cn()` utility)

**Return Values:**
- Explicit return types on functions with TypeScript
- Utility functions return derived values (e.g., `cn()` returns merged class string)
- Closures used for factory patterns (e.g., `useTranslations()` returns a translation function)
- Optional returns handled with `undefined` (e.g., `getRouteFromUrl()` returns `string | undefined`)

## Module Design

**Exports:**
- Named exports preferred for utilities and configuration
- Default exports for main modules and components
- Multiple exports from utility files (e.g., `i18n/utils.ts` exports multiple helper functions)
- Re-exports in index files for cleaner API (e.g., `collections` export in `content/config.ts`)

**Barrel Files:**
- Minimal use of barrel files
- `src/i18n/index.ts` acts as main i18n export point
- Direct imports preferred when possible

**Module Patterns:**
- Astro components use frontmatter section (between `---`) for script logic
- TypeScript files follow functional programming style with pure functions
- Plugin modules export default configuration objects

## Class Variance Authority (CVA) Usage

**Pattern:**
- Project uses `class-variance-authority` and `clsx` for dynamic class composition
- Example: `cn()` utility in `src/lib/utils.ts` combines `clsx` and `tailwind-merge`
- Used for conditional styling (e.g., tag styling with dynamic `class` prop in content schema)

---

*Convention analysis: 2026-02-10*
