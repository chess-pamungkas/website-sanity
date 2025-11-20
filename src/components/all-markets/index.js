import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../helpers/constants";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import LanguageContext from "../../context/language-context";
import Hero from "../shared/hero";
import BreadcrumbsTab from "../shared/breadcrumbs-tab";
import OurCommunityContent from "../shared/our-community";
import ContainerWrapper from "../shared/container-wrapper";
import MarketItemsList from "./components/market-items-list";

const AllMarkets = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="all-markets"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../images/bg/hero/all-markets-desktop.svg)"
        mobileBackground="url(../images/bg/hero/all-markets-mobile.svg)"
      />

      <BreadcrumbsTab
        currentPage={t("all-markets_badge-text")}
        activeTab="all-markets"
      />

      <MarketItemsList />

      {isMobile ? (
        <OurCommunityContent />
      ) : (
        <ContainerWrapper>
          <OurCommunityContent />
        </ContainerWrapper>
      )}

      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </>
  );
};

AllMarkets.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};
export default AllMarkets;
