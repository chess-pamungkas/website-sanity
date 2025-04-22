import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import cn from "classnames";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { currentEntity } from "../../../helpers/entity-resolver";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import bulletImage from "../../../assets/images/icons/bullet.png";
import closemage from "../../../assets/images/icons/close-icon.svg";
import PopupRegistrationForm from "./components/popup-registration-form";

const RTL_LANGUAGES = ["ar"];

// Helper function to detect if loaded from landing page/popup script
const isLoadedFromExternalScript = () => {
  try {
    // Check if we're in an iframe
    const isInIframe = window !== window.top;
    // Check if the script is loaded (check both old and new naming conventions)
    const hasPopupScript = !!document.querySelector(
      'script[src*="registration-popup-script"]'
    );
    // Check if we have URL parameters that typically come from the popup script
    const urlParams = new URLSearchParams(window.location.search);
    const hasPopupParams =
      urlParams.has("langParam") || urlParams.has("referral_type");

    return isInIframe || hasPopupScript || hasPopupParams;
  } catch (e) {
    // If we can't access window.top due to cross-origin, we're in an iframe
    return true;
  }
};

// Initialize tab-specific language on page load
if (typeof window !== "undefined") {
  try {
    // On page load, check if we have a saved language for this tab
    const tabLanguage = sessionStorage.getItem("oqtima_tab_language");
    const tabRtl = sessionStorage.getItem("oqtima_tab_rtl") === "true";

    if (tabLanguage) {
      // This overrides any localStorage setting to ensure consistent language in this tab
      console.log(
        `Tab-specific language found: ${tabLanguage}, RTL: ${tabRtl}`
      );

      // Set HTML attributes on initial page load
      document.documentElement.setAttribute("lang", tabLanguage);
      document.documentElement.setAttribute("dir", tabRtl ? "rtl" : "ltr");

      // Update classes
      if (tabRtl) {
        document.documentElement.classList.add("rtl-active");
        document.body.classList.add("rtl-active");
      } else {
        document.documentElement.classList.remove(
          "rtl-active",
          "rtl",
          "is-rtl"
        );
        document.body.classList.remove("rtl-active", "rtl", "is-rtl");
      }

      // Set global vars
      window.__OQTIMA_COMPONENT_LANGUAGE = tabLanguage;
      window.__OQTIMA_LOCKED_LANG = tabLanguage;
      window.__FORCE_RTL__ = tabRtl;
      window.__ORIGINAL_RTL__ = tabRtl;

      // Override i18next language if needed
      if (localStorage.getItem("i18nextLng") !== tabLanguage) {
        localStorage.setItem("i18nextLng", tabLanguage);
      }
    }
  } catch (e) {
    console.warn("Could not initialize tab-specific language:", e);
  }
}

const benefitsConfig = [
  { label: "popup-registration-benefits-pips", entities: ["CYSEC", "FSA"] },
  { label: "popup-registration-benefits-commissions", entities: ["FSA"] },
  { label: "popup-registration-benefits-currenciesFSA", entities: ["FSA"] },
  {
    label: "popup-registration-benefits-verification",
    entities: ["CYSEC", "FSA"],
  },
  { label: "popup-registration-benefits-depositMethodsFSA", entities: ["FSA"] },
  {
    label: "popup-registration-benefits-transfers",
    entities: ["CYSEC", "FSA"],
  },
  {
    label: "popup-registration-benefits-diversificationFSA",
    entities: ["FSA"],
  },
  {
    label: "popup-registration-benefits-diversificationCYSEC",
    entities: ["CYSEC"],
  },
  {
    label: "popup-registration-benefits-connection",
    entities: ["CYSEC", "FSA"],
  },
  {
    label: "popup-registration-benefits-liquidity",
    entities: ["CYSEC", "FSA"],
  },
  { label: "popup-registration-benefits-ecn", entities: ["CYSEC", "FSA"] },
  { label: "popup-registration-benefits-productsCYSEC", entities: ["CYSEC"] },
  { label: "popup-registration-benefits-devices", entities: ["CYSEC", "FSA"] },
  { label: "popup-registration-benefits-toolsFSA", entities: ["FSA"] },
  { label: "popup-registration-benefits-toolsCYSEC", entities: ["CYSEC"] },
  { label: "popup-registration-benefits-currenciesCYSEC", entities: ["CYSEC"] },
  { label: "popup-registration-benefits-serviceFSA", entities: ["FSA"] },
  { label: "popup-registration-benefits-serviceCYSEC", entities: ["CYSEC"] },
];

