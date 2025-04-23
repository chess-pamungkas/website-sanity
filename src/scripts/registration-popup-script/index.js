/**
 * Oqtima Registration Popup Script
 * This script provides a registration popup for Oqtima's landing pages.
 * It handles creating registration buttons, opening the popup using iframe, and ensuring
 * consistent display and styling for both RTL and non-RTL languages.
 */

"use strict";

// Wrap everything in an IIFE to avoid top-level return
(function () {
  // Remove debug mode
  const debug = false;

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
        console.log("[OQtima] Using script source for API URL:", baseUrl);
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
  const backendApiUrl = mapBackendApiUrl();
  const environment = getEnvironmentFromHostname();

  // MODIFIED: Always proceed with initialization regardless of hostname or environment
  // if (!apiUrl || !environment) {
  //   return;
  // }

  let isValidated = false;

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

      console.log("[OQtima] Verifying API key");

      try {
        // Make API call to verify the key
        const isValid = await verifyApiKey(apiKey);

        if (isValid) {
          console.log("[OQtima] API key verified successfully");
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

      console.log(
        `[OQtima] Verifying API key with endpoint: ${verifyEndpoint}`
      );

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

    // Find all registration button containers
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
            <strong>OQtima Registration Button Error:</strong><br>
            ${message}<br>
          <small>(This error is only visible in development mode)</small>
          </div>
        `;
      } else {
        // In production, just hide the containers
        container.style.display = "none";
      }
    });
  }

  /**
   * Initialize registration components
   */
  function initRegistrationComponents() {
    const containers = document.querySelectorAll("[data-oqtima-register]");
    if (containers.length === 0) return;

    addStyles();
    containers.forEach((container) => createRegistrationButton(container));
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
      /* Force container visibility */
      [data-oqtima-register] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: 40px !important;
        position: relative !important;
        z-index: 9999 !important;
        text-align: left !important;
      }

      /* Base styles for .oqtima-registration-button */
      .oqtima-registration-button {
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
      }

      /* Mobile devices */
      @media screen and (max-width: 767px) {
        .oqtima-registration-button {
          width: calc(100% - 20px) !important;
          padding: 12px 20px !important;
          font-size: 16px !important;
          margin: 10px !important;
          white-space: nowrap !important;
          overflow-y: auto !important;
          text-overflow: ellipsis !important;
        }
      }

      /* Tablet devices */
      @media screen and (min-width: 768px) {
        .oqtima-registration-button {
          padding: 14px 30px !important;
          font-size: 18px !important;
          min-width: 200px !important;
        }
      }

      /* Desktop devices */
      @media screen and (min-width: 1024px) {
        .oqtima-registration-button {
          padding: 16px 35px !important;
          font-size: 20px !important;
          min-width: 220px !important;
        }
      }

      /* Large desktop devices */
      @media screen and (min-width: 1920px) {
        .oqtima-registration-button {
          padding: 18px 40px !important;
          font-size: 22px !important;
          min-width: 250px !important;
        }
      }

      /* Hover state */
      .oqtima-registration-button:hover {
        background-color: #cc3600 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 12px rgba(255, 68, 0, 0.2) !important;
      }

      /* Active state */
      .oqtima-registration-button:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 4px rgba(255, 68, 0, 0.1) !important;
      }

      /* Ensure no styles are hidden */
      .oqtima-registration-button * {
        visibility: visible !important;
        opacity: 1 !important;
      }

      /* Mobile */
      @media screen and (max-width: 767px) {
        #oqtima-registration-modal {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 2147483647 !important;
          background-color: #fff !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
        }
        
        .popup-registration__wrapper {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
        }
        
        .popup-registration__container {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow-y: auto !important;
        }

        .popup-registration__sidebar {
          flex: 0 0 auto !important;
          position: relative !important;
          width: 100% !important;
          padding: 20px !important;
          background: #2a3b90 !important;
          z-index: 2 !important;
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
          width: 1280px !important;
          max-width: 1280px !important;
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

    // Verify styles are applied
    const testButton = document.querySelector(".oqtima-registration-button");
    if (testButton) {
      const computedStyle = window.getComputedStyle(testButton);
    }
  }

  /**
   * Create a registration button within the provided container
   */
  function createRegistrationButton(container) {
    // Get button attributes
    const text = container.getAttribute("data-text") || "GET STARTED";
    const lang = container.getAttribute("data-lang") || "en";
    const referralType = container.getAttribute("data-referral-type");
    const referralValue = container.getAttribute("data-referral-value");

    // Log attributes for debugging
    console.log("[OQtima] Creating registration button with attributes:", {
      text,
      lang,
      referralType,
      referralValue,
    });

    // Create button element
    const button = document.createElement("button");
    button.type = "button";
    button.className = "oqtima-registration-button";
    if (lang === "jp") {
      button.classList.add("jp");
    }
    button.textContent = text;

    // Force button visibility
    button.style.cssText = `
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 99999 !important;
      `;

    // Clear container and append button
    container.innerHTML = "";
    container.appendChild(button);

    // Add click handler
    button.addEventListener("click", function (event) {
      event.preventDefault();
      console.log(
        "[OQtima] Button clicked, opening popup with language:",
        lang
      );
      openRegistrationPopup({ lang, referralType, referralValue });
    });

    return button;
  }

  /**
   * Opens the registration popup with the given parameters using iframe
   * Ensures consistent styling and behavior for both RTL and non-RTL languages
   */
  function openRegistrationPopup(options = {}) {
    // CRITICAL: Save the original RTL state at the very beginning
    if (isPageInRTLMode()) {
      console.log("[OQtima] Page is in RTL mode - saving original state");
      saveOriginalRTLState();

      // CRITICAL: Add protection for RTL attributes to prevent any modifications
      protectRTLAttributes();
    }

    // Log parameters for debugging
    console.log(
      "[OQtima] Opening registration popup with parameters:",
      JSON.stringify(options)
    );

    // ENHANCED: Create standardized params object with all possible variations of parameters
    const params = { ...options };

    // ENHANCED: Normalize language parameter - support multiple parameter names
    params.language =
      params.language ||
      params.lang ||
      params["data-lang"] ||
      params.langParam ||
      "en";
    console.log("[OQtima] Language set to:", params.language);

    // Store the original data-lang parameter separately as it has special handling for RTL
    const dataLang = params["data-lang"];
    console.log("[OQtima] Data-lang parameter:", dataLang);

    // IMPROVED: Check if URL path contains language indicator
    try {
      if (typeof window !== "undefined" && window.location.pathname) {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        // If first path segment looks like a language code, use it as priority
        if (pathParts.length > 0 && pathParts[0].length <= 7) {
          console.log("[OQtima] Detected language in URL path:", pathParts[0]);
          // Special handling for Brazilian Portuguese
          if (pathParts[0] === "br") {
            params.language = "br";
            console.log(
              "[OQtima] Overriding language with Brazilian Portuguese (br) from URL path"
            );
          }
          // Special handling for Arabic in URL path
          if (pathParts[0] === "ar") {
            params.language = "ar";
            console.log(
              "[OQtima] Overriding language with Arabic (ar) from URL path"
            );
          }
        }
      }
    } catch (e) {
      console.warn("[OQtima] Error checking URL path for language:", e);
    }

    // FIXED: Enhanced RTL detection - check for Arabic language variants more thoroughly
    const normalizedLanguage = (params.language || "").toLowerCase().trim();
    params.isRTL =
      normalizedLanguage === "ar" ||
      normalizedLanguage.startsWith("ar-") ||
      normalizedLanguage === "arabic" ||
      (dataLang && dataLang.toLowerCase() === "ar");

    console.log(
      "[OQtima] RTL mode:",
      params.isRTL ? "ENABLED" : "disabled",
      "for language:",
      normalizedLanguage
    );

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
        console.log(
          `[OQtima] Found referral_type in parameter "${key}":`,
          params[key]
        );
        break;
      }
    }

    // ENHANCED: Extract referral_value from all possible parameter names
    for (const key of possibleReferralValues) {
      if (params[key] && !params.referral_value) {
        params.referral_value = params[key];
        console.log(
          `[OQtima] Found referral_value in parameter "${key}":`,
          params[key]
        );
        break;
      }
    }

    // ENHANCED: Try to extract referral parameters from URL query string if not provided in params
    try {
      if (
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
              console.log(
                `[OQtima] Found referral_type in URL parameter "${key}":`,
                value
              );
              break;
            }
          }
        }

        if (!params.referral_value) {
          for (const key of possibleReferralValues) {
            const value = urlParams.get(key);
            if (value) {
              params.referral_value = value;
              console.log(
                `[OQtima] Found referral_value in URL parameter "${key}":`,
                value
              );
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
        console.log("[OQtima] Converted referral_type to integer:", parsedType);
      } else {
        console.warn(
          "[OQtima] referral_type is not a valid integer:",
          params.referral_type
        );
      }
    }

    // Log referral parameters to confirm they are properly identified
    if (params.referral_type && params.referral_value) {
      console.log("[OQtima] Referral parameters identified:", {
        referral_type: params.referral_type,
        referral_value: params.referral_value,
      });
    } else {
      console.log("[OQtima] No complete referral parameters found");
    }

    // Generate unique session ID for this tab instance (helps with debugging)
    const tabSessionId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Store original document state
    const originalDocDir =
      document.documentElement.getAttribute("dir") || "ltr";
    const originalDocLang =
      document.documentElement.getAttribute("lang") || "en";
    const originalBodyDir = document.body.getAttribute("dir") || "ltr";

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
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${originalScrollPos}px`;
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

        // ENHANCED: Ensure referral parameters are stored in sessionStorage
        if (params.referral_type != null) {
          console.log(
            "[OQtima] Storing referral_type in sessionStorage:",
            params.referral_type
          );
          sessionStorage.setItem("oqtima_referral_type", params.referral_type);
        }
        if (params.referral_value) {
          console.log(
            "[OQtima] Storing referral_value in sessionStorage:",
            params.referral_value
          );
          sessionStorage.setItem(
            "oqtima_referral_value",
            params.referral_value
          );
        }

        // Store whether this is Brazilian Portuguese
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
      }
      if (params.referral_value) {
        window.__OQTIMA_REFERRAL_VALUE__ = params.referral_value;
      }
    }

    // Get client info from data object if available
    const ipAddress = params.ip_address || null;
    const countryName = params.country_name || null;
    const countryCode = params.country_code || null;

    // Get referral params - ensure these values are passed down
    const referralType = params.referral_type || null;
    const referralValue = params.referral_value || null;

    // Determine if mobile based on screen width
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 ||
        params.forceMobile === true ||
        params.isMobile === true ||
        params.mobile === true);

    // Log popup creation parameters
    console.log("[OQtima] Creating popup with:", {
      language: params.language,
      dataLang: dataLang,
      referralType,
      referralValue,
      isMobile,
      isRTL: params.isRTL,
    });

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
    const isMobile = window.innerWidth <= 768;

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

    // Add spinner animation
    const spinnerStyle = document.createElement("style");
    spinnerStyle.textContent = `
      @keyframes oqtima-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Mobile styles */
      @media (max-width: 768px) {
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
          width: 100% !important;
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
      wrapperStyles += `
      width: 100% !important;
        max-width: 1170px !important;
        height: 90vh !important;
        max-height: 800px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
      `;
    }

    wrapper.style.cssText = wrapperStyles;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.className = "popup-registration__iframe";

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

        console.log(
          "[OQtima] Sending message to standard iframe:",
          JSON.stringify(messageData, null, 2)
        );

        // First attempt to send message
        iframe.contentWindow.postMessage(messageData, "*");

        // Schedule multiple retries with increasing delays to ensure message is received
        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("Error in retry 1:", err);
          }
        }, 100);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("Error in retry 2:", err);
          }
        }, 500);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
            console.log("[OQtima] Final retry sending message to iframe");
          } catch (err) {
            console.error("Error in final retry:", err);
          }
        }, 1500);

        // Add direct iframe script injection for session storage access
        try {
          // Using setTimeout to ensure iframe is fully loaded
          setTimeout(() => {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
              const script = iframeDoc.createElement("script");
              script.textContent = `
                // Set referral parameters and language directly in sessionStorage
                try {
                  // Set referral parameters
                  sessionStorage.setItem("oqtima_referral_type", "${referralType}");
                  sessionStorage.setItem("oqtima_referral_value", "${referralValue}");
                  
                  // Set language parameters
                  sessionStorage.setItem("oqtima_tab_language", "${language}");
                  localStorage.setItem("i18nextLng", "${language}");
                  
                  // Set global variables
                  window.__OQTIMA_REFERRAL_TYPE__ = "${referralType}";
                  window.__OQTIMA_REFERRAL_VALUE__ = "${referralValue}";
                  window.__OQTIMA_TAB_LANGUAGE__ = "${language}";
                  window.__OQTIMA_LOCKED_LANG__ = "${language}";
                  window.__OQTIMA_COMPONENT_LANGUAGE__ = "${language}";
                  window.__FORCE_LANGUAGE__ = true;
                  
                  // Set language on document element
                  document.documentElement.setAttribute("lang", "${language}");
                  
                  // Log success
                  console.log("Successfully stored parameters in iframe via injected script");
                  console.log("Language set to: ${language}");
                  console.log("Referral type: ${referralType}");
                  console.log("Referral value: ${referralValue}");
                } catch (e) {
                  console.error("Error storing parameters in iframe sessionStorage:", e);
                }
              `;
              iframeDoc.head.appendChild(script);
            }
          }, 500);
        } catch (err) {
          console.warn(
            "[OQtima] Could not inject session storage script:",
            err
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
      // Log that we're adding redundant parameters to the URL
      console.log(
        "[OQtima] Adding redundant referral parameters to iframe URL for maximum compatibility"
      );

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
      console.log(
        "[OQtima] Updated iframe URL with redundant referral parameters:",
        logUrl
      );
    }

    // Assemble the popup
    wrapper.appendChild(iframe);
    modalContainer.appendChild(wrapper);
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
        background-color: rgba(0, 0, 0, 0.8) !important;
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

    // Create wrapper element
    const wrapper = document.createElement("div");
    wrapper.className =
      "popup-registration__wrapper popup-registration__wrapper--rtl";
    wrapper.setAttribute("dir", "rtl");
    wrapper.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      overflow-y: auto !important;
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
      height: auto !important;
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
      aspect-ratio: 16 / 9 !important;
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

        console.log(
          "[OQtima] Sending message to RTL iframe:",
          JSON.stringify(messageData, null, 2)
        );

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
            console.log("[OQtima] Final retry sending message to RTL iframe");
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
      console.log("[OQtima] RTL popup cleanup called");

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

    console.log("[OQtima] Saving original document RTL state before popup:", {
      originalDocDir,
      originalDocLang,
      originalBodyDir,
      originalHtmlRtlState,
      originalBodyRtlState,
    });

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
            document.documentElement.setAttribute("lang", originalDocLang);
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

        // Restore original overflow settings
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;

        // Restore scroll position
        if (originalScrollPos && typeof originalScrollPos === "object") {
          window.scrollTo(originalScrollPos.x || 0, originalScrollPos.y || 0);
        } else if (typeof originalScrollPos === "number") {
          window.scrollTo(0, originalScrollPos);
        }

        console.log("[OQtima] Successfully restored original document state");
      } catch (error) {
        console.error("[OQtima] Error closing registration popup:", error);
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
        // Handle referral parameter requests from the iframe
        if (
          event.data &&
          typeof event.data === "object" &&
          event.data.type === "REQUEST_REFERRAL_PARAMS"
        ) {
          console.log(
            "[OQtima] Received request for referral parameters from iframe"
          );

          // Collect referral parameters from all possible sources
          const referralData = {
            referral_type: null,
            referral_value: null,
            language: null,
          };

          // 1. Check global variables
          if (window.__OQTIMA_REFERRAL_TYPE__ !== undefined) {
            referralData.referral_type = window.__OQTIMA_REFERRAL_TYPE__;
          }

          if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
            referralData.referral_value = window.__OQTIMA_REFERRAL_VALUE__;
          }

          if (window.__OQTIMA_TAB_LANGUAGE__ !== undefined) {
            referralData.language = window.__OQTIMA_TAB_LANGUAGE__;
          }

          // 2. Check session storage
          try {
            const storageType = sessionStorage.getItem("oqtima_referral_type");
            const storageValue = sessionStorage.getItem(
              "oqtima_referral_value"
            );
            const storageLanguage = sessionStorage.getItem(
              "oqtima_tab_language"
            );

            if (storageType && referralData.referral_type === null) {
              referralData.referral_type = storageType;
            }

            if (storageValue && referralData.referral_value === null) {
              referralData.referral_value = storageValue;
            }

            if (storageLanguage && referralData.language === null) {
              referralData.language = storageLanguage;
            }
          } catch (e) {
            console.warn("[OQtima] Error accessing sessionStorage:", e);
          }

          // 3. Check URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const urlType =
            urlParams.get("referral_type") ||
            urlParams.get("referralType") ||
            urlParams.get("referral-type");
          const urlValue =
            urlParams.get("referral_value") ||
            urlParams.get("referralValue") ||
            urlParams.get("referral-value");
          const urlLanguage =
            urlParams.get("language") ||
            urlParams.get("lang") ||
            urlParams.get("locale") ||
            urlParams.get("data-lang");

          if (urlType && referralData.referral_type === null) {
            referralData.referral_type = urlType;
          }

          if (urlValue && referralData.referral_value === null) {
            referralData.referral_value = urlValue;
          }

          if (urlLanguage && referralData.language === null) {
            referralData.language = urlLanguage;
          }

          // 4. Check the trigger element data attributes
          if (window.__OQTIMA_TRIGGER_ELEMENT__) {
            const referralTypeAttr =
              window.__OQTIMA_TRIGGER_ELEMENT__.getAttribute(
                "data-referral-type"
              );
            const referralValueAttr =
              window.__OQTIMA_TRIGGER_ELEMENT__.getAttribute(
                "data-referral-value"
              );
            const languageAttr =
              window.__OQTIMA_TRIGGER_ELEMENT__.getAttribute("data-lang");

            if (referralTypeAttr && referralData.referral_type === null) {
              referralData.referral_type = referralTypeAttr;
            }

            if (referralValueAttr && referralData.referral_value === null) {
              referralData.referral_value = referralValueAttr;
            }

            if (languageAttr && referralData.language === null) {
              referralData.language = languageAttr;
            }
          }

          // Send the collected data back to the iframe
          if (
            referralData.referral_type !== null ||
            referralData.referral_value !== null ||
            referralData.language !== null
          ) {
            console.log("[OQtima] Sending parameters to iframe:", referralData);

            try {
              // Create a complete message with all necessary data
              const messageData = {
                type: "REGISTRATION_PARAMS",
                data: {
                  // Language parameters - high priority
                  language: referralData.language,
                  "data-lang": referralData.language,
                  lang: referralData.language,
                  data_lang: referralData.language,
                  tab_language: referralData.language,
                  oqtima_tab_language: referralData.language,
                  i18nextLng: referralData.language,

                  // Referral parameters
                  referral_type: referralData.referral_type,
                  referralType: referralData.referral_type,
                  "referral-type": referralData.referral_type,
                  referral_value: referralData.referral_value,
                  referralValue: referralData.referral_value,
                  "referral-value": referralData.referral_value,

                  // Cross-domain storage instructions
                  storeInSessionStorage: true,
                  storageKeys: [
                    {
                      key: "oqtima_referral_type",
                      value: referralData.referral_type,
                    },
                    {
                      key: "oqtima_referral_value",
                      value: referralData.referral_value,
                    },
                    {
                      key: "oqtima_tab_language",
                      value: referralData.language,
                    },
                    { key: "i18nextLng", value: referralData.language },
                    { key: "lang", value: referralData.language },
                    { key: "language", value: referralData.language },
                  ],
                },
                timestamp: Date.now(),
              };

              // Using postMessage to send the data
              event.source.postMessage(messageData, "*");

              // Also try to call the direct handler if it exists
              if (
                event.source.window &&
                typeof event.source.window.__TEMP_RECEIVE_REFERRAL_DATA ===
                  "function"
              ) {
                event.source.window.__TEMP_RECEIVE_REFERRAL_DATA({
                  referral_type: referralData.referral_type,
                  referral_value: referralData.referral_value,
                  language: referralData.language,
                });
              }

              // Also try to update the document language directly
              try {
                if (
                  referralData.language &&
                  event.source.window &&
                  event.source.window.document
                ) {
                  event.source.window.document.documentElement.setAttribute(
                    "lang",
                    referralData.language
                  );
                }
              } catch (e) {
                console.warn(
                  "[OQtima] Could not set iframe document language:",
                  e
                );
              }
            } catch (e) {
              console.error(
                "[OQtima] Error sending referral data to iframe:",
                e
              );
            }
          } else {
            console.log("[OQtima] No parameters found to send to iframe");
          }

          return; // Skip the rest of the handler
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
            console.log("[OQtima] Registration success message received");

            // Handle optional redirect
            if (event.data.redirectUrl) {
              window.__OQTIMA_REGISTRATION_REDIRECT_URL =
                event.data.redirectUrl;
              console.log(
                "[OQtima] Will redirect to:",
                event.data.redirectUrl,
                "with timeout:",
                event.data.redirectTimeout || 0
              );

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

          // Handle close popup message
          if (event.data.type === "OQTIMA_CLOSE_POPUP") {
            console.log(
              "[OQtima] Close popup request from iframe, source:",
              event.data.source
            );

            // Close popup
            if (window.__OQTIMA_CLOSE_POPUP) {
              window.__OQTIMA_CLOSE_POPUP();
            }
          }

          // Handle redirect message with timeout
          if (event.data.type === "OQTIMA_REDIRECT") {
            const redirectUrl = event.data.url;
            const timeout = event.data.timeout || 0;

            if (redirectUrl && typeof redirectUrl === "string") {
              console.log(
                "[OQtima] Redirect request received. URL:",
                redirectUrl,
                "Timeout:",
                timeout
              );

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
              const policyType = event.data.policyType || "policy";

              // Validate the URL before attempting to open it
              if (!url || typeof url !== "string") {
                console.error(
                  "[OQtima] Invalid URL in link open request:",
                  url
                );
                return;
              }

              console.log(`[OQtima] Processing link open request:`, {
                url,
                isPolicyLink,
                policyType,
                timestamp,
              });

              // Determine if this is a policy link that should be allowed
              // Always allow policy and legal links regardless of domain
              const isPolicyOrLegalLink =
                isPolicyLink ||
                /privacy|cookie|policy|terms|legal|disclaimer|gdpr|oqtima\.com/i.test(
                  url
                );

              if (isPolicyOrLegalLink) {
                console.log("[OQtima] Opening policy link in new tab:", url);
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
                  console.log(
                    "[OQtima] Successfully opened policy link with window.open"
                  );

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
                  console.log(
                    "[OQtima] window.open failed, telling iframe to use fallback"
                  );

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
              console.log(
                "[OQtima] String redirect request received. Redirecting to:",
                redirectUrl
              );

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
    // Log input parameters for debugging
    console.log("[OQtima] constructIframeUrl called with:", {
      language,
      referralType,
      referralValue,
      isMobile,
    });

    // Force clean language code - but preserve BR language code
    let normalizedLanguage = (language || "en").toLowerCase().trim();

    // If language is BR variant, preserve it instead of removing non-alphabetic characters
    const isBrVariant = /^(br|pt[-_]?br)$/i.test(normalizedLanguage);

    if (isBrVariant) {
      console.log(
        "[OQtima] Detected Brazilian Portuguese variant:",
        normalizedLanguage
      );
      normalizedLanguage = "br"; // Normalize to simple 'br'
    } else {
      // For other languages, clean invalid characters
      normalizedLanguage = normalizedLanguage.replace(/[^a-z]/g, "");
    }

    console.log("[OQtima] Normalized language:", normalizedLanguage);

    // ENHANCED: Create normalized referral parameters with safe type conversions
    let normalizedReferralType = referralType;
    let normalizedReferralValue = referralValue;

    // If referralType is a valid number, convert it to a number type
    if (referralType !== null && referralType !== undefined) {
      const parsedType = parseInt(referralType, 10);
      if (!isNaN(parsedType)) {
        normalizedReferralType = parsedType;
        console.log(
          "[OQtima] Normalized referral_type to number:",
          normalizedReferralType
        );
      }
    }

    // Ensure referralValue is a string
    if (referralValue !== null && referralValue !== undefined) {
      normalizedReferralValue = String(referralValue);
      console.log(
        "[OQtima] Normalized referral_value to string:",
        normalizedReferralValue
      );
    }

    // FIXED: Enhanced RTL detection - check for Arabic language variants more thoroughly
    const isRTL =
      normalizedLanguage === "ar" ||
      normalizedLanguage.startsWith("ar-") ||
      normalizedLanguage === "arabic";

    // Log RTL detection decision
    console.log(
      "[OQtima] RTL mode for iframe:",
      isRTL ? "ENABLED" : "disabled",
      "for language:",
      normalizedLanguage
    );

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
        console.log("[OQtima] Using script server for iframe:", baseUrl);
      } else {
        // If script not found, use the value from getApiUrlFromHostname()
        baseUrl = apiUrl.replace(/\/+$/, ""); // Remove trailing slash
        console.log("[OQtima] Using API URL for iframe:", baseUrl);
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

    console.log("[OQtima] Using URL path:", urlPath);

    // CRITICAL FIX: Add specific checks to prevent language overrides in iframe
    let iframeLang = normalizedLanguage;

    // Store the language in sessionStorage for persistence
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("oqtima_tab_language", iframeLang);
        window.__OQTIMA_COMPONENT_LANGUAGE = iframeLang;
        window.__OQTIMA_LOCKED_LANG = iframeLang;

        console.log(
          "[OQtima] Language persisted to sessionStorage:",
          iframeLang
        );
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
      console.log(
        "[OQtima] Language persisted to sessionStorage:",
        normalizedLanguage
      );

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

          console.log(
            `[OQtima] Set cross-domain cookies for language on domain: ${domain}`
          );
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
    }

    // ENHANCED: Add referral parameters more comprehensively
    if (normalizedReferralType != null) {
      // Add in multiple formats for maximum compatibility
      const referralTypeParams = [
        "referral_type", // Primary format (underscore)
        "referralType", // camelCase variant
        "referral-type", // hyphenated variant
      ];

      referralTypeParams.forEach((param) => {
        params.set(param, normalizedReferralType);
      });

      // Store in global variable and sessionStorage for redundancy
      try {
        window.__OQTIMA_REFERRAL_TYPE__ = normalizedReferralType;
        sessionStorage.setItem("oqtima_referral_type", normalizedReferralType);

        // Set cross-domain cookies with various domain options
        const setCrossDomainCookies = () => {
          // Extract domain info for cookie setting
          let domain;
          try {
            // Get the target domain from the baseUrl
            const urlObj = new URL(baseUrl);
            domain = urlObj.hostname;

            // Set the cookie with specific domain
            document.cookie = `oqtima_referral_type=${normalizedReferralType}; path=/; max-age=3600; SameSite=None; Secure`;

            // Try with domain-specific cookies (multiple variations for compatibility)
            document.cookie = `oqtima_referral_type=${normalizedReferralType}; path=/; domain=${domain}; max-age=3600; SameSite=None; Secure`;

            // Also try with a leading dot for subdomain compatibility
            if (domain.indexOf(".") !== -1) {
              const rootDomain = domain.substring(domain.indexOf("."));
              document.cookie = `oqtima_referral_type=${normalizedReferralType}; path=/; domain=${rootDomain}; max-age=3600; SameSite=None; Secure`;
            }

            console.log(
              `[OQtima] Set cross-domain cookies for referral_type on domain: ${domain}`
            );
          } catch (e) {
            console.warn(
              "[OQtima] Could not set cross-domain cookies for referral_type:",
              e
            );
            // Fallback to simple cookie without domain
            document.cookie = `oqtima_referral_type=${normalizedReferralType}; path=/; max-age=3600`;
          }
        };

        // Execute the cookie setting function
        setCrossDomainCookies();
      } catch (e) {
        console.warn("[OQtima] Could not store referral type:", e);
      }

      console.log(
        "[OQtima] Added referral_type to URL params:",
        normalizedReferralType
      );
    }

    // Add referral value if available
    if (normalizedReferralValue != null) {
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

            console.log(
              `[OQtima] Set cross-domain cookies for referral_value on domain: ${domain}`
            );
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

      console.log(
        "[OQtima] Added referral_value to URL params:",
        normalizedReferralValue
      );
    }

    // Construct the URL path
    let finalUrl = `${baseUrl}${urlPath}?${params.toString()}#registration-form`;

    // Debug log the final URL (but truncate if too long)
    const logUrl =
      finalUrl.length > 150 ? finalUrl.substring(0, 147) + "..." : finalUrl;
    console.log("[OQtima] Constructed iframe URL:", logUrl);

    return finalUrl;
  }

  // Function to inject link handler script into iframe
  function injectLinkHandlerScript(event) {
    try {
      const iframe = event.target;
      const iframeWindow = iframe.contentWindow;

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
                            console.log('Both parent and direct open failed');
                            
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
                          console.log('Link open failed completely');
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
    originalScrollPos,
    ipAddress,
    countryName,
    countryCode
  ) {
    // PENDEKATAN PALING RADIKAL UNTUK MOBILE SCROLLING

    // 1. Cleanup semua containers dan styles yang ada sebelumnya
    const elementsToRemove = document.querySelectorAll(
      "#oqtima-mobile-container, #oqtima-mobile-styles, #oqtima-mobile-spinner-style, .oqtima-scroll-indicator, #oqtima-registration-modal, .popup-registration__wrapper, .popup-registration__container, .popup-registration__iframe-container"
    );
    elementsToRemove.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // 2. Reset viewport meta dengan nilai yang mendukung scrolling
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content =
      "width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0, shrink-to-fit=no";

    // 3. Struktur dom yang sangat sederhana - hanya div + iframe
    const fullscreenContainer = document.createElement("div");
    fullscreenContainer.id = "oqtima-fullscreen-popup";
    fullscreenContainer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: white !important;
      z-index: 2147483647 !important; /* Maksimum z-index */
      overflow: hidden !important;
      display: block !important;
      box-sizing: border-box !important;
    `;
    document.body.appendChild(fullscreenContainer);

    // Spinner sederhana (akan dihapus setelah iframe dimuat)
    const spinner = document.createElement("div");
    spinner.id = "oqtima-spinner";
    spinner.style.cssText = `
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      border: 3px solid #ff4400 !important;
      border-color: #ff4400 transparent #ff4400 transparent !important;
      animation: oqtima-spinner 1.2s linear infinite !important;
      z-index: 999999 !important;
    `;
    fullscreenContainer.appendChild(spinner);

    // Style untuk spinner
    const spinnerStyle = document.createElement("style");
    spinnerStyle.id = "oqtima-spinner-style";
    spinnerStyle.innerHTML = `
      @keyframes oqtima-spinner {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyle);

    // Disable body scrolling
    document.body.classList.add("oqtima-popup-open");
    document.documentElement.classList.add("oqtima-popup-open");
    const bodyScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${bodyScrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    // Prepare iframe URL
    const url = constructIframeUrl(language, referralType, referralValue, true);

    // 4. IFRAME SEDERHANA TANPA STYLE/CONTAINER LAIN
    const iframe = document.createElement("iframe");
    iframe.id = "oqtima-iframe";
    iframe.setAttribute("scrolling", "yes"); // Force scrolling enabled
    iframe.setAttribute("allow", "fullscreen");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("importance", "high");
    iframe.setAttribute("frameborder", "0");

    // Daftar styles penting tanpa container tambahan
    iframe.style.cssText = `
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
      display: block !important;
      overflow: auto !important;
      overflow-y: scroll !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      z-index: 9 !important;
      background-color: white !important;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Menetapkan src iframe
    iframe.src = url;
    fullscreenContainer.appendChild(iframe);

    // Set up message sent to iframe after it loads
    iframe.addEventListener("load", function () {
      // Hide the spinner once iframe is loaded
      if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
      }

      // Make iframe visible
      iframe.style.opacity = "1";

      // IMPORTANT: Send referral parameters to the iframe
      try {
        // Create a complete message with all necessary data
        const messageData = {
          type: "REGISTRATION_PARAMS",
          data: {
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

            // Language parameters
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

        console.log(
          "[OQtima] Sending message to mobile iframe:",
          JSON.stringify(messageData, null, 2)
        );

        // First attempt to send message
        iframe.contentWindow.postMessage(messageData, "*");

        // Schedule multiple retries with increasing delays to ensure message is received
        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("Error in mobile retry 1:", err);
          }
        }, 100);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
          } catch (err) {
            console.error("Error in mobile retry 2:", err);
          }
        }, 500);

        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(messageData, "*");
            console.log(
              "[OQtima] Final retry sending message to mobile iframe"
            );
          } catch (err) {
            console.error("Error in mobile final retry:", err);
          }
        }, 1500);
      } catch (err) {
        console.error("Error sending message to mobile iframe:", err);
      }

      // Add scroll indicator after iframe is loaded
      addScrollIndicator();
    });

    // Basic styles untuk scrollbar
    const popupStyles = document.createElement("style");
    popupStyles.id = "oqtima-popup-styles";
    popupStyles.innerHTML = `
      /* Fullscreen popup styles */
      body.oqtima-popup-open,
      html.oqtima-popup-open {
        overflow: hidden !important;
        height: 100% !important;
        width: 100% !important;
        position: fixed !important;
        touch-action: none !important;
      }
      
      /* Orange scrollbar styles */
      #oqtima-iframe::-webkit-scrollbar {
        width: 10px !important;
        background-color: #f5f5f5 !important;
      }
      
      #oqtima-iframe::-webkit-scrollbar-thumb {
        background-color: #ff4400 !important;
        border-radius: 5px !important;
      }
      
      /* Scrollbar untuk Firefox */
      #oqtima-iframe {
        scrollbar-width: thin !important;
        scrollbar-color: #ff4400 #f5f5f5 !important;
      }
      
      /* Scroll indicator styles */
      .oqtima-scroll-indicator {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        background-color: #ff4400 !important; 
        color: white !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        animation: oqtima-pulse 2s infinite !important;
        z-index: 2147483646 !important;
        pointer-events: none !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
      }
      
      @keyframes oqtima-pulse {
        0% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.9; }
      }
    `;
    document.head.appendChild(popupStyles);

    // Menambahkan scroll indicator setelah iframe dimuat
    let scrollIndicator = null;
    const addScrollIndicator = () => {
      scrollIndicator = document.createElement("div");
      scrollIndicator.className = "oqtima-scroll-indicator";
      scrollIndicator.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
          <path d="M12 5v14M18 13l-6 6-6-6"/>
        </svg>
      `;
      document.body.appendChild(scrollIndicator);

      // Hapus indikator setelah 10 detik
      setTimeout(() => {
        if (scrollIndicator && scrollIndicator.parentNode) {
          scrollIndicator.parentNode.removeChild(scrollIndicator);
          scrollIndicator = null;
        }
      }, 10000);
    };

    // Fungsi untuk menyelesaikan masalah scrolling pada iframe
    let fixScrollAttempts = 0;
    let scrollFixInterval = null;

    const fixIframeScrolling = (iframeDoc, iframeWin) => {
      try {
        if (!iframeDoc || !iframeWin) return;

        // Tambahkan meta viewport ke iframe
        const meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content =
          "width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0, shrink-to-fit=no";
        iframeDoc.head.appendChild(meta);

        // Tambahkan style untuk memastikan scrolling
        const style = document.createElement("style");
        style.textContent = `
          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            background-color: white !important;
          }
          
          body * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Form styling */
          form, .registration-form, #gatsby-focus-wrapper {
            width: 100% !important;
            min-height: 100% !important;
            padding-bottom: 250px !important; /* Extra padding dibawah */
            overflow: visible !important;
          }
          
          /* Prevent iOS zoom on inputs */
          input, select, textarea {
            font-size: 16px !important;
            max-width: 100% !important;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 10px !important;
            background: #f5f5f5 !important;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #ff4400 !important;
            border-radius: 5px !important;
          }
          
          /* Ensure buttons are visible */
          button, input[type="button"], input[type="submit"] {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            -webkit-appearance: none !important;
          }
          
          /* Ensure privacy policy links are visible */
          a, .link, [href] {
            color: #ff4400 !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
        `;
        iframeDoc.head.appendChild(style);

        // Fix elements dengan overflow: hidden yang mengganggu scrolling
        const fixHiddenElements = () => {
          fixScrollAttempts++;
          let fixedCount = 0;

          try {
            // Fix semua elemen yang mungkin menghalangi scrolling
            const allElements = iframeDoc.querySelectorAll("*");

            allElements.forEach((el) => {
              try {
                const style = iframeWin.getComputedStyle(el);

                // Fix overflow properties
                if (
                  style.overflow === "hidden" ||
                  style.overflowY === "hidden"
                ) {
                  el.style.setProperty("overflow", "auto", "important");
                  el.style.setProperty("overflow-y", "auto", "important");
                  fixedCount++;
                }

                // Fix position fixed elements
                if (style.position === "fixed") {
                  // Allow fixed elements but ensure they don't block scrolling
                  el.style.setProperty("z-index", "10", "important");
                  fixedCount++;
                }

                // Fix maximum height restrictions
                if (style.maxHeight !== "none" && style.maxHeight !== "auto") {
                  el.style.setProperty("max-height", "none", "important");
                  fixedCount++;
                }
              } catch (e) {
                // Ignore errors for individual elements
              }
            });

            // Force scroll satu pixel untuk mengaktifkan mode scroll
            iframeDoc.documentElement.scrollTop = 1;
            setTimeout(() => {
              iframeDoc.documentElement.scrollTop = 0;
            }, 10);

            // Log debugging info jika diperlukan
            if (debug) {
              console.warn(
                `[Try ${fixScrollAttempts}] Fixed ${fixedCount} elements that could block scrolling`
              );
            }

            // Jika sudah mencoba 10x, berhenti mencoba
            if (fixScrollAttempts >= 10) {
              clearInterval(scrollFixInterval);
            }
          } catch (e) {
            if (debug) console.error("Error fixing iframe elements", e);
          }
        };

        // Jalankan fix pertama kali
        fixHiddenElements();

        // Set interval untuk terus memeriksa dan memperbaiki scrolling
        scrollFixInterval = setInterval(fixHiddenElements, 1500);
      } catch (e) {
        if (debug) console.error("Error injecting scroll fix", e);
      }
    };

    // Handle iframe load event
    iframe.addEventListener("load", function () {
      // Remove spinner
      if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
      }

      // Show iframe with fade-in
      iframe.style.opacity = "1";

      // Add scroll indicator
      addScrollIndicator();

      try {
        // Access iframe content if possible
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const iframeWin = iframe.contentWindow;

        // Fix scrolling issues
        fixIframeScrolling(iframeDoc, iframeWin);

        // Menyimpan interval ID untuk dibersihkan nanti
        iframe.setAttribute("data-scroll-interval", scrollFixInterval);
      } catch (e) {
        // Silent cross-origin error
        if (debug)
          console.warn(
            "Cross-origin restrictions prevented iframe manipulation"
          );

        // Tetap menampilkan scroll indicator walaupun ada cross-origin restrictions
        if (!scrollIndicator) {
          addScrollIndicator();
        }
      }
    });

    // Setup escape key handler
    const handleEscape = (e) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        cleanupPopup();
      }
    };
    document.addEventListener("keydown", handleEscape);

    // Setup message handler untuk komunikasi dengan iframe
    const handleMessage = (event) => {
      if (event.data && typeof event.data === "object") {
        // Handle close popup messages
        if (
          event.data.type === "OQTIMA_CLOSE_POPUP" ||
          event.data.type === "closeRegistrationPopup" ||
          event.data.source === "close_button"
        ) {
          cleanupPopup();
        }
      }
    };
    window.addEventListener("message", handleMessage);

    // Fungsi untuk membersihkan popup
    function cleanupPopup() {
      // Clear interval untuk scroll fixing
      if (scrollFixInterval) {
        clearInterval(scrollFixInterval);
      }

      // Remove iframe and container
      if (fullscreenContainer && fullscreenContainer.parentNode) {
        fullscreenContainer.parentNode.removeChild(fullscreenContainer);
      }

      // Remove styles
      if (popupStyles && popupStyles.parentNode) {
        popupStyles.parentNode.removeChild(popupStyles);
      }

      if (spinnerStyle && spinnerStyle.parentNode) {
        spinnerStyle.parentNode.removeChild(spinnerStyle);
      }

      // Remove scroll indicator if exists
      if (scrollIndicator && scrollIndicator.parentNode) {
        scrollIndicator.parentNode.removeChild(scrollIndicator);
      }

      // Remove event listeners
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("message", handleMessage);

      // Restore body scrolling
      const scrollY = parseInt(document.body.style.top || "0");
      document.body.classList.remove("oqtima-popup-open");
      document.documentElement.classList.remove("oqtima-popup-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = originalBodyOverflow || "";
      document.documentElement.style.overflow = originalHtmlOverflow || "";
      window.scrollTo(0, -scrollY);

      // Restore original body state after a short delay
      setTimeout(() => {
        document.body.className = originalBodyClasses || "";
        document.documentElement.className = originalHtmlClasses || "";

        if (originalBodyStyle) {
          document.body.style.cssText = originalBodyStyle;
        } else {
          document.body.removeAttribute("style");
        }

        if (originalHtmlStyle) {
          document.documentElement.style.cssText = originalHtmlStyle;
        } else {
          document.documentElement.removeAttribute("style");
        }

        // Restore scroll position
        if (originalScrollPos && typeof originalScrollPos === "object") {
          window.scrollTo(originalScrollPos.x || 0, originalScrollPos.y || 0);
        }
      }, 100);
    }

    return fullscreenContainer;
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Ensure the container exists before initializing
      const containers = document.querySelectorAll("[data-oqtima-register]");
      if (containers.length > 0) {
        // Add loading state to all buttons
        addLoadingStateToButtons(containers);
        // Initialize registration process
        initOqtimaRegistration();
      } else {
        console.warn("Registration container not found");
      }
    });
  } else {
    // Check if container exists before initializing
    const containers = document.querySelectorAll("[data-oqtima-register]");
    if (containers.length > 0) {
      // Add loading state to all buttons
      addLoadingStateToButtons(containers);
      // Initialize registration process
      initOqtimaRegistration();
    } else {
      console.warn("Registration container not found");
    }
  }

  /**
   * Add loading state to registration button containers
   */
  function addLoadingStateToButtons(containers) {
    // Create a default button text
    const defaultButtonText = "GET STARTED";

    // Skip loading state and immediately create the buttons
    containers.forEach((container) => {
      // Get button attributes if available
      const text = container.getAttribute("data-text") || defaultButtonText;
      const lang = container.getAttribute("data-lang") || "en";

      // FIXED: Parse referral_type as integer when reading from data attribute
      let referralType = container.getAttribute("data-referral-type");
      const referralValue = container.getAttribute("data-referral-value");

      // Convert referral_type to integer if it's numeric
      if (referralType) {
        const parsedType = parseInt(referralType, 10);
        if (!isNaN(parsedType)) {
          referralType = parsedType;
          console.log("Parsed data-referral-type as integer:", parsedType);
        } else {
          console.warn(
            "data-referral-type is not a valid integer:",
            referralType
          );
        }
      }

      // IMPORTANT: We always keep the container in LTR mode, even if data-lang="ar"
      // This prevents the button from shifting to the right side of the page
      container.setAttribute("dir", "ltr");

      // Ensure the container itself doesn't inherit RTL styles
      container.style.direction = "ltr";
      container.style.textAlign = "";

      // Log the button creation with referral parameters
      console.log("[OQtima] Creating registration button with attributes:", {
        text,
        lang,
        referral_type: referralType,
        referral_value: referralValue,
      });

      // Create button element with full styling
      container.innerHTML = `
        <button 
          type="button" 
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
        button.setAttribute("dir", "ltr");

        button.addEventListener("click", function (event) {
          event.preventDefault();

          // Store the popup mode flag
          if (window.sessionStorage) {
            try {
              sessionStorage.setItem("oqtima_popup_mode", "true");

              // Store referral parameters in sessionStorage
              if (referralType) {
                sessionStorage.setItem("oqtima_referral_type", referralType);
              }
              if (referralValue) {
                sessionStorage.setItem("oqtima_referral_value", referralValue);
              }
            } catch (e) {
              console.warn("Error storing parameters in sessionStorage:", e);
            }
          }

          // Set global variables for referral parameters
          window.__OQTIMA_REFERRAL_TYPE__ = referralType;
          window.__OQTIMA_REFERRAL_VALUE__ = referralValue;

          console.log("[OQtima] Button clicked with referral parameters:", {
            referral_type: referralType,
            referral_value: referralValue,
          });

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

  // Store the original document RTL state
  const documentRTLState = {
    originalHtmlDir: null,
    originalHtmlLang: null,
    originalHtmlClasses: null,
    originalHtmlDataRtl: null,
    originalBodyDir: null,
    originalBodyClasses: null,
    originalBodyDataRtl: null,
    isRtlProtected: false,
  };

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
      documentRTLState.originalHtmlDataRtl =
        document.documentElement.getAttribute("data-rtl");

      // Save BODY attributes
      documentRTLState.originalBodyDir = document.body.getAttribute("dir");
      documentRTLState.originalBodyClasses = document.body.className;
      documentRTLState.originalBodyDataRtl =
        document.body.getAttribute("data-rtl");

      console.log("[OQtima] Saved original document RTL state:", {
        htmlDir: documentRTLState.originalHtmlDir,
        htmlLang: documentRTLState.originalHtmlLang,
        htmlClasses: documentRTLState.originalHtmlClasses,
        bodyDir: documentRTLState.originalBodyDir,
        bodyClasses: documentRTLState.originalBodyClasses,
      });
    } catch (e) {
      console.error("[OQtima] Error saving RTL state:", e);
    }
  }

  // Function to restore original RTL state
  function restoreOriginalRTLState() {
    try {
      if (typeof document === "undefined") return;

      console.log("[OQtima] Restoring original document RTL state");

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
      if (documentRTLState.originalHtmlDataRtl) {
        document.documentElement.setAttribute(
          "data-rtl",
          documentRTLState.originalHtmlDataRtl
        );
      }

      // Restore BODY attributes
      if (documentRTLState.originalBodyDir) {
        document.body.setAttribute("dir", documentRTLState.originalBodyDir);
      }
      document.body.className = documentRTLState.originalBodyClasses || "";
      if (documentRTLState.originalBodyDataRtl) {
        document.body.setAttribute(
          "data-rtl",
          documentRTLState.originalBodyDataRtl
        );
      }

      console.log("[OQtima] Original RTL state restored");
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

    console.log("[OQtima] Adding RTL attribute protection");

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
          console.log(
            `[OQtima] Prevented changing ${this.tagName} dir to ${value}`
          );
          return originalHtmlSetAttribute.call(this, name, "rtl");
        }

        if (
          name === "data-rtl" &&
          value !== "true" &&
          documentRTLState.originalHtmlDataRtl === "true"
        ) {
          console.log(
            `[OQtima] Prevented changing ${this.tagName} data-rtl to ${value}`
          );
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
        console.log(
          `[OQtima] Prevented removing ${this.tagName} ${name} attribute`
        );
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
          console.log(
            `[OQtima] Prevented removing RTL classes from ${
              this === document.documentElement.classList ? "HTML" : "BODY"
            }`
          );
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

      console.log("[OQtima] Removed RTL attribute protection");
    };

    console.log("[OQtima] RTL attributes protected");
  }

  // Apply RTL protection in openRegistrationPopup function
})();
