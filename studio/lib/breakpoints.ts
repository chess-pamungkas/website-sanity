/**
 * Mirrors Gatsby breakpoints in src/assets/styles/vars.scss
 * so Studio dialogs stay consistent with the website.
 */
export const BREAKPOINTS = {
  sm: 375,
  maxSm: 767,
  md: 768,
  maxLg: 1023,
  lg: 1024,
  maxXl: 1919,
  xl: 1920,
} as const

export const HUB_DELETE_DIALOG_CLASS = 'hub-delete-dialog'
