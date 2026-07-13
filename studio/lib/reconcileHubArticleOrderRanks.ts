import type {SanityClient} from '@sanity/client'
import {ORDER_FIELD_NAME} from './hubArticlesListQuery'

type DraftOrderRank = {
  _id: string
  orderRank?: string
}

export async function reconcilePublishedOrderRanksFromDrafts(
  client: SanityClient,
): Promise<number> {
  const drafts = await client.fetch<DraftOrderRank[]>(
    `*[_type == "hubArticle" && _id in path("drafts.**") && defined(orderRank)]{
      _id,
      orderRank
    }`,
    {},
    {tag: 'hub-articles.reconcile-order-rank'},
  )

  if (!drafts.length) return 0

  const publishedIds = drafts.map((draft) => draft._id.replace(/^drafts\./, ''))
  const publishedDocs = await client.fetch<DraftOrderRank[]>(
    `*[_id in $publishedIds]{_id, orderRank}`,
    {publishedIds},
    {tag: 'hub-articles.reconcile-order-rank'},
  )

  const publishedById = new Map(publishedDocs.map((doc) => [doc._id, doc.orderRank]))
  let transaction = client.transaction()
  let patchCount = 0

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '')
    const publishedRank = publishedById.get(publishedId)
    const draftRank = draft.orderRank

    if (!draftRank || publishedRank === draftRank) continue

    transaction = transaction.patch(publishedId, {
      set: {[ORDER_FIELD_NAME]: draftRank},
    })
    patchCount += 1
  }

  if (patchCount === 0) return 0

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-articles.reconcile-order-rank',
  })

  return patchCount
}
