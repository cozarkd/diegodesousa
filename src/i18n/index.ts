// src/i18n/index.ts

import portuguese from '@/i18n/pt.json'
import english from '@/i18n/en.json'
import spanish from '@/i18n/es.json'
import galician from '@/i18n/gl.json'

const LANG = {
  PORTUGUESE: 'pt',
  ENGLISH: 'en',
  SPANISH: 'es',
  GALICIAN: 'gl'
}

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
