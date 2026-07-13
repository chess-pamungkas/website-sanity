import {definePlugin} from 'sanity'
import {
  DuplicateHubArticleAsDraftAction,
  DuplicateHubArticlePaneAction,
} from '../actions/duplicateHubArticleAsDraft'

export const hubArticleDuplicatePlugin = definePlugin({
  name: 'hub-article-duplicate',
  document: {
    actions: (prev, {schemaType}) => {
      if (schemaType !== 'hubArticle') return prev

      return [
        ...prev.filter((action) => action.action !== 'duplicate'),
        DuplicateHubArticleAsDraftAction,
        DuplicateHubArticlePaneAction,
      ]
    },
  },
})
