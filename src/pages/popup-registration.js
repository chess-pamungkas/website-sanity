import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import RegistrationPopup from "../components/registration-popup";
import { useTranslation } from "react-i18next";
import { graphql } from "gatsby";
import LanguageContext from "../context/language-context";
import ClientResolverContext from "../context/client-resolver-context";

// Import the styles directly
import "../assets/styles/popup-registration.scss";
import "../assets/styles/rtl.scss";

const RTL_LANGUAGES = ["ar"];

// Helper to get language from URL hash and locked parameter
const getLanguageFromHash = () => {
  if (typeof window === "undefined") return null;

  try {
    // CRITICAL: Check special oqtima_lang_locked parameter first (highest priority)
    const urlParams = new URLSearchParams(window.location.search);
    const lockedLang = urlParams.get("oqtima_lang_locked");
    if (lockedLang) {
      // Save to storage with special flag
      try {
        localStorage.setItem("__OQTIMA_LOCKED_LANG", lockedLang);
        localStorage.setItem(
          "__OQTIMA_LOCKED_LANG_TIME",
          Date.now().toString()
        );

        // CRITICAL FIX: Add global marker to prevent override
        window.__OQTIMA_LANG_MUST_USE = lockedLang;
        window.__OQTIMA_LANG_SOURCE = "oqtima_lang_locked";
        // CRITICAL: Set flag to allow language replacement
        window.__OQTIMA_ALLOW_FORCE_LANG = true;
      } catch (e) {
        // Error handling
      }
      return lockedLang;
    }

    // Check storage for locked language
    try {
      const storedLockedLang = localStorage.getItem("__OQTIMA_LOCKED_LANG");
      if (storedLockedLang) {
        // CRITICAL FIX: Add global marker to prevent override
        window.__OQTIMA_LANG_MUST_USE = storedLockedLang;
        window.__OQTIMA_LANG_SOURCE = "localStorage";
        // CRITICAL: Set flag to allow language replacement
        window.__OQTIMA_ALLOW_FORCE_LANG = true;

        return storedLockedLang;
      }
    } catch (e) {
      // Error handling
    }

    // If no locked param, check hash
    const hash = window.location.hash;
    if (!hash) return null;

    // Check for oqtima_lang in hash
    let matches = hash.match(/oqtima_lang=([a-z]{2})/i);
    if (matches && matches[1]) {
      const hashLang = matches[1].toLowerCase();

      // CRITICAL FIX: Add global marker to prevent override
      window.__OQTIMA_LANG_MUST_USE = hashLang;
      window.__OQTIMA_LANG_SOURCE = "oqtima_lang_hash";
      // CRITICAL: Set flag to allow language replacement
      window.__OQTIMA_ALLOW_FORCE_LANG = true;

      return hashLang;
    }

    // Fallback to old format
    matches = hash.match(/lang=([a-z]{2})/i);
    if (matches && matches[1]) {
      const hashLang = matches[1].toLowerCase();

      // CRITICAL FIX: Add global marker to prevent override
      window.__OQTIMA_LANG_MUST_USE = hashLang;
      window.__OQTIMA_LANG_SOURCE = "lang_hash";
      // CRITICAL: Set flag to allow language replacement
      window.__OQTIMA_ALLOW_FORCE_LANG = true;

      return hashLang;
    }
  } catch (err) {
    // Error handling
  }

  return null;
};

