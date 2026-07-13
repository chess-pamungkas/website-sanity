import type {StructureResolver} from 'sanity/structure'
import {DocumentsIcon} from '@sanity/icons'
import {HubArticlesPane} from '../components/HubArticlesPane'
import {HubCategoriesPane} from '../components/HubCategoriesPane'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Trading Hub')
    .items([
      S.listItem()
        .title('Landing Page')
        .child(
          S.document()
            .schemaType('tradingHubPage')
            .documentId('tradingHubPage')
            .title('Trading Hub Landing Page'),
        ),
      S.divider(),
      S.listItem()
        .title('Categories')
        .child(
          Object.assign(
            S.documentTypeList('hubCategory')
              .title('Categories')
              .defaultOrdering([{field: 'sortOrder', direction: 'asc'}])
              .serialize(),
            {
              __preserveInstance: true,
              key: 'hub-categories',
              id: 'hub-categories',
              type: 'component',
              component: HubCategoriesPane,
            },
          ),
        ),
      S.documentTypeListItem('hubAuthor').title('Authors'),
      S.listItem()
        .title('Articles')
        .icon(DocumentsIcon)
        .child(
          Object.assign(
            S.documentTypeList('hubArticle')
              .title('Articles')
              .defaultOrdering([{field: 'orderRank', direction: 'asc'}])
              .serialize(),
            {
              __preserveInstance: true,
              key: 'hub-articles',
              id: 'hub-articles',
              type: 'component',
              component: HubArticlesPane,
            },
          ),
        ),
    ])
