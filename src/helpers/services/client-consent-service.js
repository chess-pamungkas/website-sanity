import axios from "axios";
import { currentEntity } from "../entity-resolver";
import { sendLog } from "./log-service";
import { isBrowser } from "./is-browser";
import { getOqtimaApiUrl } from "../oqtima-api-url";

const API_URL = getOqtimaApiUrl();

export const postClientConsent = (ipAddress, consentString) => {
  // Only post consent in browser, not during SSR
  if (!isBrowser() || !API_URL) {
    return;
  }

  const data = {
    gaId: null, // we removed GA after we started use GTM
    ipAddress,
    entity: currentEntity,
    consentType: consentString,
  };
  axios
    .post(`${API_URL}client-consent`, data)
    .catch((error) => sendLog({ message: error.message, type: error.name }));
};
