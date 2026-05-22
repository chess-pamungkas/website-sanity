import React, { useState, useContext } from "react";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import { ChevronDownIcon, ChevronUpIcon } from "../../../shared/icons/critical";
import LanguageContext from "../../../../context/language-context";
import cn from "classnames";
import ReusableButtons from "../../../shared/reusable-buttons";
import { ALPHA_GENERATION_BG } from "../../../../helpers/trading-tools-section-assets";
import badgeIcon from "../../../../assets/images/icons/badge-market-sentiment.svg";
import analystViewsIcon from "../../../../assets/images/trading-tools/analyst-views.svg";
import adaptiveCandlesIcon from "../../../../assets/images/trading-tools/adaptive-candles.svg";
import adcIcon from "../../../../assets/images/trading-tools/adaptive-divergence-convergence.svg";

const { ArrowIcon } = ReusableButtons;

const AlphaGeneration = () => {
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();
  const { selectedLanguage } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("analyst-views");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Registration popup handlers
  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const tabs = [
    {
      id: "analyst-views",
      label: t("alpha_generation_tab_analyst_views"),
      icon: analystViewsIcon,
    },
    {
      id: "adaptive-candles",
      label: t("alpha_generation_tab_adaptive_candles"),
      icon: adaptiveCandlesIcon,
    },
    {
      id: "adc",
      label: t("alpha_generation_tab_adc"),
      icon: adcIcon,
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "analyst-views":
        return {
          icon: analystViewsIcon,
          title: t("alpha_generation_analyst_views_title"),
          description: t("alpha_generation_analyst_views_description"),
        };
      case "adaptive-candles":
        return {
          icon: adaptiveCandlesIcon,
          title: t("alpha_generation_adaptive_candles_title"),
          description: t("alpha_generation_adaptive_candles_description"),
        };
      case "adc":
        return {
          icon: adcIcon,
          title: t("alpha_generation_adc_title"),
          description: t("alpha_generation_adc_description"),
        };
      default:
        return {
          icon: analystViewsIcon,
          title: t("alpha_generation_analyst_views_title"),
          description: t("alpha_generation_analyst_views_description"),
        };
    }
  };

  const currentContent = getTabContent();

  return (
    <>
      <div
        id="alpha-generation"
        className={cn("alpha-generation", { "alpha-generation--rtl": isRTL })}
      >
        {/* Background */}
        <div className="alpha-generation__background">
          <picture>
            <source
              type="image/webp"
              media="(max-width: 767px)"
              srcSet={ALPHA_GENERATION_BG.mobileWebp}
            />
            <source
              type="image/webp"
              media="(min-width: 768px)"
              srcSet={ALPHA_GENERATION_BG.desktopWebp}
            />
            <source
              media="(max-width: 767px)"
              srcSet={ALPHA_GENERATION_BG.mobileSvg}
              type="image/svg+xml"
            />
            <img
              src={ALPHA_GENERATION_BG.desktopSvg}
              alt=""
              className="alpha-generation__background-image"
              width={ALPHA_GENERATION_BG.widthDesktop}
              height={ALPHA_GENERATION_BG.heightDesktop}
              decoding="async"
              loading="lazy"
            />
          </picture>
        </div>

        <div className="alpha-generation__container container">
          {/* Header */}
          <div className="alpha-generation__header">
            <div className="alpha-generation__badge">
              <img
                src={badgeIcon}
                alt="Alpha Generation"
                className="alpha-generation__badge-icon"
              />
              <span className="alpha-generation__badge-text">
                {t("alpha_generation_badge_text")}
              </span>
            </div>

            <h2 className="alpha-generation__title">
              {t("alpha_generation_title")}
            </h2>

            <p className="alpha-generation__description">
              {t("alpha_generation_description")}
            </p>
          </div>

          {/* Desktop Tabs */}
          <div className="alpha-generation__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`alpha-generation__tab ${
                  activeTab === tab.id ? "alpha-generation__tab--active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown - Vertical Button Stack */}
          <div className="alpha-generation__dropdown">
            <div className="alpha-generation__dropdown-options">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`alpha-generation__dropdown-option ${
                    activeTab === tab.id
                      ? "alpha-generation__dropdown-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                >
                  <span className="button-text">{tab.label}</span>
                  <span className="button-arrow">
                    <ArrowIcon isRTL={isRTL} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="alpha-generation__content">
            <div className="alpha-generation__content-left">
              {/* Show the appropriate image based on selected tab */}
              <img
                src={currentContent.icon}
                alt={currentContent.title}
                className="alpha-generation__content-image"
              />
            </div>

            <div className="alpha-generation__content-right">
              <div className="alpha-generation__content-header">
                <h3 className="alpha-generation__content-title">
                  {currentContent.title}
                </h3>
                <p className="alpha-generation__content-description">
                  {currentContent.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="alpha-generation__actions">
                <button
                  className="alpha-generation__btn alpha-generation__btn--primary"
                  onClick={handleShowRegistrationPopup}
                >
                  <span className="button-text">
                    {t("button-open-account")}
                  </span>
                  <span className="button-arrow">
                    <ArrowIcon isRTL={isRTL} />
                  </span>
                </button>
                <button
                  className="alpha-generation__btn alpha-generation__btn--secondary"
                  onClick={handleShowRegistrationPopup}
                >
                  <span className="button-text">{t("button-try-demo")}</span>
                  <span className="button-arrow">
                    <ArrowIcon isRTL={isRTL} />
                  </span>
                </button>
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
        />
      )}
    </>
  );
};

export default AlphaGeneration;
