import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import RegistrationPopup from "../components/registration-popup";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import LanguageContext from "../context/language-context";
import ClientResolverContext from "../context/client-resolver-context";
import { useRtlDirection } from "../helpers/hooks/use-rtl-direction";
import { getBcp47Lang } from "../helpers/lang.config";

// Import the styles directly
import "../assets/styles/popup-registration.scss";
import popupRegistrationBg from "../assets/images/bg/popup-registration/bg-popup-registration.svg";
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

    // Use hook for RTL detection
    // Note: This function is called outside React context, so we use manual check
    const isRTL = lang === "ar";

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
      // document.body.classList.add("rtl-active");
      // document.body.setAttribute("dir", "rtl");

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
  const [forceDesktopSidebar, setForceDesktopSidebar] = useState(false);

  useEffect(() => {
    const logSidebarState = (phase) => {
      try {
        const sidebarEl = document.querySelector(
          ".popup-registration__sidebar"
        );
        if (!sidebarEl) {
          console.warn(
            `[PopupRegistration][SidebarTrace] Sidebar element not found (${phase}).`
          );
          try {
            window.parent?.postMessage(
              {
                type: "OQTIMA_SIDEBAR_TRACE",
                phase,
                status: "missing",
              },
              "*"
            );
          } catch {}
          return;
        }

        const computed = window.getComputedStyle(sidebarEl);
        const details = {
          phase,
          offsetWidth: sidebarEl.offsetWidth,
          offsetHeight: sidebarEl.offsetHeight,
          clientWidth: sidebarEl.clientWidth,
          clientHeight: sidebarEl.clientHeight,
          computedDisplay: computed.display,
          computedVisibility: computed.visibility,
          computedOpacity: computed.opacity,
          computedBackgroundImage: computed.backgroundImage,
          computedBackgroundColor: computed.backgroundColor,
          classList: Array.from(sidebarEl.classList || []),
          dataAttributes: { ...sidebarEl.dataset },
        };
        console.log(
          "[PopupRegistration][SidebarTrace] Sidebar diagnostics",
          details
        );
        try {
          window.parent?.postMessage(
            {
              type: "OQTIMA_SIDEBAR_TRACE",
              phase,
              status: "ok",
              details,
            },
            "*"
          );
        } catch {}
      } catch (error) {
        console.warn(
          "[PopupRegistration][SidebarTrace] Failed to inspect sidebar:",
          error
        );
        try {
          window.parent?.postMessage(
            {
              type: "OQTIMA_SIDEBAR_TRACE",
              phase,
              status: "error",
              error: error?.message || String(error),
            },
            "*"
          );
        } catch {}
      }
    };

    const timers = [
      setTimeout(() => logSidebarState("post-100ms"), 100),
      setTimeout(() => logSidebarState("post-500ms"), 500),
      setTimeout(() => logSidebarState("post-1500ms"), 1500),
    ];

    logSidebarState("initial");

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // Hide live chat widget when in iframe (popup registration)
  useEffect(() => {
    const hideLiveChat = () => {
      // Select all possible live chat elements
      const liveChatSelectors = [
        "#convrs-shadow-host",
        '[id*="convrs-shadow-host"]',
        "#convrs-chat-channel-container",
        ".convrs-chat-channel-container",
        '[id*="convrs-chat-channel-container"]',
        '[class*="convrs-chat-channel-container"]',
        '[id*="convrs"]',
        '[class*="convrs"]',
      ];

      liveChatSelectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (el && el.style) {
              el.style.setProperty("display", "none", "important");
              el.style.setProperty("visibility", "hidden", "important");
              el.style.setProperty("opacity", "0", "important");
              el.style.setProperty("height", "0", "important");
              el.style.setProperty("width", "0", "important");
              el.style.setProperty("position", "absolute", "important");
              el.style.setProperty("top", "-9999px", "important");
              el.style.setProperty("left", "-9999px", "important");
              el.style.setProperty("z-index", "-9999", "important");
              el.style.setProperty("pointer-events", "none", "important");
            }
          });
        } catch (e) {
          // Ignore errors
        }
      });
    };

    // Hide immediately
    hideLiveChat();

    // Also hide after a short delay to catch elements that load later
    const timeout1 = setTimeout(hideLiveChat, 100);
    const timeout2 = setTimeout(hideLiveChat, 500);
    const timeout3 = setTimeout(hideLiveChat, 1000);
    const timeout4 = setTimeout(hideLiveChat, 2000);

    // Use MutationObserver to hide any live chat elements that appear later
    const observer = new MutationObserver(() => {
      hideLiveChat();
    });

    if (typeof document !== "undefined") {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      observer.disconnect();
    };
  }, []);

  // Prevent language routing redirects for popup
  useEffect(() => {
    // Disable routing redirects for popup pages
    const disableRouting = () => {
      if (typeof window !== "undefined" && window.___navigate) {
        window.___navigate = () => {};
      }
    };
    disableRouting();

    // CRITICAL: Check if popup is in isolated mode
    const urlParams = new URLSearchParams(window.location.search);
    const isPopupIsolated =
      urlParams.get("popup_isolated") === "true" ||
      urlParams.get("prevent_lang_switch") === "true";

    if (isPopupIsolated) {
      // Set isolation flag
      window.__POPUP_IS_ISOLATED = true;
      console.log(
        "[Popup Registration] Running in isolated mode - language switching disabled"
      );

      // CRITICAL FIX: Use sessionStorage for popup isolation instead of overriding localStorage
      // localStorage is read-only in modern browsers, so we use sessionStorage instead
      const popupSpecificStorage = {};

      // Set the popup language immediately in isolated storage
      const popupLanguage =
        urlParams.get("language") ||
        urlParams.get("lang") ||
        urlParams.get("langParam") ||
        urlParams.get("data-lang") ||
        "en";

      // Store in sessionStorage for this popup session (this is isolated per tab)
      sessionStorage.setItem("popup_isolated_language", popupLanguage);
      sessionStorage.setItem("popup_i18nextLng", popupLanguage);
      sessionStorage.setItem("popup_gatsby-i18next-language", popupLanguage);

      // CRITICAL: Override parent language completely
      sessionStorage.setItem("oqtima_parent_lang", popupLanguage);
      sessionStorage.setItem("oqtima_parent_dir", "ltr"); // Default, will be set by popup if RTL

      // Store in popup-specific in-memory storage for quick access
      popupSpecificStorage["i18nextLng"] = popupLanguage;
      popupSpecificStorage["gatsby-i18next-language"] = popupLanguage;

      console.log(
        `[Popup Registration] Isolated popup language set to: ${popupLanguage}`
      );
      console.log(
        `[Popup Registration] Parent language overridden to: ${popupLanguage}`
      );
    }

    const handleMessage = (event) => {
      try {
        if (event.data && typeof event.data === "object") {
          // Handle force language command - only if not isolated or if explicitly allowed
          if (event.data.type === "FORCE_LANGUAGE" && event.data.language) {
            // Check if we're isolated and this is not an allowed change
            if (isPopupIsolated && !event.data.isolated) {
              console.warn(
                "[Popup Protection] Ignoring external language change request while in isolated mode"
              );
              return;
            }

            const forcedLang = event.data.language.toLowerCase();

            // Check if this change should be respected based on URL params
            const currentLangParam = effectiveLangParam || "en";
            if (currentLangParam !== "en" && forcedLang === "en") {
              console.warn(
                `[Popup Protection] Ignoring attempt to force English when URL expects ${currentLangParam}`
              );
              return;
            } else {
              // Either no URL param constraint exists OR override/forceApply is true
              window.__OQTIMA_LANG_MUST_USE = forcedLang;
              window.__OQTIMA_LANG_SOURCE = "forced_message";

              // Store the language in localStorage to maintain consistency - only if not isolated
              if (!isPopupIsolated) {
                try {
                  localStorage.setItem(
                    "__OQTIMA_ORIGINAL_LANGUAGE",
                    forcedLang
                  );
                  localStorage.setItem(
                    "__OQTIMA_SELECTED_LANGUAGE",
                    forcedLang
                  );
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
            }
          }

          // Handle registration parameters
          if (event.data.type === "REGISTRATION_PARAMS" && event.data.data) {
            const messageData = event.data.data;

            // If this is an isolated popup, prioritize isolation parameters
            if (messageData.popup_isolated === "true" || messageData.isolated) {
              console.log("[Popup Registration] Received isolated parameters");
              window.__POPUP_IS_ISOLATED = true;

              // Use the isolated language parameters
              if (
                messageData.language ||
                messageData.lang ||
                messageData.langParam
              ) {
                const isolatedLang =
                  messageData.language ||
                  messageData.lang ||
                  messageData.langParam;
                window.__ISOLATED_POPUP_LANGUAGE = isolatedLang;

                // Only set necessary session storage for iframe, don't affect parent
                try {
                  sessionStorage.setItem(
                    "popup_isolated_language",
                    isolatedLang
                  );
                  sessionStorage.setItem("prevent_lang_switch", "true");
                } catch (e) {
                  // Ignore storage errors
                }
              }
            }

            // Handle storage keys with isolation awareness
            if (messageData.storeInSessionStorage && messageData.storageKeys) {
              messageData.storageKeys.forEach((item) => {
                if (item.key && item.value !== undefined) {
                  try {
                    // Only set global language keys if not isolated
                    if (
                      isPopupIsolated &&
                      (item.key === "i18nextLng" ||
                        item.key === "gatsby-i18next-language" ||
                        item.key === "oqtima_tab_language")
                    ) {
                      // Use popup-specific keys instead
                      sessionStorage.setItem(`popup_${item.key}`, item.value);
                    } else {
                      sessionStorage.setItem(item.key, item.value);
                    }
                  } catch (e) {
                    console.warn(
                      "[Popup Registration] Failed to set storage item:",
                      item.key
                    );
                  }
                }
              });
            }

            // Set global variables from message data
            if (messageData.language)
              window.__OQTIMA_LANGUAGE__ = messageData.language;
            if (messageData.referral_type)
              window.__OQTIMA_REFERRAL_TYPE__ = messageData.referral_type;
            if (messageData.referral_value)
              window.__OQTIMA_REFERRAL_VALUE__ = messageData.referral_value;
            if (typeof messageData.forceSidebar !== "undefined") {
              setForceDesktopSidebar(Boolean(messageData.forceSidebar));
            }

            // Send confirmation back to parent
            window.parent.postMessage(
              {
                type: "REGISTRATION_PARAMS_RECEIVED",
                timestamp: Date.now(),
                isolated: isPopupIsolated,
              },
              "*"
            );
          }
        }
      } catch (error) {
        console.error("[Popup Registration] Error handling message:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    try {
      // Enhanced parameter extraction with isolation awareness
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash ? window.location.hash.substring(1) : ""
      );

      // Language parameter extraction with isolation priority
      let effectiveLangParam = "en";

      // First check for isolated language parameters
      if (isPopupIsolated) {
        // Check isolated-specific parameters first
        effectiveLangParam =
          searchParams.get("language") ||
          searchParams.get("lang") ||
          searchParams.get("langParam") ||
          searchParams.get("data-lang") ||
          hashParams.get("lang") ||
          "en";

        console.log(
          "[Popup Registration] Using isolated language:",
          effectiveLangParam
        );
      } else {
        // Standard language detection
        effectiveLangParam =
          getLanguageFromHash() ||
          searchParams.get("language") ||
          searchParams.get("lang") ||
          searchParams.get("langParam") ||
          searchParams.get("data-lang") ||
          hashParams.get("lang") ||
          "en";
      }

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

      const forceSidebarParam = searchParams.get("force_sidebar");
      if (forceSidebarParam === "true") {
        setForceDesktopSidebar(true);
      } else if (forceSidebarParam === "false") {
        setForceDesktopSidebar(false);
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
        // Save to storage only if not isolated
        if (!isPopupIsolated) {
          try {
            localStorage.setItem("__OQTIMA_LOCKED_LANG", lockedLang);
            localStorage.setItem(
              "__OQTIMA_LOCKED_LANG_TIME",
              Date.now().toString()
            );
          } catch (e) {
            // Error saving to localStorage
          }
        }
      } else if (effectiveLangParam) {
        // CRITICAL: Use effectiveLangParam (not langParam) to ensure consistency
        registrationParams.langParam = effectiveLangParam;
      }

      // Detect RTL languages
      const isRtlLanguage = effectiveLangParam === "ar";
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
            isolated: isPopupIsolated,
          },
          "*"
        );
      }
    } catch (err) {
      setError(err.message);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
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
              // document.body.classList.add("rtl-active");
              // document.body.setAttribute("dir", "rtl");

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
              // document.body.classList.remove("rtl-active");
              // document.body.removeAttribute("dir");

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
        <html lang={getBcp47Lang(params.langParam || "en")} />
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
            display: flex !important;
            gap: 20px !important;
          }

          .popup-registration__container[data-force-sidebar="true"] .popup-registration__sidebar {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 331px !important;
            min-width: 331px !important;
            flex-shrink: 0 !important;
            background-image: url("${popupRegistrationBg}") !important;
            background-repeat: no-repeat !important;
            background-position: center center !important;
            background-size: cover !important;
          }

          .popup-registration__container[data-force-sidebar="true"] .popup-registration__content {
            width: 615px !important;
            flex: 1 !important;
          }
          
          /* Desktop: Ensure sidebar is visible */
          @media screen and (min-width: 1024px) {
            .popup-registration__container {
              max-width: 966px !important;
              min-width: 966px !important;
            }
            
            .popup-registration__sidebar {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 331px !important;
              min-width: 331px !important;
              flex-shrink: 0 !important;
              height: 100% !important;
              background-image: url("${popupRegistrationBg}") !important;
              background-repeat: no-repeat !important;
              background-position: center center !important;
              background-size: cover !important;
            }
            
            .popup-registration__content {
              width: 615px !important;
              flex: 1 !important;
            }
          }
          
          /* Tablet: Content should be 100% width, no sidebar */
          @media screen and (min-width: 768px) and (max-width: 1023px) {
            .popup-registration__container {
              width: 100% !important;
              max-width: 100% !important;
            }
            
            .popup-registration__content {
              width: 100% !important;
              max-width: 100% !important;
            }
            
            .popup-registration__sidebar {
              display: block !important;
              visibility: visible !important;
            }
          }

          /* Fix for mobile styles - ensure content is 100% width */
          @media screen and (max-width: 767px) {
            .popup-registration__container {
              width: 100% !important;
              max-width: 100% !important;
            }
            
            .popup-registration__content {
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 20px !important;
              // padding: 20px !important;
              min-height: 100vh !important;
              height: 100vh !important;
            }
            
            .popup-registration__sidebar {
              display: none !important;
            }
          }

          /* Fix for tablet styles */
          // @media screen and (min-width: 768px) and (max-width: 1199px) {
          //   .popup-registration__content {
          //     padding: 2.5rem !important;
          //   }
          // }

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
          
          /* Hide live chat widget in popup registration iframe */
          #convrs-shadow-host,
          [id*="convrs-shadow-host"],
          #convrs-chat-channel-container,
          .convrs-chat-channel-container,
          [id*="convrs-chat-channel-container"],
          [class*="convrs-chat-channel-container"],
          [id*="convrs"],
          [class*="convrs"] {
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
            forceSidebar: forceDesktopSidebar,
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
