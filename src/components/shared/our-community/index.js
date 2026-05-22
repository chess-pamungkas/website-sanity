import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useI18next } from "gatsby-plugin-react-i18next";
import LanguageContext from "../../../context/language-context";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { SM_MAX_WIDTH, WINDOW_SIZE_MD } from "../../../helpers/constants";
import {
  JOIN_OUR_COMMUNITY_BG_DIMENSIONS,
  JOIN_OUR_COMMUNITY_DESKTOP_WEBP,
  JOIN_OUR_COMMUNITY_MOBILE_WEBP,
} from "../../../helpers/join-our-community-backgrounds";
import BadgeJoinOurCommunityIcon from "../../../assets/images/icons/join-our-community/badge-join-our-community.svg";
import { CommunityButtons } from "../community-buttons";

const OurCommunityContent = ({
  customBadgeMessage,
  customTitle,
  customSubtitle,
  customPrimaryButton,
  customSecondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  desktopBackgroundImageUrl,
  mobileBackgroundImageUrl,
}) => {
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

  const badgeMessage = customBadgeMessage || t("our_community_badge_message");
  const title = customTitle || t("our_community_title");
  const subtitle = customSubtitle || t("our_community_subtitle");
  const primaryButtonText =
    customPrimaryButton || t("our_community_primary_button");
  const secondaryButtonText =
    customSecondaryButton === null
      ? null
      : customSecondaryButton || t("our_community_secondary_button");

  const handlePrimaryClick = onPrimaryClick || handleShowRegistrationPopup;
  const handleSecondaryClick =
    onSecondaryClick ||
    (() => {
      navigate("/accounts-type");
    });

  const desktopBg =
    desktopBackgroundImageUrl ?? JOIN_OUR_COMMUNITY_DESKTOP_WEBP;
  const mobileBg = mobileBackgroundImageUrl ?? JOIN_OUR_COMMUNITY_MOBILE_WEBP;
  const { desktop: bgDesktopDim, mobile: bgMobileDim } =
    JOIN_OUR_COMMUNITY_BG_DIMENSIONS;

  return (
    <div className="our-community-content">
      <picture className="our-community-content__bg" aria-hidden="true">
        <source
          media={`(min-width: ${WINDOW_SIZE_MD}px)`}
          type="image/webp"
          srcSet={desktopBg}
        />
        <source
          media={`(max-width: ${SM_MAX_WIDTH}px)`}
          type="image/webp"
          srcSet={mobileBg}
        />
        <img
          src={desktopBg}
          alt=""
          className="our-community-content__bg-image"
          width={bgDesktopDim.width}
          height={bgDesktopDim.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

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
          <div className="our-community-content__image-container" />
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
