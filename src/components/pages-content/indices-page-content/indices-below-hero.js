import React, { useContext, useMemo } from "react";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { INDICES_TRADING_SECTION } from "../../../helpers/config";
import { DATA_INDICES } from "../../../helpers/top-market-tables";
import { FAQ_INDICES } from "../../../helpers/faq";
import BreadcrumbsTab from "../../shared/breadcrumbs-tab";
import FeaturesProducts from "../../shared/features-products";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";
import ContainerWrapper from "../../shared/container-wrapper";
import GuideContent from "../../shared/guide-content";
import SpreadsHeader from "../../shared/spreads-header";
import FaqSection from "../../shared/faq-section";
import TradingContext from "../../../context/trading-context";
import TradingTicker from "../../trading-ticker";
import TopMarketLayout from "../../top-market-layout";
import IndicesSpreadsDesktop from "./indices-spreads-desktop";
import IndicesSpreadsMobile from "./indices-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const IndicesBelowHero = () => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { tradingSymbols } = useContext(TradingContext);
  const { navigate } = useI18next();

  const indicesSpreadsData = useMemo(() => {
    const rows = DATA_INDICES.map((row) => ({ ...row }));
    updateTableDataWithLiveColumn(rows, tradingSymbols);
    return rows;
  }, [tradingSymbols]);

  const handleFaqButtonClick = () => {
    navigate("/faq");
  };

  return (
    <>
      <div className="indices-content">
        <TradingTicker
          title={t("indices_trading-ticker-title")}
          pageSpecificSection={INDICES_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("indices-text")} activeTab="indices" />
      </div>

      <ContainerWrapper>
        <FeaturesProducts
          tradingType="indices"
          features={getFeaturesByTradingType("indices")}
        />
      </ContainerWrapper>

      <AccountComparison />

      <TopMarketLayout
        className="top-market-layout--indices-spreads container"
        headerTemplate={<SpreadsHeader tradingType="indices" />}
      >
        {isMobile ? (
          <IndicesSpreadsMobile data={indicesSpreadsData} />
        ) : (
          <IndicesSpreadsDesktop data={indicesSpreadsData} />
        )}
      </TopMarketLayout>

      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_INDICES}
          className="faq-section--indices"
          badgeTextKey="faq-badge-text"
          titleKey="faq-title"
          subtitleKey="faq-subtitle"
          buttonTextKey="faq-button-text"
          onFaqButtonClick={handleFaqButtonClick}
        />
        <GuideContent
          titleKey="indices-guide-title"
          subtitleKey="indices-guide-subtitle"
          className="guide-content--indices"
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

export default IndicesBelowHero;
