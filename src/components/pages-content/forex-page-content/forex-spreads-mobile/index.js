import React, { useState, useContext } from "react";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import { setLangParam } from "../../../../helpers/services/language-service";
import {
  DATA_FOREX_MAJOR,
  DATA_FOREX_MINOR,
} from "../../../../helpers/top-market-tables";
import { updateTableDataWithLiveColumn } from "../../../../helpers/services/update-table-data-with-live-column";
import TradingContext from "../../../../context/trading-context";
import SearchIcon from "../../../../assets/images/icons/metals/search-table-metals.svg";
import LanguageContext from "../../../../context/language-context";
import { StandardButtons } from "../../../shared/reusable-buttons";
import { getIcon } from "../../../../components/trading-ticker/components/trading-symbols/icon-loader";
import symbolMapping from "../../../../components/trading-ticker/components/trading-symbols/symbol-icon-mapping.json";

const ForexSpreadsMobile = () => {
  const { t } = useTranslationWithVariables();
  const { tradingSymbols } = useContext(TradingContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("major"); // "major" or "minor"

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Get the appropriate data based on active tab
  const currentData =
    activeTab === "major" ? DATA_FOREX_MAJOR : DATA_FOREX_MINOR;

  // Update table data with live column
  updateTableDataWithLiveColumn(currentData, tradingSymbols);

  // Filter data based on search term
  const filteredData = currentData.filter((item) =>
    item.col1.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm(""); // Reset search when switching tabs
  };

  // Get icon(s) for a symbol - same logic as TradingSymbols
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

  return (
    <>
      <div className="forex-spreads-mobile">
        {/* Tabs and Search Container - Single Row */}
        <div className="tabs-search-container-mobile">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "major" ? "tab--active" : ""}`}
              onClick={() => handleTabChange("major")}
            >
              {t("forex_spreads_mobile_tab_major")}
            </button>
            <button
              className={`tab ${activeTab === "minor" ? "tab--active" : ""}`}
              onClick={() => handleTabChange("minor")}
            >
              {t("forex_spreads_mobile_tab_minor")}
            </button>
          </div>

          {/* Search Container */}
          <div className="search-container-mobile">
            <input
              type="text"
              className="search-input-mobile"
              placeholder={t("forex_spreads_mobile_search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-icon-mobile">
              <img src={SearchIcon} alt="Search" />
            </div>
          </div>
        </div>

        {/* Explanatory Text */}
        <div className="spreads-disclaimer-mobile">
          {t("forex_spreads_mobile_disclaimer")}
        </div>

        {/* Spreads Cards - Display max 6 forex data with scroll */}
        <div className="spreads-cards-scroll-container">
          <div className="spreads-cards">
            {filteredData.map((item, index) => (
              <div key={index} className="spread-card">
                <div className="spread-card__header">
                  {renderSymbolIcons(item.col1)}
                  <h3 className="spread-card__symbol">{item.col1}</h3>
                  <p className="spread-card__description">
                    {item.description || `${item.col1} Currency Pair`}
                  </p>
                </div>

                <div className="spread-card__accounts">
                  {/* ECN+ Account */}
                  <div className="spread-card__account">
                    <h4 className="spread-card__account-title">
                      {t("forex_spreads_mobile_ecn_account")}
                    </h4>
                    <div className="spread-card__values">
                      <span className="spread-card__label">
                        {t("forex_spreads_mobile_min")}: {item.col2}
                      </span>
                      <span className="spread-card__label">
                        {t("forex_spreads_mobile_avg")}: {item.col3}
                      </span>
                    </div>
                  </div>

                  <div className="spread-card__divider"></div>

                  {/* OQtima ONE Account */}
                  <div className="spread-card__account">
                    <h4 className="spread-card__account-title">
                      {t("forex_spreads_mobile_oqtima_account")}
                    </h4>
                    <div className="spread-card__values">
                      <span className="spread-card__label">
                        {t("forex_spreads_mobile_min")}: {item.col4}
                      </span>
                      <span className="spread-card__label">
                        {t("forex_spreads_mobile_avg")}: {item.col5}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        {/* <div className="spreads-disclaimer-mobile">
          Spreads generated from data between 24/05/2025 and 28/05/2025
        </div> */}

        {/* CTA Buttons */}
        <div className="spreads-cta-mobile">
          <StandardButtons
            primaryText={t("button-start-trading")}
            secondaryText={t("button-try-demo")}
            onPrimaryClick={handleShowRegistrationPopup}
            onSecondaryClick={handleShowRegistrationPopup}
          />
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
    </>
  );
};

ForexSpreadsMobile.propTypes = {};

export default ForexSpreadsMobile;
