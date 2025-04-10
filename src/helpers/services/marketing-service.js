import {
  MARKETING_GET_PARAMS,
  SECT2_GROUP1_COUNT_OF_WORDS_DEFAULT,
} from "../marketing.config";
import { navigate } from "gatsby";
import { isBrowser } from "./is-browser";
import { IB_PARAMS } from "./ib-service";

import _ from "lodash";

export const getRandomArray = (arr, count) => _.sampleSize(arr, count);

export const getSect2TextSequence = (group1, group2) => {
  const arrRandom = getRandomArray(group1, SECT2_GROUP1_COUNT_OF_WORDS_DEFAULT);
  return _.concat(arrRandom, group2);
};

const getParamsFromUrl = () => {
  return new URLSearchParams(window.location.search);
};

export const getMarketingParamsFromUrl = () => {
  return {
    content: getParamsFromUrl().get(MARKETING_GET_PARAMS.content),
    sect1: getParamsFromUrl().get(MARKETING_GET_PARAMS.sect1),
    sect2: getParamsFromUrl().get(MARKETING_GET_PARAMS.sect2),
    source: getParamsFromUrl().get(MARKETING_GET_PARAMS.source),
    medium: getParamsFromUrl().get(MARKETING_GET_PARAMS.medium),
    campaign: getParamsFromUrl().get(MARKETING_GET_PARAMS.campaign),
  };
};

export const transformParamToKey = (param) => {
  const paramWithoutSymbols = _.replace(param, "+", " ");
  return _.lowerCase(paramWithoutSymbols);
};

export const CAMPAIGN_PARAMS = {
  campaign_code: "campaign_code",
};

export const getCampaignParamsAndSetToStorage = () => {
  if (isBrowser()) {
    const urlParams = getParamsFromUrl();
    const campaignCode = urlParams.get(CAMPAIGN_PARAMS.campaign_code);

    // Check if the URL parameter starts with `?${CAMPAIGN_PARAMS.campaign_code}=`
    if (
      window.location.search.startsWith(`?${CAMPAIGN_PARAMS.campaign_code}=`)
    ) {
      if (campaignCode) {
        localStorage.setItem(CAMPAIGN_PARAMS.campaign_code, campaignCode);
        localStorage.removeItem(IB_PARAMS.r_code);

        // Store UTM parameters in localStorage if they exist
        const utmSource = urlParams.get("utm_source");
        const utmMedium = urlParams.get("utm_medium");
        const utmCampaign = urlParams.get("utm_campaign");

        if (utmSource) localStorage.setItem("utm_source", utmSource);
        if (utmMedium) localStorage.setItem("utm_medium", utmMedium);
        if (utmCampaign) localStorage.setItem("utm_campaign", utmCampaign);
      }
    }

    const { pathname } = window.location;
    navigate(pathname);
  }
};

export const setCampaignParamsToLink = () => {
  if (isBrowser()) {
    const campaign_code = localStorage.getItem(CAMPAIGN_PARAMS.campaign_code);
    const utmSource = localStorage.getItem("utm_source");
    const utmMedium = localStorage.getItem("utm_medium");
    const utmCampaign = localStorage.getItem("utm_campaign");

    let queryString = "";

    // Check conditions and construct the query string accordingly
    if (campaign_code) {
      queryString = `?${CAMPAIGN_PARAMS.campaign_code}=${campaign_code}`;

      // Add UTM parameters if they exist
      if (utmSource) queryString += `&utm_source=${utmSource}`;
      if (utmMedium) queryString += `&utm_medium=${utmMedium}`;
      if (utmCampaign) queryString += `&utm_campaign=${utmCampaign}`;

      return queryString;
    }
  }

  return "";
};
