import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { setLangParam } from "../../../helpers/services/language-service";
import Hero from "../../shared/hero";
import ContainerWrapper from "../../shared/container-wrapper";
import OurCommunityContent from "../../shared/our-community";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import FeaturesProducts from "../../shared/features-products";
import CompanySection from "./company-section";

const CompanyPageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="company"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={true}
        desktopBackground="url(../../assets/images/bg/hero/company/about-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/company/about-mobile.svg)"
      />

      <ContainerWrapper>
        <div className="company-page">
          {/* Company Features Products */}
          <FeaturesProducts
            tradingType="company"
            features={getFeaturesByTradingType("company")}
          />
        </div>
      </ContainerWrapper>

      {/* Company Section */}
      <CompanySection />

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

CompanyPageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default CompanyPageContent;
