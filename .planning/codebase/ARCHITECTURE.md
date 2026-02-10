# Architecture

**Analysis Date:** 2026-02-10

## Pattern Overview

**Overall:** Island Architecture with Static Site Generation (SSG) + Client-Side Interactivity

This is a **static site generator** built with Astro that uses a component-based island architecture. Pages are pre-rendered as static HTML at build time, with selective interactive islands for dynamic features (form handling, navigation, theme switching). The site serves as a professional portfolio with multi-language support.

**Key Characteristics:**
- Static HTML generation with zero-JavaScript by default
- Interactive islands (Astro components with embedded scripts) for client-side features
- Content-based project collection system using Astro Content
- Seasonal theming system via Tailwind plugin
- Multi-language routing (es, en, pt, gl) with default language fallback
- Dark mode support with class-based detection
- Form submission via Web3Forms external service

## Layers

**Presentation Layer (UI Components):**
- Purpose: Render visual interface and interactive elements
- Location: `src/components/` (Astro components)
- Contains: Page layouts, section components, icon components, utility components
- Depends on: Internationalization layer, utility functions, assets
- Used by: Page routing layer

**Page Routing Layer:**
- Purpose: Define site routes and page structure
- Location: `src/pages/` (Astro file-based routing)
- Contains: Route files using Astro's i18n routing convention (`index.astro`, `en/`, `pt/`, `gl/` subdirectories)
- Depends on: Presentation layer components
- Used by: Astro build system

**Content Management Layer:**
- Purpose: Manage structured project data and content collections
- Location: `src/content/` (Astro Content Collections)
- Contains: Project markdown files organized by language (`projects/es/`, `projects/pt/`, etc.), content schema definition
- Depends on: File system
- Used by: Presentation layer (ProjectsSection fetches and displays projects)

**Internationalization (i18n) Layer:**
- Purpose: Provide language-specific strings and routing utilities
- Location: `src/i18n/`
- Contains: JSON translation files per language (`es.json`, `en.json`, `pt.json`, `gl.json`), utility functions for language detection and path translation
- Depends on: Nothing
- Used by: Presentation layer components, page layer

**Styling & Theme Layer:**
- Purpose: Define visual design system and seasonal theming
- Location: `src/styles/` (global CSS), `tailwind.config.cjs`, `plugins/tailwind/seasonalStylesPlugin.ts`
- Contains: Global CSS, Tailwind theme extensions, seasonal color themes
- Depends on: Nothing
- Used by: All presentation components

**Utilities & Helpers:**
- Purpose: Provide reusable utility functions
- Location: `src/lib/utils.ts`
- Contains: CSS class merging utility (`cn()` function combining clsx + tailwind-merge)
- Depends on: External packages (clsx, tailwind-merge)
- Used by: Components needing dynamic class management

## Data Flow

**Page Load Flow:**

1. Browser requests route (e.g., `/en/` or `/projects`)
2. Astro's file-based router matches the route to `src/pages/`
3. Page component (e.g., `src/components/pages/index.astro`) imports child sections
4. For projects section: `ProjectsSection.astro` calls `getCollection('projects')`
5. Content collection returns project markdown files filtered by language
6. Components render project data with Astro's static rendering
7. Hydrated islands (Header, ContactForm) attach client-side scripts
8. Static HTML sent to browser with embedded JavaScript for interactive features

**Form Submission Flow:**

1. User fills ContactForm in `src/components/ContactForm.astro`
2. Form `submit` event triggers embedded `<script>` in component
3. Script prevents default form submission
4. Fetch request sent to `https://api.web3forms.com/submit` with form data
5. Web3Forms API returns success/error response
6. Script updates UI with success/error message using class toggles
7. Form hides after 5 seconds, allowing user to submit again

**Navigation & Active State Flow:**

1. Header component initializes IntersectionObserver on `astro:page-load` event
2. Observer watches sections with `[data-section]` attribute
3. When section enters viewport (20% threshold), matching nav link gets `.text-accent` class
4. CSS updates link appearance immediately via class presence

**Theme & Seasonal Colors Flow:**

1. Tailwind plugin (`seasonalStylesPlugin.ts`) detects current month/date at build time
2. Adds CSS custom properties to `:root` and `.dark` selectors based on season
3. Global CSS references these custom properties (e.g., `background: hsl(var(--background))`)
4. Dark mode toggle adds/removes `.dark` class on `<html>` element
5. CSS cascade applies dark variant of seasonal colors

**Language Selection Flow:**

