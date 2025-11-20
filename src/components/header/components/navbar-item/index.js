import React, { useRef, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { ChevronDownIcon, ChevronUpIcon } from "../../../shared/icons";
import CommonContext from "../../../../context/common-context";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import PartnersNavIcon from "../../../shared/icons/PartnersNavIcon";
import InternalLink from "../../../shared/internal-link";

const NavbarItem = ({
  className,
  title,
  subItems = [],
  link,
  isPartners,
  isDropdownVisible,
  onDropdownToggle,
  closeDropdown,
  index,
  dropdownLocked, // Add this prop from Header
  onOpenRegistrationPopup, // Add this prop from Header
}) => {
  const { t } = useTranslationWithVariables();
  const dropdownRef = useRef();
  const itemRef = useRef();
  const { dropdownHeightOffset, isScrolled } = useContext(CommonContext);
  const { isTablet, isMobile } = useWindowSize();
  const [isHovered, setIsHovered] = useState(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleDocumentClick(e) {
      if (dropdownLocked) {
        // If locked from parent, do not close dropdown
        return;
      }

      // Do not close if popup is about to open
      if (window.__OQTIMA_REGISTRATION_POPUP_PENDING__) {
        return;
      }

      // Do not close if click is on a popup trigger button or its ancestor
      if (e.target.closest('[data-popup-trigger="true"]')) {
        return;
      }

      // Do not close if click is inside the registration popup
      if (
        document.querySelector(".popup-registration") &&
        e.target.closest(".popup-registration")
      ) {
        return;
      }

      // Do not close if click is on any navbar item (let the navbar item handle its own click)
      if (e.target.closest(".navbar-item")) {
        return;
      }

      // Do not close if click is inside the header-dropdown-card
      if (e.target.closest(".header-dropdown-card")) {
        return;
      }

      // Do not close if click is inside lang-options popup
      if (e.target.closest(".lang-options")) {
        return;
      }

      // Do not close if click is inside any popup
      if (e.target.closest(".popup")) {
        return;
      }

      // Only close if clicked outside the dropdown and navbar items
      if (itemRef.current && !itemRef.current.contains(e.target)) {
        closeDropdown();
      }
    }

    if (isDropdownVisible) {
      document.addEventListener("pointerdown", handleDocumentClick);
    } else {
      document.removeEventListener("pointerdown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("pointerdown", handleDocumentClick);
    };
  }, [isDropdownVisible, closeDropdown, dropdownLocked]);

  // Special case for Partners
  if (isPartners) {
    return (
      <li
        className={cn("navbar-item", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <InternalLink
          to={link}
          className={cn("navbar-item__title navbar-item__partners-link")}
        >
          {t(title)}
          <span className="navbar-item__icon-wrapper">
            <PartnersNavIcon
              className={cn("navbar-item__icon navbar-item__icon--partners")}
              color={isHovered ? "#FF4400" : "#B6B6B6"}
            />
          </span>
        </InternalLink>
      </li>
    );
  }

  return (
    <li
      ref={itemRef}
      className={cn("navbar-item", className, {
        "navbar-item--active": isDropdownVisible,
      })}
      onClick={(e) => {
        e.stopPropagation();
        onDropdownToggle();
      }}
    >
      <span className="navbar-item__title">{t(title)}</span>
      <span
        className="navbar-item__icon-wrapper"
        style={{ position: "relative", width: 16, height: 16 }}
      >
        <ChevronDownIcon
          className={cn("navbar-item__icon", "navbar-item__icon--down", {
            rotated: isDropdownVisible,
          })}
          color="#000000"
        />
      </span>
      {/* Dropdown rendering removed. Now handled in Header. */}
    </li>
  );
};

NavbarItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  subItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        groupTitle: PropTypes.string.isRequired,
        groupItems: PropTypes.array,
      }),
    ])
  ),
  link: PropTypes.string,
  isPartners: PropTypes.bool,
};

export default NavbarItem;
