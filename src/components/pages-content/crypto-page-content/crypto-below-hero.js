import React, { useContext, useMemo } from "react";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
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
import GuideContent from "../../shared/guide-content";
import SpreadsHeader from "../../shared/spreads-header";
import FaqSection from "../../shared/faq-section";
import TradingContext from "../../../context/trading-context";
import TradingTicker from "../../trading-ticker";
import TopMarketLayout from "../../top-market-layout";
import CryptoSpreadsDesktop from "./crypto-spreads-desktop";
import CryptoSpreadsMobile from "./crypto-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const CryptoBelowHero = () => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { tradingSymbols } = useContext(TradingContext);
  const { navigate } = useI18next();

  const cryptoSpreadsData = useMemo(() => {
    const rows = DATA_CRYPTO.map((row) => ({ ...row }));
    updateTableDataWithLiveColumn(rows, tradingSymbols);
    return rows;
  }, [tradingSymbols]);

  const handleFaqButtonClick = () => {
    navigate("/faq");
  };

  return (
    <>
      <div className="crypto-content">
        <TradingTicker
          title={t("crypto_trading-ticker-title")}
          pageSpecificSection={CRYPTO_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("crypto-text")} activeTab="crypto" />
      </div>

      <ContainerWrapper>
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
        <div className="crypto-spreads-responsive-mount crypto-spreads-responsive-mount--mobile">
          <CryptoSpreadsMobile data={cryptoSpreadsData} />
        </div>
        <div className="crypto-spreads-responsive-mount crypto-spreads-responsive-mount--desktop">
          <CryptoSpreadsDesktop data={cryptoSpreadsData} />
        </div>
      </TopMarketLayout>

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
    </>
  );
};

export default CryptoBelowHero;
