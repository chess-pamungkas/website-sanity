import React, { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";

const Dropdown = ({
  className,
  items,
  selectedItem,
  setSelectedItem,
  isDropdownShown,
}) => {
  const { t } = useTranslationWithVariables();
  const [isOpen, setIsOpen] = useState(false);

  const onSelectionByClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setSelectedItem(item);
    setIsOpen(false);
  };

  const renderItems = () => {
    return items.map((item) => {
      return (
        <button
          key={`dropdown-item-${item.value}`}
          type="button"
          className={cn("dropdown__item", {
            // TODO refactor this to avoid id prop here
            "dropdown__item--active":
              (selectedItem.id || selectedItem.value) === item.value,
          })}
          onClick={() => onSelectionByClick(item)}
        >
          <span>{t(item.title)}</span>
        </button>
      );
    });
  };

  return (
    <div
      className={cn("dropdown", className, {
        "dropdown--opened": isOpen,
      })}
    >
      <button
        className="dropdown__title"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dropdown__title-content">{t(selectedItem.title)}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn("dropdown__icon", {
            "dropdown__icon--open": isOpen,
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
      {isOpen && isDropdownShown && (
        <div className="dropdown__content">
          <div className="dropdown__items">
            <div>{renderItems()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  selectedItem: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  isDropdownShown: PropTypes.bool,
};
export default Dropdown;
