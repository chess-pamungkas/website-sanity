import {useCallback, useState} from 'react'
import {CopyIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import type {DocumentActionComponent, DocumentActionDescription} from 'sanity'
import {useRouter} from 'sanity/router'
import {useToast} from '@sanity/ui'
import {duplicateHubArticleAsDraft} from '../lib/duplicateHubArticle'

type DuplicateActionOptions = {
  group?: DocumentActionDescription['group']
}

function useDuplicateHubArticleAction(
  props: Parameters<DocumentActionComponent>[0],
  options: DuplicateActionOptions = {},
): DocumentActionDescription | null {
  const {id, type, draft, published, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const router = useRouter()
  const toast = useToast()
  const [isDuplicating, setIsDuplicating] = useState(false)

  const sourceId = draft?._id || published?._id || id

  const onHandle = useCallback(async () => {
    if (!sourceId) return

    setIsDuplicating(true)
    try {
      const newDraftId = await duplicateHubArticleAsDraft(client, sourceId)
      toast.push({
        status: 'success',
        title: 'Article duplicated',
        description: 'A draft copy was created.',
      })
      router.navigateIntent('edit', {id: newDraftId, type: 'hubArticle'})
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Failed to duplicate article',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setIsDuplicating(false)
      onComplete()
    }
  }, [client, id, onComplete, router, sourceId, toast])

  if (type !== 'hubArticle' || !sourceId) return null

  return {
    label: isDuplicating ? 'Duplicating…' : 'Duplicate',
    icon: CopyIcon,
    disabled: isDuplicating,
    group: options.group,
    onHandle,
  }
}

export const DuplicateHubArticleAsDraftAction: DocumentActionComponent = (props) =>
  useDuplicateHubArticleAction(props)

export const DuplicateHubArticlePaneAction: DocumentActionComponent = (props) =>
  useDuplicateHubArticleAction(props, {group: 'paneActions'})

DuplicateHubArticleAsDraftAction.action = 'duplicate'
