import React, { memo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";

const Tab = memo(({ children, isSelected, panelId, onTabClick }) => {
  return (
    <li
      className={cn("tabs__tab", { "tabs__tab--active": isSelected })}
      role="tab"
      id={`tab-${panelId}`}
      aria-selected={isSelected}
      aria-controls={`panel-${panelId}`}
      tabIndex={isSelected ? 0 : -1}
      onClick={onTabClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTabClick();
        }
      }}
    >
      {children}
    </li>
  );
});

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool.isRequired,
  panelId: PropTypes.number.isRequired,
  onTabClick: PropTypes.func.isRequired,
};

Tab.displayName = "Tab";

export default Tab;
