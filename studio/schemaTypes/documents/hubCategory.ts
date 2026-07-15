import {defineField, defineType} from 'sanity'
import {getLocalizedValue, requireEnglishString, ENGLISH_STRING_INITIAL} from '../helpers/localized'
import {slugifyTitle} from '../helpers/slugify'
import {StudioPreviewLinksField} from '../../components/StudioPreviewLinksField'

/**
 * Real categories managed by Marketing (e.g. Trading Academy, Beginner's Guide).
 * "All" is NOT a category — it is a virtual tab on the frontend.
 */
export default defineType({
  name: 'hubCategory',
  title: 'Category',
  type: 'document',
  groups: [
    {name: 'localized', title: 'Localized', default: true},
    {name: 'common', title: 'Common'},
  ],
  fields: [
    defineField({
      name: 'previewLinks',
      title: 'Preview',
      type: 'string',
      group: 'localized',
      readOnly: true,
      components: {field: StudioPreviewLinksField},
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: ENGLISH_STRING_INITIAL,
      description: 'Tab label and page heading per locale.',
      validation: (Rule) =>
        Rule.custom((value) => requireEnglishString(value, 'title')),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'common',
      description:
        'Stable category ID for URLs and filtering. One slug for all locales (e.g. trading-academy).',
      options: {
        source: (document) =>
          getLocalizedValue(
            document?.title as Parameters<typeof getLocalizedValue>[0],
          ),
        maxLength: 96,
        slugify: (input, schemaType) =>
          slugifyTitle(String(input ?? ''), schemaType.options?.maxLength ?? 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      group: 'common',
      description: 'Managed automatically when you drag categories in the Categories list.',
      readOnly: true,
      hidden: true,
      initialValue: async (_, context) => {
        const client = context.getClient({apiVersion: 'v2025-06-27'})
        const max = await client.fetch<number | null>(
          `*[_type == "hubCategory"] | order(sortOrder desc)[0].sortOrder`,
        )
        return typeof max === 'number' ? max + 1 : 0
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'common',
      description: 'Inactive categories are hidden from the website tab bar.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', isActive: 'isActive'},
    prepare({title, isActive}) {
      return {
        title: getLocalizedValue(title) || 'Untitled category',
        subtitle: isActive === false ? 'Inactive' : undefined,
      }
    },
  },
})