1. URL path determines language (e.g., `/en/`, `/pt/`, `/gl/`, or `/` for default Spanish)
2. `getI18N()` utility in `src/i18n/index.ts` returns merged Spanish + language-specific strings
3. Components access current locale via `Astro.currentLocale`
4. LanguageSwitcher component redirects to alternative language routes
5. Content collections filtered by `language` field in project metadata

## Key Abstractions

**Content Collection Schema:**
- Purpose: Define and validate project data structure
- Examples: `src/content/config.ts`
- Pattern: Zod schema defining projects collection with required fields (title, description, tags, cover, isDraft, language, etc.)

**Internationalization System:**
- Purpose: Centralize translation strings and language utilities
- Examples: `src/i18n/index.ts`, `src/i18n/utils.ts`, `src/i18n/es.json`, etc.
- Pattern: Dictionary-based system where `getI18N()` returns merged fallback (Spanish) + language-specific strings; utility functions extract language from URL and translate paths

**Seasonal Styling Plugin:**
- Purpose: Dynamically apply theme colors based on calendar date
- Examples: `plugins/tailwind/seasonalStylesPlugin.ts`
- Pattern: Tailwind CSS plugin that calculates current season at build time and injects CSS custom properties for colors

**Component Composition:**
- Purpose: Build pages from reusable section components
- Examples: `src/components/pages/index.astro` composes sections (ProjectsSection, CollaborationsSection, About, ContactForm)
- Pattern: Astro layout/slot pattern where main page imports and renders section components in sequence

**Island Components:**
- Purpose: Mark interactive components for hydration with client-side JavaScript
- Examples: `Header.astro`, `ContactForm.astro`, `ModeToggle.astro`
- Pattern: Embedded `<script>` tags within Astro components that run after page load using `astro:page-load` event listener

## Entry Points

**Default Page Route:**
- Location: `src/pages/index.astro`
- Triggers: Browser request to `/`
- Responsibilities: Acts as redirect/wrapper that imports and renders `src/components/pages/index.astro` (the actual main page component)

**Main Page Component:**
- Location: `src/components/pages/index.astro`
- Triggers: Rendered by default route or language routes
- Responsibilities: Orchestrates page structure including BaseHead (meta tags), Header navigation, hero section, wave SVG divider, and four main sections (Projects, Collaborations, About, Contact)

**Language Routes:**
- Location: `src/pages/en/`, `src/pages/pt/`, `src/pages/gl/`
- Triggers: Browser requests to `/en/`, `/pt/`, `/gl/`
- Responsibilities: Language-specific route files using same page template structure

**Content Collection:**
- Location: `src/content/projects/` (organized by language subdirectories)
- Triggers: `getCollection('projects')` called by ProjectsSection component
- Responsibilities: Provides structured project data with metadata, validated against Zod schema

## Error Handling

**Strategy:** Graceful degradation with fallback content

**Patterns:**
- Form submission errors: User sees error message with "message" field from Web3Forms response; form remains visible for retry after 5 seconds
- Missing project cover: Image rendering skips if `cover` is undefined; video fallback used if `video` provided instead
- Missing translations: `getI18N()` merges Spanish fallback first, then language-specific overrides; missing keys fall back to Spanish
- Client-side script failures: Static HTML still serves; interactive features (navigation highlighting, form submission, theme toggle) gracefully degrade if JavaScript disabled
- Content collection filtering: Projects filtered by `isDraft` flag; empty results display no projects (no error thrown)

## Cross-Cutting Concerns

**Logging:** No centralized logging. Debug messages via `console.log()` in seasonal plugin (indicates detected season at build time) and commented-out project debugging in ProjectsSection.

**Validation:** Zod schema in `src/content/config.ts` validates project data shape and cover image minimum width (300px).

**Authentication:** Not applicable - public portfolio site. Form submission uses Web3Forms access key (embedded in component, non-sensitive public key).

**Accessibility:**
- Semantic HTML (h1, h2, h3, nav, article, footer)
- ARIA labels on links (e.g., `aria-label="LinkedIn de Diego de Sousa"`)
- IntersectionObserver with 20% threshold for navigation highlighting
- Tailwind's `sr-only` utility for screen-reader-only text
- WCAG AA support noted in project tags (Las Manos project)
- ESLint config includes `eslint-plugin-jsx-a11y` for accessibility linting

**Performance:**
- Lazy loading: Lozad.js for images and videos (marked with `data-src` attributes)
- Image optimization: Astro's `Image` component generates responsive sizes
- Code splitting: Astro's zero-JS default with selective hydration
- Caching: Seasonal colors calculated once at build time, cached in CSS

---

*Architecture analysis: 2026-02-10*
