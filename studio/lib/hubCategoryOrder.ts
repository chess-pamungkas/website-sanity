import type {SanityClient} from '@sanity/client'
import {SORT_FIELD_NAME} from './hubCategoriesListQuery'

export async function getNewHubCategorySortOrder(client: SanityClient): Promise<number> {
  const max = await client.fetch<number | null>(
    `*[_type == "hubCategory"] | order(sortOrder desc)[0].sortOrder`,
    {},
    {tag: 'hub-categories.new-sort-order'},
  )

  return typeof max === 'number' ? max + 1 : 0
}

export async function syncHubCategorySortOrder(
  client: SanityClient,
  documentId: string,
  sortOrder: number,
) {
  const publishedId = documentId.replace(/^drafts\./, '')
  const draftId = `drafts.${publishedId}`

  const [published, draft] = await Promise.all([
    client.getDocument(publishedId),
    client.getDocument(draftId),
  ])

  let transaction = client.transaction()
  let hasPatch = false

  if (published) {
    transaction = transaction.patch(publishedId, {
      set: {[SORT_FIELD_NAME]: sortOrder},
    })
    hasPatch = true
  }

  if (draft) {
    transaction = transaction.patch(draftId, {
      set: {[SORT_FIELD_NAME]: sortOrder},
    })
    hasPatch = true
  }

  if (!hasPatch) return

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-categories.sync-sort-order',
  })
}

type DraftSortOrder = {
  _id: string
  sortOrder?: number
}

export async function reconcilePublishedCategorySortOrdersFromDrafts(
  client: SanityClient,
): Promise<number> {
  const drafts = await client.fetch<DraftSortOrder[]>(
    `*[_type == "hubCategory" && _id in path("drafts.**") && defined(sortOrder)]{
      _id,
      sortOrder
    }`,
    {},
    {tag: 'hub-categories.reconcile-sort-order'},
  )

  if (!drafts.length) return 0

  const publishedIds = drafts.map((draft) => draft._id.replace(/^drafts\./, ''))
  const publishedDocs = await client.fetch<DraftSortOrder[]>(
    `*[_id in $publishedIds]{_id, sortOrder}`,
    {publishedIds},
    {tag: 'hub-categories.reconcile-sort-order'},
  )

  const publishedById = new Map(publishedDocs.map((doc) => [doc._id, doc.sortOrder]))
  let transaction = client.transaction()
  let patchCount = 0

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '')
    const publishedSortOrder = publishedById.get(publishedId)
    const draftSortOrder = draft.sortOrder

    if (draftSortOrder == null || publishedSortOrder === draftSortOrder) continue

    transaction = transaction.patch(publishedId, {
      set: {[SORT_FIELD_NAME]: draftSortOrder},
    })
    patchCount += 1
  }

  if (patchCount === 0) return 0

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-categories.reconcile-sort-order',
  })

  return patchCount
}

export async function resetHubCategorySortOrder(client: SanityClient) {
  const publishedIds = await client.fetch<string[]>(
    `*[_type == "hubCategory" && !(_id in path("drafts.**"))] | order(sortOrder asc, title[0].value asc)._id`,
    {},
    {tag: 'hub-categories.reset-sort-order'},
  )

  if (!publishedIds.length) return 0

  const draftIds = await client.fetch<string[]>(`*[_id in $draftIds]._id`, {
    draftIds: publishedIds.map((id) => `drafts.${id}`),
  })

  let transaction = client.transaction()
  let patchCount = 0

  publishedIds.forEach((documentId, index) => {
    transaction = transaction.patch(documentId, {
      set: {[SORT_FIELD_NAME]: index},
    })
    patchCount += 1

    const draftId = `drafts.${documentId}`
    if (draftIds.includes(draftId)) {
      transaction = transaction.patch(draftId, {
        set: {[SORT_FIELD_NAME]: index},
      })
      patchCount += 1
    }
  })

  const result = await transaction.commit({
    visibility: 'sync',
    tag: 'hub-categories.reset-sort-order',
  })

  return result?.results?.length ?? patchCount
}
