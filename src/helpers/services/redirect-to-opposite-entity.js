import { entityToRedirect } from "../entity-resolver";
import { isBrowser } from "./is-browser";

export const redirectToOppositeEntity = () => {
  if (isBrowser()) {
    window.location.replace(`${entityToRedirect}`);
  }
};
