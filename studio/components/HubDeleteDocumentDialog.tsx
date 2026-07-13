import type {ReactNode} from 'react'
import {Box, Button, Card, Dialog, Flex, Stack, Text} from '@sanity/ui'
import {HUB_DELETE_DIALOG_CLASS} from '../lib/breakpoints'

export type HubDeleteDialogState =
  | {type: 'closed'}
  | {type: 'confirm'; documentTitle: string}
  | {
      type: 'blocked'
      documentTitle: string
      articleCount: number
    }

type HubDeleteDocumentDialogProps = {
  state: HubDeleteDialogState
  resourceLabel: 'article' | 'category'
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

function DocumentNameCard({documentTitle}: {documentTitle: string}) {
  return (
    <Card padding={3} radius={2} border tone="transparent">
      <Text
        size={2}
        weight="semibold"
        style={{
          wordBreak: 'break-word',
          lineHeight: 1.5,
        }}
      >
        {documentTitle}
      </Text>
    </Card>
  )
}

function DialogFooter({children}: {children: ReactNode}) {
  return (
    <Flex
      className="hub-delete-dialog__footer"
      gap={2}
      justify="flex-end"
      wrap="wrap"
      padding={4}
      paddingTop={3}
    >
      {children}
    </Flex>
  )
}

function DialogBody({children}: {children: ReactNode}) {
  return (
    <Box className="hub-delete-dialog__content" padding={4}>
      <Stack space={4}>{children}</Stack>
    </Box>
  )
}

type HubDeleteDialogShellProps = {
  id: string
  header: string
  onClose: () => void
  footer: ReactNode
  children: ReactNode
}

function HubDeleteDialogShell({
  id,
  header,
  onClose,
  footer,
  children,
}: HubDeleteDialogShellProps) {
  return (
    <Dialog
      id={id}
      className={HUB_DELETE_DIALOG_CLASS}
      header={header}
      onClose={onClose}
      footer={footer}
    >
      {children}
    </Dialog>
  )
}

export function HubDeleteDocumentDialog({
  state,
  resourceLabel,
  isDeleting,
  onClose,
  onConfirm,
}: HubDeleteDocumentDialogProps) {
  if (state.type === 'closed') return null

  if (state.type === 'blocked') {
    const articleLabel = state.articleCount === 1 ? 'article' : 'articles'

    return (
      <HubDeleteDialogShell
        id="hub-delete-blocked"
        header="Cannot delete category"
        onClose={onClose}
        footer={
          <DialogFooter>
            <Button text="OK" tone="primary" onClick={onClose} />
          </DialogFooter>
        }
      >
        <DialogBody>
          <Text size={2} style={{lineHeight: 1.6}}>
            This category cannot be deleted because it still contains articles.
          </Text>

          <DocumentNameCard documentTitle={state.documentTitle} />

          <Text muted size={1} style={{lineHeight: 1.6}}>
            <strong>{state.articleCount}</strong> {articleLabel} would lose their category if it
            were removed. Please move or delete those articles first, then try again.
          </Text>
        </DialogBody>
      </HubDeleteDialogShell>
    )
  }

  const resourceTitle = resourceLabel.charAt(0).toUpperCase() + resourceLabel.slice(1)

  return (
    <HubDeleteDialogShell
      id="hub-delete-confirm"
      header={`Delete ${resourceTitle.toLowerCase()}?`}
      onClose={() => {
        if (!isDeleting) onClose()
      }}
      footer={
        <DialogFooter>
          <Button text="Cancel" mode="ghost" disabled={isDeleting} onClick={onClose} />
          <Button
            text={isDeleting ? 'Deleting…' : 'Delete'}
            tone="critical"
            loading={isDeleting}
            onClick={onConfirm}
          />
        </DialogFooter>
      }
    >
      <DialogBody>
        <Text size={2} style={{lineHeight: 1.6}}>
          Are you sure you want to delete this {resourceLabel}?
        </Text>

        <DocumentNameCard documentTitle={state.documentTitle} />

        <Text muted size={1} style={{lineHeight: 1.6}}>
          This will permanently remove the {resourceLabel} from the website. This action cannot be
          undone.
        </Text>
      </DialogBody>
    </HubDeleteDialogShell>
  )
}
