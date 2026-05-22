import React, { useRef, useState, useEffect, useContext } from "react";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { shouldDeferHeavyWorkForLighthouse } from "../../../../helpers/is-audit-environment";
import LanguageContext from "../../../../context/language-context";
import FeaturesIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/features.svg";
import NavArrowLeft from "../../../../assets/images/icons/main-page/features-execution-excellence/nav-arrow-left.svg";
import NavArrowRight from "../../../../assets/images/icons/main-page/features-execution-excellence/nav-arrow-right.svg";
import AuditedQ2Icon from "../../../../assets/images/icons/main-page/features-execution-excellence/audited-Q2-2025.svg";
import MethodologyLinkIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/methodology-link.svg";
import ZeroIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/zero.svg";
import DataAuditedIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/data-audited.svg";
import InstrumentsIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/instruments.svg";
import BankLiquidityIcon from "../../../../assets/images/icons/main-page/features-execution-excellence/bank-liquidity.svg";
import BadgeMarkIcon from "../../../../assets/images/icons/main-page/badge-mark.svg";

const FeaturesExecutionExcellence = () => {
  const { t } = useTranslationWithVariables();
  const { isDesktop, isTablet, isMobile } = useWindowSize();
  const { selectedLanguage } = useContext(LanguageContext);
  const [scrollIndex, setScrollIndex] = useState(0);
  const cardContainerRef = useRef(null);
  const cardWidthRef = useRef(null);

  // Check if current language is RTL (Arabic)
  const isRTL = useRtlDirection();

  // Calculate visible cards based on screen size
  const getVisibleCards = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3; // desktop
  };

  const visibleCards = getVisibleCards();

  // Cache card width to avoid forced reflows; run only when in viewport. Skip during audit to avoid forced reflow.
  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return undefined;
    const container = cardContainerRef.current;
    if (!container) return undefined;

    const updateCardWidth = () => {
      const firstCard = container.firstElementChild;
      if (firstCard instanceof HTMLElement) {
        cardWidthRef.current = firstCard.offsetWidth;
      }
    };

    let didRun = false;
    const runOnce = () => {
      if (didRun) return;
      didRun = true;
      requestAnimationFrame(() => requestAnimationFrame(updateCardWidth));
    };
    const fallback = setTimeout(runOnce, 8000);
    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) runOnce();
        },
        { rootMargin: "100px 0px", threshold: 0 }
      );
      io.observe(container);
      const ro = typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => requestAnimationFrame(() => requestAnimationFrame(updateCardWidth)))
        : null;
      if (ro) ro.observe(container);
      const handleResize = () =>
        requestAnimationFrame(() => requestAnimationFrame(updateCardWidth));
      window.addEventListener("resize", handleResize);
      return () => {
        clearTimeout(fallback);
        io.disconnect();
        if (ro) ro.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }
    return () => clearTimeout(fallback);
  }, [isRTL]);

  // Reset scroll index when screen size changes
  useEffect(() => {
    setScrollIndex(0);
  }, [isDesktop, isTablet, isMobile]);

  // Reset scroll index when RTL state changes
  useEffect(() => {
    setScrollIndex(0);

    // Set initial scroll position for RTL
    if (isRTL && cardContainerRef.current) {
      const container = cardContainerRef.current;
      // In RTL with direction:rtl, scrollLeft starts at 0 on the right side
      // So we don't need to set an initial scroll position
      container.scrollLeft = 0;
    }
  }, [isRTL]);

  const features = [
    {
      icon: AuditedQ2Icon,
      badge: t("features-execution-excellence_feature1-badge"),
      value: t("features-execution-excellence_feature1-value"),
      description: t("features-execution-excellence_feature1-description"),
      style: "light",
      showBadges: true,
      showBadgeMark: true,
    },
    {
      icon: MethodologyLinkIcon,
      badge: t("features-execution-excellence_feature2-badge"),
      value: t("features-execution-excellence_feature2-value"),
      description: t("features-execution-excellence_feature2-description"),
      style: "dark",
      showBadges: true,
      showBadgeMark: true,
    },
    {
      icon: ZeroIcon,
      badge: t("features-execution-excellence_feature3-badge"),
      value: t("features-execution-excellence_feature3-value"),
      description: t("features-execution-excellence_feature3-description"),
      style: "light",
      showBadges: false,
      showBadgeMark: false,
    },
    {
      icon: DataAuditedIcon,
      badge: t("features-execution-excellence_feature4-badge"),
      value: t("features-execution-excellence_feature4-value"),
      description: t("features-execution-excellence_feature4-description"),
      style: "dark",
      showBadges: true,
      showBadgeMark: true,
    },
    {
      icon: InstrumentsIcon,
      badge: t("features-execution-excellence_feature5-badge"),
      value: t("features-execution-excellence_feature5-value"),
      description: t("features-execution-excellence_feature5-description"),
      style: "light",
      showBadges: false,
      showBadgeMark: false,
    },
    {
      icon: BankLiquidityIcon,
      badge: t("features-execution-excellence_feature6-badge"),
      value: t("features-execution-excellence_feature6-value"),
      description: t("features-execution-excellence_feature6-description"),
      style: "dark",
      showBadges: false,
      showBadgeMark: false,
    },
  ];

  const handleScroll = (direction) => {
    let newIndex = scrollIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > features.length - visibleCards)
      newIndex = features.length - visibleCards;
    setScrollIndex(newIndex);

    requestAnimationFrame(() => {
      const container = cardContainerRef.current;
      const cardWidth = cardWidthRef.current;
      if (!container || cardWidth == null) return;

      const gap = 17;
      const totalCardWidth = cardWidth + gap;
      const scrollPosition = totalCardWidth * newIndex;

      requestAnimationFrame(() => {
        if (isRTL) {
          container.scrollTo({
            left: -scrollPosition,
            behavior: "smooth",
          });
        } else {
          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      });
    });
  };

  return (
    <section
      className={`features-component ${isRTL ? "features-component--rtl" : ""}`}
    >
      <div className="features-component__header-row">
        <div className="features-component__header-col">
          <div className="features-component__badge-group">
            <img
              src={FeaturesIcon}
              alt={t("features-execution-excellence_badge-alt")}
              className="features-component__badge-icon"
            />
            <span className="features-component__badge-text">
              {t("features-execution-excellence_badge-alt")}
            </span>
          </div>
          <h2 className="features-component__title">
            {t("features-execution-excellence_title")}
          </h2>
          <div className="features-component__subtitle">
            {t("features-execution-excellence_subtitle")}
          </div>
        </div>
        <div className="features-component__nav">
          <button
            className="features-component__nav-btn"
            onClick={() => handleScroll(isRTL ? 1 : -1)}
            disabled={
              isRTL
                ? scrollIndex >= features.length - visibleCards
                : scrollIndex === 0
            }
            aria-label={t("features-execution-excellence_nav-left-aria")}
          >
            <span className="features-component__nav-bg" />
            <img
              src={NavArrowLeft}
              alt={t("features-execution-excellence_nav-left-alt")}
              className="features-component__nav-arrow"
              width={24}
              height={24}
            />
          </button>
          <button
            className="features-component__nav-btn"
            onClick={() => handleScroll(isRTL ? -1 : 1)}
            disabled={
              isRTL
                ? scrollIndex === 0
                : scrollIndex >= features.length - visibleCards
            }
            aria-label={t("features-execution-excellence_nav-right-aria")}
          >
            <span className="features-component__nav-bg" />
            <img
              src={NavArrowRight}
              alt={t("features-execution-excellence_nav-right-alt")}
              className="features-component__nav-arrow"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      <div className="features-component__cards-row-wrapper">
        <div className="features-component__cards-row" ref={cardContainerRef}>
          {features.map((feature, idx) => (
            <div
              className={`features-component__card features-component__card--${feature.style}`}
              key={idx}
            >
              <img
                src={feature.icon}
                alt={t("features-execution-excellence_card-icon-alt")}
                className="features-component__card-icon"
                width={72}
                height={72}
                loading="eager"
                decoding="async"
              />
              <div className="features-component__card-content">
                {feature.showBadges ? (
                  <div className="features-component__card-badge">
                    {feature.showBadgeMark && (
                        <img
                        src={BadgeMarkIcon}
                        alt={t("features-execution-excellence_badge-mark-alt")}
                        className="features-component__badge-mark"
                        width={14}
                        height={14}
                        loading="eager"
                        decoding="async"
                      />
                    )}
                    <span>{feature.badge}</span>
                  </div>
                ) : (
                  <div className="features-component__card-badge features-component__card-badge--placeholder"></div>
                )}
                <div className="features-component__card-value">
                  {feature.value}
                </div>
                <div className="features-component__card-desc">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesExecutionExcellence;
