import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import MtPromotion from "../../mt-promotion";
import { getMT4Advantages } from "../../../helpers/platforms.config";
import {
  MT4_PROMO_DESKTOP_WEBP,
  MT4_PROMO_MOBILE_WEBP,
} from "../../../helpers/mt-platform-static-images";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { setLangParam } from "../../../helpers/services/language-service";
import Hero from "../../shared/hero";
import ContainerWrapper from "../../shared/container-wrapper";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";

const Mt4PageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const mt4Advantages = getMT4Advantages();
  const downloadRef = useRef(null);
  const langParam = setLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

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

      <ContainerWrapper className="mt-platform-promotion-shell">
        <MtPromotion
          title={t("mt4_top-market-promo-text2")}
          advantagesTitle={t("mt4_market-items-list_title")}
          advantages={mt4Advantages}
          downloadTitle={t("mt4_download-title")}
          image={MT4_PROMO_DESKTOP_WEBP}
          imageMobile={MT4_PROMO_MOBILE_WEBP}
          platformType="mt4"
          ref={downloadRef}
        />
      </ContainerWrapper>
      <div className="mt4-page-content mt-platform-page-content">
        <AccountComparison />
      </div>
      <div className="mt4-page-community">
        <ContainerWrapper>
          <OurCommunityContent />
        </ContainerWrapper>
      </div>

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

Mt4PageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default Mt4PageContent;
