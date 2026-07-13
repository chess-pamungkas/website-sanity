import React, { useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { Link } from "gatsby-plugin-react-i18next";
import { buildTradingHubPath } from "../../../helpers/sanity/trading-hub-paths";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../shared/icons/critical";

const TAB_LINK_STATE = { scrollToTradingHubResults: true };
const RESULTS_HASH = "#trading-hub-results";
const TAB_SCROLL_STEP = 220;

const TabArrowIcon = ({ direction = "left" }) => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d={
        direction === "left"
          ? "M6.5 1L1 7L6.5 13"
          : "M1.5 1L7 7L1.5 13"
      }
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TradingHubCategoryMobileDropdown = ({
  categories,
  allTabLabel,
  activeCategorySlug,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const allPath = `${buildTradingHubPath()}${RESULTS_HASH}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeCategory = categories.find(
    (category) => category.slug?.current === activeCategorySlug
  );
  const selectedLabel = activeCategory?.title || allTabLabel;

  const options = [
    {
      id: "all",
      label: allTabLabel,
      path: allPath,
      isActive: !activeCategorySlug,
    },
    ...categories
      .map((category) => {
        const slug = category.slug?.current;
        if (!slug) return null;

        return {
          id: category.id,
          label: category.title,
          path: `${buildTradingHubPath({
            categorySlug: slug,
          })}${RESULTS_HASH}`,
          isActive: activeCategorySlug === slug,
        };
      })
      .filter(Boolean),
  ];

  return (
    <div
      className="platform-selection trading-hub-section__tabs-mobile"
      ref={dropdownRef}
    >
      <div
        className="platform-selection__tabs"
        onClick={(event) => {
          if (!event.target.closest(".platform-selection__tab-dropdown")) {
            setIsOpen((open) => !open);
          }
        }}
      >
        <button
          type="button"
          className="platform-selection__tab platform-selection__tab--active"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {selectedLabel}
          {isOpen ? (
            <ChevronUpIcon
              className="platform-selection__dropdown-icon"
              color="#ffffff"
            />
          ) : (
            <ChevronDownIcon className="platform-selection__dropdown-icon" />
          )}
        </button>

        <div
          className={cn("platform-selection__tab-dropdown", {
            show: isOpen,
          })}
          style={{ display: isOpen ? "block" : "none" }}
          role="listbox"
        >
          {options.map((option) => (
            <Link
              key={option.id}
              to={option.path}
              state={TAB_LINK_STATE}
              role="option"
              aria-selected={option.isActive}
              className="platform-selection__tab-option"
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(false);
              }}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

TradingHubCategoryMobileDropdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.shape({
        current: PropTypes.string,
      }),
    })
  ).isRequired,
  allTabLabel: PropTypes.string.isRequired,
  activeCategorySlug: PropTypes.string,
};

const TradingHubCategoryTabs = ({
  categories,
  allTabLabel,
  activeCategorySlug,
}) => {
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const allPath = `${buildTradingHubPath()}${RESULTS_HASH}`;

  const updateScrollState = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const scrollOffset = Math.abs(el.scrollLeft);

    setHasOverflow(maxScroll > 1);
    setCanScrollLeft(scrollOffset > 1);
    setCanScrollRight(scrollOffset < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return undefined;

    const runUpdate = () => {
      updateScrollState();
    };

    runUpdate();

    const activeTab = el.querySelector(".trading-hub-section__tab--active");
    activeTab?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });

    el.addEventListener("scroll", runUpdate, { passive: true });
    window.addEventListener("resize", runUpdate);

    const resizeObserver = new ResizeObserver(runUpdate);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", runUpdate);
      window.removeEventListener("resize", runUpdate);
      resizeObserver.disconnect();
    };
  }, [categories, activeCategorySlug, hasOverflow, updateScrollState]);

  const scrollTabs = (direction) => {
    tabsRef.current?.scrollBy({
      left: direction * TAB_SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const tabLinks = (
    <>
      <Link
        to={allPath}
        state={TAB_LINK_STATE}
        className={`trading-hub-section__tab${
          !activeCategorySlug ? " trading-hub-section__tab--active" : ""
        }`}
      >
        <span>{allTabLabel}</span>
      </Link>
      {categories.map((category) => {
        const slug = category.slug?.current;
        if (!slug) return null;

        const categoryPath = `${buildTradingHubPath({
          categorySlug: slug,
        })}${RESULTS_HASH}`;

        return (
          <Link
            key={category.id}
            to={categoryPath}
            state={TAB_LINK_STATE}
            className={`trading-hub-section__tab${
              activeCategorySlug === slug
                ? " trading-hub-section__tab--active"
                : ""
            }`}
          >
            <span>{category.title}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <TradingHubCategoryMobileDropdown
        categories={categories}
        allTabLabel={allTabLabel}
        activeCategorySlug={activeCategorySlug}
      />

      <div
        className={cn("trading-hub-section__tabs-wrapper", {
          "trading-hub-section__tabs-wrapper--scrollable": hasOverflow,
        })}
      >
        {hasOverflow ? (
          <button
            type="button"
            className={cn(
              "trading-hub-section__tabs-arrow",
              "trading-hub-section__tabs-arrow--left",
              {
                "trading-hub-section__tabs-arrow--disabled": !canScrollLeft,
              }
            )}
            onClick={() => scrollTabs(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
          >
            <TabArrowIcon direction="left" />
          </button>
        ) : null}

        <nav
          ref={tabsRef}
          className={cn("trading-hub-section__tabs", {
            "trading-hub-section__tabs--overflow": hasOverflow,
          })}
          aria-label="Trading Hub categories"
        >
          {tabLinks}
        </nav>

        {hasOverflow ? (
          <button
            type="button"
            className={cn(
              "trading-hub-section__tabs-arrow",
              "trading-hub-section__tabs-arrow--right",
              {
                "trading-hub-section__tabs-arrow--disabled": !canScrollRight,
              }
            )}
            onClick={() => scrollTabs(1)}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
          >
            <TabArrowIcon direction="right" />
          </button>
        ) : null}
      </div>
    </>
  );
};

TradingHubCategoryTabs.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.shape({
        current: PropTypes.string,
      }),
    })
  ).isRequired,
  allTabLabel: PropTypes.string.isRequired,
  activeCategorySlug: PropTypes.string,
};

export default TradingHubCategoryTabs;
