import { isBrowser } from "./is-browser";
import { pushUTMParamsToDataLayer } from "./gtm-service";

/**
 * Test helper function to manually push test data to GTM dataLayer
 * Useful for testing GTM in development
 */
export const testGTMDataLayer = (testData = {}) => {
  if (isBrowser()) {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    const testEvent = {
      event: "test_event",
      ...testData,
      timestamp: new Date().toISOString(),
    };

    window.dataLayer.push(testEvent);
    console.log("Test data pushed to dataLayer:", testEvent);
    console.log("Current dataLayer:", window.dataLayer);

    return testEvent;
  }
};

/**
 * Get current dataLayer contents for debugging
 */
export const getDataLayer = () => {
  if (isBrowser() && window.dataLayer) {
    console.log("Current dataLayer:", window.dataLayer);
    return window.dataLayer;
  }
  return [];
};

/**
 * Check if GTM is loaded and ready
 */
export const checkGTMStatus = () => {
  if (isBrowser()) {
    const gtmLoaded = typeof window.google_tag_manager !== "undefined";
    const dataLayerExists = typeof window.dataLayer !== "undefined";

    const status = {
      gtmLoaded,
      dataLayerExists,
      dataLayerLength: dataLayerExists ? window.dataLayer.length : 0,
      gtmContainerId: process.env.GATSBY_GOOGLE_TAG_MANAGER || "Not set",
    };

    console.log("GTM Status:", status);
    return status;
  }
  return null;
};

/**
 * Test GTM with campaign_code and UTM parameters combination
 * Simulates URL with parameters, saves to localStorage, and pushes to dataLayer
 */
export const testGTMWithCampaignCode = (params = {}) => {
  if (isBrowser()) {
    const {
      campaign_code = "test_campaign_123",
      utm_source = "test_source",
      utm_medium = "test_medium",
      utm_campaign = "test_campaign",
    } = params;

    console.log("🧪 Testing GTM with campaign_code and UTM parameters:", {
      campaign_code,
      utm_source,
      utm_medium,
      utm_campaign,
    });

    // Step 1: Set parameters in localStorage (simulating what happens when URL params are saved)
    if (campaign_code) {
      localStorage.setItem("campaign_code", campaign_code);
      localStorage.removeItem("r_code"); // Remove r_code if exists
    }
    if (utm_source) localStorage.setItem("utm_source", utm_source);
    if (utm_medium) localStorage.setItem("utm_medium", utm_medium);
    if (utm_campaign) localStorage.setItem("utm_campaign", utm_campaign);

    console.log("✓ Parameters saved to localStorage");

    // Step 2: Push to dataLayer
    pushUTMParamsToDataLayer();

    // Step 3: Verify in dataLayer
    const dataLayerItems = window.dataLayer.filter(
      (item) =>
        item.campaign_code ||
        item.utm_source ||
        item.utm_medium ||
        item.utm_campaign
    );

    console.log("📊 Parameters in dataLayer:", dataLayerItems);

    // Step 4: Return summary
    const gtmLoaded = typeof window.google_tag_manager !== "undefined";
    const dataLayerExists = typeof window.dataLayer !== "undefined";
    const gtmStatus = {
      gtmLoaded,
      dataLayerExists,
      dataLayerLength: dataLayerExists ? window.dataLayer.length : 0,
      gtmContainerId: process.env.GATSBY_GOOGLE_TAG_MANAGER || "Not set",
    };

    const summary = {
      localStorage: {
        campaign_code: localStorage.getItem("campaign_code"),
        utm_source: localStorage.getItem("utm_source"),
        utm_medium: localStorage.getItem("utm_medium"),
        utm_campaign: localStorage.getItem("utm_campaign"),
      },
      dataLayer: dataLayerItems,
      gtmStatus,
    };

    console.log("📋 Test Summary:", summary);
    return summary;
  }
  return null;
};

/**
 * Simulate URL visit with campaign_code and UTM parameters
 * Useful for testing the complete flow
 */
export const simulateURLWithParams = (params = {}) => {
  if (isBrowser()) {
    const {
      campaign_code = "test_campaign_123",
      utm_source = "test_source",
      utm_medium = "test_medium",
      utm_campaign = "test_campaign",
      pathname = window.location.pathname,
    } = params;

    // Build URL with parameters
    const urlParams = new URLSearchParams();
    if (campaign_code) urlParams.set("campaign_code", campaign_code);
    if (utm_source) urlParams.set("utm_source", utm_source);
    if (utm_medium) urlParams.set("utm_medium", utm_medium);
    if (utm_campaign) urlParams.set("utm_campaign", utm_campaign);

    const testURL = `${pathname}?${urlParams.toString()}`;
    console.log("🔗 Simulating URL visit:", testURL);

    // Update URL temporarily for testing
    const originalURL = window.location.href;
    window.history.pushState({}, "", testURL);

    // Manually trigger parameter processing
    setTimeout(() => {
      try {
        // Dynamically import and call the processing functions
        Promise.all([
          import("./ib-service").then((module) =>
            module.getIBParamsAndSetToStorage()
          ),
          import("./marketing-service").then((module) =>
            module.getCampaignParamsAndSetToStorage()
          ),
        ]).then(() => {
          // Wait a bit then check results
          setTimeout(() => {
            console.log("📊 After processing:");
            console.log("- Current URL:", window.location.href);
            console.log("- localStorage:", {
              campaign_code: localStorage.getItem("campaign_code"),
              utm_source: localStorage.getItem("utm_source"),
              utm_medium: localStorage.getItem("utm_medium"),
              utm_campaign: localStorage.getItem("utm_campaign"),
            });
            console.log(
              "- dataLayer:",
              window.dataLayer.filter(
                (item) =>
                  item.campaign_code ||
                  item.utm_source ||
                  item.utm_medium ||
                  item.utm_campaign
              )
            );
          }, 200);
        });
      } catch (error) {
        console.warn(
          "Could not auto-process parameters. Please refresh the page:",
          error
        );
        console.log(
          "💡 Tip: Refresh page to trigger parameter processing automatically."
        );
      }
    }, 100);
  }
};
