import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import MenuColumn from "../menu-column";
import { stringTransformToKebabCase } from "../../../../helpers/services/string-service";
import { getMenuItems } from "../../../../helpers/menu.config";

const Menu = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile, isTablet } = useWindowSize();
  const menu = getMenuItems();

  // Process menu items for footer-specific changes
  const processMenuForFooter = (menuItems) => {
    return menuItems.map((item) => {
      if (item.title === "header-nav-tab-top-markets") {
        // For footer, change "Products" to "Top Markets"
        const processedItem = { ...item };
        if (processedItem.subItems) {
          // Move "All Market Overviews" to the bottom
          const allMarketsItem = processedItem.subItems.find(
            (subItem) =>
              subItem.title === "header-nav-tab-top-markets-allmarkets-title"
          );
          const otherItems = processedItem.subItems.filter(
            (subItem) =>
              subItem.title !== "header-nav-tab-top-markets-allmarkets-title"
          );

          processedItem.subItems = [
            ...otherItems,
            ...(allMarketsItem ? [allMarketsItem] : []),
          ];
        }
        return processedItem;
      }

      // Process Trading Hub (Company tab) for footer
      if (item.title === "header-nav-tab-company") {
        const processedItem = { ...item };
        if (processedItem.subItems) {
          // Separate groupTitle items and footerOnly items
          const groupItems = processedItem.subItems.filter(
            (subItem) => subItem.groupTitle && subItem.groupItems
          );
          // Remove footerOnly items from Trading Hub - they will be in separate column
          processedItem.subItems = [...groupItems];
        }
        return processedItem;
      }

      return item;
    });
  };

  // Extract footerOnly items from Company tab BEFORE processing (to create separate column)
  const companyTabOriginal = menu.find(
    (item) => item.title === "header-nav-tab-company"
  );
  const footerOnlyItems =
    companyTabOriginal?.subItems?.filter((subItem) => subItem.footerOnly) || [];

  const processedMenu = processMenuForFooter(menu);

  // For mobile/tablet: Insert footerOnlyItems after Platforms
  // For desktop: Keep footerOnlyItems at the end
  const shouldReorderForMobile = isMobile || isTablet;
  let orderedMenu = [...processedMenu];
  let legalItems = null;

  if (shouldReorderForMobile) {
    // Find Platforms index
    const platformsIndex = orderedMenu.findIndex(
      (item) => item.title === "header-nav-tab-platforms-title"
    );

    if (platformsIndex !== -1 && footerOnlyItems.length > 0) {
      // Create legal items wrapper for mobile/tablet
      legalItems = {
        title: null, // No title for legal items
        subItems: footerOnlyItems,
        isLegalColumn: true,
      };
      // Insert after Platforms (at platformsIndex + 1)
      orderedMenu.splice(platformsIndex + 1, 0, legalItems);
    }
  }

  return (
    <div className={cn("menu", className)}>
      {orderedMenu.length > 0 &&
        orderedMenu.map((item, index) => {
          // Skip Partners section in footer (will be shown in separate column)
          if (item.title === "header-nav-tab-partners-fsa") return null;

          // Handle legal items (Partners, Privacy Policy, Cookie Policy)
          if (item.isLegalColumn) {
            return (
              <div
                key="footer-menu-legal-policies"
                className="menu__wrapper menu__wrapper--legal"
              >
                {/* Empty title for legal column - no title needed */}
                <MenuColumn items={item.subItems || []} />
              </div>
            );
          }

          let translatedTitle = t(item.title);

          // Change "Products" to "Top Markets" only in footer
          if (item.title === "header-nav-tab-top-markets") {
            translatedTitle = t("footer-nav-tab-top-markets");
          }

          return (
            !item.mobileOnly && (
              <div
                key={`footer-menu-${stringTransformToKebabCase(item.title)}`}
                className="menu__wrapper"
              >
                <h3 className="menu__column-title">{translatedTitle}</h3>
                <MenuColumn items={item.subItems || []} />
              </div>
            )
          );
        })}

      {/* Separate column for Partners, Privacy Policy, and Cookie Policy (Desktop only) */}
      {!shouldReorderForMobile && footerOnlyItems.length > 0 && (
        <div
          key="footer-menu-legal-policies"
          className="menu__wrapper menu__wrapper--legal"
        >
          {/* Empty title for legal column - no title needed */}
          <MenuColumn items={footerOnlyItems} />
        </div>
      )}
    </div>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
};
export default Menu;
