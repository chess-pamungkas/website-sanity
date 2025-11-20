import React, { useContext, useState, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useModal } from "../../../helpers/hooks/use-modal";
import RedirectOrBannedPopup from "../../redirect-popup";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { getRiskDisclosureDoc } from "../../../helpers/documents";
import { setRedirectOrBannedPopupShown } from "../../../helpers/services/set-redirect-or-banned-popup-shown";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { isBrowser } from "../../../helpers/services/is-browser";
import CommonContext from "../../../context/common-context";
import { useEntityNotifications } from "../../../helpers/hooks/use-entity-notifications";
import { redirectToOppositeEntity } from "../../../helpers/services/redirect-to-opposite-entity";

export const RiskWarningNotification = () => {
  const { t } = useTranslationWithVariables();

  return (
    <div className="notification-stripe__cysec-wrapper">
      <span className={cn("notification-stripe__text")}>
        {t("notification-stripe-cysec")}&nbsp;
        <a
          className="notification-stripe__link"
          href={getRiskDisclosureDoc()}
          target="_blank"
          rel="noreferrer"
        >
          {t("notification-stripe-cysec-link")}
        </a>
      </span>
    </div>
  );
};

const RecommendedRedirectNotification = ({
  setIsHidden,
  setIsRecommendedRedirectNotification,
}) => {
  const { t } = useTranslationWithVariables();

  return (
    <div className="notification-stripe__redirection-wrapper">
      <div className="notification-stripe__content">
        <span>{t("notification-stripe-redirect-text")}</span>
      </div>
      <div className="notification-stripe__actions">
        <button
          type="button"
          className="notification-stripe__button"
          onClick={() => {
            redirectToOppositeEntity();
          }}
        >
          {t("notification-stripe-change-btn")}
        </button>
        <button
          type="button"
          className="notification-stripe__button"
          onClick={() => {
            setRedirectOrBannedPopupShown();
            setIsRecommendedRedirectNotification(false);
            setIsHidden(true);
          }}
        >
          {t("notification-stripe-close-btn")}
        </button>
      </div>
    </div>
  );
};

const NotificationsContainer = ({ className, setSectionOptions }) => {
  const { isShow, handleOpen, handleClose } = useModal();

  const {
    isRiskWarningNotification,
    isRecommendedRedirectNotification,
    setIsRecommendedRedirectNotification,
    isBannedPopup,
  } = useEntityNotifications(handleOpen);

  const { riskWarningRef } = useContext(CommonContext);
  const [isHidden, setIsHidden] = useState(true);
  const { isMobile, isMD } = useWindowSize();

  useEffect(() => {
    setSectionOptions({
      isRiskWarningNotification,
      isRecommendedRedirectNotification,
    });

    if (isRiskWarningNotification) {
      setIsHidden(false);
    }

    if (isRecommendedRedirectNotification) {
      setIsHidden(false);
    }

    if (!isRiskWarningNotification && !isRecommendedRedirectNotification) {
      setIsHidden(true);
    }
  }, [
    // clientConfig,
    // currentEntity,
    isRiskWarningNotification,
    isRecommendedRedirectNotification,
    setSectionOptions,
  ]);

  useEffect(() => {
    if (isMobile) {
      let livechatindex = document.getElementById(
        "convrs-chat-channel-container"
      );

      if (isBrowser()) {
        let livechatisMobile = document.getElementById(
          "convrs-chat-channel-container"
        );

        const path = window.location.pathname;
        const pageMt5 = path.endsWith("/mt5-webtrader/");
        const pageMt4 = path.endsWith("/mt4-webtrader/");
        if (pageMt5 && livechatisMobile) {
          livechatisMobile.style.display = "none";
          if (isRiskWarningNotification) {
            setIsHidden(true);
          }
        }
        if (pageMt4 && livechatisMobile) {
          livechatisMobile.style.display = "none";
        }
      }

      if (livechatindex) {
        livechatindex.style.setProperty("z-index", "21");
      }
    }
    if (isRiskWarningNotification) {
      let bottom;

      switch (true) {
        case isMobile:
          bottom = "135px";
          break;
        case isMD:
          bottom = "110px";
          break;
        default:
          bottom = "10px";
      }

      let livechat = document.getElementById("convrs-chat-channel-container");

      if (livechat) {
        livechat.style.bottom = bottom;
      }
    }
  }, [isRiskWarningNotification, isMobile, isMD]);

  return (
    <>
      {!isHidden &&
        (isRiskWarningNotification || isRecommendedRedirectNotification) && (
          <div
            className={cn("notification-stripe", className)}
            ref={riskWarningRef}
          >
            <div className={cn("notification-stripe__wrapper")}>
              {isRecommendedRedirectNotification && (
                <RecommendedRedirectNotification
                  handleOpen={handleOpen}
                  setIsHidden={setIsHidden}
                  setIsRecommendedRedirectNotification={
                    setIsRecommendedRedirectNotification
                  }
                />
              )}

              {isRiskWarningNotification && <RiskWarningNotification />}
            </div>
          </div>
        )}

      <RedirectOrBannedPopup
        isPopupOpen={isShow}
        handleClose={handleClose}
        setIsRecommendedRedirectNotification={
          setIsRecommendedRedirectNotification
        }
        isBannedPopup={isBannedPopup}
      />
    </>
  );
};
NotificationsContainer.propTypes = {
  className: PropTypes.string,
  setSectionOptions: PropTypes.func.isRequired,
};
RecommendedRedirectNotification.propTypes = {
  setIsHidden: PropTypes.func.isRequired,
  setIsRecommendedRedirectNotification: PropTypes.func.isRequired,
};
export default NotificationsContainer;
