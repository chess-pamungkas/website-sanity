import {EarthGlobeIcon} from '@sanity/icons'
import {type DocumentActionComponent, type DocumentActionProps, useClient} from 'sanity'
import {useToast} from '@sanity/ui'
import {useCallback, useEffect, useState} from 'react'
import {PREVIEW_SITES, buildPreviewUrl, getStudioPreviewSecret} from '../lib/previewUrls'

type PreviewSite = (typeof PREVIEW_SITES)[number]

function useResolvedPreviewSlug(props: DocumentActionProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [slug, setSlug] = useState('/trading-hub/')

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      const type = props.type
      const draftOrPublished = props.draft || props.published
      if (!draftOrPublished) {
        setSlug('/trading-hub/')
        return
      }

      if (type === 'tradingHubPage') {
        setSlug('/trading-hub/')
        return
      }

      if (type === 'hubCategory') {
        const categorySlug = (draftOrPublished as {slug?: {current?: string}})?.slug
          ?.current
        setSlug(categorySlug ? `/trading-hub/${categorySlug}/` : '/trading-hub/')
        return
      }

      if (type === 'hubArticle') {
        const articleSlug = (draftOrPublished as {slug?: {current?: string}})?.slug
          ?.current
        const categoryRef = (draftOrPublished as {category?: {_ref?: string}})?.category
          ?._ref

        if (!articleSlug) {
          setSlug('/trading-hub/')
          return
        }

        if (!categoryRef) {
          setSlug('/trading-hub/')
          return
        }

        try {
          const categorySlug = await client.fetch<string | null>(
            `*[_id == $id || _id == $draftId][0].slug.current`,
            {
              id: categoryRef.replace(/^drafts\./, ''),
              draftId: categoryRef.startsWith('drafts.')
                ? categoryRef
                : `drafts.${categoryRef}`,
            },
          )
          if (cancelled) return
          setSlug(
            categorySlug
              ? `/trading-hub/${categorySlug}/${articleSlug}/`
              : '/trading-hub/',
          )
        } catch {
          if (!cancelled) setSlug('/trading-hub/')
        }
        return
      }

      setSlug('/trading-hub/')
    }

    void resolve()
    return () => {
      cancelled = true
    }
  }, [client, props.draft, props.published, props.type])

  return slug
}

function createPreviewSiteAction(site: PreviewSite): DocumentActionComponent {
  const PreviewSiteAction: DocumentActionComponent = (props) => {
    const toast = useToast()
    const slug = useResolvedPreviewSlug(props)
    const secret = getStudioPreviewSecret()

    const onHandle = useCallback(() => {
      if (!secret) {
        toast.push({
          status: 'warning',
          title: 'Preview secret missing',
          description:
            'Set SANITY_STUDIO_PREVIEW_SECRET (same value as website SANITY_PREVIEW_SECRET), then redeploy Studio.',
        })
        props.onComplete()
        return
      }

      const url = buildPreviewUrl(site.baseUrl, slug, secret)
      window.open(url, '_blank', 'noopener,noreferrer')
      props.onComplete()
    }, [props, secret, slug, toast])

    return {
      label: `Preview ${site.title}`,
      icon: EarthGlobeIcon,
      onHandle,
      title: `Open draft preview on ${site.title} staging`,
    }
  }

  PreviewSiteAction.action = `preview-${site.id}`
  PreviewSiteAction.displayName = `Preview${site.title.replace(/\s+/g, '')}Action`
  return PreviewSiteAction
}

export const PreviewComAction = createPreviewSiteAction(PREVIEW_SITES[0])
export const PreviewJpAction = createPreviewSiteAction(PREVIEW_SITES[1])
export const PreviewLpComAction = createPreviewSiteAction(PREVIEW_SITES[2])

export const TRADING_HUB_PREVIEW_TYPES = [
  'tradingHubPage',
  'hubCategory',
  'hubArticle',
] as const
