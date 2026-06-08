import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import featuresIcon from "../../../../assets/images/icons/features.svg";
import minimumDepositIcon from "../../../../assets/images/icons/vps/minimum-$3000-deposit.svg";
import minimumTradingVolumeIcon from "../../../../assets/images/icons/vps/minimum-trading-volume.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import {
  VPS_HAND_DESKTOP_WEBP,
  VPS_HAND_MOBILE_WEBP,
  VPS_HAND_DIMENSIONS,
  VPS_FOREX_CFD_LIGHT_DESKTOP_WEBP,
  VPS_FOREX_CFD_LIGHT_MOBILE_WEBP,
  VPS_FOREX_CFD_LIGHT_DIMENSIONS,
  VPS_DESKTOP_PICTURE_MEDIA,
} from "../../../../helpers/vps-static-images";

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
  const { selectedLanguage } = useContext(LanguageContext);
  const isRTL = useRtlDirection();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const { desktop: handDesktop } = VPS_HAND_DIMENSIONS;
  const { desktop: forexDesktop } = VPS_FOREX_CFD_LIGHT_DIMENSIONS;

  return (
    <section
      className={`get-complimentary-vps ${
        isRTL ? "get-complimentary-vps--rtl" : ""
      } ${className || ""}`}
    >
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

      <div className="get-complimentary-vps-cards container">
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
            <picture>
              <source
                media={`not ${VPS_DESKTOP_PICTURE_MEDIA}`}
                srcSet={VPS_FOREX_CFD_LIGHT_MOBILE_WEBP}
              />
              <img
                src={VPS_FOREX_CFD_LIGHT_DESKTOP_WEBP}
                alt={t("get-complimentary-vps_forex-cfd-alt")}
                className="vps-image"
                width={forexDesktop.width}
                height={forexDesktop.height}
                decoding="async"
              />
            </picture>
            <picture className="vps-hand-icon">
              <source
                media={`not ${VPS_DESKTOP_PICTURE_MEDIA}`}
                srcSet={VPS_HAND_MOBILE_WEBP}
              />
              <img
                src={VPS_HAND_DESKTOP_WEBP}
                alt=""
                width={handDesktop.width}
                height={handDesktop.height}
                decoding="async"
                aria-hidden="true"
              />
            </picture>
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
