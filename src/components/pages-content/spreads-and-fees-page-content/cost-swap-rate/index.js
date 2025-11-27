import React from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";

// Import assets
import badgeCostCalculatorIcon from "../../../../assets/images/icons/badge-cost-calculator.svg";
import swapRateIcon from "../../../../assets/images/icons/spreads-fees/swap-rate.svg";
import bgCardSwapRateDesktop from "../../../../assets/images/bg/spreads-fees/bg-card-swap-rate-desktop.svg";
import bgCardSwapRateMobile from "../../../../assets/images/bg/spreads-fees/bg-card-swap-rate-mobile.svg";
import bgContainerSwapRateDesktop from "../../../../assets/images/bg/spreads-fees/bg-container-swap-rate-desktop.svg";
import bgContainerSwapRateMobile from "../../../../assets/images/bg/spreads-fees/bg-container-swap-rate-mobile.svg";

const CostSwapRate = ({ className = "" }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();

  return (
    <div className={`cost-swap-rate ${className}`}>
      {/* Header Section */}
      <div className="cost-swap-rate__header">
        {/* Badge */}
        <div className="cost-swap-rate__badge">
          <div className="badge-row">
            <img
              src={badgeCostCalculatorIcon}
              alt={t("cost-swap-rate_badge-icon-alt")}
            />
            <span className="badge-label">
              {t("spreads-fees_cost_calculator_badge_text")}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="cost-swap-rate__title">
          {t("spreads-fees_swap_rate_title")}
        </h2>

        {/* Subtitle */}
        <p className="cost-swap-rate__subtitle">
          {t("spreads-fees_swap_rate_subtitle")}
        </p>
      </div>

      {/* Main Card */}
      <div className="cost-swap-rate__card">
        <div className="cost-swap-rate__card-content">
          <div className="cost-swap-rate__card-content-bg">
            <img
              src={bgContainerSwapRateDesktop}
              alt={t("cost-swap-rate_container-bg-alt")}
              className="desktop-bg"
            />
            <img
              src={bgContainerSwapRateMobile}
              alt={t("cost-swap-rate_container-bg-alt")}
              className="mobile-bg"
            />
          </div>

          {/* Left Section - Icon and Description */}
          <div className="cost-swap-rate__card-left">
            <div className="cost-swap-rate__card-left-bg">
              <img
                src={bgCardSwapRateDesktop}
                alt={t("cost-swap-rate_card-left-bg-alt")}
                className="desktop-bg"
              />
              <img
                src={bgCardSwapRateMobile}
                alt={t("cost-swap-rate_card-left-bg-alt")}
                className="mobile-bg"
              />
            </div>

            <div className="cost-swap-rate__icon">
              <img
                src={swapRateIcon}
                alt={t("cost-swap-rate_swap-rate-icon-alt")}
              />
            </div>

            <div className="cost-swap-rate__card-text">
              <h3 className="cost-swap-rate__card-title">
                {t("spreads-fees_how_is_it_calculated_title")}
              </h3>
              <p className="cost-swap-rate__card-description">
                {t("spreads-fees_swap_rate_calculation_description")}
              </p>
            </div>
          </div>

          {/* Right Section - Formula */}
          <div className="cost-swap-rate__card-right">
            <div className="cost-swap-rate__formula">
              {t("spreads-fees_swap_rate_formula")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CostSwapRate.propTypes = {
  className: PropTypes.string,
};

export default CostSwapRate;
