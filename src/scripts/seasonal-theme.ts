// Seasonal theme detection
// Determines current season based on date and sets data-season attribute on html element

export function getCurrentSeason(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // JavaScript months are 0-indexed
  const day = now.getDate()

  // Christmas (December 1 - January 6)
  if ((month === 12 && day >= 1) || (month === 1 && day <= 6)) {
    return 'christmas'
  }

  // Halloween (October 31)
  if (month === 10 && day === 31) {
    return 'halloween'
  }

  // Winter (December 21 - March 19)
  if (
    (month === 12 && day >= 21) ||
    month === 1 ||
    month === 2 ||
    (month === 3 && day < 20)
  ) {
    return 'winter'
  }

  // Spring (March 20 - June 20)
  if (
    (month === 3 && day >= 20) ||
    month === 4 ||
    month === 5 ||
    (month === 6 && day < 21)
  ) {
    return 'spring'
  }

  // Summer (June 21 - September 22)
  if (
    (month === 6 && day >= 21) ||
    month === 7 ||
    month === 8 ||
    (month === 9 && day < 23)
  ) {
    return 'summer'
  }

  // Autumn (September 23 - December 20)
  if (
    (month === 9 && day >= 23) ||
    month === 10 ||
    month === 11 ||
    (month === 12 && day < 21)
  ) {
    return 'autumn'
  }

  // Fallback to winter
  return 'winter'
}

// Apply seasonal theme immediately (for inline script)
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-season', getCurrentSeason())
}
