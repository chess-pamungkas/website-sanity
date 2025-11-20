import React from "react";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";

// Import icon
import featuresIcon from "../../../../assets/images/icons/features.svg";

const FundingWithdrawalsHeader = () => {
  const { isMobile } = useWindowSize();
  const { t } = useTranslationWithVariables();

  return (
    <div className="funding-withdrawals-header">
      <div className="funding-withdrawals-header__container">
        {/* Badge */}
        <div className="funding-withdrawals-header__badge">
          <div className="funding-withdrawals-header__badge-content">
            <img
              src={featuresIcon}
              alt={t("funding-withdrawals_badge-alt")}
              className="funding-withdrawals-header__badge-icon"
            />
            <span className="funding-withdrawals-header__badge-message">
              {t("funding-withdrawals_badge-message")}
            </span>
          </div>
        </div>

        {/* Title and Subtitle Container */}
        <div className="funding-withdrawals-header__content">
          {/* Title */}
          <h2 className="funding-withdrawals-header__title">
            {t("funding-withdrawals_header-title") || "Funding & Withdrawals"}
          </h2>

          {/* Subtitle */}
          <p className="funding-withdrawals-header__subtitle">
            {t("funding-withdrawals_header-subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundingWithdrawalsHeader;
