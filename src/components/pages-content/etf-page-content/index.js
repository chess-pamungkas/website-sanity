import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { ETF_TRADING_SECTION } from "../../../helpers/config";
import { FAQ_ETF } from "../../../helpers/faq";
import BreadcrumbsTab from "../../shared/breadcrumbs-tab";
import FeaturesProducts from "../../shared/features-products";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";
import ContainerWrapper from "../../shared/container-wrapper";
import Hero from "../../shared/hero";
import GuideContent from "../../shared/guide-content";
import FaqSection from "../../shared/faq-section";
import TradingContext from "../../../context/trading-context";
import TradingTicker from "../../trading-ticker";
import { useI18next } from "gatsby-plugin-react-i18next";

const ETFContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
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

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="etf"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/etf/etf-desktop.svg)"
        mobileBackground="url(../images/bg/hero/etf/etf-mobile.svg)"
      />

      <div className="etf-content">
        <TradingTicker
          title={t("etf_trading-ticker-title")}
          pageSpecificSection={ETF_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("etf-text")} activeTab="etf" />
      </div>

      <ContainerWrapper>
        {/* ETF Features Products */}
        <FeaturesProducts
          tradingType="etf"
          features={getFeaturesByTradingType("etf")}
        />
      </ContainerWrapper>

      <AccountComparison />

      {/* FAQ Section - ETF Trading Questions */}
      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_ETF}
          className="faq-section--etf"
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
          titleKey="etf-guide-title"
          subtitleKey="etf-guide-subtitle"
          className="guide-content--etf"
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

ETFContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default ETFContent;
