import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import subNavBadgeIcon from "../../../assets/images/icons/sub-nav.svg";
import { setLangParam } from "../../../helpers/services/language-service";

const NavbarDropdownHighlight = ({
  className,
  menuType = "platforms", // "products", "trading", "platforms", "more"
  onOpenRegistrationPopup,
}) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const langParam = setLangParam();

  // Dynamic content based on menu type
  const getMenuContent = (type) => {
    // Map translation keys to menu types
    const translationKeyMap = {
      "header-nav-tab-top-markets": "products",
      "header-nav-tab-trading": "trading",
      "header-nav-tab-platforms-title": "platforms",
      "header-nav-tab-company": "more",
      "header-nav-tab-partners-fsa": "more",
    };

    // Get the actual menu type from translation key
    const actualMenuType = translationKeyMap[type] || type;

    const contentMap = {
      products: {
        badgeText: t("navbar-dropdown-highlight_products_badge-text"),
        title: t("navbar-dropdown-highlight_products_title"),
        subtitle: t("navbar-dropdown-highlight_products_subtitle"),
        primaryButton: {
          text: t("navbar-dropdown-highlight_products_primary-button"),
        },
        secondaryButton: {
          text: t("navbar-dropdown-highlight_products_secondary-button"),
        },
      },
      trading: {
        badgeText: t("navbar-dropdown-highlight_trading_badge-text"),
        title: t("navbar-dropdown-highlight_trading_title"),
        subtitle: t("navbar-dropdown-highlight_trading_subtitle"),
        primaryButton: {
          text: t("navbar-dropdown-highlight_trading_primary-button"),
        },
        secondaryButton: {
          text: t("navbar-dropdown-highlight_trading_secondary-button"),
        },
      },
      platforms: {
        badgeText: t("navbar-dropdown-highlight_platforms_badge-text"),
        title: t("navbar-dropdown-highlight_platforms_title"),
        subtitle: t("navbar-dropdown-highlight_platforms_subtitle"),
        primaryButton: {
          text: t("navbar-dropdown-highlight_platforms_primary-button"),
        },
        secondaryButton: {
          text: t("navbar-dropdown-highlight_platforms_secondary-button"),
        },
      },
      more: {
        badgeText: t("navbar-dropdown-highlight_more_badge-text"),
        title: t("navbar-dropdown-highlight_more_title"),
        subtitle: t("navbar-dropdown-highlight_products_subtitle"),
        primaryButton: {
          text: t("navbar-dropdown-highlight_more_primary-button"),
        },
        secondaryButton: {
          text: t("navbar-dropdown-highlight_more_secondary-button"),
        },
      },
    };

    return contentMap[actualMenuType] || contentMap.platforms;
  };

  const content = getMenuContent(menuType);

  return (
    <div
      className={cn(
        "navbar-dropdown-highlight",
        isRTL && "navbar-dropdown-highlight--rtl",
        className
      )}
    >
      <div className="navbar-dropdown-highlight__inner">
        <div className="navbar-dropdown-highlight__badge">
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <img
              src={subNavBadgeIcon}
              alt={t("navbar-dropdown-highlight_badge-icon-alt")}
              className="navbar-dropdown-highlight__badge-icon"
              width={24}
              height={24}
            />
          </span>
          <span
            className="navbar-dropdown-highlight__badge-text"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {content.badgeText}
          </span>
        </div>
        <div className="navbar-dropdown-highlight__content-block">
          <div className="navbar-dropdown-highlight__title">
            {content.title}
          </div>
          <div className="navbar-dropdown-highlight__subtitle">
            {content.subtitle}
          </div>
          <div className="navbar-dropdown-highlight__button-group">
            {content.primaryButton && content.primaryButton.text && (
              <button
                type="button"
                data-popup-trigger="true"
                className="navbar-dropdown-highlight__button navbar-dropdown-highlight__button--primary"
                onMouseDown={(e) => {
                  if (e.button !== 0) return; // Only left click
                  e.stopPropagation();
                  e.preventDefault();
                  window.__OQTIMA_REGISTRATION_POPUP_PENDING__ = true;
                  setTimeout(() => {
                    if (onOpenRegistrationPopup)
                      onOpenRegistrationPopup(langParam);
                    window.__OQTIMA_REGISTRATION_POPUP_PENDING__ = false;
                  }, 10);
                }}
              >
                <span className="navbar-dropdown-highlight__button-text">
                  {t(content.primaryButton.text)}
                </span>
                <span
                  className="navbar-dropdown-highlight__button-arrow"
                  style={
                    isRTL
                      ? {
                          transform: "scaleX(-1) !important",
                          WebkitTransform: "scaleX(-1) !important",
                          MozTransform: "scaleX(-1) !important",
                          msTransform: "scaleX(-1) !important",
                        }
                      : {}
                  }
                >
                  <svg
                    width="9.33"
                    height="9.33"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={
                      isRTL
                        ? {
                            transform: "scaleX(-1) !important",
                            WebkitTransform: "scaleX(-1) !important",
                            MozTransform: "scaleX(-1) !important",
                            msTransform: "scaleX(-1) !important",
                          }
                        : {}
                    }
                    ref={(el) => {
                      if (el && isRTL) {
                        el.style.setProperty(
                          "transform",
                          "scaleX(-1)",
                          "important"
                        );
                        el.style.setProperty(
                          "-webkit-transform",
                          "scaleX(-1)",
                          "important"
                        );
                        el.style.setProperty(
                          "-moz-transform",
                          "scaleX(-1)",
                          "important"
                        );
                        el.style.setProperty(
                          "-ms-transform",
                          "scaleX(-1)",
                          "important"
                        );
                      }
                    }}
                  >
                    <path
                      d={
                        isRTL
                          ? "M10.3333 5.50004H1M1 5.50004L5.66667 0.833374M1 5.50004L5.66667 10.1667"
                          : "M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
                      }
                      stroke="white"
                      strokeWidth="1.3333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            )}
            {content.secondaryButton && content.secondaryButton.text && (
              <button
                type="button"
                data-popup-trigger="true"
                className="navbar-dropdown-highlight__button navbar-dropdown-highlight__button--secondary"
                onMouseDown={(e) => {
                  if (e.button !== 0) return; // Only left click
                  e.stopPropagation();
                  e.preventDefault();
                  window.__OQTIMA_REGISTRATION_POPUP_PENDING__ = true;
                  setTimeout(() => {
                    if (onOpenRegistrationPopup)
                      onOpenRegistrationPopup(langParam);
                    window.__OQTIMA_REGISTRATION_POPUP_PENDING__ = false;
                  }, 10);
                }}
              >
                <span className="navbar-dropdown-highlight__button-text">
                  {t(content.secondaryButton.text)}
                </span>
                <span
                  className="navbar-dropdown-highlight__button-arrow"
                  style={
                    isRTL
                      ? {
                          transform: "scaleX(-1) !important",
                          WebkitTransform: "scaleX(-1) !important",
                          MozTransform: "scaleX(-1) !important",
                          msTransform: "scaleX(-1) !important",
                        }
                      : {}
                  }
                >
                  <svg
                    width="9.33"
                    height="9.33"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={
                      isRTL
                        ? {
                            transform: "scaleX(-1) !important",
                            WebkitTransform: "scaleX(-1) !important",
                            MozTransform: "scaleX(-1) !important",
                            msTransform: "scaleX(-1) !important",
                          }
                        : {}
                    }
                    ref={(el) => {
                      if (el && isRTL) {
                        el.style.setProperty(
                          "transform",
                          "scaleX(-1)",
                          "important"
                        );
                        el.style.setProperty(
                          "-webkit-transform",
                          "scaleX(-1)",
                          "important"
                        );
                        el.style.setProperty(
                          "-moz-transform",
                          "scaleX(-1)",
                          "important"
                        );
                        el.style.setProperty(
                          "-ms-transform",
                          "scaleX(-1)",
                          "important"
                        );
                      }
                    }}
                  >
                    <path
                      d={
                        isRTL
                          ? "M10.3333 5.50004H1M1 5.50004L5.66667 0.833374M1 5.50004L5.66667 10.1667"
                          : "M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
                      }
                      stroke="currentColor"
                      strokeWidth="1.3333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NavbarDropdownHighlight.propTypes = {
  className: PropTypes.string,
  menuType: PropTypes.string,
  onOpenRegistrationPopup: PropTypes.func,
};

export default NavbarDropdownHighlight;
