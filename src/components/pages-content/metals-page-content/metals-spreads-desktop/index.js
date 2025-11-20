import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import SearchIcon from "../../../../assets/images/icons/metals/search-table-metals.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { StandardButtons } from "../../../shared/reusable-buttons";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";

const MetalsSpreadsDesktop = ({ data }) => {
  const { t } = useTranslationWithVariables();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const isRTL = useRtlDirection();

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
    <div
      className={`metals-spreads-desktop ${
        isRTL ? "metals-spreads-desktop--rtl" : ""
      }`}
    >
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-frame">
          <input
            type="text"
            placeholder={t("metals_spreads_search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">
            <img src={SearchIcon} alt="Search" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="spreads-table-container">
        <table className="spreads-table">
          {/* Header Section */}
          <thead className="table-header-section">
            {/* Main Header Row */}
            <tr className="table-main-header">
              <th>{t("metals_spreads_table_header_product")}</th>
              <th className="table-header__ecn" colSpan="2">
                {t("metals_spreads_table_header_ecn_account")}
              </th>
              <th className="table-header__oqtima" colSpan="2">
                {t("metals_spreads_table_header_oqtima_account")}
              </th>
            </tr>
            {/* Sub Header Row */}
            <tr className="table-sub-header">
              <th>{t("metals_spreads_table_header_symbol")}</th>
              <th className="table-subheader__min">
                {t("metals_spreads_table_header_min")}
              </th>
              <th className="table-subheader__avg">
                {t("metals_spreads_table_header_avg")}
              </th>
              <th className="table-subheader__min">
                {t("metals_spreads_table_header_min")}
              </th>
              <th className="table-subheader__avg">
                {t("metals_spreads_table_header_avg")}
              </th>
            </tr>
          </thead>
        </table>

        {/* Body Section with Scroll */}
        <div className="table-body-scroll-container">
          <table className="spreads-table-body">
            <tbody className="table-body-section">
              {filteredData.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{item.col1}</td>
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

MetalsSpreadsDesktop.propTypes = {
  data: PropTypes.array.isRequired,
};

export default MetalsSpreadsDesktop;
