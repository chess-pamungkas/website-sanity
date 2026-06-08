/**
 * Lazy-loaded dropdown content that uses getMenuItems() (with icon components).
 * This chunk loads only when the user opens a nav dropdown, saving ~24 KiB from the main bundle.
 */
import React from "react";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { stringTransformToKebabCase } from "../../helpers/services/string-service";
import { getMenuItems } from "../../helpers/menu.config";
import NavbarDropdownHighlight from "../shared/navbar-dropdown-highlight";
import NavbarSubItem from "./components/navbar-sub-item";

const HeaderDropdownContent = ({
  openDropdownIndex,
  activeMenuItem,
  handleCloseDropdown,
  handleShowRegistrationPopup,
}) => {
  const { t } = useTranslationWithVariables();
  const menu = getMenuItems();
  // activeMenuItem coming from Header uses getMenuStructure() (iconKey only).
  // Always resolve against getMenuItems() so subItems include mapped icon components.
  const item =
    openDropdownIndex != null
      ? menu[openDropdownIndex]
      : activeMenuItem
      ? menu.find((m) => m?.title === activeMenuItem?.title) ?? null
      : null;

  if (!item || !item.subItems?.length) {
    return null;
  }

  const items = item.subItems.filter((item) => !item.footerOnly);
  const hasGroupedItems = items.some(
    (item) =>
      item?.groupTitle && item?.groupItems && Array.isArray(item.groupItems)
  );

  const highlightAndSeparator = (
    <>
      <NavbarDropdownHighlight
        menuType={item.title}
        onOpenRegistrationPopup={handleShowRegistrationPopup}
      />
      <div className="navbar-item__dropdown-separator" />
    </>
  );

  if (hasGroupedItems) {
    return (
      <>
        {highlightAndSeparator}
        <div className="navbar-item__dropdown-content">
          <div className="navbar-item__dropdown-columns navbar-item__dropdown-columns--grouped">
            {items
              .filter(
                (item) =>
                  item?.groupTitle &&
                  item?.groupItems &&
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
                      .filter((subItem) => subItem?.title)
                      .map((subItem) => (
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
        </div>
      </>
    );
  }

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
    const mid = Math.ceil(count / 2);
    left = items.slice(0, mid);
    right = items.slice(mid);
  }
  while (left.length < right.length) left.push({ empty: true });
  while (right.length < left.length) right.push({ empty: true });

  return (
    <>
      {highlightAndSeparator}
      <div className="navbar-item__dropdown-content">
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
                />
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
                />
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
      </div>
    </>
  );
};

export default HeaderDropdownContent;
