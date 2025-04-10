import { isBrowser } from "./is-browser";

/**
 * Pushes UTM parameters and campaign code from localStorage to the dataLayer
 * This ensures GTM can track these parameters even after URL parameters are removed
 */
export const pushUTMParamsToDataLayer = () => {
  if (isBrowser()) {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Get UTM parameters and campaign code from localStorage
    const utm_source = localStorage.getItem("utm_source");
    const utm_medium = localStorage.getItem("utm_medium");
    const utm_campaign = localStorage.getItem("utm_campaign");
    const campaign_code = localStorage.getItem("campaign_code");

    // Only push values that exist
    const dataLayerObject = {};

    if (utm_source) dataLayerObject.utm_source = utm_source;
    if (utm_medium) dataLayerObject.utm_medium = utm_medium;
    if (utm_campaign) dataLayerObject.utm_campaign = utm_campaign;
    if (campaign_code) dataLayerObject.campaign_code = campaign_code;

    // Push to dataLayer if we have any parameters
    if (Object.keys(dataLayerObject).length > 0) {
      window.dataLayer.push(dataLayerObject);
      console.log("UTM parameters pushed to dataLayer:", dataLayerObject);
    }
  }
};
