const {
  getBcp47Lang,
  uniqueList,
  defaultLangKey,
  ARABIC_LANG_ID,
} = require("./lang.config");

/** Locale segment from URL (matches entity + extra locales in uniqueList). */
function getLocaleIdFromPathname(pathname) {
  if (!pathname || pathname === "/") return defaultLangKey;
  const m = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  if (!m) return defaultLangKey;
  const seg = m[1];
  return uniqueList.includes(seg) ? seg : defaultLangKey;
}

function getHtmlLangAndDirFromPathname(pathname) {
  const localeId = getLocaleIdFromPathname(pathname);
  return {
    lang: getBcp47Lang(localeId),
    dir: localeId === ARABIC_LANG_ID ? "rtl" : "ltr",
  };
}

module.exports = {
  getLocaleIdFromPathname,
  getHtmlLangAndDirFromPathname,
};
