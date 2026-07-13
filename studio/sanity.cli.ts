import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ms3sz7xq',
    dataset: 'production'
  },
  /**
   * Auto-updates disabled — local dev uses package.json versions only.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: {
    appId: 'gpzsfmo1imf1qxsvg4dd7hbo',
    autoUpdates: false,
  },
})
