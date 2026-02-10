# Phase 1: Profile Content Update - Research

**Researched:** 2026-02-10
**Domain:** Astro i18n JSON content management, multilingual copywriting, professional positioning
**Confidence:** HIGH

## Summary

Phase 1 involves updating four i18n JSON files (es.json, en.json, pt.json, gl.json) located in `/src/i18n/` to reposition Diego from "Frontend Developer" to "Full-Stack Developer & Product Designer" across all user-facing text. This is a pure content update—no code changes, no component modifications, no structural alterations.

The project uses a custom i18n implementation built on Astro's native i18n support (v4.5.4). Translation strings are stored in flat-structured JSON files with nested objects for logical grouping (HERO, ABOUTSECTION, CONTACTSECTION, etc.). The `getI18N()` utility function merges language-specific JSON with Spanish as the fallback base, ensuring consistent key structure across all four languages.

**Primary recommendation:** Treat each language as a native localization (not translation), adapt tone culturally per language while maintaining professional-warm consistency, validate JSON structure after edits, and ensure all four files maintain identical key structures for the merge pattern to work correctly.

## User Constraints (from CONTEXT.md)

<user_constraints>

### Locked Decisions

#### Writing voice & tone
- First person throughout ("I design and build...")
- Professional but warm register — clear, confident, approachable. Not stiff, not casual.
- Personal brand framing — centered on Diego as a person, his craft, his approach
- Copy length at Claude's discretion per section

#### About section emphasis
- Design-first narrative: start with design background, show how it evolved into full-stack development
- Mention formal design education explicitly ("trained as a designer" or similar)
- Present design-to-development transition as a natural evolution ("design led me to code")
- Accessibility as a notable mention — included naturally in the approach, not the headline
- Keep technology references high-level ("modern web technologies") — let portfolio speak to specifics
- State 10+ years experience and Galicia/Spain location explicitly
- Forward-looking only — no career history, past employers, or client names
- Blank slate rewrite — no need to match existing structure
- Light personal touch reflecting craft & quality values — care for well-made things, clean code, thoughtful design, attention to detail
- Explicitly mention working independently/freelance
- International client scope — the 4 languages reflect global reach
- End with a soft CTA ("Let's build something together" style)

#### Service framing
- Two service lines (high-performance websites + SaaS products) presented with equal weight
- "High-performance websites" means both: visually polished + technically fast — the full-stack + design advantage
- SaaS scope should specify types: dashboards, applications, internal tools — give clients concrete examples
- Hero section: Claude's discretion on whether to mention both services or use a broader statement

#### Contact form messaging
- Include SaaS, applications, and dashboards alongside web development in help text

### Claude's Discretion
- Copy length per section (hero, about, SEO descriptions)
- Hero section: whether to name both service lines or use a broader positioning statement
- Loading skeleton design, spacing, typography (not applicable — content only phase)
- Exact paragraph structure of About section

### Language Decisions

- All 4 versions (es, en, pt, gl) should read as native copy — no translation artifacts
- Tone culturally adapted per language (e.g., Spanish warmer, English more direct) while maintaining consistent professional-but-warm voice
- Galician treated as fully professional — not just a cultural gesture
- Portuguese is European Portuguese (pt-PT), not Brazilian
- SEO keywords adapted per language to match local search behavior, not just direct translations

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^4.5.4 | Static site framework with i18n routing | Official Astro i18n support with routing, locale detection, and sitemap integration |
| JSON | N/A | Translation file format | Universal format, human-editable, version-controllable, works with Astro's native JSON imports |
| TypeScript | ^5.3.3 | Type safety for i18n utilities | Provides type inference for translation keys and locale detection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro-sitemap | ^3.1.6 | Sitemap generation with i18n | Automatically generates hreflang tags for multilingual SEO (already configured) |
| Zod | ^3.23.8 | Schema validation | Could validate JSON structure if needed, but not required for simple content updates |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Flat JSON files | astro-i18n library | Current custom solution is simpler, no external dependencies needed, already working |
| Custom i18n | Astro Content Collections | Overkill for static UI strings; Content Collections better for markdown/blog content |
| JSON | YAML/TOML | JSON has better tooling support, native JavaScript compatibility, and is already implemented |

