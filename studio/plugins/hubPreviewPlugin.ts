import {definePlugin} from 'sanity'
import {
  PreviewComAction,
  PreviewJpAction,
  PreviewLpComAction,
  TRADING_HUB_PREVIEW_TYPES,
} from '../actions/openTradingHubPreview'

export const hubPreviewPlugin = definePlugin({
  name: 'hub-preview-links',
  document: {
    actions: (prev, {schemaType}) => {
      if (
        !TRADING_HUB_PREVIEW_TYPES.includes(
          schemaType as (typeof TRADING_HUB_PREVIEW_TYPES)[number],
        )
      ) {
        return prev
      }

      return [...prev, PreviewComAction, PreviewJpAction, PreviewLpComAction]
    },
  },
})
