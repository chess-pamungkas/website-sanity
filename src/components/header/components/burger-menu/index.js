import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  BURGER_MENU_LINES_COUNT,
  GetLoginLink,
  ShowRegistrationPopup,
  HOME_PAGE_LINK,
} from "../../../../helpers/constants";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { stringTransformToKebabCase } from "../../../../helpers/services/string-service";
import ButtonLink from "../../../shared/button-link";
import LangSelect from "../lang-select";
import SearchBar from "../search-bar";
import Accordion from "../../../shared/accordion";
import { getMenuItems } from "../../../../helpers/menu.config";
import InternalLink from "../../../shared/internal-link";
import { LogoTextMain } from "../../../shared/icons";
import { setLangParam } from "../../../../helpers/services/language-service";
import ButtonPopup from "../../../shared/button-popup";
import closeNavbarMobileIcon from "../../../../assets/images/icons/close-navbar-mobile.svg";
import chevronDownIcon from "../../../../assets/images/icons/burger-menu-navbar/chevron-down.svg";
import chevronRightIcon from "../../../../assets/images/icons/burger-menu-navbar/chevron-right.svg";
import CommonContext from "../../../../context/common-context";

const BurgerMenu = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile, isTablet } = useWindowSize();
  const { isScrolled } = useContext(CommonContext);

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const menu = getMenuItems();
  const [selectedNavItem, setSelectedNavItem] = useState(menu[0].title);
  const [isLangPopupOpened, setIsLangPopupOpened] = useState(false);
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  // Mobile navigation accordion state
  const [openSections, setOpenSections] = useState({});

  // Handle Live Chat click to open ConvrsChat
  const handleLiveChatClick = (e, title) => {
    // Check if this is the Live Chat item
    if (title === "header-nav-tab-trading-hub-live-chat-title") {
      e.preventDefault();
      if (typeof window !== "undefined" && window.ConvrsChat) {
        window.ConvrsChat.ShowWebChat();
      }
      onTriggerChange(); // Close the menu
      return true;
    }
    return false;
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      // If the clicked section is already open, close it
      if (prev[section]) {
        return {
          ...prev,
          [section]: false,
        };
      }

      // If the clicked section is closed, open it and close all others
      const newState = {};
      menu.forEach(({ title }) => {
        newState[title] = title === section;
      });
      return newState;
    });
  };

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const onTriggerChange = () => {
    typeof window !== "undefined" && isNavbarOpen
      ? document.body.classList.remove("overflow-hidden")
      : document.body.classList.add("overflow-hidden");

    setIsNavbarOpen(!isNavbarOpen);
  };

  const onSelect = (title) => setSelectedNavItem(title);

  return (
    <div className={cn("burger-menu", className)}>
      <input
        id="bmt"
        type="checkbox"
        checked={isNavbarOpen}
        onChange={() => {}}
        className="burger-menu__cbox"
      />

      <button
        className={cn("burger-menu__trigger", {
          "burger-menu__trigger--open": isNavbarOpen,
        })}
        onClick={onTriggerChange}
      >
        {[...Array(BURGER_MENU_LINES_COUNT)].map((_el, i) => (
          <span
            key={`burger-menu__bar-${i}`}
            className={cn("burger-menu__bar burger-menu__bar--red")}
          />
        ))}
      </button>

      <div
        className={cn("burger-menu__navbar", {
          "burger-menu__navbar--lang-popup-opened": isLangPopupOpened,
          "burger-menu__navbar--header-small":
            isScrolled && (isMobile || isTablet),
        })}
      >
        {/* Mobile Header Section */}
        {(isMobile || isTablet) && (
          <div
            className={cn("burger-menu__mobile-header", {
              "burger-menu__mobile-header--small": isScrolled,
            })}
          >
            <div
              className="container"
              style={{
                height: "100%",
              }}
            >
              <div className="header__main-wrapper">
                <div className="header__left">
                  <InternalLink to={HOME_PAGE_LINK}>
                    <LogoTextMain className="header__logo" />
                  </InternalLink>
                </div>

                <div className="header__center">
                  {/* Center content if needed */}
                </div>

                <div className="header__right">
                  <LangSelect className="lang-select--header" isHeader={true} />
                  <button
                    className="burger-menu__mobile-close"
                    onClick={onTriggerChange}
                  >
                    <img
                      src={closeNavbarMobileIcon}
                      alt="Close"
                      className="close-icon"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Close Button */}
        {!isMobile && !isTablet && (
          <button
            className={cn("burger-menu__trigger", {
              "burger-menu__trigger--open": isNavbarOpen,
            })}
            onClick={onTriggerChange}
          >
            {[...Array(BURGER_MENU_LINES_COUNT)].map((_el, i) => (
              <span
                key={`burger-menu__bar-${i}`}
                className="burger-menu__bar"
              />
            ))}
          </button>
        )}

        {/* Desktop Language Selector */}
        {!isMobile && !isTablet && (
          <LangSelect
            className="burger-menu__lang-select-mobile"
            setIsLangPopupOpened={setIsLangPopupOpened}
          />
        )}

        {/* Mobile Content Section */}
        {isMobile || isTablet ? (
          <div className="burger-menu__mobile-content">
            <div className="burger-menu__mobile-navigation">
              {/* Action Text Section */}
              <div className="mobile-nav-actions">
                <a
                  href={GetLoginLink()}
                  className="mobile-nav-action mobile-nav-signin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("button-sign-in")}
                </a>
                <div
                  className="mobile-nav-action mobile-nav-get-started"
                  onClick={handleShowRegistrationPopup}
                >
                  {t("button-get-started")}
                </div>
              </div>

              {/* Dynamic Menu Sections */}
              {menu.map(({ title, subItems, link, isPartners }) => {
                // If it's a simple link (like Partners) without sub-items, render as a link
                if (!subItems || subItems.length === 0 || isPartners) {
                  return (
                    <div key={title} className="mobile-nav-item">
                      <a
                        href={link}
                        className="mobile-nav-header mobile-nav-link"
                        onClick={() => {
                          // Handle navigation and close menu
                          onTriggerChange();
                        }}
                      >
                        <span className="mobile-nav-title">{t(title)}</span>
                      </a>
                    </div>
                  );
                }

                // If it has sub-items, render as expandable section with chevron
                return (
                  <div key={title} className="mobile-nav-item">
                    <div
                      className="mobile-nav-header"
                      onClick={() => toggleSection(title)}
                    >
                      <span className="mobile-nav-title">{t(title)}</span>
                      <img
                        src={
                          openSections[title]
                            ? chevronDownIcon
                            : chevronRightIcon
                        }
                        alt="Toggle"
                        className="mobile-nav-chevron"
                      />
                    </div>
                    {openSections[title] && subItems && subItems.length > 0 && (
                      <div className="mobile-nav-subitems">
                        {subItems.map((item) => {
                          // Grouped structure (Trading Hub)
                          if (
                            item &&
                            item.groupTitle &&
                            item.groupItems &&
                            Array.isArray(item.groupItems)
                          ) {
                            return (
                              <div
                                key={`mobile-group-${item.groupTitle}`}
                                className="mobile-nav-subgroup"
                              >
                                <div className="mobile-nav-subgroup-title">
                                  {t(item.groupTitle)}
                                </div>
                                {item.groupItems
                                  .filter(
                                    (si) =>
                                      si &&
                                      si.title &&
                                      !si.desktopOnly &&
                                      !si.footerOnly
                                  )
                                  .map(({ link, title: subTitle }) => (
                                    <a
                                      key={`mobile-nav-${subTitle}`}
                                      href={link}
                                      className="mobile-nav-subitem"
                                      onClick={(e) => {
                                        if (!handleLiveChatClick(e, subTitle)) {
                                          onTriggerChange();
                                        }
                                      }}
                                    >
                                      {t(subTitle)}
                                    </a>
                                  ))}
                              </div>
                            );
                          }

                          // Flat items
                          const {
                            link,
                            title: subTitle,
                            desktopOnly,
                            footerOnly,
                          } = item;
                          if (desktopOnly || footerOnly) return null;
                          return (
                            <a
                              key={`mobile-nav-${subTitle}`}
                              href={link}
                              className="mobile-nav-subitem"
                              onClick={(e) => {
                                if (!handleLiveChatClick(e, subTitle)) {
                                  onTriggerChange();
                                }
                              }}
                            >
                              {t(subTitle)}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Desktop Content */
          <ul>
            <li className="burger-menu__item">
              <div className="burger-menu__btns">
                <ButtonPopup
                  className="button-link--header burger-menu__start"
                  onClick={handleShowRegistrationPopup}
                >
                  {t("button-get-started")}
                </ButtonPopup>
                <LangSelect className="burger-menu__lang-select-tablet" />
                <SearchBar
                  isNavbarOpen={isNavbarOpen}
                  onSubmit={onTriggerChange}
                  className="burger-menu__search"
                />
              </div>
            </li>

            <li className="burger-menu__item">
              <ButtonLink
                link={GetLoginLink()}
                className="button-link--blank burger-menu__signin"
              >
                {t("button-sign-in")}
              </ButtonLink>
            </li>

            <li className="burger-menu__item">
              <ul className="burger-menu__navigation">
                {menu.map(({ title, subItems }) => (
                  <li key={title} className="burger-menu__navigation-item">
                    <Accordion
                      key={`burger-menu-${stringTransformToKebabCase(title)}`}
                      className="burger-menu__accordion"
                      title={title}
                      onSelect={onSelect}
                      isOpen={selectedNavItem === title}
                    >
                      {!!subItems && subItems.length > 0 && (
                        <ul className="burger-menu__links">
                          {subItems
                            .filter((item) => {
                              // Include grouped items (Trading Hub)
                              if (
                                item &&
                                item.groupTitle &&
                                item.groupItems &&
                                Array.isArray(item.groupItems)
                              ) {
                                // Check if group has any visible items
                                return item.groupItems.some(
                                  (subItem) =>
                                    subItem &&
                                    subItem.title &&
                                    !subItem.desktopOnly &&
                                    !subItem.footerOnly
                                );
                              }
                              // Filter flat structure items
                              return (
                                item && !item.desktopOnly && !item.footerOnly
                              );
                            })
                            .map((item) => {
                              // Handle grouped structure (Trading Hub) - v2
                              if (
                                item &&
                                item.groupTitle &&
                                item.groupItems &&
                                Array.isArray(item.groupItems)
                              ) {
                                return (
                                  <li
                                    key={`group-${item.groupTitle}`}
                                    className="burger-menu__group-item"
                                  >
                                    <h4 className="burger-menu__group-title">
                                      {t(item.groupTitle)}
                                    </h4>
                                    <ul className="burger-menu__group-links">
                                      {item.groupItems
                                        .filter(
                                          (subItem) =>
                                            subItem &&
                                            subItem.title &&
                                            !subItem.desktopOnly &&
                                            !subItem.footerOnly
                                        )
                                        .map(({ link, title }) => (
                                          <li
                                            key={`burger-menu-${stringTransformToKebabCase(
                                              title
                                            )}`}
                                            className="burger-menu__link-item"
                                          >
                                            <InternalLink
                                              className="burger-menu__link"
                                              to={link}
                                              onClick={(e) => {
                                                if (
                                                  !handleLiveChatClick(e, title)
                                                ) {
                                                  onTriggerChange();
                                                }
                                              }}
                                            >
                                              {t(title)}
                                            </InternalLink>
                                          </li>
                                        ))}
                                    </ul>
                                  </li>
                                );
                              }
                              // Handle flat structure (other menus)
                              const { link, title } = item;
                              return (
                                <li
                                  key={`burger-menu-${stringTransformToKebabCase(
                                    title
                                  )}`}
                                  className="burger-menu__link-item"
                                >
                                  <InternalLink
                                    className="burger-menu__link"
                                    to={link}
                                    onClick={(e) => {
                                      if (!handleLiveChatClick(e, title)) {
                                        onTriggerChange();
                                      }
                                    }}
                                  >
                                    {t(title)}
                                  </InternalLink>
                                </li>
                              );
                            })}
                        </ul>
                      )}
                    </Accordion>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        )}
      </div>
      {/* Render the popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam} // Pass langParam if needed
        />
      )}
    </div>
  );
};

BurgerMenu.propTypes = {
  className: PropTypes.string,
};
export default BurgerMenu;
