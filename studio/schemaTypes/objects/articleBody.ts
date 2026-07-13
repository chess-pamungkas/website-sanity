import {defineArrayMember, defineType} from 'sanity'

/**
 * Portable Text body for hub articles.
 * H2 and H3 blocks are used to auto-generate the Table of Contents on the frontend.
 *
 * After a section heading, press Enter then switch the style dropdown to Normal
 * before typing body copy — new lines inherit the previous block style by default.
 */
export default defineType({
  name: 'articleBody',
  title: 'Article Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {
          title: 'Section heading (H2) — e.g. Key Takeaways',
          value: 'h2',
        },
        {
          title: 'Subsection heading (H3)',
          value: 'h3',
        },
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
  ],
})
