import React, { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";

const TradingSectionsMobileDropdown = ({
  selectedSection,
  setSelectedSection,
  tradingSection,
}) => {
  const { t } = useTranslationWithVariables();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (section) => {
    setSelectedSection(section);
    setIsOpen(false);
  };

  return (
    <div className="trading-sections-mobile-dropdown">
      <button
        className="trading-sections-mobile-dropdown__button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="trading-sections-mobile-dropdown__text">
          {t(selectedSection.title)}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn("trading-sections-mobile-dropdown__icon", {
            "trading-sections-mobile-dropdown__icon--open": isOpen,
          })}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="trading-sections-mobile-dropdown__content">
          {tradingSection.map((section) => (
            <button
              key={section.id}
              className={cn("trading-sections-mobile-dropdown__option", {
                "trading-sections-mobile-dropdown__option--active":
                  section.id === selectedSection.id,
              })}
              onClick={() => handleSelection(section)}
            >
              {t(section.title)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

TradingSectionsMobileDropdown.propTypes = {
  selectedSection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  setSelectedSection: PropTypes.func.isRequired,
  tradingSection: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TradingSectionsMobileDropdown;
