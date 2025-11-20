import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { setLangParam } from "../../../helpers/services/language-service";
import ContainerWrapper from "../../../components/shared/container-wrapper";
import Hero from "../../shared/hero";
import SimplifyYourSetup from "./simplify-your-setup";
import OurCommunityContent from "../../../components/shared/our-community";
import OnboardingGuide from "./onboarding-guide";
import OnboardingGuideStep from "./onboarding-guide-step";
import FaqSection from "../../shared/faq-section";
import { FAQ_CLIENT_PORTAL_ASSISTANCE } from "../../../helpers/faq";
import { useI18next } from "gatsby-plugin-react-i18next";

const ClientPortalAssistanceContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const { navigate } = useI18next();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const handleFaqButtonClick = () => {
    // Navigate to FAQ page
    // Use navigate from useI18next to preserve language prefix in browser history
    navigate("/faq");
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="client-portal-assistance"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={false}
        desktopBackground="url(../../assets/images/bg/hero/client-portal-assistance/client-portal-assistance-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/client-portal-assistance/client-portal-assistance-mobile.svg)"
      />

      <ContainerWrapper>
        <SimplifyYourSetup />
        <OnboardingGuide />
        <OnboardingGuideStep />
        <FaqSection
          faqData={FAQ_CLIENT_PORTAL_ASSISTANCE}
          className="faq-section--crypto"
          badgeTextKey="faq-badge-text"
          titleKey="faq-title"
          subtitleKey="faq-subtitle"
          buttonTextKey="faq-button-text"
          onFaqButtonClick={handleFaqButtonClick}
        />
      </ContainerWrapper>

      <div className="client-portal-assistance-join-our-next-free-webinar">
        {isMobile ? (
          <OurCommunityContent
            customBadgeMessage={t(
              "client-portal-assistance_our_next_free_webinar_badge_message"
            )}
            customTitle={t(
              "client-portal-assistance_our_next_free_webinar_title"
            )}
            customSubtitle={t(
              "client-portal-assistance_our_next_free_webinar_subtitle"
            )}
            customPrimaryButton={t(
              "client-portal-assistance_our_next_free_webinar_primary_button"
            )}
            customSecondaryButton={null}
          />
        ) : (
          <ContainerWrapper>
            <OurCommunityContent
              customBadgeMessage={t(
                "client-portal-assistance_our_next_free_webinar_badge_message"
              )}
              customTitle={t(
                "client-portal-assistance_our_next_free_webinar_title"
              )}
              customSubtitle={t(
                "client-portal-assistance_our_next_free_webinar_subtitle"
              )}
              customPrimaryButton={t(
                "client-portal-assistance_our_next_free_webinar_primary_button"
              )}
              customSecondaryButton={null}
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

ClientPortalAssistanceContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default ClientPortalAssistanceContent;
