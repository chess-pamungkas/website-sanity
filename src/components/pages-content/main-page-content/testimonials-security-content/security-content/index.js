import React, { useState, useContext } from "react";
import BadgeSecurityIcon from "../../../../../assets/images/icons/main-page/badge-security.svg";
import CircleMarkIcon from "../../../../../assets/images/icons/circle-mark.svg";
import { ShowRegistrationPopup } from "../../../../../helpers/constants";
import LanguageContext from "../../../../../context/language-context";
import { StandardButtons } from "../../../../shared/reusable-buttons";
import { useTranslationWithVariables } from "../../../../../helpers/hooks/use-translation-with-vars";

const SecurityContent = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const { t } = useTranslationWithVariables();

  const securityPoints = [
    {
      text: t("security-content_liquidity-partners"),
      icon: CircleMarkIcon,
    },
    {
      text: t("security-content_infrastructure"),
      icon: CircleMarkIcon,
    },
    {
      text: t("security-content_protection"),
      icon: CircleMarkIcon,
    },
    {
      text: t("security-content_negative-balance"),
      icon: CircleMarkIcon,
    },
  ];

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="security-content">
      <div className="badge-row">
        <img
          src={BadgeSecurityIcon}
          alt={t("security-content_badge-icon-alt")}
        />
        <span className="badge-label">{t("security-content_badge-text")}</span>
      </div>
      <h2 className="security-title">{t("security-content_title")}</h2>
      <ul className="security-list">
        {securityPoints.map((item, idx) => (
          <li key={idx} className="security-point">
            <img
              src={item.icon}
              alt={t("security-content_point-icon-alt")}
              className="point-icon"
            />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      <div className="navbar-dropdown-highlight__button-group">
        <StandardButtons
          primaryText={t("button-start-trading")}
          secondaryText={t("button-try-demo")}
          onPrimaryClick={handleShowRegistrationPopup}
          onSecondaryClick={handleShowRegistrationPopup}
        />
      </div>
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </div>
  );
};

export default SecurityContent;
