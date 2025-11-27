import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { ENERGIES_TRADING_SECTION } from "../../../helpers/config";
import { DATA_ENERGIES } from "../../../helpers/top-market-tables";
import { FAQ_ENERGIES } from "../../../helpers/faq";
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
import EnergiesSpreadsDesktop from "./energies-spreads-desktop";
import EnergiesSpreadsMobile from "./energies-spreads-mobile";
import { useI18next } from "gatsby-plugin-react-i18next";

const EnergiesContent = ({ className, isShowHero = true }) => {
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

  updateTableDataWithLiveColumn(DATA_ENERGIES, tradingSymbols);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="energies"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/energies/energies-desktop.svg)"
        mobileBackground="url(../images/bg/hero/energies/energies-mobile.svg)"
      />

      <div className="energies-content">
        <TradingTicker
          title={t("energies_trading-ticker-title")}
          pageSpecificSection={ENERGIES_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("energies-text")} activeTab="energies" />
      </div>

      <ContainerWrapper>
        {/* Energies Features Products */}
        <FeaturesProducts
          tradingType="energies"
          features={getFeaturesByTradingType("energies")}
        />
      </ContainerWrapper>

      <AccountComparison />

      <TopMarketLayout
        className="top-market-layout--energies-spreads container"
        headerTemplate={<SpreadsHeader tradingType="energies" />}
      >
        {isMobile ? (
          <EnergiesSpreadsMobile data={DATA_ENERGIES} />
        ) : (
          <EnergiesSpreadsDesktop data={DATA_ENERGIES} />
        )}
      </TopMarketLayout>

      {/* FAQ Section - Indices Trading Questions */}
      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_ENERGIES}
          className="faq-section--energies"
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
          titleKey="energies-guide-title"
          subtitleKey="energies-guide-subtitle"
          className="guide-content--energies"
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

EnergiesContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default EnergiesContent;
