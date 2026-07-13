import {
  getPublishedId,
  getVersionFromId,
  isDraftId,
  isPublishedId,
  isVersionId,
} from 'sanity'
import type {HubArticleListDoc} from './hubArticlesReorder'

function isVersionForCurrentPerspective(
  document: HubArticleListDoc,
  perspectiveName: string,
  publishedId: string,
) {
  return (
    Boolean(document._id) &&
    isVersionId(document._id) &&
    getVersionFromId(document._id) === perspectiveName &&
    getPublishedId(document._id) === publishedId
  )
}

export function getFilteredDedupedDocs(
  documents: HubArticleListDoc[],
  perspectiveName?: string,
): HubArticleListDoc[] {
  const flatDocuments = documents.flat()
  const dedupedDocuments: HubArticleListDoc[] = []

  for (const cur of flatDocuments) {
    if (!cur._id) continue

    if (isVersionId(cur._id)) {
      const isCorrectVersion = getVersionFromId(cur._id) === perspectiveName
      if (
        perspectiveName &&
        perspectiveName !== 'drafts' &&
        perspectiveName !== 'published' &&
        isCorrectVersion
      ) {
        dedupedDocuments.push(cur)
      }
      continue
    }

    if (perspectiveName === 'published') {
      if (isPublishedId(cur._id)) {
        dedupedDocuments.push(cur)
      }
      continue
    }

    if (!isDraftId(cur._id)) {
      const publishedId = getPublishedId(cur._id)
      const hasMatchingVersion =
        perspectiveName && perspectiveName !== 'drafts' && perspectiveName !== 'published'
          ? flatDocuments.some((doc) =>
              isVersionForCurrentPerspective(doc, perspectiveName, publishedId),
            )
          : false
      const hasDraft = flatDocuments.some((doc) => doc._id === `drafts.${cur._id}`)
      const hasDuplicatePublished = flatDocuments.some(
        (doc) => doc !== cur && doc._id === cur._id,
      )

      if (!hasMatchingVersion && !hasDraft && !hasDuplicatePublished) {
        dedupedDocuments.push(cur)
      }
      continue
    }

    if (perspectiveName && perspectiveName !== 'drafts' && perspectiveName !== 'published') {
      const baseId = getPublishedId(cur._id)
      if (flatDocuments.some((doc) => isVersionForCurrentPerspective(doc, perspectiveName, baseId))) {
        continue
      }
    }

    dedupedDocuments.push({
      ...cur,
      hasPublished: flatDocuments.some(
        (doc) => doc._id === cur._id.replace('drafts.', ''),
      ),
    })
  }

  return dedupedDocuments
}
