import {useCallback, useEffect, useMemo, useState} from 'react'
import {AddIcon, GenerateIcon} from '@sanity/icons'
import {HubOrderableCategoriesList} from './HubOrderableCategoriesList'
import {Box, Button, Card, Flex, Stack, Text, useToast} from '@sanity/ui'
import {useClient, usePerspective} from 'sanity'
import {useRouter} from 'sanity/router'
import {
  reconcilePublishedCategorySortOrdersFromDrafts,
  resetHubCategorySortOrder,
} from '../lib/hubCategoryOrder'

const API_VERSION = 'v2025-06-27'

export function HubCategoriesPane() {
  const client = useClient({apiVersion: API_VERSION})
  const router = useRouter()
  const toast = useToast()
  const perspective = usePerspective()
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    let cancelled = false

    reconcilePublishedCategorySortOrdersFromDrafts(client)
      .then((count) => {
        if (!cancelled && count > 0) {
          toast.push({
            status: 'success',
            title: `Synced order for ${count} published categor${count === 1 ? 'y' : 'ies'}`,
            description: 'Frontend tab order now matches the list in Studio.',
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

  const currentVersion = useMemo(() => {
    const stack = perspective?.perspectiveStack
    return Array.isArray(stack) && typeof stack[0] === 'string' ? stack[0] : undefined
  }, [perspective])

  const handleResetOrder = useCallback(async () => {
    setResetting(true)
    try {
      const count = await resetHubCategorySortOrder(client)
      toast.push({
        status: 'success',
        title:
          count > 0
            ? `Reordered ${count} document version${count === 1 ? '' : 's'}`
            : 'No categories to reorder',
        description:
          count > 0
            ? 'Published and draft copies were synced with sortOrder.'
            : undefined,
      })
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Failed to reset category order',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setResetting(false)
    }
  }, [client, toast])

  return (
    <Stack space={0} style={{height: '100%'}}>
      <Card padding={3} borderBottom>
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={2} wrap="wrap">
            <Text muted size={1}>
              Drag categories to set the order shown in the website tab bar.
            </Text>

            <Flex gap={2}>
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
                onClick={() => router.navigateIntent('create', {type: 'hubCategory'})}
              />
            </Flex>
          </Flex>
        </Stack>
      </Card>

      <Box flex={1} style={{minHeight: 0, overflow: 'auto'}}>
        <HubOrderableCategoriesList currentVersion={currentVersion} />
      </Box>
    </Stack>
  )
}
