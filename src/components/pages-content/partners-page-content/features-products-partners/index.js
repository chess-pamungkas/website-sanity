import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import featuresIcon from "../../../../assets/images/icons/features.svg";
import bgFeaturesPartnersDesktop from "../../../../assets/images/bg/partners/bg-features-partners-desktop.svg";
import bgFeaturesPartnersMobile from "../../../../assets/images/bg/partners/bg-features-partners-mobile.svg";
import bgCardFeaturesPartnersDesktop from "../../../../assets/images/bg/partners/bg-card-features-partners-desktop.svg";
import bgCardFeaturesPartnersMobile from "../../../../assets/images/bg/partners/bg-card-features-partners-mobile.svg";

const FeaturesProductsPartners = ({
  className,
  tradingType, // e.g., "forex", "metals", "shares", etc.
  features = [], // Array of feature objects with icon, title, description
}) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Handle mouse drag for mobile sliding
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isMobile) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
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

  // Get background images based on device
  const backgroundSrc = isMobile
    ? bgFeaturesPartnersMobile
    : bgFeaturesPartnersDesktop;
  const cardBackgroundSrc = isMobile
    ? bgCardFeaturesPartnersMobile
    : bgCardFeaturesPartnersDesktop;

  return (
    <section className={cn("features-products", className)}>
      {/* Background Image */}
      <div className="features-products-bg">
        <img
          src={backgroundSrc}
          alt={t("features-products-partners_background-alt")}
          className="features-products-bg__image"
        />
      </div>

      {/* Content Container */}
      <div className="features-products container">
        {/* Header Section */}
        <div className="features-products__header">
          <div className="features-products__badge">
            <img
              src={featuresIcon}
              alt={t("features-products-partners_badge-alt")}
              className="features-products__badge-icon"
            />
            <span className="features-products__badge-text">
              {t(`features-products_${tradingType}_badge-text`)}
            </span>
          </div>

          <h2 className="features-products__title">
            {t(`features-products_${tradingType}_title`)}
          </h2>
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
                  style={{
                    backgroundImage: `url(${cardBackgroundSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="features-products__card-icon">
                    <img src={feature.icon} alt={feature.title} />
                  </div>
                  <h3 className="features-products__card-title">
                    {t(feature.title)}
                  </h3>
                  <p
                    className="features-products__card-description"
                    dangerouslySetInnerHTML={{ __html: t(feature.description) }}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Desktop: 3x2 grid
            <div className="features-products__grid-container">
              {features.map((feature, index) => (
                <div
                  key={`feature-${index}`}
                  className="features-products__card"
                  style={{
                    backgroundImage: `url(${cardBackgroundSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="features-products__card-icon">
                    <img src={feature.icon} alt={feature.title} />
                  </div>
                  <h3 className="features-products__card-title">
                    {t(feature.title)}
                  </h3>
                  <p
                    className="features-products__card-description"
                    dangerouslySetInnerHTML={{ __html: t(feature.description) }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

FeaturesProductsPartners.propTypes = {
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

export default FeaturesProductsPartners;
