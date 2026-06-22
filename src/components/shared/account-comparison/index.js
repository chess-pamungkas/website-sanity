import React, { useState, useContext } from "react";
import BadgeAccountComparisonIcon from "../../../assets/images/icons/account-comparison/badge-account-comparison.svg";
import BadgeMostPopularIcon from "../../../assets/images/icons/account-comparison/badge-most-popular.svg";
import BadgeBeginnerChoiceIcon from "../../../assets/images/icons/account-comparison/badge-beginner-choice.svg";
import { CircleMarkIcon } from "../shared-icons";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import LanguageContext from "../../../context/language-context";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import {
  ButtonPrimaryComparison,
  ButtonSecondaryComparison,
  ButtonPrimaryComparisonZero,
  ButtonContainer,
} from "../reusable-buttons";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";

// Using static folder path for WebP (more reliable in Gatsby)
const StarMostPopularIcon = "/images/star-most-popular.webp";
/** Retina candidate for mobile Lighthouse (display 110×116 @ ~1.5 DPR). */
const StarMostPopularIcon2x = "/images/star-most-popular@2x.webp";
const StarMostPopularSrcSet = `${StarMostPopularIcon} 110w, ${StarMostPopularIcon2x} 220w`;
const StarBeginnerChoiceIcon = "/images/star-beginner-choice.webp";
const AccountComparisonDesktopBg = "/images/account-comparison-desktop.webp";
const AccountComparisonMobileBg = "/images/account-comparison-mobile.webp";
/** Must match intrinsic pixels of each WebP (Lighthouse image-aspect-ratio). */
const ACCOUNT_COMPARISON_BG_DIM = {
  desktop: { width: 1440, height: 981 },
  mobile: { width: 393, height: 1554 },
};

const AccountComparison = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const ecnFeatures = [
    t("account-comparison-ecn-feature1"),
    t("account-comparison-ecn-feature2"),
    t("account-comparison-ecn-feature3"),
    t("account-comparison-ecn-feature4"),
  ];

  const zeroFeatures = [
    t("account-comparison-zero-feature1"),
    t("account-comparison-zero-feature2"),
    t("account-comparison-zero-feature3"),
    t("account-comparison-zero-feature4"),
  ];

  return (
    <section
      className={`account-comparison-content ${
        isRTL ? "account-comparison-content--rtl" : ""
      }`}
    >
      {/* Background Images */}
      {/* CRITICAL: This SVG is very large (3.6 MB), so we use lazy loading and low priority */}
      {/* TODO: Optimize SVG file by removing embedded bitmap images and using SVG paths */}
      <div className="account-comparison-bg">
        {/*
          <picture> so mobile does not download 1440-wide WebP (Lighthouse "Improve image delivery").
          Fallback <img> stays mobile dimensions for aspect hint when sources do not apply.
        */}
        <picture className="account-comparison-bg__picture">
          <source
            media="(min-width: 769px)"
            srcSet={AccountComparisonDesktopBg}
            type="image/webp"
          />
          <img
            src={AccountComparisonMobileBg}
            alt={t("account-comparison-shared_background-alt")}
            className="account-comparison-bg__image"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            width={ACCOUNT_COMPARISON_BG_DIM.mobile.width}
            height={ACCOUNT_COMPARISON_BG_DIM.mobile.height}
          />
        </picture>
      </div>

      {/* Header */}
      <div className="account-comparison-header">
        <div className="badge-row">
          <img
            src={BadgeAccountComparisonIcon}
            alt={t("account-comparison-badge-alt")}
          />
          <span className="badge-label">
            {t("account-comparison-badge-label")}
          </span>
        </div>
        <h2 className="account-comparison-title">
          {t("account-comparison-title")}
        </h2>
        <p className="account-comparison-subtitle">
          {t("account-comparison-subtitle")}
        </p>
      </div>

      {/* Account Cards */}
      <div className="account-cards container">
        {/* OQtimaOne Card */}
        <div className="account-card zero-card">
          <div className="card-header">
            <div className="card-badge">
              <img
                src={BadgeBeginnerChoiceIcon}
                alt={t("account-comparison-zero-badge-alt")}
              />
              <span>{t("account-comparison-zero-badge-text")}</span>
            </div>
          </div>
          <div className="card-stars">
            <img
              src={StarBeginnerChoiceIcon}
              alt={t("account-comparison-zero-stars-alt")}
              width={92}
              height={112}
            />
          </div>

          <h3 className="card-title">{t("account-comparison-zero-title")}</h3>

          <p className="card-description">
            {t("account-comparison-zero-description")}
          </p>

          <ul className="card-features">
            {zeroFeatures.map((feature, index) => (
              <li key={index} className="feature-item">
                <div className="feature-icon">
                  <img
                    src={CircleMarkIcon}
                    alt={t("account-comparison_feature-icon-alt")}
                    width={16}
                    height={17}
                  />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="card-buttons">
            {/* <ButtonContainer> */}
            <ButtonPrimaryComparisonZero
              text={t("account-comparison-zero-button-primary")}
              onClick={handleShowRegistrationPopup}
            />
            <ButtonSecondaryComparison
              text={t("account-comparison-zero-button-secondary")}
              onClick={handleShowRegistrationPopup}
            />
            {/* </ButtonContainer> */}
          </div>
        </div>

        {/* ECN+ Card */}
        <div className="account-card ecn-card">
          <div className="card-header">
            <div className="card-badge">
              <img
                src={BadgeMostPopularIcon}
                alt={t("account-comparison-ecn-badge-alt")}
              />
              <span>{t("account-comparison-ecn-badge-text")}</span>
            </div>
          </div>
          <div className="card-stars">
            <img
              src={StarMostPopularIcon}
              srcSet={StarMostPopularSrcSet}
              sizes="110px"
              alt={t("account-comparison-ecn-stars-alt")}
              width={110}
              height={116}
            />
          </div>

          <h3 className="card-title">{t("account-comparison-ecn-title")}</h3>

          <p className="card-description">
            {t("account-comparison-ecn-description")}
          </p>

          <ul className="card-features">
            {ecnFeatures.map((feature, index) => (
              <li key={index} className="feature-item">
                <div className="feature-icon">
                  <img
                    src={CircleMarkIcon}
                    alt={t("account-comparison_feature-icon-alt")}
                    width={16}
                    height={17}
                  />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="card-buttons">
            {/* <ButtonContainer> */}
            <ButtonPrimaryComparison
              text={t("account-comparison-ecn-button-primary")}
              onClick={handleShowRegistrationPopup}
            />
            <ButtonSecondaryComparison
              text={t("account-comparison-ecn-button-secondary")}
              onClick={handleShowRegistrationPopup}
            />
            {/* </ButtonContainer> */}
          </div>
        </div>
      </div>

      {/* Shared Features */}
      <div className="shared-features">
        <div className="shared-features-content">
          {t("account-comparison-shared-features-label")}: 🌍{" "}
          {t("account-comparison-shared-feature1")} | 💻{" "}
          {t("account-comparison-shared-feature2")} | 🛡️{" "}
          {t("account-comparison-shared-feature3")} | 📞{" "}
          {t("account-comparison-shared-feature4")}
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

export default AccountComparison;
