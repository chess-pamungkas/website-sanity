/**
 * @fileoverview OQtima Registration Popup Script
 *
 * This script provides registration popup functionality for OQtima landing pages.
 * It handles creating registration buttons, opening the popup using an iframe,
 * and ensures consistent display and styling for both RTL and non-RTL languages.
 *
 * Integration Options:
 *
 * 1. Recommended Method: Add trigger attributes to your buttons or links
 *    This method allows you to use your existing UI elements to trigger the registration popup.
 *
 *    Example with button:
 *    <button data-oqtima-trigger data-lang="en" data-referral-type="14" data-referral-value="CAMPAIGN2023">
 *      Join Campaign
 *    </button>
 *
 *    Example with link:
 *    <a href="#" data-oqtima-trigger data-lang="en" data-referral-type="12" data-referral-value="IB08801328I">
 *      Register with IB
 *    </a>
 *
 *    Parameters:
 *    - data-oqtima-trigger: Required to mark this element as a registration trigger
 *    - data-lang: Language code (en, fr, br, vn, th, es, it, cn, zh, id, jp, my, ar) - Required
 *    - data-referral-type: Numeric type of referral (optional)
 *      12 = IB Referral Link
 *      14 = Campaign Link
 *    - data-referral-value: Value/ID for the referral (optional)
 *
 * 2. Legacy Method (Deprecated): Add a container for auto-generated button
 *    <div data-oqtima-register data-text="OPEN FREE ACCOUNT" data-lang="en"></div>
 *
 * @version 1.5.0
 */

"use strict";

// Declare urlParams at the top to avoid reference errors later
const urlParams = new URLSearchParams(window.location.search);

// Define RTL languages constants
const RTL_LANGUAGES = ["ar"];

