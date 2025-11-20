import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { CRYPTO_TRADING_SECTION } from "../../../helpers/config";
import { DATA_CRYPTO } from "../../../helpers/top-market-tables";
import { FAQ_CRYPTO } from "../../../helpers/faq";
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
import CryptoSpreadsDesktop from "./crypto-spreads-desktop";
import CryptoSpreadsMobile from "./crypto-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const CryptoContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { tradingSymbols } = useContext(TradingContext);
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

  updateTableDataWithLiveColumn(DATA_CRYPTO, tradingSymbols);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="crypto"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/crypto/crypto-desktop.svg)"
        mobileBackground="url(../images/bg/hero/crypto/crypto-mobile.svg)"
      />

      <div className="crypto-content">
        <TradingTicker
          title={t("crypto_trading-ticker-title")}
          pageSpecificSection={CRYPTO_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("crypto-text")} activeTab="crypto" />
      </div>

      <ContainerWrapper>
        {/* Crypto Features Products */}
        <FeaturesProducts
          tradingType="crypto"
          features={getFeaturesByTradingType("crypto")}
        />
      </ContainerWrapper>

      <AccountComparison />

      <TopMarketLayout
        className="top-market-layout--crypto-spreads container"
        headerTemplate={<SpreadsHeader tradingType="crypto" />}
      >
        {isMobile ? (
          <CryptoSpreadsMobile data={DATA_CRYPTO} />
        ) : (
          <CryptoSpreadsDesktop data={DATA_CRYPTO} />
        )}
      </TopMarketLayout>

      {/* FAQ Section - Crypto Trading Questions */}
      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_CRYPTO}
          className="faq-section--crypto"
          badgeTextKey="faq-badge-text"
          titleKey="faq-title"
          subtitleKey="faq-subtitle"
          buttonTextKey="faq-button-text"
          onFaqButtonClick={handleFaqButtonClick}
        />
      </ContainerWrapper>

      {/* Guide Content Section */}
      <ContainerWrapper>
        <GuideContent
          titleKey="crypto-guide-title"
          subtitleKey="crypto-guide-subtitle"
          className="guide-content--crypto"
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

CryptoContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default CryptoContent;
