import React from "react";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { FOREX_TRADING_SECTION } from "../../../helpers/config";
import { FAQ_FOREX } from "../../../helpers/faq";
import BreadcrumbsTab from "../../shared/breadcrumbs-tab";
import FeaturesProducts from "../../shared/features-products";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";
import ContainerWrapper from "../../shared/container-wrapper";
import GuideContent from "../../shared/guide-content";
import SpreadsHeader from "../../shared/spreads-header";
import FaqSection from "../../shared/faq-section";
import TradingTicker from "../../trading-ticker";
import TopMarketLayout from "../../top-market-layout";
import ForexSpreadsDesktop from "./forex-spreads-desktop";
import ForexSpreadsMobile from "./forex-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const ForexBelowHero = () => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { navigate } = useI18next();

  const handleFaqButtonClick = () => {
    navigate("/faq");
  };

  return (
    <>
      <div className="forex-content">
        <TradingTicker
          title={t("forex_trading-ticker-title")}
          pageSpecificSection={FOREX_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("forex-text")} activeTab="forex" />
      </div>

      <ContainerWrapper>
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

      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_FOREX}
          className="faq-section--forex"
          onFaqButtonClick={handleFaqButtonClick}
        />
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
    </>
  );
};

export default ForexBelowHero;
