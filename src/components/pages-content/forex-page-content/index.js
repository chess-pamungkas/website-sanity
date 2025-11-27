import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { FOREX_TRADING_SECTION } from "../../../helpers/config";
import {
  DATA_FOREX_MINOR,
  DATA_FOREX_MAJOR,
} from "../../../helpers/top-market-tables";
import { FAQ_FOREX } from "../../../helpers/faq";
import BreadcrumbsTab from "../../shared/breadcrumbs-tab";
import FeaturesProducts from "../../shared/features-products";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";
import ContainerWrapper from "../../shared/container-wrapper";
import Hero from "../../shared/hero";
import GuideContent from "../../shared/guide-content";
import SpreadsHeader from "../../shared/spreads-header";
import FaqSection from "../../shared/faq-section";
import TradingContext from "../../../context/trading-context";
import TradingTicker from "../../trading-ticker";
import TopMarketLayout from "../../top-market-layout";
import ForexSpreadsDesktop from "./forex-spreads-desktop";
import ForexSpreadsMobile from "./forex-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const ForexContent = ({ className, isShowHero }) => {
  const { t } = useTranslationWithVariables();
  const { tradingSymbols } = useContext(TradingContext);
  const { isMobile } = useWindowSize();
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const { navigate } = useI18next();

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const handleFaqButtonClick = () => {
    // Navigate to FAQ page
    // Use navigate from useI18next to preserve language prefix in browser history
    navigate("/faq");
  };

  updateTableDataWithLiveColumn(DATA_FOREX_MINOR, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_FOREX_MAJOR, tradingSymbols);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="forex"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/forex/forex-desktop.svg)"
        mobileBackground="url(../images/bg/hero/forex/forex-mobile.svg)"
      />

      <div className="forex-content">
        <TradingTicker
          title={t("forex_trading-ticker-title")}
          pageSpecificSection={FOREX_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("forex-text")} activeTab="forex" />
      </div>

      <ContainerWrapper>
        {/* Forex Features Products */}
        <FeaturesProducts
          tradingType="forex"
          features={getFeaturesByTradingType("forex")}
        />
      </ContainerWrapper>

      <AccountComparison />

      <TopMarketLayout
        className="top-market-layout--forex-spreads container"
        headerTemplate={<SpreadsHeader tradingType="forex" />}
      >
        {isMobile ? <ForexSpreadsMobile /> : <ForexSpreadsDesktop />}
      </TopMarketLayout>

      {/* FAQ Section - Forex Trading Questions */}
      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_FOREX}
          className="faq-section--forex"
          onFaqButtonClick={handleFaqButtonClick}
        />
      </ContainerWrapper>

      {/* Guide Content Section */}
      <ContainerWrapper>
        <GuideContent
          titleKey="forex-guide-title"
          subtitleKey="forex-guide-subtitle"
          className="guide-content--forex"
        />
      </ContainerWrapper>

      {isMobile ? (
        <OurCommunityContent />
      ) : (
        <ContainerWrapper>
          <OurCommunityContent />
        </ContainerWrapper>
      )}

      {/* Render the popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam} // Pass langParam if needed
        />
      )}
    </>
  );
};

ForexContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default ForexContent;
