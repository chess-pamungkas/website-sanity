import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import featuresIcon from "../../../../assets/images/icons/features.svg";
import maintainBalanceIcon from "../../../../assets/images/icons/vps/maintain-a-$500-balance.svg";
import monthlyTradingIcon from "../../../../assets/images/icons/vps/monthly-trading-requirement.svg";
import KeepYourVPSDesktopBg from "../../../../assets/images/bg/vps/keep-your-vps-forever-desktop.svg";
import KeepYourVPSMobileBg from "../../../../assets/images/bg/vps/keep-your-vps-forever-mobile.svg";
import bgCardMonthlyTradingRequirementDesktop from "../../../../assets/images/bg/vps/bg-card-monthly-trading-requirement-desktop.svg";
import bgCardMonthlyTradingRequirementMobile from "../../../../assets/images/bg/vps/bg-card-monthly-trading-requirement-mobile.svg";
import oqtimaForexCfdDarkDesktop from "../../../../assets/images/vps/oqtima-forex-cfd-dark-desktop.svg";
import oqtimaForexCfdDarkMobile from "../../../../assets/images/vps/oqtima-forex-cfd-dark-mobile.svg";
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

const KeepYourVPS = ({ className }) => {
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

  const backgroundSrc = isMobile ? KeepYourVPSMobileBg : KeepYourVPSDesktopBg;

  return (
    <section className={`keep-your-vps ${className || ""}`}>
      {/* Background Images */}
      <div className="keep-your-vps-bg">
        <img
          src={backgroundSrc}
          alt={t("keep-your-vps_background-alt")}
          className="keep-your-vps-bg__image"
        />
      </div>

      {/* Header */}
      <div className="keep-your-vps-header">
        <div className="badge-row">
          <img src={featuresIcon} alt={t("keep-your-vps_features-badge-alt")} />
          <span className="badge-label">{t("keep_your_vps_badge_text")}</span>
        </div>
        <h2 className="keep-your-vps-title">{t("keep_your_vps_title")}</h2>
        <p className="keep-your-vps-subtitle">{t("keep_your_vps_subtitle")}</p>
      </div>

      {/* Cards */}
      <div className="keep-your-vps-cards container">
        {/* Card 1: Maintain a $500 balance */}
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

        {/* Card 2: Monthly Trading Requirement */}
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
            <img
              src={
                isMobile ? oqtimaForexCfdDarkMobile : oqtimaForexCfdDarkDesktop
              }
              alt={t("keep-your-vps_forex-cfd-alt")}
              className="vps-image"
              width={242}
              height={251}
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

      {/* Footer */}
      <div className="keep-your-vps-footer">
        <p className="keep-your-vps-footer-text">
          {t("keep_your_vps_footer_text")}
        </p>
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

export default KeepYourVPS;
