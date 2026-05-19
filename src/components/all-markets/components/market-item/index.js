import React, { useState, useContext, lazy, Suspense, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import MarketItemAdvantageList from "../market-item-advantage-list";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ButtonPrimaryStandard } from "../../../shared/reusable-buttons";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import WhenInView from "../../../shared/when-in-view";
import {
  FOREX_TRADING_SECTION,
  CRYPTO_TRADING_SECTION,
  SHARES_TRADING_SECTION,
  ENERGIES_TRADING_SECTION,
  METALS_TRADING_SECTION,
  INDICES_TRADING_SECTION,
  ETF_TRADING_SECTION,
} from "../../../../helpers/config";

/** Separate chunk: warm module when row mounts so Suspense + socket connect aren’t serialised on first paint. */
const tradingTickerImport = () => import("../../../trading-ticker");
const TradingTickerLazy = lazy(tradingTickerImport);

const MarketItem = ({
  className,
  icon,
  title,
  text,
  isGrayBackground,
  link,
  advantages,
  index = 0,
}) => {
  const { t } = useTranslationWithVariables();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const parityEven = index % 2 === 0;

  // Function to get the correct trading section based on title
  const getTradingSection = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("forex")) return FOREX_TRADING_SECTION;
    if (titleLower.includes("crypto")) return CRYPTO_TRADING_SECTION;
    if (titleLower.includes("shares")) return SHARES_TRADING_SECTION;
    if (titleLower.includes("energies")) return ENERGIES_TRADING_SECTION;
    if (titleLower.includes("metals")) return METALS_TRADING_SECTION;
    if (titleLower.includes("indices")) return INDICES_TRADING_SECTION;
    if (titleLower.includes("etf")) return ETF_TRADING_SECTION;
    // Default to forex if no match
    return FOREX_TRADING_SECTION;
  };

  // Function to get the correct button text based on title
  const getButtonText = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("forex"))
      return t("all-markets_market-items-list-forex-button");
    if (titleLower.includes("indices"))
      return t("all-markets_market-items-list-indices-button");
    if (titleLower.includes("shares"))
      return t("all-markets_market-items-list-shares-button");
    if (titleLower.includes("metals"))
      return t("all-markets_market-items-list-metals-button");
    if (titleLower.includes("energies"))
      return t("all-markets_market-items-list-energies-button");
    if (titleLower.includes("crypto"))
      return t("all-markets_market-items-list-crypto-button");
    if (titleLower.includes("etf"))
      return t("all-markets_market-items-list-etf-button");
    // Default to forex if no match
    return t("all-markets_market-items-list-forex-button");
  };

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    tradingTickerImport();
  }, []);

  return (
    <>
      <div
        className={cn("market-item", className, {
          "market-item--gray": isGrayBackground,
        })}
      >
        {/* Single DOM for all breakpoints — layout from CSS grid (no SSR→viewport branch flip CLS). */}
        <div
          className={cn("market-item__shell", {
            "market-item__shell--even": parityEven,
            "market-item__shell--odd": !parityEven,
          })}
        >
          <div className="market-item__desc-main">
            <img src={icon} alt="" width={64} height={64} className="market-item__icon" />
            <h2 className="market-item__title">{t(title)}</h2>
            <div className="market-item__text">
              {text.map((item, number) => (
                <span key={`${t(title)}-${number}`}>{t(item)}</span>
              ))}
            </div>
            <ButtonPrimaryStandard
              text={getButtonText(title)}
              onClick={handleShowRegistrationPopup}
              className="market-item__trade-button"
            />
          </div>
          <div className="market-item__ticker-panel">
            <div className="market-item__trading-ticker-wrapper">
              <WhenInView
                rootMargin="280px 0px 520px 0px"
                delayMs={0}
                fastReveal
              >
                <Suspense fallback={null}>
                  <TradingTickerLazy
                    pageSpecificSection={getTradingSection(title)}
                    uniqueId={`market-item-${index}-${title.toLowerCase()}`}
                  />
                </Suspense>
              </WhenInView>
            </div>
          </div>
          <div className="market-item__adv-panel">
            <MarketItemAdvantageList advantages={advantages} link={link} />
          </div>
        </div>
      </div>
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

MarketItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.arrayOf(PropTypes.string).isRequired,
  isGrayBackground: PropTypes.bool,
  link: PropTypes.string.isRequired,
  advantages: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number,
};

export default MarketItem;
