import {useCallback} from 'react'
import type {BooleanInputProps} from 'sanity'
import {PatchEvent, useClient, useFormValue} from 'sanity'
import {syncHubArticleIsNew} from '../lib/syncHubArticleIsNew'

const API_VERSION = 'v2025-06-27'

function getIsNewValueFromPatch(event: PatchEvent): boolean | undefined {
  for (const patch of event.patches) {
    if (patch.type !== 'set') continue
    if (patch.path.length !== 1 || patch.path[0] !== 'isNew') continue
    if (typeof patch.value === 'boolean') return patch.value
  }

  return undefined
}

export function HubArticleIsNewInput(props: BooleanInputProps) {
  const client = useClient({apiVersion: API_VERSION})
  const documentId = useFormValue(['_id']) as string | undefined

  const handleChange = useCallback(
    (event: PatchEvent) => {
      props.onChange(event)

      const nextValue = getIsNewValueFromPatch(event)
      if (nextValue === undefined || !documentId) return

      syncHubArticleIsNew(client, documentId, nextValue).catch((error) => {
        console.error('Failed to sync isNew to published copy', error)
      })
    },
    [client, documentId, props],
  )

  return props.renderDefault({
    ...props,
    onChange: handleChange,
  })
}
