import {EarthGlobeIcon} from '@sanity/icons'
import {Card, Flex, Stack, Button, Text, Box} from '@sanity/ui'
import {useClient, useFormValue, type StringFieldProps} from 'sanity'
import {useEffect, useMemo, useState, type ReactNode} from 'react'
import {PREVIEW_SITES, buildPreviewUrl, getStudioPreviewSecret} from '../lib/previewUrls'

type DocLike = {
  _type?: string
  slug?: {current?: string}
  category?: {_ref?: string}
}

function usePreviewSlug(doc: DocLike | undefined) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [slug, setSlug] = useState('/trading-hub/')

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      if (!doc?._type) {
        setSlug('/trading-hub/')
        return
      }

      if (doc._type === 'tradingHubPage') {
        setSlug('/trading-hub/')
        return
      }

      if (doc._type === 'hubCategory') {
        const categorySlug = doc.slug?.current
        setSlug(categorySlug ? `/trading-hub/${categorySlug}/` : '/trading-hub/')
        return
      }

      if (doc._type === 'hubArticle') {
        const articleSlug = doc.slug?.current
        const categoryRef = doc.category?._ref
        if (!articleSlug || !categoryRef) {
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
          if (!cancelled) {
            setSlug(
              categorySlug
                ? `/trading-hub/${categorySlug}/${articleSlug}/`
                : '/trading-hub/',
            )
          }
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
  }, [client, doc])

  return slug
}

/**
 * Always-visible Preview buttons at the top of Trading Hub documents.
 */
export function StudioPreviewLinksField(props: StringFieldProps) {
  const doc = useFormValue([]) as DocLike | undefined
  const slug = usePreviewSlug(doc)
  const secret = getStudioPreviewSecret()

  const links = useMemo(
    () =>
      PREVIEW_SITES.map((site) => ({
        ...site,
        url: secret ? buildPreviewUrl(site.baseUrl, slug, secret) : '',
      })),
    [secret, slug],
  )

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="primary" border>
        <Stack space={3}>
          <Box>
            <Text size={1} weight="semibold">
              Draft preview (STAGING)
            </Text>
            <Box marginTop={2}>
              <Text size={1} muted>
                Opens draft content on each website. Save draft first — Publish is not required.
                Unpublished duplicates open via a draft-preview page until the first site rebuild.
              </Text>
            </Box>
          </Box>

          {!secret ? (
            <Text size={1} weight="medium">
              Missing SANITY_STUDIO_PREVIEW_SECRET — add it to studio/.env and redeploy Studio.
            </Text>
          ) : (
            <Flex gap={2} wrap="wrap">
              {links.map((link) => (
                <Button
                  key={link.id}
                  as="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  text={`Preview ${link.title}`}
                  icon={EarthGlobeIcon}
                  mode="ghost"
                  tone="primary"
                  fontSize={1}
                  padding={3}
                />
              ))}
            </Flex>
          )}
        </Stack>
      </Card>
      <div style={{display: 'none'}}>{props.renderDefault(props) as ReactNode}</div>
    </Stack>
  )
}
