import {defineField, defineType} from 'sanity'
import {getLocalizedValue, ENGLISH_STRING_INITIAL, ENGLISH_TEXT_INITIAL} from '../helpers/localized'
import {authorPhotoUploadGuidance} from '../../components/ImageUploadGuidance'

export default defineType({
  name: 'hubAuthor',
  title: 'Author',
  type: 'document',
  groups: [
    {name: 'localized', title: 'Localized', default: true},
    {name: 'common', title: 'Common'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'common',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      group: 'common',
      options: {hotspot: true},
      description: authorPhotoUploadGuidance(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'internationalizedArrayString',
      group: 'localized',
      initialValue: ENGLISH_STRING_INITIAL,
      description: 'e.g. Senior Market Analyst',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'internationalizedArrayText',
      group: 'localized',
      initialValue: ENGLISH_TEXT_INITIAL,
    }),
  ],
  preview: {
    select: {title: 'name', role: 'role', media: 'photo'},
    prepare({title, role, media}) {
      return {
        title,
        subtitle: getLocalizedValue(role),
        media,
      }
    },
  },
})
