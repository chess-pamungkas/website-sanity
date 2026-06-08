import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import TabTradingTools from "./tab-trading-tools";
import FeaturedIdeas from "./featured-ideas";
import TradingCalendar from "./trading-calendar";
import MarketBuzz from "./market-buzz";
import FeaturesProducts from "../../shared/features-products";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import { setLangParam } from "../../../helpers/services/language-service";
import Hero from "../../shared/hero";
import GuideContent from "../../shared/guide-content";
import ContainerWrapper from "../../shared/container-wrapper";
import OurCommunityContent from "../../shared/our-community";
import AlphaGeneration from "./alpha-generation";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";

const TradingToolsPageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleShowRegistrationPopup = ({ className, isShowHero = true }) => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="trading-tools"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/trading-tools/trading-tools-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/trading-tools/trading-tools-mobile.svg)"
      />

      <TabTradingTools />

      <ContainerWrapper>
        <TradingCalendar />
        <div className="trading-calendar-page">
          <FeaturesProducts
            tradingType="trading-tools"
            features={getFeaturesByTradingType("trading-tools")}
          />
        </div>
      </ContainerWrapper>

      <FeaturedIdeas />

      <ContainerWrapper>
        <MarketBuzz />
      </ContainerWrapper>

      <AlphaGeneration />

      <ContainerWrapper>
        <GuideContent
          titleKey="forex-guide-title"
          subtitleKey="forex-guide-subtitle"
          className="guide-content--forex guide-content--trading-tools"
        />
        {!isMobile && <OurCommunityContent />}
      </ContainerWrapper>

      {isMobile && <OurCommunityContent />}

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

TradingToolsPageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default TradingToolsPageContent;
