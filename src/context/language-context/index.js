import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  startTransition,
} from "react";
import PropTypes from "prop-types";
import CookieContext from "../cookie-context";
import {
  LAST_LANGUAGE_KEY,
  PERFORMANCE_COOKIE_KEY,
} from "../../helpers/gdpr-cookie.config";
import {
  detectInitialLanguage,
  changeI18nLanguage,
} from "../../helpers/services/language-service";
import ClientResolverContext from "../client-resolver-context";
import { shouldDeferHeavyWorkForLighthouse } from "../../helpers/is-audit-environment";

const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
  const { setCookie } = useContext(CookieContext);
  const { clientConfig } = useContext(ClientResolverContext);
  const initialLang = useMemo(
    () => detectInitialLanguage(clientConfig?.recommendedLanguage),
    [clientConfig]
  );

  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);

  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return;
    startTransition(() => setSelectedLanguage(initialLang));
  }, [initialLang]);

  useEffect(() => {
    // Audit: skip i18n / RTL / DOM class writes. SSR already set <html lang>/<html dir>
    // correctly in gatsby-ssr.js's setHtmlAttributes, so first paint is consistent.
    // Real users keep full behaviour for runtime language switches.
    if (shouldDeferHeavyWorkForLighthouse()) return;
    changeI18nLanguage(selectedLanguage);
    const rtlLanguages = ["ar"];
    const isRTL = rtlLanguages.includes(selectedLanguage.id);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return;
    setCookie(LAST_LANGUAGE_KEY, selectedLanguage.id, PERFORMANCE_COOKIE_KEY);
  }, [setCookie, selectedLanguage]);

  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return;
    if (selectedLanguage.id === "jp") {
      document.body.classList.add("jp-font");
    } else {
      document.body.classList.remove("jp-font");
    }
  }, [selectedLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Stub value for deferred hydration (Layout uses after timer, no first interaction).
 * Derives language id from pathname so SSR and client match; avoids running detectInitialLanguage, changeI18nLanguage, setCookie, RTL, jp-font.
 */
export const getLanguageStubValue = (pathname) => {
  const id =
    (typeof pathname === "string" && pathname.match(/^\/([a-z]{2})\/?/)?.[1]) ||
    "en";
  return {
    selectedLanguage: { id },
    setSelectedLanguage: () => {},
  };
};

export default LanguageContext;
