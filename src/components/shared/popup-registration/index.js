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

// New function to thoroughly clean RTL attributes
export const cleanRTLAttributes = () => {
  if (typeof window === "undefined") return;

  // console.log("Cleaning all RTL attributes and classes");

  // Remove RTL classes from document element
  document.documentElement.classList.remove("rtl-active", "rtl", "is-rtl");
  document.documentElement.setAttribute("dir", "ltr");
  document.documentElement.removeAttribute("data-rtl");

  // Remove RTL classes from body
  // document.body.classList.remove("rtl-active", "rtl", "is-rtl");
  // document.body.setAttribute("dir", "ltr");
  // document.body.removeAttribute("data-rtl");

  // Remove RTL styles
  const rtlStyleElement = document.getElementById(
    "popup-registration-rtl-styles"
  );
  if (rtlStyleElement) rtlStyleElement.remove();

  const rtlStylesheet = document.getElementById("rtl-stylesheet");
  if (rtlStylesheet) rtlStylesheet.remove();

  const rtlInlineStyles = document.getElementById("rtl-inline-styles");
  if (rtlInlineStyles) rtlInlineStyles.remove();

  // Reset global RTL flags
  if (window.__FORCE_RTL__) window.__FORCE_RTL__ = false;
  if (window.__ORIGINAL_RTL__) window.__ORIGINAL_RTL__ = false;

  // Remove RTL from registration containers
  const registrationContainers = document.querySelectorAll(
    ".popup-registration"
  );
  if (registrationContainers.length > 0) {
    registrationContainers.forEach((container) => {
      container.classList.remove("rtl-active", "popup-registration--rtl");
      container.setAttribute("dir", "ltr");
      container.removeAttribute("data-rtl");
    });
  }

  // Reset form elements
  const rtlElements = document.querySelectorAll(".rtl-element");
  if (rtlElements.length > 0) {
    rtlElements.forEach((el) => {
      el.classList.remove("rtl-element");
      el.removeAttribute("dir");
    });
  }

  // Force UI update by triggering a reflow
  const reflow = document.body.offsetHeight;

  // console.log("RTL cleanup completed");
};

