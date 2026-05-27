import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  startTransition,
} from "react";
import PropTypes from "prop-types";
import CookieContext from "../cookie-context";
import {
  LAST_LANGUAGE_KEY,
  PERFORMANCE_COOKIE_KEY,
} from "../../helpers/gdpr-cookie.config";
import {
  changeI18nLanguage,
  defaultLang,
  detectInitialLanguage,
  findLangById,
  getLangFromUrl,
  getPersistedLanguageId,
} from "../../helpers/services/language-service";
import ClientResolverContext from "../client-resolver-context";
import {
  isClientDetectionEnabled,
  shouldDeferHeavyWorkForLighthouse,
  shouldDeferMarketingHomeGeoWork,
  MARKETING_HOME_GEO_DEFER_MS,
} from "../../helpers/is-audit-environment";
import { scheduleAfterCapOnly } from "../../helpers/schedule-after-lcp";
import { isBrowser } from "../../helpers/services/is-browser";
import { isMarketingHomePath } from "../../helpers/is-marketing-home-path";

const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
  const { setCookie } = useContext(CookieContext);
  const { clientConfig } = useContext(ClientResolverContext);
  const geoHomeAppliedRef = useRef(false);

  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    isBrowser() ? detectInitialLanguage(undefined) : defaultLang
  );

  // Geo suggestion for `/` only when the user has not chosen a language yet.
  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return undefined;
    if (!clientConfig?.recommendedLanguage || geoHomeAppliedRef.current) {
      return undefined;
    }

    const applyGeoHomeLanguage = () => {
      if (geoHomeAppliedRef.current) return;
      if (!isBrowser()) return;

      if (getLangFromUrl()) return;
      if (!isMarketingHomePath(window.location.pathname)) return;
      if (getPersistedLanguageId()) return;

      geoHomeAppliedRef.current = true;
      const geoLang = findLangById(clientConfig.recommendedLanguage);
      startTransition(() => setSelectedLanguage(geoLang));
    };

    if (shouldDeferMarketingHomeGeoWork()) {
      return scheduleAfterCapOnly(
        applyGeoHomeLanguage,
        MARKETING_HOME_GEO_DEFER_MS
      );
    }

    applyGeoHomeLanguage();
    return undefined;
  }, [clientConfig]);

  useEffect(() => {
    // Geo API + navigate are deferred on marketing home in ClientResolverProvider (after LCP).
    if (!isClientDetectionEnabled() && shouldDeferHeavyWorkForLighthouse()) {
      return undefined;
    }

    const applyLanguageSideEffects = () => {
      changeI18nLanguage(selectedLanguage);
      const rtlLanguages = ["ar"];
      const isRTL = rtlLanguages.includes(selectedLanguage.id);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      if (isRTL) {
        document.documentElement.classList.add("rtl");
      } else {
        document.documentElement.classList.remove("rtl");
      }
    };

    if (shouldDeferMarketingHomeGeoWork()) {
      return scheduleAfterCapOnly(
        applyLanguageSideEffects,
        MARKETING_HOME_GEO_DEFER_MS
      );
    }

    applyLanguageSideEffects();
    return undefined;
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
