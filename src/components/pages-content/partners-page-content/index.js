import React, { useState } from "react";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import PropTypes from "prop-types";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import IncomeSlider from "../../partners/components/income-slider";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { setLangParam } from "../../../helpers/services/language-service";
import Hero from "../../shared/hero";
import ContainerWrapper from "../../shared/container-wrapper";
import OurCommunityContent from "../../shared/our-community";
import GuideContent from "../../shared/guide-content";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import FeaturesProductsPartners from "./features-products-partners";

const PartnersPageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const langParam = setLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="partners"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
      />
      <IncomeSlider />
      <div className="partners-page">
        <FeaturesProductsPartners
          tradingType="partners"
          features={getFeaturesByTradingType("partners")}
        />
      </div>
      <ContainerWrapper>
        <GuideContent
          titleKey="partners-guide-title"
          subtitleKey="partners-guide-subtitle"
          variant="partners"
        />
      </ContainerWrapper>

      {isMobile ? (
        <OurCommunityContent
          customBadgeMessage={t("partners_our_community_badge_message")}
          customTitle={t("partners_our_community_title")}
          customSubtitle={t("partners_our_community_subtitle")}
          customPrimaryButton={t("partners_our_community_primary_button")}
          customSecondaryButton={t("partners_our_community_secondary_button")}
        />
      ) : (
        <div className="partners-page-community">
          <ContainerWrapper>
            <OurCommunityContent
              customBadgeMessage={t("partners_our_community_badge_message")}
              customTitle={t("partners_our_community_title")}
              customSubtitle={t("partners_our_community_subtitle")}
              customPrimaryButton={t("partners_our_community_primary_button")}
              customSecondaryButton={t(
                "partners_our_community_secondary_button"
              )}
            />
          </ContainerWrapper>
        </div>
      )}

      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam}
        />
      )}
    </>
  );
};

PartnersPageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default PartnersPageContent;
