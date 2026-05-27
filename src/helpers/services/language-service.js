import { navigate } from "gatsby";
import {
  DEFAULT_COOKIE_AGE,
  GLOBAL_COOKIE_PATH,
  LAST_LANGUAGE_KEY,
} from "../gdpr-cookie.config";
import {
  LANG_SELECT_OPTIONS,
  PORTAL_LANGUAGES_MAP,
} from "../lang-options.config";
import { isBrowser } from "./is-browser";
import Cookies from "universal-cookie";
import { useContext } from "react";
import LanguageContext from "../../context/language-context";

const cookies = new Cookies();

export const defaultLang = LANG_SELECT_OPTIONS.find(
  ({ isDefault }) => isDefault
);

export const getLangFromUrl = () => {
  if (!isBrowser()) return undefined;
  const { pathname } = window.location;
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : undefined;
};

export const getPersistedLanguageId = () => cookies.get(LAST_LANGUAGE_KEY);

/** Write language choice before navigate so geo detection cannot override the picker. */
export const persistLanguageChoice = (languageId) => {
  if (!isBrowser() || !languageId) return;
  cookies.set(LAST_LANGUAGE_KEY, languageId, {
    path: GLOBAL_COOKIE_PATH,
    maxAge: DEFAULT_COOKIE_AGE,
  });
};

export const findLangById = (languageId) => {
  return (
    LANG_SELECT_OPTIONS.find((item) => item.id === languageId) || defaultLang
  );
};

const pathHasLocalePrefix = (pathname) =>
  /^\/[a-z]{2}(\/|$)/.test(pathname || "");

/** Canonical English routes (/all-markets, /forex, …) have no /en/ prefix. */
const isDefaultLanguageCanonicalPath = (pathname) => {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return false;
  return !pathHasLocalePrefix(pathname);
};

export const changeI18nLanguage = (selectedLang) => {
  // used to update the actual path with the selected language (e.g. from /forex to /fr/forex)
  if (!isBrowser()) return;
  const { pathname, search } = window.location;
  if (pathname.includes("popup-registration")) return;

  const urlLang = getLangFromUrl();
  if (urlLang === selectedLang.id) return;

  // Unprefixed canonical English URLs (/all-markets): never redirect from cookie locale.
  if (selectedLang.isDefault && isDefaultLanguageCanonicalPath(pathname)) {
    return;
  }

  if (selectedLang.isDefault) {
    const stripped = pathname.replace(/^\/[a-z]{2}\//, "/");
    navigate(`${stripped}${search}`);
    return;
  }

  if (!pathname.startsWith(`/${selectedLang.id}/`)) {
    const navigatePath =
      `${selectedLang.URIPart}` + pathname.replace(/^\/[a-z]{2}\//, "/");
    navigate(`${navigatePath}${search}`);
  }
};

export const detectInitialLanguage = (recommendedLanguage) => {
  const fromUrl = getLangFromUrl();
  if (fromUrl) return findLangById(fromUrl);

  const pathname = isBrowser() ? window.location.pathname : "";
  const normalized = (pathname.replace(/\/+$/, "") || "/");

  // English product routes (/vps, /forex, …) without a locale prefix.
  if (normalized !== "/" && isDefaultLanguageCanonicalPath(pathname)) {
    return defaultLang;
  }

  const persistedId = getPersistedLanguageId();

  // Homepage `/`: explicit picker/cookie choice before geo (Indonesia → id only when unset).
  if (normalized === "/") {
    if (persistedId) return findLangById(persistedId);
    if (recommendedLanguage) return findLangById(recommendedLanguage);
    return defaultLang;
  }

  if (persistedId) return findLangById(persistedId);

  if (recommendedLanguage) return findLangById(recommendedLanguage);

  return defaultLang;
};

export const setLangParam = (selectedLanguage) => {
  if (!selectedLanguage || !selectedLanguage.id) {
    return "";
  }
  const languageCode = PORTAL_LANGUAGES_MAP[selectedLanguage.id];

  // Old version: Used 'lang' as the query parameter name
  // return `?lang=${selectedLanguage.id}`;

  // New version: Uses 'language' as the query parameter name
  return `?language=${languageCode}`;
};

// Hook version for components that have access to LanguageContext
export const useLangParam = () => {
  const { selectedLanguage } = useContext(LanguageContext);
  return setLangParam(selectedLanguage);
};
