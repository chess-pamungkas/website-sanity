import React, { useContext, useState, useRef } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { LogoTextMain, ChevronDownIcon } from "../shared/icons";
import {
  DIR_LTR,
  DIR_RTL,
  HOME_PAGE_LINK,
  GetLoginLink,
  ShowRegistrationPopup,
} from "../../helpers/constants";
import { stringTransformToKebabCase } from "../../helpers/services/string-service";
import NavbarItem from "./components/navbar-item";
import BurgerMenu from "./components/burger-menu";
import ButtonLink from "../shared/button-link";
import ButtonPopup from "../shared/button-popup";
import SearchBar from "./components/search-bar";
import { getMenuItems } from "../../helpers/menu.config";
import NotificationsContainer from "../shared/notification-stripe";
import { GDPRPopup } from "../gdpr-popup";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import CommonContext from "../../context/common-context";
import InternalLink from "../shared/internal-link";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useLangParam } from "../../helpers/services/language-service";
import LangSelect from "./components/lang-select";
import NavbarDropdownHighlight from "../shared/navbar-dropdown-highlight";
import NavbarSubItem from "./components/navbar-sub-item";
import PartnersNavIcon from "../shared/icons/PartnersNavIcon";

const Header = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const menu = getMenuItems();
  const isRTL = useRtlDirection();
  const { isDesktop, isTablet, isMobile } = useWindowSize();

  const {
    headerRef,
    headerMainWrapperRef,
    setSectionOptions,
    isSearchBarAttached,
    isScrolled,
  } = useContext(CommonContext);

  const langParam = useLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [dropdownLocked, setDropdownLocked] = useState(false); // Add lock state
  const lastDropdownIndexRef = useRef(null);
  const [partnersDropdownHovered, setPartnersDropdownHovered] = useState(false);

  const handleShowRegistrationPopup = (langParam) => {
    setIsPopupOpen(true);
    setDropdownLocked(true); // Lock dropdown when popup opens
    lastDropdownIndexRef.current = openDropdownIndex;
    // Optionally store langParam if needed
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setDropdownLocked(false); // Unlock dropdown when popup closes
  };

  const handleDropdownToggle = (idx) => {
    // Force immediate state update for switching between dropdowns
    if (openDropdownIndex === idx) {
      setOpenDropdownIndex(null);
      lastDropdownIndexRef.current = null;
    } else {
      // Immediately set the new index
      setOpenDropdownIndex(idx);
      lastDropdownIndexRef.current = idx;
    }
  };

  const handleCloseDropdown = () => {
    if (dropdownLocked) {
      // While locked, do not close the dropdown
      setOpenDropdownIndex(lastDropdownIndexRef.current);
      return;
    }
    setOpenDropdownIndex(null);
    lastDropdownIndexRef.current = null;
  };

  // Find the active menu item for dropdown
  const activeMenuItem =
    openDropdownIndex !== null ? menu[openDropdownIndex] : null;

  return (
    <div className="header-wrapper" ref={headerRef}>
      <NotificationsContainer setSectionOptions={setSectionOptions} />
      <GDPRPopup />
      {/* Header--big or header--small always visible behind */}
      <header
        className={cn(
          "header",
          className,
          {
            "header--rtl": isRTL,
          },
          { "header--small": isScrolled },
          { "header--big": !isScrolled && isDesktop }
        )}
        dir={isRTL ? DIR_RTL : DIR_LTR}
      >
        {/* <div
          className="container"
          style={{
            height: "100%",
          }}
        > */}
        <div className="header__main-wrapper" ref={headerMainWrapperRef}>
          <div className="header__left">
            <InternalLink
              to={HOME_PAGE_LINK}
              aria-label={t("breadcrumbs_home")}
            >
              {isDesktop && (
                <LogoTextMain
                  className="header__logo"
                  aria-hidden="true"
                  focusable="false"
                />
              )}
              {isTablet && (
                <LogoTextMain
                  className="header__logo"
                  aria-hidden="true"
                  focusable="false"
                />
              )}
            </InternalLink>
          </div>
          <div className="header__center">
            <ul className="header__navigation">
              {menu.map(
                (item, idx) =>
                  !item.mobileOnly && (
                    <NavbarItem
                      key={`header-menu-${stringTransformToKebabCase(
                        item.title
                      )}`}
                      {...item}
                      isDropdownVisible={openDropdownIndex === idx}
                      onDropdownToggle={() => handleDropdownToggle(idx)}
                      closeDropdown={handleCloseDropdown}
                      index={idx}
                      dropdownLocked={dropdownLocked}
                      onOpenRegistrationPopup={handleShowRegistrationPopup}
                    />
                  )
              )}
            </ul>
          </div>
          {/* Desktop navigation */}
          <div className="header__right">
            <BurgerMenu />
            <div className="header__controls">
              <LangSelect className="lang-select--header" isHeader={true} />
              {isDesktop && (
                <>
                  <ButtonLink
                    link={GetLoginLink()}
                    className={cn(
                      "button-link--header button-link--ghost header__signin",
                      { "header__signin--red": isScrolled }
                    )}
                  >
                    {t("button-sign-in")}
                  </ButtonLink>
                  <ButtonPopup
                    className={cn("button-link--header header__start", {
                      "header__start--red": isScrolled,
                    })}
                    onClick={handleShowRegistrationPopup}
                  >
                    {t("button-get-started")}
                  </ButtonPopup>
                </>
              )}
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* )} */}
      </header>

      {/* Header-dropdown-card floating above with header content + dropdown content */}
      {openDropdownIndex !== null &&
        isDesktop &&
        activeMenuItem &&
        !!activeMenuItem.subItems?.length && (
          <div
            className={cn("header-dropdown-card", {
              "header-dropdown-card--from-small": isScrolled,
              "header-dropdown-card--from-big": !isScrolled,
              "header-dropdown-card--rtl": isRTL,
            })}
          >
            {/* Header content inside the card */}
            <div className="header-content">
              {/* <div className="container"> */}
              <div className="header__main-wrapper">
                <div className="header__left">
                  <InternalLink to={HOME_PAGE_LINK}>
                    {isDesktop && <LogoTextMain className="header__logo" />}
                    {isTablet && <LogoTextMain className="header__logo" />}
                  </InternalLink>
                </div>
                <div className="header__center">
                  <ul className="header__navigation">
                    {menu.map(
                      (item, idx) =>
                        !item.mobileOnly &&
                        (item.isPartners ? (
                          <li
                            key={`dropdown-header-menu-${stringTransformToKebabCase(
                              item.title
                            )}`}
                            className={cn("navbar-item", {
                              "navbar-item--active": openDropdownIndex === idx,
                            })}
                            onMouseEnter={() =>
                              setPartnersDropdownHovered(true)
                            }
                            onMouseLeave={() =>
                              setPartnersDropdownHovered(false)
                            }
                          >
                            <InternalLink
                              to={item.link}
                              className={cn(
                                "navbar-item__title navbar-item__partners-link"
                              )}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {t(item.title)}
                              <span className="navbar-item__icon-wrapper">
                                <PartnersNavIcon
                                  className={cn(
                                    "navbar-item__icon navbar-item__icon--partners"
                                  )}
                                  color={
                                    partnersDropdownHovered
                                      ? "#FF4400"
                                      : "#B6B6B6"
                                  }
                                />
                              </span>
                            </InternalLink>
                          </li>
                        ) : (
                          <li
                            key={`dropdown-header-menu-${stringTransformToKebabCase(
                              item.title
                            )}`}
                            className={cn("navbar-item", {
                              "navbar-item--active": openDropdownIndex === idx,
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownToggle(idx);
                            }}
                          >
                            <span
                              className={cn("navbar-item__title", {
                                "navbar-item__title--black":
                                  openDropdownIndex === idx,
                              })}
                            >
                              {t(item.title)}
                            </span>
                            <span
                              className="navbar-item__icon-wrapper"
                              style={{
                                position: "relative",
                                width: 16,
                                height: 16,
                              }}
                            >
                              <ChevronDownIcon
                                className={cn(
                                  "navbar-item__icon",
                                  "navbar-item__icon--down",
                                  {
                                    rotated: openDropdownIndex === idx,
                                  }
                                )}
                                color="#000000"
                              />
                            </span>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
                {/* Mobile navigation */}
                <div className="header__right">
                  <div className="header__controls">
                    <LangSelect
                      className="lang-select--header"
                      isHeader={true}
                      key="dropdown-lang-select"
                    />
                    <ButtonLink
                      link={GetLoginLink()}
                      className={cn(
                        "button-link--header button-link--ghost header__signin",
                        { "header__signin--red": isScrolled }
                      )}
                    >
                      {t("button-sign-in")}
                    </ButtonLink>
                    <ButtonPopup
                      className={cn("button-link--header header__start", {
                        "header__start--red": isScrolled,
                      })}
                      onClick={handleShowRegistrationPopup}
                    >
                      {t("button-get-started")}
                    </ButtonPopup>
                  </div>
                  <BurgerMenu />
                </div>
              </div>
              {/* </div> */}
            </div>

            {/* Dropdown content inside the same card */}
            <div className="dropdown-content">
              <div className="navbar-item__dropdown navbar-item__dropdown--visible">
                {/* <div className="container"> */}
                <div className="navbar-item__dropdown-flex">
                  <NavbarDropdownHighlight
                    menuType={activeMenuItem.title}
                    onOpenRegistrationPopup={handleShowRegistrationPopup}
                  />
                  <div className="navbar-item__dropdown-separator" />
                  <div className="navbar-item__dropdown-content">
                    {(() => {
                      const items = activeMenuItem.subItems.filter(
                        (item) => !item.footerOnly
                      );

                      // Check if this is a grouped structure (Trading Hub) - v2
                      const hasGroupedItems = items.some(
                        (item) =>
                          item &&
                          item.groupTitle &&
                          item.groupItems &&
                          Array.isArray(item.groupItems)
                      );

                      if (hasGroupedItems) {
                        // Handle grouped structure (Trading Hub)
                        return (
                          <div className="navbar-item__dropdown-columns navbar-item__dropdown-columns--grouped">
                            {items
                              .filter(
                                (item) =>
                                  item &&
                                  item.groupTitle &&
                                  item.groupItems &&
                                  Array.isArray(item.groupItems)
                              )
                              .map((group, groupIdx) => (
                                <div
                                  key={`group-${groupIdx}`}
                                  className="navbar-item__dropdown-column navbar-item__dropdown-column--group"
                                >
                                  <h3 className="navbar-item__dropdown-group-title">
                                    {t(group.groupTitle)}
                                  </h3>
                                  <ul className="navbar-item__dropdown-group-items">
                                    {group.groupItems
                                      .filter(
                                        (subItem) => subItem && subItem.title
                                      )
                                      .map((subItem, itemIdx) => (
                                        <NavbarSubItem
                                          key={`header-menu-${stringTransformToKebabCase(
                                            subItem.title
                                          )}`}
                                          subItem={subItem}
                                          onClick={handleCloseDropdown}
                                          className="navbar-item__dropdown-card"
                                          isTwoItemsLayout={false}
                                          hideIcon
                                          hideDescription
                                        />
                                      ))}
                                  </ul>
                                </div>
                              ))}
                          </div>
                        );
                      } else {
                        // Handle flat structure (other menus)
                        const count = items.length;
                        let left = [],
                          right = [],
                          showSeparator = false;
                        if (count === 8) {
                          left = items.slice(0, 4);
                          right = items.slice(4, 8);
                        } else if (count === 6) {
                          left = items.slice(0, 3);
                          right = items.slice(3, 6);
                        } else if (count === 2) {
                          left = [items[0]];
                          right = [items[1]];
                          showSeparator = true;
                        } else if (count === 5) {
                          left = items.slice(0, 3);
                          right = items.slice(3, 5);
                        } else {
                          // fallback: split evenly
                          const mid = Math.ceil(count / 2);
                          left = items.slice(0, mid);
                          right = items.slice(mid);
                        }
                        if (left.length < right.length) {
                          while (left.length < right.length)
                            left.push({ empty: true });
                        } else if (right.length < left.length) {
                          while (right.length < left.length)
                            right.push({ empty: true });
                        }
                        return (
                          <div
                            className={`navbar-item__dropdown-columns navbar-item__dropdown-columns--grid${
                              showSeparator
                                ? " navbar-item__dropdown-columns--with-separator"
                                : ""
                            }`}
                          >
                            <div className="navbar-item__dropdown-column">
                              {left.map((subItem, idx) =>
                                subItem.empty ? (
                                  <li
                                    className="dropdown-item dropdown-item--empty navbar-item__dropdown-card"
                                    key={`empty-left-${idx}`}
                                  ></li>
                                ) : (
                                  <NavbarSubItem
                                    key={`header-menu-${stringTransformToKebabCase(
                                      subItem.title
                                    )}`}
                                    subItem={subItem}
                                    onClick={handleCloseDropdown}
                                    className="navbar-item__dropdown-card"
                                    isTwoItemsLayout={count === 2}
                                  />
                                )
                              )}
                            </div>
                            {showSeparator && (
                              <div className="navbar-item__dropdown-separator navbar-item__dropdown-separator--column" />
                            )}
                            <div className="navbar-item__dropdown-column">
                              {right.map((subItem, idx) =>
                                subItem.empty ? (
                                  <li
                                    className="dropdown-item dropdown-item--empty navbar-item__dropdown-card"
                                    key={`empty-right-${idx}`}
                                  ></li>
                                ) : (
                                  <NavbarSubItem
                                    key={`header-menu-${stringTransformToKebabCase(
                                      subItem.title
                                    )}`}
                                    subItem={subItem}
                                    onClick={handleCloseDropdown}
                                    className="navbar-item__dropdown-card"
                                    isTwoItemsLayout={count === 2}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        )}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam}
        />
      )}
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};
export default Header;
