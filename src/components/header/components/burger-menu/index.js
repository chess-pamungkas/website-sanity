import React, { useState, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  BURGER_MENU_LINES_COUNT,
  GetLoginLink,
  ShowRegistrationPopup,
  HOME_PAGE_LINK,
  WINDOW_SIZE_LG,
} from "../../../../helpers/constants";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { stringTransformToKebabCase } from "../../../../helpers/services/string-service";
import ButtonLink from "../../../shared/button-link";
import LangSelect from "../lang-select";
import SearchBar from "../search-bar";
import Accordion from "../../../shared/accordion";
import { getMenuStructure } from "../../../../helpers/menu-structure.config";
import InternalLink from "../../../shared/internal-link";
import { LogoTextMain } from "../../../shared/icons/critical";
import { useLangParam } from "../../../../helpers/services/language-service";
import ButtonPopup from "../../../shared/button-popup";
import closeNavbarMobileIcon from "../../../../assets/images/icons/close-navbar-mobile.svg";
import chevronDownIcon from "../../../../assets/images/icons/burger-menu-navbar/chevron-down.svg";
import chevronRightIcon from "../../../../assets/images/icons/burger-menu-navbar/chevron-right.svg";
const BurgerMenu = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile, isTablet, width } = useWindowSize();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const menu = getMenuStructure();
  const [selectedNavItem, setSelectedNavItem] = useState(menu[0].title);
  const [isLangPopupOpened, setIsLangPopupOpened] = useState(false);
  const langParam = useLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  // Mobile navigation accordion state
  const [openSections, setOpenSections] = useState({});

  // Handle Live Chat click: load Convrs only then (no global interaction), then open
  const handleLiveChatClick = (e, title) => {
    if (title === "header-nav-tab-trading-hub-live-chat-title") {
      e.preventDefault();
      if (typeof window !== "undefined") {
        if (typeof window.loadConvrsWebchatAndOpen === "function") {
          window.loadConvrsWebchatAndOpen();
        } else if (window.ConvrsChat) {
          window.ConvrsChat.ShowWebChat();
        }
      }
      onTriggerChange();
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
    setIsNavbarOpen((open) => !open);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !isNavbarOpen) {
      return undefined;
    }

    if (window.innerWidth >= WINDOW_SIZE_LG) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const { body } = document;

    body.classList.add("overflow-hidden");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.classList.remove("overflow-hidden");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isNavbarOpen]);

  const onSelect = (title) => setSelectedNavItem(title);

  const isMobileNav =
    width !== undefined
      ? isMobile || isTablet
      : typeof window !== "undefined" && window.innerWidth < WINDOW_SIZE_LG;

  return (
    <div className={cn("burger-menu", className)}>
      <input
        id="bmt"
        type="checkbox"
        checked={isNavbarOpen}
        onChange={() => {}}
        className="burger-menu__cbox"
        aria-label="Toggle navigation menu"
      />

      <button
        type="button"
        className={cn("burger-menu__trigger", {
          "burger-menu__trigger--open": isNavbarOpen,
        })}
        onClick={onTriggerChange}
        aria-label={isNavbarOpen ? "Close menu" : "Open menu"}
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
          "burger-menu__navbar--open": isNavbarOpen,
          "burger-menu__navbar--lang-popup-opened": isLangPopupOpened,
        })}
      >
        {isMobileNav ? (
          <>
            <div className="burger-menu__mobile-header">
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

                  <div className="header__center" />

                  <div className="header__right">
                    <LangSelect
                      className="lang-select--header"
                      isHeader={true}
                    />
                    <button
                      type="button"
                      className="burger-menu__mobile-close"
                      onClick={onTriggerChange}
                      aria-label="Close menu"
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

            <div className="burger-menu__mobile-content">
              <div className="burger-menu__mobile-navigation">
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

                {menu.map(({ title, subItems, link, isPartners }) => {
                  if (!subItems || subItems.length === 0 || isPartners) {
                    return (
                      <div key={title} className="mobile-nav-item">
                        <InternalLink
                          to={link}
                          className="mobile-nav-header mobile-nav-link"
                          onClick={() => onTriggerChange()}
                        >
                          <span className="mobile-nav-title">{t(title)}</span>
                        </InternalLink>
                      </div>
                    );
                  }

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
                                    .map(({ link: subLink, title: subTitle }) => (
                                      <InternalLink
                                        key={`mobile-nav-${subTitle}`}
                                        to={subLink}
                                        className="mobile-nav-subitem"
                                        onClick={(e) => {
                                          if (!handleLiveChatClick(e, subTitle)) {
                                            onTriggerChange();
                                          }
                                        }}
                                      >
                                        {t(subTitle)}
                                      </InternalLink>
                                    ))}
                                </div>
                              );
                            }

                            const {
                              link: subLink,
                              title: subTitle,
                              desktopOnly,
                              footerOnly,
                            } = item;
                            if (desktopOnly || footerOnly) return null;
                            return (
                              <InternalLink
                                key={`mobile-nav-${subTitle}`}
                                to={subLink}
                                className="mobile-nav-subitem"
                                onClick={(e) => {
                                  if (!handleLiveChatClick(e, subTitle)) {
                                    onTriggerChange();
                                  }
                                }}
                              >
                                {t(subTitle)}
                              </InternalLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className={cn("burger-menu__trigger", {
                "burger-menu__trigger--open": isNavbarOpen,
              })}
              onClick={onTriggerChange}
              aria-label={isNavbarOpen ? "Close menu" : "Open menu"}
            >
              {[...Array(BURGER_MENU_LINES_COUNT)].map((_el, i) => (
                <span
                  key={`burger-menu__bar-${i}`}
                  className="burger-menu__bar"
                />
              ))}
            </button>

            <LangSelect
              className="burger-menu__lang-select-mobile"
              setIsLangPopupOpened={setIsLangPopupOpened}
            />

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
                                if (
                                  item &&
                                  item.groupTitle &&
                                  item.groupItems &&
                                  Array.isArray(item.groupItems)
                                ) {
                                  return item.groupItems.some(
                                    (subItem) =>
                                      subItem &&
                                      subItem.title &&
                                      !subItem.desktopOnly &&
                                      !subItem.footerOnly
                                  );
                                }
                                return (
                                  item && !item.desktopOnly && !item.footerOnly
                                );
                              })
                              .map((item) => {
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
                                          .map(({ link, title: itemTitle }) => (
                                            <li
                                              key={`burger-menu-${stringTransformToKebabCase(
                                                itemTitle
                                              )}`}
                                              className="burger-menu__link-item"
                                            >
                                              <InternalLink
                                                className="burger-menu__link"
                                                to={link}
                                                onClick={(e) => {
                                                  if (
                                                    !handleLiveChatClick(
                                                      e,
                                                      itemTitle
                                                    )
                                                  ) {
                                                    onTriggerChange();
                                                  }
                                                }}
                                              >
                                                {t(itemTitle)}
                                              </InternalLink>
                                            </li>
                                          ))}
                                      </ul>
                                    </li>
                                  );
                                }
                                const { link, title: itemTitle } = item;
                                return (
                                  <li
                                    key={`burger-menu-${stringTransformToKebabCase(
                                      itemTitle
                                    )}`}
                                    className="burger-menu__link-item"
                                  >
                                    <InternalLink
                                      className="burger-menu__link"
                                      to={link}
                                      onClick={(e) => {
                                        if (
                                          !handleLiveChatClick(e, itemTitle)
                                        ) {
                                          onTriggerChange();
                                        }
                                      }}
                                    >
                                      {t(itemTitle)}
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
          </>
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
