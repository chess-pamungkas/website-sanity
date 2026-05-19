import React, { useContext } from "react";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { METALS_TRADING_SECTION } from "../../../helpers/config";
import { DATA_METALS } from "../../../helpers/top-market-tables";
import { FAQ_METALS } from "../../../helpers/faq";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import TradingContext from "../../../context/trading-context";
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
import MetalsSpreadsDesktop from "./metals-spreads-desktop";
import MetalsSpreadsMobile from "./metals-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const MetalsBelowHero = () => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { tradingSymbols } = useContext(TradingContext);
  const { navigate } = useI18next();

  const handleFaqButtonClick = () => {
    navigate("/faq");
  };

  updateTableDataWithLiveColumn(DATA_METALS, tradingSymbols);

  return (
    <>
      <div className="metals-content">
        <TradingTicker
          title={t("metals_trading-ticker-title")}
          pageSpecificSection={METALS_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("metals-text")} activeTab="metals" />
      </div>

      <ContainerWrapper>
        <FeaturesProducts
          tradingType="metals"
          features={getFeaturesByTradingType("metals")}
        />
      </ContainerWrapper>

      <AccountComparison />

      <TopMarketLayout
        className="top-market-layout--metals-spreads container"
        headerTemplate={<SpreadsHeader tradingType="metals" />}
      >
        {isMobile ? (
          <MetalsSpreadsMobile data={DATA_METALS} />
        ) : (
          <MetalsSpreadsDesktop data={DATA_METALS} />
        )}
      </TopMarketLayout>

      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_METALS}
          className="faq-section--metals"
          badgeTextKey="faq-badge-text"
          titleKey="faq-title"
          subtitleKey="faq-subtitle"
          buttonTextKey="faq-button-text"
          onFaqButtonClick={handleFaqButtonClick}
        />
        <GuideContent
          titleKey="metals-guide-title"
          subtitleKey="metals-guide-subtitle"
          className="guide-content--metals"
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

export default MetalsBelowHero;
