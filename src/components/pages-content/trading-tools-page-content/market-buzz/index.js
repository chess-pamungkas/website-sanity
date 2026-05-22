import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import cn from "classnames";
import ContainerWrapper from "../../../shared/container-wrapper";
import { StandardButtons } from "../../../shared/reusable-buttons";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import { setLangParam } from "../../../../helpers/services/language-service";

// Import images
import featuresIcon from "../../../../assets/images/icons/features.svg";
import badgeCheckedIcon from "../../../../assets/images/icons/trading-tools/badge-checked.svg";
import tcMarketBuzzIcon from "../../../../assets/images/bg/trading-tools/tc-market-buzz.svg";
import marketBuzzDesktop from "../../../../assets/images/trading-tools/market-buzz-desktop.svg";
import marketBuzzMobile from "../../../../assets/images/trading-tools/market-buzz-mobile.svg";
const MarketBuzz = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const langParam = setLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const keyMetrics = [
    {
      icon: badgeCheckedIcon,
      title: t("market-buzz_real_time_insights"),
      value: "600+",
      description: t("market-buzz_financial_events_detected"),
    },
    {
      icon: badgeCheckedIcon,
      title: t("market-buzz_extensive_asset_coverage"),
      value: "50k+",
      description: t("market-buzz_instruments_covered"),
    },
    {
      icon: badgeCheckedIcon,
      title: t("market-buzz_real_time_market_pulse"),
      value: "100k+",
      description: t("market-buzz_news_social_sources"),
    },
  ];

  const aiFeature = {
    icon: tcMarketBuzzIcon,
    title: t("market-buzz_harness_online_news"),
    description: t("market-buzz_harness_description"),
  };

  return (
    <div
      id="market-buzz"
      className={cn("market-buzz", className, { "market-buzz--rtl": isRTL })}
    >
      {/* Header Section */}
      <div className="market-buzz__header">
        <div className="market-buzz__header-badge">
          <img
            src={featuresIcon}
            alt=""
            className="market-buzz__header-badge-icon"
            width={14}
            height={14}
          />
          <span className="market-buzz__header-badge-text">
            {t("market-buzz_badge_text")}
          </span>
        </div>
        <h2 className="market-buzz__title">{t("market-buzz_title")}</h2>
        <p className="market-buzz__description">
          {t("market-buzz_description")}
        </p>

        {/* CTA Buttons */}
        <div className="market-buzz__cta">
          {isMobile ? (
            <div className="market-buzz__cta-mobile">
              <StandardButtons
                primaryText={t("market-buzz_cta_primary")}
                secondaryText={t("market-buzz_cta_secondary")}
                onPrimaryClick={handleShowRegistrationPopup}
                onSecondaryClick={handleShowRegistrationPopup}
              />
            </div>
          ) : (
            <div className="market-buzz__cta-desktop">
              <StandardButtons
                primaryText={t("market-buzz_cta_primary")}
                secondaryText={t("market-buzz_cta_secondary")}
                onPrimaryClick={handleShowRegistrationPopup}
                onSecondaryClick={handleShowRegistrationPopup}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="market-buzz__content">
        {/* Dashboard Section */}
        <div className="market-buzz__dashboard">
          <div className="market-buzz__dashboard-image">
            <picture>
              <source media="(max-width: 767px)" srcSet={marketBuzzMobile} />
              <img
                src={marketBuzzDesktop}
                alt="Market Buzz Dashboard"
                className="market-buzz__image"
                width={1030}
                height={655}
                decoding="async"
              />
            </picture>
          </div>

          {/* Key Metrics Section - Positioned within dashboard */}
          <div className="market-buzz__metrics">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="market-buzz__metric-card">
                <div className="market-buzz__metric-badge">
                  <div className="market-buzz__metric-badge-content">
                    <div className="market-buzz__metric-badge-icon">
                      <img
                        src={metric.icon}
                        alt=""
                        className="market-buzz__metric-badge-icon-img"
                        width={14}
                        height={15}
                      />
                    </div>
                    <span className="market-buzz__metric-badge-message">
                      {metric.title}
                    </span>
                  </div>
                </div>
                <div className="market-buzz__metric-content">
                  <div className="market-buzz__metric-value">
                    {metric.value}
                  </div>
                  <p className="market-buzz__metric-description">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feature Section */}
        <div className="market-buzz__ai-feature">
          <div className="market-buzz__ai-card">
            <div className="market-buzz__ai-content">
              <div className="market-buzz__ai-icon">
                <img
                  src={aiFeature.icon}
                  alt=""
                  className="market-buzz__ai-icon-img"
                  width={48}
                  height={48}
                />
              </div>
              <div className="market-buzz__ai-text">
                <h3 className="market-buzz__ai-title">{aiFeature.title}</h3>
                <p className="market-buzz__ai-description">
                  {aiFeature.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam}
        />
      )}
    </div>
  );
};

MarketBuzz.propTypes = {
  className: PropTypes.string,
};

export default MarketBuzz;
