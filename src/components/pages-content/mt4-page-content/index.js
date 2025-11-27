import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
// import animation from "../../../assets/images/animations/aggregator_MT4.json";
import MtPromotion from "../../mt-promotion";
import {
  getMT4Advantages,
  mt4DownloadTabs,
  getMT4DownloadLink,
  getAnimationStyle,
} from "../../../helpers/platforms.config";
import image from "../../../assets/images/mt4/mt4.svg";
import icon from "../../../assets/images/icon--white.svg";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { isIOS, isAndroid, isWindows, isMacOs } from "react-device-detect";
import { setLangParam } from "../../../helpers/services/language-service";
import Hero from "../../shared/hero";
import ContainerWrapper from "../../shared/container-wrapper";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";

const Mt4PageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile, isTablet, isLG, isXL } = useWindowSize();
  const isRTL = useRtlDirection();
  const mt4Advantages = getMT4Advantages();
  const downloadRef = useRef(null);
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const scrollToTarget = () => {
    downloadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMT4DownloadLinkByDevice = useCallback(getMT4DownloadLink, [
    isIOS,
    isAndroid,
    isWindows,
    isMacOs,
  ]);

  const getAnimationStyles = useCallback(getAnimationStyle, [
    isMobile,
    isTablet,
    isLG,
    isXL,
  ]);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="mt4"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/mt4/mt4-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/mt4/mt4-mobile.svg)"
      />

      <ContainerWrapper>
        <MtPromotion
          title={t("mt4_top-market-promo-text2")}
          advantagesTitle={t("mt4_market-items-list_title")}
          advantages={mt4Advantages}
          downloadTitle={t("mt4_download-title")}
          image={image}
          platformType="mt4"
          ref={downloadRef}
        />
      </ContainerWrapper>
      <div className="mt4-page-content">
        <AccountComparison />
      </div>
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

Mt4PageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default Mt4PageContent;