// Add loading spinner styles
const LoadingSpinner = () => (
  <div className="popup-registration__loading">
    <div className="popup-registration__spinner"></div>
  </div>
);

const PopupRegistration = ({ isOpen, onClose, className, params }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const { isMobile } = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isExternalLoad] = useState(isLoadedFromExternalScript());

  // Parse params safely and store in state to survive rerenders
  const [parsedParams, setParsedParams] = useState(() => {
    try {
      if (typeof params === "string") {
        return JSON.parse(params);
      }
      return params || {};
    } catch (e) {
      console.error("Error parsing params:", e);
      return {};
    }
  });

  // Clear any existing RTL settings on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Generate unique session ID for this tab to avoid cross-tab contamination
    if (!window.__OQTIMA_SESSION_ID__) {
      window.__OQTIMA_SESSION_ID__ =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      console.log("New session initialized:", window.__OQTIMA_SESSION_ID__);
    }

    // Create a clean slate for language settings
    const cleanLanguageState = () => {
      // Remove RTL styles
      const rtlStyles = document.getElementById(
        "popup-registration-rtl-styles"
      );
      if (rtlStyles) rtlStyles.remove();

      // Reset document attributes
      const htmlLang = document.documentElement.getAttribute("lang") || "";
      const htmlDir = document.documentElement.getAttribute("dir") || "";

      console.log("Initial state - html lang:", htmlLang, "dir:", htmlDir);

      // Only reset if we're not supposed to be in RTL mode
      if (!params?.dataLang || params.dataLang !== "ar") {
        // Remove RTL classes
        document.documentElement.classList.remove(
          "rtl-active",
          "rtl",
          "is-rtl"
        );
        document.body.classList.remove("rtl-active", "rtl", "is-rtl");

        // Force LTR for non-Arabic language
        if (htmlDir === "rtl" && (!htmlLang || htmlLang !== "ar")) {
          document.documentElement.setAttribute("dir", "ltr");
          document.body.setAttribute("dir", "ltr");
          console.log("Force reset RTL to LTR on initial load");
        }
      }

      // Use sessionStorage instead of localStorage to avoid cross-tab contamination
      try {
        // Store language state in session storage (per tab)
        const desiredLang =
          params?.langParam || params?.language || params?.dataLang || "en";
        sessionStorage.setItem("oqtima_tab_language", desiredLang);
        console.log("Tab language set to:", desiredLang);

        // Override any localStorage settings with the sessionStorage value
        if (window.gatsby_i18next_language) {
          window.gatsby_i18next_language = desiredLang;
        }
      } catch (e) {
        console.warn("Error setting session storage:", e);
      }
    };

    // Run cleanup immediately
    cleanLanguageState();

    // Listen for storage events from other tabs (defensive measure)
    const handleStorageEvent = (event) => {
      if (
        event.key === "i18nextLng" ||
        event.key === "gatsby-i18next-language"
      ) {
        // Don't let other tabs affect our language
        try {
          const tabLang = sessionStorage.getItem("oqtima_tab_language");
          if (tabLang) {
            localStorage.setItem("i18nextLng", tabLang);
            console.log(
              "Prevented cross-tab language contamination, restored:",
              tabLang
            );
          }
        } catch (e) {
          console.warn("Error in storage event handler:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [params]);

  // Log initial params for debugging
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Current window location:", window.location.pathname);
      console.log("Current window search:", window.location.search);

      // Debug existing language settings
      console.log("Current language settings:");
      console.log(
        "- document.documentElement.lang:",
        document.documentElement.lang
      );
      console.log(
        "- document.documentElement.dir:",
        document.documentElement.dir
      );

      if (window.localStorage) {
        console.log(
          "- localStorage i18nextLng:",
          localStorage.getItem("i18nextLng")
        );
      }

      if (window.gatsby_i18next_language) {
        console.log(
          "- gatsby_i18next_language:",
          window.gatsby_i18next_language
        );
      }

      console.log("Parameters passed to component:", params);
      console.log("Parsed parameters:", parsedParams);
    }
  }, []);

  // Update parsed params when the input params change
  useEffect(() => {
    try {
      console.log("params", params);
      if (typeof params === "string") {
        const newParams = JSON.parse(params);
        setParsedParams((prevParams) => ({
          ...prevParams,
          ...newParams,
          // Preserve referral parameters if they exist in current state but not in new params
          referral_type: newParams.referral_type || prevParams.referral_type,
          referral_value: newParams.referral_value || prevParams.referral_value,
        }));
      } else if (params) {
        setParsedParams((prevParams) => ({
          ...prevParams,
          ...params,
          // Preserve referral parameters if they exist in current state but not in new params
          referral_type: params.referral_type || prevParams.referral_type,
          referral_value: params.referral_value || prevParams.referral_value,
        }));
      }
    } catch (e) {
      console.error("Error updating params:", e);
    }
  }, [params]);

  // Lock the language and RTL state immediately
  const forcedLanguage = parsedParams?.langParam;

  // FIXED: Reset any global language variables that might be causing issues
  useEffect(() => {
    if (typeof window !== "undefined" && forcedLanguage) {
      // Clear any overriding language settings
      if (window.__OQTIMA_COMPONENT_LANGUAGE !== forcedLanguage) {
        window.__OQTIMA_COMPONENT_LANGUAGE = forcedLanguage;
      }

      if (window.__OQTIMA_LOCKED_LANG !== forcedLanguage) {
        window.__OQTIMA_LOCKED_LANG = forcedLanguage;
      }

      // Try to clear Gatsby i18next language if not matching
      if (
        window.gatsby_i18next_language &&
        window.gatsby_i18next_language !== forcedLanguage
      ) {
        try {
          window.gatsby_i18next_language = forcedLanguage;
        } catch (e) {
          console.warn("Could not update gatsby_i18next_language");
        }
      }

      // Override i18next language storage if needed
      try {
        if (localStorage.getItem("i18nextLng") !== forcedLanguage) {
          localStorage.setItem("i18nextLng", forcedLanguage);
        }
      } catch (e) {
        console.warn("Could not update localStorage i18nextLng");
      }

      console.log("Language forced to:", forcedLanguage);
    }
  }, [forcedLanguage]);

  // Enhanced RTL detection - only use Arabic language to trigger RTL
  // FIXED: Make the RTL detection more specific and explicit
  let forcedRTL = false;

  // Check if auto RTL detection is specifically disabled
  if (typeof window !== "undefined" && window.__OQTIMA_DISABLE_AUTO_RTL__) {
    console.log(
      "RTL detection explicitly disabled by __OQTIMA_DISABLE_AUTO_RTL__"
    );
    forcedRTL = false;
  }
  // Only set forcedRTL if language is explicitly set to an RTL language
  else if (
    forcedLanguage &&
    RTL_LANGUAGES.includes(forcedLanguage.toLowerCase())
  ) {
    forcedRTL = true;
    console.log(`RTL mode enabled from forcedLanguage: ${forcedLanguage}`);
  }
  // Check data-lang attribute but ONLY if forcedLanguage is not set
  else if (
    !forcedLanguage &&
    parsedParams?.dataLang &&
    RTL_LANGUAGES.includes(parsedParams.dataLang.toLowerCase())
  ) {
    // CRITICAL FIX: Only enable RTL for data-lang="ar" if we don't have an explicit non-RTL language
    if (
      !(
        parsedParams.language &&
        !RTL_LANGUAGES.includes(parsedParams.language.toLowerCase())
      )
    ) {
      forcedRTL = true;
      console.log(`RTL mode enabled from data-lang: ${parsedParams.dataLang}`);
    } else {
      console.log(
        `RTL mode disabled because explicit language overrides data-lang`
      );
    }
  }
  // URL path check only if no other language indicators exist
  else if (
    !forcedLanguage &&
    !parsedParams?.dataLang &&
    typeof window !== "undefined"
  ) {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.includes("ar")) {
      forcedRTL = true;
      console.log("RTL mode enabled from URL path: /ar/");
    } else {
      // IMPORTANT: Explicitly disable RTL for non-Arabic paths
      forcedRTL = false;
      console.log("RTL mode explicitly disabled for non-Arabic path");
    }
  }

  // Override RTL detection if we have a direct conflict between HTML lang and RTL settings
  if (typeof window !== "undefined") {
    const htmlLang = document.documentElement.getAttribute("lang");
    if (
      htmlLang &&
      !RTL_LANGUAGES.includes(htmlLang.toLowerCase()) &&
      forcedRTL
    ) {
      console.log(
        `Overriding RTL detection because HTML lang="${htmlLang}" is not an RTL language`
      );
      forcedRTL = false;
    }
  }

  const isRTLMode = forcedRTL || isRTL;

  // Add effect to update RTL mode when forcedLanguage changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // First, clear any previous RTL settings
    document.documentElement.classList.remove("rtl-active");
    document.body.classList.remove("rtl-active");
    const existingRtlStyle = document.getElementById(
      "popup-registration-rtl-styles"
    );
    if (existingRtlStyle) existingRtlStyle.remove();

    console.log("Updating RTL mode:", isRTLMode ? "RTL" : "LTR");

    // Update global flags when language changes
    window.__ORIGINAL_LANGUAGE__ = forcedLanguage || params?.langParam || "en";
    window.__FORCE_RTL__ = isRTLMode;
    window.__ORIGINAL_RTL__ = isRTLMode;

    // Update document classes and attributes immediately
    document.documentElement.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
    document.body.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
    document.documentElement.setAttribute(
      "lang",
      forcedLanguage || params?.langParam || (isRTLMode ? "ar" : "en")
    );

    if (isRTLMode) {
      document.documentElement.classList.add("rtl-active");
      document.body.classList.add("rtl-active");
    } else {
      // Remove all possible RTL classes
      document.documentElement.classList.remove("rtl-active", "rtl", "is-rtl");
      document.body.classList.remove("rtl-active", "rtl", "is-rtl");
      // Remove data attributes related to RTL
      document.documentElement.removeAttribute("data-rtl");
      document.body.removeAttribute("data-rtl");
    }

    // Force UI update by triggering a reflow
    const reflow = document.body.offsetHeight;

    console.log(
      `Language state updated - Language: ${
        forcedLanguage || "default"
      }, RTL mode: ${isRTLMode}`
    );
  }, [forcedLanguage, isRTLMode, params]);

  // Add loading state management
  const [isStylesLoaded, setIsStylesLoaded] = React.useState(false);
  const styleLoadedRef = React.useRef(false);
  const initialRenderRef = React.useRef(true);

  // Preload styles effect - runs immediately
  useEffect(() => {
    if (typeof window === "undefined" || !isExternalLoad) return;

    // Add initial loading styles to prevent flash
    const preloadStyle = document.createElement("style");
    preloadStyle.id = "popup-registration-preload-styles";
    preloadStyle.innerHTML = `
      /* Initial state styles */
      .popup-registration {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.3s ease-in-out;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2147483647;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .popup-registration.styles-loaded {
        visibility: visible;
        opacity: 1;
      }

      .popup-registration__wrapper {
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }

      /* Mobile styles */
      @media screen and (max-width: 767px) {
        .popup-registration {
          background: #fff;
        }

        .popup-registration__wrapper {
          padding: 0;
        }

        .popup-registration__container {
          margin: 0;
          border-radius: 0;
          min-height: 100vh;
          flex-direction: column !important;
          overflow-y: auto !important;
        }

        .popup-registration__sidebar {
          flex-shrink: 0;
          z-index: 2;
        }

        .popup-registration__content {
          flex: 1;
          position: relative;
          z-index: 1;
        }
      }

      /* Loading spinner styles */
      .popup-registration__loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2147483648;
      }

      .popup-registration__spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #ff4400;
        border-radius: 50%;
        animation: popup-registration-spin 1s linear infinite;
      }

      @keyframes popup-registration-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Prevent content shift during load */
      .popup-registration__container {
        opacity: 0;
        transform: scale(0.98);
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
      }

      .styles-loaded .popup-registration__container {
        opacity: 1;
        transform: scale(1);
      }

      /* Hide content until fully loaded */
      .popup-registration__content,
      .popup-registration__sidebar {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }

      .styles-loaded .popup-registration__content,
      .styles-loaded .popup-registration__sidebar {
        opacity: 1;
      }
    `;
    document.head.appendChild(preloadStyle);

    return () => {
      const preloadStyleEl = document.getElementById(
        "popup-registration-preload-styles"
      );
      if (preloadStyleEl) preloadStyleEl.remove();
    };
  }, [isExternalLoad]);

  // Content ready effect
  useEffect(() => {
    if (!isOpen || !isExternalLoad) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
      requestAnimationFrame(() => {
        setIsStylesLoaded(true);
        setTimeout(() => {
          setIsContentReady(true);
        }, 300);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen, isExternalLoad]);

  // Separate effect for initial setup
  useEffect(() => {
    if (typeof window === "undefined" || !isExternalLoad) return;

    // Set initial flags
    window.__DISABLE_LANGUAGE_REDIRECT__ = true;
    window.__FORCE_LANGUAGE__ = true;
    window.__PREVENT_LANGUAGE_PATH_REDIRECT__ = true;
    window.__USING_URL_LANG_PARAM__ = true;
    window.__FORCE_RTL__ = isRTLMode;
    window.__ORIGINAL_LANGUAGE__ = forcedLanguage || params?.langParam || "en";
    window.__ORIGINAL_RTL__ = isRTLMode;

    // Block language detection immediately
    if (window.i18next?.services?.languageDetector) {
      window.i18next.services.languageDetector.detect = () =>
        window.__ORIGINAL_LANGUAGE__;
    }

    return () => {
      window.__DISABLE_LANGUAGE_REDIRECT__ = false;
      window.__FORCE_LANGUAGE__ = false;
      window.__PREVENT_LANGUAGE_PATH_REDIRECT__ = false;
      window.__USING_URL_LANG_PARAM__ = false;
      window.__FORCE_RTL__ = false;
    };
  }, [isExternalLoad]);

  // RTL setup effect
  useEffect(() => {
    if (typeof window === "undefined" || !isExternalLoad) return;

    // Update RTL global flags
    window.__FORCE_RTL__ = isRTLMode;
    window.__ORIGINAL_RTL__ = isRTLMode;

    const setupRTL = async () => {
      // Clean up previous RTL settings first
      document.documentElement.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
      document.body.setAttribute("dir", isRTLMode ? "rtl" : "ltr");

      if (isRTLMode) {
        // Add RTL classes
        document.documentElement.classList.add("rtl-active");
        document.body.classList.add("rtl-active");

        // Add RTL styles
        if (!document.getElementById("popup-registration-rtl-styles")) {
          const rtlStyle = document.createElement("style");
          rtlStyle.id = "popup-registration-rtl-styles";
          rtlStyle.innerHTML = `
            /* Force RTL direction */
            html[dir="rtl"], body[dir="rtl"] {
              direction: rtl !important;
            }
            
            /* RTL container layout */
            .popup-registration--rtl,
            [dir="rtl"] .popup-registration {
              direction: rtl !important;
              text-align: right !important;
            }

            /* Base RTL Container - multiple selectors for specificity */
            .popup-registration--rtl .popup-registration__container,
            [dir="rtl"] .popup-registration__container,
            .popup-registration__container[dir="rtl"],
            [dir="rtl"] .popup-registration .popup-registration__container {
              flex-direction: row-reverse !important;
            }

            /* Direct style to ensure RTL layout */
            .popup-registration__container[dir="rtl"] {
              display: flex !important;
              flex-direction: row-reverse !important;
            }

            /* RTL form elements */
            .popup-registration--rtl input,
            .popup-registration--rtl select,
            .popup-registration--rtl textarea,
            [dir="rtl"] .popup-registration input,
            [dir="rtl"] .popup-registration select,
            [dir="rtl"] .popup-registration textarea {
              direction: rtl !important;
              text-align: right !important;
              padding-right: 15px !important;
            }

            /* RTL form labels */
            .popup-registration--rtl .popup-registration__label,
            [dir="rtl"] .popup-registration .popup-registration__label {
              text-align: right !important;
              margin-right: 0 !important;
              margin-left: auto !important;
            }

            /* RTL dropdowns */
            .popup-registration--rtl .custom-dropdown__selected,
            [dir="rtl"] .popup-registration .custom-dropdown__selected {
              text-align: right !important;
              padding-right: 15px !important;
            }

            .popup-registration--rtl .custom-dropdown__arrow,
            [dir="rtl"] .popup-registration .custom-dropdown__arrow {
              right: auto !important;
              left: 15px !important;
            }

            /* RTL checkboxes */
            .popup-registration--rtl .popup-registration__newsletter input[type="checkbox"],
            .popup-registration--rtl .popup-registration__consent input[type="checkbox"],
            [dir="rtl"] .popup-registration .popup-registration__newsletter input[type="checkbox"],
            [dir="rtl"] .popup-registration .popup-registration__consent input[type="checkbox"] {
              margin-right: 0 !important;
              margin-left: 10px !important;
            }

            /* RTL error messages */
            .popup-registration--rtl .popup-registration__error,
            [dir="rtl"] .popup-registration .popup-registration__error {
              text-align: right !important;
              margin-right: 0 !important;
            }

            /* RTL sidebar positioning */
            .popup-registration--rtl .popup-registration__sidebar,
            [dir="rtl"] .popup-registration .popup-registration__sidebar {
              order: 2 !important;
            }

            .popup-registration--rtl .popup-registration__content,
            [dir="rtl"] .popup-registration .popup-registration__content {
              order: 1 !important;
            }

            /* RTL mobile adjustments */
            @media screen and (max-width: 767px) {
              .popup-registration--rtl .popup-registration__container,
              [dir="rtl"] .popup-registration .popup-registration__container {
                flex-direction: column !important;
              }

              .popup-registration--rtl .popup-registration__sidebar,
              .popup-registration--rtl .popup-registration__content,
              [dir="rtl"] .popup-registration .popup-registration__sidebar,
              [dir="rtl"] .popup-registration .popup-registration__content {
                width: 100% !important;
                border-radius: 10px !important;
              }
            }
          `;
          document.head.appendChild(rtlStyle);
        }
      } else {
        // Remove RTL classes
        document.documentElement.classList.remove("rtl-active");
        document.body.classList.remove("rtl-active");

        // Remove RTL styles
        const rtlStyle = document.getElementById(
          "popup-registration-rtl-styles"
        );
        if (rtlStyle) rtlStyle.remove();
      }

      // Mark styles as loaded after a short delay to ensure smooth transition
      requestAnimationFrame(() => {
        styleLoadedRef.current = true;
        setIsStylesLoaded(true);
      });
    };

    setupRTL();

    return () => {
      if (isRTLMode) {
        document.documentElement.removeAttribute("dir");
        document.body.removeAttribute("dir");
        document.documentElement.classList.remove("rtl-active");
        document.body.classList.remove("rtl-active");

        const rtlStyle = document.getElementById(
          "popup-registration-rtl-styles"
        );
        if (rtlStyle) rtlStyle.remove();
      }
    };
  }, [isRTLMode, isExternalLoad]);

  // Add message listener for RTL changes from iframe
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleIframeMessages = (event) => {
      // Check if the message is an RTL change notification
      if (event.data && event.data.type === "OQTIMA_RTL_CHANGE") {
        const { isRTL: newRtlState, language } = event.data;
        console.log(
          `Received RTL change message from iframe: isRTL=${newRtlState}, language=${language}`
        );

        // Force re-render of the component by updating a state variable
        // This is a defensive measure to ensure RTL changes are reflected
        setIsContentReady(false);

        // Reset RTL state according to the message
        setTimeout(() => {
          // Update RTL classes immediately
          if (newRtlState) {
            document.documentElement.classList.add("rtl-active");
            document.body.classList.add("rtl-active");
          } else {
            document.documentElement.classList.remove(
              "rtl-active",
              "rtl",
              "is-rtl"
            );
            document.body.classList.remove("rtl-active", "rtl", "is-rtl");
          }
          setIsContentReady(true);
        }, 50);
      }
    };

    window.addEventListener("message", handleIframeMessages);

    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, []);

  if (!isOpen) return null;

  const benefits = benefitsConfig.filter(({ entities }) =>
    entities.includes(currentEntity)
  );

  const handleClose = () => {
    // Try to send message to parent window that close button was pressed
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage("close_popup", "*");
        window.parent.postMessage(
          {
            type: "OQTIMA_CLOSE_POPUP",
            source: "close_button",
            timestamp: Date.now(),
          },
          "*"
        );
      }
    } catch (err) {
      console.error("Error sending close message to parent:", err);
    }

    if (typeof onClose === "function") {
      onClose();
    }
  };

  const popupContent = (
    <>
      {isLoading && isExternalLoad && <LoadingSpinner />}
      <div
        key={isRTLMode ? "rtl-popup" : "ltr-popup"}
        className={cn("popup-registration", {
          "popup-registration--rtl": isRTLMode,
          "styles-loaded": isStylesLoaded,
          "content-ready": isContentReady,
          "popup-registration--external": isExternalLoad,
          "popup-registration--internal": !isExternalLoad,
        })}
        data-rtl={isRTLMode ? "true" : "false"}
        dir={isRTLMode ? "rtl" : "ltr"}
        style={{
          ...(isExternalLoad
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 9999,
              }
            : {
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }),
        }}
      >
        <div
          className={cn("popup-registration__wrapper", {
            "popup-registration__wrapper--rtl": isRTLMode,
          })}
          dir={isRTLMode ? "rtl" : "ltr"}
        >
          <div
            key={isRTLMode ? "rtl-container" : "ltr-container"}
            className={cn("popup-registration__container", className, {
              "popup-registration__container--rtl": isRTLMode,
            })}
            dir={isRTLMode ? "rtl" : "ltr"}
            style={
              isRTLMode
                ? {
                    flexDirection: "row-reverse !important",
                    display: "flex !important",
                  }
                : {}
            }
            data-rtl={isRTLMode.toString()}
          >
            <div
              className={cn("popup-registration__sidebar", {
                "popup-registration__sidebar--rtl": isRTLMode,
              })}
              data-rtl={isRTLMode ? "true" : "false"}
              style={isRTLMode ? { order: "2 !important" } : {}}
            >
              {(isRTLMode ||
                isMobile ||
                window.matchMedia("(orientation: landscape)").matches) && (
                <img
                  src={closemage}
                  alt="Close"
                  className={cn(
                    isRTLMode
                      ? "popup-registration__sidebar--rtl__close--rtl"
                      : "popup-registration__sidebar__close-mobile",
                    className
                  )}
                  onClick={handleClose}
                />
              )}
              <div className="sidebar-area">
                <div
                  className={cn("popup-registration__sidebar__title", {
                    "popup-registration__sidebar--rtl__title--rtl": isRTLMode,
                  })}
                >
                  <Trans i18nKey="popup-registration-title" ns="index">
                    <span className="normal-text">Embark on the</span>
                    <span className="highlighted">
                      <span className="white-text">OQTIMA Trading</span>
                      <span className="journey">Journey</span>
                    </span>
                  </Trans>
                </div>
              </div>
            </div>
            <div
              className={cn("popup-registration__content", {
                "popup-registration__content--rtl": isRTLMode,
              })}
              data-rtl={isRTLMode ? "true" : "false"}
              style={isRTLMode ? { order: "1 !important" } : {}}
            >
              {!isRTLMode && !isMobile && (
                <img
                  src={closemage}
                  alt="Close"
                  className="popup-registration__close"
                  onClick={handleClose}
                />
              )}
              <h1
                className={cn("popup-registration-register", {
                  "popup-registration-register--rtl": isRTLMode,
                })}
              >
                {t("popup-registration-register")}
              </h1>
              <PopupRegistrationForm params={JSON.stringify(parsedParams)} />
              <div className="risk-warning-container">
                <div className="risk-warning-content">
                  <p className="risk-warning-text">
                    {t("popup-registration-riskWarning")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(popupContent, document.body);
};

const Bullet = () => {
  return (
    <img
      src={bulletImage}
      alt="Bullet"
      style={{ width: "10px", height: "10px" }}
      className="object-cover"
    />
  );
};

PopupRegistration.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopupRegistration;
