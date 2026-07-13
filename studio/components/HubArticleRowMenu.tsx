import {useCallback, useState} from 'react'

import {CopyIcon, EllipsisVerticalIcon, TrashIcon} from '@sanity/icons'

import {Box, Button, Menu, MenuButton, MenuItem, useToast} from '@sanity/ui'

import {useClient} from 'sanity'

import {useRouter} from 'sanity/router'

import {deleteHubDocument} from '../lib/deleteHubDocument'

import {duplicateHubArticleAsDraft} from '../lib/duplicateHubArticle'

import {

  HubDeleteDocumentDialog,

  type HubDeleteDialogState,

} from './HubDeleteDocumentDialog'



const API_VERSION = 'v2025-06-27'



type HubArticleRowMenuProps = {

  documentId: string

  documentTitle: string

}



export function HubArticleRowMenu({documentId, documentTitle}: HubArticleRowMenuProps) {

  const client = useClient({apiVersion: API_VERSION})

  const router = useRouter()

  const toast = useToast()

  const [isDuplicating, setIsDuplicating] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteDialogState, setDeleteDialogState] = useState<HubDeleteDialogState>({

    type: 'closed',

  })



  const displayTitle = documentTitle || 'this article'



  const handleDuplicate = useCallback(async () => {

    setIsDuplicating(true)

    try {

      const newDraftId = await duplicateHubArticleAsDraft(client, documentId)

      toast.push({

        status: 'success',

        title: 'Article duplicated',

        description: 'A draft copy was created.',

      })

      router.navigateIntent('edit', {id: newDraftId, type: 'hubArticle'})

    } catch (error) {

      toast.push({

        status: 'error',

        title: 'Failed to duplicate article',

        description: error instanceof Error ? error.message : undefined,

      })

    } finally {

      setIsDuplicating(false)

    }

  }, [client, documentId, router, toast])



  const handleDeleteClick = useCallback(() => {

    setDeleteDialogState({

      type: 'confirm',

      documentTitle: displayTitle,

    })

  }, [displayTitle])



  const handleConfirmDelete = useCallback(async () => {

    setIsDeleting(true)

    try {

      await deleteHubDocument(client, documentId)

      toast.push({

        status: 'success',

        title: 'Article deleted',

        description: `"${displayTitle}" was permanently removed.`,

      })

      setDeleteDialogState({type: 'closed'})

    } catch (error) {

      toast.push({

        status: 'error',

        title: 'Failed to delete article',

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



  const menuBusy = isDuplicating || isDeleting



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

            aria-label="Article actions"

            disabled={menuBusy}

            onMouseDown={(event) => {

              event.preventDefault()

              event.stopPropagation()

            }}

          />

        }

        id={`hub-article-menu-${documentId}`}

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

              text={isDeleting ? 'Deleting…' : 'Delete'}

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

        resourceLabel="article"

        isDeleting={isDeleting}

        onClose={closeDeleteDialog}

        onConfirm={handleConfirmDelete}

      />

    </Box>

  )

}

