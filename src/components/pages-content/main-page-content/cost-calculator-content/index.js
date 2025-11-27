import React, { useState, useContext } from "react";
import Slider from "../../../shared/slider";
import BadgeCostCalculator from "../../../../assets/images/icons/main-page/cost-calculator/badge-cost-calculator.svg";
import BadgeIndustryAverage from "../../../../assets/images/icons/main-page/cost-calculator/badge-industry-average.svg";
import BadgeOqtimaEcn from "../../../../assets/images/icons/main-page/cost-calculator/badge-oqtima-ecn+.svg";
import SliderThumbSVG from "../../../../assets/images/icons/main-page/cost-calculator/slider-thumb.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { StandardButtons } from "../../../shared/reusable-buttons";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";

const TRADE_VOLUME_MIN = 0.1;
const TRADE_VOLUME_MAX = 10;
const TRADE_VOLUME_STEP = 0.1;
const TRADE_VOLUME_DEFAULT = 5.5;
const MONTHLY_TRADES_OPTIONS = [20, 50, 100];

function calculateSavings(monthlyTrades, lotsPerTrade) {
  const SAVINGS_PER_SIDE = 1.5;
  return {
    monthly: monthlyTrades * lotsPerTrade * (SAVINGS_PER_SIDE * 2),
    annual: monthlyTrades * lotsPerTrade * (SAVINGS_PER_SIDE * 2) * 12,
  };
}

const CostCalculatorContent = () => {
  const [tradeVolume, setTradeVolume] = useState(TRADE_VOLUME_DEFAULT);
  const [monthlyTrades, setMonthlyTrades] = useState(MONTHLY_TRADES_OPTIONS[0]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Calculate savings using the new logic
  const { monthly: monthlySavings, annual: annualSavings } = calculateSavings(
    monthlyTrades,
    tradeVolume
  );

  // Custom thumb renderer for the slider
  const renderThumb = (props, state) => (
    <div
      {...props}
      style={{
        ...props.style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        background: "none",
        boxShadow: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        zIndex: 2,
        transform: isRTL ? "translate(-12px, -0)" : "translate(12px, -0)",
      }}
    >
      <img
        src={SliderThumbSVG}
        alt={t("cost-calculator_slider-thumb-alt")}
        style={{
          width: 36,
          height: 36,
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  return (
    <section
      className={`cost-calculator-content ${
        isRTL ? "cost-calculator-content--rtl" : ""
      }`}
    >
      <div className="cost-calculator-content__left">
        <div className="cost-calculator-content__badge-row">
          <span className="cost-calculator-content__badge">
            <img
              src={BadgeCostCalculator}
              alt={t("cost-calculator_badge-icon-alt")}
              width={14}
              height={14}
            />
            {t("cost-calculator_badge-text")}
          </span>
        </div>
        <div className="cost-calculator-content__title">
          {t("cost-calculator_title")}{" "}
          <span>{t("cost-calculator_title-highlight")}</span>
          <br />
          {t("cost-calculator_title-line2")}
        </div>
        <div className="cost-calculator-content__subtitle">
          {t("cost-calculator_subtitle")}
        </div>
        <div className="navbar-dropdown-highlight__button-group">
          <StandardButtons
            primaryText={t("button-start-trading")}
            secondaryText={t("button-try-demo")}
            onPrimaryClick={handleShowRegistrationPopup}
            onSecondaryClick={handleShowRegistrationPopup}
          />
        </div>
        {isPopupOpen && (
          <ShowRegistrationPopup
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            langParam={selectedLanguage.id}
          />
        )}
      </div>
      <div className="cost-calculator-content__right">
        <div className="cost-calculator-content__card">
          <div className="cost-calculator-content__card-title">
            {t("cost-calculator_card-title")}
          </div>
          <div className="cost-calculator-content__slider-label">
            {t("cost-calculator_trade-volumes-label")}
            <span className="cost-calculator-content__slider-value">
              {tradeVolume.toFixed(1)} {t("cost-calculator_lots-text")}
            </span>
          </div>
          <div className="cost-calculator-content__slider">
            <Slider
              minValue={TRADE_VOLUME_MIN}
              maxValue={TRADE_VOLUME_MAX}
              currentValue={tradeVolume}
              onChange={setTradeVolume}
              marks={[]}
              step={TRADE_VOLUME_STEP}
              className="cost-calculator-content__slider-component"
              thumbClassName="cost-calculator-content__slider-thumb"
              trackClassName="cost-calculator-content__slider-track"
              renderThumb={renderThumb}
              ariaLabel={t("cost-calculator_trade-volumes-label")}
              invert={isRTL}
            />
          </div>
          <div className="cost-calculator-content__divider" />
          <div
            className="cost-calculator-content__slider-label-2"
            style={{ marginTop: 2 }}
          >
            {t("cost-calculator_monthly-trades-label")}
          </div>
          <div className="cost-calculator-content__monthly-trades">
            {MONTHLY_TRADES_OPTIONS.map((option) => (
              <button
                key={option}
                className={`cost-calculator-content__trade-btn${
                  monthlyTrades === option ? " active" : ""
                }`}
                onClick={() => setMonthlyTrades(option)}
              >
                {option === 100 ? "100+" : option}
              </button>
            ))}
          </div>
        </div>
        <div className="cost-calculator-content__comparison-container">
          <div className="cost-calculator-content__comparison-row">
            <div className="cost-calculator-content__comparison-card">
              <div className="cost-calculator-content__comparison-badge">
                <img
                  src={BadgeIndustryAverage}
                  alt={t("cost-calculator_industry-average-alt")}
                />{" "}
                {t("cost-calculator_industry-average-text")}
              </div>
              <div className="cost-calculator-content__comparison-value cost-calculator-content__comparison-value--industry">
                $3.00 <span>{t("cost-calculator_per-side-text")}</span>
              </div>
            </div>
            <div className="cost-calculator-content__comparison-card cost-calculator-content__comparison-card--oqtima">
              <div className="cost-calculator-content__comparison-badge cost-calculator-content__comparison-badge--oqtima">
                <img
                  src={BadgeOqtimaEcn}
                  alt={t("cost-calculator_oqtima-ecn-alt")}
                />{" "}
                {t("cost-calculator_oqtima-ecn-text")}
              </div>
              <div className="cost-calculator-content__comparison-value cost-calculator-content__comparison-value--oqtima">
                $1.50 <span>{t("cost-calculator_per-side-text")}</span>
              </div>
            </div>
          </div>
          <div className="cost-calculator-content__savings-info">
            {t("cost-calculator_save-percentage")}{" "}
            <span>{t("cost-calculator_save-percentage-value")}</span>{" "}
            {t("cost-calculator_save-percentage-text")}
            <br />
            {t("cost-calculator_monthly-saved")}{" "}
            <span>${monthlySavings.toLocaleString()}</span>{" "}
            {t("cost-calculator_saved-text")},
            {t("cost-calculator_annual-saved")}{" "}
            <span>${annualSavings.toLocaleString()}</span>{" "}
            {t("cost-calculator_saved-text")}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculatorContent;
