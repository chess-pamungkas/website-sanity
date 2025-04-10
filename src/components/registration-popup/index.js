import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PopupRegistration from "../shared/popup-registration";

const RegistrationPopup = ({ isOpen, onClose, params }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(isOpen); // Manage the popup state
  // Add state to track language loading
  const [languageLoaded, setLanguageLoaded] = useState(false);

  // Parse params back to an object if needed with enhanced logging
  let parsedParams = {};
  try {
    if (params) {
      if (typeof params === "string") {
        parsedParams = JSON.parse(params);
      } else {
        // If already an object, use directly
        parsedParams = params;
      }
    }
  } catch (error) {
    parsedParams = {}; // Fallback to empty object
  }

  useEffect(() => {
    // CRITICAL: Set strict language mode
    if (typeof window !== "undefined") {
      window.STRICT_LANGUAGE_MODE = true;

      // Check if there's a language that must be used from URL
      if (window.__OQTIMA_LANG_MUST_USE) {
        // Override language parameter with the language that must be used
        if (parsedParams.langParam !== window.__OQTIMA_LANG_MUST_USE) {
          parsedParams.langParam = window.__OQTIMA_LANG_MUST_USE;
        }
      }
      // Check if there's a locked language
      else if (localStorage.getItem("__OQTIMA_LOCKED_LANG")) {
        const lockedLang = localStorage.getItem("__OQTIMA_LOCKED_LANG");

        // Make sure language in parameter matches the locked language
        if (parsedParams.langParam && parsedParams.langParam !== lockedLang) {
          // Override language parameter with locked language
          parsedParams.langParam = lockedLang;

          // Set global markers for consistency
          window.__OQTIMA_LANG_MUST_USE = lockedLang;
          window.__OQTIMA_LANG_SOURCE = "localStorage";
          window.__OQTIMA_ALLOW_FORCE_LANG = true;
        }
      }
    }

    // CRITICAL: Check and set langParam language if present
    if (parsedParams.langParam) {
      // Ensure global marker is set
      if (typeof window !== "undefined" && !window.__OQTIMA_LANG_MUST_USE) {
        window.__OQTIMA_LANG_MUST_USE = parsedParams.langParam;
        window.__OQTIMA_LANG_SOURCE = "component_params";
        window.__OQTIMA_ALLOW_FORCE_LANG = true;
      }
    } else if (window.__OQTIMA_LANG_MUST_USE) {
      // If no langParam but OQTIMA_LANG_MUST_USE exists, use that
      parsedParams.langParam = window.__OQTIMA_LANG_MUST_USE;
    } else {
      parsedParams.langParam = "en";

      // Set storage value for consistency
      if (typeof window !== "undefined") {
        window.__OQTIMA_ALLOW_FORCE_LANG = true;
        try {
          localStorage.setItem("__OQTIMA_COMPONENT_LANGUAGE", "en");
        } catch (e) {}
      }
    }

    // CRITICAL FIX: Ensure language is applied at component mount
    if (parsedParams.langParam && !languageLoaded) {
      // Normalize language code
      const langCode = String(parsedParams.langParam).toLowerCase().trim();

      // Language locking mechanism
      const enableLanguageLock = () => {
        // CRITICAL: Set i18next language and state directly
        if (window.i18next) {
          try {
            // Force direct change
            window.i18next.changeLanguage(langCode);

            // Force language in DOM directly
            document.documentElement.lang = langCode;
            document.documentElement.setAttribute("lang", langCode);

            // Flag to prevent default language detection
            window.__OQTIMA_DIRECT_LANGUAGE_SET = true;
          } catch (e) {
            // Error handling
          }
        }

        // Save to localStorage for persistence
        try {
          localStorage.setItem("__OQTIMA_COMPONENT_LANGUAGE", langCode);
          localStorage.setItem(
            "__OQTIMA_COMPONENT_LANGUAGE_TIME",
            Date.now().toString()
          );

          // Save to standard i18next items as well
          localStorage.setItem("i18nextLng", langCode);
          localStorage.setItem("gatsby-i18next-language", langCode);

          // Cookies
          document.cookie = `i18next=${langCode};path=/`;
          document.cookie = `last_language=${langCode};path=/`;
        } catch (e) {
          // Error handling
        }

        // Override i18next methods to prevent language changes
        if (window.i18next) {
          // IMPORTANT: Check if there's a language that must be used from URL
          const finalLangCode = window.__OQTIMA_LANG_MUST_USE || langCode;

          // Save original function for later restoration
          window.__ORIGINAL_I18NEXT_DETECT_FUNCTION =
            window.i18next.services?.languageDetector?.detect;

          if (window.i18next.services?.languageDetector) {
            window.i18next.services.languageDetector.detect = function () {
              return finalLangCode; // Always return the language we want
            };
          }

          // Force i18next object property
          window.__ORIGINAL_I18NEXT_LANGUAGE = window.i18next.language;
          Object.defineProperty(window.i18next, "language", {
            get: function () {
              return finalLangCode;
            },
            set: function (val) {
              // Don't change the value
            },
            configurable: true,
          });

          // Override changeLanguage method
          window.__ORIGINAL_I18NEXT_CHANGE_FUNCTION =
            window.i18next.changeLanguage;
          window.i18next.changeLanguage = function (lng, ...args) {
            if (lng === finalLangCode) {
              return window.__ORIGINAL_I18NEXT_CHANGE_FUNCTION.call(
                window.i18next,
                lng,
                ...args
              );
            }

            // Allow changes if explicitly permitted
            if (window.__OQTIMA_ALLOW_FORCE_LANG) {
              return window.__ORIGINAL_I18NEXT_CHANGE_FUNCTION.call(
                window.i18next,
                lng,
                ...args
              );
            }

            return window.i18next; // Return instance without changing
          };
        }
      };

      try {
        enableLanguageLock();
        setLanguageLoaded(true);
      } catch (e) {
        // Fallback error handling to prevent component crash
      }
    }

    // Set language for specific DOM elements if language has been specified
    if (parsedParams.langParam) {
      try {
        document.documentElement.lang = parsedParams.langParam;
        document.documentElement.setAttribute("lang", parsedParams.langParam);
        if (parsedParams.langParam === "ar") {
          document.documentElement.dir = "rtl";
          document.body.dir = "rtl";
          // Arabic language
          const rtlStyle = document.createElement("style");
          rtlStyle.id = "oqtima-rtl-language-style";
          rtlStyle.textContent = `
            body, html {
              direction: rtl !important;
            }
            .popup-registration--rtl {
              direction: rtl !important;
            }
          `;
          document.head.appendChild(rtlStyle);

          // Set langParam to ensure consistent RTL handling
          if (!parsedParams.isRTL) {
            parsedParams.isRTL = true;
          }
        }
      } catch (e) {
        // Handle error without crashing
      }
    }

    // Effect to open popup and set body class
    if (isOpen) {
      // Apply scroll blocking
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Apply language-specific classes based on language parameter
      if (parsedParams.langParam) {
        document.body.classList.add(`lang-${parsedParams.langParam}`);
      }

      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }

    // Cleanup when component unmounts
    return () => {
      // Reset body overflow
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Remove language-specific classes
      if (parsedParams.langParam) {
        document.body.classList.remove(`lang-${parsedParams.langParam}`);
      }

      // Remove any RTL-specific styles
      const rtlStyleElement = document.getElementById(
        "oqtima-rtl-language-style"
      );
      if (rtlStyleElement) {
        rtlStyleElement.remove();
      }

      // Restore original i18next detect function if it was saved
      if (
        window.i18next &&
        window.i18next.services?.languageDetector &&
        window.__ORIGINAL_I18NEXT_DETECT_FUNCTION
      ) {
        window.i18next.services.languageDetector.detect =
          window.__ORIGINAL_I18NEXT_DETECT_FUNCTION;
        delete window.__ORIGINAL_I18NEXT_DETECT_FUNCTION;
      }

      // Restore original i18next language property if it was saved
      if (window.i18next && window.__ORIGINAL_I18NEXT_LANGUAGE !== undefined) {
        delete Object.getOwnPropertyDescriptor(window.i18next, "language");
        window.i18next.language = window.__ORIGINAL_I18NEXT_LANGUAGE;
        delete window.__ORIGINAL_I18NEXT_LANGUAGE;
      }

      // Restore original i18next changeLanguage function if it was saved
      if (
        window.i18next &&
        window.__ORIGINAL_I18NEXT_CHANGE_FUNCTION !== undefined
      ) {
        window.i18next.changeLanguage =
          window.__ORIGINAL_I18NEXT_CHANGE_FUNCTION;
        delete window.__ORIGINAL_I18NEXT_CHANGE_FUNCTION;
      }

      delete window.__OQTIMA_DIRECT_LANGUAGE_SET;
      delete window.__OQTIMA_LANG_MUST_USE;
      delete window.__OQTIMA_LANG_SOURCE;

      // Allow language change after component unmounts
      window.__OQTIMA_ALLOW_FORCE_LANG = false;
    };
  }, [isOpen, languageLoaded, parsedParams.langParam]);

  const handleClose = () => {
    // First reset the scroll blocking
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    setIsPopupOpen(false);
    onClose(); // Call the onClose function passed as a prop
  };

  if (!isPopupOpen) return null;

  return (
    <>
      {/* Render the PopupRegistration component */}
      <PopupRegistration
        isOpen={isPopupOpen}
        onClose={handleClose}
        params={parsedParams} // Pass the parsed params to PopupRegistration
      />
    </>
  );
};

RegistrationPopup.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  params: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

RegistrationPopup.defaultProps = {
  isOpen: false,
  onClose: () => {},
  params: {},
};

export default RegistrationPopup;
