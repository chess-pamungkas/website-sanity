import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import {
  LANG_SELECT_OPTIONS,
  SHOULD_BE_SMALLER_LANGUAGES,
} from "../../../../helpers/lang-options.config";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import BadgeSecurityIcon from "../../../../assets/images/icons/badge-security.svg";
import CloseIcon from "../../../../assets/images/icons/close-icon.svg";

const LangSelectItem = ({
  language: { id, icon: Icon, name } = {},
  language,
  selectedLanguage: { id: selectedId } = {},
  languageSelectHandler,
}) => {
  const { originalPath } = useI18next();

  return (
    <li
      className={cn("lang-options__item", {
        "lang-options__item--selected": selectedId === id,
      })}
    >
      <Link
        to={originalPath}
        language={language.id}
        className="lang-options__select"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling to close other dropdowns
          languageSelectHandler(language);
          document.documentElement.setAttribute("lang", language.id);
        }}
      >
        {Icon && <Icon className="lang-options__flag" />}

        <span
          className={
            SHOULD_BE_SMALLER_LANGUAGES.includes(name)
              ? "lang-options__name--small"
              : "lang-options__name"
          }
        >
          {name}
        </span>
      </Link>
    </li>
  );
};

LangSelectItem.propTypes = {
  language: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.func,
    name: PropTypes.string.isRequired,
  }).isRequired,
  selectedLanguage: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  languageSelectHandler: PropTypes.func.isRequired,
};

const LangOptions = ({
  className,
  selectedLanguage,
  languageSelectHandler,
  onClose,
}) => {
  const { t } = useTranslationWithVariables();

  return (
    <div className={cn("lang-options", className)}>
      {/* Close Button */}
      <button className="lang-options__close" onClick={onClose} type="button">
        <img
          src={CloseIcon}
          alt={t("lang-options_close-icon-alt")}
          className="lang-options__close-icon"
        />
      </button>

      {/* Badge Group */}
      <div className="lang-options__badge-group">
        <div className="lang-options__badge">
          <img
            src={BadgeSecurityIcon}
            alt={t("lang-options_badge-icon-alt")}
            className="lang-options__badge-icon"
          />
          <span className="lang-options__badge-text">
            {t("lang-select-popup-badge-text")}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="lang-options__title">{t("lang-select-popup-title")}</h2>

      {/* Language Grid */}
      <div className="lang-options__grid">
        {LANG_SELECT_OPTIONS.map((option) => (
          <LangSelectItem
            key={option.id}
            selectedLanguage={selectedLanguage}
            languageSelectHandler={languageSelectHandler}
            language={option}
          />
        ))}
      </div>
    </div>
  );
};

LangOptions.propTypes = {
  className: PropTypes.string,
  selectedLanguage: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  languageSelectHandler: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default LangOptions;
