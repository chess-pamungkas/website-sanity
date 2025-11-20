import entities from "../enums/entities";
import { isBrowser } from "./services/is-browser";

// FSA or CYSEC, change it right here for development if needed
export const currentEntity = process.env.GATSBY_ENTITY;

export const isFSA = currentEntity === entities.FSA;

function DetectIsLandingPage() {
  if (isBrowser()) {
    const hostname = window.location.hostname;
    return hostname.includes("lp.");
  }
}

export const isLandingPage = DetectIsLandingPage();

export const topLevelDomain = "com";

// We have only one EU entity, so we can use constant for all FSA related entities
export const entityToRedirect = "https://oqtima.eu";
