/**
 * Shared tag styling mapping.
 * Maps technology names to their CSS classes for consistent badge rendering
 * across the home page (ProjectsSection) and case study pages.
 */
const TAG_STYLES: Record<string, string> = {
  'Next.js': 'bg-black text-white',
  'Astro': 'bg-[#0D2B3E] text-white',
  'WCAG AA': 'bg-[#FFD700] text-black',
  'TypeScript': 'bg-[#007ACC] text-white',
  '11ty': 'bg-black text-white',
  'Tailwind CSS': 'bg-[#003159] text-white',
  'Tauri': 'bg-[#A4A4A4] text-black',
  'React': 'bg-[#61DAFB] text-black',
}

const FALLBACK_STYLE = 'bg-muted text-muted-foreground'

export function getTagClass(name: string): string {
  return TAG_STYLES[name] ?? FALLBACK_STYLE
}
