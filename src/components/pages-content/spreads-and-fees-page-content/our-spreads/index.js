import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import { setLangParam } from "../../../../helpers/services/language-service";
import {
  DATA_SPREADS_TABLE_FOREX,
  DATA_SPREADS_TABLE_INDICES,
  DATA_SPREADS_TABLE_COMMODITIES,
  DATA_SPREADS_TABLE_CRYPTO,
} from "../../../../helpers/spreads-and-fees.config";
import { updateTableDataWithLiveColumn } from "../../../../helpers/services/update-table-data-with-live-column";
import TradingContext from "../../../../context/trading-context";
import LanguageContext from "../../../../context/language-context";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import featureIcon from "../../../../assets/images/icons/features.svg";
import SearchIcon from "../../../../assets/images/icons/metals/search-table-metals.svg";
import { getIcon } from "../../../../components/trading-ticker/components/trading-symbols/icon-loader";
import symbolMapping from "../../../../components/trading-ticker/components/trading-symbols/symbol-icon-mapping.json";
import { StandardButtons } from "../../../shared/reusable-buttons";
const OurSpreads = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { tradingSymbols } = useContext(TradingContext);
  const { selectedLanguage } = useContext(LanguageContext);
  const isRTL = useRtlDirection();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Get icon(s) for a symbol - same logic as crypto spreads mobile
  const getSymbolIcons = (symbol) => {
    const symbolUpper = symbol.toUpperCase();

    // Check if it's a combined icon symbol
    if (symbolMapping.combined_icons[symbolUpper]) {
      const icons = symbolMapping.combined_icons[symbolUpper]
        .map((iconName) => getIcon(iconName))
        .filter(Boolean);

      // If we have at least one icon, return it (fallback to partial icons)
      if (icons.length > 0) {
        return icons;
      }
    }

    // Check if it's a single icon symbol
    if (symbolMapping.single_icons[symbolUpper]) {
      const icon = getIcon(symbolMapping.single_icons[symbolUpper]);
      return icon ? [icon] : [];
    }

    // Fallback: try to get icon directly by symbol name
    const directIcon = getIcon(symbolUpper);
    return directIcon ? [directIcon] : [];
  };

  // Render icon(s) for a symbol
  const renderSymbolIcons = (symbol) => {
    const icons = getSymbolIcons(symbol);

    if (icons.length === 0) {
      return <div className="spread-card__icon"></div>; // Fallback to emoji
    }

    if (icons.length === 1) {
      return (
        <div className="spread-card__icon">
          <img src={icons[0]} alt={symbol} className="spread-card__icon-img" />
        </div>
      );
    }

    // Render combined icons
    return (
      <div className="spread-card__icon spread-card__icon--combined">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt={`${symbol}_icon_${index}`}
            className="spread-card__icon-img"
          />
        ))}
      </div>
    );
  };

  // Update table data with live column
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_FOREX, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_INDICES, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_COMMODITIES, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_CRYPTO, tradingSymbols);

  // Define spreads tabs data
  const spreadsTabs = [
    {
      id: 1,
      title: t("spreads_tabs_title1"), // FOREX
      data: DATA_SPREADS_TABLE_FOREX,
    },
    {
      id: 2,
      title: t("spreads_tabs_title2"), // INDICES
      data: DATA_SPREADS_TABLE_INDICES,
    },
    {
      id: 3,
      title: t("spreads_tabs_title3"), // METALS
      data: DATA_SPREADS_TABLE_COMMODITIES,
    },
    {
      id: 4,
      title: t("spreads_tabs_title4-fsa"), // CRYPTOCURRENCIES
      data: DATA_SPREADS_TABLE_CRYPTO,
    },
  ];

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
    setIsDropdownOpen(false);
    setSearchTerm(""); // Reset search when switching tabs
  };

  const currentTabData = spreadsTabs[activeTabIndex];
  const filteredData = currentTabData.data.filter((item) =>
    item.col1.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("our-spreads", className)}>
      {/* Background */}
      <div className="our-spreads__bg"></div>

      {/* Content */}
      <div className="our-spreads__content">
        {/* Header Section */}
        <div className="our-spreads__header">
          {/* Badge Group */}
          <div className="our-spreads__badge-group">
            <img src={featureIcon} alt={t("our-spreads_feature-icon-alt")} />
            <span>{t("our_spreads_badge_text")}</span>
          </div>

          {/* Title */}
          <h2 className="our-spreads__title">{t("our_spreads_title")}</h2>
        </div>

        {/* Custom Tabs with Platform Selection Styling */}
        <div className="our-spreads__tabs-container">
          <div
            className="our-spreads__platform-selection"
            onClick={(e) => {
              if (
                isMobile &&
                !e.target.closest(".our-spreads__platform-dropdown") &&
                !e.target.closest(".search-container-mobile")
              ) {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            {/* Tabs */}
            <div className="our-spreads__platform-tabs">
              {isMobile ? (
                // Mobile dropdown
                <button className="our-spreads__platform-tab our-spreads__platform-tab--active">
                  {spreadsTabs[activeTabIndex].title}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={cn("our-spreads__dropdown-icon", {
                      "our-spreads__dropdown-icon--open": isDropdownOpen,
                    })}
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                // Desktop tabs
                spreadsTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={cn("our-spreads__platform-tab", {
                      "our-spreads__platform-tab--active":
                        activeTabIndex === index,
                    })}
                    onClick={() => handleTabClick(index)}
                  >
                    {tab.title}
                  </button>
                ))
              )}

              {/* Mobile Dropdown */}
              {isMobile && (
                <div
                  className={cn("our-spreads__platform-dropdown", {
                    show: isDropdownOpen,
                  })}
                  style={{ display: isDropdownOpen ? "block" : "none" }}
                >
                  {spreadsTabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      className="our-spreads__platform-option"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTabClick(index);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Table Content */}
            <div className="our-spreads__table-content">
              {isMobile ? (
                // Mobile Layout
                <div className="our-spreads-mobile">
                  {/* Search Bar */}
                  <div
                    className={cn("search-container-mobile", {
                      "search-container-mobile--hidden": isDropdownOpen,
                    })}
                    onClick={(e) => {
                      // Prevent event propagation to parent dropdown toggle
                      e.stopPropagation();
                    }}
                  >
                    <input
                      type="text"
                      placeholder={t("our-spreads_search-placeholder")}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        // Close dropdown when typing in search
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false);
                        }
                      }}
                      onFocus={(e) => {
                        // Prevent event propagation and close dropdown
                        e.stopPropagation();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false);
                        }
                      }}
                      onClick={(e) => {
                        // Prevent event propagation when clicking input
                        e.stopPropagation();
                      }}
                      className="search-input-mobile"
                    />
                    <div className="search-icon-mobile">
                      <img
                        src={SearchIcon}
                        alt={t("our-spreads_search-icon-alt")}
                      />
                    </div>
                  </div>

                  {/* Explanatory Text */}
                  <div className="spreads-disclaimer-mobile">
                    {t("our-spreads_disclaimer-text")}
                  </div>

                  {/* Spreads Cards */}
                  <div className="spreads-cards-scroll-container">
                    <div className="spreads-cards">
                      {filteredData.map((item, index) => (
                        <div key={index} className="spread-card">
                          <div className="spread-card__header">
                            {renderSymbolIcons(item.col1)}
                            <h3 className="spread-card__symbol">{item.col1}</h3>
                          </div>

                          <div className="spread-card__accounts">
                            {/* ECN+ Account */}
                            <div className="spread-card__account">
                              <h4 className="spread-card__account-title">
                                {t("our-spreads_ecn-account-title")}
                              </h4>
                              <div className="spread-card__values">
                                <span className="spread-card__label">
                                  {t("our-spreads_min-label")} {item.col2}
                                </span>
                                <span className="spread-card__label">
                                  {t("our-spreads_avg-label")} {item.col3}
                                </span>
                              </div>
                            </div>

                            <div className="spread-card__divider"></div>

                            {/* OQtima ONE Account */}
                            <div className="spread-card__account">
                              <h4 className="spread-card__account-title">
                                {t("our-spreads_oqtima-one-account-title")}
                              </h4>
                              <div className="spread-card__values">
                                <span className="spread-card__label">
                                  {t("our-spreads_min-label")} {item.col4}
                                </span>
                                <span className="spread-card__label">
                                  {t("our-spreads_avg-label")} {item.col5}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop Layout
                <div
                  className={cn("our-spreads-desktop", {
                    "our-spreads-desktop--rtl": isRTL,
                  })}
                >
                  {/* Search Container */}
                  <div className="search-container">
                    {/* Explanatory Text */}
                    <div className="explanation-text">
                      {t("our-spreads_disclaimer-text")}
                    </div>

                    {/* Search Bar */}
                    <div className="search-frame">
                      <input
                        type="text"
                        placeholder={t("our-spreads_search-placeholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      <div className="search-icon">
                        <img
                          src={SearchIcon}
                          alt={t("our-spreads_search-icon-alt")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table Container */}
                  <div className="spreads-table-container">
                    <table className="spreads-table">
                      {/* Table Header Section */}
                      <thead className="table-header-section">
                        {/* Main Header Row */}
                        <tr className="table-main-header">
                          <th>{t("our-spreads_table-product-header")}</th>
                          <th className="table-header__ecn" colSpan="2">
                            {t("our-spreads_table-ecn-header")}
                          </th>
                          <th className="table-header__oqtima" colSpan="2">
                            {t("our-spreads_table-oqtima-header")}
                          </th>
                        </tr>
                        {/* Sub Header Row */}
                        <tr className="table-sub-header">
                          <th>{t("our-spreads_table-symbol-header")}</th>
                          <th>{t("our-spreads_table-min-header")}</th>
                          <th>{t("our-spreads_table-avg-header")}</th>
                          <th>{t("our-spreads_table-min-header")}</th>
                          <th>{t("our-spreads_table-avg-header")}</th>
                        </tr>
                      </thead>
                    </table>

                    {/* Body Section with Scroll */}
                    <div className="table-body-scroll-container">
                      <table className="spreads-table-body">
                        <tbody className="table-body-section">
                          {filteredData.map((item, index) => (
                            <tr key={index} className="table-row">
                              <td className="table-cell table-cell__symbol">
                                {item.col1}
                              </td>
                              <td className="table-cell table-cell__min">
                                {item.col2}
                              </td>
                              <td className="table-cell table-cell__avg">
                                {item.col3}
                              </td>
                              <td className="table-cell table-cell__min">
                                {item.col4}
                              </td>
                              <td className="table-cell table-cell__avg">
                                {item.col5}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="our-spreads__cta">
          {isMobile ? (
            <div className="our-spreads__cta-mobile">
              <StandardButtons
                primaryText={t("button-start-trading")}
                secondaryText={t("button-try-demo")}
                onPrimaryClick={handleShowRegistrationPopup}
                onSecondaryClick={handleShowRegistrationPopup}
              />
            </div>
          ) : (
            <div className="our-spreads__cta-desktop">
              <StandardButtons
                primaryText={t("button-start-trading")}
                secondaryText={t("button-try-demo")}
                onPrimaryClick={handleShowRegistrationPopup}
                onSecondaryClick={handleShowRegistrationPopup}
              />
            </div>
          )}
        </div>
      </div>

      {/* Render the popup */}
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

OurSpreads.propTypes = {
  className: PropTypes.string,
};

export default OurSpreads;
