const DEFAULT_LOCALE = 'en'

export function getLocalizedValue(
  field: Array<{_key?: string; language?: string; value?: unknown}> | null | undefined,
  locale = DEFAULT_LOCALE,
) {
  if (!field || !Array.isArray(field)) return null

  const normalized = locale.toLowerCase()
  const match =
    field.find(
      (entry) =>
        entry?._key?.toLowerCase() === normalized ||
        entry?.language?.toLowerCase() === normalized,
    ) ||
    field.find(
      (entry) =>
        entry?._key?.toLowerCase() === DEFAULT_LOCALE ||
        entry?.language?.toLowerCase() === DEFAULT_LOCALE,
    )

  return match?.value ?? null
}

export function getLocalizedString(
  field: Array<{_key?: string; language?: string; value?: unknown}> | null | undefined,
  locale = DEFAULT_LOCALE,
) {
  const value = getLocalizedValue(field, locale)
  return typeof value === 'string' ? value : ''
}
