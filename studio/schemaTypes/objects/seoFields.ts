import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      description: 'Optional. If empty, the Gatsby site uses locale JSON fallback.',
      validation: (Rule) => Rule.max(70).warning('Keep under 70 characters for best SEO'),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Optional. If empty, the Gatsby site uses locale JSON fallback.',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best SEO'),
    }),
  ],
})