**Installation:**
```bash
# No new packages needed - all dependencies already installed
# Project uses custom i18n implementation with existing Astro setup
```

## Architecture Patterns

### Current Project Structure
```
src/
├── i18n/
│   ├── index.ts          # getI18N() utility - merges locale with Spanish fallback
│   ├── utils.ts          # getLangFromUrl(), useTranslations(), routing helpers
│   ├── ui.ts             # LANGUAGES constant, routes config (minimal usage)
│   ├── es.json          # Spanish (default locale)
│   ├── en.json          # English
│   ├── pt.json          # European Portuguese (pt-PT)
│   └── gl.json          # Galician
└── components/
    ├── pages/index.astro       # Consumes i18n.SEO_TITLE_1, i18n.SEO_DESCRIPTION
    ├── sections/About.astro    # Renders i18n.ABOUTSECTION.H2 and .CONTENT
    └── ContactForm.astro       # Uses i18n.CONTACTSECTION.FORM.* keys
```

### Pattern 1: Fallback Merge Strategy
**What:** The `getI18N()` function merges Spanish (base) with locale-specific JSON to ensure all keys exist even if a translation is missing.

**When to use:** Every component that needs translated strings (standard pattern for this project).

**Example:**
```typescript
// Source: /src/i18n/index.ts
export const getI18N = ({
  currentLocale = 'es'
}: {
  currentLocale: string | undefined
}) => {
  if (currentLocale === LANG.PORTUGUESE) return { ...spanish, ...portuguese }
  if (currentLocale === LANG.ENGLISH) return { ...spanish, ...english }
  if (currentLocale === LANG.GALICIAN) return { ...spanish, ...galician }
  return spanish
}
```

**Critical implication:** All four JSON files MUST maintain identical key structures. Missing keys in en.json/pt.json/gl.json will fall back to Spanish values, which could result in mixed-language content.

### Pattern 2: Nested Object Keys with HTML Support
**What:** JSON uses nested objects for logical grouping (HERO, ABOUTSECTION, CONTACTSECTION) and supports HTML strings via `set:html` in Astro components.

**When to use:** For structured content with semantic grouping; HTML tags for emphasis, links, and formatting.

**Example:**
```json
// Source: /src/i18n/es.json
{
  "SEO_TITLE_1": "Diego de Sousa | desarrollador frontend",
  "SEO_DESCRIPTION": "...",
  "HERO": {
    "H1": "<span class='block'>Me llamo Diego,</span> soy un desarrollador <em>frontend</em>...",
    "PORTRAIT": {
      "ALT": "Foto de Diego de Sousa"
    }
  },
  "ABOUTSECTION": {
    "H2": "Sobre mí",
    "CONTENT": "<p>Con 12 años, mi padre...</p><p><strong>Diseñador gráfico</strong>..."
  }
}
```

**HTML rendering:**
```astro
<!-- Source: /src/components/pages/index.astro -->
<h1 set:html={i18n.HERO.H1} />

<!-- Source: /src/components/sections/About.astro -->
<div set:html={i18n.ABOUTSECTION.CONTENT} />
```

### Pattern 3: Locale Configuration with Astro i18n
**What:** Astro config defines default locale (es) and available locales, integrated with sitemap for hreflang tags.

**Example:**
```javascript
// Source: /astro.config.mjs
export default defineConfig({
  site: 'https://diegodesousa.com',
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "pt", "gl"],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
          pt: 'pt-PT',  // European Portuguese
          gl: 'gl-ES',  // Galician (Spain)
        },
      },
    })
  ],
})
```

