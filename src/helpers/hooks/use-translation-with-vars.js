import { useEffect, useMemo, useState } from "react";
import { useTranslation as useI18nextTranslation } from "gatsby-plugin-react-i18next";
import { getLocalizationVariables } from "../localization-variables";

export const useTranslationWithVariables = (options = {}) => {
  const { deferUntilBelowHeroReady = false, fallbackDelayMs = 6500 } = options;
  const { t } = useI18nextTranslation();
  const [isI18nHeavyReady, setIsI18nHeavyReady] = useState(
    !deferUntilBelowHeroReady
  );

  useEffect(() => {
    if (!deferUntilBelowHeroReady || typeof window === "undefined") return;

    let cancelled = false;
    const onReady = () => {
      if (cancelled) return;
      setIsI18nHeavyReady(true);
    };

    window.addEventListener("belowHeroContentReady", onReady, { once: true });
    const fallback = window.setTimeout(onReady, fallbackDelayMs);
    return () => {
      cancelled = true;
      window.removeEventListener("belowHeroContentReady", onReady);
      window.clearTimeout(fallback);
    };
  }, [deferUntilBelowHeroReady, fallbackDelayMs]);

  // This object build can become expensive when repeated frequently.
  // Keep it out of the critical homepage window when requested.
  const globalVariables = useMemo(() => {
    if (!isI18nHeavyReady) return {};
    return getLocalizationVariables();
  }, [isI18nHeavyReady]);

  const translateWithVariables = useMemo(
    () => (key, variables) => {
      if (!isI18nHeavyReady) {
        // During deferred phase, use direct translation without interpolation payload.
        return t(key);
      }
      const mergedVariables = { ...globalVariables, ...variables };
      return t(key, mergedVariables);
    },
    [globalVariables, isI18nHeavyReady, t]
  );

  return {
    t: translateWithVariables,
  };
};
