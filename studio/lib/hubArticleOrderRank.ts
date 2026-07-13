import type {SanityClient} from '@sanity/client'
import {LexoRank} from 'lexorank'

const ORDER_FIELD_NAME = 'orderRank'

function parseOrderRank(value: string | undefined, fallback: LexoRank) {
  if (typeof value !== 'string') return fallback

  try {
    return LexoRank.parse(value)
  } catch {
    return fallback
  }
}

export async function getNewHubArticleOrderRank(
  client: SanityClient,
  newItemPosition: 'before' | 'after' = 'before',
): Promise<string> {
  const direction = newItemPosition === 'before' ? 'asc' : 'desc'
  const edgeRank = await client.fetch<string | null>(
    `*[_type == "hubArticle" && defined(orderRank)]|order(orderRank ${direction})[0].orderRank`,
    {},
    {tag: 'hub-articles.new-order-rank'},
  )

  const compareRank = parseOrderRank(edgeRank ?? '', LexoRank.min())
  return (
    newItemPosition === 'before'
      ? compareRank.genPrev().genPrev()
      : compareRank.genNext().genNext()
  ).toString()
}

export async function syncHubArticleOrderRank(
  client: SanityClient,
  documentId: string,
  orderRank: string,
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
      set: {[ORDER_FIELD_NAME]: orderRank},
    })
    hasPatch = true
  }

  if (draft) {
    transaction = transaction.patch(draftId, {
      set: {[ORDER_FIELD_NAME]: orderRank},
    })
    hasPatch = true
  }

  if (!hasPatch) return

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-articles.sync-order-rank',
  })
}

export async function ensureHubArticleOrderRank(
  client: SanityClient,
  documentId: string,
): Promise<string> {
  const publishedId = documentId.replace(/^drafts\./, '')
  const published = await client.getDocument(publishedId)
  const draft = await client.getDocument(`drafts.${publishedId}`)

  const existingRank =
    draft?.orderRank || published?.orderRank || (await client.getDocument(documentId))?.orderRank

  if (typeof existingRank === 'string' && existingRank) {
    await syncHubArticleOrderRank(client, documentId, existingRank)
    return existingRank
  }

  const orderRank = await getNewHubArticleOrderRank(client, 'after')
  await syncHubArticleOrderRank(client, documentId, orderRank)
  return orderRank
}
