import React, { useState, useContext } from "react";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import { ChevronDownIcon } from "../../../shared/icons/critical";
import LanguageContext from "../../../../context/language-context";
import ReusableButtons from "../../../shared/reusable-buttons";
import { FEATURED_IDEAS_BG } from "../../../../helpers/trading-tools-section-assets";
import badgeIcon from "../../../../assets/images/icons/badge-market-sentiment.svg";
import featuredIdeasCustomizableFiltersImage from "../../../../assets/images/trading-tools/featured-ideas-customizable-filters.png";
import featuredIdeasEducationalImage from "../../../../assets/images/trading-tools/featured-ideas-educational.png";
import featuredIdeasRealTimeOnLiveChartsImage from "../../../../assets/images/trading-tools/featured-ideas-real-time-on-live-charts.png";
import { setLangParam } from "../../../../helpers/services/language-service";

const { ArrowIcon } = ReusableButtons;

const FeaturedIdeas = ({ className }) => {
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();
  const { selectedLanguage } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("customizable-filters");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Registration popup handlers
  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const langParam = setLangParam();

  // Tab configuration
  const tabs = [
    {
      id: "customizable-filters",
      label: t("featured-ideas_tab_customizable_filters"),
      icon: featuredIdeasCustomizableFiltersImage,
    },
    {
      id: "educational",
      label: t("featured-ideas_tab_educational"),
      icon: featuredIdeasEducationalImage,
    },
    {
      id: "real-time-charts",
      label: t("featured-ideas_tab_real_time_charts"),
      icon: featuredIdeasRealTimeOnLiveChartsImage,
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "customizable-filters":
        return {
          icon: featuredIdeasCustomizableFiltersImage,
          title: t("featured-ideas_tab_customizable_filters_title"),
          description: t("featured-ideas_tab_customizable_filters_description"),
        };
      case "educational":
        return {
          icon: featuredIdeasEducationalImage,
          title: t("featured-ideas_tab_educational_title"),
          description: t("featured-ideas_tab_educational_description"),
        };
      case "real-time-charts":
        return {
          icon: featuredIdeasRealTimeOnLiveChartsImage,
          title: t("featured-ideas_tab_real_time_charts_title"),
          description: t("featured-ideas_tab_real_time_charts_description"),
        };
      default:
        return {
          icon: featuredIdeasCustomizableFiltersImage,
          title: t("featured-ideas_tab_customizable_filters_title"),
          description: t("featured-ideas_tab_customizable_filters_description"),
        };
    }
  };

  const currentContent = getTabContent();

  return (
    <div id="featured-ideas" className={`featured-ideas ${className || ""}`}>
      {/* Background */}
      <div className="featured-ideas__background">
        <picture>
          <source
            type="image/webp"
            media="(max-width: 767px)"
            srcSet={FEATURED_IDEAS_BG.mobileWebp}
          />
          <source
            type="image/webp"
            media="(min-width: 768px)"
            srcSet={FEATURED_IDEAS_BG.desktopWebp}
          />
          <source
            media="(max-width: 767px)"
            srcSet={FEATURED_IDEAS_BG.mobileSvg}
            type="image/svg+xml"
          />
          <img
            src={FEATURED_IDEAS_BG.desktopSvg}
            alt=""
            className="featured-ideas__background-image"
            width={FEATURED_IDEAS_BG.widthDesktop}
            height={FEATURED_IDEAS_BG.heightDesktop}
            decoding="async"
            loading="lazy"
          />
        </picture>
      </div>

      <div className="featured-ideas__container container">
        {/* Header */}
        <div className="featured-ideas__header">
          <div className="featured-ideas__badge">
            <img
              src={badgeIcon}
              alt="Featured Ideas"
              className="featured-ideas__badge-icon"
            />
            <span className="featured-ideas__badge-text">
              {t("featured-ideas_badge-text")}
            </span>
          </div>

          <h2 className="featured-ideas__title">{t("featured-ideas_title")}</h2>

          <p className="featured-ideas__description">
            {t("featured-ideas_description")}
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="featured-ideas__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`featured-ideas__tab ${
                activeTab === tab.id ? "featured-ideas__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div
          className="featured-ideas__dropdown"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="featured-ideas__dropdown-label">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </span>
          <div
            className={`featured-ideas__dropdown-icon ${
              isDropdownOpen ? "featured-ideas__dropdown-icon--active" : ""
            }`}
          >
            <ChevronDownIcon
              className={`featured-ideas__chevron-icon ${
                isDropdownOpen ? "rotated" : ""
              }`}
              color="#ffffff"
            />
          </div>

          {/* Dropdown Options */}
          <div
            className={`featured-ideas__dropdown-options ${
              isDropdownOpen ? "featured-ideas__dropdown-options--open" : ""
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`featured-ideas__dropdown-option ${
                  activeTab === tab.id
                    ? "featured-ideas__dropdown-option--active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.id);
                  setIsDropdownOpen(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="featured-ideas__content">
          <div className="featured-ideas__content-left">
            {/* Show the appropriate image based on selected tab */}
            <img
              src={currentContent.icon}
              alt={currentContent.title}
              className="featured-ideas__content-image"
            />
          </div>

          <div className="featured-ideas__content-right">
            <div className="featured-ideas__content-header">
              <h3 className="featured-ideas__content-title">
                {currentContent.title}
              </h3>
              <p className="featured-ideas__content-description">
                {currentContent.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="featured-ideas__actions">
              <button
                className="featured-ideas__btn featured-ideas__btn--primary"
                onClick={handleShowRegistrationPopup}
              >
                <span className="button-text">{t("button-open-account")}</span>
                <span className="button-arrow">
                  <ArrowIcon isRTL={isRTL} />
                </span>
              </button>
              <button
                className="featured-ideas__btn featured-ideas__btn--secondary"
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

export default FeaturedIdeas;
