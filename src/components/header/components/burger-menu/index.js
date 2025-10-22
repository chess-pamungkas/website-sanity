import React, { useState, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  BURGER_MENU_LINES_COUNT,
  GetLoginLink,
  ShowRegistrationPopup,
} from "../../../../helpers/constants";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { stringTransformToKebabCase } from "../../../../helpers/services/string-service";
import ButtonLink from "../../../shared/button-link";
import LangSelect from "../lang-select";
import SearchBar from "../search-bar";
import Accordion from "../../../shared/accordion";
import { getMenuItems } from "../../../../helpers/menu.config";
import InternalLink from "../../../shared/internal-link";
import { setLangParam } from "../../../../helpers/services/language-service";
import ButtonPopup from "../../../shared/button-popup";

const BurgerMenu = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const menu = getMenuItems();
  const [selectedNavItem, setSelectedNavItem] = useState(menu[0].title);
  const [isLangPopupOpened, setIsLangPopupOpened] = useState(false);
  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  // Toggle livechat visibility when burger menu opens/closes
  const toggleLivechat = (isMenuOpen) => {
    try {
      const livechatElements = document.querySelectorAll(
        '[id*="convrs"], [class*="convrs"]'
      );
      livechatElements.forEach((el) => {
        if (el && el.style) {
          if (isMenuOpen) {
            // Hide livechat when burger menu is open
            el.style.setProperty("display", "none", "important");
            el.style.setProperty("visibility", "hidden", "important");
            el.style.setProperty("pointer-events", "none", "important");
            el.setAttribute("data-burger-menu-hidden", "true");
          } else {
            // Show livechat when burger menu is closed
            el.style.removeProperty("display");
            el.style.removeProperty("visibility");
            el.style.removeProperty("pointer-events");
            el.removeAttribute("data-burger-menu-hidden");
          }
        }
      });
    } catch (error) {
      console.warn("Error toggling livechat:", error);
    }
  };

  const onTriggerChange = () => {
    const newNavbarState = !isNavbarOpen;

    if (typeof window !== "undefined") {
      if (newNavbarState) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    }

    // Toggle livechat visibility
    toggleLivechat(newNavbarState);

    setIsNavbarOpen(newNavbarState);
  };

  // Effect to handle livechat when burger menu state changes
  useEffect(() => {
    toggleLivechat(isNavbarOpen);
  }, [isNavbarOpen]);

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
        })}
      >
        <button
          className={cn("burger-menu__trigger", {
            "burger-menu__trigger--open": isNavbarOpen,
          })}
          onClick={onTriggerChange}
        >
          {[...Array(BURGER_MENU_LINES_COUNT)].map((_el, i) => (
            <span key={`burger-menu__bar-${i}`} className="burger-menu__bar" />
          ))}
        </button>

        {isMobile && (
          <LangSelect
            className="burger-menu__lang-select-mobile"
            setIsLangPopupOpened={setIsLangPopupOpened}
          />
        )}

        <ul>
          <li className="burger-menu__item">
            <div className="burger-menu__btns">
              {!isMobile && (
                <>
                  <ButtonPopup
                    className="button-link--header burger-menu__start"
                    onClick={handleShowRegistrationPopup}
                  >
                    {t("button-get-started")}
                  </ButtonPopup>
                  <LangSelect className="burger-menu__lang-select-tablet" />
                </>
              )}

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

            {isMobile && (
              <ButtonPopup
                className="button-link--blank burger-menu__start--tablet"
                onClick={handleShowRegistrationPopup}
              >
                {t("button-get-started")}
              </ButtonPopup>
            )}
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
                    {!!subItems.length && (
                      <ul className="burger-menu__links">
                        {subItems.map(
                          ({ link, title, desktopOnly, footerOnly }) =>
                            !desktopOnly &&
                            !footerOnly && (
                              <li
                                key={`burger-menu-${stringTransformToKebabCase(
                                  title
                                )}`}
                                className="burger-menu__link-item"
                              >
                                <InternalLink
                                  className="burger-menu__link"
                                  to={link}
                                  onClick={onTriggerChange}
                                >
                                  {t(title)}
                                </InternalLink>
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </Accordion>
                </li>
              ))}
            </ul>
          </li>
        </ul>
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