// Helper function to manually set language
const manuallySetLanguage = async (lang, i18nInstance) => {
  // Check if we are forcing or have forced the language before
  const isForced =
    window.__OQTIMA_HANDLING_FORCE || window.__OQTIMA_FORCE_COUNT > 0;

  try {
    // If there's no i18nInstance, exit the function
    if (!i18nInstance) {
      return false;
    }

    // Special handling for RTL languages
    const RTL_LANGUAGES = ["ar"];
    const isRTL = RTL_LANGUAGES.includes(lang);

    // Apply RTL styling if needed
    if (isRTL) {
      // Load RTL stylesheet if not already loaded
      if (!document.getElementById("rtl-stylesheet")) {
        const rtlStylesheet = document.createElement("link");
        rtlStylesheet.id = "rtl-stylesheet";
        rtlStylesheet.rel = "stylesheet";
        rtlStylesheet.href = "/styles/rtl.css";
        document.head.appendChild(rtlStylesheet);
      }

      // Apply RTL classes to HTML and body
      document.documentElement.classList.add("rtl-active");
      document.documentElement.setAttribute("dir", "rtl");
      document.body.classList.add("rtl-active");
      document.body.setAttribute("dir", "rtl");

      // Force text direction on critical elements
      const styleTag = document.createElement("style");
      styleTag.id = "rtl-inline-styles";
      styleTag.innerHTML = `
        .rtl-active input, 
        .rtl-active textarea, 
        .rtl-active select {
          direction: rtl !important;
          text-align: right !important;
        }
        
        .rtl-active .form-item {
          direction: rtl !important; 
        }
        
        .rtl-active .popup-registration__content {
          direction: rtl !important;
        }
        
        /* Mirror spacing and positioning */
        .rtl-active .form-item label {
          text-align: right !important;
        }
        
        .rtl-active .form-checkbox label {
          padding-right: 25px !important;
          padding-left: 0 !important;
        }
        
        .rtl-active .form-checkbox input[type="checkbox"] {
          right: 0 !important;
          left: auto !important;
        }
      `;

      if (!document.getElementById("rtl-inline-styles")) {
        document.head.appendChild(styleTag);
      }
    }

    // IMPORTANT: Use original_changeLanguage if available to prevent infinite recursion
    try {
      if (window.__ORIGINAL_CHANGE_LANGUAGE) {
        await window.__ORIGINAL_CHANGE_LANGUAGE.call(i18nInstance, lang);
      } else {
        // Use changeLanguage directly if no original function exists
        await i18nInstance.changeLanguage(lang);
      }
    } catch (langError) {
      // Try the most basic approach to update the language
      i18nInstance.language = lang;
    }

    // Store the current language
    localStorage.setItem("language", lang);
    window.__OQTIMA_LAST_LANG = lang;

    if (isForced) {
      window.__OQTIMA_FORCE_COUNT = (window.__OQTIMA_FORCE_COUNT || 0) + 1;
    }

    return true;
  } catch (err) {
    return false;
  }
};

// Add function to lock language and prevent changes
const lockLanguage = (langCode, i18nInstance) => {
  if (!langCode || !i18nInstance) return;

  // CRITICAL: Make sure langCode matches OQTIMA_LANG_MUST_USE if it exists
  if (
    window.__OQTIMA_LANG_MUST_USE &&
    langCode !== window.__OQTIMA_LANG_MUST_USE
  ) {
    langCode = window.__OQTIMA_LANG_MUST_USE;
  }

  // Save original language globally
  if (typeof window !== "undefined") {
    window.__LOCKED_LANGUAGE = langCode;

    // Override i18next functions to prevent language changes
    if (i18nInstance && i18nInstance.changeLanguage) {
      // Save original function if not already saved
      if (!window.__ORIGINAL_CHANGE_LANGUAGE) {
        window.__ORIGINAL_CHANGE_LANGUAGE = i18nInstance.changeLanguage;
      }

      // Add flag to prevent recursion
      window.__CHANGING_LANGUAGE = false;

      // Replace with custom function
      i18nInstance.changeLanguage = function (lng, ...args) {
        // Check if recursion detected
        if (window.__CHANGING_LANGUAGE) {
          return i18nInstance;
        }

        try {
          // Set flag to prevent recursion
          window.__CHANGING_LANGUAGE = true;

          // Prioritize OQTIMA_LANG_MUST_USE if it exists
          if (window.__OQTIMA_LANG_MUST_USE) {
            if (lng === window.__OQTIMA_LANG_MUST_USE) {
              const result = window.__ORIGINAL_CHANGE_LANGUAGE.call(
                i18nInstance,
                lng,
                ...args
              );
              window.__CHANGING_LANGUAGE = false;
              return result;
            }

            // CRITICAL: Allow changes if flag permits
            if (window.__OQTIMA_ALLOW_FORCE_LANG) {
              const result = window.__ORIGINAL_CHANGE_LANGUAGE.call(
                i18nInstance,
                lng,
                ...args
              );
              window.__CHANGING_LANGUAGE = false;
              return result;
            }

            window.__CHANGING_LANGUAGE = false;
            return i18nInstance; // Block changes
          }

          // Check if change is to the desired language
          if (lng === langCode) {
            const result = window.__ORIGINAL_CHANGE_LANGUAGE.call(
              i18nInstance,
              lng,
              ...args
            );
            window.__CHANGING_LANGUAGE = false;
            return result;
          }

          // CRITICAL: Allow changes if flag permits
          if (window.__OQTIMA_ALLOW_FORCE_LANG) {
            const result = window.__ORIGINAL_CHANGE_LANGUAGE.call(
              i18nInstance,
              lng,
              ...args
            );
            window.__CHANGING_LANGUAGE = false;
            return result;
          }

          // Reject other language changes
          window.__CHANGING_LANGUAGE = false;
          return i18nInstance; // Return instance without changing language
        } catch (error) {
          window.__CHANGING_LANGUAGE = false;
          return i18nInstance;
        }
      };
    }
  }
};

