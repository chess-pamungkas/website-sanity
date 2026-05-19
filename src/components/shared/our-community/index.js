import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import LanguageContext from "../../../context/language-context";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import BadgeJoinOurCommunityIcon from "../../../assets/images/icons/join-our-community/badge-join-our-community.svg";
import { CommunityButtons } from "../community-buttons";
// Using static folder path for WebP - mobile/desktop for Lighthouse performance
const JoinOurCommunityDesktopBg = "/images/join-our-community-desktop.webp";
const JoinOurCommunityMobileBg = "/images/join-our-community-mobile.webp";

const OurCommunityContent = ({
  customBadgeMessage,
  customTitle,
  customSubtitle,
  customPrimaryButton,
  customSecondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  /** Optional; root-relative e.g. /images/bg/vps/join-our-community-vps-desktop.webp */
  desktopBackgroundImageUrl,
  /** Optional; root-relative mobile background */
  mobileBackgroundImageUrl,
}) => {
  const { isMobile } = useWindowSize();
  const [viewportLayoutReady, setViewportLayoutReady] = useState(false);
  useEffect(() => {
    setViewportLayoutReady(true);
  }, []);
  const { selectedLanguage } = useContext(LanguageContext);
  const { t } = useTranslationWithVariables();
  const { navigate } = useI18next();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Use custom content if provided, otherwise fall back to translations
  const badgeMessage = customBadgeMessage || t("our_community_badge_message");
  const title = customTitle || t("our_community_title");
  const subtitle = customSubtitle || t("our_community_subtitle");
  const primaryButtonText =
    customPrimaryButton || t("our_community_primary_button");
  // If customSecondaryButton is explicitly null, pass null to hide the button
  // Otherwise, use customSecondaryButton if provided, or fall back to translation
  const secondaryButtonText =
    customSecondaryButton === null
      ? null
      : customSecondaryButton || t("our_community_secondary_button");

  // Use custom click handlers if provided, otherwise use default handlers
  const handlePrimaryClick = onPrimaryClick || handleShowRegistrationPopup;
  // Default secondary button navigates to accounts-type page instead of opening popup
  // navigate from useI18next automatically preserves language prefix (e.g., /my/accounts-type)
  const handleSecondaryClick =
    onSecondaryClick ||
    (() => {
      navigate("/accounts-type");
    });

  const desktopBg = desktopBackgroundImageUrl ?? JoinOurCommunityDesktopBg;
  const mobileBg = mobileBackgroundImageUrl ?? JoinOurCommunityMobileBg;

  // Defer mobile vs desktop background until after mount so SSR matches first client paint (#418).
  const backgroundImage =
    viewportLayoutReady && isMobile ? mobileBg : desktopBg;

  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="our-community-content" style={style}>
      <div className="our-community-content__container">
        <div className="our-community-content__left">
          <div className="our-community-content__badge">
            <div className="our-community-content__badge-content">
              <img
                src={BadgeJoinOurCommunityIcon}
                alt={badgeMessage}
                className="our-community-content__badge-icon"
              />
              <span className="our-community-content__badge-message">
                {badgeMessage}
              </span>
            </div>
          </div>

          <h2 className="our-community-content__title">{title}</h2>

          <p className="our-community-content__subtitle">{subtitle}</p>

          <div className="navbar-dropdown-highlight__button-group">
            <CommunityButtons
              onPrimaryClick={handlePrimaryClick}
              onSecondaryClick={handleSecondaryClick}
              customPrimaryButton={primaryButtonText}
              customSecondaryButton={secondaryButtonText}
            />
          </div>
        </div>

        <div className="our-community-content__right">
          <div className="our-community-content__image-container">
            {/* Background images are handled via CSS */}
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </div>
  );
};

OurCommunityContent.propTypes = {
  customBadgeMessage: PropTypes.string,
  customTitle: PropTypes.string,
  customSubtitle: PropTypes.string,
  customPrimaryButton: PropTypes.string,
  customSecondaryButton: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  desktopBackgroundImageUrl: PropTypes.string,
  mobileBackgroundImageUrl: PropTypes.string,
};

export default OurCommunityContent;
