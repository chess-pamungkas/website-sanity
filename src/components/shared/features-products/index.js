import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useI18next } from "gatsby-plugin-react-i18next";
import featuresIcon from "../../../assets/images/icons/features.svg";

const FeaturesProducts = ({
  className,
  tradingType, // e.g., "forex", "metals", "shares", etc.
  features = [], // Array of feature objects with icon, title, description
}) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const { navigate, language } = useI18next();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Handle mouse drag for mobile sliding (refs avoid forced reflow from reading layout in same frame as React updates)
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startPageX: 0, startScrollLeft: 0 });

  const handleMouseDown = (e) => {
    if (!isMobile) return;
    const slider = sliderRef.current;
    if (!slider) return;
    setIsDragging(true);
    requestAnimationFrame(() => {
      dragStartRef.current = {
        startPageX: e.pageX,
        startScrollLeft: slider.scrollLeft,
      };
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isMobile) return;
    e.preventDefault();
    const slider = sliderRef.current;
    if (!slider) return;
    const { startPageX, startScrollLeft } = dragStartRef.current;
    const walk = (e.pageX - startPageX) * 2;
    slider.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (!isMobile) return;
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (!isMobile) return;
    setIsDragging(false);
  };

  const nextSlide = () => {
    if (!isMobile) return;
    const maxSlides = features.length - 1;
    setCurrentSlide(currentSlide === maxSlides ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    if (!isMobile) return;
    const maxSlides = features.length - 1;
    setCurrentSlide(currentSlide === 0 ? maxSlides : currentSlide - 1);
  };

  // Function to process description HTML and add language prefix to internal links
  // This ensures the href attribute shows the correct URL with language prefix on hover
  const processDescriptionHtml = (htmlString) => {
    if (!htmlString || typeof window === "undefined") return htmlString;

    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Find all anchor tags
    const links = tempDiv.querySelectorAll("a");
    links.forEach((link) => {
      const originalHref = link.getAttribute("href");
      // Only process internal links (not external URLs, mailto, or hash anchors)
      if (
        originalHref &&
        !originalHref.startsWith("http") &&
        !originalHref.startsWith("mailto:") &&
        !originalHref.startsWith("#")
      ) {
        // Check if link is not already prefixed to avoid double prefixing
        const languagePrefix = `/${language}/`;
        if (!originalHref.startsWith(languagePrefix)) {
          // Normalize href: ensure it starts with / and remove any trailing slash
          let normalizedHref = originalHref.startsWith("/")
            ? originalHref
            : `/${originalHref}`;
          // Remove trailing slash if present (we'll add it back after language prefix)
          normalizedHref = normalizedHref.replace(/\/$/, "");
          // Remove leading slash to combine with language prefix
          normalizedHref = normalizedHref.replace(/^\//, "");
          // Set href with language prefix (e.g., /id/company)
          link.setAttribute("href", `/${language}/${normalizedHref}`);
        }
      }
    });

    return tempDiv.innerHTML;
  };

  // Handle clicks on links within descriptions to preserve language prefix
  // navigate from useI18next automatically adds language prefix (e.g., /my/company)
  const handleDescriptionClick = (e) => {
    const link = e.target.closest("a");
    if (link && link.href) {
      const href = link.getAttribute("href");
      // Only intercept internal links (not external URLs)
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("#")
      ) {
        e.preventDefault();
        // Extract base path from potentially prefixed href
        // If href is already prefixed (e.g., /id/company), extract base path
        const languagePrefix = `/${language}/`;
        let basePath;
        if (href.startsWith(languagePrefix)) {
          // Remove language prefix, keep leading slash
          basePath = `/${href.substring(languagePrefix.length)}`;
        } else if (href.startsWith("/")) {
          basePath = href;
        } else {
          basePath = `/${href}`;
        }
        // navigate from useI18next automatically preserves language prefix
        navigate(basePath);
      }
    }
  };

  return (
    <section
      className={cn("features-products", className, {
        "features-products--rtl": isRTL,
      })}
    >
      {/* <div className="container"> */}
      {/* Header Section */}
      <div className="features-products__header">
        <div className="features-products__badge">
          <img
            src={featuresIcon}
            alt={t("features-products_badge-icon-alt")}
            className="features-products__badge-icon"
            width={24}
            height={24}
          />
          <span className="features-products__badge-text">
            {t(`features-products_${tradingType}_badge-text`)}
          </span>
        </div>

        <h2 className="features-products__title">
          {t(`features-products_${tradingType}_title`)}
        </h2>

        <p className="features-products__subtitle">
          {t(`features-products_${tradingType}_subtitle`)}
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-products__grid">
        {isMobile ? (
          // Mobile: Single row with sliding
          <div
            className="features-products__slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {features.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className={cn("features-products__card", {
                  "features-products__card--active": index === currentSlide,
                })}
              >
                <div className="features-products__card-icon">
                  <img src={feature.icon} alt={feature.title} width={64} height={64} />
                </div>
                <h3 className="features-products__card-title">
                  {t(feature.title)}
                </h3>
                <p
                  className="features-products__card-description"
                  dangerouslySetInnerHTML={{
                    __html: processDescriptionHtml(t(feature.description)),
                  }}
                  onClick={handleDescriptionClick}
                />
              </div>
            ))}
          </div>
        ) : (
          // Desktop: 3x2 grid
          <div className="features-products__grid-container">
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="features-products__card">
                <div className="features-products__card-icon">
                  <img src={feature.icon} alt={feature.title} width={64} height={64} />
                </div>
                <h3 className="features-products__card-title">
                  {t(feature.title)}
                </h3>
                <p
                  className="features-products__card-description"
                  dangerouslySetInnerHTML={{
                    __html: processDescriptionHtml(t(feature.description)),
                  }}
                  onClick={handleDescriptionClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* </div> */}
    </section>
  );
};

FeaturesProducts.propTypes = {
  className: PropTypes.string,
  tradingType: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeaturesProducts;
