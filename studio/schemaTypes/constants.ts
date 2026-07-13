export const LOCALES = [
  {title: 'English', value: 'en'},
  {title: 'French', value: 'fr'},
  {title: 'Portuguese (BR)', value: 'br'},
  {title: 'Vietnamese', value: 'vn'},
  {title: 'Thai', value: 'th'},
  {title: 'Spanish', value: 'es'},
  {title: 'Italian', value: 'it'},
  {title: 'Chinese (Simplified)', value: 'cn'},
  {title: 'Chinese (Traditional)', value: 'zh'},
  {title: 'Indonesian', value: 'id'},
  {title: 'Japanese', value: 'jp'},
  {title: 'Malay', value: 'my'},
  {title: 'Arabic', value: 'ar'},
] as const

/** Default locale used for previews, slug source, and required validations. */
export const DEFAULT_LOCALE = 'en'

export const PUBLISH_TO_SITES = [
  {title: 'COM (oqtima.com)', value: 'com'},
  {title: 'JP (oqtima.co)', value: 'jp'},
  {title: 'LP COM (oqtimalp.com)', value: 'lp-com'},
] as const

export const RELATED_CONTENT_MODES = [
  {
    title: 'Manual only',
    value: 'manual',
  },
  {
    title: 'Same category (automatic)',
    value: 'sameCategory',
  },
  {
    title: 'Manual + fallback to same category (recommended)',
    value: 'manualWithFallback',
  },
] as const

/**
 * Suggested initial categories for EN locale (create manually in Studio):
 * 1. Trading Academy      (sortOrder: 1)
 * 2. Beginner's Guide     (sortOrder: 2)
 * 3. Intermediate Lessons (sortOrder: 3)
 * 4. Advanced Playbook    (sortOrder: 4)
 *
 * "All" is virtual on the frontend — do NOT create it as a category document.
 */
export const SUGGESTED_INITIAL_CATEGORIES = [
  'Trading Academy',
  "Beginner's Guide",
  'Intermediate Lessons',
  'Advanced Playbook',
] as const

/** Figma 1× sizes — shown to editors in Studio field descriptions. */
export const HUB_ARTICLE_IMAGE_SPECS = {
  thumbnail: {
    design: '405×240',
    aspect: '405:240',
    recommended: '810×480',
    note: 'Used on article cards (object-fit: cover).',
  },
  heroDesktop: {
    design: '1400×320',
    aspect: '35:8',
    recommended: '2800×640 (or wider for 2K/5K full-bleed)',
    note: 'Full-width hero on desktop & tablet (≥768px).',
  },
  heroMobile: {
    design: '393×665',
    aspect: '393:665',
    recommended: '786×1330',
    note: 'Portrait hero on mobile (≤767px).',
  },
} as const

export const HUB_AUTHOR_IMAGE_SPECS = {
  design: '132×96',
  aspect: '11:8 (card frame)',
  recommended: '264×192 or square 400×400 (1:1)',
  note: 'Square 1:1 headshots are supported. Frame fills edge-to-edge; set hotspot on the face for best crop.',
} as const

/** Trading Hub landing page hero — Figma 1× sizes. */
export const HUB_LANDING_PAGE_IMAGE_SPECS = {
  heroDesktop: {
    design: '1400×540',
    aspect: '70:27',
    recommended: '2800×1080 (or wider for 2K/5K full-bleed)',
    note: 'Wide hero artwork for desktop and tablet (≥768px).',
  },
  heroMobile: {
    design: '393×953',
    aspect: '393:953',
    recommended: '786×1906',
    note: 'Portrait hero artwork for mobile (≤767px).',
  },
} as const
