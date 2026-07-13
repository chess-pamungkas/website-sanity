import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {DEFAULT_LOCALE, LOCALES} from './schemaTypes/constants'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {hubArticleDuplicatePlugin} from './plugins/hubArticleDuplicatePlugin'
import {hubCategoryDuplicatePlugin} from './plugins/hubCategoryDuplicatePlugin'
import './styles/hub-dialog.css'

const LANGUAGES = LOCALES.map(({title, value}) => ({id: value, title}))

const I18N_DOCUMENT_TYPES = ['tradingHubPage', 'hubCategory', 'hubAuthor', 'hubArticle'] as const

export default defineConfig({
  name: 'default',
  title: 'oqtima-trading-hub',

  projectId: 'ms3sz7xq',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    hubArticleDuplicatePlugin(),
    hubCategoryDuplicatePlugin(),
    internationalizedArray({
      languages: LANGUAGES,
      // Auto-create only English on new documents; other locales are added via + buttons.
      defaultLanguages: [DEFAULT_LOCALE],
      fieldTypes: ['string', 'text', 'articleBody', 'seoFields'],
      languageDisplay: 'titleAndCode',
      // Per-field + locale buttons, plus "Add missing languages" on each field.
      buttonLocations: ['field'],
      buttonAddAll: true,
      languageFilter: {
        documentTypes: [...I18N_DOCUMENT_TYPES],
        // Without this, the filter pre-selects every locale except English.
        defaultLanguages: [DEFAULT_LOCALE],
      },
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((template) => template.id !== 'tradingHubPage'),
  },
})
