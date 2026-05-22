import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import featuresIcon from "../../../../assets/images/icons/features.svg";
import maintainBalanceIcon from "../../../../assets/images/icons/vps/maintain-a-$500-balance.svg";
import monthlyTradingIcon from "../../../../assets/images/icons/vps/monthly-trading-requirement.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import {
  KEEP_YOUR_VPS_BG_DESKTOP_WEBP,
  KEEP_YOUR_VPS_BG_MOBILE_WEBP,
  KEEP_YOUR_VPS_BG_DIMENSIONS,
  VPS_FOREX_CFD_DARK_DESKTOP_WEBP,
  VPS_FOREX_CFD_DARK_MOBILE_WEBP,
  VPS_FOREX_CFD_DARK_DIMENSIONS,
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

const KeepYourVPS = ({ className }) => {
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

  const { desktop: bgDesktop } = KEEP_YOUR_VPS_BG_DIMENSIONS;
  const { desktop: forexDesktop } = VPS_FOREX_CFD_DARK_DIMENSIONS;

  return (
    <section className={`keep-your-vps ${className || ""}`}>
      <div className="keep-your-vps-bg" aria-hidden="true">
        <picture>
          <source
            media={`not ${VPS_DESKTOP_PICTURE_MEDIA}`}
            srcSet={KEEP_YOUR_VPS_BG_MOBILE_WEBP}
          />
          <img
            src={KEEP_YOUR_VPS_BG_DESKTOP_WEBP}
            alt=""
            className="keep-your-vps-bg__image"
            width={bgDesktop.width}
            height={bgDesktop.height}
            decoding="async"
          />
        </picture>
      </div>

      <div className="keep-your-vps-header">
        <div className="badge-row">
          <img src={featuresIcon} alt={t("keep-your-vps_features-badge-alt")} />
          <span className="badge-label">{t("keep_your_vps_badge_text")}</span>
        </div>
        <h2 className="keep-your-vps-title">{t("keep_your_vps_title")}</h2>
        <p className="keep-your-vps-subtitle">{t("keep_your_vps_subtitle")}</p>
      </div>

      <div className="keep-your-vps-cards container">
        <div className="keep-your-vps-card maintain-balance-card">
          <div className="card-icon">
            <img
              src={maintainBalanceIcon}
              alt={t("keep_your_vps_card1_title")}
            />
          </div>
          <h3 className="card-title">{t("keep_your_vps_card1_title")}</h3>
          <p className="card-description">
            {t("keep_your_vps_card1_description")}
          </p>
        </div>

        <div className="keep-your-vps-card monthly-trading-card">
          <div className="card-content-wrapper">
            <div className="card-icon">
              <img
                src={monthlyTradingIcon}
                alt={t("keep-your-vps_card2-icon-alt")}
              />
            </div>
            <h3 className="card-title">{t("keep_your_vps_card2_title")}</h3>
            <p className="card-description">
              {t("keep_your_vps_card2_description")}
            </p>
          </div>
          <div className="vps-image-container">
            <picture>
              <source
                media={`not ${VPS_DESKTOP_PICTURE_MEDIA}`}
                srcSet={VPS_FOREX_CFD_DARK_MOBILE_WEBP}
              />
              <img
                src={VPS_FOREX_CFD_DARK_DESKTOP_WEBP}
                alt={t("keep-your-vps_forex-cfd-alt")}
                className="vps-image"
                width={forexDesktop.width}
                height={forexDesktop.height}
                decoding="async"
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

      <div className="keep-your-vps-footer">
        <p className="keep-your-vps-footer-text">
          {t("keep_your_vps_footer_text")}
        </p>
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

KeepYourVPS.propTypes = {
  className: PropTypes.string,
};

export default KeepYourVPS;
