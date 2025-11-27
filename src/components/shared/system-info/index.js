import React, { useContext } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { DIR_LTR, DIR_RTL } from "../../../helpers/constants";
import { ButtonLearnMore } from "../reusable-buttons";
import fourZeroFourTextDesktop from "../../../assets/images/bg/404/404-text-desktop.png";
import fourZeroFourTextMobile from "../../../assets/images/bg/404/404-text-mobile.png";
import { useI18next } from "gatsby-plugin-react-i18next";
import LanguageContext from "../../../context/language-context";

const SystemInfoComponent = ({
  className,
  title,
  subTitle,
  image,
  goBackBtnTitle,
}) => {
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();
  const { navigate } = useI18next();
  const { selectedLanguage } = useContext(LanguageContext);

  return (
    <section
      className={cn("system-info", className, {
        "system-info--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="system-info__hero-container">
        {/* Hero Background Image */}
        <div className="system-info__hero-bg">
          <div className="system-info__hero-bg-desktop"></div>
          <div className="system-info__hero-bg-mobile"></div>
        </div>

        <div className="container">
          {/* Content Container */}
          <div className="system-info__content-container">
            {/* Badge Group */}
            <div className="system-info__badge-group">
              <div className="system-info__badge-content">
                <span className="system-info__badge-message">
                  {t("system-info_badge-text")}
                </span>
                <svg
                  className="system-info__badge-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
                    stroke="#FF4400"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* 404 Text Image */}
            <div className="system-info__404-text-container">
              <img
                src={fourZeroFourTextDesktop}
                alt="404"
                className="system-info__404-text system-info__404-text--desktop"
              />
              <img
                src={fourZeroFourTextMobile}
                alt="404"
                className="system-info__404-text system-info__404-text--mobile"
              />
            </div>

            {/* Subheading */}
            <p className="system-info__subheading">{subTitle}</p>

            {/* Button Container */}
            <div className="system-info__button-container">
              <div className="system-info__button-wrapper">
                <ButtonLearnMore
                  text={t("system-page-go-back-btn")}
                  onClick={() => {
                    // Preserve language prefix when navigating to homepage
                    // Use selectedLanguage.URIPart to get language prefix
                    // Default language has URIPart: "" (empty), non-default has URIPart: "/id" (without trailing slash)
                    // For homepage, we need trailing slash: "/" for default, "/id/" for non-default
                    const languagePrefix = selectedLanguage?.URIPart || "";
                    const homepagePath =
                      languagePrefix === "" ? "/" : `${languagePrefix}/`;
                    navigate(homepagePath);
                  }}
                  className="system-info__return-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

SystemInfoComponent.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  goBackBtnTitle: PropTypes.string.isRequired,
};
export default SystemInfoComponent;
