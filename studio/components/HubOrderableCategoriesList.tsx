import {useCallback, useEffect, useMemo, useState, type CSSProperties} from 'react'
import {DragDropContext, Draggable, Droppable, type DropResult} from '@hello-pangea/dnd'
import {Box, Card, Flex, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {useClient, usePerspective} from 'sanity'
import {useListeningQuery} from 'sanity-plugin-utils'
import {HubOrderableCategoryRow} from './HubOrderableCategoryRow'
import {getFilteredDedupedDocs} from '../lib/hubArticlesListDedupe'
import {
  getHubCategoriesListQuery,
  HUB_CATEGORIES_API_VERSION,
  SORT_FIELD_NAME,
} from '../lib/hubCategoriesListQuery'
import {reorderHubCategories, type HubCategoryListDoc} from '../lib/hubCategoriesReorder'
import {
  reconcilePublishedCategorySortOrdersFromDrafts,
  syncHubCategorySortOrder,
} from '../lib/hubCategoryOrder'

type HubOrderableCategoriesListProps = {
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
}) {
  const {isDuplicate, isGhosting, isDragging, isSelected} = settings

  if (isGhosting) return 'transparent'
  if (isDragging || isSelected) return 'primary'
  if (isDuplicate) return 'caution'

  return undefined
}

export function HubOrderableCategoriesList({currentVersion}: HubOrderableCategoriesListProps) {
  const toast = useToast()
  const {perspectiveStack} = usePerspective()
  const client = useClient({apiVersion: HUB_CATEGORIES_API_VERSION}).withConfig({
    perspective: perspectiveStack,
  })

  const [listIsUpdating, setListIsUpdating] = useState(false)
  const [orderedData, setOrderedData] = useState<HubCategoryListDoc[]>([])
  const [draggingId, setDraggingId] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const {query, queryParams} = useMemo(
    () => getHubCategoriesListQuery({currentVersion}),
    [currentVersion],
  )

  const {data: queryData, loading, error} = useListeningQuery<HubCategoryListDoc[]>(query, {
    params: queryParams,
    initialValue: [],
  })

  const data = useMemo(() => {
    const raw = Array.isArray(queryData) ? queryData : []
    return getFilteredDedupedDocs(
      raw as Parameters<typeof getFilteredDedupedDocs>[0],
      currentVersion,
    ) as HubCategoryListDoc[]
  }, [queryData, currentVersion])

  useEffect(() => {
    if (!listIsUpdating) {
      setOrderedData(data)
    }
  }, [data, listIsUpdating])

  const displayedData = listIsUpdating ? orderedData : data

  const duplicateOrders = useMemo(() => {
    if (!displayedData.length) return []

    const orderField = displayedData.map((item) => item[SORT_FIELD_NAME])
    return orderField.filter((item, index) => orderField.indexOf(item) !== index)
  }, [displayedData])

  const clearReorderState = useCallback(() => {
    setSelectedIds([])
    setDraggingId('')
    setListIsUpdating(false)
  }, [])

  const transactReorder = useCallback(
    async (
      updates: ReturnType<typeof reorderHubCategories>['updates'],
      message: string,
    ) => {
      try {
        for (const {documentId, sortOrder} of updates) {
          await syncHubCategorySortOrder(client, documentId, sortOrder)
        }

        await reconcilePublishedCategorySortOrdersFromDrafts(client)

        clearReorderState()
        toast.push({
          title: `${
            updates.length === 1 ? '1 category' : `${updates.length} categories`
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
    (result: DropResult | undefined, entities: HubCategoryListDoc[]) => {
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

      const {newOrder, updates, message} = reorderHubCategories({
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
        <Text tone="critical">Failed to load categories.</Text>
      </Box>
    )
  }

  if (!displayedData.length) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Text muted>No categories yet</Text>
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
          <Droppable droppableId="hub-categories-sort-zone">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {displayedData.map((item, index) => (
                  <Draggable
                    key={`${item._id}-${item.sortOrder ?? 'unordered'}`}
                    draggableId={item._id}
                    index={index}
                  >
                    {(innerProvided, innerSnapshot) => {
                      const isSelected = selectedIds.includes(item._id)
                      const isDragging = innerSnapshot.isDragging
                      const isGhosting = Boolean(!isDragging && draggingId && isSelected)
                      const isUpdating = listIsUpdating && isSelected
                      const isDuplicate = duplicateOrders.includes(item[SORT_FIELD_NAME] ?? -1)
                      const tone = cardTone({
                        isDuplicate,
                        isGhosting,
                        isDragging,
                        isSelected,
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
                              <HubOrderableCategoryRow
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
