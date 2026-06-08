import React, { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  CLIENTS_MARKS,
  COST_PER_CLIENT,
  DEFAULT_CLIENTS,
  MAX_CLIENTS,
  MIN_CLIENTS,
} from "../../../../helpers/partners.config";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../../../helpers/constants";
import IncomeSliderIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/features.svg";

const INCOME_SLIDER_RANGE_ID = "partners-income-slider-range";

const IncomeSlider = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const [clientsCount, setClientsCount] = useState(DEFAULT_CLIENTS);
  const [totalIncome, setTotalIncome] = useState(
    DEFAULT_CLIENTS * COST_PER_CLIENT
  );

  const onSliderChange = (value) => {
    setClientsCount(value);
    setTotalIncome(value * COST_PER_CLIENT);
  };

  const handleSliderInput = (event) => {
    let value = parseInt(event.target.value);

    // In RTL mode, we need to reverse the value calculation
    if (isRTL) {
      // Convert LTR value to RTL value
      // LTR: 10=0%, 500=100% -> RTL: 10=100%, 500=0%
      const percentage =
        ((value - MIN_CLIENTS) / (MAX_CLIENTS - MIN_CLIENTS)) * 100;
      const rtlPercentage = 100 - percentage;
      value = Math.round(
        MIN_CLIENTS + (rtlPercentage / 100) * (MAX_CLIENTS - MIN_CLIENTS)
      );
    }

    onSliderChange(value);
  };

  const getSliderPercentage = () => {
    return ((clientsCount - MIN_CLIENTS) / (MAX_CLIENTS - MIN_CLIENTS)) * 100;
  };

  const getRTLInputValue = () => {
    if (!isRTL) return clientsCount;

    // Convert RTL value to LTR input value
    const percentage =
      ((clientsCount - MIN_CLIENTS) / (MAX_CLIENTS - MIN_CLIENTS)) * 100;
    const rtlPercentage = 100 - percentage;
    return Math.round(
      MIN_CLIENTS + (rtlPercentage / 100) * (MAX_CLIENTS - MIN_CLIENTS)
    );
  };

  // No need for separate RTL calculation - we use the same percentage
  // The difference is in CSS positioning (right instead of left)

  return (
    <section
      className={cn("income-slider", className, {
        "income-slider--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="income-slider__wrapper container">
        {/* Badge */}
        <div className="income-slider__badge">
          <img
            src={IncomeSliderIcon}
            alt={t("partners_income-slider_badge-icon-alt")}
            className="income-slider__badge-icon"
            width={16}
            height={16}
          />
          <span className="income-slider__badge-text">
            {t("partners_income-slider_badge-text")}
          </span>
        </div>

        {/* Title */}
        <h2 id="income-slider-heading" className="income-slider__title">
          {t("partners_income-slider_title")}
        </h2>

        {/* Main Container - Figma Horizontal Layout */}
        <div className="income-slider__main-container container">
          {/* Mobile Stats Cards Container */}
          <div className="income-slider__stats-mobile">
            {/* Left Stats Card - Clients */}
            <div className="income-slider__stat-card income-slider__stat-card--clients">
              <div className="income-slider__stat-content">
                <h3 className="income-slider__stat-value">{clientsCount}</h3>
                <p className="income-slider__stat-label">
                  {t(`partners_income-slider-clients-note-fsa`)}
                </p>
              </div>
            </div>

            {/* Right Stats Card - Income */}
            <div className="income-slider__stat-card income-slider__stat-card--income">
              <div className="income-slider__stat-content">
                <h3 className="income-slider__stat-value income-slider__stat-value--income">
                  $ {totalIncome}
                </h3>
                <p className="income-slider__stat-label">
                  {t(`partners_income-slider-income-note-fsa`)}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Left Stats Card - Clients (hidden on mobile) */}
          <div className="income-slider__stat-card income-slider__stat-card--clients income-slider__stat-card--desktop">
            <div className="income-slider__stat-content">
              <h3 className="income-slider__stat-value">{clientsCount}</h3>
              <p className="income-slider__stat-label">
                {t(`partners_income-slider-clients-note-fsa`)}
              </p>
            </div>
          </div>

          {/* Center Progress Bar */}
          <div className="income-slider__progress-container">
            <div className="income-slider__progress-bar">
              <div className="income-slider__progress-track">
                <div
                  className="income-slider__progress-fill"
                  style={{
                    width: `${getSliderPercentage()}%`,
                  }}
                ></div>
                <input
                  id={INCOME_SLIDER_RANGE_ID}
                  type="range"
                  min={MIN_CLIENTS}
                  max={MAX_CLIENTS}
                  value={isRTL ? getRTLInputValue() : clientsCount}
                  onChange={handleSliderInput}
                  className="income-slider__progress-input"
                  aria-labelledby="income-slider-heading"
                  aria-valuemin={MIN_CLIENTS}
                  aria-valuemax={MAX_CLIENTS}
                  aria-valuenow={clientsCount}
                  aria-valuetext={`${clientsCount} ${t(
                    "partners_income-slider-clients-note-fsa"
                  )}`}
                />
              </div>

              {/* Progress Marks - Vertical lines */}
              <div className="income-slider__progress-marks">
                {CLIENTS_MARKS.map((mark) => (
                  <div key={mark} className="income-slider__progress-mark">
                    <div className="partners-income__slider-mark-v-line"></div>
                  </div>
                ))}
              </div>

              {/* Slider Thumb */}
              <div
                className="income-slider__progress-thumb"
                style={{
                  left: `${getSliderPercentage()}%`,
                  "--thumb-position": `${getSliderPercentage()}%`,
                }}
              >
                <div className="income-slider__progress-thumb-handle"></div>
                <div className="income-slider__progress-thumb-line"></div>
              </div>
            </div>

            {/* Progress Mark Numbers - Below the bar */}
            <div className="income-slider__progress-numbers">
              {CLIENTS_MARKS.map((mark) => (
                <span
                  key={mark}
                  className="partners-income__slider-mark-number"
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop Right Stats Card - Income (hidden on mobile) */}
          <div className="income-slider__stat-card income-slider__stat-card--income income-slider__stat-card--desktop">
            <div className="income-slider__stat-content">
              <h3 className="income-slider__stat-value income-slider__stat-value--income">
                $ {totalIncome}
              </h3>
              <p className="income-slider__stat-label">
                {t(`partners_income-slider-income-note-fsa`)}
              </p>
            </div>
          </div>
        </div>

        {/* Description - Moved below content as per Figma */}
        <div className="income-slider__description">
          {t(`partners_income-slider-description-fsa`)}
        </div>
      </div>
    </section>
  );
};

IncomeSlider.propTypes = {
  className: PropTypes.string,
};

export default IncomeSlider;
