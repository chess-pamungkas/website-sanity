import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";

const CommissionTableMobile = ({ className, data }) => {
  const { t } = useTranslationWithVariables();
  return (
    <div className={cn("commission-table-mobile", className)}>
      {/* Header Section */}
      <div className="commission-table-mobile__header">
        <div className="commission-table-mobile__header-title">
          {t("spreads-fees_commission_table_header1")}
        </div>
        <div className="commission-table-mobile__header-subtitle">
          {t("spreads-fees_commission_table_header2")}
        </div>
      </div>

      {/* Commission List */}
      <div className="commission-table-mobile__list">
        {data.map((item, index) => (
          <div key={index} className="commission-table-mobile__item">
            <div className="commission-table-mobile__currency">
              <span className="commission-table-mobile__currency-code">
                {item.currencyCode}
              </span>
              <span className="commission-table-mobile__currency-name">
                {item.currencyName}
              </span>
            </div>
            <div className="commission-table-mobile__rate">
              {item.commissionRate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

CommissionTableMobile.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default CommissionTableMobile;