const PopupRegistrationPage = ({ location, data }) => {
  const [params, setParams] = useState({});
  const { i18n } = useTranslation();
  const languageContext = useContext(LanguageContext);
  const clientContext = useContext(ClientResolverContext);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  // Prevent language routing redirects for popup
  useEffect(() => {
    // Disable routing redirects for popup pages
    if (typeof window !== "undefined") {
      window.__DISABLE_LANGUAGE_REDIRECT__ = true;
      window.__FORCE_LANGUAGE__ = true;
      window.__PREVENT_LANGUAGE_PATH_REDIRECT__ = true; // Additional flag to prevent path redirect
      window.__USING_URL_LANG_PARAM__ = true; // Indicate to use parameter, not path

      // Listen for language force messages from parent
      const handleMessage = (event) => {
        // Check origin (optional - for security)
        if (event.data && event.data.type === "FORCE_LANGUAGE") {
          const forcedLang = event.data.language;
          const forceApply = event.data.forceApply || false;
          const override = event.data.override || false;
          const isRTL = event.data.isRTL || RTL_LANGUAGES.includes(forcedLang);

          // CRITICAL: Enable language change permission flag for FORCE_LANGUAGE messages
          window.__OQTIMA_ALLOW_FORCE_LANG = true;

          // CRITICAL: Check if there's a language that must be used from URL parameters
          if (window.__OQTIMA_LANG_MUST_USE && !override && !forceApply) {
            // If override or forceApply is not true, we need to check if the language matches
            if (forcedLang === window.__OQTIMA_LANG_MUST_USE) {
              // Continue because language matches the desired one
            } else {
              return; // Don't continue if it doesn't match
            }
          } else {
            // Either no URL param constraint exists OR override/forceApply is true
            window.__OQTIMA_LANG_MUST_USE = forcedLang;
            window.__OQTIMA_LANG_SOURCE = "forced_message";

            // Store the language in localStorage to maintain consistency
            try {
              localStorage.setItem("__OQTIMA_ORIGINAL_LANGUAGE", forcedLang);
              localStorage.setItem("__OQTIMA_SELECTED_LANGUAGE", forcedLang);
              localStorage.setItem(
                "__OQTIMA_REGISTRATION_LANGUAGE",
                forcedLang
              );
              localStorage.setItem("i18nextLng", forcedLang);
              localStorage.setItem("gatsby-i18next-language", forcedLang);
              document.cookie = `i18next=${forcedLang};path=/`;
              document.cookie = `last_language=${forcedLang};path=/`;
            } catch (e) {
              // Error setting storage
            }
          }

          if (forcedLang) {
            // Apply language immediately
            try {
              // Use our dedicated helper function to ensure proper language application
              manuallySetLanguage(forcedLang, i18n).then(() => {});

              // Update DOM
              document.documentElement.lang = forcedLang;
              document
                .querySelector('meta[http-equiv="content-language"]')
                ?.setAttribute("content", forcedLang);

              // Body classes for styling
              document.body.classList.add(`lang-${forcedLang}`);

              // Handle RTL styling
              if (isRTL) {
                // Add RTL classes and attributes to HTML and body
                document.documentElement.setAttribute("dir", "rtl");
                document.documentElement.classList.add("rtl-active");
                document.body.setAttribute("dir", "rtl");
                document.body.classList.add("rtl-active");

                // Load RTL stylesheet if needed
                if (!document.getElementById("rtl-stylesheet")) {
                  const rtlStylesheet = document.createElement("link");
                  rtlStylesheet.id = "rtl-stylesheet";
                  rtlStylesheet.rel = "stylesheet";
                  rtlStylesheet.href = "/styles/rtl.css";
                  document.head.appendChild(rtlStylesheet);
                }

                // Add RTL classes to registration components
                const registrationContainer = document.querySelector(
                  ".popup-registration"
                );
                if (registrationContainer) {
                  registrationContainer.classList.add("rtl-active");
                  registrationContainer.setAttribute("dir", "rtl");
                  registrationContainer.setAttribute("data-rtl", "true");
                }

                // Add RTL to form elements
                const formElements = document.querySelectorAll(
                  "input, select, textarea, button, label"
                );
                if (formElements.length > 0) {
                  formElements.forEach((el) => {
                    el.classList.add("rtl-element");
                    el.setAttribute("dir", "rtl");
                  });
                }

                // Inject RTL specific CSS
                if (!document.getElementById("rtl-inline-styles")) {
                  const rtlInlineStyles = document.createElement("style");
                  rtlInlineStyles.id = "rtl-inline-styles";
                  rtlInlineStyles.innerHTML = `
                    .rtl-active input, 
                    .rtl-active textarea, 
                    .rtl-active select {
                      direction: rtl !important;
                      text-align: right !important;
                    }
                    
                    .rtl-active .form-item {
                      direction: rtl !important; 
                    }
                    
                    .rtl-active .popup-registration__content {
                      direction: rtl !important;
                    }
                    
                    /* Mirror spacing and positioning */
                    .rtl-active .form-item label {
                      text-align: right !important;
                    }
                    
                    .rtl-active .form-checkbox label {
                      padding-right: 25px !important;
                      padding-left: 0 !important;
                    }
                    
                    .rtl-active .form-checkbox input[type="checkbox"] {
                      right: 0 !important;
                      left: auto !important;
                    }
                  `;
                  document.head.appendChild(rtlInlineStyles);
                }
              } else {
                // Remove RTL if it's not an RTL language
                document.documentElement.removeAttribute("dir");
                document.documentElement.classList.remove("rtl-active");
                document.body.removeAttribute("dir");
                document.body.classList.remove("rtl-active");

                // Remove RTL from registration container
                const registrationContainer = document.querySelector(
                  ".popup-registration"
                );
                if (registrationContainer) {
                  registrationContainer.classList.remove("rtl-active");
                  registrationContainer.removeAttribute("dir");
                  registrationContainer.removeAttribute("data-rtl");
                }

                // Remove RTL from form elements
                const formElements = document.querySelectorAll(".rtl-element");
                if (formElements.length > 0) {
                  formElements.forEach((el) => {
                    el.classList.remove("rtl-element");
                    el.removeAttribute("dir");
                  });
                }
              }

              // Update language context if available
              if (languageContext && languageContext.setSelectedLanguage) {
                languageContext.setSelectedLanguage({
                  id: forcedLang,
                  title: forcedLang.toUpperCase(),
                  URIPart: `/${forcedLang}/`,
                  isRTL: isRTL,
                });
              }
            } catch (err) {
              // Error forcing language
            }
          }
        }
      };

      window.addEventListener("message", handleMessage);

      return () => {
        // Cleanup listener on unmount
        window.removeEventListener("message", handleMessage);

        // Cleanup when component unmounts
        if (typeof window !== "undefined") {
          window.__DISABLE_LANGUAGE_REDIRECT__ = false;
          window.__FORCE_LANGUAGE__ = false;
          window.__PREVENT_LANGUAGE_PATH_REDIRECT__ = false;
          window.__USING_URL_LANG_PARAM__ = false;
        }
      };
    }
  }, [i18n, languageContext]);

  useEffect(() => {
    try {
      // Parse query parameters correctly and catch logs
      const searchParamsString = location.search || "";
      const searchParams = new URLSearchParams(searchParamsString);

      // Try to get language from URL hash (highest priority)
      const hashLang = getLanguageFromHash();

      // CRITICAL FIX: Use global marker if exists
      let effectiveLangParam;
      if (window.__OQTIMA_LANG_MUST_USE) {
        effectiveLangParam = window.__OQTIMA_LANG_MUST_USE;
      } else {
        // Extract language parameter - prioritize locked parameter
        const lockedParam = searchParams.get("oqtima_lang_locked");
        effectiveLangParam =
          lockedParam ||
          hashLang ||
          searchParams.get("lang") ||
          searchParams.get("language") ||
          "en";
      }

      // Lock language to prevent changes
      lockLanguage(effectiveLangParam, i18n);

      // Force apply language immediately
      if (effectiveLangParam) {
        try {
          const normalizedLang = effectiveLangParam.toLowerCase().trim();

          // Apply language to i18n safely
          try {
            // If original function exists, use it to avoid recursion
            if (window.__ORIGINAL_CHANGE_LANGUAGE) {
              window.__ORIGINAL_CHANGE_LANGUAGE.call(i18n, normalizedLang);
            } else {
              // Fallback to alternative approach
              i18n.language = normalizedLang;
              i18n.languages = [normalizedLang];
              i18n.resolvedLanguage = normalizedLang;
            }
          } catch (langError) {
            // Fallback to most basic approach
            i18n.language = normalizedLang;
          }

          // Set language in HTML
          document.documentElement.lang = normalizedLang;
          document.documentElement.setAttribute("lang", normalizedLang);

          // Set class on body for CSS targeting
          document.body.classList.add(`lang-${normalizedLang}`);
          document.body.dataset.language = normalizedLang;

          // Check if RTL language
          const isRtlLanguage = RTL_LANGUAGES.includes(normalizedLang);
          if (isRtlLanguage) {
            document.documentElement.dir = "rtl";
            document.body.classList.add("rtl-mode");
          }

          // Verify i18n was properly set
          // Force language in DOM
          const metaLang = document.querySelector(
            'meta[http-equiv="content-language"]'
          );
          if (metaLang) {
            metaLang.setAttribute("content", normalizedLang);
          } else {
            const newMeta = document.createElement("meta");
            newMeta.setAttribute("http-equiv", "content-language");
            newMeta.setAttribute("content", normalizedLang);
            document.head.appendChild(newMeta);
          }

          // Force localStorage and cookies for ALL languages
          try {
            localStorage.setItem("i18nextLng", normalizedLang);
            localStorage.setItem("gatsby-i18next-language", normalizedLang);
            document.cookie = `i18next=${normalizedLang};path=/`;
            document.cookie = `last_language=${normalizedLang};path=/`;
          } catch (err) {
            // Error setting storage
          }

          // Update language context if available
          if (languageContext && languageContext.setSelectedLanguage) {
            languageContext.setSelectedLanguage({
              id: normalizedLang,
              title: normalizedLang.toUpperCase(),
              URIPart: `/${normalizedLang}/`,
              isRTL: isRtlLanguage,
            });
          }
        } catch (err) {
          // Error pre-applying language
        }
      }

      // IMPORTANT: Detect and prevent URL-based path changes
      const hasLanguagePath = location.pathname.match(
        /\/[a-z]{2}\/popup-registration/
      );
      if (hasLanguagePath) {
        // URL has language path, should use query param instead
      }

      // Check if this is being loaded in a popup
      const popupMode = searchParams.get("popup") === "true";
      setIsPopupMode(popupMode);

      // Extract registration parameters
      const registrationParams = {};
      if (searchParams.get("referral_type")) {
        registrationParams.referral_type = parseInt(
          searchParams.get("referral_type"),
          10
        );
      }
      if (searchParams.get("referral_value")) {
        registrationParams.referral_value = searchParams.get("referral_value");
      }

      // CRITICAL: Check oqtima_lang_locked parameter if exists
      if (searchParams.get("oqtima_lang_locked")) {
        const lockedLang = searchParams.get("oqtima_lang_locked");
        // Always prioritize this parameter
        registrationParams.langParam = lockedLang;
        // Set global marker
        window.__OQTIMA_LANG_MUST_USE = lockedLang;
        window.__OQTIMA_LANG_SOURCE = "oqtima_lang_locked";
        window.__OQTIMA_ALLOW_FORCE_LANG = true;
        // Save to storage
        try {
          localStorage.setItem("__OQTIMA_LOCKED_LANG", lockedLang);
          localStorage.setItem(
            "__OQTIMA_LOCKED_LANG_TIME",
            Date.now().toString()
          );
        } catch (e) {
          // Error saving to localStorage
        }
      } else if (effectiveLangParam) {
        // CRITICAL: Use effectiveLangParam (not langParam) to ensure consistency
        registrationParams.langParam = effectiveLangParam;
      }

      // Detect RTL languages
      const isRtlLanguage = RTL_LANGUAGES.includes(effectiveLangParam);
      setIsRTL(isRtlLanguage);

      // Store params in state
      setParams(registrationParams);

      // Speed up transition to ready state
      setIsReady(true);
      // Notify parent window that the popup is ready
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "POPUP_READY",
            currentLanguage: registrationParams.langParam || "en",
            timestamp: Date.now(),
          },
          "*"
        );
      }
    } catch (err) {
      setError(err.message);
    }
  }, [location, i18n, languageContext]);

  // Handle popup close
  const handleClose = () => {
    if (window.parent !== window) {
      // If in an iframe, send message to parent
      window.parent.postMessage({ type: "OQTIMA_CLOSE_POPUP" }, "*");
    } else {
      // If not in an iframe, go back to previous page
      window.history.back();
    }
  };

  // Handle successful registration
  const handleRegistrationSuccess = (redirectUrl) => {
    if (window.parent !== window) {
      // If in an iframe, send message to parent
      window.parent.postMessage(
        {
          type: "OQTIMA_REGISTRATION_SUCCESS",
          redirectUrl: redirectUrl || "https://portal.oqt-ima.com",
        },
        "*"
      );
    } else {
      // Direct redirect
      window.location.href = redirectUrl || "https://portal.oqt-ima.com";
    }
  };

  // If there's an error, display it
  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error Loading Registration Popup</h2>
        <p>{error}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    );
  }

  // Listen for message events from parent iframe
  if (typeof window !== "undefined") {
    window.addEventListener(
      "message",
      (event) => {
        // Handle FORCE_LANGUAGE command
        if (
          event.data &&
          event.data.type === "FORCE_LANGUAGE" &&
          event.data.language
        ) {
          const langToUse = event.data.language.toLowerCase();

          // Check if we're allowed to force language changes
          if (window.__OQTIMA_ALLOW_FORCE_LANG) {
            // Mark that we're handling a forced language change
            window.__OQTIMA_HANDLING_FORCE = true;

            // Handle RTL languages
            if (event.data.isRTL) {
              // Apply RTL to document
              document.documentElement.classList.add("rtl-active");
              document.documentElement.setAttribute("dir", "rtl");
              document.body.classList.add("rtl-active");
              document.body.setAttribute("dir", "rtl");

              // Add RTL class to main registration container
              const registrationContainer = document.querySelector(
                ".popup-registration"
              );
              if (registrationContainer) {
                registrationContainer.classList.add("rtl-active");
                registrationContainer.setAttribute("dir", "rtl");
                registrationContainer.setAttribute("data-rtl", "true");
              }

              // Add RTL to form elements
              const formElements = document.querySelectorAll(
                "input, select, textarea, button"
              );
              if (formElements.length > 0) {
                formElements.forEach((el) => {
                  el.classList.add("rtl-element");
                  el.setAttribute("dir", "rtl");
                });
              }
            } else {
              // Remove RTL if not an RTL language
              document.documentElement.classList.remove("rtl-active");
              document.documentElement.removeAttribute("dir");
              document.body.classList.remove("rtl-active");
              document.body.removeAttribute("dir");

              const registrationContainer = document.querySelector(
                ".popup-registration"
              );
              if (registrationContainer) {
                registrationContainer.classList.remove("rtl-active");
                registrationContainer.removeAttribute("dir");
                registrationContainer.removeAttribute("data-rtl");
              }

              // Remove RTL from form elements
              const formElements = document.querySelectorAll(".rtl-element");
              if (formElements.length > 0) {
                formElements.forEach((el) => {
                  el.classList.remove("rtl-element");
                  el.removeAttribute("dir");
                });
              }
            }

            // Attempt to change language
            manuallySetLanguage(langToUse, i18n)
              .then(() => {
                window.__OQTIMA_HANDLING_FORCE = false;
              })
              .catch(() => {
                window.__OQTIMA_HANDLING_FORCE = false;
              });
          } else {
            // Language changes are locked
          }
        }
      },
      false
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta
          http-equiv="content-language"
          content={params.langParam || "en"}
        />
        <html lang={params.langParam || "en"} />
        <style>{`
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            height: 100% !important;
            width: 100% !important;
            background-color: transparent !important;
          }
          
          /* Hide all elements except the popup when in popup mode */
          ${
            isPopupMode
              ? `
          /* Hide everything by default */
          body > *:not(#___gatsby),
          #___gatsby > *:not(#gatsby-focus-wrapper),
          #gatsby-focus-wrapper > *:not([data-popup-container]) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            z-index: -9999 !important;
            pointer-events: none !important;
          }
          
          /* Reset for Gatsby wrappers */
          #___gatsby, #gatsby-focus-wrapper {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: 100vh !important;
            width: 100vw !important;
            position: static !important;
            overflow: hidden !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Ensure popup container is visible */
          [data-popup-container] {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: 100vh !important;
            width: 100vw !important;
            position: static !important;
            align-items: center !important;
            justify-content: center !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Hide any header, footer, navigation, etc. */
          header, .header, nav, .nav, footer, .footer, aside, .sidebar,
          [class*="header"], [class*="footer"], [class*="nav"], [class*="sidebar"],
          [id*="header"], [id*="footer"], [id*="nav"], [id*="sidebar"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            z-index: -9999 !important;
            pointer-events: none !important;
          }
          `
              : ""
          }
          
          /* Ensure the popup is displayed properly in the iframe */
          .popup-registration {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
            background-color: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          
          /* Make sure the popup is visible */
          .popup-registration--active {
            display: flex !important;
          }
          
          /* Full screen popup container */
          .popup-registration__container {
            margin: 0 !important;
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1000001 !important;
            background-color: transparent !important;
            box-shadow: none !important;
            border-radius: 10px !important;
            overflow-y: auto !important;
            padding: 0 !important;
            border: none !important;
          }

          /* Fix for mobile styles */
          @media screen and (max-width: 767px) {
            .popup-registration__content {
              width: 100% !important;
              border-radius: 0 0 0.625rem 0.625rem !important;
              padding: 1.875rem 1.25rem !important;
            }
            
            .popup-registration__sidebar {
              width: 100% !important;
              border-radius: 0.625rem 0.625rem 0 0 !important;
              max-height: 21.875rem !important;
            }
            
            .popup-registration__container {
              flex-direction: column !important;
              border-radius: 0.625rem !important;
            }
          }

          /* Fix for tablet styles */
          @media screen and (min-width: 768px) and (max-width: 1199px) {
            .popup-registration__content {
              padding: 2.5rem !important;
            }
          }

          /* Remove any padding from form elements */
          .popup-registration form,
          .popup-registration__form {
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Fix for popup wrapper */
          .popup-registration__wrapper {
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
        `}</style>
      </Helmet>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          margin: 0,
          padding: 0,
        }}
        data-popup-container="true"
        data-rtl={isRTL ? "true" : "false"}
        data-lang={params.langParam || "en"}
      >
        <RegistrationPopup
          isOpen={true}
          onClose={handleClose}
          params={JSON.stringify({
            ...params,
            onRegistrationSuccess: handleRegistrationSuccess,
          })}
        />
      </div>
    </>
  );
};

// Add the required GraphQL query for translations
export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default PopupRegistrationPage;