### Anti-Patterns to Avoid
- **Breaking JSON structure across files:** Each language file MUST have identical key paths. Don't add keys to only one language or remove keys from others.
- **Translation artifacts:** Don't use literal word-for-word translation. Spanish "ordenador portátil" should become "laptop" in English, not "portable computer."
- **Inconsistent HTML formatting:** Maintain consistent use of `<p>`, `<strong>`, `<em>`, and `<a>` tags across all language versions for predictable rendering.
- **Generic professional jargon:** Avoid phrases like "results-driven professional" or "proven track record"—they sound robotic and reduce authenticity.
- **Brazilian Portuguese conventions in pt.json:** File is pt-PT (European Portuguese). Use "telemóvel" not "celular", "comboio" not "trem", "pequeno-almoço" not "café da manhã".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON validation | Custom JavaScript schema checker | Manual review + JSON linters (VSCode built-in) | Simple structure, 4 files only, validation overhead not justified |
| Translation management | Custom translation platform/database | Direct JSON file editing | Small project (4 languages × ~15 keys each), version control is sufficient |
| Locale detection | Custom header parsing | Astro's built-in `getLangFromUrl()` | Already implemented and working correctly |
| Plural/gender rules | Custom templating logic | Keep strings simple, avoid complex grammar rules | Content is primarily about Diego (singular, male)—no pluralization needed |
| RTL language support | Custom CSS direction logic | Not applicable | All four languages are LTR (left-to-right) |

**Key insight:** For a portfolio site with static content, direct JSON editing is more maintainable than translation management systems. The project's four-language scope is below the threshold where automation tools add value versus complexity.

## Common Pitfalls

### Pitfall 1: Mixed Language Fallbacks
**What goes wrong:** Editor updates English HERO.H1 but forgets to update pt.json/gl.json, causing Portuguese/Galician sites to display Spanish text for the hero section.

**Why it happens:** The merge pattern in `getI18N()` silently falls back to Spanish for missing keys without warnings.

**How to avoid:**
- Always update all four files (es, en, pt, gl) in the same commit
- Use a checklist: for each modified key, verify it exists in all four JSONs
- Consider a pre-commit script that validates identical key structures across files

**Warning signs:** Visit `/en/`, `/pt/`, `/gl/` versions and spot-check key sections. Mixed languages indicate forgotten translations.

### Pitfall 2: Translation Artifacts (Not Localization)
**What goes wrong:** Content reads like Google Translate output—grammatically correct but culturally awkward. Example: translating Spanish's longer, warmer sentences literally into English creates overly verbose, formal text.

