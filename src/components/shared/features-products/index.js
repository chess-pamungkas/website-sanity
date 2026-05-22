import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { useI18next } from "gatsby-plugin-react-i18next";
import featuresIcon from "../../../assets/images/icons/features.svg";

const FeaturesProducts = ({
  className,
  tradingType,
  features = [],
}) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const { navigate, language } = useI18next();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

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

  const processDescriptionHtml = (htmlString) => {
    if (!htmlString || typeof window === "undefined") return htmlString;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const links = tempDiv.querySelectorAll("a");
    links.forEach((link) => {
      const originalHref = link.getAttribute("href");
      if (
        originalHref &&
        !originalHref.startsWith("http") &&
        !originalHref.startsWith("mailto:") &&
        !originalHref.startsWith("#")
      ) {
        const languagePrefix = `/${language}/`;
        if (!originalHref.startsWith(languagePrefix)) {
          let normalizedHref = originalHref.startsWith("/")
            ? originalHref
            : `/${originalHref}`;
          normalizedHref = normalizedHref.replace(/\/$/, "");
          normalizedHref = normalizedHref.replace(/^\//, "");
          link.setAttribute("href", `/${language}/${normalizedHref}`);
        }
      }
    });

    return tempDiv.innerHTML;
  };

  const handleDescriptionClick = (e) => {
    const link = e.target.closest("a");
    if (link && link.href) {
      const href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("#")
      ) {
        e.preventDefault();
        const languagePrefix = `/${language}/`;
        let basePath;
        if (href.startsWith(languagePrefix)) {
          basePath = `/${href.substring(languagePrefix.length)}`;
        } else if (href.startsWith("/")) {
          basePath = href;
        } else {
          basePath = `/${href}`;
        }
        navigate(basePath);
      }
    }
  };

  const renderFeatureCard = (feature, index, { mobileSlide = false } = {}) => (
    <div
      key={`${mobileSlide ? "mobile" : "desktop"}-${index}`}
      className={cn("features-products__card", {
        "features-products__card--active":
          mobileSlide && index === currentSlide,
      })}
    >
      <div className="features-products__card-icon">
        <img src={feature.icon} alt={feature.title} width={64} height={64} />
      </div>
      <h3 className="features-products__card-title">{t(feature.title)}</h3>
      <p
        className="features-products__card-description"
        dangerouslySetInnerHTML={{
          __html: processDescriptionHtml(t(feature.description)),
        }}
        onClick={handleDescriptionClick}
      />
    </div>
  );

  return (
    <section
      className={cn("features-products", className, {
        "features-products--rtl": isRTL,
      })}
    >
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

      <div className="features-products__grid">
        {isMobile ? (
          <div
            className="features-products__slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {features.map((feature, index) =>
              renderFeatureCard(feature, index, { mobileSlide: true })
            )}
          </div>
        ) : (
          <div className="features-products__grid-container">
            {features.map((feature, index) =>
              renderFeatureCard(feature, index)
            )}
          </div>
        )}
      </div>
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
