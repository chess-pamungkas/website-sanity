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
import SwapFreeFreedom from "./swap-free-freedom";
import HowToTradeSwapFree from "./how-to-trade-swap-free";
import OurCommunityContent from "../../../components/shared/our-community";
import {
  ButtonPrimaryStandard,
  ButtonSecondaryStandard,
  ButtonContainer,
} from "../../shared/reusable-buttons";

const SwapFreeContent = ({ className, isShowHero = true }) => {
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
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="swap-free"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/swap-free/swap-free-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/swap-free/swap-free-mobile.svg)"
      />

      {/* Swap-Free Freedom Section */}
      <ContainerWrapper>
        <SwapFreeFreedom />
      </ContainerWrapper>

      {/* How to Trade Swap-Free Section */}
      <HowToTradeSwapFree />

      <ContainerWrapper>
        <div className="swap-free-page">
          {/* Swap-Free Features Products */}
          <FeaturesProducts
            tradingType="swap-free"
            features={getFeaturesByTradingType("swap-free")}
          />
        </div>
      </ContainerWrapper>

      <div className="swap-free-community">
        {isMobile ? (
          <OurCommunityContent
            customBadgeMessage={t("swap-free_our_community_badge_message")}
            customTitle={t("swap-free_our_community_title")}
            customSubtitle={t("swap-free_our_community_subtitle")}
            customPrimaryButton={t("swap-free_our_community_primary_button")}
            customSecondaryButton={t(
              "swap-free_our_community_secondary_button"
            )}
          />
        ) : (
          <ContainerWrapper>
            <OurCommunityContent
              customBadgeMessage={t("swap-free_our_community_badge_message")}
              customTitle={t("swap-free_our_community_title")}
              customSubtitle={t("swap-free_our_community_subtitle")}
              customPrimaryButton={t("swap-free_our_community_primary_button")}
              customSecondaryButton={t(
                "swap-free_our_community_secondary_button"
              )}
            />
          </ContainerWrapper>
        )}
      </div>

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

SwapFreeContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default SwapFreeContent;
