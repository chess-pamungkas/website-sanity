import React, { useState, useContext } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import MarketItemAdvantageList from "../market-item-advantage-list";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ButtonPrimaryStandard } from "../../../shared/reusable-buttons";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import TradingTicker from "../../../trading-ticker";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import {
  FOREX_TRADING_SECTION,
  CRYPTO_TRADING_SECTION,
  SHARES_TRADING_SECTION,
  ENERGIES_TRADING_SECTION,
  METALS_TRADING_SECTION,
  INDICES_TRADING_SECTION,
  ETF_TRADING_SECTION,
} from "../../../../helpers/config";

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
  const { isMobile, isTablet } = useWindowSize();

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

  return (
    <>
      <div
        className={cn("market-item", className, {
          "market-item--gray": isGrayBackground,
        })}
      >
        {isMobile ? (
          // Mobile: no container wrapper
          <>
            <div className="market-item__description">
              <img src={icon} alt="" className="market-item__icon" />
              <h3 className="market-item__title">{t(title)}</h3>
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
              <div className="market-item__trading-ticker-wrapper">
                <TradingTicker
                  pageSpecificSection={getTradingSection(title)}
                  uniqueId={`market-item-${index}-${title.toLowerCase()}`}
                />
              </div>
            </div>
            <div className="market-item__advantages">
              <MarketItemAdvantageList advantages={advantages} link={link} />
            </div>
          </>
        ) : (
          // Desktop: with container wrapper
          <div className="market-item__container">
            {index % 2 === 0 ? (
              // Even items: description left, advantages right
              <>
                <div className="market-item__description">
                  <img src={icon} alt="" className="market-item__icon" />
                  <h3 className="market-item__title">{t(title)}</h3>
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
                  {!isTablet ? (
                    <div className="market-item__trading-ticker-wrapper">
                      <TradingTicker
                        pageSpecificSection={getTradingSection(title)}
                        uniqueId={`market-item-${index}-${title.toLowerCase()}`}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="market-item__advantages">
                  <MarketItemAdvantageList
                    advantages={advantages}
                    link={link}
                  />
                </div>
                {isTablet ? (
                  <div className="market-item__trading-ticker-wrapper">
                    <TradingTicker
                      pageSpecificSection={getTradingSection(title)}
                      uniqueId={`market-item-${index}-${title.toLowerCase()}`}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              // Odd items: advantages left, description right
              <>
                <div className="market-item__advantages">
                  <MarketItemAdvantageList
                    advantages={advantages}
                    link={link}
                  />
                </div>
                <div className="market-item__description">
                  <img src={icon} alt="" className="market-item__icon" />
                  <h3 className="market-item__title">{t(title)}</h3>
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
                  {!isTablet ? (
                    <div className="market-item__trading-ticker-wrapper">
                      <TradingTicker
                        pageSpecificSection={getTradingSection(title)}
                        uniqueId={`market-item-${index}-${title.toLowerCase()}`}
                      />
                    </div>
                  ) : null}
                </div>
                {isTablet ? (
                  <div className="market-item__trading-ticker-wrapper">
                    <TradingTicker
                      pageSpecificSection={getTradingSection(title)}
                      uniqueId={`market-item-${index}-${title.toLowerCase()}`}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
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
