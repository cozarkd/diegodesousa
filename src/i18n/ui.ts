// Add missing imports
export const LANGUAGES: Record<string, { code: string; name: string }> = {
  pt: {
    code: 'pt',
    name: 'Português'
  },
  en: {
    code: 'en',
    name: 'English'
  },
  es: {
    code: 'es',
    name: 'Español'
  }
}

export const defaultLang = 'es'
export const showDefaultLang = false

export const ui = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.vota': 'Vota',
    'nav.info': 'Información',
    'nav.archivo': 'Archivo',
    'nav.legal': 'Aviso Legal',
    'nav.privacidad': 'Privacidad',
    'nav.cookies': 'Cookies'
  },
  en: {
    'nav.inicio': 'Home',
    'nav.vota': 'Vote',
    'nav.info': 'Information',
    'nav.archivo': 'Archive',
    'nav.legal': 'Legal Notice',
    'nav.privacidad': 'Privacy',
    'nav.cookies': 'Cookies'
  },
  pt: {
    'nav.inicio': 'Inici',
    'nav.vota': 'Vota',
    'nav.info': 'Informació',
    'nav.archivo': 'Arxiu',
    'nav.legal': 'Avís Legal',
    'nav.privacidad': 'Privacitat',
    'nav.cookies': 'Cookies'
  }
} as const

export const routes = {
  es: {
    vota: 'vota',
    info: 'info',
    archivo: 'archivo',
    'aviso-legal': 'aviso-legal',
    privacidad: 'privacidad',
    cookies: 'cookies'
  },
  en: {
    vota: 'vote',
    info: 'information',
    archivo: 'archive',
    'aviso-legal': 'legal-notice',
    privacidad: 'privacy',
    cookies: 'cookies'
  },
  pt: {
    vota: 'vota',
    info: 'informacio',
    archivo: 'arxiu',
    'aviso-legal': 'avis-legal',
    privacidad: 'privacitat',
    cookies: 'cookies'
  }
}
