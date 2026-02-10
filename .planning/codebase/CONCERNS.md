# Codebase Concerns

**Analysis Date:** 2026-02-10

## Security Issues

**Hardcoded Web3Forms Access Key:**
- Issue: Web3Forms API access key is hardcoded in plain text in component
- Files: `src/components/ContactForm.astro` (line 42-43)
- Impact: The access key `45ee6310-e703-43b2-9fd5-530e8134cab1` is publicly visible in version control and bundled assets. Exposure of this key allows unauthorized form submissions
- Fix approach: Move to environment variable (e.g., `ASTRO_PUBLIC_WEB3FORMS_KEY`). Update form submission logic to use fetch with server-side API route rather than client-side direct POST

**Unsafe innerHTML Usage:**
- Issue: User-facing content rendered with `innerHTML` without sanitization
- Files: `src/components/ContactForm.astro` (lines 156, 171, 175, 180)
- Current behavior: Form response messages are set directly via `innerHTML` from API responses and user input
- Impact: If API response is compromised or web3forms service is compromised, arbitrary HTML/JavaScript could be injected. Stored state in `data-messages` attribute is JSON-decoded without validation
- Fix approach: Use `textContent` for message display instead of `innerHTML`. If HTML formatting is required, use a safe HTML sanitizer like `DOMPurify` and validate API responses before rendering

## Performance & Optimization Concerns

**Console.log Statements in Production Build:**
- Issue: Multiple `console.log()` calls left in production code
- Files:
  - `plugins/tailwind/seasonalStylesPlugin.ts` (lines 29, 50, 75, 101, 127, 153)
  - `src/components/AstroNav.astro` (lines 120, 153 - commented out, minor)
  - `src/components/sections/ProjectsSection.astro` (commented out)
- Impact: Console spam on every page load during build time (plugin) and runtime (components). Increases bundle size and reduces performance in development view
- Fix approach: Remove all console.log statements or wrap with `if (import.meta.env.DEV)` for development-only logging

**Event Listener Memory Leaks in Navigation:**
- Issue: Event listeners added on `astro:page-load` without proper cleanup on page navigation
- Files: `src/components/AstroNav.astro` (lines 11-12, 35, 42, 54, 62, 173)
- Current behavior: Component re-adds event listeners on every page transition via `['DOMContentLoaded', 'astro:after-swap'].forEach()` but uses element cloning for cleanup which is inefficient
- Impact: In SPA navigation with Astro transitions, event listeners accumulate. Clone-and-replace pattern prevents proper event listener delegation and creates performance overhead
- Fix approach: Implement proper cleanup with `removeEventListener` in `astro:page-unload` or `astro:before-swap` events. Use event delegation on document level instead of attaching to individual elements

**Seasonal Theme Plugin Re-evaluates on Every Build:**
- Issue: Plugin runs computation on each build to determine current season
- Files: `plugins/tailwind/seasonalStylesPlugin.ts` (lines 17-23)
- Current behavior: Gets current date/month and has commented-out override for testing
- Impact: Build time depends on when code is run; no consistent output for reproducible builds. CSS output differs based on server time
- Fix approach: Accept season as build-time environment variable or accept date parameter. Use consistent output for CI/CD environments

## Fragile Areas

**Menu Toggle State Management in AstroNav:**
- Files: `src/components/AstroNav.astro` (entire file - 183 lines)
- Why fragile: Complex state synchronization between:
  - `.astronav-menu` button element
  - `.astronav-toggle` SVG path elements (line 78)
  - `.astronav-items` container
  - `.dropdown-toggle` elements
  - Multiple conditional class toggles with `hidden`, `open`, `opened`
  - aria-expanded attributes that may fall out of sync
- Current issues: Lines 70-77 show commented-out previous implementation suggesting multiple failed attempts to stabilize this
- Safe modification: Add unit tests for state transitions. Create centralized state object tracking all menu states. Document the state machine transitions
- Test coverage: No automated tests exist for menu toggle behavior

