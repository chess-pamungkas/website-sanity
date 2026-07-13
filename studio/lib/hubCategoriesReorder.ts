export type HubCategoryListDoc = {
  _id: string
  _type: string
  sortOrder?: number
  isActive?: boolean
  title?: Array<{_key?: string; language?: string; value?: string}>
}

export function reorderHubCategories({
  entities,
  selectedIds,
  source,
  destination,
}: {
  entities: HubCategoryListDoc[]
  selectedIds: string[]
  source: {index: number}
  destination: {index: number}
}) {
  const from = source.index
  const to = destination.index

  if (from === to) {
    return {newOrder: entities, updates: [], message: ''}
  }

  const movingIds = new Set(selectedIds.length > 0 ? selectedIds : [entities[from]._id])
  const moving = entities.filter((doc) => movingIds.has(doc._id))
  const stationary = entities.filter((doc) => !movingIds.has(doc._id))

  let insertAt = to
  if (to > from) {
    insertAt = to - moving.length + 1
  }

  const newOrder = [
    ...stationary.slice(0, insertAt),
    ...moving,
    ...stationary.slice(insertAt),
  ]

  const updates = newOrder
    .map((doc, index) => ({
      documentId: doc._id,
      sortOrder: index,
    }))
    .filter(({documentId, sortOrder}) => {
      const original = entities.find((entry) => entry._id === documentId)
      return original?.sortOrder !== sortOrder
    })

  const message = [
    'Moved',
    moving.length === 1 ? '1 category' : `${moving.length} categories`,
    from > to ? 'up' : 'down',
    'from position',
    `${from + 1} to ${to + 1}`,
  ].join(' ')

  return {newOrder, updates, message}
}
