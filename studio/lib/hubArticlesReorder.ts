import {LexoRank} from 'lexorank'

export type HubArticleListDoc = {
  _id: string
  _type: string
  orderRank?: string
  hasPublished?: boolean
  title?: Array<{_key?: string; language?: string; value?: string}>
}

function parseOrderRank(value: string | undefined, fallback: LexoRank) {
  if (typeof value !== 'string') return fallback

  try {
    return LexoRank.parse(value)
  } catch {
    return fallback
  }
}

export function reorderHubArticles({
  entities,
  selectedIds,
  source,
  destination,
}: {
  entities: HubArticleListDoc[]
  selectedIds: string[]
  source: {index: number}
  destination: {index: number}
}) {
  const startIndex = source.index
  const endIndex = destination.index
  const isMovingUp = startIndex > endIndex
  const selectedItems = entities.filter((item) => selectedIds.includes(item._id))
  const message = [
    'Moved',
    selectedItems.length === 1 ? '1 document' : `${selectedItems.length} documents`,
    isMovingUp ? 'up' : 'down',
    'from position',
    `${startIndex + 1} to ${endIndex + 1}`,
  ].join(' ')

  const {all, selected} = entities.reduce<{
    all: HubArticleListDoc[]
    selected: HubArticleListDoc[]
  }>(
    (acc, cur, curIndex) => {
      if (selectedIds.includes(cur._id)) {
        return acc
      }

      if (curIndex === endIndex) {
        const prevIndex = curIndex - 1
        const prevRank = parseOrderRank(
          entities[prevIndex]?.orderRank,
          LexoRank.min(),
        )
        const curRank = parseOrderRank(cur.orderRank, LexoRank.min())
        const nextIndex = curIndex + 1
        const nextRank = parseOrderRank(
          entities[nextIndex]?.orderRank,
          LexoRank.max(),
        )

        let betweenRank = isMovingUp
          ? prevRank.between(curRank)
          : curRank.between(nextRank)

        for (const selectedItem of selectedItems) {
          selectedItem.orderRank = betweenRank.toString()
          betweenRank = isMovingUp
            ? betweenRank.between(curRank)
            : betweenRank.between(nextRank)
        }

        return {
          all: isMovingUp
            ? [...acc.all, ...selectedItems, cur]
            : [...acc.all, cur, ...selectedItems],
          selected: selectedItems,
        }
      }

      return {
        all: [...acc.all, cur],
        selected: acc.selected,
      }
    },
    {all: [], selected: []},
  )

  const updates = selected.map((doc) => ({
    documentId: doc._id,
    orderRank: doc.orderRank as string,
  }))

  return {
    newOrder: all.sort((a, b) => {
      if (!a.orderRank || !b.orderRank) return 0
      if (a.orderRank < b.orderRank) return -1
      if (a.orderRank > b.orderRank) return 1
      return 0
    }),
    updates,
    message,
  }
}
