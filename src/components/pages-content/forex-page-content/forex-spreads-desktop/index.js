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
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";

const ForexSpreadsDesktop = () => {
  const { t } = useTranslationWithVariables();
  const { tradingSymbols } = useContext(TradingContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("major"); // "major" or "minor"
  const isRTL = useRtlDirection();

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

  return (
    <>
      <div
        className={`forex-spreads-desktop ${
          isRTL ? "forex-spreads-desktop--rtl" : ""
        }`}
      >
        {/* Search Container with Tabs */}
        <div className="search-container">
          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "major" ? "tab--active" : ""}`}
                onClick={() => handleTabChange("major")}
              >
                {t("forex_spreads_tab_major")}
              </button>
              <button
                className={`tab ${activeTab === "minor" ? "tab--active" : ""}`}
                onClick={() => handleTabChange("minor")}
              >
                {t("forex_spreads_tab_minor")}
              </button>
            </div>
          </div>

          {/* Explanatory Text */}
          <div className="explanation-text">
            {t("forex_spreads_explanation")}
          </div>

          {/* Search Bar */}
          <div className="search-frame">
            <input
              type="text"
              className="search-input"
              placeholder={t("forex_spreads_search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-icon">
              <img src={SearchIcon} alt="Search" />
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
                <th>{t("forex_spreads_table_header_product")}</th>
                <th className="table-header__ecn" colSpan="2">
                  {t("forex_spreads_table_header_ecn_account")}
                </th>
                <th className="table-header__oqtima" colSpan="2">
                  {t("forex_spreads_table_header_oqtima_account")}
                </th>
              </tr>
              {/* Sub Header Row */}
              <tr className="table-sub-header">
                <th>{t("forex_spreads_table_header_symbol")}</th>
                <th>{t("forex_spreads_table_header_min")}</th>
                <th>{t("forex_spreads_table_header_avg")}</th>
                <th>{t("forex_spreads_table_header_min")}</th>
                <th>{t("forex_spreads_table_header_avg")}</th>
              </tr>
            </thead>
          </table>

          {/* Scrollable Body Section */}
          <div className="table-body-scroll-container">
            <table className="spreads-table-body">
              <tbody className="table-body-section">
                {filteredData.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell table-cell__symbol">
                      {item.col1}
                    </td>
                    <td className="table-cell table-cell__min">{item.col2}</td>
                    <td className="table-cell table-cell__avg">{item.col3}</td>
                    <td className="table-cell table-cell__min">{item.col4}</td>
                    <td className="table-cell table-cell__avg">{item.col5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        {/* <div className="spreads-disclaimer">
          Spreads generated from data between 24/05/2025 and 28/05/2025
        </div> */}

        {/* CTA Buttons */}
        <div className="spreads-cta">
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

ForexSpreadsDesktop.propTypes = {};

export default ForexSpreadsDesktop;
