import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import MtPromotion from "../../mt-promotion";
import { getMT5Advantages } from "../../../helpers/platforms.config";
import {
  MT5_PROMO_DESKTOP_WEBP,
  MT5_PROMO_MOBILE_WEBP,
} from "../../../helpers/mt-platform-static-images";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { setLangParam } from "../../../helpers/services/language-service";
import Hero from "../../shared/hero";
import ContainerWrapper from "../../shared/container-wrapper";
import AccountComparison from "../../shared/account-comparison";
import OurCommunityContent from "../../shared/our-community";

const Mt5PageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const mt5Advantages = getMT5Advantages();
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
        heroType="mt5"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/mt5/mt5-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/mt5/mt5-mobile.svg)"
      />

      <ContainerWrapper className="mt-platform-promotion-shell">
        <MtPromotion
          title={t("mt5_top-market-promo-text2")}
          advantagesTitle={t("mt5_market-items-list_title")}
          advantages={mt5Advantages}
          downloadTitle={t("mt5_download-title")}
          image={MT5_PROMO_DESKTOP_WEBP}
          imageMobile={MT5_PROMO_MOBILE_WEBP}
          platformType="mt5"
          ref={downloadRef}
        />
      </ContainerWrapper>
      <div className="mt5-page-content mt-platform-page-content">
        <AccountComparison />
      </div>
      <div className="mt5-page-community">
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

Mt5PageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default Mt5PageContent;
