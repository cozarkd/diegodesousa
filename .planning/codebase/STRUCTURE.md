# Codebase Structure

**Analysis Date:** 2026-02-10

## Directory Layout

```
diegodesousa/
├── src/                           # Source code
│   ├── assets/                    # Local images and static files
│   ├── components/                # Astro & UI components
│   │   ├── pages/                 # Page-level components
│   │   ├── sections/              # Page section components
│   │   ├── collaborations/        # Collaboration partner components
│   │   ├── icons/                 # SVG icon components
│   │   ├── Header.astro           # Navigation header
│   │   ├── Footer.astro           # Page footer
│   │   ├── ContactForm.astro      # Contact form with Web3Forms integration
│   │   ├── BaseHead.astro         # Meta tags and head configuration
│   │   └── [Other utility components]
│   ├── content/                   # Astro Content Collections
│   │   ├── config.ts              # Content collection schemas
│   │   └── projects/              # Project data organized by language
│   │       ├── es/, pt/, en/, gl/ # Language-specific project folders
│   │       └── [Project markdown files & images]
│   ├── i18n/                      # Internationalization
│   │   ├── index.ts               # Language getter function
│   │   ├── utils.ts               # i18n utility functions
│   │   ├── ui.ts                  # i18n configuration
│   │   ├── es.json, en.json, pt.json, gl.json  # Translation strings
│   ├── lib/                       # Utility functions
│   │   └── utils.ts               # Helper functions (cn, clsx merger)
│   ├── pages/                     # File-based routing (Astro)
│   │   ├── index.astro            # Default route wrapper
│   │   ├── en/, pt/, gl/          # Language route directories
│   │   └── [Other route files]
│   ├── styles/                    # Global styles
│   │   └── global.css             # Tailwind directives & global utilities
│   ├── consts.ts                  # Global constants (currently empty)
│   └── env.d.ts                   # TypeScript environment definitions
├── plugins/                       # Custom build plugins
│   └── tailwind/                  # Tailwind CSS customizations
│       └── seasonalStylesPlugin.ts # Seasonal color theming plugin
├── public/                        # Static assets served as-is
│   ├── images/                    # Public images and backgrounds
│   ├── fonts/                     # Web fonts
│   └── [Favicons, manifest, etc.]
├── dist/                          # Build output (generated)
├── .planning/                     # Planning documents
│   └── codebase/                  # Codebase analysis documents
├── astro.config.mjs               # Astro configuration
├── tailwind.config.cjs            # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── pnpm-lock.yaml                 # Lockfile for pnpm
└── [Config files: prettier, eslint, postcss, etc.]
```

## Directory Purposes

**`src/`:**
- Purpose: All source code and content
- Contains: Components, pages, assets, styles, configuration
- Key files: See subdirectories below

**`src/assets/`:**
- Purpose: Local media files referenced in components
- Contains: PNG/WebP images (profile portrait, badges)
- Key files: `diego_bw.webp` (hero section portrait), `sello-pontevedra.webp` (contact form stamp)

**`src/components/`:**
- Purpose: Reusable Astro components and UI elements
- Contains: Page layouts, sections, icons, form components
- Key files:
  - `src/components/pages/index.astro` - Main page layout
  - `src/components/Header.astro` - Navigation with active section detection
  - `src/components/ContactForm.astro` - Contact form with form submission handling
  - `src/components/sections/ProjectsSection.astro` - Renders filtered project list
  - `src/components/sections/CollaborationsSection.astro` - Partner logos
  - `src/components/icons/*.astro` - SVG icon components (GitHub, LinkedIn, tech stack icons)

**`src/content/`:**
- Purpose: Astro Content Collections for structured data
- Contains: Content schemas and project markdown files
- Key files:
  - `src/content/config.ts` - Zod schema for projects collection
  - `src/content/projects/{language}/*.md` - Individual project files with frontmatter

**`src/i18n/`:**
- Purpose: Internationalization system
- Contains: Language configuration, translation strings, utility functions
- Key files:
  - `src/i18n/index.ts` - `getI18N()` function returns current language strings
  - `src/i18n/utils.ts` - URL language detection, path translation, locale getters
  - `src/i18n/*.json` - Translation dictionaries for es, en, pt, gl
  - `src/i18n/ui.ts` - Backward compatibility data structure

**`src/lib/`:**
- Purpose: Shared utility functions
- Contains: Helper functions used by components
- Key files: `src/lib/utils.ts` - `cn()` function combining clsx + tailwind-merge for dynamic classes