// Wrap everything in a single IIFE to share scope across all functions
(function () {
  // Create a namespace to expose functions globally
  window.OqtimaRegistration = {};

  // Base URL for backend API
  let backendApiUrl = "";

  // API URL and Environment mapping based on hostname
  const getApiUrlFromHostname = () => {
    // Try to find the script element that loaded this script
    try {
      const scripts = document.getElementsByTagName("script");
      const registrationScript = Array.from(scripts).find((script) =>
        script.src.includes("registration-popup-script.js")
      );

      if (registrationScript && registrationScript.src) {
        // Extract the origin and path from the script src
        const scriptUrl = new URL(registrationScript.src);
        const baseUrl = `${scriptUrl.origin}/`;
        return baseUrl;
      }
    } catch (e) {
      console.warn("[OQtima] Error determining API URL from script:", e);
    }

    // Fallback logic if script element cannot be found or URL parsing fails
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // For file:// protocol, use localhost
    if (protocol === "file:") {
      return "http://localhost:8000/";
    }

    // For local development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8000/";
    }

    // For development environment
    if (hostname === "dev.oqt-ima.com") {
      return "https://dev.oqt-ima.com/";
    }

    // For staging environment
    if (hostname === "test.oqt-ima.com") {
      return "https://test.oqt-ima.com/";
    }

    // For production environment
    if (
      hostname === "oqtima.com" ||
      hostname === "lp.oqtima.com" ||
      hostname === "www.oqtima.com"
    ) {
      return "https://oqtima.com/";
    }

    // For any other domain, use the current origin as the API URL
    return `${window.location.origin}/`;
  };

  // Map frontend hostname to backend API server URL
  const mapBackendApiUrl = () => {
    // Try to determine backend API URL from script source
    try {
      const scripts = document.getElementsByTagName("script");
      const scriptPatterns = [
        "registration-popup-script.js",
        "registration-popup-script.min.js",
      ];

      const registrationScript = Array.from(scripts).find((script) => {
        const src = script.src || "";
        return scriptPatterns.some((pattern) => src.includes(pattern));
      });

      if (registrationScript && registrationScript.src) {
        // Extract the origin from the script src
        const scriptUrl = new URL(registrationScript.src);
        const scriptOrigin = scriptUrl.origin;

        // If script is served from the frontend, map to corresponding backend
        if (
          scriptOrigin.includes("localhost") ||
          scriptOrigin.includes("127.0.0.1")
        ) {
          return "http://localhost:3000/";
        }

        if (scriptOrigin.includes("dev.oqt-ima.com")) {
          return "https://dev-back.oqt-ima.com/";
        }

        if (scriptOrigin.includes("test.oqt-ima.com")) {
          return "https://back.oqt-ima.com/";
        }

        if (scriptOrigin.includes("oqtima.com")) {
          return "https://back.oqtima.com/";
        }

        // For custom domains, try to derive a backend URL
        try {
          const scriptUrlObj = new URL(scriptOrigin);
          if (scriptUrlObj.hostname.includes(".")) {
            const parts = scriptUrlObj.hostname.split(".");
            // If already has subdomain, replace it with 'back'
            if (parts.length > 2) {
              parts[0] = "back";
              return `${scriptUrlObj.protocol}//${parts.join(".")}/`;
            }
            // Otherwise add 'back' subdomain
            else {
              return `${scriptUrlObj.protocol}//back.${scriptUrlObj.hostname}/`;
            }
          }
        } catch (e) {
          console.warn(
            "[OQtima] Error constructing backend URL from script origin:",
            e
          );
        }
      }
    } catch (e) {
      console.warn(
        "[OQtima] Error determining backend API URL from script:",
        e
      );
    }

    // Fallback logic based on hostname if script detection fails
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;

    // For file:// protocol, use localhost with explicit protocol
    if (protocol === "file:") {
      return "http://localhost:3000/";
    }

    // For local development with standard ports
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // MODIFIED: Ensure proper handling of localhost with port 80 (standard HTTP port)
      // which is typically hidden in the URL but still needs the backend on port 3000
      if (port === "8000" || port === "80" || port === "") {
        return "http://localhost:3000/";
      }
      // For other ports, assume the backend is on the same port
      else if (port) {
        return `http://localhost:${port}/`;
      }
      return "http://localhost:3000/";
    }

    // Map to corresponding backend API servers
    if (hostname === "dev.oqt-ima.com") {
      return "https://dev-back.oqt-ima.com/";
    }

    if (hostname === "test.oqt-ima.com") {
      return "https://back.oqt-ima.com/";
    }

    if (
      hostname === "oqtima.com" ||
      hostname === "lp.oqtima.com" ||
      hostname === "www.oqtima.com"
    ) {
      return "https://back.oqtima.com/";
    }

    // Default fallback for unknown domains
    console.warn(
      "[OQtima] Could not determine backend API URL from hostname or script, using default"
    );
    return "https://dev-back.oqt-ima.com/";
  };

  const getEnvironmentFromHostname = () => {
    // Try to determine environment from script source
    try {
      const scripts = document.getElementsByTagName("script");
      const scriptPatterns = [
        "registration-popup-script.js",
        "registration-popup-script.min.js",
      ];

      const registrationScript = Array.from(scripts).find((script) => {
        const src = script.src || "";
        return scriptPatterns.some((pattern) => src.includes(pattern));
      });

      if (registrationScript && registrationScript.src) {
        // Extract the origin from the script src
        const scriptUrl = new URL(registrationScript.src);
        const scriptOrigin = scriptUrl.origin;

        // Determine environment based on script source domain
        if (
          scriptOrigin.includes("localhost") ||
          scriptOrigin.includes("127.0.0.1")
        ) {
          return "development";
        }

        if (scriptOrigin.includes("dev.oqt-ima.com")) {
          return "development";
        }

        if (scriptOrigin.includes("test.oqt-ima.com")) {
          return "staging";
        }

        if (scriptOrigin.includes("oqtima.com")) {
          return "production";
        }
      }
    } catch (e) {
      console.warn("[OQtima] Error determining environment from script:", e);
    }

    // Fallback logic based on hostname if script detection fails
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Handle local file access or empty hostname
    if (protocol === "file:" || !hostname) {
      return "development";
    }

    // For local development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "development";
    }

    // For development environment
    if (hostname === "dev.oqt-ima.com") {
      return "development";
    }

    // For staging environment
    if (hostname === "test.oqt-ima.com") {
      return "staging";
    }

    // For production environment
    if (
      hostname === "oqtima.com" ||
      hostname === "lp.oqtima.com" ||
      hostname === "www.oqtima.com"
    ) {
      return "production";
    }

    // For unknown domains, default to development
    console.warn(
      "[OQtima] Could not determine environment, defaulting to development"
    );
    return "development";
  };

  // Set API URL and Environment based on hostname
  const apiUrl = getApiUrlFromHostname();
  backendApiUrl = mapBackendApiUrl();
  const environment = getEnvironmentFromHostname();

  // Track validation status
  let isValidated = false;

  // Store document RTL state
  const documentRTLState = {
    originalHtmlDir: null,
    originalBodyDir: null,
    originalHtmlLang: null,
    originalHtmlRtl: null,
    originalBodyRtl: null,
    originalHtmlClasses: null,
    originalBodyClasses: null,
  };

  /**
   * Initialize Oqtima Registration
   */
  async function initOqtimaRegistration() {
    try {
      // Get the API key from the script tag
      const { apiKey } = await getApiKey();

      // API key is always required - no bypass possible
      if (!apiKey) {
        showAuthError(
          "API key is missing. Add data-api-key attribute to the script tag."
        );
        return;
      }

      try {
        // Make API call to verify the key
        const isValid = await verifyApiKey(apiKey);

        if (isValid) {
          isValidated = true;
          initRegistrationComponents();
        } else {
          // Removed special case for development environments

          showAuthError(
            "Invalid API key. Registration button will not be displayed."
          );
        }
      } catch (verifyError) {
        // Additional error handling for verification failures
        console.error("[OQtima] Verification process error:", verifyError);

        // Removed auto-bypass for development environments

        showAuthError(
          `Error during API key verification: ${verifyError.message}`
        );
      }
    } catch (error) {
      console.error("[OQtima] Initialization error:", error.message);
      showAuthError("Registration initialization error: " + error.message);
    }
  }

  /**
   * Get API key from script tag
   */
  async function getApiKey() {
    try {
      const scripts = document.getElementsByTagName("script");
      // Find script tag that includes our script (regular or minified version)
      const scriptPatterns = [
        "registration-popup-script.js",
        "registration-popup-script.min.js",
      ];

      const currentScript = Array.from(scripts).find((script) => {
        const src = script.src || "";
        return scriptPatterns.some((pattern) => src.includes(pattern));
      });

      if (!currentScript) {
        console.warn("[OQtima] Script tag not found");
        return { apiKey: null };
      }

      // Get API key from attribute
      const apiKey = currentScript.getAttribute("data-api-key");

      return { apiKey };
    } catch (error) {
      console.error("[OQtima] Error retrieving API key:", error);
      return { apiKey: null };
    }
  }

  /**
   * Verify API key with backend API server
   */
  async function verifyApiKey(apiKey) {
    try {
      // Determine backend API URL for verification endpoint
      const verifyEndpoint = `${backendApiUrl}verify-api-key`;

      // MODIFIED: Add better error handling and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      // Make POST request to verification endpoint with improved options
      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest", // Help identify AJAX requests
          Origin: window.location.origin, // Explicitly set origin header
        },
        body: JSON.stringify({ apiKey }),
        credentials: "same-origin",
        mode: "cors", // Explicitly request CORS mode
        signal: controller.signal,
        cache: "no-cache",
      }).finally(() => clearTimeout(timeoutId));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[OQtima] API key verification failed: ${response.status} ${errorText}`
        );
        return false;
      }

      const data = await response.json();
      return data.isValid === true;
    } catch (error) {
      // MODIFIED: Special handling for "Failed to fetch" errors which often
      // indicate network issues, CORS problems, or server unavailability
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        console.error(
          "[OQtima] Network error verifying API key. This may indicate:",
          "\n1. The backend server is not running or unreachable",
          "\n2. CORS policy blocking the request",
          "\n3. Network connectivity issues"
        );

        // REMOVED auto-bypass for development environments
        // Always return false to require proper verification
      }

      console.error("[OQtima] Error verifying API key:", error);
      return false;
    }
  }

  /**
   * Show authentication error message
   */
  function showAuthError(message) {
    console.warn("[OQtima] Authentication error:", message);

    // Find all legacy registration button containers
    const containers = document.querySelectorAll("[data-oqtima-register]");

    // Replace each container with an error message for developers
    containers.forEach((container) => {
      // Only show errors in console in production, but show in container during development
      if (environment === "development") {
        container.innerHTML = `
          <div style="
            padding: 10px; 
            border: 1px solid #ff4400; 
          border-radius: 4px;
            color: #ff4400; 
            font-family: monospace; 
            font-size: 12px;
            background-color: rgba(255, 68, 0, 0.1);
            text-align: left;
          ">
            <strong>OQtima Registration Error:</strong><br>
            ${message}<br>
          <small>(This error is only visible in development mode)</small>
          </div>
        `;
      } else {
        // In production, just hide the containers
        container.style.display = "none";
      }
    });

    // Also show warning on trigger elements in development mode
    if (environment === "development") {
      const triggerElements = document.querySelectorAll(
        "[data-oqtima-trigger]"
      );
      triggerElements.forEach((element) => {
        // Add visual indication that there's an error
        element.style.border = "1px solid #ff4400";
        element.title = `OQtima Registration Error: ${message}`;

        // Disable the trigger by removing the event listener and adding one that shows an alert
        const elementClone = element.cloneNode(true);
        element.parentNode.replaceChild(elementClone, element);

        elementClone.addEventListener("click", function (event) {
          event.preventDefault();
          alert(
            `OQtima Registration Error: ${message}\n\nAPI key validation failed. Please check your implementation.`
          );
        });
      });
    }
  }

  /**
   * Initialize registration components
   */
  function initRegistrationComponents() {
    // Add global styles
    addStyles();

    // IMPORTANT: First check for and set up trigger elements
    // This is the recommended approach
    setupTriggerElements();

    // LEGACY SUPPORT: Then check for registration containers
    // This approach is deprecated
    const registrationContainers = document.querySelectorAll(
      "[data-oqtima-register]"
    );
    if (registrationContainers.length > 0) {
      console.warn(
        "[OQtima] Using legacy registration container approach." +
          "\nThis approach is deprecated. Please use data-oqtima-trigger attribute on buttons, links, or any clickable elements instead." +
          "\nExample: <a href='#' data-oqtima-trigger data-lang='en' data-referral-type='14' data-referral-value='YOUR_CAMPAIGN_ID'>Register Now</a>"
      );

      // Add loading state to all buttons
      addLoadingStateToButtons(registrationContainers);
    }

    // NEW: Set up global click handler for maximum compatibility
    // This will detect and handle clicks on registration-related buttons and links
    // even without the data-oqtima-trigger attribute
    setupGlobalClickHandler();
  }

  /**
   * Find and setup elements with data-oqtima-trigger attribute
   * This allows using existing buttons, links, or other elements to trigger the registration popup
   */
  function setupTriggerElements() {
    // Find all elements with data-oqtima-trigger attribute
    const triggerElements = document.querySelectorAll("[data-oqtima-trigger]");

    if (triggerElements.length === 0) {
      return;
    }

    // Detect page language
    let detectedLanguage = "en";
    try {
      // Check from various sources in priority order
      if (sessionStorage.getItem("oqtima_tab_language")) {
        detectedLanguage = sessionStorage.getItem("oqtima_tab_language");
      } else if (document.documentElement.lang) {
        detectedLanguage = document.documentElement.lang.toLowerCase();
      } else if (window.location.pathname) {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        if (
          pathParts.length > 0 &&
          /^[a-z]{2}(-[a-z]{2})?$/.test(pathParts[0])
        ) {
          detectedLanguage = pathParts[0].toLowerCase();
        }
      }
    } catch (e) {
      console.warn("[OQtima] Error detecting page language:", e);
    }

    // Add event listeners to each trigger element
    triggerElements.forEach((element) => {
      // Extract registration parameters from data attributes, use detected language as fallback
      const lang = element.getAttribute("data-lang") || detectedLanguage;

      // Set the language attribute if not already set
      if (!element.hasAttribute("data-lang")) {
        element.setAttribute("data-lang", lang);
      }

      let referralType = element.getAttribute("data-referral-type");
      const referralValue = element.getAttribute("data-referral-value");

      // Convert referral_type to integer if it's numeric
      if (referralType) {
        const parsedType = parseInt(referralType, 10);
        if (!isNaN(parsedType)) {
          referralType = parsedType;
        } else {
          console.warn(
            "[OQtima] data-referral-type is not a valid integer:",
            referralType
          );
        }
      }

      const elementType = element.tagName.toLowerCase();

      // Check if lang attribute is set (it's required)
      if (!element.hasAttribute("data-lang")) {
        console.warn(
          `[OQtima] Missing required data-lang attribute on trigger element:`,
          element
        );
        if (environment === "development") {
          // Add a subtle warning indicator in development mode
          element.style.border = "1px dotted #ff4400";
          element.title =
            "Missing required data-lang attribute for Oqtima registration popup";
        }
      }

      // Visually indicate the element is clickable if it doesn't already have obvious styles
      if (elementType !== "button" && elementType !== "a") {
        element.style.cursor = "pointer";

        // Add a subtle hover effect if the element doesn't already have one
        if (!element.classList.contains("oqtima-styled")) {
          const originalBackgroundColor =
            window.getComputedStyle(element).backgroundColor;

          element.addEventListener("mouseenter", function () {
            if (!element.classList.contains("oqtima-styled")) {
              element.style.opacity = "0.9";
            }
          });

          element.addEventListener("mouseleave", function () {
            if (!element.classList.contains("oqtima-styled")) {
              element.style.opacity = "1";
            }
          });
        }
      }

      // Add click event listener
      element.addEventListener("click", function (event) {
        // Prevent default action for links and other elements
        event.preventDefault();
        event.stopPropagation();

        // Store the popup mode flag and referral parameters in session storage
        if (window.sessionStorage) {
          try {
            sessionStorage.setItem("oqtima_popup_mode", "true");

            // Only store referral parameters if they are valid and for specific referral types
            // IB Referral Link (type 12) or Campaign Link (type 14)
            const isValidReferralType =
              referralType === 12 || referralType === 14;

            // Clear existing referral parameters for normal registration
            if (!isValidReferralType) {
              // CRITICAL: Make sure to completely remove these keys, not set them to null
              if (sessionStorage.getItem("oqtima_referral_type") !== null) {
                sessionStorage.removeItem("oqtima_referral_type");
              }

              if (sessionStorage.getItem("oqtima_referral_value") !== null) {
                sessionStorage.removeItem("oqtima_referral_value");
              }

              // console.log(
              //   "[OQtima] Cleared referral parameters from sessionStorage for normal registration"
              // );
            }
            // Only store for specific referral types
            else if (referralType && isValidReferralType) {
              sessionStorage.setItem("oqtima_referral_type", referralType);
              if (referralValue) {
                sessionStorage.setItem("oqtima_referral_value", referralValue);
              } else {
                // If referral_type is valid but referral_value is missing,
                // ensure we remove any existing referral_value
                if (sessionStorage.getItem("oqtima_referral_value") !== null) {
                  sessionStorage.removeItem("oqtima_referral_value");
                }
              }
            }
          } catch (e) {
            console.warn(
              "[OQtima] Error storing parameters in sessionStorage:",
              e
            );
          }
        }

        // Set global variables for referral parameters
        // But only set referral_value for specific referral types
        const isValidReferralType =
          referralType === 12 || // IB Referral Link
          referralType === 14; // Campaign Link

        window.__OQTIMA_REFERRAL_TYPE__ = referralType;

        if (isValidReferralType && referralValue) {
          window.__OQTIMA_REFERRAL_VALUE__ = referralValue;
        } else {
          // For normal registration, ensure referral_value is clear
          if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
            delete window.__OQTIMA_REFERRAL_VALUE__;
          }
        }

        // Create parameters object for opening popup with standardized parameter names
        const popupParams = {
          lang,
          preserveParentDirection: true, // Ensure parent page direction is preserved
        };

        // Only add referral parameters if they are actually set, using the standardized parameter names
        // that match what the openRegistrationPopup function expects
        if (
          referralType !== undefined &&
          referralType !== null &&
          referralType !== ""
        ) {
          popupParams.referral_type = referralType;
        }

        if (
          referralValue !== undefined &&
          referralValue !== null &&
          referralValue !== ""
        ) {
          popupParams.referral_value = referralValue;
        }

        // Open the registration popup with the parameters
        openRegistrationPopup(popupParams);
      });
    });
  }

  /**
   * Setup global click handler to detect and handle clicks on any registration-related buttons or links
   * This provides maximum compatibility with third-party sites like w3schools without requiring data attributes
   */
  function setupGlobalClickHandler() {
    // Add a global click handler to the document
    document.addEventListener("click", function (event) {
      // Skip if the event has already been processed or if the clicked element already has a oqtima-trigger attribute
      if (
        event.oqtimaProcessed ||
        (event.target.hasAttribute &&
          event.target.hasAttribute("data-oqtima-trigger"))
      ) {
        return;
      }

      // Mark this event as processed to prevent duplicate handling
      event.oqtimaProcessed = true;

      // Find the clicked element or its parent link/button
      let targetElement = event.target;

      // If the clicked element isn't a link or button, check if it's inside one
      if (targetElement.tagName !== "A" && targetElement.tagName !== "BUTTON") {
        targetElement = event.target.closest("a, button");
      }

      // If no link or button was found, exit
      if (!targetElement) return;

      // Extract referral parameters from the href or data attributes
      const extractReferralParams = (element) => {
        // Default parameters
        const params = {
          lang: "en",
          referral_type: null,
          referral_value: null,
        };

        try {
          // Check for data attributes first
          if (element.hasAttribute("data-lang")) {
            params.lang = element.getAttribute("data-lang");
          } else if (element.hasAttribute("lang")) {
            params.lang = element.getAttribute("lang");
          }

          if (element.hasAttribute("data-referral-type")) {
            params.referral_type = element.getAttribute("data-referral-type");
          }

          if (element.hasAttribute("data-referral-value")) {
            params.referral_value = element.getAttribute("data-referral-value");
          }

          // If the element is a link, try to extract parameters from href
          if (element.tagName === "A" && element.href) {
            const url = new URL(element.href, window.location.href);

            // Check for registration-related URLs
            if (
              url.pathname.includes("register") ||
              url.pathname.includes("signup") ||
              url.pathname.includes("registration") ||
              url.pathname.includes("account") ||
              (url.search &&
                (url.search.includes("register") ||
                  url.search.includes("signup") ||
                  url.search.includes("registration") ||
                  url.search.includes("account")))
            ) {
              // Extract language from URL if available
              const langMatch = url.pathname.match(
                /\/(en|fr|br|vn|th|es|it|cn|zh|id|jp|my|ar)\//
              );
              if (langMatch && langMatch[1]) {
                params.lang = langMatch[1];
              }

              // Extract parameters from URL query string
              const searchParams = url.searchParams;

              // Check for referral parameters in various formats
              const referralTypeKeys = [
                "referral_type",
                "referralType",
                "referral-type",
                "refType",
                "ref_type",
              ];
              for (const key of referralTypeKeys) {
                if (searchParams.has(key)) {
                  params.referral_type = searchParams.get(key);
                  break;
                }
              }

              const referralValueKeys = [
                "referral_value",
                "referralValue",
                "referral-value",
                "refValue",
                "ref_value",
              ];
              for (const key of referralValueKeys) {
                if (searchParams.has(key)) {
                  params.referral_value = searchParams.get(key);
                  break;
                }
              }

              // Check for campaign-specific parameters
              if (
                searchParams.has("campaign") ||
                searchParams.has("campaign_id")
              ) {
                params.referral_type = 14; // Campaign link
                params.referral_value =
                  searchParams.get("campaign") ||
                  searchParams.get("campaign_id");
              }

              // Check for IB-specific parameters
              if (searchParams.has("ib") || searchParams.has("ib_id")) {
                params.referral_type = 12; // IB link
                params.referral_value =
                  searchParams.get("ib") || searchParams.get("ib_id");
              }
            }
          }

          // Check if it's a register button based on text content
          if (targetElement.textContent) {
            const buttonText = targetElement.textContent.toLowerCase().trim();
            const registerKeywords = [
              "register",
              "registration",
              "sign up",
              "signup",
              "create account",
              "join",
              "open account",
              "free account",
              "start trading",
              "trade now",
            ];

            if (
              registerKeywords.some((keyword) => buttonText.includes(keyword))
            ) {
              // This is likely a registration button
              // console.log(
              //   "[OQtima] Detected likely registration button:",
              //   buttonText
              // );
              return params;
            }
          }

          // Check button/link classes and IDs for registration indicators
          const elementClasses = targetElement.className
            ? targetElement.className.toLowerCase()
            : "";
          const elementId = targetElement.id
            ? targetElement.id.toLowerCase()
            : "";

          const registerClassKeywords = [
            "register",
            "registration",
            "signup",
            "sign-up",
            "account",
            "create",
            "join",
            "cta",
          ];

          if (
            registerClassKeywords.some((keyword) =>
              elementClasses.includes(keyword)
            ) ||
            registerClassKeywords.some((keyword) => elementId.includes(keyword))
          ) {
            // console.log(
            //   "[OQtima] Detected registration element via class/id:",
            //   {
            //     class: elementClasses,
            //     id: elementId,
            //   }
            // );
            return params;
          }

          // Return null if this doesn't appear to be a registration element
          return null;
        } catch (e) {
          console.error("[OQtima] Error extracting referral parameters:", e);
          return null;
        }
      };

      // Try to extract parameters from the clicked element
      const params = extractReferralParams(targetElement);

      // If no parameters were found or this doesn't seem to be a registration element, exit
      if (!params) return;

      // If we got here, the clicked element appears to be registration-related
      // We'll intercept the click to open our popup instead

      // Prevent the default link action
      event.preventDefault();
      event.stopPropagation();

      // console.log("[OQtima] Detected registration link/button click:", {
      //   element: targetElement,
      //   params: params,
      // });

      // Format parameters for opening the popup
      const popupParams = {
        lang: params.lang || "en",
        preserveParentDirection: true,
      };

      // Add referral parameters if available
      if (params.referral_type) {
        const parsedType = parseInt(params.referral_type, 10);
        popupParams.referral_type = !isNaN(parsedType)
          ? parsedType
          : params.referral_type;
      }

      if (params.referral_value) {
        popupParams.referral_value = params.referral_value;
      }

      // Store parameters in session storage
      if (window.sessionStorage) {
        try {
          sessionStorage.setItem("oqtima_popup_mode", "true");

          if (params.referral_type) {
            sessionStorage.setItem(
              "oqtima_referral_type",
              params.referral_type
            );
          }

          if (params.referral_value) {
            sessionStorage.setItem(
              "oqtima_referral_value",
              params.referral_value
            );
          }
        } catch (e) {
          console.warn(
            "[OQtima] Error storing parameters in sessionStorage:",
            e
          );
        }
      }

      // Set global variables
      window.__OQTIMA_REFERRAL_TYPE__ = popupParams.referral_type;
      window.__OQTIMA_REFERRAL_VALUE__ = popupParams.referral_value;

      // Open the registration popup
      openRegistrationPopup(popupParams);
    });

    // console.log(
    //   "[OQtima] Global click handler set up for registration links/buttons"
    // );
  }

  /**
   * Add global styles for registration components
   */
  function addStyles() {
    const existingStyle = document.getElementById("oqtima-registration-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleElement = document.createElement("style");
    styleElement.id = "oqtima-registration-styles";

    const css = `
      /* Trigger elements with data-oqtima-trigger attribute */
      [data-oqtima-trigger] {
        cursor: pointer !important;
      }
      
      /* Button styling for trigger elements */
      button[data-oqtima-trigger] {
          position: relative !important;
        transition: all 0.3s ease !important;
      }
      
      /* Link styling for trigger elements */
      a[data-oqtima-trigger] {
          position: relative !important;
        display: inline-block !important;
      }
      
      /* Enhance trigger elements on hover */
      [data-oqtima-trigger]:hover {
        opacity: 0.9 !important;
      }
      
      /* Mobile styles for popup */
        .popup-registration__container {
        flex: 1 1 auto !important;
          position: relative !important;
          width: 100% !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
          padding: 0 !important;
        background: #fff !important;
        z-index: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .popup-registration__content {
          flex: 1 1 auto !important;
          position: relative !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch !important;
          padding: 0 !important;
          background: #fff !important;
          z-index: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .popup-registration__iframe-container {
          flex: 1 1 auto !important;
          position: relative !important;
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }

        #oqtima-registration-iframe {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }

        /* Fix iOS scrolling */
        .popup-registration__content {
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior-y: contain !important;
          transform: translate3d(0,0,0) !important;
          -webkit-transform: translate3d(0,0,0) !important;
        }

        /* Prevent body scroll */
        body.popup-open {
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          touch-action: none !important;
        }

        /* Fix dropdown positioning */
        .custom-dropdown__content {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 90% !important;
          max-height: 80vh !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          background: white !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
          z-index: 2147483648 !important;
        }
      }

      /* Tablet */
      @media screen and (min-width: 768px) {
        .popup-registration__container {
          width: 90% !important;
          max-height: 85vh !important;
        }

        .popup-registration__iframe-container {
          width: 100% !important;
          height: 85vh !important;
          max-height: 85vh !important;
        }
      }
      
      /* Large desktop */
      @media screen and (min-width: 1024px) {
        .popup-registration__container {
          width: 1080px !important;
          max-width: 1080px !important;
          max-height: 90vh !important;
        }

        .popup-registration__iframe-container {
          height: 47rem !important;
          max-width: 73.25rem !important;
          max-height: 47rem !important;
        }
      }
      
      /* Xtra Large desktop */
      @media screen and (min-width: 1920px) {
        .popup-registration__container {
          max-height: 80vh !important;
        }

        .popup-registration__iframe-container {
          height: 47rem !important;
          max-width: 73rem !important;
          max-height: 47rem !important;
        }
      }
      
      /* Mobile landscape */
      @media screen and (max-width: 991px) and (orientation: landscape) {
        .popup-registration__container {
          width: 90% !important;
          max-width: 90% !important;
          max-height: 90vh !important;
        }

        .popup-registration__iframe-container {
          width: 90% !important;
          height: 90vh !important;
          max-width: 90% !important;
          max-height: 90vh !important;
          min-height: auto !important;
        }
      }
    `;

    // Add the CSS to the style element
    styleElement.appendChild(document.createTextNode(css));

    // Add the style element to the head
    document.head.appendChild(styleElement);
  }

  /**
   * Opens the registration popup with the given parameters using iframe
   * Ensures consistent styling and behavior for both RTL and non-RTL languages
   */
  function openRegistrationPopup(options = {}) {
    // CRITICAL: Save the original RTL state at the very beginning
    if (isPageInRTLMode()) {
      saveOriginalRTLState();

      // CRITICAL: Add protection for RTL attributes to prevent any modifications
      protectRTLAttributes();
    }

    // ENHANCED: Create standardized params object with all possible variations of parameters
    const params = { ...options };

    // Store the URL path language first as it has highest priority
    let urlPathLanguage = null;
    try {
      if (typeof window !== "undefined" && window.location.pathname) {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        // If first path segment looks like a language code, use it as priority
        if (
          pathParts.length > 0 &&
          /^[a-z]{2}(-[a-z]{2})?$/.test(pathParts[0])
        ) {
          urlPathLanguage = pathParts[0].toLowerCase();

          // Use a stronger enforcement - set multiple storage mechanisms
          try {
            // 1. Session Storage (highest priority)
            sessionStorage.setItem("oqtima_tab_language", urlPathLanguage);
            sessionStorage.setItem("oqtima_detected_lang_source", "url_path");
            sessionStorage.setItem("oqtima_url_path_lang", urlPathLanguage);
            sessionStorage.setItem("LANG_LOCKED", "true");
            sessionStorage.setItem("LOCK_SOURCE", "URL");

            // 2. Global variables for strongest enforcement
            window.__OQTIMA_URL_PATH_LANG = urlPathLanguage;
            window.__OQTIMA_LANG_PRIORITY = "url_path";
            window.__OQTIMA_LANG_LOCKED = true;
            window.__OQTIMA_LOCKED_LANG = urlPathLanguage;
            window.__FORCE_LANGUAGE = urlPathLanguage;

            // 3. Document attributes for visual verification
            document.documentElement.dataset.enforcedLang = urlPathLanguage;

            // Override language cookie and localStorage for maximum compatibility
            document.cookie = `i18next=${urlPathLanguage};path=/;max-age=3600`;
            try {
              localStorage.setItem("i18nextLng", urlPathLanguage);
              localStorage.setItem("gatsby-i18next-language", urlPathLanguage);
            } catch (e) {
              // Local storage might be blocked
            }
          } catch (storageErr) {
            console.warn(
              "[OQtima] Error storing URL path language:",
              storageErr
            );
          }
        }
      }
    } catch (e) {
      console.warn("[OQtima] Error checking URL path for language:", e);
    }

    // CRITICAL: Always prioritize URL path language if it exists
    // This override ensures the language from URL path always wins
    if (urlPathLanguage) {
      // Force set language parameter, completely overriding any existing value
      params.language = urlPathLanguage;
      params.lang = urlPathLanguage;
      params["data-lang"] = urlPathLanguage;
      params.langParam = urlPathLanguage;
    } else {
      // If no URL path language, then use the normal priority order
      params.language =
        params.language ||
        params.lang ||
        params["data-lang"] ||
        params.langParam ||
        "en";
    }

    // Store the original data-lang parameter separately as it has special handling for RTL
    const dataLang = params["data-lang"];

    // Final enforcement of language
    window.__OQTIMA_LANG_MUST_USE = params.language;
    sessionStorage.setItem("oqtima_enforced_language", params.language);
    sessionStorage.setItem("oqtima_final_language", params.language);

    // FIXED: Enhanced RTL detection - check for Arabic language variants more thoroughly
    const normalizedLanguage = (params.language || "").toLowerCase().trim();
    params.isRTL =
      normalizedLanguage === "ar" ||
      normalizedLanguage.startsWith("ar-") ||
      normalizedLanguage === "arabic" ||
      (dataLang && dataLang.toLowerCase() === "ar");

    // Store RTL setting in session storage but don't modify the document
    if (typeof window !== "undefined") {
      try {
        // Store RTL setting only for the popup, not affecting parent document
        sessionStorage.setItem(
          "oqtima_popup_rtl",
          params.isRTL ? "true" : "false"
        );

        // Use specific popup RTL flags to avoid affecting parent document
        window.__OQTIMA_POPUP_RTL__ = params.isRTL;
        window.__OQTIMA_POPUP_LANGUAGE__ = params.language;

        // IMPORTANT: Don't modify these global flags as they may affect parent document
        // window.__FORCE_RTL__ = params.isRTL;
        // window.__ORIGINAL_RTL__ = params.isRTL;
      } catch (e) {
        console.warn("[OQtima] Error storing RTL state:", e);
      }
    }

    // ENHANCED: Normalize referral parameters to ensure consistency
    // First, standardize all parameter naming conventions to ensure we capture all possible formats
    const possibleReferralTypes = [
      "referral_type",
      "referralType",
      "referral-type",
      "refType",
      "ref_type",
      "ref-type",
      "affiliate_type",
      "affType",
    ];

    const possibleReferralValues = [
      "referral_value",
      "referralValue",
      "referral-value",
      "refValue",
      "ref_value",
      "ref-value",
      "affiliate_value",
      "affValue",
    ];

    // ENHANCED: Extract referral_type from all possible parameter names
    for (const key of possibleReferralTypes) {
      if (params[key] && !params.referral_type) {
        params.referral_type = params[key];
        break;
      }
    }

    // ENHANCED: Extract referral_value from all possible parameter names
    for (const key of possibleReferralValues) {
      if (params[key] && !params.referral_value) {
        params.referral_value = params[key];
        break;
      }
    }

    // ENHANCED: Try to extract referral parameters from URL query string if not provided in params
    // Only apply this for specific registration types (IB referrals or campaigns)
    // For normal registrations, we don't want to accidentally pick up URL parameters
    let isSpecificReferralType = false;
    for (const key of possibleReferralTypes) {
      if (params[key]) {
        isSpecificReferralType = true;
        break;
      }
    }

    try {
      if (
        isSpecificReferralType &&
        (!params.referral_type || !params.referral_value) &&
        typeof window !== "undefined"
      ) {
        const urlParams = new URLSearchParams(window.location.search);

        // Check all possible parameter names in URL
        if (!params.referral_type) {
          for (const key of possibleReferralTypes) {
            const value = urlParams.get(key);
            if (value) {
              params.referral_type = value;
              break;
            }
          }
        }

        if (!params.referral_value) {
          for (const key of possibleReferralValues) {
            const value = urlParams.get(key);
            if (value) {
              params.referral_value = value;
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn(
        "[OQtima] Error extracting referral parameters from URL:",
        e
      );
    }

    // CRITICAL FIX: Ensure referral_type is parsed as an integer when it should be numeric
    if (params.referral_type) {
      // Check if the value can be parsed as a valid integer
      const parsedType = parseInt(params.referral_type, 10);
      if (!isNaN(parsedType)) {
        // Only set as integer if it's a valid number
        params.referral_type = parsedType;
        // console.log("[OQtima] Converted referral_type to integer:", parsedType);
      } else {
        console.warn(
          "[OQtima] referral_type is not a valid integer:",
          params.referral_type
        );

        // For safety in normal registration scenarios, remove invalid referral_type
        if (!isSpecificReferralType) {
          delete params.referral_type;
        }
      }
    }

    // Generate unique session ID for this tab instance (helps with debugging)
    const tabSessionId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Store original document state
    const originalDocDir = document.documentElement.getAttribute("dir");
    const originalDocLang =
      document.documentElement.getAttribute("lang") || "en";
    const originalBodyDir = document.body.getAttribute("dir");

    // IMPORTANT: Do NOT modify the document and body direction attributes
    // This prevents RTL styles from affecting the parent page
    // We will only apply RTL styling to the popup container itself

    // Save original body and html states
    const originalBodyClasses = document.body.className;
    const originalHtmlClasses = document.documentElement.className;
    const originalBodyStyle = document.body.getAttribute("style") || "";
    const originalHtmlStyle =
      document.documentElement.getAttribute("style") || "";
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalScrollPos = window.scrollY;

    // Prevent background scrolling for non-embedded popups
    if (typeof window !== "undefined" && !params.embedded) {
      // Check if this will be a mobile popup
      const isMobileDetection =
        window.innerWidth <= 767 ||
        params.forceMobile === true ||
        params.isMobile === true ||
        params.mobile === true;

      if (isMobileDetection) {
        // MOBILE SPECIFIC: Use different approach to prevent background scrolling
        // Store additional properties that might affect mobile scrolling
        window.__OQTIMA_MOBILE_ORIGINAL_TOUCH_ACTION =
          document.body.style.touchAction || "";
        window.__OQTIMA_MOBILE_ORIGINAL_WEBKIT_OVERFLOW =
          document.body.style.webkitOverflowScrolling || "";

        // For mobile, use a gentler approach that won't break scroll restoration
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        document.body.style.webkitOverflowScrolling = "auto";

        // Store mobile-specific scroll position
        window.__OQTIMA_MOBILE_SCROLL_X =
          window.scrollX || window.pageXOffset || 0;
        window.__OQTIMA_MOBILE_SCROLL_Y =
          window.scrollY || window.pageYOffset || 0;
      } else {
        // DESKTOP: Use the existing fixed positioning approach
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${originalScrollPos}px`;
      }
    }

    // Store all parameters in sessionStorage for the iframe
    if (typeof window !== "undefined") {
      try {
        // Store current language in sessionStorage (doesn't affect other tabs)
        sessionStorage.setItem("oqtima_tab_language", params.language);
        sessionStorage.setItem(
          "oqtima_tab_rtl",
          params.isRTL ? "true" : "false"
        );
        sessionStorage.setItem("oqtima_tab_session", tabSessionId);

        // Also store a flag that indicates we're opening in a popup
        // This will be used by the iframe to know it should not affect parent styles
        sessionStorage.setItem("oqtima_popup_mode", "true");
        sessionStorage.setItem("oqtima_parent_dir", originalDocDir);
        sessionStorage.setItem("oqtima_parent_lang", originalDocLang);

        // CRITICAL: Store data-lang specifically to ensure RTL detection works properly
        if (dataLang) {
          sessionStorage.setItem("oqtima_data_lang", dataLang);
        }
        if (params.isRTL) {
          sessionStorage.setItem("oqtima_force_rtl", "true");
        }

        // FIXED: Only store referral parameters when they're actually needed for specific referral types
        // IB Referral Link (type 12) or Campaign Link (type 14)
        const isValidReferralType =
          params.referral_type === 12 || params.referral_type === 14;

        // Clear existing referral parameters from sessionStorage for normal registration
        if (!isValidReferralType) {
          // CRITICAL: Make sure we completely remove these keys, not set them to null
          if (sessionStorage.getItem("oqtima_referral_type") !== null) {
            sessionStorage.removeItem("oqtima_referral_type");
          }

          if (sessionStorage.getItem("oqtima_referral_value") !== null) {
            sessionStorage.removeItem("oqtima_referral_value");
          }
        }
        // Only store referral parameters if they are valid and needed
        else if (params.referral_type != null && isValidReferralType) {
          sessionStorage.setItem("oqtima_referral_type", params.referral_type);

          if (params.referral_value) {
            sessionStorage.setItem(
              "oqtima_referral_value",
              params.referral_value
            );
          } else {
            // If referral_type is valid but referral_value is missing,
            // ensure we remove any existing referral_value
            if (sessionStorage.getItem("oqtima_referral_value") !== null) {
              sessionStorage.removeItem("oqtima_referral_value");
            }
          }
        }

        // Store whether this is Brazilian Portuguese
        const isBrazilianPortuguese =
          params.language === "br" ||
          params.language === "pt-br" ||
          params.language === "pt_br";
        if (isBrazilianPortuguese) {
          sessionStorage.setItem("oqtima_is_brazilian_portuguese", "true");
        }
      } catch (e) {
        console.warn("[OQtima] Could not set sessionStorage:", e);
      }

      // Set flags that will be read by the iframe, but don't modify document
      window.__OQTIMA_COMPONENT_LANGUAGE = params.language;
      window.__OQTIMA_LOCKED_LANG = params.language;
      window.__OQTIMA_FORCE_RTL__ = params.isRTL;
      window.__ORIGINAL_RTL__ = params.isRTL;
      window.__OQTIMA_TAB_SESSION__ = tabSessionId;
      window.__OQTIMA_POPUP_MODE__ = true;
      window.__OQTIMA_PARENT_DIR__ = originalDocDir;
      window.__OQTIMA_DATA_LANG__ = dataLang;

      // ENHANCED: Set global referral variables
      if (params.referral_type != null) {
        window.__OQTIMA_REFERRAL_TYPE__ = params.referral_type;

        // Check if this is a specific referral type that should use referral_value
        const isValidReferralType =
          params.referral_type === 12 || // IB Referral Link
          params.referral_type === 14; // Campaign Link

        // Only set referral_value if we have a specific referral type
        if (isValidReferralType && params.referral_value) {
          window.__OQTIMA_REFERRAL_VALUE__ = params.referral_value;
        } else {
          // Clear referral_value for normal registration
          if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
            delete window.__OQTIMA_REFERRAL_VALUE__;
          }
        }
      } else {
        // Clear both referral type and value if referral_type is not provided
        if (window.__OQTIMA_REFERRAL_TYPE__ !== undefined) {
          delete window.__OQTIMA_REFERRAL_TYPE__;
        }
        if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
          delete window.__OQTIMA_REFERRAL_VALUE__;
        }
      }
    }

    // Get client info from data object if available
    const ipAddress = params.ip_address || null;
    const countryName = params.country_name || null;
    const countryCode = params.country_code || null;

    // Get referral params - ensure these values are passed down
    // For normal registration, explicitly set to null
    let referralType = null;
    let referralValue = null;

    // Only set referral parameters if they are actually present and valid for referral scenarios
    if (
      params.referral_type !== undefined &&
      params.referral_type !== null &&
      params.referral_type !== ""
    ) {
      referralType = params.referral_type;

      // Check if this is a specific referral type that should use referral_value
      const isValidReferralType =
        referralType === 12 || // IB Referral Link
        referralType === 14; // Campaign Link

      // Set referral_value if available, regardless of referral_type
      // This allows more flexibility while maintaining specific logic for IB/Campaign
      if (
        params.referral_value !== undefined &&
        params.referral_value !== null &&
        params.referral_value !== ""
      ) {
        referralValue = params.referral_value;
      } else {
        // Only clear referral_value for specific referral types if not provided
        if (isValidReferralType) {
          referralValue = null;
        }
      }
    } else {
      referralType = null;
      referralValue = null;
    }

    // Determine if mobile based on screen width
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 767 ||
        params.forceMobile === true ||
        params.isMobile === true ||
        params.mobile === true);

    // If mobile device, create mobile popup, otherwise create standard popup
    try {
      if (isMobile) {
        createMobilePopup(
          params.language,
          referralType,
          referralValue,
          originalBodyClasses,
          originalHtmlClasses,
          originalBodyStyle,
          originalHtmlStyle,
          originalBodyOverflow,
          originalHtmlOverflow,
          originalScrollPos,
          ipAddress,
          countryName,
          countryCode
        );
      } else if (params.isRTL) {
        createRtlFullscreenPopup(
          params.language,
          referralType,
          referralValue,
          originalBodyClasses,
          originalHtmlClasses,
          originalBodyStyle,
          originalHtmlStyle,
          originalBodyOverflow,
          originalHtmlOverflow,
          originalScrollPos,
          ipAddress,
          countryName,
          countryCode
        );
      } else {
        createStandardPopup(
          params.language,
          referralType,
          referralValue,
          originalBodyClasses,
          originalHtmlClasses,
          originalBodyStyle,
          originalHtmlStyle,
          originalBodyOverflow,
          originalHtmlOverflow,
          originalScrollPos,
          ipAddress,
          countryName,
          countryCode
        );
      }
    } catch (err) {
      console.error("[OQtima] Error creating popup:", err);
      // Restore original body state in case of error
      document.body.className = originalBodyClasses;
      document.documentElement.className = originalHtmlClasses;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (originalBodyStyle) {
        document.body.setAttribute("style", originalBodyStyle);
      } else {
        document.body.removeAttribute("style");
      }
      if (originalHtmlStyle) {
        document.documentElement.setAttribute("style", originalHtmlStyle);
      } else {
        document.documentElement.removeAttribute("style");
      }
      window.scrollTo(0, originalScrollPos);
    }
  }

  /**
   * Creates a standard popup for non-RTL languages
   */
  function createStandardPopup(
    language,
    referralType,
    referralValue,
    originalBodyClasses,
    originalHtmlClasses,
    originalBodyStyle,
    originalHtmlStyle,
    originalBodyOverflow,
    originalHtmlOverflow,
    originalScrollPos,
    ipAddress,
    countryName,
    countryCode
  ) {
    // Detect mobile
    const isMobile = window.innerWidth <= 767;

    // Add loading overlay first
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "oqtima-loading-overlay";
    loadingOverlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(0, 0, 0, 0.7) !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 2147483647 !important;
    `;

    // Create spinner with proper styling
    const spinner = document.createElement("div");
    spinner.className = "oqtima-loading-spinner";
    spinner.style.cssText = `
      width: 50px !important;
      height: 50px !important;
      border: 4px solid #f3f3f3 !important;
      border-top: 4px solid #ff4400 !important;
      border-radius: 50% !important;
      animation: oqtima-spin 1s linear infinite !important;
    `;
    loadingOverlay.appendChild(spinner);

    // Save spinner reference for later use
    const spinnerEl = spinner;

    // Add spinner animation
    const spinnerStyle = document.createElement("style");
    spinnerStyle.textContent = `
      @keyframes oqtima-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Mobile styles */
      @media (max-width: 767px) {
        .popup-registration {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          background: rgba(0, 0, 0, 0.7) !important;
        }

        .popup-registration__wrapper {
          flex: 1 !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          background: white !important;
          position: relative !important;
        }

        .popup-registration__iframe {
          flex: 1 !important;
          height: 100% !important;
          border: none !important;
        }
      }
    `;
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loadingOverlay);

    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.className = "popup-registration";

    // Base styles for modal container
    let modalStyles = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 2147483646 !important;
      display: flex !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;

    // Add mobile-specific styles
    if (isMobile) {
      modalStyles += `
        flex-direction: column !important;
      `;
    } else {
      modalStyles += `
      justify-content: center !important;
      align-items: center !important;
    `;
    }

    modalContainer.style.cssText = modalStyles;

    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "popup-registration__wrapper";

    // Base styles for wrapper
    let wrapperStyles = `
      background: white !important;
      transform: scale(0.98);
      transition: transform 0.3s ease-in-out;
    `;

    // Add mobile-specific styles
    if (isMobile) {
      wrapperStyles += `
        flex: 1 !important;
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
        flex-direction: column !important;
      `;
    } else {
      // Detect if it's a tablet (>= 768px and < 1024px)
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      wrapperStyles += `
      width: 100% !important;
        max-width: 1170px !important;
        height: 100% !important;
        max-height: ${isTablet ? "900px" : "800px"} !important;
        border-radius: 8px !important;
        overflow: hidden !important;
      `;
    }

    wrapper.style.cssText = wrapperStyles;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.className = "popup-registration__iframe";

    // CRITICAL: Add attributes for cross-domain support
    iframe.setAttribute("allow", "clipboard-write");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("scrolling", "yes");
    iframe.setAttribute("importance", "high");

    // CRITICAL: Add title for accessibility and SEO
    iframe.setAttribute("title", "Registration Form");

    // CRITICAL: Ensure cross-domain cookie access
    iframe.setAttribute("crossorigin", "anonymous");

    // Base styles for iframe
    let iframeStyles = `
      width: 100% !important;
      border: none !important;
      background: white !important;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;

    // Add mobile-specific styles
    if (isMobile) {
      iframeStyles += `
        flex: 1 !important;
      height: 100% !important;
      `;
    } else {
      iframeStyles += `
        height: 100% !important;
      `;
    }

    iframe.style.cssText = iframeStyles;

    // Enable scrolling for iOS
    iframe.setAttribute("scrolling", "yes");

    // Setup load timeout
    let isLoaded = false;
    const loadTimeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn("Iframe load timeout - forcing display");
        showContent();
      }
    }, 10000);

    function showContent() {
      if (isLoaded) return;
      isLoaded = true;
      clearTimeout(loadTimeout);

      // Fade out loading overlay
      loadingOverlay.style.opacity = "0";
      setTimeout(() => {
        loadingOverlay.remove();
        // Show modal and content
        modalContainer.style.opacity = "1";
        wrapper.style.transform = "scale(1)";
        iframe.style.opacity = "1";

        // Fix iframe scrolling after content is loaded
        if (isMobile) {
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body) {
              // Add viewport meta for proper mobile scaling
              if (!iframeDoc.querySelector('meta[name="viewport"]')) {
                const meta = iframeDoc.createElement("meta");
                meta.name = "viewport";
                meta.content =
                  "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
                iframeDoc.head.appendChild(meta);
              }

              // Add mobile scroll styles to iframe document
              const mobileStyle = iframeDoc.createElement("style");
              mobileStyle.textContent = `
                html {
                  -webkit-text-size-adjust: 100%;
                }
                body {
                  margin: 0;
                  padding: 15px;
                  min-height: 100vh;
            }
            form {
                  padding-bottom: 50px;
                }
              `;
              iframeDoc.head.appendChild(mobileStyle);
            }
          } catch (e) {
            console.warn("Could not apply iframe body styles:", e);
          }
        }
      }, 300);
    }

    // Setup iframe load event
    iframe.addEventListener("load", function () {
      // Ensure spinner is hidden after iframe loads
      if (spinnerEl) {
        spinnerEl.style.display = "none";
      }

      // Send message to iframe with parameters
      try {
        // Create a complete message with all necessary data
        const messageData = {
          type: "REGISTRATION_PARAMS",
          data: {
            // Language parameters (high priority)
            language: language,
            "data-lang": language,
            lang: language,
            data_lang: language,
            tab_language: language,
            oqtima_tab_language: language,
            i18nextLng: language,
            forceLang: "true",
            forceLanguage: "true",

            // Ensure referral_type is passed correctly
            referral_type: referralType,
            // Add all variant formats for maximum compatibility
            referralType: referralType,
            "referral-type": referralType,

            // Ensure referral_value is passed correctly
            referral_value: referralValue,
            // Add all variant formats for maximum compatibility
            referralValue: referralValue,
            "referral-value": referralValue,

            // Include IP and country information if available
            ip_address: ipAddress,
            country_name: countryName,
            country_code: countryCode,

            // Cross-domain storage instructions
            storeInSessionStorage: true,
            storageKeys: [
              { key: "oqtima_referral_type", value: referralType },
              { key: "oqtima_referral_value", value: referralValue },
              { key: "oqtima_tab_language", value: language },
              {
                key: "oqtima_tab_rtl",
                value: language === "ar" ? "true" : "false",
              },
              { key: "lang", value: language },
              { key: "language", value: language },
              { key: "i18nextLng", value: language },
            ],
          },
          timestamp: Date.now(),
        };

        // First attempt to send message - use wildcard origin "*" for maximum compatibility
        // This is safe because we're only posting data, not reading any data from cross-origin frames
        iframe.contentWindow.postMessage(messageData, "*");

        // Schedule multiple retries with increasing delays to ensure message is received
        // but still using safe postMessage approach
        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("[OQtima] Error in retry 1:", err);
          }
        }, 100);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("[OQtima] Error in retry 2:", err);
          }
        }, 500);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
            // console.log("[OQtima] Final retry sending message to iframe");
          } catch (err) {
            console.error("[OQtima] Error in final retry:", err);
          }
        }, 1500);

        // Safely add direct iframe data transfer for session storage access
        // Only attempt this for same-origin iframes to avoid security errors
        try {
          // Using setTimeout to ensure iframe is fully loaded
          setTimeout(() => {
            // SAFETY CHECK: Only try to access iframe document directly if it's same-origin
            // This prevents security errors when loading cross-origin content
            try {
              const iframeOrigin = new URL(iframe.src).origin;
              const currentOrigin = window.location.origin;

              const isSameOrigin = iframeOrigin === currentOrigin;

              if (isSameOrigin) {
                const iframeDoc =
                  iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                  const script = iframeDoc.createElement("script");
                  script.textContent = `
                    // Set up data receiver
                    window.addEventListener("message", function(event) {
                      if (event.data && event.data.type === "REGISTRATION_PARAMS") {
                        // console.log("[OQtima][Iframe] Received parameters from parent");
                        
                        // Store data safely without accessing parent
                        const params = event.data.data;
                        
                        // Store data in sessionStorage
                        if (params.storeInSessionStorage && params.storageKeys) {
                          params.storageKeys.forEach(item => {
                            if (item.key && item.value !== undefined) {
                              try {
                                sessionStorage.setItem(item.key, item.value);
                              } catch (e) {
                                console.warn("[OQtima][Iframe] Failed to set storage item:", item.key);
                              }
                            }
                          });
                        }
                        
                        // Set global variables for language and referral
                        if (params.language) window.__OQTIMA_LANGUAGE__ = params.language;
                        if (params.referral_type) window.__OQTIMA_REFERRAL_TYPE__ = params.referral_type;
                        if (params.referral_value) window.__OQTIMA_REFERRAL_VALUE__ = params.referral_value;
                        
                        // Send confirmation back to parent
                        window.parent.postMessage({
                          type: "REGISTRATION_PARAMS_RECEIVED",
                          timestamp: Date.now()
                        }, "*");
                      }
                    });
                    
                    // Send ready message to parent
                    window.parent.postMessage({
                      type: "IFRAME_READY",
                      timestamp: Date.now()
                    }, "*");
              `;
                  iframeDoc.head.appendChild(script);
                }
              } else {
                // console.log(
                //   "[OQtima] Iframe is cross-origin, using only postMessage communication"
                // );
              }
            } catch (originError) {
              // If we can't check origins, iframe is most likely cross-origin
              // console.log(
              //   "[OQtima] Iframe appears to be cross-origin, using only postMessage"
              // );
            }
          }, 200);
        } catch (scriptError) {
          console.warn(
            "[OQtima] Could not inject script to iframe:",
            scriptError
          );
        }
      } catch (err) {
        console.error("Error sending message to iframe:", err);
      }

      // Added event listener for link click handling
      iframe.addEventListener("load", injectLinkHandlerScript);

      // Show content after a short delay to ensure smooth transition
      setTimeout(showContent, 500);
    });

    // Construct and set iframe URL
    const url = constructIframeUrl(
      language,
      referralType,
      referralValue,
      isMobile
    );
    iframe.src = url;

    // REDUNDANCY: Add referral parameters again to ensure they're in the URL
    // This is a defensive measure in case they weren't properly added in constructIframeUrl
    if (referralType !== null && referralType !== undefined && referralValue) {
      // Start with the existing URL
      let newUrl = url;
      const urlParts = url.split("?");
      const baseUrl = urlParts[0];
      const existingParams = new URLSearchParams(urlParts[1] || "");

      // Ensure the referral parameters are included with all possible naming variations
      // Primary format with underscore (as expected by the API)
      existingParams.set("referral_type", referralType);
      existingParams.set("referral_value", referralValue);

      // Add alternative formats for maximum compatibility
      existingParams.set("referralType", referralType);
      existingParams.set("referralValue", referralValue);
      existingParams.set("referral-type", referralType);
      existingParams.set("referral-value", referralValue);

      // Reconstruct the URL with the updated parameters
      newUrl = `${baseUrl}?${existingParams.toString()}`;

      // Set the iframe source to the updated URL
      iframe.src = newUrl;

      // Debug log the updated URL (truncated if too long)
      const logUrl =
        newUrl.length > 150 ? newUrl.substring(0, 147) + "..." : newUrl;
    }

    // Assemble the popup
    wrapper.appendChild(iframe);
    modalContainer.appendChild(wrapper);

    // Add the container to the document body
    document.body.appendChild(modalContainer);

    // Lock body scroll
    if (isMobile) {
      document.body.style.cssText += `
        position: fixed;
        width: 100%;
        overflow: hidden;
      `;
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    // Return cleanup function
    return setupCloseFunction(
      modalContainer,
      iframe,
      spinnerStyle,
      originalBodyClasses,
      originalHtmlClasses,
      originalBodyStyle,
      originalHtmlStyle,
      originalBodyOverflow,
      originalHtmlOverflow,
      originalScrollPos
    );
  }

  /**
   * Creates a fullscreen popup specifically for RTL languages (Arabic)
   */
  function createRtlFullscreenPopup(
    language,
    referralType,
    referralValue,
    originalBodyClasses,
    originalHtmlClasses,
    originalBodyStyle,
    originalHtmlStyle,
    originalBodyOverflow,
    originalHtmlOverflow,
    originalScrollPos,
    ipAddress,
    countryName,
    countryCode
  ) {
    // CRITICAL: Don't save the RTL state again, it's already saved in openRegistrationPopup

    // Create modal container with RTL support
    const modalContainer = document.createElement("div");
    modalContainer.id = "oqtima-registration-modal";
    modalContainer.className =
      "popup-registration popup-registration--rtl popup-registration--active";
    modalContainer.setAttribute("dir", "rtl");
    modalContainer.setAttribute("lang", language);
    modalContainer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 2147483647 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
        background-color: rgba(0, 0, 0, 0.7) !important;
      overflow-y: auto !important;
        direction: rtl !important;
    `;

    // Add RTL styles to head but scope them to only affect the popup
    const rtlStyles = document.createElement("style");
    rtlStyles.id = "oqtima-rtl-styles";
    rtlStyles.textContent = `
      /* Isolated RTL styles - only apply to popup elements */
      #oqtima-registration-modal {
        direction: rtl !important;
      }
      #oqtima-registration-modal.popup-registration--rtl {
        direction: rtl !important;
      }
      #oqtima-registration-modal.popup-registration--rtl .popup-registration__container {
        flex-direction: row-reverse !important;
      }
      #oqtima-registration-modal.popup-registration--rtl .popup-registration__sidebar--rtl {
        order: 2 !important;
      }
      #oqtima-registration-modal.popup-registration--rtl .popup-registration__content--rtl {
        order: 1 !important;
      }
      #oqtima-registration-modal.popup-registration--rtl * {
        direction: rtl !important;
        text-align: right !important;
      }
      #oqtima-registration-modal.popup-registration--rtl input,
      #oqtima-registration-modal.popup-registration--rtl select,
      #oqtima-registration-modal.popup-registration--rtl textarea {
        text-align: right !important;
        direction: rtl !important;
      }
    `;
    document.head.appendChild(rtlStyles);

    // Detect if it's a tablet (>= 768px and < 1024px)
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Create wrapper element
    const wrapper = document.createElement("div");
    wrapper.className =
      "popup-registration__wrapper popup-registration__wrapper--rtl";
    wrapper.setAttribute("dir", "rtl");
    wrapper.style.cssText = `
      width: 100% !important;
      max-width: 1170px !important;
      height: 100% !important;
      max-height: ${isTablet ? "900px" : "800px"} !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      // overflow-y: auto !important;
      direction: rtl !important;
    `;

    // Create container with RTL layout
    const container = document.createElement("div");
    container.className =
      "popup-registration__container popup-registration__container--rtl";
    container.setAttribute("dir", "rtl");
    container.style.cssText = `
      display: flex !important;
      flex-direction: row-reverse !important;
          border-radius: 10px !important;
      overflow: hidden !important;
      width: 100% !important;
      max-height: 100% !important;
      // height: 900px !important;
          direction: rtl !important;
        `;

    // Create iframe container
    const iframeContainer = document.createElement("div");
    iframeContainer.className =
      "popup-registration__iframe-container popup-registration__iframe-container--rtl";
    iframeContainer.style.cssText = `
      position: relative !important;
      background-color: transparent !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      flex: 1 !important;
      min-height: 600px !important;
      height: ${isTablet ? "900px" : "800px"} !important;
      z-index: 2147483647 !important;
      direction: rtl !important;
      order: 1 !important;
    `;

    // Create and style spinner
    const spinner = document.createElement("div");
    spinner.id = "oqtima-spinner";
    spinner.style.cssText = `
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
      width: 40px !important;
      height: 40px !important;
      z-index: 999999 !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      background: transparent !important;
    `;

    // Add spinner styles
    const spinnerStyles = document.createElement("style");
    spinnerStyles.id = "oqtima-spinner-styles";
    spinnerStyles.innerHTML = `
      #oqtima-spinner:after {
        content: "" !important;
        display: block !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        border: 3px solid #ff4400 !important;
        border-color: #ff4400 transparent #ff4400 transparent !important;
        animation: oqtima-spinner 1.2s linear infinite !important;
      }
      @keyframes oqtima-spinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyles);

    // Create iframe with RTL support
    const iframe = document.createElement("iframe");
    iframe.id = "oqtima-registration-iframe";
    iframe.setAttribute("dir", "rtl");
    iframe.setAttribute("lang", language);

    // CRITICAL: Add attributes for cross-domain support
    iframe.setAttribute("allow", "clipboard-write");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("scrolling", "yes");
    iframe.setAttribute("importance", "high");

    // CRITICAL: Add title for accessibility and SEO
    iframe.setAttribute("title", "Registration Form RTL");

    // CRITICAL: Ensure cross-domain cookie access
    iframe.setAttribute("crossorigin", "anonymous");

    iframe.style.cssText = `
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.7) !important;
          transition: all 0.3s ease-in-out !important;
          display: block !important;
      opacity: 0 !important;
          transition: opacity 0.3s ease-in-out !important;
      overflow-y: scroll !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      transform: translateZ(0) !important;
      -webkit-transform: translateZ(0) !important;
      -webkit-backface-visibility: hidden !important;
      direction: rtl !important;
    `;

    // Setup iframe URL and load handler
    const url = constructIframeUrl(
      language,
      referralType,
      referralValue,
      false
    );
    iframe.src = url;

    // Add load event listener
    iframe.addEventListener("load", function () {
      // Ensure spinner is removed and iframe is shown
      if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
      }
      if (spinnerStyles && spinnerStyles.parentNode) {
        spinnerStyles.parentNode.removeChild(spinnerStyles);
      }
      iframe.style.opacity = "1";

      // Send message to iframe with parameters
      try {
        // Create a complete message with all necessary data
        const messageData = {
          type: "REGISTRATION_PARAMS",
          data: {
            referral_type: referralType,
            referral_value: referralValue,
            language: language,
            lang: language, // Add lang as alternative format
            data_lang: language, // Add data_lang as an explicit form
            // Include IP and country information if available
            ip_address: ipAddress,
            country_name: countryName,
            country_code: countryCode,
          },
          timestamp: Date.now(),
        };

        // First attempt to send message
        iframe.contentWindow.postMessage(messageData, "*");

        // Schedule multiple retries with increasing delays to ensure message is received
        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("Error in RTL retry 1:", err);
          }
        }, 100);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("Error in RTL retry 2:", err);
          }
        }, 500);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
            // console.log("[OQtima] Final retry sending message to RTL iframe");
          } catch (err) {
            console.error("Error in RTL final retry:", err);
          }
        }, 1500);
      } catch (err) {
        console.error("Error sending message to RTL iframe:", err);
      }

      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc && iframeDoc.body) {
          // Add RTL meta and viewport
          const meta = document.createElement("meta");
          meta.name = "viewport";
          meta.content =
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
          iframeDoc.head.appendChild(meta);

          // Add RTL direction meta
          const rtlMeta = document.createElement("meta");
          rtlMeta.name = "oqtima-direction";
          rtlMeta.content = "rtl";
          iframeDoc.head.appendChild(rtlMeta);

          // Add RTL styles
          const style = document.createElement("style");
          style.textContent = `
            html, body {
              direction: rtl !important;
              text-align: right !important;
            }
            * {
              direction: inherit !important;
            }
            input, select, textarea {
              text-align: right !important;
            }
          `;
          iframeDoc.head.appendChild(style);
        }
      } catch (e) {
        console.error("Error setting up RTL iframe:", e);
      }
    });

    // Assemble the popup
    iframeContainer.appendChild(spinner);
    iframeContainer.appendChild(iframe);
    container.appendChild(iframeContainer);
    wrapper.appendChild(container);
    modalContainer.appendChild(wrapper);

    // Add the container to the document body
    document.body.appendChild(modalContainer);

    // Setup close function
    setupCloseFunction(
      modalContainer,
      iframe,
      spinnerStyles,
      rtlStyles,
      originalBodyClasses,
      originalHtmlClasses,
      originalBodyStyle,
      originalHtmlStyle,
      originalBodyOverflow,
      originalHtmlOverflow,
      originalScrollPos
    );

    // Set up RTL cleanup function to restore original document state
    window.__OQTIMA_RTL_CLEANUP = function () {
      // Only restore document state if we're in Arabic mode
      if (isPageInRTLMode() && documentRTLState.originalHtmlDir === "rtl") {
        restoreOriginalRTLState();
      }
    };

    return modalContainer;
  }

  /**
   * Configures the close function for standard popup
   */
  function setupCloseFunction(
    modalContainer,
    iframe,
    styleEl,
    originalBodyClasses,
    originalHtmlClasses,
    originalBodyStyle,
    originalHtmlStyle,
    originalBodyOverflow,
    originalHtmlOverflow,
    originalScrollPos
  ) {
    // Store original document RTL state
    const originalDocDir = document.documentElement.getAttribute("dir");
    const originalDocLang = document.documentElement.getAttribute("lang");
    const originalBodyDir = document.body.getAttribute("dir");
    const originalHtmlRtlState = {
      classList: [...document.documentElement.classList],
      dataRtl: document.documentElement.getAttribute("data-rtl"),
    };
    const originalBodyRtlState = {
      classList: [...document.body.classList],
      dataRtl: document.body.getAttribute("data-rtl"),
    };

    // console.log("[OQtima] Saving original document RTL state before popup:", {
    //   originalDocDir,
    //   originalDocLang,
    //   originalBodyDir,
    //   originalHtmlRtlState,
    //   originalBodyRtlState,
    // });

    // Store close function globally so it can be called from anywhere
    window.__OQTIMA_CLOSE_POPUP = function () {
      try {
        // Clear popup-specific language and RTL flags
        try {
          sessionStorage.removeItem("oqtima_popup_rtl");
          sessionStorage.removeItem("oqtima_popup_iframe_rtl");
          sessionStorage.removeItem("oqtima_popup_mode");

          // Delete popup-specific global variables
          delete window.__OQTIMA_POPUP_RTL__;
          delete window.__OQTIMA_POPUP_LANGUAGE__;
          delete window.__OQTIMA_POPUP_IFRAME_RTL__;
          delete window.__OQTIMA_POPUP_MODE__;
        } catch (e) {
          console.warn("[OQtima] Error cleaning up popup flags:", e);
        }

        // Remove RTL attribute protection if it was applied
        if (window.__OQTIMA_UNPROTECT_RTL_ATTRIBUTES__) {
          window.__OQTIMA_UNPROTECT_RTL_ATTRIBUTES__();
          delete window.__OQTIMA_UNPROTECT_RTL_ATTRIBUTES__;
        }

        // Run RTL specific cleanup if needed
        if (window.__OQTIMA_RTL_CLEANUP) {
          window.__OQTIMA_RTL_CLEANUP();
          delete window.__OQTIMA_RTL_CLEANUP;
        }

        // Remove the modal
        if (modalContainer) {
          document.body.removeChild(modalContainer);
        }

        // Remove styles
        if (styleEl) {
          document.head.removeChild(styleEl);
        }

        // Remove RTL-specific styles
        const rtlStyleEl = document.getElementById("oqtima-rtl-styles");
        if (rtlStyleEl) {
          document.head.removeChild(rtlStyleEl);
        }

        // Remove message handler
        if (window.__OQTIMA_MESSAGE_HANDLER) {
          window.removeEventListener(
            "message",
            window.__OQTIMA_MESSAGE_HANDLER
          );
          delete window.__OQTIMA_MESSAGE_HANDLER;
        }

        // Remove ESC handler
        if (window.__OQTIMA_ESC_HANDLER) {
          document.removeEventListener("keydown", window.__OQTIMA_ESC_HANDLER);
          delete window.__OQTIMA_ESC_HANDLER;
        }

        // Remove the close function reference
        delete window.__OQTIMA_CLOSE_POPUP;

        // CRITICAL: Check if we need to restore the original RTL state
        if (isPageInRTLMode() && documentRTLState.originalHtmlDir === "rtl") {
          // Use the saved RTL state from documentRTLState
          restoreOriginalRTLState();
        } else {
          // Use the state saved in this function
          // IMPORTANT: Restore original document RTL state
          if (originalDocDir) {
            document.documentElement.setAttribute("dir", originalDocDir);
          } else {
            document.documentElement.removeAttribute("dir");
          }

          if (originalDocLang) {
            document.documentElement.setAttribute(
              "lang",
              documentRTLState.originalHtmlLang
            );
          }

          if (originalBodyDir) {
            document.body.setAttribute("dir", originalBodyDir);
          } else {
            document.body.removeAttribute("dir");
          }

          // Restore original HTML class list for RTL
          document.documentElement.className = originalHtmlClasses;
          if (originalHtmlRtlState.dataRtl) {
            document.documentElement.setAttribute(
              "data-rtl",
              originalHtmlRtlState.dataRtl
            );
          } else {
            document.documentElement.removeAttribute("data-rtl");
          }

          // Restore original body class list for RTL
          document.body.className = originalBodyClasses;
          if (originalBodyRtlState.dataRtl) {
            document.body.setAttribute(
              "data-rtl",
              originalBodyRtlState.dataRtl
            );
          } else {
            document.body.removeAttribute("data-rtl");
          }
        }

        // Remove mobile-specific classes
        document.body.classList.remove("oqtima-iframe-open");
        document.body.classList.remove("oqtima-mobile-open");
        document.documentElement.classList.remove("oqtima-mobile-open");
        document.body.classList.remove("oqtima-mobile-modal-open");
        document.documentElement.classList.remove("oqtima-mobile-popup-open");
        document.body.classList.remove("oqtima-mobile-popup-open");

        // CRITICAL FIX: Explicitly reset all scroll-affecting properties
        // We need to first remove the fixed position that prevents scrolling
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        document.body.style.overflow = originalBodyOverflow || "";
        document.documentElement.style.overflow = originalHtmlOverflow || "";

        // IMPORTANT: Restore scroll position AFTER removing fixed positioning
        if (originalScrollPos && typeof originalScrollPos === "object") {
          window.scrollTo(originalScrollPos.x || 0, originalScrollPos.y || 0);
        } else if (typeof originalScrollPos === "number") {
          window.scrollTo(0, originalScrollPos);
        }

        if (originalBodyStyle) {
          document.body.setAttribute("style", originalBodyStyle);
        } else {
          document.body.removeAttribute("style");
        }

        if (originalHtmlStyle) {
          document.documentElement.setAttribute("style", originalHtmlStyle);
        } else {
          document.documentElement.removeAttribute("style");
        }

        // Log cleanup success
        // console.log("[OQtima] Successfully restored original document state");
      } catch (error) {
        console.error("[OQtima] Error closing registration popup:", error);

        // Try the emergency scroll restoration as a fallback
        try {
          // console.log("[OQtima] Attempting emergency scroll restoration");
          if (typeof window.__OQTIMA_EMERGENCY_RESTORE_SCROLL === "function") {
            window.__OQTIMA_EMERGENCY_RESTORE_SCROLL();
          }
        } catch (emergencyError) {
          console.error(
            "[OQtima] Emergency scroll restoration also failed:",
            emergencyError
          );
        }
      }
    };

    // Handle iframe loading
    iframe.onload = function () {
      const spinnerEl = document.getElementById("oqtima-modal-spinner");
      if (spinnerEl) {
        spinnerEl.style.display = "none";
      }
    };

    // Set up message and ESC handlers
    setupMessageHandlers();
  }

  /**
   * Sets up message handlers for iframe communication
   */
  function setupMessageHandlers() {
    // Set up message handler for iframe communication
    window.__OQTIMA_MESSAGE_HANDLER = function (event) {
      try {
        // Handle registration success and close the popup first
        if (
          typeof event.data === "string" &&
          event.data.startsWith("redirect:")
        ) {
          const redirectUrl = event.data.substring(9);
          if (redirectUrl) {
            window.__OQTIMA_REGISTRATION_REDIRECT_URL = redirectUrl;
            // Close popup first, then redirect
            if (window.__OQTIMA_CLOSE_POPUP) {
              window.__OQTIMA_CLOSE_POPUP();
            }
            setTimeout(function () {
              window.location.href = redirectUrl;
            }, 100);
          }

          return; // Skip the rest of the handler
        }

        // Handle close popup message - ACCEPT FROM ANY ORIGIN FOR MAXIMUM COMPATIBILITY
        // Support multiple message formats for better compatibility
        const shouldClosePopup =
          // Format 1: Standard OQTIMA close message
          (event.data &&
            typeof event.data === "object" &&
            event.data.type === "OQTIMA_CLOSE_POPUP") ||
          // Format 2: Alternative close message
          (event.data &&
            typeof event.data === "object" &&
            event.data.type === "CLOSE_POPUP") ||
          // Format 3: Direct close action
          (event.data &&
            typeof event.data === "object" &&
            event.data.action === "close") ||
          // Format 4: Simple string message
          event.data === "close_popup";

        if (shouldClosePopup) {
          // Close popup immediately - with resilient fallback logic
          if (window.__OQTIMA_CLOSE_POPUP) {
            try {
              window.__OQTIMA_CLOSE_POPUP();

              // Notify the source that we've closed the popup
              if (
                event.source &&
                typeof event.source.postMessage === "function"
              ) {
                try {
                  event.source.postMessage(
                    {
                      type: "OQTIMA_POPUP_CLOSED",
                      success: true,
                      timestamp: Date.now(),
                    },
                    "*"
                  );
                } catch (err) {
                  // Error notifying source about popup close
                }
              }
            } catch (err) {
              // Error closing popup - try alternative cleanup
              try {
                // Try to remove modal elements manually as fallback
                const modalContainer = document.querySelector(
                  ".popup-registration"
                );
                if (modalContainer && modalContainer.parentNode) {
                  modalContainer.parentNode.removeChild(modalContainer);
                }

                // Restore scroll and body styles
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
                document.body.style.position = "";
                document.body.style.width = "";
                document.body.style.top = "";

                // Remove any popup-related classes
                document.body.classList.remove(
                  "oqtima-iframe-open",
                  "oqtima-mobile-open",
                  "popup-open"
                );
                document.documentElement.classList.remove(
                  "oqtima-mobile-open",
                  "oqtima-mobile-popup-open"
                );
              } catch (cleanupErr) {
                // Even cleanup failed, but we tried
              }
            }
            return; // Skip the rest after closing
          } else {
            // Close function not found - try manual cleanup
            try {
              const modalContainer = document.querySelector(
                ".popup-registration"
              );
              if (modalContainer && modalContainer.parentNode) {
                modalContainer.parentNode.removeChild(modalContainer);
              }

              // Restore scroll and body styles
              document.body.style.overflow = "";
              document.documentElement.style.overflow = "";
              document.body.style.position = "";
              document.body.style.width = "";
              document.body.style.top = "";

              // Remove any popup-related classes
              document.body.classList.remove(
                "oqtima-iframe-open",
                "oqtima-mobile-open",
                "popup-open"
              );
              document.documentElement.classList.remove(
                "oqtima-mobile-open",
                "oqtima-mobile-popup-open"
              );
            } catch (manualCleanupErr) {
              // Manual cleanup also failed
            }
          }
        }

        // Ignore messages from other origins for security
        if (
          event.origin &&
          !event.origin.includes("oqtima.com") &&
          !event.origin.includes("localhost") &&
          !event.origin.includes("127.0.0.1")
        ) {
          return;
        }

        // Handle complex message objects
        if (
          event.data &&
          typeof event.data === "object" &&
          !Array.isArray(event.data)
        ) {
          // Handle registration success message
          if (event.data.type === "OQTIMA_REGISTRATION_SUCCESS") {
            // Handle optional redirect
            if (event.data.redirectUrl) {
              window.__OQTIMA_REGISTRATION_REDIRECT_URL =
                event.data.redirectUrl;

              // Close popup and redirect
              if (window.__OQTIMA_CLOSE_POPUP) {
                window.__OQTIMA_CLOSE_POPUP();
              }

              setTimeout(function () {
                if (
                  event.data.redirectUrl &&
                  typeof event.data.redirectUrl === "string"
                ) {
                  window.location.href = event.data.redirectUrl;
                }
              }, event.data.redirectTimeout || 100);
            }
          }

          // Handle redirect message with timeout
          if (event.data.type === "OQTIMA_REDIRECT") {
            const redirectUrl = event.data.url;
            const timeout = event.data.timeout || 0;

            if (redirectUrl && typeof redirectUrl === "string") {
              // Close popup and redirect
              if (window.__OQTIMA_CLOSE_POPUP) {
                window.__OQTIMA_CLOSE_POPUP();
              }

              setTimeout(function () {
                window.location.href = redirectUrl;
              }, timeout);
            }
          }

          // Handle link clicks inside iframe (specifically for policy links)
          if (event.data.type === "OQTIMA_OPEN_LINK") {
            try {
              const url = event.data.url || "";
              const isPolicyLink = event.data.isPolicyLink === true;
              const timestamp = event.data.timestamp || Date.now();

              // Validate the URL before attempting to open it
              if (!url || typeof url !== "string") {
                return;
              }

              // Determine if this is a policy link that should be allowed
              // Always allow policy and legal links regardless of domain
              const isPolicyOrLegalLink =
                isPolicyLink ||
                /privacy|cookie|policy|terms|legal|disclaimer|gdpr|oqtima\.com/i.test(
                  url
                );

              if (isPolicyOrLegalLink) {
                let linkOpened = false;

                // Try window.open directly - don't create a button if it fails
                const tryWindowOpen = () => {
                  try {
                    // Standard window.open approach
                    const newWindow = window.open(url, "_blank");

                    // Check if successful
                    if (newWindow && !newWindow.closed) {
                      try {
                        // Focus the new window
                        newWindow.focus();
                        linkOpened = true;
                        return true;
                      } catch (focusErr) {
                        console.warn(
                          "[OQtima] Error focusing policy window:",
                          focusErr
                        );
                      }
                    } else {
                      console.warn(
                        "[OQtima] window.open was blocked or returned null"
                      );
                    }
                  } catch (err) {
                    console.warn("[OQtima] Error in window.open:", err);
                  }
                  return false;
                };

                // First try the standard window.open approach
                const windowOpenSucceeded = tryWindowOpen();

                // If window.open works, we're done
                if (windowOpenSucceeded) {
                  // Notify the iframe
                  if (event.source && event.source.postMessage) {
                    event.source.postMessage(
                      {
                        type: "OQTIMA_LINK_OPENED",
                        url: url,
                        success: true,
                        timestamp: timestamp,
                        method: "window.open",
                      },
                      "*"
                    );
                  }
                }
                // If window.open fails, tell the iframe to handle it with its overlay
                else {
                  // Send message to iframe to use its internal overlay
                  if (event.source && event.source.postMessage) {
                    event.source.postMessage(
                      {
                        type: "OQTIMA_LINK_OPENED",
                        url: url,
                        success: false,
                        timestamp: timestamp,
                        method: "failed",
                      },
                      "*"
                    );
                  }
                }
              } else {
                console.warn(
                  "[OQtima] Non-policy link request was ignored for security reasons:",
                  url
                );

                // Still send a response to the iframe so it doesn't hang
                if (event.source && event.source.postMessage) {
                  event.source.postMessage(
                    {
                      type: "OQTIMA_LINK_OPENED",
                      url: url,
                      success: false,
                      timestamp: timestamp,
                      method: "rejected",
                      reason: "security",
                    },
                    "*"
                  );
                }
              }
            } catch (e) {
              console.error("[OQtima] Error handling link open request:", e);

              // Try to notify the iframe even if we had an error
              try {
                if (event.source && event.source.postMessage) {
                  event.source.postMessage(
                    {
                      type: "OQTIMA_LINK_OPENED",
                      success: false,
                      error: e.message,
                      timestamp: Date.now(),
                      method: "error",
                    },
                    "*"
                  );
                }
              } catch (notifyError) {
                console.error(
                  "[OQtima] Failed to notify iframe of error:",
                  notifyError
                );
              }
            }
          }
        }

        // Handle string-based redirect message (fallback format)
        if (typeof event.data === "string") {
          // Handle redirect string format
          if (event.data.startsWith("redirect:")) {
            const redirectUrl = event.data.substring(9);
            if (redirectUrl) {
              // Close popup if possible
              if (window.__OQTIMA_CLOSE_POPUP) {
                window.__OQTIMA_CLOSE_POPUP();
              }

              // Redirect the parent window
              setTimeout(function () {
                window.location.href = redirectUrl;
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error("[OQtima] Error in message handler:", error);
      }
    };

    // Add ESC key handler
    window.__OQTIMA_ESC_HANDLER = function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        window.__OQTIMA_CLOSE_POPUP();
      }
    };

    // Add event listeners
    window.addEventListener("message", window.__OQTIMA_MESSAGE_HANDLER);
    document.addEventListener("keydown", window.__OQTIMA_ESC_HANDLER);
  }

  /**
   * Constructs the iframe URL with proper parameters
   */
  function constructIframeUrl(language, referralType, referralValue, isMobile) {
    // Check if we have a URL path language which takes precedence
    const urlPathLanguage =
      window.__OQTIMA_URL_PATH_LANG ||
      sessionStorage.getItem("oqtima_url_path_lang") ||
      document.documentElement.dataset.enforcedLang;

    // Get the final enforced language from various sources
    const enforcedLanguage =
      window.__OQTIMA_LANG_MUST_USE ||
      sessionStorage.getItem("oqtima_final_language") ||
      urlPathLanguage;

    // If we have an enforced language and it's different from what was passed in, override it
    if (enforcedLanguage && language !== enforcedLanguage) {
      language = enforcedLanguage;

      // Apply language enforcement again in session storage
      try {
        sessionStorage.setItem("oqtima_final_language", language);
        sessionStorage.setItem("i18nextLng", language);
        sessionStorage.setItem("lang", language);
      } catch (e) {
        console.warn("[OQtima] Error reinforcing language:", e);
      }
    }

    // Double check URL path language - highest priority
    if (urlPathLanguage && language !== urlPathLanguage) {
      language = urlPathLanguage;
    }

    // CRITICAL: Extra check for Arabic language to ensure RTL mode
    const isArabicLanguage =
      language === "ar" || (language || "").toLowerCase() === "arabic";
    if (isArabicLanguage) {
      // Set RTL flags globally
      window.__FORCE_RTL__ = true;
      window.__ORIGINAL_RTL__ = true;

      // Make sure the sessionStorage has the correct RTL values for Arabic
      try {
        sessionStorage.setItem("oqtima_tab_rtl", "true");
        sessionStorage.setItem("oqtima_tab_language", "ar");
        sessionStorage.setItem("isRTL", "true");

        // Set up protection to prevent changing RTL setting for Arabic
        if (!window.__RTL_PROTECTION_ACTIVE) {
          window.__RTL_PROTECTION_ACTIVE = true;

          // Save original setItem to use in our override
          const originalSetItem = Storage.prototype.setItem;

          // Override sessionStorage.setItem to protect Arabic RTL settings
          Storage.prototype.setItem = function (key, value) {
            // Check if this is trying to change Arabic RTL settings
            if (
              (key === "oqtima_tab_language" &&
                sessionStorage.getItem("oqtima_tab_language") === "ar" &&
                value !== "ar") ||
              (key === "oqtima_tab_rtl" &&
                sessionStorage.getItem("oqtima_tab_language") === "ar" &&
                value === "false")
            ) {
              console.warn(
                `[OQtima] Prevented changing ${key} from Arabic RTL setting`
              );

              // If something is trying to change language from ar, log it
              if (key === "oqtima_tab_language" && value !== "ar") {
                console.warn(
                  `[OQtima] Attempt to change language from ar to ${value} blocked`
                );

                // Force reset all Arabic settings to ensure consistency
                setTimeout(() => {
                  originalSetItem.call(
                    sessionStorage,
                    "oqtima_tab_rtl",
                    "true"
                  );
                  originalSetItem.call(
                    sessionStorage,
                    "oqtima_tab_language",
                    "ar"
                  );
                  originalSetItem.call(sessionStorage, "isRTL", "true");
                  originalSetItem.call(sessionStorage, "i18nextLng", "ar");
                }, 0);
              }

              // Do not proceed with the change
              return;
            }

            // Allow other changes to proceed
            return originalSetItem.call(this, key, value);
          };

          // console.log("[OQtima] Arabic RTL protection enabled");
        }
      } catch (e) {
        console.warn("[OQtima] Failed to protect Arabic RTL settings:", e);
      }
    }

    // Apply similar protection for non-Arabic languages to prevent language switching
    if (!window.__LANGUAGE_PROTECTION_ACTIVE && language) {
      window.__LANGUAGE_PROTECTION_ACTIVE = true;
      window.__PROTECTED_LANGUAGE = language.toLowerCase().trim();

      try {
        // Save original setItem if not already saved
        if (!window.__ORIGINAL_SET_ITEM) {
          window.__ORIGINAL_SET_ITEM = Storage.prototype.setItem;
        }

        // Override sessionStorage.setItem to protect language settings
        Storage.prototype.setItem = function (key, value) {
          // Protect language-related keys from being changed once set
          if (
            key === "oqtima_tab_language" ||
            key === "language" ||
            key === "lang" ||
            key === "i18nextLng"
          ) {
            const currentLang =
              sessionStorage.getItem("oqtima_tab_language") ||
              window.__PROTECTED_LANGUAGE;

            // If we have a language and something is trying to change it to a different value
            if (
              currentLang &&
              value &&
              value.toLowerCase() !== currentLang.toLowerCase()
            ) {
              console.warn(
                `[OQtima] Prevented changing ${key} from "${currentLang}" to ${value}`
              );

              // If the key is oqtima_tab_language, force maintain the protected language
              if (key === "oqtima_tab_language") {
                return window.__ORIGINAL_SET_ITEM.call(this, key, currentLang);
              }
            }
          }

          // Allow the original operation for other keys
          return window.__ORIGINAL_SET_ITEM.call(this, key, value);
        };
      } catch (e) {
        console.warn("[OQtima] Could not set up language protection:", e);
      }
    }

    // Check if this is a normal registration (no referral) or specific referral registration
    const isNormalRegistration =
      referralType === null ||
      referralType === undefined ||
      referralType === "";

    // Force clean language code - but preserve BR language code
    let normalizedLanguage = (language || "en").toLowerCase().trim();

    // If language is BR variant, preserve it instead of removing non-alphabetic characters
    const isBrVariant = /^(br|pt[-_]?br)$/i.test(normalizedLanguage);

    if (isBrVariant) {
      normalizedLanguage = "br"; // Normalize to simple 'br'

      // Ensure BR language is properly set in all storage mechanisms
      try {
        // Set in session storage with protection against overwriting
        sessionStorage.setItem("oqtima_tab_language", "br");
        sessionStorage.setItem("i18nextLng", "br");
        sessionStorage.setItem("lang", "br");
        sessionStorage.setItem("language", "br");
        sessionStorage.setItem("oqtima_final_language", "br");

        // Set global variables
        window.__OQTIMA_LANG_MUST_USE = "br";
        window.__OQTIMA_LOCKED_LANG = "br";
        window.__FORCE_LANGUAGE = "br";

        // Set in local storage for persistence
        try {
          localStorage.setItem("i18nextLng", "br");
          localStorage.setItem("language", "br");
        } catch (lsError) {
          console.warn(
            "[OQtima] Local storage error for BR language:",
            lsError
          );
        }

        // Set in cookies
        document.cookie = "i18next=br;path=/;max-age=3600";
        document.cookie = "language=br;path=/;max-age=3600";
        document.cookie = "lang=br;path=/;max-age=3600";
      } catch (e) {
        console.warn("[OQtima] Error setting BR language storage:", e);
      }
    } else {
      // For other languages, clean invalid characters
      normalizedLanguage = normalizedLanguage.replace(/[^a-z]/g, "");
    }

    // Always set the normalized language in global variables for reference
    window.__OQTIMA_COMPONENT_LANGUAGE = normalizedLanguage;
    window.__OQTIMA_LOCKED_LANG = normalizedLanguage;
    window.__PROTECTED_LANGUAGE = normalizedLanguage;
    window.__LAST_IFRAME_LANGUAGE = normalizedLanguage;

    // ENHANCED: Create normalized referral parameters with safe type conversions
    let normalizedReferralType = referralType;
    let normalizedReferralValue = referralValue;

    // If referralType is a valid number, convert it to a number type
    if (referralType !== null && referralType !== undefined) {
      const parsedType = parseInt(referralType, 10);
      if (!isNaN(parsedType)) {
        normalizedReferralType = parsedType;
      }
    }

    // Ensure referralValue is a string
    if (referralValue !== null && referralValue !== undefined) {
      normalizedReferralValue = String(referralValue);
    }

    // FIXED: Enhanced RTL detection - check for Arabic language variants more thoroughly
    const isRTL =
      normalizedLanguage === "ar" ||
      normalizedLanguage.startsWith("ar-") ||
      normalizedLanguage === "arabic";

    // Store RTL flag in session storage for iframe consistency ONLY - don't affect parent document
    if (typeof window !== "undefined") {
      try {
        // Use a separate key specifically for popup iframe
        sessionStorage.setItem(
          "oqtima_popup_iframe_rtl",
          isRTL ? "true" : "false"
        );

        // Set popup-specific flags, not document-wide flags
        window.__OQTIMA_POPUP_IFRAME_RTL__ = isRTL;

        // IMPORTANT: Save the current RTL state of the parent document
        if (isPageInRTLMode() && !documentRTLState.originalHtmlDir) {
          saveOriginalRTLState();
        }
      } catch (e) {
        console.warn("[OQtima] Could not store iframe RTL state:", e);
      }
    }

    // Get the baseUrl from the script source
    let baseUrl;

    // First try to get the server URL from the current script
    try {
      const scripts = document.getElementsByTagName("script");
      // Look for both minified and non-minified versions of the script
      const scriptPatterns = [
        "registration-popup-script.js",
        "registration-popup-script.min.js",
      ];

      const registrationScript = Array.from(scripts).find((script) => {
        const src = script.src || "";
        return scriptPatterns.some((pattern) => src.includes(pattern));
      });

      if (registrationScript && registrationScript.src) {
        // Extract the origin from the script src
        const scriptUrl = new URL(registrationScript.src);
        baseUrl = scriptUrl.origin;
      } else {
        // If script not found, use the value from getApiUrlFromHostname()
        baseUrl = apiUrl.replace(/\/+$/, ""); // Remove trailing slash
      }
    } catch (e) {
      console.warn("[OQtima] Error determining base URL from script:", e);
      // Fallback to apiUrl which already has the same detection logic
      baseUrl = apiUrl.replace(/\/+$/, ""); // Remove trailing slash
    }

    // Make sure baseUrl doesn't end with a slash
    baseUrl = baseUrl.replace(/\/+$/, "");

    // Preserve the original URL path structure as requested
    let urlPath =
      normalizedLanguage !== "en"
        ? `/${normalizedLanguage}/popup-registration`
        : "/popup-registration";

    // CRITICAL FIX: Add specific checks to prevent language overrides in iframe
    let iframeLang = normalizedLanguage;

    // Store the language in sessionStorage for persistence
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("oqtima_tab_language", iframeLang);
        window.__OQTIMA_COMPONENT_LANGUAGE = iframeLang;
        window.__OQTIMA_LOCKED_LANG = iframeLang;
      } catch (e) {
        console.warn("[OQtima] Could not store language in sessionStorage:", e);
      }
    }

    // Base parameters for all versions
    const params = new URLSearchParams({
      // UI display parameters
      popup: "true",
      clean: "true",
      hideHeader: "true",
      hideFooter: "true",
      hideNav: "true",
      hideExtras: "true",

      // Layout configuration
      embedded: "true",
      standalone: "true",
      formOnly: "true",
      minimal: "true",
      cleanLayout: "true",
      allowScroll: "true",

      // CRITICAL: Cross-domain enhancements
      allowCrossDomain: "true",
      crossSite: "true",
      crossOrigin: "anonymous",

      // CRITICAL: Language locking mechanism
      oqtima_lang_locked: normalizedLanguage,
      force_language: "true",
      forceLanguage: "true",
      __force_language: "true",

      // Functional parameters
      linkHelper: "true",

      // Cache busting
      _t: Date.now(),
    });

    // LANGUAGE CONFIGURATION
    // Ensure we're sending the original language code as data-lang
    // This ensures codes like 'br' are preserved and not converted to 'pt'
    params.append("data-lang", normalizedLanguage);

    // Also add as a URL fragment to ensure it's preserved
    params.append("lang_param", normalizedLanguage);

    // Store language in session storage to persist across page loads
    try {
      sessionStorage.setItem("oqtima_tab_language", normalizedLanguage);
      window.__OQTIMA_TAB_LANGUAGE__ = normalizedLanguage;

      // Set language cookie with various domain options for cross-domain access
      const setLanguageCookies = () => {
        try {
          // Get the target domain from the baseUrl
          const urlObj = new URL(baseUrl);
          const domain = urlObj.hostname;

          // Set cookies for language (multiple variations for maximum compatibility)
          document.cookie = `oqtima_tab_language=${normalizedLanguage}; path=/; max-age=3600; SameSite=None; Secure`;
          document.cookie = `oqtima_tab_language=${normalizedLanguage}; path=/; domain=${domain}; max-age=3600; SameSite=None; Secure`;

          // Try with subdomain compatibility
          if (domain.indexOf(".") !== -1) {
            const rootDomain = domain.substring(domain.indexOf("."));
            document.cookie = `oqtima_tab_language=${normalizedLanguage}; path=/; domain=${rootDomain}; max-age=3600; SameSite=None; Secure`;
          }
        } catch (e) {
          console.warn(
            "[OQtima] Could not set cross-domain cookies for language:",
            e
          );
        }
      };

      // Execute cookie setter
      setLanguageCookies();
    } catch (e) {
      console.warn("[OQtima] Could not store language in sessionStorage:", e);
    }

    // Add standard language parameters for maximum compatibility
    const languageParams = [
      "oqtima_lang_locked",
      "oqtima_lang",
      "language",
      "lang",
      "locale",
      "langParam",
      "selectedLanguage",
      "i18nextLng",
    ];

    languageParams.forEach((param) => {
      params.append(param, normalizedLanguage);
    });

    // Add RTL parameters if needed
    if (isRTL) {
      params.append("isRtl", "true");
      params.append("forceRtl", "true");
      params.append("direction", "rtl");
      params.append("dir", "rtl");
      params.append("textDirection", "rtl");
      params.append("oqtima_rtl", "true");
      params.append("layout", "rtl");
      params.append("uiMode", "rtl");
    }

    // Add mobile-specific parameters
    if (isMobile) {
      params.append("isMobile", "true");
      params.append("mobileView", "true");
      params.append("mobileScroll", "true");

      // CRITICAL: Ensure referral parameters are properly passed in mobile view
      if (normalizedReferralType != null && normalizedReferralType !== "") {
        // Add all possible parameter formats for maximum compatibility
        params.append("referral_type", normalizedReferralType);
        params.append("referralType", normalizedReferralType);
        params.append("referral-type", normalizedReferralType);

        // Store in sessionStorage for redundancy
        try {
          sessionStorage.setItem(
            "oqtima_referral_type",
            normalizedReferralType
          );
          window.__OQTIMA_REFERRAL_TYPE__ = normalizedReferralType;
        } catch (e) {
          console.warn("[Mobile] Error storing referral_type:", e);
        }
      }

      if (normalizedReferralValue != null && normalizedReferralValue !== "") {
        // Add all possible parameter formats for maximum compatibility
        params.append("referral_value", normalizedReferralValue);
        params.append("referralValue", normalizedReferralValue);
        params.append("referral-value", normalizedReferralValue);

        // Store in sessionStorage for redundancy
        try {
          sessionStorage.setItem(
            "oqtima_referral_value",
            normalizedReferralValue
          );
          window.__OQTIMA_REFERRAL_VALUE__ = normalizedReferralValue;
        } catch (e) {
          console.warn("[Mobile] Error storing referral_value:", e);
        }
      }
    }

    // ENHANCED: Add referral parameters more comprehensively
    if (
      normalizedReferralType != null &&
      normalizedReferralType !== "" &&
      normalizedReferralType !== undefined
    ) {
      // Add in multiple formats for maximum compatibility
      const referralTypeParams = [
        "referral_type", // Primary format (underscore)
        "referralType", // camelCase variant
        "referral-type", // hyphenated variant
      ];

      referralTypeParams.forEach((param) => {
        params.set(param, normalizedReferralType);
      });
    }

    // Add referral value if available
    if (
      normalizedReferralValue != null &&
      normalizedReferralValue !== "" &&
      normalizedReferralValue !== undefined &&
      // CRITICAL: Only add referral_value if we have a valid referral_type
      normalizedReferralType != null &&
      normalizedReferralType !== "" &&
      normalizedReferralType !== undefined
    ) {
      // Add in multiple formats for maximum compatibility
      const referralValueParams = [
        "referral_value", // Primary format (underscore)
        "referralValue", // camelCase variant
        "referral-value", // hyphenated variant
      ];

      referralValueParams.forEach((param) => {
        params.set(param, normalizedReferralValue);
      });

      // Store in global variable and sessionStorage for redundancy
      try {
        window.__OQTIMA_REFERRAL_VALUE__ = normalizedReferralValue;
        sessionStorage.setItem(
          "oqtima_referral_value",
          normalizedReferralValue
        );

        // Set cross-domain cookies with various domain options
        const setCrossDomainCookies = () => {
          // Extract domain info for cookie setting
          let domain;
          try {
            // Get the target domain from the baseUrl
            const urlObj = new URL(baseUrl);
            domain = urlObj.hostname;

            // Set the cookie with specific domain
            document.cookie = `oqtima_referral_value=${normalizedReferralValue}; path=/; max-age=3600; SameSite=None; Secure`;

            // Try with domain-specific cookies (multiple variations for compatibility)
            document.cookie = `oqtima_referral_value=${normalizedReferralValue}; path=/; domain=${domain}; max-age=3600; SameSite=None; Secure`;

            // Also try with a leading dot for subdomain compatibility
            if (domain.indexOf(".") !== -1) {
              const rootDomain = domain.substring(domain.indexOf("."));
              document.cookie = `oqtima_referral_value=${normalizedReferralValue}; path=/; domain=${rootDomain}; max-age=3600; SameSite=None; Secure`;
            }
          } catch (e) {
            console.warn(
              "[OQtima] Could not set cross-domain cookies for referral_value:",
              e
            );
            // Fallback to simple cookie without domain
            document.cookie = `oqtima_referral_value=${normalizedReferralValue}; path=/; max-age=3600`;
          }
        };

        // Execute the cookie setting function
        setCrossDomainCookies();
      } catch (e) {
        console.warn("[OQtima] Could not store referral value:", e);
      }
    } else {
      // For normal registration or when no referral_type exists, explicitly clear any existing referral_value values
      try {
        // CRITICAL: Remove from sessionStorage - don't set to null!
        sessionStorage.removeItem("oqtima_referral_value");

        // Clear any global variables
        if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
          delete window.__OQTIMA_REFERRAL_VALUE__;
        }

        // Clear any existing cookies
        document.cookie = "oqtima_referral_value=; path=/; max-age=0";

        // Try to clear domain-specific cookies
        try {
          if (baseUrl) {
            const urlObj = new URL(baseUrl);
            const domain = urlObj.hostname;
            document.cookie = `oqtima_referral_value=; path=/; domain=${domain}; max-age=0`;

            // Try with subdomain compatibility
            if (domain.indexOf(".") !== -1) {
              const rootDomain = domain.substring(domain.indexOf("."));
              document.cookie = `oqtima_referral_value=; path=/; domain=${rootDomain}; max-age=0`;
            }
          }
        } catch (e) {
          console.warn("[OQtima] Could not clear domain cookies:", e);
        }
      } catch (e) {
        console.warn("[OQtima] Could not clear referral value:", e);
      }
    }

    // Construct the URL path
    let finalUrl = `${baseUrl}${urlPath}?${params.toString()}#registration-form`;

    return finalUrl;
  }

  // Function to inject link handler script into iframe
  function injectLinkHandlerScript(event) {
    try {
      const iframe = event.target;

      // Try to inject a script directly into the iframe to handle link clicks
      try {
        // Create script element
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = `
            (function() {
              // Function to enhance and handle policy links
              function enhancePolicyLinks() {
                // Add CSS to make policy links more visible
                const style = document.createElement('style');
                style.innerHTML = 
                  '.popup-registration__consent .link, ' +
                  'a[href*="policy"], a[href*="terms"], a[href*="privacy"], a[href*="cookie"] { ' +
                  '  color: #ff4400 !important; ' +
                  '  text-decoration: underline !important; ' +
                  '  cursor: pointer !important; ' +
                  '  margin: 0 4px !important; ' +
                  '  transition: all 0.2s !important; ' +
                  '} ' +
                  '.popup-registration__consent .link:hover, ' +
                  'a[href*="policy"]:hover, a[href*="terms"]:hover, ' +
                  'a[href*="privacy"]:hover, a[href*="cookie"]:hover { ' +
                  '  color: #cc3600 !important; ' +
                  '  text-decoration: underline !important; ' +
                  '} ' +
                  '.popup-registration__consent { ' +
                  '  display: block !important; ' +
                  '  margin: 16px 0 !important; ' +
                  '  line-height: 1.5 !important; ' +
                  '}';
                document.head.appendChild(style);
                
                // Tracking variables for link handling
                let processingLink = false;
                let linkTimeout = null;
                
                // Handle all link clicks through event delegation
                document.addEventListener('click', function(e) {
                  // Find policy links
                  const link = e.target.closest('a.link, a[href*="policy"], a[href*="terms"], a[href*="privacy"], a[href*="cookie"]');
                  
                  if (link && link.href) {
                    // Check if it matches a policy link pattern
                    if (/policy|privacy|cookie|terms|legal|disclaimer/.test(link.href)) {
                      e.preventDefault();
                      
                      // Don't process if already handling a link
                      if (processingLink) return false;
                      
                      // Mark as processing
                      processingLink = true;
                      
                      // Store original link text
                      const originalText = link.innerHTML;
                      
                      // Add loading indicator
                      link.innerHTML = originalText + ' <span style="display: inline-block; animation: pulse 1s infinite;">...</span>';
                      
                      // Determine policy type
                      const policyType = 
                        link.href.toLowerCase().includes('privacy') ? 'Privacy' :
                        link.href.toLowerCase().includes('cookie') ? 'Cookie' :
                        link.href.toLowerCase().includes('terms') ? 'Terms' : 'Policy';
                      
                      // Send message to parent window
                      try {
                        window.parent.postMessage({
                          type: 'OQTIMA_OPEN_LINK',
                          url: link.href,
                          isPolicyLink: true,
                          policyType: policyType.toLowerCase(),
                          timestamp: Date.now()
                        }, '*');
                        
                        // Set fallback timeout
                        linkTimeout = setTimeout(function() {
                          // Try direct fallback if parent doesn't respond
                          processingLink = false;
                          link.innerHTML = originalText;
                          
                          try {
                            // Try to open directly
                            window.open(link.href, '_blank');
                          } catch(err) {
                            // console.log('Both parent and direct open failed');
                            
                            // Make the link more prominent as last resort
                            link.style.color = '#ff4400';
                            link.style.fontWeight = 'bold';
                            link.innerHTML = originalText + ' (click again)';
                            
                            // Create fallback button
                            const fallback = document.createElement('a');
                            fallback.href = link.href;
                            fallback.target = '_blank';
                            fallback.style.position = 'fixed';
                            fallback.style.bottom = '20px';
                            fallback.style.left = '20px';
                            fallback.style.background = '#ff4400';
                            fallback.style.color = 'white';
                            fallback.style.padding = '10px 15px';
                            fallback.style.borderRadius = '4px';
                            fallback.style.textDecoration = 'none';
                            fallback.style.fontWeight = 'bold';
                            fallback.style.zIndex = '999999';
                            fallback.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                            fallback.textContent = 'Open ' + policyType + ' Policy';
                            
                            document.body.appendChild(fallback);
                            
                            // Remove after 15 seconds
                      setTimeout(function() {
                              if (fallback.parentNode) {
                                fallback.parentNode.removeChild(fallback);
                              }
                            }, 15000);
                          }
                        }, 1000);
                      } catch(err) {
                        // Reset on error
                        processingLink = false;
                        link.innerHTML = originalText;
                        
                        // Try direct open
                        try {
                          window.open(link.href, '_blank');
                        } catch(err2) {
                          // console.log('Link open failed completely');
                        }
                      }
                      
                      return false;
                    }
                  }
                });
                
                // Listen for parent window response
                window.addEventListener('message', function(event) {
                  if (event.data && event.data.type === 'OQTIMA_LINK_OPENED') {
                    // Clear timeout and reset state
                    clearTimeout(linkTimeout);
                    processingLink = false;
                    
                    // Find all policy links matching the URL
                    const links = document.querySelectorAll('a.link, a[href*="policy"], a[href*="terms"], a[href*="privacy"], a[href*="cookie"]');
                    links.forEach(function(link) {
                      // Reset any links with loading indicators
                      if (link.querySelector('span') && link.innerHTML.includes('...')) {
                        // Remove any loading indicators
                        link.innerHTML = link.innerHTML.replace(/ <span style="display: inline-block; animation: pulse 1s infinite;">...<\\/span>/, '');
                      }
                    });
                  }
                });
              }
              
              // Initialize right away
              enhancePolicyLinks();
            })();
          `;
        document.head.appendChild(script);
      } catch (error) {
        // Error injecting script
        console.warn("Failed to inject link handler script:", error);
      }
    } catch (error) {
      // Error handling script injection
    }
  }

  // Modified createMobilePopup to use direct iframe approach without opening new tab
  function createMobilePopup(
    language,
    referralType,
    referralValue,
    originalBodyClasses,
    originalHtmlClasses,
    originalBodyStyle,
    originalHtmlStyle,
    originalBodyOverflow,
    originalHtmlOverflow,
    originalScrollPos
  ) {
    // CRITICAL FIX: Completely isolate popup language from parent window interference
    let finalLanguage = language;

    // Only check URL path language (highest priority) - simplified approach
    try {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0 && /^[a-z]{2}(-[a-z]{2})?$/.test(pathParts[0])) {
        const urlPathLang = pathParts[0].toLowerCase();
        if (urlPathLang && urlPathLang !== "en") {
          finalLanguage = urlPathLang;
        }
      }
    } catch (e) {
      // Ignore URL parsing errors, use passed language
    }

    // CRITICAL: Store parent window language state and prevent interference
    const parentLanguageBackup = {
      gatsbyLang:
        typeof window !== "undefined" ? window.gatsby_i18next_language : null,
      localStorage_i18nextLng: null,
      localStorage_gatsbyLang: null,
      sessionStorage_oqtimaTabLang: null,
    };

    // Backup and isolate parent window language settings
    try {
      if (typeof localStorage !== "undefined") {
        parentLanguageBackup.localStorage_i18nextLng =
          localStorage.getItem("i18nextLng");
        parentLanguageBackup.localStorage_gatsbyLang = localStorage.getItem(
          "gatsby-i18next-language"
        );
      }
      if (typeof sessionStorage !== "undefined") {
        parentLanguageBackup.sessionStorage_oqtimaTabLang =
          sessionStorage.getItem("oqtima_tab_language");
      }
    } catch (e) {
      // Ignore storage errors
    }

    // Create unique popup-specific storage keys to avoid conflicts
    const POPUP_LANG_KEY = `oqtima_popup_lang_${Date.now()}`;
    const POPUP_ISOLATED_FLAG = `oqtima_popup_isolated_${Date.now()}`;

    // Store the final language with isolation
    try {
      sessionStorage.setItem(POPUP_LANG_KEY, finalLanguage);
      sessionStorage.setItem(POPUP_ISOLATED_FLAG, "true");
      window.__POPUP_FINAL_LANGUAGE = finalLanguage;
      window.__POPUP_ISOLATED = true;
    } catch (e) {
      // Ignore storage errors
    }

    // Check if the language is RTL
    const isRTL = RTL_LANGUAGES.includes(finalLanguage);

    // Create mobile popup container
    const modalContainer = document.createElement("div");
    modalContainer.className = "popup-registration__mobile-container";
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "0";
    modalContainer.style.left = "0";
    modalContainer.style.width = "100%";
    modalContainer.style.height = "100%";
    modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalContainer.style.zIndex = "999999";
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "center";

    // Set RTL direction on the container if needed
    if (isRTL) {
      modalContainer.setAttribute("dir", "rtl");
      modalContainer.setAttribute("lang", finalLanguage);
    } else {
      modalContainer.setAttribute("lang", finalLanguage);
    }

    // Create an iframe to load the popup content
    const iframe = document.createElement("iframe");
    iframe.className = "popup-registration__mobile-fullscreen";
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.backgroundColor = "#ffffff";
    iframe.style.zIndex = "1000000";
    iframe.style.overflow = "hidden";
    iframe.style.transition = "all 0.3s ease-in-out";

    // Set RTL and language attributes for iframe
    iframe.setAttribute("lang", finalLanguage);
    if (isRTL) {
      iframe.setAttribute("dir", "rtl");
    }

    // CRITICAL FIX: Construct iframe URL with language embedded from the start
    let iframeUrl;
    try {
      // Get base URL using the existing function
      iframeUrl = constructIframeUrl(
        finalLanguage,
        referralType,
        referralValue,
        true
      );

      // Parse URL and enhance with additional language parameters
      const url = new URL(iframeUrl);
      const params = new URLSearchParams(url.search);

      // CRITICAL: Add multiple language parameters to ensure they're available immediately
      params.set("language", finalLanguage);
      params.set("lang", finalLanguage);
      params.set("langParam", finalLanguage);
      params.set("data-lang", finalLanguage);
      params.set("i18nextLng", finalLanguage);
      params.set("gatsby-i18next-language", finalLanguage);
      params.set("forceLang", "true");
      params.set("forceLanguage", "true");
      params.set("mobile", "true");
      params.set("isMobile", "true");
      params.set("popup_isolated", "true");
      params.set("prevent_lang_switch", "true");

      // Add cache busting to prevent cached English content
      params.set("_t", Date.now().toString());
      params.set("_mobile", "1");
      params.set("_isolated", "1");

      // Set referral parameters if provided
      if (
        referralType !== null &&
        referralType !== undefined &&
        referralType !== "" &&
        !isNaN(parseInt(referralType, 10))
      ) {
        const referralTypeInt = parseInt(referralType, 10);
        params.set("referral_type", referralTypeInt.toString());
        params.set("referralType", referralTypeInt.toString());
      }
      if (
        referralValue !== null &&
        referralValue !== undefined &&
        referralValue !== "" &&
        !isNaN(parseInt(referralValue, 10))
      ) {
        const referralValueInt = parseInt(referralValue, 10);
        params.set("referral_value", referralValueInt.toString());
        params.set("referralValue", referralValueInt.toString());
      }

      // Apply enhanced search parameters
      url.search = params.toString();

      // Also add language to hash as fallback
      url.hash = `lang=${finalLanguage}&isolated=true`;

      iframeUrl = url.toString();
      // console.log("[Mobile Fix] Enhanced iframe URL:", iframeUrl);
    } catch (e) {
      console.error("[Mobile Fix] Error enhancing iframe URL:", e);
      // Fallback to basic URL construction
      iframeUrl = constructIframeUrl(
        finalLanguage,
        referralType,
        referralValue,
        true
      );
    }

    // Set the iframe source
    iframe.src = iframeUrl;

    // Add the iframe to the container
    modalContainer.appendChild(iframe);

    // Add the container to the document body
    document.body.appendChild(modalContainer);

    // Add styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .popup-registration__mobile-container {
        font-family: Arial, sans-serif;
      }
      
      .popup-registration__mobile-fullscreen {
        -webkit-overflow-scrolling: touch;
      }
      
      ${
        isRTL
          ? `
      .popup-registration__mobile-container[dir="rtl"] {
        direction: rtl;
        text-align: right;
      }
      
      .popup-registration__mobile-fullscreen[dir="rtl"] {
        direction: rtl;
      }
      `
          : ""
      }
    `;
    document.head.appendChild(styleEl);

    // CRITICAL: Install language protection to prevent parent window interference
    let protectionInstalled = false;
    const installLanguageProtection = () => {
      if (protectionInstalled) return;
      protectionInstalled = true;

      // Override storage setters to protect popup language
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        // Only allow popup-specific language changes when popup is open
        if (
          window.__POPUP_ISOLATED &&
          (key === "i18nextLng" ||
            key === "gatsby-i18next-language" ||
            key === "oqtima_tab_language")
        ) {
          // If trying to set a different language than popup language, prevent it
          if (value !== finalLanguage) {
            console.warn(
              `[Popup Protection] Prevented parent window from changing ${key} from ${finalLanguage} to ${value}`
            );
            return originalSetItem.call(this, key, finalLanguage);
          }
        }
        return originalSetItem.call(this, key, value);
      };

      // Protect against direct window property changes
      if (typeof window.gatsby_i18next_language !== "undefined") {
        let protectedGatsbyLang = finalLanguage;
        Object.defineProperty(window, "gatsby_i18next_language", {
          get: function () {
            return protectedGatsbyLang;
          },
          set: function (value) {
            if (window.__POPUP_ISOLATED && value !== finalLanguage) {
              console.warn(
                `[Popup Protection] Prevented gatsby_i18next_language change from ${finalLanguage} to ${value}`
              );
              return;
            }
            protectedGatsbyLang = value;
          },
          configurable: true,
        });
      }
    };

    // Install protection immediately
    installLanguageProtection();

    // Cleanup function
    function cleanupPopup() {
      try {
        // Remove language protection
        window.__POPUP_ISOLATED = false;
        protectionInstalled = false;

        // Restore original parent window language settings
        try {
          if (parentLanguageBackup.localStorage_i18nextLng !== null) {
            localStorage.setItem(
              "i18nextLng",
              parentLanguageBackup.localStorage_i18nextLng
            );
          }
          if (parentLanguageBackup.localStorage_gatsbyLang !== null) {
            localStorage.setItem(
              "gatsby-i18next-language",
              parentLanguageBackup.localStorage_gatsbyLang
            );
          }
          if (parentLanguageBackup.sessionStorage_oqtimaTabLang !== null) {
            sessionStorage.setItem(
              "oqtima_tab_language",
              parentLanguageBackup.sessionStorage_oqtimaTabLang
            );
          }
          if (parentLanguageBackup.gatsbyLang !== null) {
            window.gatsby_i18next_language = parentLanguageBackup.gatsbyLang;
          }
        } catch (e) {
          // Ignore restoration errors
        }

        // Clean up popup-specific storage
        sessionStorage.removeItem(POPUP_LANG_KEY);
        sessionStorage.removeItem(POPUP_ISOLATED_FLAG);

        if (modalContainer && modalContainer.parentNode) {
          modalContainer.parentNode.removeChild(modalContainer);
        }
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }

        // MOBILE SPECIFIC FIX: Enhanced restoration for mobile scroll behavior
        // Restore original styles
        document.body.className = originalBodyClasses || "";
        document.documentElement.className = originalHtmlClasses || "";

        // Clear all potential CSS properties that might prevent scrolling on mobile
        const bodyStyle = document.body.style;
        const htmlStyle = document.documentElement.style;

        // Reset body styles
        if (originalBodyStyle) {
          document.body.setAttribute("style", originalBodyStyle);
        } else {
          document.body.removeAttribute("style");
        }

        // Reset html styles
        if (originalHtmlStyle) {
          document.documentElement.setAttribute("style", originalHtmlStyle);
        } else {
          document.documentElement.removeAttribute("style");
        }

        // CRITICAL MOBILE FIX: Force restore scroll capability
        bodyStyle.overflow = originalBodyOverflow || "";
        htmlStyle.overflow = originalHtmlOverflow || "";

        // Additional mobile-specific CSS resets
        bodyStyle.position = "";
        bodyStyle.height = "";
        bodyStyle.maxHeight = "";
        bodyStyle.touchAction = "";
        bodyStyle.webkitOverflowScrolling = "";
        bodyStyle.overflowScrolling = "";

        htmlStyle.position = "";
        htmlStyle.height = "";
        htmlStyle.maxHeight = "";
        htmlStyle.touchAction = "";
        htmlStyle.webkitOverflowScrolling = "";
        htmlStyle.overflowScrolling = "";

        // Force enable scrolling on mobile
        if (window.innerWidth <= 767) {
          // Mobile specific fixes using stored values
          bodyStyle.overflow = originalBodyOverflow || "auto";
          htmlStyle.overflow = originalHtmlOverflow || "auto";
          bodyStyle.touchAction =
            window.__OQTIMA_MOBILE_ORIGINAL_TOUCH_ACTION || "auto";
          bodyStyle.webkitOverflowScrolling =
            window.__OQTIMA_MOBILE_ORIGINAL_WEBKIT_OVERFLOW || "touch";

          // Remove any fixed positioning that might interfere
          bodyStyle.position = originalBodyStyle?.includes("position")
            ? originalBodyStyle.match(/position:\s*([^;]+)/)?.[1] || ""
            : "";
          htmlStyle.position = originalHtmlStyle?.includes("position")
            ? originalHtmlStyle.match(/position:\s*([^;]+)/)?.[1] || ""
            : "";

          // Ensure body and html can scroll
          bodyStyle.height = originalBodyStyle?.includes("height")
            ? originalBodyStyle.match(/height:\s*([^;]+)/)?.[1] || ""
            : "";
          htmlStyle.height = originalHtmlStyle?.includes("height")
            ? originalHtmlStyle.match(/height:\s*([^;]+)/)?.[1] || ""
            : "";

          // Remove the top positioning that was applied for fixed positioning
          bodyStyle.top = "";
          bodyStyle.width = originalBodyStyle?.includes("width")
            ? originalBodyStyle.match(/width:\s*([^;]+)/)?.[1] || ""
            : "";

          // Clear mobile-specific stored variables
          delete window.__OQTIMA_MOBILE_ORIGINAL_TOUCH_ACTION;
          delete window.__OQTIMA_MOBILE_ORIGINAL_WEBKIT_OVERFLOW;
        }

        // Restore scroll position with a small delay for mobile
        setTimeout(() => {
          // Use mobile-specific scroll coordinates if available, otherwise fallback to originalScrollPos
          const mobileScrollX = window.__OQTIMA_MOBILE_SCROLL_X || 0;
          const mobileScrollY =
            window.__OQTIMA_MOBILE_SCROLL_Y || originalScrollPos || 0;

          window.scrollTo(mobileScrollX, mobileScrollY);

          // Additional mobile scroll restoration attempts
          if (window.innerWidth <= 767) {
            // Try multiple scroll restoration methods for mobile
            document.body.scrollTop = mobileScrollY;
            document.documentElement.scrollTop = mobileScrollY;

            // Force reflow to ensure styles are applied
            document.body.offsetHeight;
            document.documentElement.offsetHeight;

            // Final scroll attempt
            setTimeout(() => {
              window.scrollTo(mobileScrollX, mobileScrollY);

              // Clean up mobile scroll variables
              delete window.__OQTIMA_MOBILE_SCROLL_X;
              delete window.__OQTIMA_MOBILE_SCROLL_Y;
            }, 50);
          }
        }, 10);
      } catch (e) {
        console.error("[Mobile] Error in cleanup:", e);

        // Emergency mobile scroll fix in case of errors
        if (window.innerWidth <= 767) {
          try {
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
            document.body.style.touchAction =
              window.__OQTIMA_MOBILE_ORIGINAL_TOUCH_ACTION || "auto";
            document.body.style.webkitOverflowScrolling =
              window.__OQTIMA_MOBILE_ORIGINAL_WEBKIT_OVERFLOW || "touch";
            document.body.style.position = "";
            document.documentElement.style.position = "";
            document.body.style.height = "";
            document.documentElement.style.height = "";
            document.body.style.top = "";
            document.body.style.width = "";

            // Use stored mobile scroll coordinates for emergency restoration
            const emergencyScrollX = window.__OQTIMA_MOBILE_SCROLL_X || 0;
            const emergencyScrollY =
              window.__OQTIMA_MOBILE_SCROLL_Y || originalScrollPos || 0;

            setTimeout(() => {
              window.scrollTo(emergencyScrollX, emergencyScrollY);

              // Clean up mobile variables in emergency case too
              delete window.__OQTIMA_MOBILE_SCROLL_X;
              delete window.__OQTIMA_MOBILE_SCROLL_Y;
              delete window.__OQTIMA_MOBILE_ORIGINAL_TOUCH_ACTION;
              delete window.__OQTIMA_MOBILE_ORIGINAL_WEBKIT_OVERFLOW;
            }, 100);
          } catch (emergencyError) {
            console.error(
              "[Mobile] Emergency scroll fix failed:",
              emergencyError
            );
          }
        }
      }
    }

    // ENHANCED: Send parameters to iframe with strong language isolation
    const sendParamsToIframe = () => {
      try {
        // Create message data with all necessary parameters
        const messageData = {
          type: "REGISTRATION_PARAMS",
          data: {
            language: finalLanguage,
            isRTL: isRTL,
            isMobile: true,
            mobileView: true,
            mobileScroll: true,
            // CRITICAL: Ensure referral parameters are included in all formats
            referral_type: referralType,
            referralType: referralType,
            "referral-type": referralType,
            referral_value: referralValue,
            referralValue: referralValue,
            "referral-value": referralValue,
            // Add isolation flags
            isolated: true,
            popupMode: true,
            parentLang: finalLanguage,
            parentDir: isRTL ? "rtl" : "ltr",
            timestamp: Date.now(),
          },
        };

        // Store parameters in sessionStorage for redundancy
        try {
          if (referralType) {
            sessionStorage.setItem("oqtima_referral_type", referralType);
            window.__OQTIMA_REFERRAL_TYPE__ = referralType;
          }
          if (referralValue) {
            sessionStorage.setItem("oqtima_referral_value", referralValue);
            window.__OQTIMA_REFERRAL_VALUE__ = referralValue;
          }
        } catch (e) {
          console.warn(
            "[Mobile] Error storing parameters in sessionStorage:",
            e
          );
        }

        // Send message to iframe with multiple retries for mobile reliability
        const sendMessage = () => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (e) {
            console.warn("[Mobile] Error sending message to iframe:", e);
          }
        };

        // Send immediately
        sendMessage();

        // Retry after short delay
        setTimeout(sendMessage, 100);

        // Additional retry after longer delay for mobile devices
        setTimeout(sendMessage, 500);

        // Final retry after 1 second
        setTimeout(sendMessage, 1000);
      } catch (err) {
        console.error("[Mobile] Error in sendParamsToIframe:", err);
      }
    };

    // Set up iframe load event
    iframe.addEventListener("load", function () {
      // Send parameters immediately when iframe loads
      sendParamsToIframe();
    });

    // Listen for messages from the iframe
    const messageHandler = function (event) {
      try {
        if (event.data && typeof event.data === "object") {
          // Handle close popup message - support multiple formats
          const shouldClosePopup =
            event.data.type === "OQTIMA_CLOSE_POPUP" ||
            event.data.type === "CLOSE_POPUP" ||
            event.data.action === "close";

          if (shouldClosePopup) {
            // Use the global close function for consistency
            if (window.__OQTIMA_CLOSE_POPUP) {
              window.__OQTIMA_CLOSE_POPUP();
            } else {
              cleanupPopup();
              window.removeEventListener("message", messageHandler);
              document.removeEventListener("keydown", keyDownHandler);
            }
            return; // Exit after handling close
          }

          // Handle iframe ready message - send params again if needed
          if (event.data.type === "IFRAME_READY") {
            sendParamsToIframe();
          }

          // CRITICAL: Prevent iframe from being influenced by parent language changes
          if (
            event.data.type === "LANGUAGE_CHANGED" &&
            event.data.language !== finalLanguage
          ) {
            // Send the correct language back
            sendParamsToIframe();
          }
        }

        // Also handle simple string messages
        if (event.data === "close_popup") {
          if (window.__OQTIMA_CLOSE_POPUP) {
            window.__OQTIMA_CLOSE_POPUP();
          } else {
            cleanupPopup();
            window.removeEventListener("message", messageHandler);
            document.removeEventListener("keydown", keyDownHandler);
          }
          return;
        }
      } catch (e) {
        // Error handling message - continue execution
      }
    };

    // Add message listener
    window.addEventListener("message", messageHandler);

    // Auto-cleanup after 30 minutes for safety
    setTimeout(() => {
      // Use the global close function for consistency
      if (window.__OQTIMA_CLOSE_POPUP) {
        window.__OQTIMA_CLOSE_POPUP();
      } else {
        cleanupPopup();
        window.removeEventListener("message", messageHandler);
        document.removeEventListener("keydown", keyDownHandler);
      }
    }, 30 * 60 * 1000);

    // CRITICAL: Override ALL parent window language references
    try {
      // Force override parent language settings
      sessionStorage.setItem("oqtima_parent_lang", finalLanguage); // Override parent lang
      sessionStorage.setItem("oqtima_parent_dir", isRTL ? "rtl" : "ltr");
      sessionStorage.setItem("oqtima_popup_isolated", "true");

      // Set all possible language storage keys to final language
      const languageKeys = [
        "i18nextLng",
        "gatsby-i18next-language",
        "oqtima_tab_language",
        "oqtima_enforced_language",
        "oqtima_final_language",
        "oqtima_selected_language",
        "lang",
        "language",
        "locale",
      ];

      languageKeys.forEach((key) => {
        try {
          sessionStorage.setItem(key, finalLanguage);
          // Also try localStorage if available
          localStorage.setItem(key, finalLanguage);
        } catch (e) {
          // Ignore storage errors
        }
      });
    } catch (e) {
      console.warn("[Mobile Popup] Error setting language overrides:", e);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Check for both types of registration elements
      const containers = document.querySelectorAll("[data-oqtima-register]");
      const triggers = document.querySelectorAll("[data-oqtima-trigger]");

      if (containers.length > 0 || triggers.length > 0) {
        // Add loading state to legacy buttons if they exist
        if (containers.length > 0) {
          addLoadingStateToButtons(containers);
        }
        // Initialize registration process
        initOqtimaRegistration();
      } else {
        // Only warn if no registration elements are found at all
        console.warn(
          "No registration elements found (neither [data-oqtima-register] nor [data-oqtima-trigger])"
        );
      }
    });
  } else {
    // Check for both types of registration elements
    const containers = document.querySelectorAll("[data-oqtima-register]");
    const triggers = document.querySelectorAll("[data-oqtima-trigger]");

    if (containers.length > 0 || triggers.length > 0) {
      // Add loading state to legacy buttons if they exist
      if (containers.length > 0) {
        addLoadingStateToButtons(containers);
      }
      // Initialize registration process
      initOqtimaRegistration();
    } else {
      // Only warn if no registration elements are found at all
      console.warn(
        "No registration elements found (neither [data-oqtima-register] nor [data-oqtima-trigger])"
      );
    }
  }

  /**
   * Add loading state to registration button containers
   */
  function addLoadingStateToButtons(containers) {
    // Create a default button text
    const defaultButtonText = "GET STARTED";

    // Detect the most suitable language for the page
    let detectedLanguage = "en";

    // Try to detect language from various sources in priority order
    try {
      // 1. Check session storage first (highest priority)
      if (sessionStorage.getItem("oqtima_tab_language")) {
        detectedLanguage = sessionStorage.getItem("oqtima_tab_language");
      }
      // 2. Check HTML lang attribute
      else if (document.documentElement.lang) {
        detectedLanguage = document.documentElement.lang.toLowerCase();
      }
      // 3. Check URL path for language code
      else if (window.location.pathname) {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        if (
          pathParts.length > 0 &&
          /^[a-z]{2}(-[a-z]{2})?$/.test(pathParts[0])
        ) {
          detectedLanguage = pathParts[0].toLowerCase();
        }
      }
      // 4. Try browser language as last resort
      else if (navigator.language) {
        detectedLanguage = navigator.language.split("-")[0].toLowerCase();
      }
    } catch (e) {
      // console.warn("[OQtima] Error detecting language:", e);
    }

    // Skip loading state and immediately create the buttons
    containers.forEach((container) => {
      // Get button attributes if available
      const text = container.getAttribute("data-text") || defaultButtonText;
      // Use detected language as fallback if data-lang is not set
      const lang = container.getAttribute("data-lang") || detectedLanguage;

      // FIXED: Parse referral_type as integer when reading from data attribute
      let referralType = container.getAttribute("data-referral-type");
      const referralValue = container.getAttribute("data-referral-value");

      // Convert referral_type to integer if it's numeric
      if (referralType) {
        const parsedType = parseInt(referralType, 10);
        if (!isNaN(parsedType)) {
          referralType = parsedType;
        } else {
          // console.warn(
          //   "data-referral-type is not a valid integer:",
          //   referralType
          // );
        }
      }

      // IMPORTANT: We always keep the container in LTR mode, even if data-lang="ar"
      // This prevents the button from shifting to the right side of the page
      container.setAttribute("dir", "ltr");

      // Ensure the container itself doesn't inherit RTL styles
      container.style.direction = "ltr";
      container.style.textAlign = "";

      // Set language on the container
      container.setAttribute("data-lang", lang);

      // Create button element with full styling
      container.innerHTML = `
        <button 
          type="button" 
          data-lang="${lang}"
          class="oqtima-registration-button" 
          style="
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            padding: 14px 25px !important;
            background-color: #ff4400 !important;
            color: white !important;
            border: none !important;
            border-radius: 50px !important;
            font-size: 20px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 99999 !important;
            margin: 10px !important;
            pointer-events: auto !important;
            transition: all 0.3s ease-in-out !important;
            text-align: center !important;
            text-decoration: none !important;
            box-shadow: 0 4px 6px rgba(255, 68, 0, 0.1) !important;
            direction: ltr !important;
          "
        >${text}</button>
      `;

      // Add click event listener
      const button = container.querySelector(".oqtima-registration-button");
      if (button) {
        // Ensure button text alignment is always left-to-right
        // Preserve the language attribute for the button
        button.setAttribute("data-lang", lang);
        button.setAttribute("dir", "ltr");

        button.addEventListener("click", function (event) {
          event.preventDefault();

          // Store the popup mode flag
          if (window.sessionStorage) {
            try {
              sessionStorage.setItem("oqtima_popup_mode", "true");

              // Only store referral parameters if they are valid and for specific referral types
              // IB Referral Link (type 12) or Campaign Link (type 14)
              const isValidReferralType =
                referralType === 12 || referralType === 14;

              // Clear existing referral parameters for normal registration
              if (!isValidReferralType) {
                // CRITICAL: Make sure to completely remove these keys, not set them to null
                if (sessionStorage.getItem("oqtima_referral_type") !== null) {
                  sessionStorage.removeItem("oqtima_referral_type");
                }

                if (sessionStorage.getItem("oqtima_referral_value") !== null) {
                  sessionStorage.removeItem("oqtima_referral_value");
                }
              }
              // Only store for specific referral types
              else if (referralType && isValidReferralType) {
                sessionStorage.setItem("oqtima_referral_type", referralType);
                if (referralValue) {
                  sessionStorage.setItem(
                    "oqtima_referral_value",
                    referralValue
                  );
                } else {
                  // If referral_type is valid but referral_value is missing,
                  // ensure we remove any existing referral_value
                  if (
                    sessionStorage.getItem("oqtima_referral_value") !== null
                  ) {
                    sessionStorage.removeItem("oqtima_referral_value");
                  }
                }
              }
            } catch (e) {
              console.warn("Error storing parameters in sessionStorage:", e);
            }
          }

          // Set global variables for referral parameters
          window.__OQTIMA_REFERRAL_TYPE__ = referralType;
          window.__OQTIMA_REFERRAL_VALUE__ = referralValue;

          // Open registration popup with standardized parameter names
          openRegistrationPopup({
            lang,
            referral_type: referralType,
            referral_value: referralValue,
            // Flag to indicate this was opened from a button that should not be affected by RTL
            preserveParentDirection: true,
          });
        });
      }
    });
  }

  // RTL Preservation functions

  // Function to save original RTL state
  function saveOriginalRTLState() {
    try {
      if (typeof document === "undefined") return;

      // Save HTML attributes
      documentRTLState.originalHtmlDir =
        document.documentElement.getAttribute("dir");
      documentRTLState.originalHtmlLang =
        document.documentElement.getAttribute("lang");
      documentRTLState.originalHtmlClasses = document.documentElement.className;
      documentRTLState.originalHtmlRtl =
        document.documentElement.getAttribute("data-rtl");

      // Save BODY attributes
      documentRTLState.originalBodyDir = document.body.getAttribute("dir");
      documentRTLState.originalBodyClasses = document.body.className;
      documentRTLState.originalBodyRtl = document.body.getAttribute("data-rtl");
    } catch (e) {
      console.error("[OQtima] Error saving RTL state:", e);
    }
  }

  // Function to restore original RTL state
  function restoreOriginalRTLState() {
    try {
      if (typeof document === "undefined") return;

      // Restore HTML attributes
      if (documentRTLState.originalHtmlDir) {
        document.documentElement.setAttribute(
          "dir",
          documentRTLState.originalHtmlDir
        );
      }
      if (documentRTLState.originalHtmlLang) {
        document.documentElement.setAttribute(
          "lang",
          documentRTLState.originalHtmlLang
        );
      }
      document.documentElement.className =
        documentRTLState.originalHtmlClasses || "";
      if (documentRTLState.originalHtmlRtl) {
        document.documentElement.setAttribute(
          "data-rtl",
          documentRTLState.originalHtmlRtl
        );
      }

      // Restore BODY attributes
      if (documentRTLState.originalBodyDir) {
        document.body.setAttribute("dir", documentRTLState.originalBodyDir);
      }
      document.body.className = documentRTLState.originalBodyClasses || "";
      if (documentRTLState.originalBodyRtl) {
        document.body.setAttribute(
          "data-rtl",
          documentRTLState.originalBodyRtl
        );
      }

      // console.log("[OQtima] Original RTL state restored");
    } catch (e) {
      console.error("[OQtima] Error restoring RTL state:", e);
    }
  }

  // Function to check if page is in RTL mode
  function isPageInRTLMode() {
    if (typeof document === "undefined") return false;

    const htmlDir = document.documentElement.getAttribute("dir");
    const htmlClasses = document.documentElement.className || "";
    const bodyDir = document.body.getAttribute("dir");
    const bodyClasses = document.body.className || "";

    return (
      htmlDir === "rtl" ||
      bodyDir === "rtl" ||
      htmlClasses.includes("rtl") ||
      bodyClasses.includes("rtl")
    );
  }

  // Function to protect RTL attributes from modification
  function protectRTLAttributes() {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    // Save current RTL state if not already saved
    if (isPageInRTLMode() && !documentRTLState.originalHtmlDir) {
      saveOriginalRTLState();
    }

    // Skip if not in RTL mode
    if (!isPageInRTLMode()) return;

    // console.log("[OQtima] Adding RTL attribute protection");

    // Keep a reference to the original methods
    const originalHtmlSetAttribute = Element.prototype.setAttribute;
    const originalHtmlRemoveAttribute = Element.prototype.removeAttribute;
    const originalAddClass = DOMTokenList.prototype.add;
    const originalRemoveClass = DOMTokenList.prototype.remove;

    // Override setAttribute method
    Element.prototype.setAttribute = function (name, value) {
      // Only protect HTML and BODY elements
      if (this === document.documentElement || this === document.body) {
        // Protect RTL-related attributes
        if (
          name === "dir" &&
          value !== "rtl" &&
          documentRTLState.originalHtmlDir === "rtl"
        ) {
          return originalHtmlSetAttribute.call(this, name, "rtl");
        }

        if (
          name === "data-rtl" &&
          value !== "true" &&
          documentRTLState.originalHtmlRtl === "true"
        ) {
          return originalHtmlSetAttribute.call(this, name, "true");
        }
      }

      // Call original method for all other cases
      return originalHtmlSetAttribute.call(this, name, value);
    };

    // Override removeAttribute method
    Element.prototype.removeAttribute = function (name) {
      // Only protect HTML and BODY elements
      if (
        (this === document.documentElement || this === document.body) &&
        (name === "dir" || name === "data-rtl") &&
        documentRTLState.originalHtmlDir === "rtl"
      ) {
        return;
      }

      // Call original method for all other cases
      return originalHtmlRemoveAttribute.call(this, name);
    };

    // Override classList.remove method to protect RTL classes
    DOMTokenList.prototype.remove = function (...tokens) {
      // Only protect HTML and BODY classList
      if (
        this === document.documentElement.classList ||
        this === document.body.classList
      ) {
        const rtlTokens = tokens.filter(
          (t) => t === "rtl" || t === "rtl-active"
        );
        const nonRtlTokens = tokens.filter(
          (t) => t !== "rtl" && t !== "rtl-active"
        );

        if (
          rtlTokens.length > 0 &&
          documentRTLState.originalHtmlDir === "rtl"
        ) {
          // Only process non-RTL tokens
          if (nonRtlTokens.length > 0) {
            return originalRemoveClass.apply(this, nonRtlTokens);
          }
          return;
        }
      }

      // Call original method for all other cases
      return originalRemoveClass.apply(this, tokens);
    };

    // Setup cleanup function
    window.__OQTIMA_UNPROTECT_RTL_ATTRIBUTES__ = function () {
      // Restore original methods
      Element.prototype.setAttribute = originalHtmlSetAttribute;
      Element.prototype.removeAttribute = originalHtmlRemoveAttribute;
      DOMTokenList.prototype.remove = originalRemoveClass;
    };
  }

  // Apply RTL protection in openRegistrationPopup function

  // Create global emergency restore function that can be called from console
  window.__OQTIMA_EMERGENCY_RESTORE_SCROLL = function () {
    try {
      // Reset all scroll-affecting properties
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Remove any popup-related classes
      document.body.classList.remove("oqtima-iframe-open");
      document.body.classList.remove("oqtima-mobile-open");
      document.body.classList.remove("popup-open");
      document.documentElement.classList.remove("oqtima-mobile-open");
      document.body.classList.remove("oqtima-mobile-modal-open");
      document.documentElement.classList.remove("oqtima-mobile-popup-open");
      document.body.classList.remove("oqtima-mobile-popup-open");

      // Try to remove any modal containers that might be left
      const modalContainer = document.querySelector(".popup-registration");
      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }

      const loadingOverlay = document.querySelector(".oqtima-loading-overlay");
      if (loadingOverlay && loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    } catch (e) {
      // console.error("[OQtima] Error in emergency scroll restoration:", e);
    }
  };

  // Function to initialize the registration script
  function init() {
    try {
      // Check if already initialized to prevent double initialization
      if (window.__OQTIMA_INITIALIZED__) {
        return;
      }

      // Add styles if not already added
      if (!document.querySelector("style#oqtima-registration-styles")) {
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
          
          /* Ensure buttons maintain center text alignment in RTL mode */
          .rtl-active button,
          .rtl-active .button,
          .rtl-active input[type="submit"],
          .rtl-active input[type="button"],
          .rtl-active .submit-button,
          .rtl-active .form-button {
            text-align: center !important;
          }
          
          /* Specifically target the submit buttons */
          .rtl-active .popup-registration__button-submit,
          .rtl-active form button[type="submit"],
          .rtl-active button.submit-registration {
            text-align: center !important;
          }
          
          .rtl-active .popup-registration__container {
            display: flex !important;
            flex-direction: row-reverse !important;
          }

          .rtl-active .popup-registration__sidebar {
            order: 2 !important;
            border-radius: 0 10px 10px 0 !important;
          }

          .rtl-active .popup-registration__content {
            order: 1 !important;
            border-radius: 10px 0 0 10px !important;
          }
          
          /* For mobile devices */
          @media (max-width: 767px) {
            .rtl-active .popup-registration__container {
              flex-direction: column !important;
            }
            
            .rtl-active .popup-registration__sidebar {
              border-radius: 10px 10px 0 0 !important;
            }
            
            .rtl-active .popup-registration__content {
              border-radius: 0 0 10px 10px !important;
            }
          }
          
          /* Mirror spacing and positioning */
          .rtl-active .form-item label {
            text-align: right !important;
          }
        `;
        document.head.appendChild(rtlInlineStyles);
      }

      // Set initialization flag
      window.__OQTIMA_INITIALIZED__ = true;
    } catch (error) {
      // console.error("[OQtima] Error in init function:", error);
    }
  }

  // Expose the necessary functions to global scope through a namespace
  window.OqtimaRegistration = {
    init: init,
    openRegistrationPopup: openRegistrationPopup,
    initOqtimaRegistration: initOqtimaRegistration,

    // Helper function to trigger registration from code
    // Usage: OqtimaRegistration.trigger({ lang: 'en', referral_type: 12, referral_value: 'IB12345' });
    trigger: function (params = {}) {
      // Handle the case where params use legacy parameter names (referralType/referralValue)
      if (
        params.referralType !== undefined &&
        params.referral_type === undefined
      ) {
        params.referral_type = params.referralType;
      }

      if (
        params.referralValue !== undefined &&
        params.referral_value === undefined
      ) {
        params.referral_value = params.referralValue;
      }

      // Ensure we have a language
      params.lang = params.lang || params.language || "en";

      // Store parameters in session storage if available
      if (window.sessionStorage) {
        try {
          sessionStorage.setItem("oqtima_popup_mode", "true");

          // Store referral parameters
          if (params.referral_type) {
            sessionStorage.setItem(
              "oqtima_referral_type",
              params.referral_type
            );
          }
          if (params.referral_value) {
            sessionStorage.setItem(
              "oqtima_referral_value",
              params.referral_value
            );
          }
        } catch (e) {
          // console.warn(
          //   "[OQtima] Error storing parameters in sessionStorage:",
          //   e
          // );
        }
      }

      // Set global variables for referral parameters
      window.__OQTIMA_REFERRAL_TYPE__ = params.referral_type;
      window.__OQTIMA_REFERRAL_VALUE__ = params.referral_value;

      // Open the registration popup
      openRegistrationPopup(params);
    },
  };

  // Check if the DOM is already loaded
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // DOM is already ready, initialize immediately
    setTimeout(init, 0); // Use setTimeout to ensure execution after the current script
  } else {
    // DOM is not ready yet, wait for DOMContentLoaded event
    document.addEventListener("DOMContentLoaded", init);

    // Also add a window.onload fallback for browsers that don't support DOMContentLoaded
    window.addEventListener("load", function () {
      if (!window.__OQTIMA_INITIALIZED__) {
        init();
      }
    });
  }

  // If we detect a referral URL, set a flag to open it immediately
  if (
    urlParams.get("referral_popup") === "true" ||
    urlParams.get("open_registration") === "true"
  ) {
    if (apiKey) {
      window.__OQTIMA_AUTO_OPEN_POPUP = true;
      window.__OQTIMA_URL_PARAM_LANG =
        urlParams.get("lang") ||
        urlParams.get("language") ||
        urlParams.get("i18nextLng") ||
        "en";

      // Get additional URL parameters
      if (urlParams.get("referral_type")) {
        window.__OQTIMA_URL_REFERRAL_TYPE = urlParams.get("referral_type");
      }
      if (urlParams.get("referral_value")) {
        window.__OQTIMA_URL_REFERRAL_VALUE = urlParams.get("referral_value");
      }
    }
  }
})();
