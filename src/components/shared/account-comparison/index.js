import React, { useState, useContext, useEffect } from "react";
import BadgeAccountComparisonIcon from "../../../assets/images/icons/account-comparison/badge-account-comparison.svg";
import BadgeMostPopularIcon from "../../../assets/images/icons/account-comparison/badge-most-popular.svg";
// Using static folder path for WebP (more reliable in Gatsby)
const StarMostPopularIcon = "/images/star-most-popular.webp";
import BadgeBeginnerChoiceIcon from "../../../assets/images/icons/account-comparison/badge-beginner-choice.svg";
// Using static folder path for WebP (more reliable in Gatsby)
const StarBeginnerChoiceIcon = "/images/star-beginner-choice.webp";
import CircleMarkIcon from "../../../assets/images/icons/circle-mark.svg";
// Import WebP for desktop (smaller file size), SVG for mobile
// Using static folder path for WebP (more reliable in Gatsby)
const AccountComparisonDesktopBg = "/images/account-comparison-desktop.webp";
import AccountComparisonMobileBg from "../../../assets/images/bg/account-comparison/account-comparison-mobile.svg";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import LanguageContext from "../../../context/language-context";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import {
  ButtonPrimaryComparison,
  ButtonSecondaryComparison,
  ButtonPrimaryComparisonZero,
  ButtonContainer,
} from "../reusable-buttons";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";

const AccountComparison = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isMobile } = useWindowSize();
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

  // Using static folder path for WebP (more reliable)
  const backgroundSrc = isMobile
    ? AccountComparisonMobileBg
    : AccountComparisonDesktopBg;

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
        <img
          src={backgroundSrc}
          alt={t("account-comparison-shared_background-alt")}
          className="account-comparison-bg__image"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          width={isMobile ? "375" : "1920"}
          height={isMobile ? "981" : "981"}
        />
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
              alt={t("account-comparison-ecn-stars-alt")}
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

        {/* Zero+ Card */}
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
