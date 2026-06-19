import React from "react";
import PropTypes from "prop-types";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../../../helpers/viewport-media";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { LEGAL_REGULATED_CRITICAL_CSS } from "../../../helpers/legal-regulated-critical-css";
import personPlusIcon from "../../../assets/images/icons/person-plus.svg";
import fsaRegulatedDesktopSvg from "../../../assets/images/legal/fsa-regulated-desktop.svg";
import fsaRegulatedMobileSvg from "../../../assets/images/legal/fsa-regulated-mobile.svg";

const FSA_REGULATED_DESKTOP_WEBP = "/images/legal/fsa-regulated-desktop.webp";
const FSA_REGULATED_MOBILE_WEBP = "/images/legal/fsa-regulated-mobile.webp";
/** Full-bleed regulated section background (matches gen-legal-faq-card-webp.js artboards). */
const BG_REGULATED_DESKTOP_WEBP = "/images/legal/bg-regulated-desktop.webp";
const BG_REGULATED_MOBILE_WEBP = "/images/legal/bg-regulated-mobile.webp";
/** Matches SVG viewBox dimensions (CLS + Lighthouse unsized-images). */
const FSA_DESKTOP_DIM = { w: 483, h: 360 };
const FSA_MOBILE_DIM = { w: 340, h: 254 };
/** Matches legal.scss mobile min-height shell (aspect-ratio for CLS; desktop via <source>). */
const BG_REGULATED_MOBILE_DIM = { w: 393, h: 953 };

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

const LegalRegulatedContent = ({ className }) => {
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
    <>
      {/* Parsed immediately before the section so min-height/grid apply before layout (CLS). */}
      <style dangerouslySetInnerHTML={{ __html: LEGAL_REGULATED_CRITICAL_CSS }} />
      <section
        className={`legal-regulated-content ${className || ""} ${
          isRTL ? "legal-regulated-content--rtl" : ""
        }`}
      >
        {/* LCP: real <img> in HTML; grid overlay keeps box stable when deferred legal.scss loads. */}
        <div className="legal-regulated-content__hero-bg" aria-hidden="true">
        <picture>
          <source
            media={HERO_ASSET_DESKTOP_MQ}
            type="image/webp"
            srcSet={BG_REGULATED_DESKTOP_WEBP}
          />
          <source
            media={HERO_ASSET_MOBILE_MQ}
            type="image/webp"
            srcSet={BG_REGULATED_MOBILE_WEBP}
          />
          <img
            src={BG_REGULATED_MOBILE_WEBP}
            alt=""
            width={BG_REGULATED_MOBILE_DIM.w}
            height={BG_REGULATED_MOBILE_DIM.h}
            className="legal-regulated-content__hero-bg-img"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </picture>
      </div>

      <div className="legal-regulated-content__wrapper container">
        {/* Bottom Section: Authorized by Seychelles FSA */}
        <div className="legal-regulated-content__section legal-regulated-content__section--fsa">
          <div className="legal-regulated-content__image-container">
            {/* Desktop Image */}
            <div className="legal-regulated-content__image--desktop">
              <picture>
                <source type="image/webp" srcSet={FSA_REGULATED_DESKTOP_WEBP} />
                <img
                  src={fsaRegulatedDesktopSvg}
                  alt=""
                  width={FSA_DESKTOP_DIM.w}
                  height={FSA_DESKTOP_DIM.h}
                  className="legal-regulated-content__image"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            {/* Mobile Image */}
            <div className="legal-regulated-content__image--mobile">
              <picture>
                <source type="image/webp" srcSet={FSA_REGULATED_MOBILE_WEBP} />
                <img
                  src={fsaRegulatedMobileSvg}
                  alt=""
                  width={FSA_MOBILE_DIM.w}
                  height={FSA_MOBILE_DIM.h}
                  className="legal-regulated-content__image"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>

          <div className="legal-regulated-content__content">
            <div className="legal-regulated-content__text-content">
              {/* Badge */}
              <div className="legal-regulated-content__badge">
                <div className="legal-regulated-content__badge-icon">
                  <img
                    src={personPlusIcon}
                    alt=""
                    width={14}
                    height={14}
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
    </>
  );
};

LegalRegulatedContent.propTypes = {
  className: PropTypes.string,
};

export default LegalRegulatedContent;
