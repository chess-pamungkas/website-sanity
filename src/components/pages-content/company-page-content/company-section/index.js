import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import LanguageContext from "../../../../context/language-context";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import { setLangParam } from "../../../../helpers/services/language-service";

// Import background images
import bgCompanyDesktop from "../../../../assets/images/bg/company/bg-company-desktop.svg";
import bgCompanyMobile from "../../../../assets/images/bg/company/bg-company-mobile.svg";
import bgCardCompanyDesktop from "../../../../assets/images/bg/company/bg-card-company-desktop.svg";
import bgCardCompanyMobile from "../../../../assets/images/bg/company/bg-card-company-mobile.svg";

// Import icons
import badgeMostPopular from "../../../../assets/images/icons/badge-most-popular.svg";
import { CircleMarkIcon as circleMark } from "../../../shared/shared-icons";

const CompanySection = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const langParam = setLangParam();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const backgroundSrc = isMobile ? bgCompanyMobile : bgCompanyDesktop;
  const cardBackgroundSrc = isMobile
    ? bgCardCompanyMobile
    : bgCardCompanyDesktop;

  const sections = [
    {
      key: "safety",
      badge: t("company-section-safety-badge"),
      title: t("company-section-safety-title"),
      description: t("company-section-safety-description"),
      bullets: [
        t("company-section-safety-bullet1"),
        t("company-section-safety-bullet2"),
        t("company-section-safety-bullet3"),
        t("company-section-safety-bullet4"),
      ],
    },
    {
      key: "quality",
      badge: t("company-section-quality-badge"),
      title: t("company-section-quality-title"),
      description: t("company-section-quality-description"),
      bullets: [
        t("company-section-quality-bullet1"),
        t("company-section-quality-bullet2"),
        t("company-section-quality-bullet3"),
        t("company-section-quality-bullet4"),
      ],
    },
    {
      key: "trust",
      badge: t("company-section-trust-badge"),
      title: t("company-section-trust-title"),
      description: t("company-section-trust-description"),
      bullets: [
        t("company-section-trust-bullet1"),
        t("company-section-trust-bullet2"),
        t("company-section-trust-bullet3"),
        t("company-section-trust-bullet4"),
      ],
    },
  ];

  return (
    <section className={`company-section ${className || ""}`}>
      {/* Background Image */}
      <div className="company-section-bg">
        <img
          src={backgroundSrc}
          alt="Company Section Background"
          className="company-section-bg__image"
        />
      </div>

      {/* Content Container */}
      <div className="company-section container">
        <div className="company-section-cards">
          {sections.map((section) => (
            <div
              key={section.key}
              className={`company-section-card company-section-card--${section.key}`}
              style={{
                backgroundImage: `url(${cardBackgroundSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Left Content */}
              <div className="company-section-card__content">
                {/* Badge */}
                <div className="company-section-card__badge">
                  <img
                    src={badgeMostPopular}
                    alt="Badge Icon"
                    className="company-section-card__badge-icon"
                  />
                  <span className="company-section-card__badge-text">
                    {section.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="company-section-card__title">{section.title}</h3>

                {/* Description */}
                <p className="company-section-card__description">
                  {section.description}
                </p>
              </div>

              {/* Right Content - Bullet Points */}
              <ul className="company-section-card__bullets">
                {section.bullets.map((bullet, index) => (
                  <li key={index} className="company-section-card__bullet">
                    <img
                      src={circleMark}
                      alt="Check Mark"
                      className="company-section-card__bullet-icon"
                      width={16}
                      height={17}
                    />
                    <span className="company-section-card__bullet-text">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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

CompanySection.propTypes = {
  className: PropTypes.string,
};

export default CompanySection;
