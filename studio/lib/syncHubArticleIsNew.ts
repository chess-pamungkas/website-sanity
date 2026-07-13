import type {SanityClient} from '@sanity/client'

export async function syncHubArticleIsNew(
  client: SanityClient,
  documentId: string,
  isNew: boolean,
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
      set: {isNew},
    })
    hasPatch = true
  }

  if (draft) {
    transaction = transaction.patch(draftId, {
      set: {isNew},
    })
    hasPatch = true
  }

  if (!hasPatch) return

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-articles.sync-is-new',
  })
}

type DraftIsNew = {
  _id: string
  isNew?: boolean
}

export async function reconcilePublishedIsNewFromDrafts(
  client: SanityClient,
): Promise<number> {
  const drafts = await client.fetch<DraftIsNew[]>(
    `*[_type == "hubArticle" && _id in path("drafts.**")]{
      _id,
      isNew
    }`,
    {},
    {tag: 'hub-articles.reconcile-is-new'},
  )

  if (!drafts.length) return 0

  const publishedIds = drafts.map((draft) => draft._id.replace(/^drafts\./, ''))
  const publishedDocs = await client.fetch<DraftIsNew[]>(
    `*[_id in $publishedIds]{_id, isNew}`,
    {publishedIds},
    {tag: 'hub-articles.reconcile-is-new'},
  )

  const publishedById = new Map(publishedDocs.map((doc) => [doc._id, doc.isNew]))
  let transaction = client.transaction()
  let patchCount = 0

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '')
    const publishedIsNew = publishedById.get(publishedId)
    const draftIsNew = draft.isNew === true

    if (publishedIsNew === draftIsNew) continue

    transaction = transaction.patch(publishedId, {
      set: {isNew: draftIsNew},
    })
    patchCount += 1
  }

  if (patchCount === 0) return 0

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-articles.reconcile-is-new',
  })

  return patchCount
}
