import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import BadgeGuideIcon from "../../../assets/images/icons/main-page/guide/badge-guide.svg";
import GuideCircle1Desktop from "../../../assets/images/icons/main-page/guide/guide-circle1-desktop.svg";
import GuideCircle2Desktop from "../../../assets/images/icons/main-page/guide/guide-circle2-desktop.svg";
import GuideCircle3Desktop from "../../../assets/images/icons/main-page/guide/guide-circle3-desktop.svg";
import GuideCircle4Desktop from "../../../assets/images/icons/main-page/guide/guide-circle4-desktop.svg";
import GuideCircle5Desktop from "../../../assets/images/icons/main-page/guide/guide-circle5-desktop.svg";
import GuideCircle6Desktop from "../../../assets/images/icons/main-page/guide/guide-circle6-desktop.svg";
import GuideCircle1Mobile from "../../../assets/images/icons/main-page/guide/guide-circle1-mobile.svg";
import GuideCircle2Mobile from "../../../assets/images/icons/main-page/guide/guide-circle2-mobile.svg";
import GuideCircle3Mobile from "../../../assets/images/icons/main-page/guide/guide-circle3-mobile.svg";
import GuideCircle4Mobile from "../../../assets/images/icons/main-page/guide/guide-circle4-mobile.svg";
import GuideCircle5Mobile from "../../../assets/images/icons/main-page/guide/guide-circle5-mobile.svg";
import GuideCircle6Mobile from "../../../assets/images/icons/main-page/guide/guide-circle6-mobile.svg";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import LanguageContext from "../../../context/language-context";
import { StandardButtons } from "../reusable-buttons";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useI18next } from "gatsby-plugin-react-i18next";