**`src/pages/`:**
- Purpose: File-based routing (Astro's routing convention)
- Contains: Route files organized by language
- Key files:
  - `src/pages/index.astro` - Root route, imports main page component
  - `src/pages/en/`, `src/pages/pt/`, `src/pages/gl/` - Language-specific route directories

**`src/styles/`:**
- Purpose: Global CSS and theme definitions
- Contains: Tailwind setup, custom utilities, CSS variables
- Key files: `src/styles/global.css` - Imports Tailwind directives, defines CSS custom properties for colors

**`plugins/tailwind/`:**
- Purpose: Custom Tailwind plugin for seasonal theming
- Contains: Seasonal color generator logic
- Key files: `plugins/tailwind/seasonalStylesPlugin.ts` - Detects season, injects color custom properties

**`public/`:**
- Purpose: Static assets served without processing
- Contains: Favicons, fonts, images, manifest files
- Key directories: `public/images/bgs/` - Background images for seasonal themes

## Key File Locations

**Entry Points:**
- `src/pages/index.astro` - Default route handler
- `astro.config.mjs` - Astro configuration with site URL and integrations
- `package.json` - Build scripts (`npm run build`, `npm run dev`)

**Configuration:**
- `astro.config.mjs` - Astro settings (i18n, integrations, server port)
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- `tailwind.config.cjs` - Tailwind theme extensions and plugin registration
- `prettier.config.cjs` - Code formatting rules
- `.eslintrc.cjs` - Linting configuration

**Core Logic:**
- `src/components/pages/index.astro` - Main page composition
- `src/components/Header.astro` - Navigation state management
- `src/components/ContactForm.astro` - Form handling and Web3Forms integration
- `src/components/sections/ProjectsSection.astro` - Project data fetching and rendering
- `src/i18n/index.ts` - Language string provider
- `plugins/tailwind/seasonalStylesPlugin.ts` - Theme color logic

**Content:**
- `src/content/config.ts` - Project schema definition
- `src/content/projects/{lang}/*.md` - Project data files

**Styling:**
- `src/styles/global.css` - Global styles and custom properties
- `tailwind.config.cjs` - Theme configuration

## Naming Conventions

**Files:**
- Astro components: PascalCase with `.astro` extension (e.g., `Header.astro`, `ContactForm.astro`)
- TypeScript: camelCase with `.ts` extension (e.g., `utils.ts`, `config.ts`)
- JSON translation files: language code (e.g., `es.json`, `en.json`)
- Project markdown: kebab-case (e.g., `las-manos.md`, `unveiling-memories.md`)
- Images: kebab-case with extension (e.g., `diego_bw.webp`, `spring-light.png`)

**Directories:**
- Component directories: PascalCase plural or descriptive (e.g., `components/`, `sections/`, `icons/`, `collaborations/`)
- Language directories: lowercase language code (e.g., `projects/es/`, `projects/en/`)
- Feature directories: lowercase (e.g., `pages/`, `styles/`, `assets/`, `lib/`)

**CSS Classes:**
- Tailwind utilities: kebab-case (e.g., `flex`, `flex-col`, `gap-4`)
- Custom classes: kebab-case with descriptive name (e.g., `.sr-only`, `.fadeIn`, `.nav-link`)
- CSS custom properties: kebab-case with double-dash prefix (e.g., `--background`, `--foreground`, `--primary`)

**Variables & Functions:**
- TypeScript: camelCase (e.g., `getLangFromUrl`, `getI18N`, `useTranslations`)
- Constants: UPPER_SNAKE_CASE (e.g., `LANG.PORTUGUESE`, `defaultLang`)
- React props interface: PascalCase (e.g., `interface Props`)

## Where to Add New Code

**New Feature (Multi-step section):**
- Primary code: Create new section component in `src/components/sections/{FeatureName}.astro`
- Styling: Add Tailwind classes inline or new custom classes in `src/styles/global.css`
- Tests: No test framework configured; add documentation comments with TypeScript JSDoc
- Integration: Import section in `src/components/pages/index.astro` and add to layout

**New Component/Module:**
- Implementation: Create in `src/components/` with PascalCase name
- Reusable UI: Place in `src/components/` for shared use, or in `src/components/sections/` if section-specific
- Utilities: Add to `src/lib/utils.ts` or create new file in `src/lib/`
- Icons: Add SVG component to `src/components/icons/{IconName}.astro`

**New Internationalization:**
- String entry: Add key-value pair to all JSON files in `src/i18n/` (es.json, en.json, pt.json, gl.json)
- Nested objects: Flatten with dot notation (e.g., `"HEADER.NAMECARD.LABEL"`)
- Retrieval: Access via `getI18N({ currentLocale })` in components, pass `currentLocale` from `Astro.currentLocale`

**New Content Collection:**
- Data files: Create markdown files in language subdirectories under `src/content/{collectionName}/{language}/`
- Schema: Define Zod schema in `src/content/config.ts` in `collections` export
- Retrieval: Use `getCollection('{collectionName}')` in components to fetch and filter

**New Static Assets:**
- Images: Place in `src/assets/` (referenced in components) or `public/` (served as-is)
- Fonts: Add to `public/fonts/` and reference in CSS or link tags
- Backgrounds: Add to `public/images/bgs/` for use in seasonal themes or CSS

**Styling Updates:**
- Global styles: Add to `src/styles/global.css` with Tailwind @layer directives
- Theme colors: Extend `tailwind.config.cjs` theme object
- Seasonal colors: Update `plugins/tailwind/seasonalStylesPlugin.ts` date ranges and color maps

**Form Integration:**
- Form component: Create new component with form HTML + embedded `<script>` for handling
- External service: Configure API key and endpoint in hidden form inputs
- Handler: Write fetch request in embedded script using `astro:page-load` event listener

## Special Directories

**`dist/`:**
- Purpose: Build output
- Generated: Yes (by `astro build`)
- Committed: No (in .gitignore)
- Contains: Production-ready static HTML, CSS, JavaScript bundles, optimized images

**`.astro/`:**
- Purpose: Astro runtime cache and environment
- Generated: Yes (by Astro)
- Committed: No (in .gitignore)
- Contains: Virtual modules, client hydration info

**`.github/workflows/`:**
- Purpose: CI/CD configuration
- Generated: No
- Committed: Yes
- Contains: GitHub Actions workflow files for automated updates

---

*Structure analysis: 2026-02-10*
