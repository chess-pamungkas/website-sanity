import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { getFeaturesByTradingType } from "../../../helpers/features-products.config";
import FeaturesProducts from "../../shared/features-products";
import { setLangParam } from "../../../helpers/services/language-service";
import ContainerWrapper from "../../../components/shared/container-wrapper";
import Hero from "../../shared/hero";
import OurCommunityContent from "../../../components/shared/our-community";
import {
  VPS_JOIN_COMMUNITY_DESKTOP_WEBP,
  VPS_JOIN_COMMUNITY_MOBILE_WEBP,
} from "../../../helpers/vps-community-backgrounds";
import KeepYourVPS from "./keep-your-vps";
import GetComplimentaryVPS from "./get-complimentary-vps";

const VPSContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="vps-page">
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="vps"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={true}
        desktopBackground="url(../../assets/images/bg/hero/vps/vps-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/vps/vps-mobile.svg)"
      />

      {/* Get Complimentary VPS Section */}
      <ContainerWrapper>
        <GetComplimentaryVPS />
      </ContainerWrapper>

      {/* Keep Your VPS Section */}
      <KeepYourVPS />

      <ContainerWrapper>
        <div className="vps-page">
          {/* VPS Features Products */}
          <FeaturesProducts
            tradingType="vps"
            features={getFeaturesByTradingType("vps")}
          />
        </div>
      </ContainerWrapper>

      {isMobile ? (
        <OurCommunityContent
          desktopBackgroundImageUrl={VPS_JOIN_COMMUNITY_DESKTOP_WEBP}
          mobileBackgroundImageUrl={VPS_JOIN_COMMUNITY_MOBILE_WEBP}
          customBadgeMessage={t("vps_our_community_badge_message")}
          customTitle={t("vps_our_community_title")}
          customSubtitle={t("vps_our_community_subtitle")}
          customPrimaryButton={t("vps_our_community_primary_button")}
          customSecondaryButton={t("vps_our_community_secondary_button")}
        />
      ) : (
        <ContainerWrapper>
          <OurCommunityContent
            desktopBackgroundImageUrl={VPS_JOIN_COMMUNITY_DESKTOP_WEBP}
            mobileBackgroundImageUrl={VPS_JOIN_COMMUNITY_MOBILE_WEBP}
            customBadgeMessage={t("vps_our_community_badge_message")}
            customTitle={t("vps_our_community_title")}
            customSubtitle={t("vps_our_community_subtitle")}
            customPrimaryButton={t("vps_our_community_primary_button")}
            customSecondaryButton={t("vps_our_community_secondary_button")}
          />
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
    </div>
  );
};

VPSContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default VPSContent;
