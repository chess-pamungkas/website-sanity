import { useState, useContext, useEffect } from "react";
import ClientResolverContext from "../../context/client-resolver-context";
import { isBrowser } from "../services/is-browser";
import { REDIRECT_OR_BANNED_POPUP_SHOWN_KEY } from "../gdpr-cookie.config";
import { redirectToOppositeEntity } from "../services/redirect-to-opposite-entity";
import { isNonProductionBuild } from "../is-non-production-build";

export const useEntityNotifications = (handlePopupOpen) => {
  const { clientConfig } = useContext(ClientResolverContext);

  const [isRiskWarningNotification, setIsRiskWarningNotification] =
    useState(false);
  const [
    isRecommendedRedirectNotification,
    setIsRecommendedRedirectNotification,
  ] = useState(false);
  const [isBannedPopup, setIsBannedPopup] = useState(false);

  useEffect(() => {
    // Set risk warning notification to false as default (FSA context)
    setIsRiskWarningNotification(false);

    // EU redirect popup removed from oqtima.com: no recommendedRedirect notification or popup

    if (
      clientConfig &&
      Object.keys(clientConfig).length &&
      isBrowser() &&
      !isNonProductionBuild() &&
      !window.sessionStorage.getItem(REDIRECT_OR_BANNED_POPUP_SHOWN_KEY)
    ) {
      if (clientConfig.forceRedirectPopup && !clientConfig.banned) {
        // Cyprus: auto-redirect to .eu without showing popup (behaviour unchanged)
        redirectToOppositeEntity();
        return;
      }
      if (clientConfig.banned) {
        if (handlePopupOpen) {
          handlePopupOpen();
        }
        setIsBannedPopup(true);
      }
    }
  }, [clientConfig]);

  return {
    isRiskWarningNotification,
    isRecommendedRedirectNotification,
    setIsRecommendedRedirectNotification,
    isBannedPopup,
  };
};
