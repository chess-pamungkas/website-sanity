import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import SearchIcon from "../../../../assets/images/icons/metals/search-table-metals.svg";

const CookieTableMobile = ({ data }) => {
  const { t } = useTranslationWithVariables();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    item.col1.props.children.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cookie-table-mobile">
      {/* Cards - Display cookie data with scroll */}
      <div className="cookie-cards-scroll-container">
        <div className="cookie-cards">
          {filteredData.map((item, index) => (
            <div key={index} className="cookie-card">
              {/* Card Header: Company */}
              <div className="cookie-card__header">
                <h3 className="cookie-card__company">{item.col1}</h3>
              </div>

              {/* Card Content: Cookies and Opt Out */}
              <div className="cookie-card__content">
                {/* Cookies Section */}
                <div className="cookie-card__section">
                  <h4 className="cookie-card__section-title">
                    {t("cookie_policy_mobile_cookies")}
                  </h4>
                  <p className="cookie-card__section-text">{item.col2}</p>
                </div>

                {/* Divider between sections */}
                <div className="cookie-card__divider"></div>

                {/* Opt Out Section */}
                <div className="cookie-card__section">
                  <h4 className="cookie-card__section-title">
                    {t("cookie_policy_mobile_opt_out")}
                  </h4>
                  <p className="cookie-card__section-text">{item.col3}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

CookieTableMobile.propTypes = {
  data: PropTypes.array.isRequired,
};

export default CookieTableMobile;
