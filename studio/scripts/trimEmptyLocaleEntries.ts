import {getCliClient} from 'sanity/cli'

const DEFAULT_LOCALE = 'en'

const LOCALIZED_FIELDS: Record<string, string[]> = {
  tradingHubPage: [
    'heroBadge',
    'heroTitle',
    'heroSubtitle',
    'heroCtaLabel',
    'sectionEyebrow',
    'allTabLabel',
    'hubTitle',
    'searchPlaceholder',
    'loadMoreLabel',
    'newBadgeLabel',
    'seo',
  ],
  hubCategory: ['title'],
  hubAuthor: ['role', 'bio'],
  hubArticle: ['title', 'subtitle', 'body', 'seo'],
}

type LocaleEntry = {
  _key?: string
  language?: string
  value?: unknown
}

function hasContent(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(hasContent)
  }

  return true
}

function trimLocaleEntries(entries: LocaleEntry[] | undefined): LocaleEntry[] | undefined {
  if (!entries?.length) {
    return entries
  }

  return entries.filter((entry) => {
    const language = entry.language ?? entry._key
    if (language === DEFAULT_LOCALE) {
      return true
    }
    return hasContent(entry.value)
  })
}

async function trimEmptyLocaleEntries() {
  const client = getCliClient({apiVersion: '2025-02-19'})

  for (const [schemaType, fields] of Object.entries(LOCALIZED_FIELDS)) {
    const documents: Array<Record<string, unknown> & {_id: string; _type: string}> =
      await client.fetch(`*[_type == $schemaType]{_id, _type, ${fields.join(', ')}}`, {
        schemaType,
      })

    for (const document of documents) {
      const patch: Record<string, LocaleEntry[] | undefined> = {}
      let changed = false

      for (const field of fields) {
        const current = document[field] as LocaleEntry[] | undefined
        const trimmed = trimLocaleEntries(current)

        if (JSON.stringify(current) !== JSON.stringify(trimmed)) {
          patch[field] = trimmed
          changed = true
        }
      }

      if (!changed) {
        continue
      }

      await client.patch(document._id).set(patch).commit()
      console.log(`Trimmed empty locales on ${document._id}`)
    }
  }

  console.log('Done.')
}

trimEmptyLocaleEntries().catch((error) => {
  console.error(error)
  process.exit(1)
})