**Locale Fallback Pattern in i18n:**
- Files: `src/i18n/index.ts` (lines 15-24)
- Why fragile: Uses object spread to merge translations: `{ ...spanish, ...portuguese }`
- Current behavior: Always merges Spanish as base first, then specific language. If a key is missing in non-default language, user never sees it (no fallback warning)
- Risk: Missing translations silently fall back to Spanish rather than showing warning or English. Breaks for Portuguese users if a translation key exists only in Spanish
- Safe modification: Change to explicit key lookup with fallback: `ui[locale][key] ?? ui['en'][key] ?? ui['es'][key]`. Add type checking for complete translations per language

**Hard-coded Theme in ModeToggle:**
- Files: `src/components/ModeToggle.astro` (lines 72-130)
- Why fragile: Inline script with direct DOM manipulation tied to specific element IDs and classes
- Current behavior: `document.addEventListener('astro:page-load', ...)` runs on every page load with no deduplication check
- Risk: If page load event fires multiple times or component is rendered twice, multiple theme handlers will attach
- Safe modification: Add guard to prevent double-initialization: `if (window.__themeInitialized) return; window.__themeInitialized = true`

## Testing Gaps

**Zero Test Coverage:**
- Issue: No test files found in entire codebase
- Files: N/A - no .test.ts, .spec.ts, or test directory
- Untested areas:
  - i18n translation lookup and fallback logic
  - Seasonal theme calculation and CSS variable generation
  - Contact form validation and submission
  - Navigation state transitions and menu toggling
  - Language switching behavior
  - Theme preference persistence in localStorage
- Risk: Refactoring any core logic will break functionality silently until deployed
- Priority: High - Add Jest/Vitest configuration and create tests for:
  1. i18n utility functions (`src/i18n/utils.ts`)
  2. Seasonal theme calculation logic
  3. Contact form submission flow
  4. Navigation event handlers

## Known Bugs & Incomplete Features

**Menu Button aria-label Placeholder:**
- Issue: Button has placeholder aria-label text
- Files: `src/components/MenuIcon.astro` (line 11)
- Current: `aria-label='TODO: Alternar menú'` - literally contains "TODO" string
- Fix: Should be `aria-label='Alternar menú'` (remove the TODO prefix) or use i18n for proper translations in each language

**Form Reset Timing Issue:**
- Issue: Form reset happens in `finally` block after async submission, not waiting for visibility animation
- Files: `src/components/ContactForm.astro` (lines 183-193)
- Current behavior: Form resets immediately after response, but result message stays visible for 5 seconds. User can't re-submit because form is reset but not visible
- Fix approach: Move `targetForm.reset()` into `setTimeout` block after visibility is complete

**Missing Language-Specific Form Error Handling:**
- Issue: API error messages displayed directly to user without i18n translation
- Files: `src/components/ContactForm.astro` (line 175)
- Current: `result.innerHTML = jsonResponse.message` - shows raw English API response regardless of current language
- Fix: Map API error codes to i18n messages instead of using raw error text

## Dependencies at Risk

**Web3Forms Third-party Dependency:**
- Risk: Form submissions depend on external API service with no fallback
- Files: `src/components/ContactForm.astro` (lines 30, 160)
- Impact: If web3forms.com is down, contact form is completely broken
- Mitigation needed: Implement server-side proxy endpoint or add form submission retry logic with error notifications

## Maintainability Concerns

**Seasonal Styles Hardcoded to Literal Dates:**
- Issue: Season boundaries hard-coded in plugin logic instead of configurable
- Files: `plugins/tailwind/seasonalStylesPlugin.ts` (lines 27-95, 146-169)
- Current boundaries:
  - Navidad: Dec 1 - Jan 6
  - Invierno: Dec 21 - Mar 20
  - Primavera: Mar 20 - Jun 21
  - Verano: Jun 21 - Sep 23
  - Otoño: Sep 23 - Dec 21
  - Halloween: Oct 31 only
- Problem: Overlap between seasons (Dec 21 in both Navidad and Invierno), hardcoded logic is inflexible
- Fix approach: Move to configuration object with season dates, allow environment variable override

**Duplicate Logo Rendering in Marquee:**
- Issue: Logos rendered twice in marquee for infinite scroll effect
- Files: `src/components/InfiniteMarquee.astro` (lines 28-39 duplicate lines 17-26)
- Impact: Violates DRY principle, makes maintenance of logo list difficult
- Fix: Use CSS animation to clone content rather than rendering twice in HTML

---

*Concerns audit: 2026-02-10*
