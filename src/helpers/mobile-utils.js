/**
 * Mobile utility functions for webtrader components
 */

/**
 * Check if the device is a mobile device
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent || "";
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isSmallScreen = window.innerWidth < 768;

  return isMobileUA || isSmallScreen;
};

/**
 * Check if the device is a tablet
 * @returns {boolean}
 */
export const isTabletDevice = () => {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent || "";
  const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  const isTabletScreen = window.innerWidth >= 768 && window.innerWidth < 1024;

  return isTabletUA || isTabletScreen;
};

/**
 * Get the correct viewport height for mobile devices
 * @returns {number}
 */
export const getMobileViewportHeight = () => {
  if (typeof window === "undefined") return 100;

  // Use visual viewport height if available (handles mobile browser UI)
  if (window.visualViewport) {
    return window.visualViewport.height;
  }

  // Fallback to window height
  return window.innerHeight;
};

/**
 * Calculate proper height for webtrader container
 * @param {number} headerHeight - Height of the header
 * @returns {string}
 */
export const getWebtraderHeight = (headerHeight = 65) => {
  if (typeof window === "undefined") return "100vh";

  const isMobile = isMobileDevice();
  const isTablet = isTabletDevice();

  if (isMobile) {
    // For mobile, use calculated viewport height minus header
    const viewportHeight = getMobileViewportHeight();
    return `${Math.max(viewportHeight - headerHeight, 400)}px`;
  }

  if (isTablet) {
    // For tablet, use 100vh with a minimum height
    return "calc(100vh - var(--header-height, 65px))";
  }

  // For desktop, use standard calculation
  return "calc(100vh - var(--header-height, 203px))";
};

/**
 * Wait for MetaTrader script to be available
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>}
 */
export const waitForMetaTraderScript = (timeout = 10000) => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (typeof window.MetaTraderWebTerminal === "function") {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (typeof window.MetaTraderWebTerminal === "function") {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Add mobile-specific event listeners
 * @param {Function} callback - Callback to execute when viewport changes
 */
export const addMobileViewportListeners = (callback) => {
  if (typeof window === "undefined") return;

  // Listen for visual viewport changes (mobile browser UI changes)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", callback);
    window.visualViewport.addEventListener("scroll", callback);
  }

  // Listen for orientation changes
  window.addEventListener("orientationchange", () => {
    // Small delay to allow for orientation change to complete
    setTimeout(callback, 100);
  });

  // Listen for window resize
  window.addEventListener("resize", callback);
};

/**
 * Remove mobile-specific event listeners
 * @param {Function} callback - Callback to remove
 */
export const removeMobileViewportListeners = (callback) => {
  if (typeof window === "undefined") return;

  if (window.visualViewport) {
    window.visualViewport.removeEventListener("resize", callback);
    window.visualViewport.removeEventListener("scroll", callback);
  }

  window.removeEventListener("orientationchange", callback);
  window.removeEventListener("resize", callback);
};

