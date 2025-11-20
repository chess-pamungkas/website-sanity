import React from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";

const WithdrawalTableMobile = ({ data, isDeposit = true }) => {
  const { t } = useTranslationWithVariables();

  // Use the same data as desktop
  const methods = data || [];

  // Function to render method name
  const renderMethodName = (methodName) => {
    return <div className="withdrawal-card__method-name">{methodName}</div>;
  };

  return (
    <div className="withdrawal-table-mobile">
      {/* Cards Container */}
      <div className="withdrawal-cards-scroll-container">
        <div className="withdrawal-cards">
          {methods.map((method, index) => (
            <div key={index} className="withdrawal-card">
              {/* Card Header: Method */}
              <div className="withdrawal-card__header">
                <div className="withdrawal-card__method">
                  <div className="withdrawal-card__method-label">
                    {t("funding-withdrawals_method-label")}
                  </div>
                  {renderMethodName(method.col1)}
                </div>
              </div>

              {/* Card Details Grid */}
              <div className="withdrawal-card__details">
                {/* Processing Time and Min Deposit Row */}
                <div className="withdrawal-card__detail-row">
                  <div className="withdrawal-card__detail-group">
                    <div className="withdrawal-card__detail-label">
                      {t("funding-withdrawals_processing-time")}
                    </div>
                    <div className="withdrawal-card__detail-value">
                      {method.col2}
                    </div>
                  </div>
                  {isDeposit && (
                    <div className="withdrawal-card__detail-group">
                      <div className="withdrawal-card__detail-label">
                        {t("funding-withdrawals_min-deposit")}
                      </div>
                      <div className="withdrawal-card__detail-value">
                        {method.col3}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fees and Currencies Accepted Row */}
                <div className="withdrawal-card__detail-row">
                  <div className="withdrawal-card__detail-group">
                    <div className="withdrawal-card__detail-label">
                      {t("funding-withdrawals_fees")}
                    </div>
                    <div className="withdrawal-card__detail-value">
                      {isDeposit ? method.col4 : method.col3}
                    </div>
                  </div>
                  <div className="withdrawal-card__detail-group">
                    <div className="withdrawal-card__detail-label">
                      {t("funding-withdrawals_currencies-accepted")}
                    </div>
                    <div className="withdrawal-card__detail-value">
                      {isDeposit ? method.col5 : method.col4}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

WithdrawalTableMobile.propTypes = {
  data: PropTypes.array,
  isDeposit: PropTypes.bool,
};

export default WithdrawalTableMobile;
