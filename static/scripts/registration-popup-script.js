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

    // For other environments, use current origin
    return window.location.origin + "/";
  };

  // Map frontend hostname to backend API server URL
  const mapBackendApiUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    // For file:// protocol or local development
    if (protocol === "file:") {
      return "http://localhost:3000/";
    }

    // For local development with standard ports
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // If custom port is specified, use it in the URL
      if (port === "8000") {
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

    // Alternative approach: try to derive from current origin
    // This is useful in development scenarios with custom domains
    try {
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes("localhost")) {
        return "http://localhost:3000/";
      }

      // For any unknown production domain, make a best guess based on hostname
      // Add 'back.' subdomain or replace current subdomain with 'back.'
      const originUrl = new URL(currentOrigin);
      if (originUrl.hostname.includes(".")) {
        const parts = originUrl.hostname.split(".");
        // If already has subdomain, replace it
        if (parts.length > 2) {
          parts[0] = "back";
          return `${originUrl.protocol}//${parts.join(".")}/`;
        }
        // Otherwise add 'back' subdomain
        else {
          return `${originUrl.protocol}//back.${originUrl.hostname}/`;
        }
      }
    } catch (e) {
      // Ignore errors with URL construction
      console.warn("[OQtima] Error constructing backend URL from origin:", e);
    }

    // Default fallback - use localhost for development
    console.warn(
      "[OQtima] Could not determine backend API URL from hostname, using default"
    );
    return "http://localhost:3000/";
  };

  const getEnvironmentFromHostname = () => {
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
    if (hostname === "oqtima.com" || hostname === "lp.oqtima.com") {
      return "production";
    }

    return false;
  };

  // Set API URL and Environment based on hostname
  const apiUrl = getApiUrlFromHostname();
  const backendApiUrl = mapBackendApiUrl();
  const environment = getEnvironmentFromHostname();

  // If either apiUrl or environment is false, don't proceed with initialization
  if (!apiUrl || !environment) {
    return;
  }

  let isValidated = false;

  /**
   * Initialize Oqtima Registration
   */
  async function initOqtimaRegistration() {
    try {
      console.log(
        "[OQtima] Starting initialization on host:",
        window.location.host
      );

      // Get API key first
      const apiKeyResult = await getApiKey();

      // Check for containers before continuing
      const containersBeforeInit = document.querySelectorAll(
        "[data-oqtima-register]"
      );
      console.log(
        "[OQtima] Containers before init:",
        containersBeforeInit.length
      );

      // Bypass API key verification - always treat as valid
      // This line forces all API keys to be considered valid
      const isValid = true;
      console.log(
        "[OQtima] API key verification bypassed - all keys are considered valid"
      );

      // Initialize registration components
      initRegistrationComponents();
    } catch (error) {
      // Instead of showing error, still initialize the components
      console.warn("[OQtima] Error occurred but bypassing:", error.message);
      console.error("[OQtima] Full error:", error);

      // Try to initialize anyway
      initRegistrationComponents();
    }
  }

  /**
   * Get API key from script tag
   */
  async function getApiKey() {
    try {
      const scripts = document.getElementsByTagName("script");

      // Log all script sources for debugging
      console.log(
        "[OQtima] All scripts:",
        Array.from(scripts).map((s) => s.src)
      );

      const currentScript = Array.from(scripts).find((script) =>
        script.src.includes("registration-popup-script.js")
      );

      if (!currentScript) {
        // If script not found, allow initialization anyway
        console.log(
          "[OQtima] Script tag not found, using default bypass API key"
        );
        return { apiKey: "bypass_api_key", bypassVerification: true };
      }

      // Get API key from attribute or use default bypass key
      const apiKey =
        currentScript.getAttribute("data-api-key") || "bypass_api_key";
      const bypassVerification = true; // Always bypass verification

      // Always return a valid result
      return { apiKey, bypassVerification };
    } catch (error) {
      // In case of error, return default bypass values
      console.error("[OQtima] Error in getApiKey:", error);
      return { apiKey: "bypass_api_key", bypassVerification: true };
    }
  }

  /**
   * Show authentication error message - disabled in bypass mode
   */
  function showAuthError(message) {
    // Do nothing - bypass is active
    console.warn("[OQtima] Auth error suppressed in bypass mode:", message);

    // Instead of showing error, initialize the components
    initRegistrationComponents();
  }

  /**
   * Initialize registration components
   */
  function initRegistrationComponents() {
    // Added delayed execution to ensure DOM is fully loaded
    setTimeout(() => {
      const containers = document.querySelectorAll("[data-oqtima-register]");
      console.log("[OQtima] Found containers:", containers.length);

      // Check if we need to create a container
      if (containers.length === 0) {
        console.log(
          "[OQtima] No registration containers found. Creating containers..."
        );

        // Create multiple containers to ensure visibility
        const createContainer = (position, style = "") => {
          const newContainer = document.createElement("div");
          newContainer.setAttribute("data-oqtima-register", "");
          newContainer.setAttribute("data-text", "OPEN FREE ACCOUNT");
          newContainer.setAttribute("data-lang", "en");

          // Set position-specific styling if provided
          if (style) {
            newContainer.setAttribute("style", style);
          }

          // Handle different positions
          if (position === "body") {
            document.body.appendChild(newContainer);
          } else if (position === "top") {
            document.body.insertBefore(newContainer, document.body.firstChild);
          } else if (position === "fixed") {
            // Use absolute positioning for fixed container
            document.body.appendChild(newContainer);
          }

          return newContainer;
        };

        // Create multiple containers in different positions to ensure visibility
        const bodyContainer = createContainer("body");
        const topContainer = createContainer("top");
        const fixedContainer = createContainer(
          "fixed",
          "position: fixed; bottom: 20px; right: 20px; z-index: 999999;"
        );

        console.log("[OQtima] Created new containers in multiple positions");

        // Add styles and create buttons
        addStyles();

        // Create buttons in all containers
        const allContainers = document.querySelectorAll(
          "[data-oqtima-register]"
        );
        allContainers.forEach((container) =>
          createRegistrationButton(container)
        );

        return;
      }

      // If containers exist, proceed normally
      addStyles();
      containers.forEach((container) => createRegistrationButton(container));
    }, 500); // Increased delay to ensure DOM is fully ready
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
      openRegistrationPopup({ lang, referralType, referralValue });
    });

    return button;
  }

  /**
   * Opens the registration popup with the given parameters using iframe
   * Ensures consistent styling and behavior for both RTL and non-RTL languages
   */
  function openRegistrationPopup(params = {}) {
    console.log("[OQtima] Opening registration popup with params:", params);

    // Save current body and html states
    const originalBodyClasses = document.body.className;
    const originalHtmlClasses = document.documentElement.className;
    const originalBodyStyle = document.body.getAttribute("style") || "";
    const originalHtmlStyle =
      document.documentElement.getAttribute("style") || "";
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalScrollPos = window.scrollY;

    // Extract parameters with fallbacks
    const language = params.lang || "en";
    const referralType = params.referralType || null;
    const referralValue = params.referralValue || null;

    // Log for debugging
    console.log("[OQtima] Opening popup with language:", language);
    console.log("[OQtima] Referral data:", {
      type: referralType,
      value: referralValue,
    });

    // Improved browser/device detection
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

    console.log("[OQtima] Device info:", {
      isMobile,
      isIOS,
      isAndroid,
      isSafari,
      userAgent: userAgent.substring(0, 100), // Truncated for readability
    });

    // Check if we should use RTL layout
    const isRTL = ["ar"].includes(language);

    // Choose the appropriate popup mode
    if (isRTL) {
      // Use RTL fullscreen popup for RTL languages
      createRtlFullscreenPopup(
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
      );
    } else if (isMobile) {
      // Use mobile optimized popup for mobile devices
      createMobilePopup(
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
      );
    } else {
      // Use standard popup for desktop
      createStandardPopup(
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
      );
    }

    // Set up global message handlers for cross-window communication
    setupMessageHandlers();
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
    originalScrollPos
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
          background: rgba(0, 0, 0, 0.5) !important;
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
      background-color: rgba(0, 0, 0, 0.5) !important;
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

    // Handle iframe load
    iframe.onload = () => {
      try {
        // Create a complete message with all necessary data
        const messageData = {
          type: "REGISTRATION_PARAMS",
          data: {
            referral_type: referralType,
            referral_value: referralValue,
            language: language,
          },
          timestamp: Date.now(),
        };

        // First attempt to send message
        iframe.contentWindow.postMessage(messageData, "*");

        // Schedule multiple retries with increasing delays to ensure message is received
        // This handles race conditions with iframe loading
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
          } catch (err) {
            console.error("Error in final retry:", err);
          }
        }, 1500);
      } catch (err) {
        console.error("Error sending message to iframe:", err);
      }
    };

    // Construct and set iframe URL
    const url = constructIframeUrl(
      language,
      referralType,
      referralValue,
      isMobile
    );
    iframe.src = url;

    // Add referral parameters if provided (ensuring they're in the URL)
    if (referralType && referralValue) {
      let newUrl = url;
      const urlParts = url.split("?");
      const baseUrl = urlParts[0];
      const existingParams = new URLSearchParams(urlParts[1] || "");

      // Ensure the referral parameters are included
      existingParams.set("referral_type", referralType);
      existingParams.set("referral_value", referralValue);

      // Add alternative formats to ensure compatibility
      existingParams.set("referralType", referralType);
      existingParams.set("referralValue", referralValue);
      existingParams.set("referral-type", referralType);
      existingParams.set("referral-value", referralValue);

      // Reconstruct the URL with the updated parameters
      newUrl = `${baseUrl}?${existingParams.toString()}`;

      iframe.src = newUrl;
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
    originalScrollPos
  ) {
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

    // Add RTL styles to head
    const rtlStyles = document.createElement("style");
    rtlStyles.id = "oqtima-rtl-styles";
    rtlStyles.textContent = `
      .popup-registration--rtl {
        direction: rtl !important;
      }
      .popup-registration--rtl .popup-registration__container {
        flex-direction: row-reverse !important;
      }
      .popup-registration--rtl .popup-registration__sidebar--rtl {
        order: 2 !important;
      }
      .popup-registration--rtl .popup-registration__content--rtl {
        order: 1 !important;
      }
      .popup-registration--rtl * {
        direction: rtl !important;
        text-align: right !important;
      }
      .popup-registration--rtl input,
      .popup-registration--rtl select,
      .popup-registration--rtl textarea {
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
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5) !important;
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
    // Store close function globally so it can be called from anywhere
    window.__OQTIMA_CLOSE_POPUP = function () {
      try {
        // Clear language lock from localStorage
        try {
          localStorage.removeItem("OQTIMA_LANG_LOCK");
          sessionStorage.removeItem("OQTIMA_LANG_LOCK");
        } catch (e) {
          // Error clearing language storage
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

        // Restore original body style
        document.body.className = originalBodyClasses;
        document.documentElement.className = originalHtmlClasses;

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
      } catch (error) {
        // Error closing registration popup
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
        if (event.data && typeof event.data === "object") {
          // Handle close popup messages
          if (
            event.data.type === "OQTIMA_CLOSE_POPUP" ||
            event.data.type === "closeRegistrationPopup" ||
            event.data.source === "close_button"
          ) {
            window.__OQTIMA_CLOSE_POPUP();
          }

          // Handle registration success
          if (
            event.data.type === "OQTIMA_REGISTRATION_SUCCESS" ||
            event.data.type === "registrationSuccess"
          ) {
            if (event.data.redirectUrl) {
              window.location.href = event.data.redirectUrl;
            } else {
              setTimeout(window.__OQTIMA_CLOSE_POPUP, 1000);
            }
          }

          // Handle link clicks inside iframe
          if (event.data.type === "OQTIMA_OPEN_LINK") {
            try {
              const url = event.data.url || "";

              // Always allow policy and legal links regardless of domain
              const isPolicyLink =
                /privacy|cookie|policy|terms|legal|disclaimer|gdpr|oqtima\.com/i.test(
                  url
                );

              if (isPolicyLink) {
                // Prevent multiple tabs by focusing on new tab
                const newWindow = window.open(url, "_blank");
                if (newWindow) {
                  newWindow.focus();
                } else {
                  console.warn("Browser blocked popup, using fallback method");

                  // Fallback method if popup is blocked
                  const fallbackLink = document.createElement("a");
                  fallbackLink.href = url;
                  fallbackLink.target = "_blank";
                  fallbackLink.rel = "noopener noreferrer";
                  fallbackLink.style.display = "none";
                  document.body.appendChild(fallbackLink);
                  fallbackLink.click();
                  setTimeout(() => {
                    document.body.removeChild(fallbackLink);
                  }, 100);
                }
              } else {
                console.warn("Blocked potentially unsafe link:", url);
              }
            } catch (e) {
              // Error opening link
            }
          }
        }
      } catch (error) {
        // Error handling message
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
    // Force clean language code
    const normalizedLanguage = (language || "en")
      .toLowerCase()
      .trim()
      .replace(/[^a-z]/g, "");

    // Check if RTL language
    const isRTL = ["ar"].includes(normalizedLanguage);

    // Base URL construction
    const baseUrl = apiUrl;
    const baseParams = `langParam=${normalizedLanguage}&isPopup=true&isMobile=${
      isMobile ? "true" : "false"
    }&isRTL=${isRTL ? "true" : "false"}`;

    // Log the base parameters
    console.log("[OQtima] Base iframe parameters:", baseParams);

    // Prepare multiple formats of referral parameters for maximum compatibility
    let referralParams = "";

    // Only add referral parameters if both type and value are present
    if (referralType && referralValue) {
      // Add standard underscore format
      referralParams += `&referral_type=${encodeURIComponent(
        referralType
      )}&referral_value=${encodeURIComponent(referralValue)}`;

      // Add camelCase format
      referralParams += `&referralType=${encodeURIComponent(
        referralType
      )}&referralValue=${encodeURIComponent(referralValue)}`;

      // Add hyphenated format
      referralParams += `&referral-type=${encodeURIComponent(
        referralType
      )}&referral-value=${encodeURIComponent(referralValue)}`;

      console.log("[OQtima] Added referral parameters:", {
        type: referralType,
        value: referralValue,
        params: referralParams,
      });
    } else {
      console.log("[OQtima] No referral parameters to add");
    }

    // Construct the full URL
    const fullUrl = `${baseUrl}?${baseParams}${referralParams}`;

    console.log("[OQtima] Constructed iframe URL:", fullUrl);

    return fullUrl;
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
              // Function to handle links
              function handleLinks() {
                // Create a more robust link handling mechanism
                document.addEventListener('click', function(e) {
                  // Find if the clicked element is a link or inside a link
                  let target = e.target;
                  let link = null;
                  
                  // Traverse up to find closest link
                  while (target && target !== document) {
                    if (target.tagName === 'A') {
                      link = target;
                      break;
                    }
                    target = target.parentNode;
                  }
                  
                  // If we found a link with href
                  if (link && link.href) {
                    // Detect policy links - broader pattern matching
                    const href = link.href;
                    const isPolicy = /(privacy|cookie|terms|policy|legal|disclaimer|gdpr)/i.test(href);
                    
                    if (isPolicy) {
                      // Prevent default behavior
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Anti-duplicate click protection
                      const now = Date.now();
                      const lastClick = parseInt(link.getAttribute('data-last-click') || '0');
                      
                      if (now - lastClick < 1000) {
                        return false;
                      }
                      
                      // Mark as clicked
                      link.setAttribute('data-last-click', now);
                      
                      // Try multiple methods to open the link
                      
                      // Method 1: Send message to parent window
                      try {
                        window.parent.postMessage({
                          type: 'OQTIMA_OPEN_LINK',
                          url: href,
                          timestamp: now
                        }, '*');
                      } catch (err) {
                        // Error sending message to parent
                      }
                      
                      // Method 2: Direct open in new tab (fallback)
                      setTimeout(function() {
                        try {
                          window.open(href, '_blank');
                        } catch (err) {
                          // Error opening link with fallback
                        }
                      }, 100);
                      
                      // Method 3: Update parent window location directly (last resort)
                      setTimeout(function() {
                        try {
                          if (window.parent && window.parent !== window) {
                            const policyWindow = window.parent.open(href, '_blank');
                            if (policyWindow) policyWindow.focus();
                          }
                        } catch (err) {
                          // Error with last resort method
                        }
                      }, 200);
                      
                      return false;
                    }
                  }
                });
                
                // Add styling to make policy links more visible and clickable
                const style = document.createElement('style');
                style.innerHTML = '.popup-registration__consent .link { color: #ff4400; text-decoration: underline; cursor: pointer; margin: 0 4px; } .popup-registration__consent .link:hover { color: #cc3600; }';
                document.head.appendChild(style);
              }
            })();
          `;
        document.head.appendChild(script);
      } catch (error) {
        // Error injecting script
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

  // Create an initialization function that can be called multiple times
  function tryInitialize() {
    console.log("[OQtima] Attempting initialization");

    // Check for containers
    const containers = document.querySelectorAll("[data-oqtima-register]");
    console.log("[OQtima] Found containers:", containers.length);

    if (containers.length > 0) {
      // Add loading state to all buttons
      addLoadingStateToButtons(containers);
      // Initialize registration process
      initOqtimaRegistration();

      return true; // Success
    } else {
      console.log("[OQtima] No containers found at this time");
      return false; // No containers found
    }
  }

  // Retry initialization a few times
  function scheduleInitializationRetries() {
    console.log("[OQtima] Setting up initialization retries");

    // Try immediately
    const initialSuccess = tryInitialize();

    if (!initialSuccess) {
      // Try again after short delays
      const retryTimes = [500, 1000, 2000, 3000];

      retryTimes.forEach((delay, index) => {
        setTimeout(() => {
          console.log(`[OQtima] Retry attempt ${index + 1}`);

          const success = tryInitialize();

          // If still no success on final attempt, create containers automatically
          if (!success && index === retryTimes.length - 1) {
            console.log(
              "[OQtima] No containers found after retries. Creating containers..."
            );

            // Create container
            const newContainer = document.createElement("div");
            newContainer.setAttribute("data-oqtima-register", "");
            newContainer.setAttribute("data-text", "OPEN FREE ACCOUNT");
            newContainer.setAttribute("data-lang", "en");

            // Add to body
            document.body.appendChild(newContainer);

            // Initialize with new container
            const containers = document.querySelectorAll(
              "[data-oqtima-register]"
            );
            addLoadingStateToButtons(containers);
            initOqtimaRegistration();
          }
        }, delay);
      });
    }
  }

  // Start the initialization
  if (document.readyState === "loading") {
    // If document is still loading, wait for it to be ready
    document.addEventListener(
      "DOMContentLoaded",
      scheduleInitializationRetries
    );
  } else {
    // If document is already loaded, run immediately
    scheduleInitializationRetries();
  }

  /**
   * Add loading state to registration button containers
   */
  function addLoadingStateToButtons(containers) {
    console.log(
      "[OQtima] Creating buttons for",
      containers.length,
      "containers"
    );

    // Create a default button text
    const defaultButtonText = "OPEN FREE ACCOUNT";

    // Skip loading state and immediately create the buttons
    containers.forEach((container) => {
      // Get button attributes if available
      const text = container.getAttribute("data-text") || defaultButtonText;
      const lang = container.getAttribute("data-lang") || "en";
      const referralType = container.getAttribute("data-referral-type");
      const referralValue = container.getAttribute("data-referral-value");

      // Log the button creation
      console.log("[OQtima] Creating registration button with text:", text);

      // Create button element with enhanced styling and visibility
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
            z-index: 999999 !important;
            margin: 10px !important;
            pointer-events: auto !important;
            transition: all 0.3s ease-in-out !important;
            text-align: center !important;
            text-decoration: none !important;
            box-shadow: 0 4px 6px rgba(255, 68, 0, 0.1) !important;
            min-width: 200px !important;
            min-height: 30px !important;
            overflow: visible !important;
            outline: none !important;
            transform: none !important;
            animation: oqtimaButtonPulse 2s infinite !important;
          "
        >${text}</button>
      `;

      // Add pulse animation style
      if (!document.getElementById("oqtima-button-animation")) {
        const styleEl = document.createElement("style");
        styleEl.id = "oqtima-button-animation";
        styleEl.innerHTML = `
          @keyframes oqtimaButtonPulse {
            0% { transform: scale(1); box-shadow: 0 4px 6px rgba(255, 68, 0, 0.1); }
            50% { transform: scale(1.05); box-shadow: 0 8px 15px rgba(255, 68, 0, 0.2); }
            100% { transform: scale(1); box-shadow: 0 4px 6px rgba(255, 68, 0, 0.1); }
          }
        `;
        document.head.appendChild(styleEl);
      }

      // Add click event listener
      const button = container.querySelector(".oqtima-registration-button");
      if (button) {
        // Make sure the button is visible
        button.style.display = "inline-block !important";
        button.style.visibility = "visible !important";
        button.style.opacity = "1 !important";

        button.addEventListener("click", function (event) {
          event.preventDefault();
          console.log("[OQtima] Button clicked with params:", {
            lang,
            referralType,
            referralValue,
          });
          openRegistrationPopup({ lang, referralType, referralValue });
        });

        // Log successful button creation
        console.log("[OQtima] Button created and event listener attached");
      } else {
        console.warn("[OQtima] Failed to find button after creation");
      }
    });
  }
})();
