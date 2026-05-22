const LANG_CONFIG = [
  // English
  {
    id: "en",
    icon: "EnFlagIcon",
    name: "English (US)",
    isDefault: true,
    URIPart: "",
  },
  // French
  {
    id: "fr",
    icon: "FrFlagIcon",
    name: "Française",
    URIPart: "/fr",
  },
  // Brazilian
  {
    id: "br",
    icon: "BrFlagIcon",
    name: "Português",
    URIPart: "/br",
  },
  // Vietnamese
  {
    id: "vn",
    icon: "VnFlagIcon",
    name: "Tiếng Việt",
    URIPart: "/vn",
  },
  // Thai
  {
    id: "th",
    icon: "ThFlagIcon",
    name: "ภาษาไทย",
    URIPart: "/th",
  },
  // Spanish
  {
    id: "es",
    icon: "EsFlagIcon",
    name: "Español",
    URIPart: "/es",
  },
  // Italian
  {
    id: "it",
    icon: "ItFlagIcon",
    name: "Italiano",
    URIPart: "/it",
  },
  // Chinese
  {
    id: "cn",
    icon: "CnFlagIcon",
    name: "简体中文",
    URIPart: "/cn",
  },
  // Taiwan
  {
    id: "zh",
    icon: "CnFlagIcon",
    name: "繁體中文",
    URIPart: "/zh",
  },
  // Indonesian
  {
    id: "id",
    icon: "IdFlagIcon",
    name: "Bahasa Indonesia",
    URIPart: "/id",
  },
  // Japanese
  {
    id: "jp",
    icon: "JpFlagIcon",
    name: "日本語",
    URIPart: "/jp",
  },
  // Malay (Malaysia)
  {
    id: "my",
    icon: "MyFlagIcon",
    name: "Bahasa Malaysia",
    URIPart: "/my",
  },
  // Arabic
  {
    id: "ar",
    icon: "ArFlagIcon",
    name: "عربي",
    URIPart: "/ar",
  },
];

const CYSEC_LANG_CONFIG = [
  // English
  {
    id: "en",
    icon: "EnFlagIcon",
    name: "English (US)",
    isDefault: true,
    URIPart: "",
  },
  // French
  {
    id: "fr",
    icon: "FrFlagIcon",
    name: "Française",
    URIPart: "/fr",
  },
  // Spanish
  {
    id: "es",
    icon: "EsFlagIcon",
    name: "Español",
    URIPart: "/es",
  },
  // Italian
  {
    id: "it",
    icon: "ItFlagIcon",
    name: "Italiano",
    URIPart: "/it",
  },
  // Chinese
  {
    id: "cn",
    icon: "CnFlagIcon",
    name: "简体中文",
    URIPart: "/cn",
  },
];

const ARABIC_LANG_ID = "ar";
const allUniqueLanguages = [...CYSEC_LANG_CONFIG, ...LANG_CONFIG].filter(
  (obj, index, self) => {
    return index === self.findIndex((lang) => lang.id === obj.id);
  }
);

const CURRENT_ENTITY = process.env.GATSBY_ENTITY;

const ENTITY_LANGUAGES =
  CURRENT_ENTITY == "FSA" ? LANG_CONFIG : CYSEC_LANG_CONFIG;

/** Map our locale id to valid BCP 47 for HTML [lang]. Fixes Lighthouse "valid value for [lang] attribute". */
const LOCALE_TO_BCP47 = {
  en: "en",
  fr: "fr",
  br: "pt-BR",
  vn: "vi",
  th: "th",
  es: "es",
  it: "it",
  cn: "zh-Hans",
  zh: "zh-Hant",
  id: "id",
  jp: "ja",
  my: "ms",
  ar: "ar",
};

function getBcp47Lang(localeId) {
  if (!localeId || typeof localeId !== "string") return "en";
  const normalized = localeId.trim().toLowerCase();
  return LOCALE_TO_BCP47[normalized] ?? normalized;
}

/** Resolve locale id from URL path (SSR / first paint). Used by gatsby-ssr setHtmlAttributes so <html lang> exists before react-helmet hydrates. */
function getLanguageIdFromPathname(pathname) {
  const fallbackId = ENTITY_LANGUAGES.find(({ isDefault }) => isDefault).id;
  if (!pathname || typeof pathname !== "string") return fallbackId;
  const trimmed = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const lower = trimmed.toLowerCase();
  for (let i = 0; i < ENTITY_LANGUAGES.length; i++) {
    const lang = ENTITY_LANGUAGES[i];
    const part = (lang.URIPart || "").toLowerCase();
    if (!part) continue;
    if (lower === part || lower.startsWith(`${part}/`)) return lang.id;
  }
  return fallbackId;
}

module.exports = {
  LANG_CONFIG,
  CYSEC_LANG_CONFIG,
  ENTITY_LANGUAGES,
  ARABIC_LANG_ID,
  uniqueList: allUniqueLanguages.map(({ id }) => id),
  list: ENTITY_LANGUAGES.map(({ id }) => id),
  defaultLangKey: ENTITY_LANGUAGES.find(({ isDefault }) => isDefault).id,
  getBcp47Lang,
  getLanguageIdFromPathname,
};
