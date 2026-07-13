import {useCallback, useState} from 'react'

import {CopyIcon, EllipsisVerticalIcon, TrashIcon} from '@sanity/icons'

import {Box, Button, Menu, MenuButton, MenuItem, useToast} from '@sanity/ui'

import {useClient} from 'sanity'

import {useRouter} from 'sanity/router'

import {countHubCategoryArticles} from '../lib/countHubCategoryArticles'

import {deleteHubDocument} from '../lib/deleteHubDocument'

import {duplicateHubCategoryAsDraft} from '../lib/duplicateHubCategory'

import {

  HubDeleteDocumentDialog,

  type HubDeleteDialogState,

} from './HubDeleteDocumentDialog'



const API_VERSION = 'v2025-06-27'



type HubCategoryRowMenuProps = {

  documentId: string

  documentTitle: string

}



export function HubCategoryRowMenu({documentId, documentTitle}: HubCategoryRowMenuProps) {

  const client = useClient({apiVersion: API_VERSION})

  const router = useRouter()

  const toast = useToast()

  const [isDuplicating, setIsDuplicating] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  const [isCheckingDelete, setIsCheckingDelete] = useState(false)

  const [deleteDialogState, setDeleteDialogState] = useState<HubDeleteDialogState>({

    type: 'closed',

  })



  const displayTitle = documentTitle || 'this category'



  const handleDuplicate = useCallback(async () => {

    setIsDuplicating(true)

    try {

      const newDraftId = await duplicateHubCategoryAsDraft(client, documentId)

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

    }

  }, [client, documentId, router, toast])



  const handleDeleteClick = useCallback(async () => {

    setIsCheckingDelete(true)

    try {

      const articleCount = await countHubCategoryArticles(client, documentId)



      if (articleCount > 0) {

        setDeleteDialogState({

          type: 'blocked',

          documentTitle: displayTitle,

          articleCount,

        })

        return

      }



      setDeleteDialogState({

        type: 'confirm',

        documentTitle: displayTitle,

      })

    } catch (error) {

      toast.push({

        status: 'error',

        title: 'Failed to check category',

        description: error instanceof Error ? error.message : undefined,

      })

    } finally {

      setIsCheckingDelete(false)

    }

  }, [client, displayTitle, documentId, toast])



  const handleConfirmDelete = useCallback(async () => {

    setIsDeleting(true)

    try {

      await deleteHubDocument(client, documentId)

      toast.push({

        status: 'success',

        title: 'Category deleted',

        description: `"${displayTitle}" was permanently removed.`,

      })

      setDeleteDialogState({type: 'closed'})

    } catch (error) {

      toast.push({

        status: 'error',

        title: 'Failed to delete category',

        description: error instanceof Error ? error.message : undefined,

      })

    } finally {

      setIsDeleting(false)

    }

  }, [client, displayTitle, documentId, toast])



  const closeDeleteDialog = useCallback(() => {

    if (!isDeleting) {

      setDeleteDialogState({type: 'closed'})

    }

  }, [isDeleting])



  const menuBusy = isDuplicating || isCheckingDelete || isDeleting



  return (

    <Box

      paddingRight={1}

      style={{flexShrink: 0}}

      onMouseDown={(event) => {

        event.preventDefault()

        event.stopPropagation()

      }}

      onClick={(event) => event.stopPropagation()}

    >

      <MenuButton

        button={

          <Button

            type="button"

            icon={EllipsisVerticalIcon}

            mode="bleed"

            aria-label="Category actions"

            disabled={menuBusy}

            onMouseDown={(event) => {

              event.preventDefault()

              event.stopPropagation()

            }}

          />

        }

        id={`hub-category-menu-${documentId}`}

        menu={

          <Menu>

            <MenuItem

              icon={CopyIcon}

              text={isDuplicating ? 'Duplicating…' : 'Duplicate'}

              disabled={menuBusy}

              onClick={handleDuplicate}

            />

            <MenuItem

              icon={TrashIcon}

              text={isCheckingDelete ? 'Checking…' : isDeleting ? 'Deleting…' : 'Delete'}

              tone="critical"

              disabled={menuBusy}

              onClick={handleDeleteClick}

            />

          </Menu>

        }

        popover={{portal: true, placement: 'bottom-end'}}

      />



      <HubDeleteDocumentDialog

        state={deleteDialogState}

        resourceLabel="category"

        isDeleting={isDeleting}

        onClose={closeDeleteDialog}

        onConfirm={handleConfirmDelete}

      />

    </Box>

  )

}

