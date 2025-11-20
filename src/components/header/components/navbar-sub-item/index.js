import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import InternalLink from "../../../shared/internal-link";

const NavbarSubItem = ({
  className,
  subItem = {},
  onClick,
  isTwoItemsLayout = false,
  hideIcon = false,
  hideDescription = false,
}) => {
  const { title, link, icon: RawIcon, description: rawDescription } = subItem;
  const { t } = useTranslationWithVariables();
  const Icon = hideIcon ? null : RawIcon;
  const description = hideDescription ? null : rawDescription;

  // Handle Live Chat click to open ConvrsChat
  const handleLinkClick = (e) => {
    // Check if this is the Live Chat item
    if (title === "header-nav-tab-trading-hub-live-chat-title") {
      e.preventDefault();
      if (typeof window !== "undefined" && window.ConvrsChat) {
        window.ConvrsChat.ShowWebChat();
      }
      // Also call the parent onClick handler if provided
      if (onClick) {
        onClick(e);
      }
      return;
    }
    // For other links, let the normal navigation happen
  };

  return (
    <li className={cn("dropdown-item", className)} onClick={onClick}>
      <InternalLink
        className="dropdown-item__link"
        to={link}
        onClick={handleLinkClick}
      >
        {isTwoItemsLayout ? (
          // For 2 items layout: icon above content
          <>
            {Icon && (
              <Icon className="dropdown-item__icon dropdown-item__icon--above" />
            )}
            <div className="dropdown-item__content">
              <span className="dropdown-item__title">{t(title)}</span>
              {description && (
                <p className="dropdown-item__description">{t(description)}</p>
              )}
            </div>
          </>
        ) : (
          // For other layouts: icon to the left of content
          <>
            {Icon && <Icon className="dropdown-item__icon" />}
            <div className="dropdown-item__content">
              <span className="dropdown-item__title">{t(title)}</span>
              {description && (
                <p className="dropdown-item__description">{t(description)}</p>
              )}
            </div>
          </>
        )}
      </InternalLink>
    </li>
  );
};

NavbarSubItem.propTypes = {
  className: PropTypes.string,
  subItem: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    icon: PropTypes.elementType, // for React components passed as icons
    description: PropTypes.string,
  }),
  onClick: PropTypes.func,
  isTwoItemsLayout: PropTypes.bool,
};

export default NavbarSubItem;
