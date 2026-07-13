/**
 * URL slug helper for Studio "Generate" buttons.
 * Strips apostrophes instead of turning them into hyphens
 * (e.g. "Beginner's Guide" → "beginners-guide").
 */
const APOSTROPHE_LIKE = /[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u02BC]/g

export function slugifyTitle(input: string, maxLength = 96): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(APOSTROPHE_LIKE, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
}
