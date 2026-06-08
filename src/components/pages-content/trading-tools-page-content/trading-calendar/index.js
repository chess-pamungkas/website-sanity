import React, { useState, useContext } from "react";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import {
  BadgeSecurityIconGeneral as badgeIcon,
  CircleMarkIcon as circleMarkIcon,
} from "../../../shared/shared-icons";
import { TRADING_CALENDAR_IMG } from "../../../../helpers/trading-tools-section-assets";
import { StandardButtons } from "../../../shared/reusable-buttons";
import { setLangParam } from "../../../../helpers/services/language-service";

const TradingCalendar = ({ className }) => {
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Registration popup handlers
  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const langParam = setLangParam();

  return (
    <div
      id="trading-calendar"
      className={`trading-calendar ${className || ""}`}
    >
      <div className="trading-calendar__container">
        {/* Left Side - Image */}
        <div className="trading-calendar__image-container">
          <picture>
            <source
              type="image/webp"
              media="(max-width: 767px)"
              srcSet={TRADING_CALENDAR_IMG.mobileWebp}
            />
            <source
              type="image/webp"
              media="(min-width: 768px)"
              srcSet={TRADING_CALENDAR_IMG.desktopWebp}
            />
            <source
              media="(max-width: 767px)"
              srcSet={TRADING_CALENDAR_IMG.mobileSvg}
              type="image/svg+xml"
            />
            <img
              src={TRADING_CALENDAR_IMG.desktopSvg}
              alt="Trading Calendar Dashboard"
              className="trading-calendar__image"
              width={TRADING_CALENDAR_IMG.widthDesktop}
              height={TRADING_CALENDAR_IMG.heightDesktop}
              decoding="async"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Right Side - Content */}
        <div className="trading-calendar__content">
          {/* Badge */}
          <div className="trading-calendar__badge">
            <img
              src={badgeIcon}
              alt="Trading Tools"
              className="trading-calendar__badge-icon"
              width={24}
              height={24}
            />
            <span className="trading-calendar__badge-text">
              {t("trading-calendar_badge-text")}
            </span>
          </div>

          {/* Title */}
          <h2 className="trading-calendar__title">
            {t("trading-calendar_title")}
          </h2>

          {/* Benefits List */}
          <ul className="trading-calendar__benefits">
            <li className="trading-calendar__benefit">
              <div className="trading-calendar__benefit-icon">
                <img
                  src={circleMarkIcon}
                  alt="Check mark"
                  className="trading-calendar__benefit-icon-img"
                  width={24}
                  height={24}
                />
              </div>
              <span className="trading-calendar__benefit-text">
                {t("trading-calendar_benefit_1")}
              </span>
            </li>
            <li className="trading-calendar__benefit">
              <div className="trading-calendar__benefit-icon">
                <img
                  src={circleMarkIcon}
                  alt="Check mark"
                  className="trading-calendar__benefit-icon-img"
                  width={24}
                  height={24}
                />
              </div>
              <span className="trading-calendar__benefit-text">
                {t("trading-calendar_benefit_2")}
              </span>
            </li>
            <li className="trading-calendar__benefit">
              <div className="trading-calendar__benefit-icon">
                <img
                  src={circleMarkIcon}
                  alt="Check mark"
                  className="trading-calendar__benefit-icon-img"
                  width={24}
                  height={24}
                />
              </div>
              <span className="trading-calendar__benefit-text">
                {t("trading-calendar_benefit_3")}
              </span>
            </li>
            <li className="trading-calendar__benefit">
              <div className="trading-calendar__benefit-icon">
                <img
                  src={circleMarkIcon}
                  alt="Check mark"
                  className="trading-calendar__benefit-icon-img"
                  width={24}
                  height={24}
                />
              </div>
              <span className="trading-calendar__benefit-text">
                {t("trading-calendar_benefit_4")}
              </span>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="navbar-dropdown-highlight__button-group">
            <StandardButtons
              primaryText={t("button-start-trading")}
              secondaryText={t("button-try-demo")}
              onPrimaryClick={handleShowRegistrationPopup}
              onSecondaryClick={handleShowRegistrationPopup}
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
    </div>
  );
};

export default TradingCalendar;
