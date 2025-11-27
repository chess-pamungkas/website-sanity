import React, { useState, useContext, useEffect } from "react";
import BadgeAccountComparisonIcon from "../../../../assets/images/icons/account-comparison/badge-account-comparison.svg";
import BadgeMostPopularIcon from "../../../../assets/images/icons/account-comparison/badge-most-popular.svg";
// Using static folder path for WebP (more reliable in Gatsby)
const StarMostPopularIcon = "/images/star-most-popular.webp";
import BadgeBeginnerChoiceIcon from "../../../../assets/images/icons/account-comparison/badge-beginner-choice.svg";
// Using static folder path for WebP (more reliable in Gatsby)
const StarBeginnerChoiceIcon = "/images/star-beginner-choice.webp";
import CircleMarkIcon from "../../../../assets/images/icons/circle-mark.svg";
// Import WebP for desktop (smaller file size), SVG for mobile
// Using static folder path for WebP (more reliable in Gatsby)
const AccountComparisonDesktopBg = "/images/account-comparison-desktop.webp";
import AccountComparisonMobileBg from "../../../../assets/images/bg/account-comparison/account-comparison-mobile.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  ButtonPrimaryComparisonAccountsType,
  ButtonSecondaryComparisonAccountsType,
  ButtonPrimaryComparisonZeroAccountsType,
} from "./button-components";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";

const AccountTypesAccountComparison = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const ecnFeatures = [
    t("account-comparison-accounts-type-ecn-feature1"),
    t("account-comparison-accounts-type-ecn-feature2"),
    t("account-comparison-accounts-type-ecn-feature3"),
    t("account-comparison-accounts-type-ecn-feature4"),
    t("account-comparison-accounts-type-ecn-feature5"),
    t("account-comparison-accounts-type-ecn-feature6"),
    t("account-comparison-accounts-type-ecn-feature7"),
    t("account-comparison-accounts-type-ecn-feature8"),
  ];

  const zeroFeatures = [
    t("account-comparison-accounts-type-zero-feature1"),
    t("account-comparison-accounts-type-zero-feature2"),
    t("account-comparison-accounts-type-zero-feature3"),
    t("account-comparison-accounts-type-zero-feature4"),
    t("account-comparison-accounts-type-zero-feature5"),
    t("account-comparison-accounts-type-zero-feature6"),
    t("account-comparison-accounts-type-zero-feature7"),
    t("account-comparison-accounts-type-zero-feature8"),
  ];

  // Using static folder path for WebP (more reliable)
  const backgroundSrc = isMobile
    ? AccountComparisonMobileBg
    : AccountComparisonDesktopBg;

  return (
    <section
      className={`account-types-account-comparison-content ${
        isRTL ? "account-comparison-content--rtl" : ""
      }`}
    >
      {/* Background Images */}
      <div className="account-comparison-bg"></div>

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
          {t("account-comparison-accounts-type-title")}
        </h2>
        <p className="account-comparison-subtitle">
          {t("account-comparison-accounts-type-subtitle")}
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
            <ButtonPrimaryComparisonAccountsType
              text={t("account-comparison-ecn-button-primary")}
              onClick={handleShowRegistrationPopup}
            />
            <ButtonSecondaryComparisonAccountsType
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
            <ButtonPrimaryComparisonZeroAccountsType
              text={t("account-comparison-zero-button-primary")}
              onClick={handleShowRegistrationPopup}
            />
            <ButtonSecondaryComparisonAccountsType
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

export default AccountTypesAccountComparison;
