import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import featuresIcon from "../../../../assets/images/icons/features.svg";
import minimumDepositIcon from "../../../../assets/images/icons/vps/minimum-$3000-deposit.svg";
import minimumTradingVolumeIcon from "../../../../assets/images/icons/vps/minimum-trading-volume.svg";
import oqtimaForexCfdLightDesktop from "../../../../assets/images/vps/oqtima-forex-cfd-light-desktop.svg";
import oqtimaForexCfdLightMobile from "../../../../assets/images/vps/oqtima-forex-cfd-light-mobile.svg";
import handDesktop from "../../../../assets/images/vps/hand-desktop.svg";
import handMobile from "../../../../assets/images/vps/hand-mobile.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { ButtonPrimaryStandard } from "../../../shared/reusable-buttons";

// Arrow SVG component with RTL support
const ArrowIcon = ({ isRTL = false }) => (
  <svg
    width="8.59"
    height="8.59"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform: isRTL ? "scaleX(-1)" : "none",
    }}
  >
    <path
      d="M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
      stroke="currentColor"
      strokeWidth="1.3333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GetComplimentaryVPS = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const isRTL = useRtlDirection();

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

  return (
    <section
      className={`get-complimentary-vps ${
        isRTL ? "get-complimentary-vps--rtl" : ""
      } ${className || ""}`}
    >
      {/* Header */}
      <div className="get-complimentary-vps-header">
        <div className="badge-row">
          <img
            src={featuresIcon}
            alt={t("get-complimentary-vps_features-badge-alt")}
          />
          <span className="badge-label">
            {t("get_complimentary_vps_badge_text")}
          </span>
        </div>
        <h2 className="get-complimentary-vps-title">
          {t("get_complimentary_vps_title")}
        </h2>
        <p className="get-complimentary-vps-subtitle">
          {t("get_complimentary_vps_subtitle")}
        </p>
      </div>

      {/* Cards */}
      <div className="get-complimentary-vps-cards container">
        {/* Card 1: Minimum $3000 deposit */}
        <div className="get-complimentary-vps-card minimum-deposit-card">
          <div className="card-icon">
            <img
              src={minimumDepositIcon}
              alt={t("get_complimentary_vps_card1_title")}
            />
          </div>
          <h3 className="card-title">
            {t("get_complimentary_vps_card1_title")}
          </h3>
          <p className="card-description">
            {t("get_complimentary_vps_card1_description")}
          </p>
        </div>

        {/* Card 2: Minimum trading volume of 5 Lots Forex */}
        <div className="get-complimentary-vps-card minimum-trading-card">
          <div className="card-content-wrapper">
            <div className="card-icon">
              <img
                src={minimumTradingVolumeIcon}
                alt={t("get_complimentary_vps_card2_title")}
              />
            </div>
            <h3 className="card-title">
              {t("get_complimentary_vps_card2_title")}
            </h3>
            <p className="card-description">
              {t("get_complimentary_vps_card2_description")}
            </p>
          </div>
          <div className="vps-image-container">
            <img
              src={
                isMobile
                  ? oqtimaForexCfdLightMobile
                  : oqtimaForexCfdLightDesktop
              }
              alt={t("get-complimentary-vps_forex-cfd-alt")}
              className="vps-image"
            />
            <img
              src={handDesktop}
              alt={t("get-complimentary-vps_hand-icon-alt")}
              className="vps-hand-icon desktop-only"
            />
            <img
              src={handMobile}
              alt={t("get-complimentary-vps_hand-icon-alt")}
              className="vps-hand-icon mobile-only"
            />
            <button
              className="vps-start-trading-btn"
              onClick={handleShowRegistrationPopup}
            >
              <span className="btn-text">{t("button-place-order")}</span>
              <span className="btn-arrow">
                <ArrowIcon isRTL={isRTL} />
              </span>
            </button>
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

GetComplimentaryVPS.propTypes = {
  className: PropTypes.string,
};

export default GetComplimentaryVPS;
