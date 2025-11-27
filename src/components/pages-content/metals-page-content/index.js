import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { METALS_TRADING_SECTION } from "../../../helpers/config";
import { DATA_METALS } from "../../../helpers/top-market-tables";
import { FAQ_METALS } from "../../../helpers/faq";
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
import MetalsSpreadsDesktop from "./metals-spreads-desktop";
import MetalsSpreadsMobile from "./metals-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const MetalsContent = ({ className, isShowHero }) => {
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

  updateTableDataWithLiveColumn(DATA_METALS, tradingSymbols);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="metals"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/metals/metals-desktop.svg)"
        mobileBackground="url(../images/bg/hero/metals/metals-mobile.svg)"
      />

      <div className="metals-content">
        <TradingTicker
          title={t("metals_trading-ticker-title")}
          pageSpecificSection={METALS_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("metals-text")} activeTab="metals" />
      </div>

      <ContainerWrapper>
        {/* Metals Features Products */}
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

      {/* FAQ Section - Metals Trading Questions */}
      {/* FAQ_METALS contains comprehensive metals FAQ data with 8 questions */}
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
      </ContainerWrapper>

      {/* Guide Content Section */}
      <ContainerWrapper>
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

MetalsContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default MetalsContent;
