import type {SanityClient} from '@sanity/client'
import {LexoRank} from 'lexorank'

const ORDER_FIELD_NAME = 'orderRank'

type ResetOrderOptions = {
  categoryId?: string
}

function buildCategoryFilter(categoryId?: string) {
  return categoryId ? ' && references($categoryId)' : ''
}

async function fetchPublishedArticleIds(
  client: SanityClient,
  categoryId?: string,
) {
  return client.fetch<string[]>(
    `*[_type == "hubArticle" && !(_id in path("drafts.**"))${buildCategoryFilter(
      categoryId,
    )}] | order(orderRank asc, publishedAt desc)._id`,
    categoryId ? {categoryId} : {},
  )
}

async function fetchExistingDraftIds(client: SanityClient, publishedIds: string[]) {
  if (!publishedIds.length) return []

  const draftIds = publishedIds.map((id) => `drafts.${id}`)
  return client.fetch<string[]>(`*[_id in $draftIds]._id`, {draftIds})
}

export async function resetHubArticleOrder(
  client: SanityClient,
  {categoryId}: ResetOrderOptions = {},
) {
  const publishedIds = await fetchPublishedArticleIds(client, categoryId)
  if (!publishedIds.length) return 0

  const draftIds = await fetchExistingDraftIds(client, publishedIds)

  let rank = LexoRank.min()
  let transaction = client.transaction()
  let patchCount = 0

  for (const documentId of publishedIds) {
    rank = rank.genNext().genNext()
    const orderRankValue = rank.toString()

    transaction = transaction.patch(documentId, {
      set: {[ORDER_FIELD_NAME]: orderRankValue},
    })
    patchCount += 1

    const draftId = `drafts.${documentId}`
    if (draftIds.includes(draftId)) {
      transaction = transaction.patch(draftId, {
        set: {[ORDER_FIELD_NAME]: orderRankValue},
      })
      patchCount += 1
    }
  }

  const result = await transaction.commit({
    visibility: 'sync',
    tag: 'hub-articles.reset-order',
  })

  return result?.results?.length ?? patchCount
}

/**
 * Ensures every hubArticle (published + draft) has orderRank.
 * Useful when a draft copy exists without orderRank and appears disabled in Studio.
 */
export async function repairMissingHubArticleOrderRanks(client: SanityClient) {
  const docs = await client.fetch<Array<{_id: string; orderRank?: string}>>(`
    *[_type == "hubArticle"]{ _id, orderRank }
  `)

  const missing = docs.filter((doc) => !doc.orderRank)
  if (!missing.length) return 0

  const publishedIds = [
    ...new Set(
      missing.map((doc) => (doc._id.startsWith('drafts.') ? doc._id.slice(7) : doc._id)),
    ),
  ]

  await resetHubArticleOrder(client, {})
  return publishedIds.length
}
