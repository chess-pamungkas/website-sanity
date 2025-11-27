import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import LanguageContext from "../../../context/language-context";
import Hero from "../../../components/shared/hero";
import AccountTypesAccountComparison from "./account-comparison";
import OurCommunityContent from "../../../components/shared/our-community";
import ContainerWrapper from "../../../components/shared/container-wrapper";

const AccountsTypePageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="account-types"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../../assets/images/bg/hero/accounts-type/accounts-type-desktop.svg)"
        mobileBackground="url(../../../assets/images/bg/hero/accounts-type/accounts-type-mobile.svg)"
      />

      <AccountTypesAccountComparison />

      {isMobile ? (
        <OurCommunityContent
          customBadgeMessage={t("spreads-fees_our_community_badge_message")}
          customTitle={t("accounts-type_our_community_title")}
          customSubtitle={t("accounts-type_our_community_subtitle")}
          customPrimaryButton={t("accounts-type_our_community_primary_button")}
          customSecondaryButton={t(
            "accounts-type_our_community_secondary_button"
          )}
        />
      ) : (
        <ContainerWrapper>
          <OurCommunityContent
            customBadgeMessage={t("accounts-type_our_community_badge_message")}
            customTitle={t("accounts-type_our_community_title")}
            customSubtitle={t("accounts-type_our_community_subtitle")}
            customPrimaryButton={t(
              "accounts-type_our_community_primary_button"
            )}
            customSecondaryButton={t(
              "accounts-type_our_community_secondary_button"
            )}
          />
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

AccountsTypePageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};
export default AccountsTypePageContent;
