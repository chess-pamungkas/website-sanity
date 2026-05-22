import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { AngleDownIcon } from "../icons/AngleDownIcon";

const Accordion = ({
  children,
  className,
  title,
  isOpen,
  onSelect,
  icon: Icon,
  iconForActive: IconForActive,
}) => {
  const { t } = useTranslationWithVariables();

  const [isActive, setIsActive] = useState(isOpen);

  const handleClick = (title) => {
    if (onSelect) {
      // in case handling is needed in the parent component
      onSelect(title);
    } else {
      // default handling
      setIsActive(!isActive);
    }
  };

  useEffect(() => {
    if (onSelect) {
      setIsActive(isOpen);
    }
  }, [isOpen, onSelect]);

  const getIcon = useCallback(() => {
    const clsA = { show: isActive, hide: !isActive };
    const clsB = { show: !isActive, hide: isActive };

    return (
      <span className="btn-area">
        {IconForActive ? (
          <IconForActive className={cn(clsA)} />
        ) : (
          <Icon className={cn(clsA)} />
        )}
        <Icon className={cn(clsB)} />
        <Icon className="hidden" />
      </span>
    );
  }, [isActive, IconForActive]);

  return (
    <section
      className={cn("accordion", { "accordion--open": isActive }, className)}
    >
      <button
        type="button"
        className="accordion__title"
        onClick={() => {
          handleClick(title);
        }}
      >
        <span>{t(title)}</span>
        {Icon ? getIcon() : <AngleDownIcon className="accordion__icon" />}
      </button>
      {isActive && (
        <div className={cn("accordion__expandable", { show: isActive })}>
          {children}
        </div>
      )}
    </section>
  );
};

Accordion.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
  icon: PropTypes.func,
  iconForActive: PropTypes.func,
  children: PropTypes.node,
};
export default Accordion;