**Why it happens:** Treating localization as word-for-word translation instead of cultural adaptation. [Research shows](https://pmc.ncbi.nlm.nih.gov/articles/PMC8633163/) Spanish and English have fundamentally different discourse patterns—Spanish uses longer subordinate clauses, while English prefers shorter, direct statements.

**How to avoid:**
- Write each language version from scratch using the source content as inspiration, not template
- Spanish: Warmer, more personal, longer sentences acceptable
- English: More direct, concise, action-oriented
- Portuguese (pt-PT): Formal register, European vocabulary ("telemóvel" not "celular")
- Galician: Full professional treatment, not diminished or colloquial

**Warning signs:** If non-native speakers report text feels "stiff" or "unnatural," it's likely a translation artifact.

### Pitfall 3: Invalid JSON After Editing
**What goes wrong:** Missing comma, unclosed quote, or trailing comma in JSON breaks the entire site build.

**Why it happens:** JSON is unforgiving to syntax errors, and manual editing introduces typos.

**How to avoid:**
- Use VSCode with JSON validation enabled (built-in)
- After editing, save file and check for red squiggles/error indicators
- Run `npm run build` or `astro check` before committing to catch parse errors early
- Consider using a JSON formatter (Prettier) to auto-fix formatting

**Warning signs:**
```bash
# Build error example:
SyntaxError: Unexpected token } in JSON at position 1234
```

### Pitfall 4: SEO Keywords Not Adapted Per Language
**What goes wrong:** SEO_DESCRIPTION uses identical keywords across languages ("full-stack developer" → "desarrollador full-stack") instead of researching how each market actually searches.

**Why it happens:** Assuming SEO keywords translate directly. [Research shows](https://www.designrush.com/agency/search-engine-optimization/trends/multilingual-seo-best-practices) search behavior varies widely—Spain searches "ordenador portátil" while Mexico uses "laptop" (both Spanish).

**How to avoid:**
- Spanish (Spain): "desarrollador full-stack", "diseñador de producto", "aplicaciones web"
- English: "full-stack developer", "product designer", "web applications"
- Portuguese (pt-PT): "programador full-stack", "designer de produto", "aplicações web"
- Galician: Research Galician-specific professional terminology (less documented)

**Warning signs:** If SEO descriptions read like direct translations, they likely need keyword research.

### Pitfall 5: Inconsistent HTML Tag Usage
**What goes wrong:** Spanish ABOUTSECTION.CONTENT uses `<p>` tags and `<strong>` for emphasis, but English version uses `<div>` and `<b>` tags, causing styling inconsistencies.

**Why it happens:** Different editors or copy-paste from external sources bringing varied HTML conventions.

**How to avoid:**
- Document HTML tag conventions: use `<p>` for paragraphs, `<strong>` for bold, `<em>` for italic, `<a>` for links
- Use consistent tag nesting across all languages
- Review rendered output across all four language versions to catch visual inconsistencies

**Warning signs:** Styling looks different between language versions despite identical CSS.

## Code Examples

Verified patterns from official sources:

### Updating Translation Strings (Manual Process)

```json
// Before: es.json
{
  "SEO_TITLE_1": "Diego de Sousa | desarrollador frontend",
  "HERO": {
    "H1": "<span class='block'>Me llamo Diego,</span> soy un desarrollador <em>frontend</em>..."
  }
}

// After: Updated positioning
{
  "SEO_TITLE_1": "Diego de Sousa | Desarrollador Full-Stack & Diseñador de Producto",
  "HERO": {
    "H1": "<span class='block'>Me llamo Diego,</span> diseño y construyo <em>webs de alto rendimiento</em> y <em>productos SaaS</em>."
  }
}
```

**Process:**
1. Open all four JSON files side-by-side in editor
2. Update Spanish (es.json) first as the content source
3. Localize (not translate) to English, Portuguese, Galician
4. Verify JSON syntax with `astro check`
5. Preview each language route (`/`, `/en/`, `/pt/`, `/gl/`)

### Astro Component Consumption (No Changes Needed)

```astro
---
// Source: /src/components/pages/index.astro
import { getI18N } from '@/i18n'
const { currentLocale } = Astro
const i18n = getI18N({ currentLocale })
---

<html lang={lang}>
  <head>
    <BaseHead
      title={i18n.SEO_TITLE_1}
      description={i18n.SEO_DESCRIPTION}
    />
  </head>
  <body>
    <h1 set:html={i18n.HERO.H1} />
  </body>
</html>
```

**No code changes required.** Components already consume i18n correctly via `set:html` for formatted content and direct interpolation for plain text.

### JSON Validation Pattern

```bash
# Validate JSON syntax before committing
node -e "console.log(JSON.parse(require('fs').readFileSync('src/i18n/es.json')))"
node -e "console.log(JSON.parse(require('fs').readFileSync('src/i18n/en.json')))"
node -e "console.log(JSON.parse(require('fs').readFileSync('src/i18n/pt.json')))"
node -e "console.log(JSON.parse(require('fs').readFileSync('src/i18n/gl.json')))"

# Or run Astro build check
npm run build
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Generic "Web Developer" | "Full-Stack Developer & Product Designer" | 2026 trend | [Positioning over categories](https://searchengineland.com/why-copywriting-is-the-new-superpower-in-2026-467281)—markets reward specific problem-solving clarity |
| Third-person bios | First-person narrative | 2026 standard | [Direct connection](https://blog.hubspot.com/marketing/professional-bio-examples)—"I design" vs "He designs" builds authenticity |
| Translation-first | Localization-first | Ongoing | [Cultural adaptation](https://biglanguage.com/insights/blog/cultural-nuance-in-translation-why-it-matters-more-than-ever/) beats literal translation for engagement |
| Flat JSON structures | Nested JSON objects | Already implemented | Better organization for related keys, [common practice](https://www.i18next.com/misc/json-format) for i18n |
| Single Portuguese variant | pt-PT vs pt-BR distinction | SEO requirement | [Market-specific keywords](https://www.optimized.video/multilingual-seo/portuguese-seo) required for European vs Brazilian Portuguese |

**Deprecated/outdated:**
- **SEO_TITLE_2 field:** Currently empty string in all JSON files. Legacy field from previous site structure—can remain empty or be repurposed if needed.
- **Generic professional jargon:** Phrases like "results-driven professional with 10+ years of experience" are [considered glazing](https://blog.hubspot.com/marketing/professional-bio-examples) in 2026—narrative storytelling preferred.

## Copywriting Best Practices (2026)

### Design-First Narrative Structure

**What works in 2026:**
- Start with design identity: "I trained as a designer..." establishes foundation
- Show natural progression: "...which led me to code" (not sudden career switch)
- Lead with problems solved, not title: "I build high-performance websites and SaaS products" beats "I am a full-stack developer"
- [Narrative over resume](https://elementor.com/blog/how-to-write-a-personal-bio/): "I spent 10 years discovering that great design needs great code to come alive" creates story arc

**Tone calibration per language:**
- **Spanish (es):** [Warmer, more personal](https://pmc.ncbi.nlm.nih.gov/articles/PMC8633163/), longer sentences acceptable. "Con más de 10 años de experiencia, he aprendido que..."
- **English (en):** Direct, concise, action-oriented. "Over 10 years, I've learned that..."
- **Portuguese (pt-PT):** European formality, professional register. "Com mais de 10 anos de experiência, compreendi que..."
- **Galician (gl):** [Fully professional treatment](https://www.greencrescent.com/galician-translation), not diminished. Equivalent warmth to Spanish but adapted to Galician conventions.

### SEO Meta Description Writing

**2026 standards ([source](https://optimational.com/blog/complete-guide-multilingual-seo/)):**
- 150-160 characters optimal (Google truncates longer descriptions)
- Include primary keyword early: "Desarrollador Full-Stack & Diseñador de Producto"
- Mention both service lines: "Webs de alto rendimiento y productos SaaS"
- Local search signals: "Galicia, España" for Spanish; "Galicia, Spain" for English
- Action-oriented: "Descubre cómo puedo ayudarte" vs "Información sobre servicios"

**Keyword adaptation per market ([source](https://geotargetly.com/blog/seo-translation-guide)):**
```
Spanish (es-ES):
- desarrollador full-stack
- diseñador de producto
- webs de alto rendimiento
- aplicaciones SaaS
- dashboards personalizados

English (en-US):
- full-stack developer
- product designer
- high-performance websites
- SaaS applications
- custom dashboards

Portuguese (pt-PT):
- programador full-stack (NOT "desenvolvedor", which is Brazilian)
- designer de produto
- websites de alto desempenho
- aplicações SaaS
- dashboards personalizados

Galician (gl-ES):
- desenvolvedor full-stack
- deseñador de produto
- webs de alto rendemento
- aplicacións SaaS
- cadros de mando personalizados
```

### Contact Form Placeholder Guidance

**Current (es.json):**
```
"HELP_PLACEHOLDER": "diseño web, desarrollo de mi diseño, tienda online, etc."
```

**Updated to include SaaS:**
```
"HELP_PLACEHOLDER": "diseño web, desarrollo web, aplicaciones SaaS, dashboards, tiendas online, etc."
```

**Localized per language:**
- **English:** "web design, web development, SaaS applications, dashboards, online stores, etc."
- **Portuguese (pt-PT):** "design web, desenvolvimento web, aplicações SaaS, dashboards, lojas online, etc."
- **Galician:** "deseño web, desenvolvemento web, aplicacións SaaS, cadros de mando, tendas online, etc."

## Quality Assurance Checklist

### Pre-Commit Validation
- [ ] All four JSON files (es, en, pt, gl) updated with identical key structure
- [ ] JSON syntax validated (no trailing commas, unmatched braces, unclosed strings)
- [ ] HTML tags consistent across languages (`<p>`, `<strong>`, `<em>`, `<a>`)
- [ ] SEO_TITLE_1 and SEO_DESCRIPTION under 160 characters per language
- [ ] No translation artifacts—each language reads naturally for native speakers
- [ ] Portuguese uses European Portuguese vocabulary (pt-PT, not pt-BR)
- [ ] Galician treated as fully professional, not colloquial or diminished

### Post-Deployment Verification
- [ ] Visit `/` (Spanish) and verify hero, about, contact sections
- [ ] Visit `/en/` (English) and verify content consistency
- [ ] Visit `/pt/` (Portuguese) and verify European Portuguese conventions
- [ ] Visit `/gl/` (Galician) and verify professional tone
- [ ] Check browser DevTools for any "key not found" console errors
- [ ] Verify meta tags in page source (`<title>` and `<meta name="description">`)
- [ ] Run Lighthouse SEO audit to confirm hreflang tags present

## Open Questions

1. **LinkedIn profile content access**
   - What we know: Context mentions "About rewrite based on LinkedIn summary content"
   - What's unclear: Does implementation team have access to Diego's actual LinkedIn profile, or should About content be written from scratch based on context decisions?
   - Recommendation: Confirm whether LinkedIn profile should be referenced or if About section should be written fresh based on documented constraints (design-first narrative, 10+ years experience, Galicia location, two service lines)

2. **SEO_TITLE_2 field purpose**
   - What we know: Field exists in all four JSON files but contains empty string
   - What's unclear: Legacy field from previous site structure, or intended for future use?
   - Recommendation: Leave as empty string for now unless project documentation specifies otherwise. No components currently consume this field.

3. **Galician SEO keyword research**
   - What we know: Galician must be treated as fully professional, not cultural gesture
   - What's unclear: Best SEO keywords for Galician market (less documented than Spanish/English/Portuguese)
   - Recommendation: Use professional Galician terminology adapted from Spanish, with awareness that Galician search behavior may be less researched. Consider consulting native Galician speaker for professional tech terminology validation.

## Sources

### Primary (HIGH confidence)
- Astro v4.5.4 documentation: [Internationalization (i18n) Routing](https://docs.astro.build/en/guides/internationalization/)
- Astro i18n recipe: [Add i18n features](https://docs.astro.build/en/recipes/i18n/)
- Project source code: `/src/i18n/` directory structure and implementation
- Astro Starlight i18n guide: [Internationalization (i18n)](https://starlight.astro.build/guides/i18n/)

### Secondary (MEDIUM confidence)
- Optimational: [Multilingual SEO Localisation 2026: Complete Guide](https://optimational.com/blog/complete-guide-multilingual-seo/)
- GeoTargetly: [SEO Translation: Complete Guide to Multilingual Search Success (2026)](https://geotargetly.com/blog/seo-translation-guide)
- Neil Patel: [How to Correctly Setup Your SEO for Different Language and Countries](https://neilpatel.com/blog/international-seo/)
- Bitdoze: [Add Localization(i18n) to Your Astro Project (Complete Guide)](https://www.bitdoze.com/astro-i18n-localization/)
- Borja Gomez: [Astro Localization & i18n Guide](https://borjagomez.com/en/blog/i18n-with-astro/)
- Intlayer: [Astro i18n - How to translate your Astro app – guide 2026](https://intlayer.org/doc/environment/astro)
- Lokalise: [How to translate JSON files: guide to l10n & i18n](https://lokalise.com/blog/json-l10n/)
- Localazy: [What's the best structure for i18n JSON files?](https://localazy.com/faq/file-formats/what-s-the-best-structure-for-i18n-json-files)
- i18next documentation: [JSON Format](https://www.i18next.com/misc/json-format)
- Translinguist: [Brazilian vs European Portuguese Translation Differences](https://translinguist.com/blog/brazilian-vs-european-portuguese/)
- Veqta: [Difference Between Brazilian Portuguese and European Portuguese](https://veqta.com/difference-brazilian-portuguese-and-european/)
- Simultrans: [Differences Between Brazilian Portuguese and European Portuguese](https://www.simultrans.com/blog/differences-between-brazilian-portuguese-and-european-portuguese)
- Esmedo: [English-Galician website translation and localization](https://esmedo.es/en/web-localisation/galician-website-translations/)
- Green Crescent: [Professional Galician Translation Services](https://www.greencrescent.com/galician-translation)
- PMC (NIH): [When English clashes with other languages: Insights and cautions](https://pmc.ncbi.nlm.nih.gov/articles/PMC8633163/)
- Blarlo: [Transcreation and cultural adaptation in professional translation](https://blog.blarlo.com/en/transcreation-and-cultural-adaptation-in-professional-translation/)
- Big Language: [Why Cultural Nuance in Translation Matters More Than Ever](https://biglanguage.com/insights/blog/cultural-nuance-in-translation-why-it-matters-more-than-ever/)
- SearchEngineLand: [Why copywriting is the new superpower in 2026](https://searchengineland.com/why-copywriting-is-the-new-superpower-in-2026-467281)
- Elementor: [How to Write a Personal Bio? 26 Personal Bio Examples in 2026](https://elementor.com/blog/how-to-write-a-personal-bio/)
- David Meerman Scott: [Write Your Biography In First Person](https://www.davidmeermanscott.com/blog/write-your-biography-in-first-person)
- HubSpot: [Professional Bio Examples: 29 Work Bios I Keep in My Back Pocket for Inspo](https://blog.hubspot.com/marketing/professional-bio-examples)
- Aqua Cloud: [Internationalization Testing: Best Practices Guide for 2026](https://aqua-cloud.io/internationalization-testing/)
- Medium (Anton Antonov): [i18n Testing — A Practical Guide for QA Engineers](https://medium.com/@AntonAntonov88/i18n-testing-a-practical-guide-for-qa-engineers-a92f7f4fc8b2)
- Localazy: [i18n and localization for Multilingual JSON powered apps](https://localazy.com/integrations/multilingual-json)

### Tertiary (LOW confidence)
- None flagged for validation—all research claims verified with official or authoritative sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Current implementation verified in codebase, Astro i18n documentation authoritative
- Architecture: HIGH - Direct inspection of `/src/i18n/` structure and component consumption patterns
- Pitfalls: MEDIUM-HIGH - Based on verified i18n patterns (HIGH) and web research on localization best practices (MEDIUM)
- Copywriting practices: MEDIUM - 2026 web search results cross-referenced with multiple professional sources
- Language-specific localization: MEDIUM - European Portuguese and Galician distinctions verified across multiple translation service sources

**Research date:** 2026-02-10
**Valid until:** 2026-04-10 (60 days - stable domain: JSON i18n patterns, copywriting principles; language-specific SEO keywords may evolve with search trends)

## Ready for Planning

Research complete. Planner can now create PLAN.md files with confidence in:
1. **Exact file locations:** `/src/i18n/{es,en,pt,gl}.json`
2. **Key structure requirements:** Identical keys across all four files to support fallback merge
3. **Content constraints:** User decisions from CONTEXT.md provide clear copywriting guidelines
4. **Cultural localization guidance:** Language-specific tone adaptation, vocabulary choices, SEO keyword research
5. **Validation approach:** JSON syntax checking, visual preview across all four language routes
6. **No code changes required:** Pure JSON content updates, components already consume via `getI18N()`

**Recommended plan structure:**
- Task 1: Update es.json (source of truth)
- Task 2: Localize to en.json (not translate—adapt culturally)
- Task 3: Localize to pt.json (European Portuguese, pt-PT)
- Task 4: Localize to gl.json (fully professional Galician)
- Task 5: Validate JSON syntax and key structure consistency
- Task 6: Visual QA across all four language routes
