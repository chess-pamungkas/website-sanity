import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {HUB_ARTICLE_IMAGE_SPECS, PUBLISH_TO_SITES, RELATED_CONTENT_MODES} from '../constants'
import {imageUploadGuidance} from '../../components/ImageUploadGuidance'
import {
  ENGLISH_BODY_INITIAL,
  ENGLISH_SEO_INITIAL,
  ENGLISH_STRING_INITIAL,
  ENGLISH_TEXT_INITIAL,
  getLocalizedValue,
  requireEnglishString,
} from '../helpers/localized'
import {slugifyTitle} from '../helpers/slugify'
import {HubArticleIsNewInput} from '../../components/HubArticleIsNewInput'

export default defineType({
  name: 'hubArticle',
  title: 'Article',
  type: 'document',
  groups: [
    {name: 'localized', title: 'Localized', default: true},
    {name: 'common', title: 'Common'},
    {name: 'related', title: 'Related Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    orderRankField({type: 'hubArticle', newItemPosition: 'before'}),
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: ENGLISH_STRING_INITIAL,
      validation: (Rule) =>
        Rule.custom((value) => requireEnglishString(value, 'title')),
    }),
    defineField({
      name: 'subtitle',
      title: 'Article Subtitle',
      type: 'internationalizedArrayText',
      group: 'localized',
      initialValue: ENGLISH_TEXT_INITIAL,
      description: 'Shown in the article detail hero below the title.',
    }),
    defineField({
      name: 'body',
      title: 'Article Content',
      type: 'internationalizedArrayArticleBody',
      group: 'localized',
      initialValue: ENGLISH_BODY_INITIAL,
      description:
        'Section titles: use “Section heading (H2)”. After Enter, change the style dropdown to Normal before typing paragraphs — new lines keep the heading style until you switch it.',
      validation: (Rule) =>
        Rule.custom((value) => {
          const english = getLocalizedValue(value)
          if (!english || !Array.isArray(english) || english.length === 0) {
            return 'English article content is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'common',
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
      name: 'publishToSites',
      title: 'Publish To Sites',
      type: 'array',
      group: 'common',
      of: [{type: 'string'}],
      options: {
        list: PUBLISH_TO_SITES.map(({title, value}) => ({title, value})),
      },
      initialValue: ['com', 'jp', 'lp-com'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'common',
      to: [{type: 'hubCategory'}],
      options: {
        filter: 'isActive == true',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Post Date',
      type: 'datetime',
      group: 'common',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readTimeMinutes',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      group: 'common',
      validation: (Rule) => Rule.required().min(1).max(999),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'common',
      to: [{type: 'hubAuthor'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Card Thumbnail',
      type: 'image',
      group: 'common',
      options: {hotspot: true},
      description: imageUploadGuidance(HUB_ARTICLE_IMAGE_SPECS.thumbnail),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImageDesktop',
      title: 'Detail Hero Image (Desktop)',
      type: 'image',
      group: 'common',
      options: {hotspot: true},
      description: imageUploadGuidance(HUB_ARTICLE_IMAGE_SPECS.heroDesktop),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as {heroImage?: unknown} | undefined
          if (value || doc?.heroImage) {
            return true
          }
          return 'Detail Hero Image (Desktop) is required'
        }),
    }),
    defineField({
      name: 'heroImageMobile',
      title: 'Detail Hero Image (Mobile)',
      type: 'image',
      group: 'common',
      options: {hotspot: true},
      description: imageUploadGuidance(HUB_ARTICLE_IMAGE_SPECS.heroMobile),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isNew',
      title: 'Show "New" Badge',
      type: 'boolean',
      group: 'common',
      initialValue: false,
      description:
        'Shows the localized "New" badge label from Trading Hub Landing Page settings. Changes sync to the published article for the website.',
      components: {
        input: HubArticleIsNewInput,
      },
    }),
    defineField({
      name: 'relatedContentMode',
      title: 'Related Content Mode',
      type: 'string',
      group: 'related',
      options: {
        list: RELATED_CONTENT_MODES.map(({title, value}) => ({title, value})),
        layout: 'radio',
      },
      initialValue: 'manualWithFallback',
      description:
        'Manual: only picked articles. Same Category: latest articles in this category. Hybrid: manual first, then fill gaps from same category.',
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles (manual)',
      type: 'array',
      group: 'related',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'hubArticle'}],
          options: {
            filter: ({document}) => ({
              filter: '_id != $currentId',
              params: {
                currentId: document?._id?.replace('drafts.', ''),
              },
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.max(4),
      hidden: ({document}) => document?.relatedContentMode === 'sameCategory',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'internationalizedArraySeoFields',
      group: 'seo',
      initialValue: ENGLISH_SEO_INITIAL,
    }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: 'Latest Post',
      name: 'latestPost',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title',
      author: 'author.name',
      media: 'thumbnail',
      isNew: 'isNew',
      publishedAt: 'publishedAt',
    },
    prepare({title, categoryTitle, author, media, isNew, publishedAt}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : null
      const displayTitle = getLocalizedValue(title) || 'Untitled article'
      return {
        title: isNew ? `${displayTitle} (New)` : displayTitle,
        subtitle: [getLocalizedValue(categoryTitle), author, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
