const DEFAULT_LOCALE = "en";

/**
 * Resolve a Sanity internationalizedArray* field for the active locale.
 * @param {Array<{_key?: string, value?: unknown}>|null|undefined} field
 * @param {string} locale
 */
export function getLocalizedValue(field, locale = DEFAULT_LOCALE) {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (!Array.isArray(field)) return null;

  const normalized = String(locale || DEFAULT_LOCALE).toLowerCase();
  const matchesLocale = (entry) => {
    const key = String(entry?._key || "").toLowerCase();
    const language = String(entry?.language || "").toLowerCase();
    return key === normalized || language === normalized;
  };
  const matchesEnglish = (entry) => {
    const key = String(entry?._key || "").toLowerCase();
    const language = String(entry?.language || "").toLowerCase();
    return key === DEFAULT_LOCALE || language === DEFAULT_LOCALE;
  };

  const match =
    field.find(matchesLocale) || field.find(matchesEnglish);

  return match?.value ?? null;
}

export function getLocalizedString(field, locale = DEFAULT_LOCALE) {
  const value = getLocalizedValue(field, locale);
  return typeof value === "string" ? value : "";
}

/**
 * Resolve internationalized array entries whose payload may be nested under
 * `value` (Sanity source) or flattened on the entry (Gatsby GraphQL inference).
 */
export function getLocalizedObject(field, locale = DEFAULT_LOCALE) {
  if (!field) return null;
  if (!Array.isArray(field)) {
    return typeof field === "object" ? field : null;
  }

  const normalized = String(locale || DEFAULT_LOCALE).toLowerCase();
  const matchesLocale = (entry) => {
    const key = String(entry?._key || "").toLowerCase();
    const language = String(entry?.language || "").toLowerCase();
    return key === normalized || language === normalized;
  };
  const matchesEnglish = (entry) => {
    const key = String(entry?._key || "").toLowerCase();
    const language = String(entry?.language || "").toLowerCase();
    return key === DEFAULT_LOCALE || language === DEFAULT_LOCALE;
  };

  const match = field.find(matchesLocale) || field.find(matchesEnglish);
  if (!match) return null;

  if (match.value != null && typeof match.value === "object") {
    return match.value;
  }

  const { _key, language, value, ...rest } = match;
  return Object.keys(rest).length ? rest : null;
}
