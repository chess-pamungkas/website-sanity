import React from "react";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";

// Background images
import desktopBigCardBg from "../../assets/images/bg/main-page/badge-features-big-desktop.svg";
import mobileBigCardBg from "../../assets/images/bg/main-page/badge-features-big-mobile.svg";

// Small card background images - Desktop
import cardPaymentsSecurityDesktop from "../../assets/images/bg/main-page/card-payments-security-desktop.svg";
import cardSuperiorTradingConditionsDesktop from "../../assets/images/bg/main-page/card-superior-trading-conditions-desktop.svg";
import cardDemoAccountDesktop from "../../assets/images/bg/main-page/card-demo-account-desktop.svg";

// Small card background images - Mobile
import cardPaymentsSecurityMobile from "../../assets/images/bg/main-page/card-payments-security-mobile.svg";
import cardSuperiorTradingConditionsMobile from "../../assets/images/bg/main-page/card-superior-trading-conditions-mobile.svg";
import cardDemoAccountMobile from "../../assets/images/bg/main-page/card-demo-account-mobile.svg";

// Card content images
import tier1BanksDesktop from "../../assets/images/main-page/tier1-banks-desktop.svg";
import tier1BanksMobile from "../../assets/images/main-page/tier1-banks-mobile.svg";
import chooseLanguageDesktop from "../../assets/images/main-page/choose-your-language-desktop.svg";
import chooseLanguageMobile from "../../assets/images/main-page/choose-your-language-mobile.svg";

// Feature icons
import ClientSecurityIcon from "../../assets/images/icons/main-page/features/features-client-security-regulation.svg";
import MultiLanguageIcon from "../../assets/images/icons/main-page/features/features-multi-language-support.svg";
import PaymentsIcon from "../../assets/images/icons/main-page/features/features-payments-security.svg";
import TradingConditionsIcon from "../../assets/images/icons/main-page/features/features-superior-trading-conditions.svg";
import DemoAccountIcon from "../../assets/images/icons/main-page/features/features-demo-account.svg";
import FeaturesIcon from "../../assets/images/icons/features.svg";

