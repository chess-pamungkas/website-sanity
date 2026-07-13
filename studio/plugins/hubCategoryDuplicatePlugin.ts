import {definePlugin} from 'sanity'
import {
  DuplicateHubCategoryAsDraftAction,
  DuplicateHubCategoryPaneAction,
} from '../actions/duplicateHubCategoryAsDraft'

export const hubCategoryDuplicatePlugin = definePlugin({
  name: 'hub-category-duplicate',
  document: {
    actions: (prev, {schemaType}) => {
      if (schemaType !== 'hubCategory') return prev

      return [
        ...prev.filter((action) => action.action !== 'duplicate'),
        DuplicateHubCategoryAsDraftAction,
        DuplicateHubCategoryPaneAction,
      ]
    },
  },
})
