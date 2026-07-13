import type {SanityClient} from '@sanity/client'
import {uuid} from '@sanity/uuid'
import {getNewHubCategorySortOrder} from './hubCategoryOrder'

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

export async function duplicateHubCategoryAsDraft(
  client: SanityClient,
  sourceDocumentId: string,
): Promise<string> {
  const publishedId = sourceDocumentId.replace(/^drafts\./, '')
  const draftSourceId = `drafts.${publishedId}`

  const source =
    (await client.getDocument(draftSourceId)) || (await client.getDocument(publishedId))

  if (!source || source._type !== 'hubCategory') {
    throw new Error('Category not found')
  }

  const newDocumentId = uuid()
  const newDraftId = `drafts.${newDocumentId}`

  const {
    _id: _ignoredId,
    _rev: _ignoredRev,
    _createdAt: _ignoredCreatedAt,
    _updatedAt: _ignoredUpdatedAt,
    sortOrder: _ignoredSortOrder,
    ...fields
  } = source

  const sortOrder = await getNewHubCategorySortOrder(client)

  const duplicate = {
    ...fields,
    _id: newDraftId,
    _type: 'hubCategory',
    title: appendCopySuffix(fields.title as LocalizedStringEntry[] | undefined),
    slug: buildCopySlug(fields.slug as SlugValue | undefined),
    sortOrder,
  }

  await client.create(duplicate)

  return newDraftId
}
