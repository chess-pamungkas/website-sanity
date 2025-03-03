import React, { useContext, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { LogoTextMain, LogoWhite } from "../shared/icons";
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
import { getCornerItems, getMenuItems } from "../../helpers/menu.config";
import NotificationsContainer from "../shared/notification-stripe";
import { GDPRPopup } from "../gdpr-popup";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import CommonContext from "../../context/common-context";
import InternalLink from "../shared/internal-link";
import CornerPanel from "./components/corner-panel";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { setLangParam } from "../../helpers/services/language-service";

const Header = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const menu = getMenuItems();
  const isRTL = useRtlDirection();
  const { isDesktop, isTablet, isMobile } = useWindowSize();

  // console.log("isDesktop", isDesktop);
  // console.log("isTablet", isTablet);

  const {
    headerRef,
    headerMainWrapperRef,
    setSectionOptions,
    isSearchBarAttached,
    isScrolled,
  } = useContext(CommonContext);
  const langParam = setLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={cn("header-wrapper", className)} ref={headerRef}>
      <NotificationsContainer setSectionOptions={setSectionOptions} />
      <GDPRPopup />
      <header
        className={cn(
          "header",
          className,
          {
            "header--rtl": isRTL,
          },
          { "header--small": isScrolled && isDesktop },
          { "header--big": !isScrolled && isDesktop }
        )}
        dir={isRTL ? DIR_RTL : DIR_LTR}
      >
        {isDesktop && <CornerPanel items={getCornerItems()} />}
        <div
          className="container"
          style={!isMobile ? { paddingLeft: "0" } : undefined}
        >
          <div className="header__main-wrapper" ref={headerMainWrapperRef}>
            <div className="header__left">
              <InternalLink to={HOME_PAGE_LINK}>
                {/* Desktop only, where header transition */}
                {isDesktop &&
                  (isScrolled ? (
                    <LogoTextMain className="header__logo" />
                  ) : (
                    <LogoWhite className="header__logo" />
                  ))}

                {/* Mobile and Table only, where no header transition */}
                {isTablet && <LogoTextMain className="header__logo" />}
              </InternalLink>
            </div>

            <div className="header__center">
              <ul className="header__navigation">
                {menu.map(
                  ({ title, subItems, mobileOnly }) =>
                    !mobileOnly && (
                      <NavbarItem
                        key={`header-menu-${stringTransformToKebabCase(title)}`}
                        title={title}
                        subItems={subItems}
                      />
                    )
                )}
              </ul>
            </div>

            <div className="header__right">
              <BurgerMenu />

              <div className="header__controls">
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
            </div>
          </div>
        </div>

        {isSearchBarAttached && (
          <div className="header__search">
            <div className="container">
              <div
                className={cn("header__search-wrapper", {
                  "header__search--small": isScrolled,
                })}
              >
                <SearchBar isExpandable={true} />
              </div>
            </div>
          </div>
        )}
      </header>

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
