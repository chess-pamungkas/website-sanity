import React, {
  useContext,
  useState,
  useRef,
  lazy,
  Suspense,
  useEffect,
  startTransition,
} from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useLocation } from "@reach/router";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { LogoTextMain, ChevronDownIcon } from "../shared/icons/critical";
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
import { getMenuStructure } from "../../helpers/menu-structure.config";
import NotificationsContainer from "../shared/notification-stripe";

const HeaderDropdownContent = lazy(() =>
  import("./HeaderDropdownContent").then((m) => ({ default: m.default }))
);
import { GDPRPopup } from "../gdpr-popup";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import CommonContext from "../../context/common-context";
import InternalLink from "../shared/internal-link";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { useLangParam } from "../../helpers/services/language-service";
import LangSelect from "./components/lang-select";
import PartnersNavIcon from "../shared/icons/PartnersNavIcon";

const Header = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const menu = getMenuStructure();
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
  const location = useLocation();
  const isHomepage =
    location?.pathname === "/" ||
    /^\/[a-z]{2}\/?$/.test(location?.pathname || "");
  const [showSigninCTA] = useState(true);

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

  useEffect(() => {
    if (isDesktop) {
      import("./HeaderDropdownContent");
    }
  }, [isDesktop]);

  const isDropdownOpen =
    openDropdownIndex !== null &&
    isDesktop &&
    activeMenuItem &&
    !!activeMenuItem.subItems?.length;

  return (
    <div
      className={cn("header-wrapper", {
        "header-wrapper--dropdown-open": isDropdownOpen,
      })}
      ref={headerRef}
    >
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
              {/* Defer lang selector on homepage (desktop + mobile) so LCP = hero, not EN flag img */}
              {showSigninCTA && (
                <LangSelect className="lang-select--header" isHeader={true} />
              )}
              {isDesktop && showSigninCTA && (
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
      {isDropdownOpen && (
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

            {/* Dropdown content inside the same card (lazy: NavbarDropdownHighlight + menu icons load only when dropdown opens) */}
            <div className="dropdown-content">
              <div className="navbar-item__dropdown navbar-item__dropdown--visible">
                <div className="navbar-item__dropdown-flex">
                  <Suspense fallback={null}>
                    <HeaderDropdownContent
                      openDropdownIndex={openDropdownIndex}
                      activeMenuItem={activeMenuItem}
                      handleCloseDropdown={handleCloseDropdown}
                      handleShowRegistrationPopup={handleShowRegistrationPopup}
                    />
                  </Suspense>
                </div>
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
