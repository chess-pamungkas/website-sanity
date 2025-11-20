import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import SearchIcon from "../../../../assets/images/icons/metals/search-table-metals.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { StandardButtons } from "../../../shared/reusable-buttons";
import { getIcon } from "../../../../components/trading-ticker/components/trading-symbols/icon-loader";
import symbolMapping from "../../../../components/trading-ticker/components/trading-symbols/symbol-icon-mapping.json";

const IndicesSpreadsMobile = ({ data }) => {
  const { t } = useTranslationWithVariables();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);

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

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const filteredData = data.filter((item) =>
    item.col1.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="indices-spreads-mobile">
      {/* Search Bar */}
      <div className="search-container-mobile">
        <input
          type="text"
          placeholder={t("indices_spreads_mobile_search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-mobile"
        />
        <div className="search-icon-mobile">
          <img src={SearchIcon} alt="Search" />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="spreads-disclaimer-mobile">
        {t("indices_spreads_mobile_disclaimer")}
      </div>

      {/* Cards - Display max 6 indices data with scroll */}
      <div className="spreads-cards-scroll-container">
        <div className="spreads-cards">
          {filteredData.map((item, index) => (
            <div key={index} className="spread-card">
              {/* Card Header: Icon + Symbol */}
              <div className="spread-card__header">
                {renderSymbolIcons(item.col1)}
                <h3 className="spread-card__symbol">{item.col1}</h3>
              </div>

              {/* Card Accounts: ECN+ Account and OQtima ONE Account */}
              <div className="spread-card__accounts">
                {/* ECN+ Account Section */}
                <div className="spread-card__account">
                  <h4 className="spread-card__account-title">
                    {t("indices_spreads_mobile_ecn_account")}
                  </h4>
                  <div className="spread-card__values">
                    <span className="spread-card__label">
                      {t("indices_spreads_mobile_min")}: {item.col2}
                    </span>
                    <span className="spread-card__label">
                      {t("indices_spreads_mobile_avg")}: {item.col3}
                    </span>
                  </div>
                </div>

                {/* Divider between accounts */}
                <div className="spread-card__divider"></div>

                {/* OQtima ONE Account Section */}
                <div className="spread-card__account">
                  <h4 className="spread-card__account-title">
                    {t("indices_spreads_mobile_oqtima_account")}
                  </h4>
                  <div className="spread-card__values">
                    <span className="spread-card__label">
                      {t("indices_spreads_mobile_min")}: {item.col4}
                    </span>
                    <span className="spread-card__label">
                      {t("indices_spreads_mobile_avg")}: {item.col5}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="spreads-cta-mobile">
        <StandardButtons
          primaryText={t("button-start-trading")}
          secondaryText={t("button-try-demo")}
          onPrimaryClick={handleShowRegistrationPopup}
          onSecondaryClick={handleShowRegistrationPopup}
        />
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

IndicesSpreadsMobile.propTypes = {
  data: PropTypes.array.isRequired,
};

export default IndicesSpreadsMobile;