const FeaturesContent = () => {
  const { isMobile, isTablet } = useWindowSize();
  const { t } = useTranslationWithVariables();

  const bigCardBg = isMobile ? mobileBigCardBg : desktopBigCardBg;
  const tier1BanksImg = isMobile ? tier1BanksMobile : tier1BanksDesktop;
  const chooseLanguageImg = isMobile
    ? chooseLanguageMobile
    : chooseLanguageDesktop;

  // Small card background images based on device
  const smallCardBgs = {
    payments: isMobile
      ? cardPaymentsSecurityMobile
      : cardPaymentsSecurityDesktop,
    trading: isMobile
      ? cardSuperiorTradingConditionsMobile
      : cardSuperiorTradingConditionsDesktop,
    demo: isMobile ? cardDemoAccountMobile : cardDemoAccountDesktop,
  };

  return (
    <div className="features-content-section">
      <div className="features-content-section__container">
        {/* Header Section */}
        <div className="features-content-section__header">
          <div className="features-content-section__badge">
            <img
              src={FeaturesIcon}
              alt={t("features-content-section_badge-text")}
              className="features-content-section__badge-icon"
            />
            <span className="features-content-section__badge-text">
              {t("features-content-section_badge-text")}
            </span>
          </div>
          <h2 className="features-content-section__title">
            {t("features-content-section_title")}
          </h2>
          <p className="features-content-section__subtitle">
            {t("features-content-section_subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-content-section__grid">
          {/* Top Row - Big Cards */}
          <div className="features-content-section__big-cards">
            {/* Client Security & Regulation */}
            <div className="features-content-section__card features-content-section__card--big">
              <div
                className="features-content-section__card-bg"
                style={{ backgroundImage: `url(${bigCardBg})` }}
              >
                {/* Left Content Container (302px width) */}
                <div className="features-content-section__card-left">
                  <div className="features-content-section__card-header">
                    <img
                      src={ClientSecurityIcon}
                      alt={t("features-content-section_client-security_alt")}
                      className="features-content-section__card-icon"
                    />
                    <h3 className="features-content-section__card-title">
                      {t("features-content-section_client-security_title")}
                    </h3>
                  </div>
                  <p className="features-content-section__card-description">
                    {t("features-content-section_client-security_description")}
                  </p>
                </div>

                {/* Right Illustration Container (302px width) */}
                <div className="features-content-section__card-right">
                  <div className="features-content-section__card-graphic">
                    <img
                      src={tier1BanksImg}
                      alt={t("features-content-section_tier1-banks_alt")}
                      className="features-content-section__card-graphic-img tier1-banks-img"
                      width={245}
                      height={226}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 24/7 Multi-Language Support */}
            <div className="features-content-section__card features-content-section__card--big">
              <div
                className="features-content-section__card-bg"
                style={{ backgroundImage: `url(${bigCardBg})` }}
              >
                {/* Left Content Container (302px width) */}
                <div className="features-content-section__card-left">
                  <div className="features-content-section__card-header">
                    <img
                      src={MultiLanguageIcon}
                      alt={t("features-content-section_multi-language_alt")}
                      className="features-content-section__card-icon"
                    />
                    <h3 className="features-content-section__card-title">
                      {t("features-content-section_multi-language_title")}
                    </h3>
                  </div>
                  <p className="features-content-section__card-description">
                    {t("features-content-section_multi-language_description")}
                  </p>
                </div>

                {/* Right Illustration Container (302px width) */}
                <div className="features-content-section__card-right">
                  <div className="features-content-section__card-graphic">
                    <img
                      src={chooseLanguageImg}
                      alt={t("features-content-section_choose-language_alt")}
                      className="features-content-section__card-graphic-img choose-language-img"
                      width={251}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Small Cards */}
          <div className="features-content-section__small-cards">
            {/* Payments & Security */}
            <div className="features-content-section__card features-content-section__card--small">
              <div className="features-content-section__card-bg">
                <div className="features-content-section__card-content">
                  <div className="features-content-section__card-header">
                    <img
                      src={PaymentsIcon}
                      alt={t("features-content-section_payments_alt")}
                      className="features-content-section__card-icon"
                    />
                    <h3 className="features-content-section__card-title">
                      {t("features-content-section_payments_title")}
                    </h3>
                  </div>
                  <p className="features-content-section__card-description">
                    {t("features-content-section_payments_description")}
                  </p>
                </div>
                <div
                  className="features-content-section__card-visual features-content-section__card-visual--payments"
                  style={{
                    backgroundImage: `url(${
                      isMobile || isTablet
                        ? cardPaymentsSecurityMobile
                        : cardPaymentsSecurityDesktop
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>
            </div>

            {/* Superior Trading Conditions */}
            <div className="features-content-section__card features-content-section__card--small">
              <div className="features-content-section__card-bg">
                <div className="features-content-section__card-content">
                  <div className="features-content-section__card-header">
                    <img
                      src={TradingConditionsIcon}
                      alt={t("features-content-section_trading_alt")}
                      className="features-content-section__card-icon"
                    />
                    <h3 className="features-content-section__card-title">
                      {t("features-content-section_trading_title")}
                    </h3>
                  </div>
                  <p className="features-content-section__card-description">
                    {t("features-content-section_trading_description")}
                  </p>
                </div>
                <div
                  className="features-content-section__card-visual features-content-section__card-visual--trading"
                  style={{
                    backgroundImage: `url(${
                      isMobile || isTablet
                        ? cardSuperiorTradingConditionsMobile
                        : cardSuperiorTradingConditionsDesktop
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>
            </div>

            {/* $10,000 Demo Account */}
            <div className="features-content-section__card features-content-section__card--small">
              <div className="features-content-section__card-bg">
                <div className="features-content-section__card-content">
                  <div className="features-content-section__card-header">
                    <img
                      src={DemoAccountIcon}
                      alt={t("features-content-section_demo_alt")}
                      className="features-content-section__card-icon"
                    />
                    <h3 className="features-content-section__card-title">
                      {t("features-content-section_demo_title")}
                    </h3>
                  </div>
                  <p className="features-content-section__card-description">
                    {t("features-content-section_demo_description")}
                  </p>
                </div>
                <div
                  className="features-content-section__card-visual features-content-section__card-visual--demo"
                  style={{
                    backgroundImage: `url(${
                      isMobile || isTablet
                        ? cardDemoAccountMobile
                        : cardDemoAccountDesktop
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesContent;
