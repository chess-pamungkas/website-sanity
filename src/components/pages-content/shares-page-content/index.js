import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { SHARES_TRADING_SECTION } from "../../../helpers/config";
import { FAQ_SHARES } from "../../../helpers/faq";
import BreadcrumbsTab from "../../shared/breadcrumbs-tab";
import FeaturesProducts from "../../shared/features-products";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";
import ContainerWrapper from "../../shared/container-wrapper";
import Hero from "../../shared/hero";
import GuideContent from "../../shared/guide-content";
import FaqSection from "../../shared/faq-section";
import TradingTicker from "../../trading-ticker";
import { useI18next } from "gatsby-plugin-react-i18next";

const SharesContent = ({ className, isShowHero = true }) => {
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
        heroType="shares"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/shares/shares-desktop.svg)"
        mobileBackground="url(../images/bg/hero/shares/shares-mobile.svg)"
      />

      <div className="shares-content">
        <TradingTicker
          title={t("shares_trading-ticker-title")}
          pageSpecificSection={SHARES_TRADING_SECTION}
        />

        <BreadcrumbsTab currentPage={t("shares-text")} activeTab="shares" />
      </div>

      <ContainerWrapper>
        {/* Shares Features Products */}
        <FeaturesProducts
          tradingType="shares"
          features={getFeaturesByTradingType("shares")}
        />
      </ContainerWrapper>

      <AccountComparison />

      {/* FAQ Section - Shares Trading Questions */}
      <ContainerWrapper>
        <FaqSection
          faqData={FAQ_SHARES}
          className="faq-section--shares"
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
          titleKey="shares-guide-title"
          subtitleKey="shares-guide-subtitle"
          className="guide-content--shares"
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

SharesContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default SharesContent;
