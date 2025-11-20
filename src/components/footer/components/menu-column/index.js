import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { stringTransformToKebabCase } from "../../../../helpers/services/string-service";
import InternalLink from "../../../shared/internal-link";

const MenuColumn = ({ className, items }) => {
  const { t } = useTranslationWithVariables();

  return (
    <ul className={cn("menu-column", className)}>
      {Array.isArray(items) &&
        items.map((item) => {
          // Handle groupTitle items (for Trading Hub)
          if (item.groupTitle && item.groupItems) {
            return (
              <li
                key={`footer-menu-group-${stringTransformToKebabCase(
                  item.groupTitle
                )}`}
                className="menu-column__group"
              >
                <div
                  className="menu-column__group-title"
                  role="heading"
                  aria-level={4}
                >
                  {t(item.groupTitle)}
                </div>
                <ul className="menu-column__group-items">
                  {item.groupItems.map((groupItem) => {
                    // Skip items that are desktopOnly
                    if (groupItem.desktopOnly) return null;
                    return (
                      <li
                        key={`footer-menu-${stringTransformToKebabCase(
                          groupItem.title
                        )}`}
                        className="menu-column__item"
                      >
                        <InternalLink
                          className={cn("menu-column__link")}
                          to={groupItem.link}
                        >
                          {t(groupItem.title)}
                        </InternalLink>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          // Handle regular items (skip desktopOnly items)
          if (item.desktopOnly) return null;

          return (
            <li
              className="menu-column__item"
              key={`footer-menu-${stringTransformToKebabCase(item.title)}`}
            >
              <InternalLink className={cn("menu-column__link")} to={item.link}>
                {t(item.title)}
              </InternalLink>
            </li>
          );
        })}
    </ul>
  );
};

MenuColumn.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        desktopOnly: PropTypes.bool,
      }),
      PropTypes.shape({
        groupTitle: PropTypes.string.isRequired,
        groupItems: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            desktopOnly: PropTypes.bool,
          })
        ).isRequired,
      }),
    ])
  ).isRequired,
};

export default MenuColumn;
