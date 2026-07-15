import {defineField, defineType} from 'sanity'
import {
  ENGLISH_SEO_INITIAL,
  ENGLISH_STRING_INITIAL,
  ENGLISH_TEXT_INITIAL,
  englishLocaleInitial,
  getLocalizedValue,
  requireEnglishString,
} from '../helpers/localized'
import {HUB_LANDING_PAGE_IMAGE_SPECS} from '../constants'
import {imageUploadGuidance} from '../../components/ImageUploadGuidance'
import {StudioPreviewLinksField} from '../../components/StudioPreviewLinksField'

/**
 * Singleton landing page config for /trading-hub (or /trading-academy route).
 * Category-specific titles come from hubCategory documents, not separate pages.
 */
export default defineType({
  name: 'tradingHubPage',
  title: 'Trading Hub Landing Page',
  type: 'document',
  groups: [
    {name: 'localized', title: 'Localized', default: true},
    {name: 'common', title: 'Common'},
    {name: 'seo', title: 'SEO'},
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
      name: 'heroBadge',
      title: 'Hero Badge',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('Trading Hub'),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: ENGLISH_STRING_INITIAL,
      validation: (Rule) =>
        Rule.custom((value) => requireEnglishString(value, 'hero title')),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'internationalizedArrayText',
      group: 'localized',
      initialValue: ENGLISH_TEXT_INITIAL,
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero CTA Label',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('Start Free Today'),
    }),
    defineField({
      name: 'heroCtaUrl',
      title: 'Hero CTA URL',
      type: 'url',
      group: 'common',
      validation: (Rule) =>
        Rule.uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'heroImageDesktop',
      title: 'Hero Image (Desktop)',
      type: 'image',
      group: 'common',
      options: {hotspot: true},
      description: imageUploadGuidance(HUB_LANDING_PAGE_IMAGE_SPECS.heroDesktop),
    }),
    defineField({
      name: 'heroImageMobile',
      title: 'Hero Image (Mobile)',
      type: 'image',
      group: 'common',
      options: {hotspot: true},
      description: imageUploadGuidance(HUB_LANDING_PAGE_IMAGE_SPECS.heroMobile),
    }),
    defineField({
      name: 'sectionEyebrow',
      title: 'Section Eyebrow',
      type: 'internationalizedArrayString',
      group: 'localized',
      description: 'Small text above the dynamic section title.',
      initialValue: englishLocaleInitial('Choose What You Want to Master'),
    }),
    defineField({
      name: 'allTabLabel',
      title: '"All" Tab Label',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('All'),
      description: 'Label for the virtual "All" category tab.',
    }),
    defineField({
      name: 'hubTitle',
      title: 'Title when "All" is selected',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('Trading Hub'),
      description: 'Center page title when the All tab is active.',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search Placeholder',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('What do you want to learn today?'),
    }),
    defineField({
      name: 'loadMoreLabel',
      title: 'Load More Label',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('Load more'),
    }),
    defineField({
      name: 'newBadgeLabel',
      title: '"New" Badge Label',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: englishLocaleInitial('New'),
      description:
        'Label shown on article cards when "Show New Badge" is enabled on an article.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'internationalizedArraySeoFields',
      group: 'seo',
      initialValue: ENGLISH_SEO_INITIAL,
    }),
  ],
  preview: {
    select: {title: 'hubTitle'},
    prepare({title}) {
      return {
        title: getLocalizedValue(title) || 'Trading Hub Landing Page',
        subtitle: 'All locales on one page',
      }
    },
  },
})
