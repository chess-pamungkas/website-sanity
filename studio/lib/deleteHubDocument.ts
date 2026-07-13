import type {SanityClient} from '@sanity/client'

export async function deleteHubDocument(client: SanityClient, documentId: string) {
  const publishedId = documentId.replace(/^drafts\./, '')
  const draftId = `drafts.${publishedId}`

  const rawClient = client.withConfig({perspective: 'raw'})

  const [published, draft] = await Promise.all([
    rawClient.getDocument(publishedId),
    rawClient.getDocument(draftId),
  ])

  if (!published && !draft) {
    throw new Error('Document not found')
  }

  let transaction = rawClient.transaction()

  if (published) {
    transaction = transaction.delete(publishedId)
  }

  if (draft) {
    transaction = transaction.delete(draftId)
  }

  await transaction.commit({
    visibility: 'sync',
    tag: 'hub-documents.delete',
  })
}