const GuideContent = ({
  titleKey = "guide-content-title",
  subtitleKey = "guide-content-subtitle",
  className = "",
  variant = "default", // "default" or "partners"
}) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const { navigate } = useI18next();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePrimaryButtonClick = () => {
    // For partners, "Apply Now" opens registration popup
    handleShowRegistrationPopup();
  };

  const handleSecondaryButtonClick = () => {
    // For partners, "Contact Us" redirects to contact-us page
    // Use navigate from useI18next to preserve language prefix in browser history
    if (variant === "partners") {
      navigate("/contact-us");
    } else {
      handleShowRegistrationPopup();
    }
  };

  const getGuideSteps = () => {
    if (variant === "partners") {
      return [
        {
          number: "1",
          title: t("partners-guide-step-1-title"),
          description: t("partners-guide-step-1-description"),
          circleIcon: isMobile ? GuideCircle1Mobile : GuideCircle1Desktop,
        },
        {
          number: "2",
          title: t("partners-guide-step-2-title"),
          description: t("partners-guide-step-2-description"),
          circleIcon: isMobile ? GuideCircle2Mobile : GuideCircle2Desktop,
        },
        {
          number: "3",
          title: t("partners-guide-step-3-title"),
          description: t("partners-guide-step-3-description"),
          circleIcon: isMobile ? GuideCircle3Mobile : GuideCircle3Desktop,
        },
        {
          number: "4",
          title: t("partners-guide-step-4-title"),
          description: t("partners-guide-step-4-description"),
          circleIcon: isMobile ? GuideCircle4Mobile : GuideCircle4Desktop,
        },
        {
          number: "5",
          title: t("partners-guide-step-5-title"),
          description: t("partners-guide-step-5-description"),
          circleIcon: isMobile ? GuideCircle5Mobile : GuideCircle5Desktop,
        },
        {
          number: "6",
          title: t("partners-guide-step-6-title"),
          description: t("partners-guide-step-6-description"),
          circleIcon: isMobile ? GuideCircle6Mobile : GuideCircle6Desktop,
        },
      ];
    }

    // Default 3-step guide
    return [
      {
        number: "1",
        title: t("guide-step-1-title"),
        description: t("guide-step-1-description"),
        circleIcon: isMobile ? GuideCircle1Mobile : GuideCircle1Desktop,
      },
      {
        number: "2",
        title: t("guide-step-2-title"),
        description: t("guide-step-2-description"),
        circleIcon: isMobile ? GuideCircle2Mobile : GuideCircle2Desktop,
      },
      {
        number: "3",
        title: t("guide-step-3-title"),
        description: t("guide-step-3-description"),
        circleIcon: isMobile ? GuideCircle3Mobile : GuideCircle3Desktop,
      },
    ];
  };

  const guideSteps = getGuideSteps();

  const getButtonTexts = () => {
    if (variant === "partners") {
      return {
        primaryText: t("partners_button-apply-now"),
        secondaryText: t("partners_button-contact-us"),
      };
    }

    // Default button texts
    return {
      primaryText: t("button-start-trading"),
      secondaryText: t("button-try-demo"),
    };
  };

  const { primaryText, secondaryText } = getButtonTexts();

  return (
    <section
      className={`guide-content ${className} ${
        variant === "partners" ? "guide-content--partners" : ""
      }`}
    >
      <div className="guide-content__container">
        {variant === "partners" ? (
          // Partners layout: Header + 2 columns of cards
          <>
            {/* Header Section */}
            <div className="guide-content__header">
              {/* Badge */}
              <div className="guide-content__badge">
                <img
                  src={BadgeGuideIcon}
                  alt={t("guide-content_badge-icon-alt")}
                  className="guide-content__badge-icon"
                />
                <span className="guide-content__badge-text">
                  {t("guide-badge-text")}
                </span>
              </div>

              {/* Title */}
              <h2
                className="guide-content__title"
                dangerouslySetInnerHTML={{ __html: t(titleKey) }}
              ></h2>

              {/* Subtitle */}
              <p className="guide-content__subtitle">{t(subtitleKey)}</p>

              {/* Button Group */}
              <div className="navbar-dropdown-highlight__button-group">
                <StandardButtons
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  onPrimaryClick={handlePrimaryButtonClick}
                  onSecondaryClick={handleSecondaryButtonClick}
                />
              </div>
            </div>

            {/* Steps Grid - 2 columns */}
            <div className="guide-content__steps-grid">
              {guideSteps.map((step, index) => (
                <div key={index} className="guide-content__step-card">
                  <div className="guide-content__step-content">
                    <div className="guide-content__step-circle">
                      <span className="guide-content__step-number">
                        <img
                          src={step.circleIcon}
                          alt={`${t("guide-content_step-circle-alt")} ${
                            step.number
                          }`}
                          className="guide-content__step-circle-icon"
                        />
                      </span>
                    </div>
                    <div className="guide-content__step-text">
                      <h3 className="guide-content__step-title">
                        {step.title}
                      </h3>
                      <p className="guide-content__step-description">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Default layout: Left content + Right steps
          <>
            {/* Left Section - Content */}
            <div className="guide-content__left">
              {/* Badge */}
              <div className="guide-content__badge">
                <img
                  src={BadgeGuideIcon}
                  alt={t("guide-content_badge-icon-alt")}
                  className="guide-content__badge-icon"
                />
                <span className="guide-content__badge-text">
                  {t("guide-badge-text")}
                </span>
              </div>

              {/* Title */}
              <h2
                className="guide-content__title"
                dangerouslySetInnerHTML={{ __html: t(titleKey) }}
              ></h2>

              {/* Subtitle */}
              <p className="guide-content__subtitle">{t(subtitleKey)}</p>

              {/* Button Group */}
              <div className="navbar-dropdown-highlight__button-group">
                <StandardButtons
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  onPrimaryClick={handlePrimaryButtonClick}
                  onSecondaryClick={handleSecondaryButtonClick}
                />
              </div>
            </div>

            {/* Right Section - Steps */}
            <div className="guide-content__right">
              {guideSteps.map((step, index) => (
                <div key={index} className="guide-content__step-card">
                  <div className="guide-content__step-content">
                    <div className="guide-content__step-circle">
                      <img
                        src={step.circleIcon}
                        alt={`${t("guide-content_step-circle-alt")} ${
                          step.number
                        }`}
                        className="guide-content__step-circle-icon"
                      />
                    </div>
                    <div className="guide-content__step-text">
                      <h3 className="guide-content__step-title">
                        {step.title}
                      </h3>
                      <p className="guide-content__step-description">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Registration Popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </section>
  );
};

GuideContent.propTypes = {
  titleKey: PropTypes.string,
  subtitleKey: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "partners"]),
};

export default GuideContent;
