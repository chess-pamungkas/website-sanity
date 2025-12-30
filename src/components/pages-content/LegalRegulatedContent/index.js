import React from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import bgRegulatedDesktop from "../../../assets/images/legal/bg-regulated-desktop.svg";
import bgRegulatedMobile from "../../../assets/images/legal/bg-regulated-mobile.svg";
import personPlusIcon from "../../../assets/images/icons/person-plus.svg";
import cysecRegulatedDesktop from "../../../assets/images/legal/cysec-regulated-desktop.svg";
import cysecRegulatedMobile from "../../../assets/images/legal/cysec-regulated-mobile.svg";
import fsaRegulatedDesktop from "../../../assets/images/legal/fsa-regulated-desktop.svg";
import fsaRegulatedMobile from "../../../assets/images/legal/fsa-regulated-mobile.svg";

const ArrowIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
      stroke="currentColor"
      strokeWidth="1.3333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LegalRegulatedContentx = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();

  // Smooth scrolling handler for legal documents section
  const handleLegalDocumentsClick = (e) => {
    e.preventDefault();
    const legalDocumentsSection = document.getElementById("legalDocuments");
    if (legalDocumentsSection) {
      legalDocumentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className={`legal-regulated-content ${className || ""} ${
        isRTL ? "legal-regulated-content--rtl" : ""
      }`}
    >
      {/* Background Images */}
      <div className="legal-regulated-content__background">
        <div className="legal-regulated-content__background--desktop">
          <img
            src={bgRegulatedDesktop}
            alt="Regulated Background Desktop"
            className="legal-regulated-content__bg-image"
          />
        </div>
        <div className="legal-regulated-content__background--mobile">
          <img
            src={bgRegulatedMobile}
            alt="Regulated Background Mobile"
            className="legal-regulated-content__bg-image"
          />
        </div>
      </div>

      <div className="legal-regulated-content__wrapper container">
        {/* Top Section: Regulated by CySEC */}
        <div className="legal-regulated-content__section legal-regulated-content__section--cysec">
          <div className="legal-regulated-content__content">
            <div className="legal-regulated-content__text-content">
              {/* Badge */}
              <div className="legal-regulated-content__badge">
                <div className="legal-regulated-content__badge-icon">
                  <img
                    src={personPlusIcon}
                    alt="Person Plus Icon"
                    className="legal-regulated-content__badge-icon-img"
                  />
                </div>
                <span className="legal-regulated-content__badge-text">
                  {t("legal-regulated-badge-cysec")}
                </span>
              </div>

              {/* Title */}
              <h2 className="legal-regulated-content__title">
                {t("legal-regulated-title-cysec")}
              </h2>

              {/* Description */}
              <p className="legal-regulated-content__description">
                {t("legal-regulated-description-cysec")}
              </p>

              {/* Learn More Link */}
              <a
                href="#legalDocuments"
                className="legal-regulated-content__link"
                onClick={handleLegalDocumentsClick}
              >
                {t("legal-regulated-learn-more")} <ArrowIcon />
              </a>

              {/* Disclaimer */}
              <p className="legal-regulated-content__disclaimer">
                {t("legal-regulated-disclaimer")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Authorized by Seychelles FSA */}
        <div className="legal-regulated-content__section legal-regulated-content__section--fsa">
          <div className="legal-regulated-content__image-container">
            {/* Desktop Image */}
            <div className="legal-regulated-content__image--desktop">
              <img
                src={fsaRegulatedDesktop}
                alt="FSA Regulated Desktop"
                className="legal-regulated-content__image"
              />
            </div>
            {/* Mobile Image */}
            <div className="legal-regulated-content__image--mobile">
              <img
                src={fsaRegulatedMobile}
                alt="FSA Regulated Mobile"
                className="legal-regulated-content__image"
              />
            </div>
          </div>

          <div className="legal-regulated-content__content">
            <div className="legal-regulated-content__text-content">
              {/* Badge */}
              <div className="legal-regulated-content__badge">
                <div className="legal-regulated-content__badge-icon">
                  <img
                    src={personPlusIcon}
                    alt="Person Plus Icon"
                    className="legal-regulated-content__badge-icon-img"
                  />
                </div>
                <span className="legal-regulated-content__badge-text">
                  {t("legal-regulated-badge-fsa")}
                </span>
              </div>

              {/* Title */}
              <h2 className="legal-regulated-content__title">
                {t("legal-regulated-title-fsa")}
              </h2>

              {/* Description */}
              <p className="legal-regulated-content__description">
                {t("legal-regulated-description-fsa")}
              </p>

              {/* Learn More Link */}
              <a
                href="#legalDocuments"
                className="legal-regulated-content__link"
                onClick={handleLegalDocumentsClick}
              >
                {t("legal-regulated-learn-more")} <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

LegalRegulatedContent.propTypes = {
  className: PropTypes.string,
};

export default LegalRegulatedContent;
