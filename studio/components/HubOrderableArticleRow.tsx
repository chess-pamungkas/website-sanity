import {useMemo, type ReactNode} from 'react'
import type {DraggableProvidedDragHandleProps} from '@hello-pangea/dnd'
import {DragHandleIcon} from '@sanity/icons'
import {Box, Flex, Text, Tooltip} from '@sanity/ui'
import {
  DocumentStatus,
  DocumentStatusIndicator,
  Preview,
  PreviewCard,
  useDocumentVersionInfo,
  useSchema,
} from 'sanity'
import {usePaneRouter} from 'sanity/structure'
import {getLocalizedString} from '../lib/getLocalizedValue'
import {HubArticleRowMenu} from './HubArticleRowMenu'

const ORDER_FIELD_NAME = 'orderRank'

type HubArticleDoc = {
  _id: string
  _type: string
  orderRank?: string
  title?: Array<{_key?: string; language?: string; value?: string}>
}

type HubOrderableArticleRowProps = {
  doc: HubArticleDoc
  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

export function HubOrderableArticleRow({doc, dragHandleProps}: HubOrderableArticleRowProps) {
  const schema = useSchema()
  const router = usePaneRouter()
  const versionsInfo = useDocumentVersionInfo(doc._id)
  const {ChildLink, groupIndex, routerPanesState} = router

  const currentDoc = routerPanesState[groupIndex + 1]?.[0]?.id || false
  const pressed =
    currentDoc === doc._id || currentDoc === doc._id.replace('drafts.', '')
  const selected = pressed && routerPanesState.length === groupIndex + 2

  const schemaType = schema.get(doc._type)
  if (!schemaType) return null

  const tooltip = (
    <DocumentStatus
      draft={versionsInfo.draft}
      published={versionsInfo.published}
      versions={versionsInfo.versions}
    />
  )

  const Link = useMemo(
    () =>
      function LinkComponent({children}: {children: ReactNode}) {
        return <ChildLink childId={doc._id}>{children}</ChildLink>
      },
    [ChildLink, doc._id],
  )

  const isMissingOrder = !doc[ORDER_FIELD_NAME]

  return (
    <Flex
      align="center"
      width="100%"
      style={isMissingOrder ? {opacity: 0.85} : undefined}
    >
      <Box paddingX={2} style={{flexShrink: 0}} {...(dragHandleProps || {})}>
        <Text size={2}>
          <DragHandleIcon cursor="grab" />
        </Text>
      </Box>

      <Box flex={1} style={{minWidth: 0}}>
        <PreviewCard
          __unstable_focusRing
          as={Link}
          data-as="a"
          data-ui="PaneItem"
          radius={2}
          pressed={pressed}
          selected={selected}
          sizing="border"
          tabIndex={-1}
          tone="inherit"
          width="100%"
          flex={1}
          childId={doc._id}
        >
          <Flex flex={1} align="center" justify="space-between" paddingRight={2} gap={2}>
            <Preview layout="default" value={doc} schemaType={schemaType} />
            <Tooltip content={tooltip} portal placement="right">
              <Flex align="center" style={{flexShrink: 0}}>
                <DocumentStatusIndicator
                  draft={versionsInfo.draft}
                  published={versionsInfo.published}
                  versions={versionsInfo.versions}
                />
              </Flex>
            </Tooltip>
          </Flex>
        </PreviewCard>
      </Box>

      <HubArticleRowMenu
        documentId={doc._id}
        documentTitle={getLocalizedString(doc.title) || 'Untitled article'}
      />
    </Flex>
  )
}
