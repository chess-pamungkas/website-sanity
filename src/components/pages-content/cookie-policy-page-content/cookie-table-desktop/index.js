import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import SearchIcon from "../../../../assets/images/icons/metals/search-table-metals.svg";

const CookieTableDesktop = ({ data }) => {
  const { t } = useTranslationWithVariables();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    item.col1.props.children.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cookie-table-desktop">
      {/* Table */}
      <div className="cookie-table-container">
        <table className="cookie-table">
          {/* Header Section */}
          <thead className="table-header-section">
            {/* Main Header Row */}
            <tr className="table-main-header">
              <th>{t("cookie_policy_table_header_company")}</th>
              <th>{t("cookie_policy_table_header_cookies")}</th>
              <th>{t("cookie_policy_table_header_opt_out")}</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable Body Section */}
        <div className="table-body-scroll-container">
          <table className="cookie-table-body">
            <tbody className="table-body-section">
              {filteredData.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{item.col1}</td>
                  <td className="table-cell">{item.col2}</td>
                  <td className="table-cell">{item.col3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

CookieTableDesktop.propTypes = {
  data: PropTypes.array.isRequired,
};

export default CookieTableDesktop;
