import {useCallback, useEffect, useMemo, useState} from 'react'
import {AddIcon, GenerateIcon, SearchIcon} from '@sanity/icons'
import {HubOrderableArticlesList} from './HubOrderableArticlesList'
import {
  Box,
  Button,
  Card,
  Flex,
  Label,
  Select,
  Stack,
  Text,
  TextInput,
  useToast,
} from '@sanity/ui'
import {useClient, usePerspective} from 'sanity'
import {useRouter} from 'sanity/router'
import {getLocalizedString} from '../lib/getLocalizedValue'
import {resetHubArticleOrder} from '../lib/resetHubArticleOrder'
import {reconcilePublishedOrderRanksFromDrafts} from '../lib/reconcileHubArticleOrderRanks'
import {reconcilePublishedIsNewFromDrafts} from '../lib/syncHubArticleIsNew'

const API_VERSION = 'v2025-06-27'

type HubCategoryOption = {
  _id: string
  title?: Array<{language?: string; value?: string}>
}

const CATEGORIES_QUERY = `*[_type == "hubCategory" && isActive == true] | order(sortOrder asc) {
  _id,
  title
}`

export function HubArticlesPane() {
  const client = useClient({apiVersion: API_VERSION})
  const router = useRouter()
  const toast = useToast()
  const perspective = usePerspective()
  const [categories, setCategories] = useState<HubCategoryOption[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    client
      .fetch<HubCategoryOption[]>(CATEGORIES_QUERY)
      .then((result) => setCategories(result))
      .catch(() => setCategories([]))
  }, [client])

  useEffect(() => {
    let cancelled = false

    Promise.all([
      reconcilePublishedOrderRanksFromDrafts(client),
      reconcilePublishedIsNewFromDrafts(client),
    ])
      .then(([orderCount, isNewCount]) => {
        if (cancelled) return

        if (orderCount > 0) {
          toast.push({
            status: 'success',
            title: `Synced order for ${orderCount} published article${orderCount === 1 ? '' : 's'}`,
            description: 'Frontend order now matches the list in Studio.',
          })
        }

        if (isNewCount > 0) {
          toast.push({
            status: 'success',
            title: `Synced "New" badge for ${isNewCount} published article${isNewCount === 1 ? '' : 's'}`,
            description: 'Frontend badges now match the settings in Studio.',
          })
        }
      })
      .catch(() => {
        // Non-blocking: list still works if reconcile fails.
      })

    return () => {
      cancelled = true
    }
  }, [client, toast])

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: category._id,
        title: getLocalizedString(category.title) || 'Untitled category',
      })),
    [categories],
  )

  const selectedCategoryLabel = useMemo(() => {
    if (!categoryId) return 'All categories'
    return categoryOptions.find((entry) => entry.id === categoryId)?.title || 'Category'
  }, [categoryId, categoryOptions])

  const orderableFilter = useMemo(() => {
    const filters: string[] = []

    if (categoryId) {
      filters.push('references($categoryId)')
    }

    const normalizedQuery = searchQuery.trim()
    if (normalizedQuery) {
      filters.push('title[].value match $searchQuery')
    }

    return filters.length > 0 ? filters.join(' && ') : undefined
  }, [categoryId, searchQuery])

  const orderableParams = useMemo(() => {
    const params: Record<string, string> = {}
    if (categoryId) params.categoryId = categoryId
    if (searchQuery.trim()) params.searchQuery = `*${searchQuery.trim()}*`
    return params
  }, [categoryId, searchQuery])

  const currentVersion = useMemo(() => {
    const stack = perspective?.perspectiveStack
    return Array.isArray(stack) && typeof stack[0] === 'string' ? stack[0] : undefined
  }, [perspective])

  const handleResetOrder = useCallback(async () => {
    setResetting(true)
    try {
      const count = await resetHubArticleOrder(client, {
        categoryId: categoryId || undefined,
      })
      toast.push({
        status: 'success',
        title:
          count > 0
            ? `Reordered ${count} document version${count === 1 ? '' : 's'}`
            : 'No articles to reorder',
        description:
          count > 0
            ? 'Published and draft copies were synced with orderRank.'
            : undefined,
      })
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Failed to reset article order',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setResetting(false)
    }
  }, [categoryId, client, toast])

  return (
    <Stack space={0} style={{height: '100%'}}>
      <Card padding={3} borderBottom>
        <Stack space={3}>
          <Flex align="flex-end" gap={3} wrap="wrap">
            <Stack space={2} style={{minWidth: '220px'}}>
              <Label size={1}>Category</Label>
              <Select
                value={categoryId}
                onChange={(event) => setCategoryId(event.currentTarget.value)}
              >
                <option value="">All categories</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Select>
            </Stack>

            <Stack space={2} style={{flex: 1, minWidth: '240px'}}>
              <Label size={1}>Search</Label>
              <TextInput
                icon={SearchIcon}
                placeholder="Search article(s)"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />
            </Stack>

            <Flex gap={2} paddingBottom={1}>
              <Button
                icon={GenerateIcon}
                text="Reset order"
                mode="bleed"
                loading={resetting}
                onClick={handleResetOrder}
              />
              <Button
                icon={AddIcon}
                text="Create"
                tone="primary"
                onClick={() => router.navigateIntent('create', {type: 'hubArticle'})}
              />
            </Flex>
          </Flex>

          <Text muted size={1}>
            {categoryId
              ? `Drag articles to set the order shown in “${selectedCategoryLabel}”.`
              : 'Select a category to reorder articles within that category, or drag all articles below.'}
          </Text>
        </Stack>
      </Card>

      <Box flex={1} style={{minHeight: 0, overflow: 'auto'}}>
        <HubOrderableArticlesList
          key={`${categoryId}:${searchQuery}`}
          type="hubArticle"
          filter={orderableFilter}
          params={orderableParams}
          currentVersion={currentVersion}
        />
      </Box>
    </Stack>
  )
}
