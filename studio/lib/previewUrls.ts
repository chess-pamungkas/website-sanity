/**
 * Staging website bases used by Studio "Open preview" document actions.
 * Override with SANITY_STUDIO_PREVIEW_URL_COM / _JP / _LP_COM at studio build/deploy time.
 */
export const PREVIEW_SITES = [
  {
    id: 'com',
    title: 'COM',
    baseUrl:
      process.env.SANITY_STUDIO_PREVIEW_URL_COM ||
      'https://website-sanity-xi.vercel.app',
  },
  {
    id: 'jp',
    title: 'JP',
    baseUrl:
      process.env.SANITY_STUDIO_PREVIEW_URL_JP ||
      'https://website-jp-sanity.vercel.app',
  },
  {
    id: 'lp-com',
    title: 'LP COM',
    baseUrl:
      process.env.SANITY_STUDIO_PREVIEW_URL_LP_COM ||
      'https://website-lp-com-sanity.vercel.app',
  },
] as const

export function getStudioPreviewSecret(): string {
  return (
    process.env.SANITY_STUDIO_PREVIEW_SECRET ||
    process.env.SANITY_PREVIEW_SECRET ||
    ''
  ).trim()
}

export function buildPreviewUrl(baseUrl: string, slug: string, secret: string) {
  const base = baseUrl.replace(/\/$/, '')
  const path = slug.startsWith('/') ? slug : `/${slug}`
  const url = new URL(`${base}/api/preview`)
  url.searchParams.set('secret', secret)
  url.searchParams.set('slug', path)
  return url.toString()
}
