import type {SanityClient} from '@sanity/client'
import {uuid} from '@sanity/uuid'
import {getNewHubArticleOrderRank} from './hubArticleOrderRank'

type LocalizedStringEntry = {
  _key?: string
  language?: string
  value?: string
}

type SlugValue = {
  _type?: string
  current?: string
}

function appendCopySuffix(
  titleField: LocalizedStringEntry[] | undefined,
): LocalizedStringEntry[] | undefined {
  if (!Array.isArray(titleField)) return titleField

  return titleField.map((entry) => ({
    ...entry,
    value: entry?.value ? `${entry.value} (Copy)` : entry.value,
  }))
}

function buildCopySlug(slug: SlugValue | undefined): SlugValue | undefined {
  if (!slug?.current) return slug

  return {
    ...slug,
    _type: slug._type || 'slug',
    current: `${slug.current}-copy`,
  }
}

export async function duplicateHubArticleAsDraft(
  client: SanityClient,
  sourceDocumentId: string,
): Promise<string> {
  const publishedId = sourceDocumentId.replace(/^drafts\./, '')
  const draftSourceId = `drafts.${publishedId}`

  const source =
    (await client.getDocument(draftSourceId)) || (await client.getDocument(publishedId))

  if (!source || source._type !== 'hubArticle') {
    throw new Error('Article not found')
  }

  const newDocumentId = uuid()
  const newDraftId = `drafts.${newDocumentId}`

  const {
    _id: _ignoredId,
    _rev: _ignoredRev,
    _createdAt: _ignoredCreatedAt,
    _updatedAt: _ignoredUpdatedAt,
    orderRank: _ignoredOrderRank,
    ...fields
  } = source

  const orderRank = await getNewHubArticleOrderRank(client, 'before')

  const duplicate = {
    ...fields,
    _id: newDraftId,
    _type: 'hubArticle',
    title: appendCopySuffix(fields.title as LocalizedStringEntry[] | undefined),
    slug: buildCopySlug(fields.slug as SlugValue | undefined),
    isNew: false,
    publishedAt: new Date().toISOString(),
    orderRank,
  }

  await client.create(duplicate)

  return newDraftId
}
