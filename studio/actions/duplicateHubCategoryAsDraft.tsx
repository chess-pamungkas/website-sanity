import {useCallback, useState} from 'react'
import {CopyIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import type {DocumentActionComponent, DocumentActionDescription} from 'sanity'
import {useRouter} from 'sanity/router'
import {useToast} from '@sanity/ui'
import {duplicateHubCategoryAsDraft} from '../lib/duplicateHubCategory'

type DuplicateActionOptions = {
  group?: DocumentActionDescription['group']
}

function useDuplicateHubCategoryAction(
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
      const newDraftId = await duplicateHubCategoryAsDraft(client, sourceId)
      toast.push({
        status: 'success',
        title: 'Category duplicated',
        description: 'A draft copy was created.',
      })
      router.navigateIntent('edit', {id: newDraftId, type: 'hubCategory'})
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Failed to duplicate category',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setIsDuplicating(false)
      onComplete()
    }
  }, [client, onComplete, router, sourceId, toast])

  if (type !== 'hubCategory' || !sourceId) return null

  return {
    label: isDuplicating ? 'Duplicating…' : 'Duplicate',
    icon: CopyIcon,
    disabled: isDuplicating,
    group: options.group,
    onHandle,
  }
}

export const DuplicateHubCategoryAsDraftAction: DocumentActionComponent = (props) =>
  useDuplicateHubCategoryAction(props)

export const DuplicateHubCategoryPaneAction: DocumentActionComponent = (props) =>
  useDuplicateHubCategoryAction(props, {group: 'paneActions'})

DuplicateHubCategoryAsDraftAction.action = 'duplicate'
