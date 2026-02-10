# Testing Patterns

**Analysis Date:** 2026-02-10

## Test Framework

**Status:** No testing framework configured or in use

**Current State:**
- No test runner installed (Jest, Vitest, Mocha not in dependencies)
- No test files present in codebase
- No test scripts defined in `package.json`
- No testing configuration files (`jest.config.*`, `vitest.config.*`, etc.)

**Build Validation:**
- `astro check` runs in build pipeline for type checking
- TypeScript strict mode enabled via `tsconfig.json` extends `astro/tsconfigs/strict`
- ESLint enforces code quality standards

## Recommended Testing Setup

**For this Astro project, recommended approach:**

```bash
# Install Vitest (lightweight, Vite-native)
pnpm add -D vitest @vitest/ui

# Or for full integration testing
pnpm add -D @testing-library/astro @testing-library/dom
```

**Rationale:**
- Vitest integrates seamlessly with Astro's Vite build configuration
- Astro has official testing library support
- Lightweight compared to Jest for modern projects

## Test File Organization

**Recommended Location Pattern:**
- Co-located with source files: `src/components/__tests__/ComponentName.test.ts`
- Or separate test directory: `tests/unit/`, `tests/integration/`
- Current project structure suggests co-location would fit pattern

**Naming Convention:**
- `ComponentName.test.ts` or `ComponentName.spec.ts`
- File should be adjacent to source file or in `__tests__` subdirectory

**Example Structure to Follow:**
```
src/
├── components/
│   ├── LinkButton.astro
│   ├── __tests__/
│   │   └── LinkButton.test.ts
│   ├── sections/
│   │   ├── ProjectsSection.astro
│   │   └── __tests__/
│   │       └── ProjectsSection.test.ts
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
└── i18n/
    ├── utils.ts
    └── __tests__/
        └── utils.test.ts
```

## Test Structure Pattern

**Recommended Format (using Vitest syntax):**

```typescript
// Example: src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('handles conditional classes', () => {
    const result = cn('px-2', ['py-4', 'bg-red-500'])
    expect(result).toContain('px-2')
    expect(result).toContain('py-4')
  })
})
```

**Suite Organization:**
- Use `describe()` to group related tests
- One test per behavior expectation
- Clear test names that describe what should happen

## Testing Patterns to Implement

### Utility Testing Pattern

For functions like `cn()`, `getLangFromUrl()`, `useTranslations()`:

```typescript
import { describe, it, expect } from 'vitest'
import { getLangFromUrl } from '@/i18n/utils'

describe('getLangFromUrl', () => {
  it('extracts language from URL pathname', () => {
    const url = new URL('https://example.com/es/vota')
    expect(getLangFromUrl(url)).toBe('es')
  })

  it('returns default language for invalid paths', () => {
    const url = new URL('https://example.com/invalid/page')
    expect(getLangFromUrl(url)).toBe('defaultLang')
  })
})
```

### Component Testing Pattern (Astro Components)

For components, use Astro's testing library:

```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/astro'
import LinkButton from '@/components/LinkButton.astro'

describe('LinkButton component', () => {
  it('renders as external link', async () => {
    const { container } = await render(LinkButton, {
      props: { href: 'https://example.com' },
      slots: { default: 'Click me' }
    })

    const link = container.querySelector('a')
    expect(link?.getAttribute('target')).toBe('_blank')
  })
})
```

### Mock Pattern (if needed)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { getI18N } from '@/i18n'

describe('getI18N', () => {
  it('returns Spanish translation by default', () => {
    const i18n = getI18N({ currentLocale: 'es' })
    expect(i18n).toBeDefined()
  })

  it('falls back to Spanish for unknown language', () => {
    const i18n = getI18N({ currentLocale: 'unknown' })
    expect(i18n).toBeDefined()
  })
})
```

## What to Test in This Codebase

**High Priority - Utilities:**
- `src/lib/utils.ts`: `cn()` function for class merging
- `src/i18n/utils.ts`:
  - `getLangFromUrl()` - language extraction logic
  - `useTranslations()` - translation function generation
  - `useTranslatedPath()` - path translation logic
  - `getRouteFromUrl()` - complex route matching logic

**Medium Priority - Components:**
- `src/components/LinkButton.astro`: Renders external links correctly
- `src/components/FormattedDate.astro`: Date formatting edge cases
- `src/components/ModeToggle.astro`: Theme switching logic
- `src/components/sections/ProjectsSection.astro`: Content filtering and rendering

**Medium Priority - Content:**
- `src/content/config.ts`: Zod schema validation behavior
- Content collection validation with image constraints

**Low Priority (Integration):**
- Plugin behavior: `plugins/tailwind/seasonalStylesPlugin.ts` seasonal detection logic
- i18n configuration and language detection

## Coverage Goals

**Recommended Targets:**
- Utility functions: 100% (pure functions, easy to test)
- Component logic (frontmatter in Astro): 80%+
- Content validation: 100%
- Overall: 70%+ to start, increase over time

**Coverage Command (once configured):**
```bash
vitest --coverage
```

## Mocking Strategy

**What to Mock:**
- Astro's `getCollection()` - return test data instead of actual content
- Environment or system APIs if needed
- External dependencies in utility functions

**What NOT to Mock:**
- Pure utility functions like `cn()` - test directly
- Type coercion and validation - test real behavior
- Built-in DOM APIs that components depend on

**Mock Pattern for Content:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { getCollection } from 'astro:content'

vi.mock('astro:content', () => ({
  getCollection: vi.fn().mockResolvedValue([
    {
      id: 'test-project',
      data: {
        title: 'Test Project',
        description: 'A test project',
        tags: [],
        isDraft: false,
        language: 'es',
      },
      body: ''
    }
  ])
}))
```

## Async Testing Pattern

For functions that return promises or use async operations:

```typescript
import { describe, it, expect } from 'vitest'

describe('async utilities', () => {
  it('handles async operations', async () => {
    const result = await someAsyncFunction()
    expect(result).toBeDefined()
  })

  it('rejects with specific error', async () => {
    await expect(failingAsyncFunction()).rejects.toThrow('Expected error')
  })
})
```

## Error Testing Pattern

For error handling scenarios:

```typescript
describe('error handling', () => {
  it('throws on invalid input', () => {
    expect(() => {
      getLangFromUrl(null) // Invalid input
    }).toThrow()
  })

  it('returns fallback for edge cases', () => {
    const url = new URL('https://example.com/')
    const lang = getLangFromUrl(url)
    expect(lang).toBe('defaultLang')
  })
})
```

## Run Commands (Once Configured)

```bash
# Run all tests
pnpm vitest

# Watch mode during development
pnpm vitest --watch

# Coverage report
pnpm vitest --coverage

# UI mode for interactive testing
pnpm vitest --ui
```

## Integration Tests (Future)

Once basic unit tests are in place, consider E2E tests using:
- **Playwright** - for full page testing
- **Cypress** - for component/integration testing
- Test real user workflows through generated site

## Current Testing Reality

**Status:** Project currently relies on:
- TypeScript strict mode for type safety
- ESLint for code quality and consistency
- `astro check` for build-time validation
- Manual testing through dev server

**Immediate Action:** Add unit tests for utility functions as first step (quick wins, high value)

---

*Testing analysis: 2026-02-10*
