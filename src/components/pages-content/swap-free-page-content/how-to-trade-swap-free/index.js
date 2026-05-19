import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import featuresIcon from "../../../../assets/images/icons/features.svg";
import alreadyTradingIcon from "../../../../assets/images/icons/swap-free/already-trading-with-oqtima.svg";
import newToOqtimaIcon from "../../../../assets/images/icons/swap-free/new-to-oqtima.svg";
import {
  SWAP_FREE_HOW_TO_TRADE_DESKTOP_WEBP,
  SWAP_FREE_HOW_TO_TRADE_MOBILE_WEBP,
} from "../../../../helpers/swap-free-static-images";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { ButtonPrimaryStandard } from "../../../shared/reusable-buttons";

const HowToTradeSwapFree = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const startConvrsSession = () => {
    if (typeof window !== "undefined") {
      if (typeof window.loadConvrsWebchatAndOpen === "function") {
        window.loadConvrsWebchatAndOpen();
      } else if (window.ConvrsChat) {
        window.ConvrsChat.ShowWebChat();
      }
    }
  };

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const backgroundSrc = isMobile
    ? SWAP_FREE_HOW_TO_TRADE_MOBILE_WEBP
    : SWAP_FREE_HOW_TO_TRADE_DESKTOP_WEBP;
  const backgroundWidth = isMobile ? 393 : 1440;
  const backgroundHeight = isMobile ? 1075 : 659;

  return (
    <section className="how-to-trade-swap-free">
      {/* Background Images */}
      <div className="how-to-trade-bg">
        <img
          src={backgroundSrc}
          alt={t("how-to-trade-swap-free_background-alt")}
          className="how-to-trade-bg__image"
          width={backgroundWidth}
          height={backgroundHeight}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Header */}
      <div className="how-to-trade-header">
        <div className="badge-row">
          <img
            src={featuresIcon}
            alt={t("how-to-trade-swap-free_features-badge-alt")}
          />
          <span className="badge-label">
            {t("how-to-trade-swap-free_badge-text")}
          </span>
        </div>
        <h2 className="how-to-trade-title">
          {t("how-to-trade-swap-free_title")}
        </h2>
        <p className="how-to-trade-subtitle">
          {t("how-to-trade-swap-free_subtitle")}
        </p>
      </div>

      {/* Cards */}
      <div className="how-to-trade-cards container">
        {/* Card 1: Already Trading with OQtima */}
        <div className="how-to-trade-card existing-trader-card">
          <div className="card-icon">
            <img
              src={alreadyTradingIcon}
              alt={t("how-to-trade-swap-free_card1-icon-alt")}
            />
          </div>
          <h3 className="card-title">
            {t("how-to-trade-swap-free_card1_title")}
          </h3>
          <p className="card-description">
            {t("how-to-trade-swap-free_card1_description")}
          </p>
          <div className="card-button">
            <ButtonPrimaryStandard
              text={t("how-to-trade-swap-free_card1_button")}
              onClick={startConvrsSession}
              showArrow={true}
            />
          </div>
        </div>

        {/* Card 2: New to OQtima */}
        <div className="how-to-trade-card new-trader-card">
          <div className="card-icon">
            <img
              src={newToOqtimaIcon}
              alt={t("how-to-trade-swap-free_card2-icon-alt")}
            />
          </div>
          <h3 className="card-title">
            {t("how-to-trade-swap-free_card2_title")}
          </h3>
          <p className="card-description">
            {t("how-to-trade-swap-free_card2_description")}
          </p>
          <div className="card-button">
            <ButtonPrimaryStandard
              text={t("how-to-trade-swap-free_card2_button")}
              onClick={handleShowRegistrationPopup}
              showArrow={true}
            />
          </div>
        </div>
      </div>

      {/* Registration Popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </section>
  );
};

HowToTradeSwapFree.propTypes = {
  className: PropTypes.string,
};

export default HowToTradeSwapFree;
