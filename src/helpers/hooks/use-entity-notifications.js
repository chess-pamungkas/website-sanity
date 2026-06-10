import { useState, useContext, useEffect } from "react";
import ClientResolverContext from "../../context/client-resolver-context";
import { isBrowser } from "../services/is-browser";
import { REDIRECT_OR_BANNED_POPUP_SHOWN_KEY } from "../gdpr-cookie.config";
import { redirectToOppositeEntity } from "../services/redirect-to-opposite-entity";

export const useEntityNotifications = (handlePopupOpen) => {
  const { clientConfig, isPopupShown } = useContext(ClientResolverContext);

  const [isRiskWarningNotification, setIsRiskWarningNotification] =
    useState(false);
  const [
    isRecommendedRedirectNotification,
    setIsRecommendedRedirectNotification,
  ] = useState(false);
  const [isBannedPopup, setIsBannedPopup] = useState(false);

  useEffect(() => {
    setIsRiskWarningNotification(false);

    // EU redirect popup removed from oqtima.com: no recommendedRedirect notification or popup

    if (
      !clientConfig ||
      !Object.keys(clientConfig).length ||
      !isBrowser() ||
      window.sessionStorage.getItem(REDIRECT_OR_BANNED_POPUP_SHOWN_KEY)
    ) {
      return;
    }

    if (clientConfig.forceRedirectPopup && !clientConfig.banned) {
      redirectToOppositeEntity();
      return;
    }

    // Banned-country "Please Read" popup — enabled on local, dev, staging, and production.
    if (clientConfig.banned || isPopupShown) {
      setIsBannedPopup(true);
      handlePopupOpen?.();
    }
  }, [clientConfig, isPopupShown, handlePopupOpen]);

  return {
    isRiskWarningNotification,
    isRecommendedRedirectNotification,
    setIsRecommendedRedirectNotification,
    isBannedPopup,
  };
};