// Function to completely reset RTL state by forcing a page reload if needed
export const forceCompleteRTLReset = (forceReload = false) => {
  // Try the normal cleanup first
  cleanRTLAttributes();

  // Store the current language to maintain it across reload
  const currentLang = document.documentElement.getAttribute("lang") || "en";

  // Save current scroll position
  const scrollPos = window.scrollY || document.documentElement.scrollTop;

  if (forceReload) {
    // console.log("Forcing complete RTL reset with page reload");

    // Save important state in sessionStorage (it persists across reloads)
    try {
      sessionStorage.setItem("oqtima_reset_language", currentLang);
      sessionStorage.setItem("oqtima_reset_scroll", scrollPos.toString());
      sessionStorage.setItem("oqtima_reset_time", Date.now().toString());

      // Set a flag to indicate we've forced a reload
      sessionStorage.setItem("oqtima_rtl_reset", "true");
    } catch (e) {
      console.error("Failed to save state before reload:", e);
    }

    // Append a timestamp to force a clean reload
    const separator = window.location.search ? "&" : "?";
    window.location.href =
      window.location.href + separator + "_rtl_reset=" + Date.now();
  }
};

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
      // console.log(
      //   `Tab-specific language found: ${tabLanguage}, RTL: ${tabRtl}`
      // );

      // Set HTML attributes on initial page load
      document.documentElement.setAttribute("lang", tabLanguage);
      document.documentElement.setAttribute("dir", tabRtl ? "rtl" : "ltr");

      // Update classes
      if (tabRtl) {
        document.documentElement.classList.add("rtl-active");
        // document.body.classList.add("rtl-active");
      } else {
        document.documentElement.classList.remove(
          "rtl-active",
          "rtl",
          "is-rtl"
        );
        // document.body.classList.remove("rtl-active", "rtl", "is-rtl");
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

  // FIRST EFFECT: Handle reset state after a forced reload
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if we've just reloaded because of RTL issues
    const hasReset = sessionStorage.getItem("oqtima_rtl_reset") === "true";
    if (hasReset) {
      // console.log("Detected page was reloaded to fix RTL issues");

      try {
        // Get the saved language
        const savedLang = sessionStorage.getItem("oqtima_reset_language");
        if (savedLang) {
          // console.log(`Applying saved language after reload: ${savedLang}`);
          document.documentElement.setAttribute("lang", savedLang);

          // If it's not Arabic, make sure we clean RTL
          if (savedLang.toLowerCase() !== "ar") {
            cleanRTLAttributes();
          }
        }

        // Restore scroll position if needed
        const savedScroll = sessionStorage.getItem("oqtima_reset_scroll");
        if (savedScroll) {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }

        // Clear the reset flags
        sessionStorage.removeItem("oqtima_rtl_reset");
        sessionStorage.removeItem("oqtima_reset_language");
        sessionStorage.removeItem("oqtima_reset_scroll");
        sessionStorage.removeItem("oqtima_reset_time");
      } catch (e) {
        console.error("Error handling post-reload state:", e);
      }
    }

    // Check URL for the reset parameter and remove it to clean the URL
    if (window.location.search.includes("_rtl_reset=")) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("_rtl_reset");
        window.history.replaceState({}, document.title, url.toString());
      } catch (e) {
        console.warn("Failed to clean URL after reset:", e);
      }
    }
  }, []);

  // console.log("params Oke", params);
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
      // console.log("New session initialized:", window.__OQTIMA_SESSION_ID__);
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

      // console.log("Initial state - html lang:", htmlLang, "dir:", htmlDir);

      // Only reset if we're not supposed to be in RTL mode
      if (!params?.dataLang || params.dataLang !== "ar") {
        // Remove RTL classes
        document.documentElement.classList.remove(
          "rtl-active",
          "rtl",
          "is-rtl"
        );
        // document.body.classList.remove("rtl-active", "rtl", "is-rtl");

        // Force LTR for non-Arabic language
        // if (htmlDir === "rtl" && (!htmlLang || htmlLang !== "ar")) {
        // document.documentElement.setAttribute("dir", "ltr");
        // document.body.setAttribute("dir", "ltr");
        //   console.log("Force reset RTL to LTR on initial load");
        // }
      }

      // Use sessionStorage instead of localStorage to avoid cross-tab contamination
      try {
        // Store language state in session storage (per tab)
        const desiredLang =
          params?.langParam || params?.language || params?.dataLang || "en";
        sessionStorage.setItem("oqtima_tab_language", desiredLang);
        // console.log("Tab language set to:", desiredLang);

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
            // console.log(
            //   "Prevented cross-tab language contamination, restored:",
            //   tabLang
            // );
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
      // console.log("Current window location:", window.location.pathname);
      // console.log("Current window search:", window.location.search);
      // Debug existing language settings
      // console.log("Current language settings:");
      // console.log(
      //   "- document.documentElement.lang:",
      //   document.documentElement.lang
      // );
      // console.log(
      //   "- document.documentElement.dir:",
      //   document.documentElement.dir
      // );
      // if (window.localStorage) {
      //   console.log(
      //     "- localStorage i18nextLng:",
      //     localStorage.getItem("i18nextLng")
      //   );
      // }
      // if (window.gatsby_i18next_language) {
      //   console.log(
      //     "- gatsby_i18next_language:",
      //     window.gatsby_i18next_language
      //   );
      // }
      // console.log("Parameters passed to component:", params);
      // console.log("Parsed parameters:", parsedParams);
    }
  }, []);

  // Update parsed params when the input params change
  useEffect(() => {
    try {
      // console.log("params", params);
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

      // console.log("Language forced to:", forcedLanguage);
    }
  }, [forcedLanguage]);

  // Enhanced RTL detection - only use Arabic language to trigger RTL
  // FIXED: Make the RTL detection more specific and explicit
  let forcedRTL = false;

  // Check if auto RTL detection is specifically disabled
  if (typeof window !== "undefined" && window.__OQTIMA_DISABLE_AUTO_RTL__) {
    // console.log(
    //   "RTL detection explicitly disabled by __OQTIMA_DISABLE_AUTO_RTL__"
    // );
    forcedRTL = false;
  }
  // Only set forcedRTL if language is explicitly set to an RTL language
  else if (
    forcedLanguage &&
    RTL_LANGUAGES.includes(forcedLanguage.toLowerCase())
  ) {
    forcedRTL = true;
    // console.log(`RTL mode enabled from forcedLanguage: ${forcedLanguage}`);
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
      // console.log(`RTL mode enabled from data-lang: ${parsedParams.dataLang}`);
    } else {
      // console.log(
      //   `RTL mode disabled because explicit language overrides data-lang`
      // );
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
      // console.log("RTL mode enabled from URL path: /ar/");
    } else {
      // IMPORTANT: Explicitly disable RTL for non-Arabic paths
      forcedRTL = false;
      // console.log("RTL mode explicitly disabled for non-Arabic path");
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
      // console.log(
      //   `Overriding RTL detection because HTML lang="${htmlLang}" is not an RTL language`
      // );
      forcedRTL = false;

      // IMPORTANT: Call the cleanup function explicitly for non-Arabic languages
      if (htmlLang && htmlLang.toLowerCase() !== "ar") {
        cleanRTLAttributes();
      }
    }
  }

  const isRTLMode = forcedRTL || isRTL;

  // Add effect to update RTL mode when forcedLanguage changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // First, clear any previous RTL settings
    document.documentElement.classList.remove("rtl-active");
    // document.body.classList.remove("rtl-active");
    const existingRtlStyle = document.getElementById(
      "popup-registration-rtl-styles"
    );
    if (existingRtlStyle) existingRtlStyle.remove();

    // console.log("Updating RTL mode:", isRTLMode ? "RTL" : "LTR");

    // Update global flags when language changes
    window.__ORIGINAL_LANGUAGE__ = forcedLanguage || params?.langParam || "en";
    window.__FORCE_RTL__ = isRTLMode;
    window.__ORIGINAL_RTL__ = isRTLMode;

    // IMPROVED LANGUAGE HANDLING: Check the language and set it correctly first
    const effectiveLanguage =
      forcedLanguage || params?.langParam || (isRTLMode ? "ar" : "en");
    document.documentElement.setAttribute("lang", effectiveLanguage);

    // If language is not Arabic, ensure RTL attributes are removed
    if (effectiveLanguage.toLowerCase() !== "ar") {
      cleanRTLAttributes();
      return; // Exit early - no need to apply RTL styles for non-Arabic languages
    }

    // Update document classes and attributes immediately
    document.documentElement.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
    // document.body.setAttribute("dir", isRTLMode ? "rtl" : "ltr");

    if (isRTLMode) {
      document.documentElement.classList.add("rtl-active");
      document.documentElement.classList.add("rtl");
      document.documentElement.setAttribute("data-rtl", "true");
      // document.body.classList.add("rtl-active");
      // document.body.classList.add("rtl");
      // document.body.setAttribute("data-rtl", "true");
    } else {
      // Remove all possible RTL classes
      document.documentElement.classList.remove("rtl-active", "rtl", "is-rtl");
      // document.body.classList.remove("rtl-active", "rtl", "is-rtl");
      // Remove data attributes related to RTL
      document.documentElement.removeAttribute("data-rtl");
      document.body.removeAttribute("data-rtl");
    }

    // Force UI update by triggering a reflow
    const reflow = document.body.offsetHeight;

    // Use MutationObserver to ensure RTL settings persist
    if (isRTLMode) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === "dir" ||
            mutation.attributeName === "lang" ||
            mutation.attributeName === "class"
          ) {
            // Only reapply RTL settings if language is still Arabic
            const currentLang = document.documentElement.getAttribute("lang");
            if (currentLang && currentLang.toLowerCase() === "ar") {
              // Reapply RTL settings if they were changed
              if (
                document.documentElement.getAttribute("dir") !== "rtl" ||
                !document.documentElement.classList.contains("rtl-active")
              ) {
                // console.log(
                //   "Reapplying RTL settings after external modification"
                // );
                document.documentElement.setAttribute("dir", "rtl");
                document.documentElement.classList.add("rtl-active", "rtl");
                document.documentElement.setAttribute("data-rtl", "true");
              }
            } else if (currentLang && currentLang.toLowerCase() !== "ar") {
              // Language is not Arabic - ensure RTL is cleaned up
              cleanRTLAttributes();
              observer.disconnect(); // No need to keep observing
            }
          }
        });
      });

      // Start observing the document element
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir", "lang", "class"],
      });

      // Clean up observer on unmount or when RTL changes
      return () => observer.disconnect();
    }

    // console.log(
    //   `Language state updated - Language: ${
    //     forcedLanguage || "default"
    //   }, RTL mode: ${isRTLMode}`
    // );
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
      // document.body.setAttribute("dir", isRTLMode ? "rtl" : "ltr");

      if (isRTLMode) {
        // Add RTL classes
        document.documentElement.classList.add("rtl-active");
        // document.body.classList.add("rtl-active");

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
        // document.body.classList.remove("rtl-active");

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
        // document.body.removeAttribute("dir");
        document.documentElement.classList.remove("rtl-active");
        // document.body.classList.remove("rtl-active");

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
        // console.log(
        //   `Received RTL change message from iframe: isRTL=${newRtlState}, language=${language}`
        // );

        // Force re-render of the component by updating a state variable
        // This is a defensive measure to ensure RTL changes are reflected
        setIsContentReady(false);

        // Reset RTL state according to the message
        setTimeout(() => {
          // Update RTL classes immediately
          if (newRtlState) {
            document.documentElement.classList.add("rtl-active");
            // document.body.classList.add("rtl-active");
          } else {
            document.documentElement.classList.remove(
              "rtl-active",
              "rtl",
              "is-rtl"
            );
            // document.body.classList.remove("rtl-active", "rtl", "is-rtl");
          }
          setIsContentReady(true);
        }, 50);
      }
      // Handle registration parameters message
      else if (event.data && event.data.type === "REGISTRATION_PARAMS") {
        // console.log(
        //   "Received registration parameters from parent:",
        //   event.data
        // );

        try {
          const { data } = event.data;

          // Store referral parameters in session storage
          if (data.referral_type !== undefined && data.referral_type !== null) {
            sessionStorage.setItem("oqtima_referral_type", data.referral_type);
            window.__OQTIMA_REFERRAL_TYPE__ = data.referral_type;
            // console.log(
            //   "Stored referral_type in sessionStorage:",
            //   data.referral_type
            // );
          }

          if (
            data.referral_value !== undefined &&
            data.referral_value !== null
          ) {
            sessionStorage.setItem(
              "oqtima_referral_value",
              data.referral_value
            );
            window.__OQTIMA_REFERRAL_VALUE__ = data.referral_value;
            // console.log(
            //   "Stored referral_value in sessionStorage:",
            //   data.referral_value
            // );
          }

          // Handle direct session storage instructions
          if (data.storeInSessionStorage && Array.isArray(data.storageKeys)) {
            data.storageKeys.forEach((item) => {
              if (item.key && item.value !== undefined) {
                sessionStorage.setItem(item.key, item.value);
                // console.log(
                //   `Stored ${item.key} in sessionStorage:`,
                //   item.value
                // );
              }
            });
          }

          // Send confirmation back to parent
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              {
                type: "REGISTRATION_PARAMS_RECEIVED",
                success: true,
                timestamp: Date.now(),
              },
              "*"
            );
          }
        } catch (e) {
          console.error("Error processing registration parameters:", e);
        }
      }
    };

    window.addEventListener("message", handleIframeMessages);

    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, []);

  // NEW EFFECT: Monitor document language and clean RTL attributes if not Arabic
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Function to check and fix RTL attributes when language changes
    const checkAndFixRTLAttributes = () => {
      const currentLang = document.documentElement.getAttribute("lang");
      // console.log(`Language change detected: ${currentLang}`);

      // Fix for query string incorrectly set as the language
      if (currentLang && currentLang.includes("?language=")) {
        // Extract the actual language code from the query string
        const langMatch = currentLang.match(/\?language=([a-zA-Z-]+)/);
        if (langMatch && langMatch[1]) {
          const actualLang = langMatch[1];
          // console.log(
          //   `Fixing incorrectly set language from '${currentLang}' to '${actualLang}'`
          // );

          // Update the HTML lang attribute with the correct value
          document.documentElement.setAttribute("lang", actualLang);

          // Update language in storage
          try {
            sessionStorage.setItem("oqtima_tab_language", actualLang);
            window.__OQTIMA_COMPONENT_LANGUAGE = actualLang;
            window.__OQTIMA_LOCKED_LANG = actualLang;
            localStorage.setItem("i18nextLng", actualLang);
          } catch (e) {}

          // Check if this is Arabic and set RTL if needed
          if (actualLang.toLowerCase() === "ar") {
            // console.log("Arabic language detected, applying RTL mode");

            // Apply RTL settings directly instead of calling setupRTL
            document.documentElement.setAttribute("dir", "rtl");
            document.documentElement.classList.add("rtl-active");
            // document.body.classList.add("rtl-active");

            // Store RTL state
            try {
              sessionStorage.setItem("oqtima_tab_rtl", "true");
              window.__FORCE_RTL__ = true;
              window.__ORIGINAL_RTL__ = true;
            } catch (e) {
              console.error("Error storing RTL state:", e);
            }

            return; // Exit early as we've fixed it
          }
        }
      }

      // Normal processing for correctly set languages
      if (currentLang && currentLang.toLowerCase() !== "ar") {
        // If language is not Arabic, ensure we clean up all RTL attributes
        // console.log(
        //   `Non-Arabic language '${currentLang}' detected, cleaning RTL attributes`
        // );
        cleanRTLAttributes();
      } else if (currentLang && currentLang.toLowerCase() === "ar") {
        // For Arabic language, set RTL attributes
        // console.log("Arabic language detected, applying RTL mode");
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.classList.add("rtl-active");
        // document.body.classList.add("rtl-active");

        // Store RTL state
        try {
          sessionStorage.setItem("oqtima_tab_rtl", "true");
          window.__FORCE_RTL__ = true;
          window.__ORIGINAL_RTL__ = true;
        } catch (e) {
          console.error("Error storing RTL state:", e);
        }
      }
    };

    // Initial check
    checkAndFixRTLAttributes();

    // Set up MutationObserver to monitor language attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "lang") {
          checkAndFixRTLAttributes();
        }
      });
    });

    // Start observing the document element for language changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);

  // NEW: Add debug hook to monitor RTL attributes and force cleanup if needed
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Define what we consider a "stuck" RTL state
    const isRTLStuck = () => {
      const htmlLang = document.documentElement.getAttribute("lang") || "";
      const htmlDir = document.documentElement.getAttribute("dir") || "";
      const htmlHasRTLClass =
        document.documentElement.classList.contains("rtl-active") ||
        document.documentElement.classList.contains("rtl");

      // If language is not Arabic but we have RTL classes or dir="rtl", something is stuck
      return (
        htmlLang.toLowerCase() !== "ar" &&
        (htmlDir === "rtl" || htmlHasRTLClass)
      );
    };

    // Set a timeout to check if RTL cleanup worked
    const checkTimeout = setTimeout(() => {
      if (isRTLStuck()) {
        console.warn(
          "RTL state appears to be stuck after language change to non-Arabic"
        );
        console.warn("Attempting force cleanup...");

        // Try stronger cleanup
        cleanRTLAttributes();

        // Check again after a short delay
        setTimeout(() => {
          if (isRTLStuck()) {
            console.error(
              "RTL state is still stuck after first cleanup attempt"
            );
            console.error("Using last resort - forcing complete reset...");

            // Last resort - reload the page
            forceCompleteRTLReset(true);
          } else {
            // console.log("Force cleanup successfully fixed RTL state");
          }
        }, 500);
      }
    }, 1000);

    return () => clearTimeout(checkTimeout);
  }, []);

  // NEW: Check for cookies containing referral parameters on page load
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Function to get cookie value by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    // Check for referral parameters in cookies
    const checkReferralCookies = () => {
      try {
        // Check for referral type in cookies
        const referralType = getCookie("oqtima_referral_type");
        if (referralType) {
          // console.log("Found referral_type in cookie:", referralType);
          sessionStorage.setItem("oqtima_referral_type", referralType);
          window.__OQTIMA_REFERRAL_TYPE__ = referralType;
        }

        // Check for referral value in cookies
        const referralValue = getCookie("oqtima_referral_value");
        if (referralValue) {
          // console.log("Found referral_value in cookie:", referralValue);
          sessionStorage.setItem("oqtima_referral_value", referralValue);
          window.__OQTIMA_REFERRAL_VALUE__ = referralValue;
        }

        // IMPORTANT NEW: Check for language in URL path
        if (typeof window !== "undefined") {
          const pathParts = window.location.pathname.split("/").filter(Boolean);

          // If the path starts with a language code (like /id/ or /en/)
          if (pathParts.length > 0 && pathParts[0].length <= 5) {
            const pathLanguage = pathParts[0];
            // console.log("Detected language from URL path:", pathLanguage);

            // Force this language throughout the app
            // This is crucial to maintain language consistency
            sessionStorage.setItem("oqtima_tab_language", pathLanguage);
            window.__OQTIMA_COMPONENT_LANGUAGE = pathLanguage;
            window.__OQTIMA_LOCKED_LANG = pathLanguage;
            window.__FORCE_LANGUAGE__ = true;
            document.documentElement.setAttribute("lang", pathLanguage);

            // Update other language storage as well
            try {
              localStorage.setItem("i18nextLng", pathLanguage);
              if (window.gatsby_i18next_language) {
                window.gatsby_i18next_language = pathLanguage;
              }
            } catch (e) {}

            // console.log("Language from URL path enforced:", pathLanguage);
          }
        }

        // Check for language parameters in URL query params
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);

          // Check for referral type in URL params with multiple possible names
          const referralTypeParams = [
            "referral_type",
            "referralType",
            "referral-type",
          ];
          for (const param of referralTypeParams) {
            const value = urlParams.get(param);
            if (value) {
              // console.log(`Found ${param} in URL:`, value);
              sessionStorage.setItem("oqtima_referral_type", value);
              window.__OQTIMA_REFERRAL_TYPE__ = value;
              break;
            }
          }

          // Check for referral value in URL params with multiple possible names
          const referralValueParams = [
            "referral_value",
            "referralValue",
            "referral-value",
          ];
          for (const param of referralValueParams) {
            const value = urlParams.get(param);
            if (value) {
              // console.log(`Found ${param} in URL:`, value);
              sessionStorage.setItem("oqtima_referral_value", value);
              window.__OQTIMA_REFERRAL_VALUE__ = value;
              break;
            }
          }

          // CRITICAL: Check for language parameters and enforce them
          const languageParams = [
            "language",
            "lang",
            "locale",
            "i18nextLng",
            "data-lang",
          ];
          for (const param of languageParams) {
            const value = urlParams.get(param);
            if (value) {
              // console.log(`Found language parameter ${param} in URL:`, value);

              // Clean the language value before using it
              const cleanLanguageValue = value
                .trim()
                .replace(/[^a-zA-Z\-_]/g, "");

              // Enforce this language
              sessionStorage.setItem("oqtima_tab_language", cleanLanguageValue);
              window.__OQTIMA_COMPONENT_LANGUAGE = cleanLanguageValue;
              window.__OQTIMA_LOCKED_LANG = cleanLanguageValue;
              window.__FORCE_LANGUAGE__ = true;
              document.documentElement.setAttribute("lang", cleanLanguageValue);

              try {
                localStorage.setItem("i18nextLng", cleanLanguageValue);
                if (window.gatsby_i18next_language) {
                  window.gatsby_i18next_language = cleanLanguageValue;
                }
              } catch (e) {}

              // console.log(
              //   "Language from URL parameter enforced:",
              //   cleanLanguageValue
              // );
              break;
            }
          }
        }
      } catch (e) {
        console.warn("Error checking cookies and parameters:", e);
      }
    };

    // Run the check on initial load
    checkReferralCookies();

    // Also set up a check for parameters in parent message data
    if (parsedParams?.referral_type) {
      // console.log(
      //   "Setting referral_type from parsed params:",
      //   parsedParams.referral_type
      // );
      sessionStorage.setItem(
        "oqtima_referral_type",
        parsedParams.referral_type
      );
      window.__OQTIMA_REFERRAL_TYPE__ = parsedParams.referral_type;
    }

    if (parsedParams?.referral_value) {
      // console.log(
      //   "Setting referral_value from parsed params:",
      //   parsedParams.referral_value
      // );
      sessionStorage.setItem(
        "oqtima_referral_value",
        parsedParams.referral_value
      );
      window.__OQTIMA_REFERRAL_VALUE__ = parsedParams.referral_value;
    }

    // CRITICAL ADDITION: Handle language from parsedParams
    if (
      parsedParams?.langParam ||
      parsedParams?.language ||
      parsedParams?.dataLang
    ) {
      const detectedLanguage =
        parsedParams.langParam ||
        parsedParams.language ||
        parsedParams.dataLang;
      // console.log("Setting language from parsed params:", detectedLanguage);

      // Store language in all possible locations to ensure it's not overridden
      sessionStorage.setItem("oqtima_tab_language", detectedLanguage);
      window.__OQTIMA_COMPONENT_LANGUAGE = detectedLanguage;
      window.__OQTIMA_LOCKED_LANG = detectedLanguage;
      window.__FORCE_LANGUAGE__ = true;
      document.documentElement.setAttribute("lang", detectedLanguage);

      try {
        localStorage.setItem("i18nextLng", detectedLanguage);
        if (window.gatsby_i18next_language) {
          window.gatsby_i18next_language = detectedLanguage;
        }
      } catch (e) {}

      // console.log("Language from params enforced:", detectedLanguage);
    }

    // Add a MutationObserver to prevent language changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "lang") {
          const currentLang = document.documentElement.getAttribute("lang");
          const storedLang = sessionStorage.getItem("oqtima_tab_language");

          if (storedLang && currentLang !== storedLang) {
            // console.log(
            //   `Language changed from ${storedLang} to ${currentLang}, reverting back`
            // );
            document.documentElement.setAttribute("lang", storedLang);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => {
      observer.disconnect();
    };
  }, [parsedParams]);

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
        key={isRTLMode ? "rtl" : "ltr"}
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
