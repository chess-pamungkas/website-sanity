import { navigate } from "gatsby";
import { LAST_LANGUAGE_KEY } from "../gdpr-cookie.config";
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

const findLangById = (languageId) => {
  return (
    LANG_SELECT_OPTIONS.find((item) => item.id === languageId) || defaultLang
  );
};

const getLangFromUrl = () => {
  // used to find the /{ln}/ part and extract the language
  if (isBrowser()) {
    const { pathname } = window.location;
    const matches = pathname.match(/\/[a-z]{2}\//);
    if (matches) {
      const langCode = matches[0].slice(1, 3);
      return langCode;
    }
  }
};

const langFromCookie = cookies.get(LAST_LANGUAGE_KEY);

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

  if (isBrowser() && isDefaultLanguageCanonicalPath(window.location.pathname)) {
    return defaultLang;
  }

  return findLangById(langFromCookie || recommendedLanguage);
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
