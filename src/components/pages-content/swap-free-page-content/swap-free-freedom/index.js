import React, { useContext, useState } from "react";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import BadgeSecurityIcon from "../../../../assets/images/icons/badge-security.svg";
import CircleMarkIcon from "../../../../assets/images/icons/circle-mark.svg";
import SwapFreeFreedomImage from "../../../../assets/images/swap-free/swap-free-freedom.svg";
import { StandardButtons } from "../../../../components/shared/reusable-buttons";

const SwapFreeFreedom = () => {
  const { t } = useTranslationWithVariables();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const swapFreeFeatures = [
    {
      text: t("swap_free_freedom_feature_1"),
      icon: CircleMarkIcon,
    },
    {
      text: t("swap_free_freedom_feature_2"),
      icon: CircleMarkIcon,
    },
    {
      text: t("swap_free_freedom_feature_3"),
      icon: CircleMarkIcon,
    },
    {
      text: t("swap_free_freedom_feature_4"),
      icon: CircleMarkIcon,
    },
  ];

  return (
    <section className="swap-free-freedom">
      <div className="swap-free-freedom__container">
        <div className="swap-free-freedom__content">
          <div className="swap-free-freedom__image">
            <img
              src={SwapFreeFreedomImage}
              alt="Swap-Free Freedom"
              className="swap-free-freedom__image-content"
            />
          </div>
          <div className="swap-free-freedom__text">
            {/* Badge */}
            <div className="swap-free-freedom__badge">
              <img src={BadgeSecurityIcon} alt={t("swap_free_freedom_badge")} />
              <span className="swap-free-freedom__badge-text">
                {t("swap_free_freedom_badge")}
              </span>
            </div>

            {/* Title */}
            <h2 className="swap-free-freedom__title">
              {t("swap_free_freedom_title")}
            </h2>

            {/* Description */}
            <p className="swap-free-freedom__description">
              {t("swap_free_freedom_description")}
            </p>

            {/* Features List */}
            <ul className="swap-free-freedom__features">
              {swapFreeFeatures.map((feature, index) => (
                <li key={index} className="swap-free-freedom__feature">
                  <img
                    src={feature.icon}
                    alt="Check mark"
                    className="swap-free-freedom__feature-icon"
                  />
                  <span className="swap-free-freedom__feature-text">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="swap-free-freedom__buttons">
              <StandardButtons
                primaryText={t("button-start-trading")}
                secondaryText={t("button-try-demo")}
                onPrimaryClick={handleShowRegistrationPopup}
                onSecondaryClick={handleShowRegistrationPopup}
              />
            </div>
          </div>
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

export default SwapFreeFreedom;
