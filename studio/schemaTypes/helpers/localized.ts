import type {LocalizedArrayItem} from '../types'
import {DEFAULT_LOCALE} from '../constants'

export function getLocalizedValue<T = string>(
  items: LocalizedArrayItem<T>[] | undefined,
  locale = DEFAULT_LOCALE,
): T | undefined {
  if (!items?.length) {
    return undefined
  }

  const match = items.find((item) => item.language === locale || item._key === locale)
  return match?.value
}

export function requireEnglishString(
  items: LocalizedArrayItem<string>[] | undefined,
  label: string,
): true | string {
  const value = getLocalizedValue(items, DEFAULT_LOCALE)?.trim()
  if (!value) {
    return `English ${label} is required`
  }
  return true
}

/** Pre-enable English on new documents (more reliable than plugin defaultLanguages alone). */
export function englishLocaleInitial<T>(value: T) {
  return [{_key: DEFAULT_LOCALE, language: DEFAULT_LOCALE, value}]
}

export const ENGLISH_STRING_INITIAL = englishLocaleInitial('')
export const ENGLISH_TEXT_INITIAL = englishLocaleInitial('')
export const ENGLISH_BODY_INITIAL = englishLocaleInitial([])
export const ENGLISH_SEO_INITIAL = englishLocaleInitial({})
