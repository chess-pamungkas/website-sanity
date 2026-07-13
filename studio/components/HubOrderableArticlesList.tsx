import {useCallback, useEffect, useMemo, useRef, useState, type CSSProperties} from 'react'
import {DragDropContext, Draggable, Droppable, type DropResult} from '@hello-pangea/dnd'
import {Box, Card, Flex, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {useClient, usePerspective} from 'sanity'
import {useListeningQuery} from 'sanity-plugin-utils'
import {HubOrderableArticleRow} from './HubOrderableArticleRow'
import {getFilteredDedupedDocs} from '../lib/hubArticlesListDedupe'
import {
  getHubArticlesListQuery,
  HUB_ARTICLES_API_VERSION,
  ORDER_FIELD_NAME,
} from '../lib/hubArticlesListQuery'
import {reorderHubArticles, type HubArticleListDoc} from '../lib/hubArticlesReorder'
import {ensureHubArticleOrderRank, syncHubArticleOrderRank} from '../lib/hubArticleOrderRank'
import {reconcilePublishedOrderRanksFromDrafts} from '../lib/reconcileHubArticleOrderRanks'

type HubOrderableArticlesListProps = {
  type: string
  filter?: string
  params?: Record<string, unknown>
  currentVersion?: string
}

function getItemStyle(
  draggableStyle: CSSProperties | undefined,
  itemIsUpdating: boolean,
): CSSProperties {
  return {
    userSelect: 'none',
    transition: 'opacity 500ms ease-in-out',
    opacity: itemIsUpdating ? 0.2 : 1,
    pointerEvents: itemIsUpdating ? 'none' : undefined,
    ...draggableStyle,
  }
}

function cardTone(settings: {
  isDuplicate: boolean
  isGhosting: boolean
  isDragging: boolean
  isSelected: boolean
  isMissingOrder: boolean
}) {
  const {isDuplicate, isGhosting, isDragging, isSelected, isMissingOrder} = settings

  if (isGhosting) return 'transparent'
  if (isDragging || isSelected) return 'primary'
  if (isDuplicate || isMissingOrder) return 'caution'

  return undefined
}

export function HubOrderableArticlesList({
  type,
  filter,
  params,
  currentVersion,
}: HubOrderableArticlesListProps) {
  const toast = useToast()
  const {perspectiveStack} = usePerspective()
  const client = useClient({apiVersion: HUB_ARTICLES_API_VERSION}).withConfig({
    perspective: perspectiveStack,
  })

  const [listIsUpdating, setListIsUpdating] = useState(false)
  const [orderedData, setOrderedData] = useState<HubArticleListDoc[]>([])
  const [draggingId, setDraggingId] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const repairedIdsRef = useRef<Set<string>>(new Set())

  const {query, queryParams} = useMemo(
    () => getHubArticlesListQuery({type, filter, params, currentVersion}),
    [type, filter, params, currentVersion],
  )

  const {data: queryData, loading, error} = useListeningQuery<HubArticleListDoc[]>(query, {
    params: queryParams,
    initialValue: [],
  })

  const data = useMemo(() => {
    const raw = Array.isArray(queryData) ? queryData : []
    return getFilteredDedupedDocs(raw, currentVersion)
  }, [queryData, currentVersion])

  useEffect(() => {
    if (!listIsUpdating) {
      setOrderedData(data)
    }
  }, [data, listIsUpdating])

  useEffect(() => {
    const missing = data.filter(
      (doc) => !doc.orderRank && !repairedIdsRef.current.has(doc._id),
    )
    if (!missing.length) return

    let cancelled = false

    ;(async () => {
      for (const doc of missing) {
        if (cancelled) return

        repairedIdsRef.current.add(doc._id)
        try {
          await ensureHubArticleOrderRank(client, doc._id)
        } catch (repairError) {
          console.error('Failed to repair article orderRank', doc._id, repairError)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [client, data])

  const displayedData = listIsUpdating ? orderedData : data

  const duplicateOrders = useMemo(() => {
    if (!displayedData.length) return []

    const orderField = displayedData.map((item) => item[ORDER_FIELD_NAME])
    return orderField.filter((item, index) => orderField.indexOf(item) !== index)
  }, [displayedData])

  const clearReorderState = useCallback(() => {
    setSelectedIds([])
    setDraggingId('')
    setListIsUpdating(false)
  }, [])

  const transactReorder = useCallback(
    async (
      updates: ReturnType<typeof reorderHubArticles>['updates'],
      message: string,
    ) => {
      try {
        for (const {documentId, orderRank} of updates) {
          await syncHubArticleOrderRank(client, documentId, orderRank)
        }

        await reconcilePublishedOrderRanksFromDrafts(client)

        clearReorderState()
        toast.push({
          title: `${
            updates.length === 1 ? '1 document' : `${updates.length} documents`
          } reordered`,
          status: 'success',
          description: message,
        })
      } catch {
        clearReorderState()
        toast.push({
          title: 'Reordering failed',
          status: 'error',
        })
      }
    },
    [clearReorderState, client, toast],
  )

  const handleDragEnd = useCallback(
    (result: DropResult | undefined, entities: HubArticleListDoc[]) => {
      setDraggingId('')

      const {source, destination, draggableId} = result ?? {}
      if (
        source?.index === destination?.index ||
        !entities.length ||
        !draggableId ||
        !source ||
        !destination
      ) {
        return
      }

      const effectedIds = selectedIds.length > 0 ? selectedIds : [draggableId]
      if (!effectedIds.length) return

      setListIsUpdating(true)
      setSelectedIds(effectedIds)

      const {newOrder, updates, message} = reorderHubArticles({
        entities,
        selectedIds: effectedIds,
        source,
        destination,
      })

      if (newOrder.length > 0) {
        setOrderedData(newOrder)
      }

      if (updates.length > 0) {
        transactReorder(updates, message)
      } else {
        clearReorderState()
      }
    },
    [clearReorderState, selectedIds, transactReorder],
  )

  const handleDragStart = useCallback(
    (start: {draggableId: string}) => {
      const id = start.draggableId
      if (!selectedIds.includes(id)) {
        setSelectedIds([])
      }
      setDraggingId(id)
    },
    [selectedIds],
  )

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{width: '100%', height: '100%'}}>
        <Spinner />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box padding={4}>
        <Text tone="critical">Failed to load articles.</Text>
      </Box>
    )
  }

  if (!displayedData.length) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Text muted>No documents of this type</Text>
      </Flex>
    )
  }

  return (
    <Stack gap={1} style={{minWidth: 320, minHeight: 0}}>
      <Box padding={2}>
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={(result) => handleDragEnd(result, displayedData)}
        >
          <Droppable droppableId="hub-articles-sort-zone">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {displayedData.map((item, index) => (
                  <Draggable
                    key={`${item._id}-${item.orderRank || 'unordered'}`}
                    draggableId={item._id}
                    index={index}
                  >
                    {(innerProvided, innerSnapshot) => {
                      const isSelected = selectedIds.includes(item._id)
                      const isDragging = innerSnapshot.isDragging
                      const isGhosting = Boolean(!isDragging && draggingId && isSelected)
                      const isUpdating = listIsUpdating && isSelected
                      const isMissingOrder = !item[ORDER_FIELD_NAME]
                      const isDuplicate = duplicateOrders.includes(item[ORDER_FIELD_NAME] || '')
                      const tone = cardTone({
                        isDuplicate,
                        isGhosting,
                        isDragging,
                        isSelected,
                        isMissingOrder,
                      })

                      return (
                        <div
                          ref={innerProvided.innerRef}
                          {...innerProvided.draggableProps}
                          style={getItemStyle(innerProvided.draggableProps.style, isUpdating)}
                        >
                          <Box paddingBottom={1}>
                            <Card
                              tone={tone}
                              shadow={isDragging ? 2 : undefined}
                              radius={2}
                              onClick={(event) => {
                                const nativeEvent = event.nativeEvent
                                const selectMultiple = nativeEvent.shiftKey
                                const selectAdditional =
                                  navigator.appVersion.indexOf('Win') !== -1
                                    ? nativeEvent.ctrlKey
                                    : nativeEvent.metaKey

                                if (!selectMultiple && !selectAdditional) {
                                  setSelectedIds([item._id])
                                  return
                                }

                                if (selectMultiple) {
                                  nativeEvent.preventDefault()
                                }

                                setSelectedIds((current) => {
                                  const isItemSelected = current.includes(item._id)

                                  if (selectMultiple && !isItemSelected) {
                                    const lastSelectedId = current[current.length - 1] ?? item._id
                                    const lastSelectedIndex = displayedData.findIndex(
                                      (entry) => entry._id === lastSelectedId,
                                    )
                                    const firstSelected =
                                      index < lastSelectedIndex ? index : lastSelectedIndex
                                    const lastSelected =
                                      index > lastSelectedIndex ? index : lastSelectedIndex
                                    const betweenIds = displayedData
                                      .filter(
                                        (_, itemIndex) =>
                                          itemIndex > firstSelected && itemIndex < lastSelected,
                                      )
                                      .map((entry) => entry._id)

                                    return [...current, ...betweenIds, item._id]
                                  }

                                  if (isItemSelected) {
                                    return current.filter((entry) => entry !== item._id)
                                  }

                                  return [...current, item._id]
                                })
                              }}
                            >
                              <HubOrderableArticleRow
                                doc={item}
                                dragHandleProps={innerProvided.dragHandleProps}
                              />
                            </Card>
                          </Box>
                        </div>
                      )
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Stack>
  )
}
