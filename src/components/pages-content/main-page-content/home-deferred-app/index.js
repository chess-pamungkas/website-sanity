import React, { lazy, Suspense, useRef } from "react";
import PropTypes from "prop-types";
import ContainerWrapper from "../../../shared/container-wrapper";
import WhenInView from "../../../shared/when-in-view";

// Above-the-fold (ticker + first content block): eager-import so they're in this chunk once
// HomeDeferredApp mounts (after index.js loads the lazy chunk — see pages/index.js).
import TradingTicker from "../../../trading-ticker";
import TestimonialsSecurityContent from "../testimonials-security-content";
import FeaturesExecutionExcellence from "../features-excecution-excellence-content";

// Below-the-fold stays lazy + WhenInView until near viewport.
const AccountComparison = lazy(() => import("../../../shared/account-comparison"));
const CostCalculatorContent = lazy(() => import("../cost-calculator-content"));
const TechnologyInfrastructureContent = lazy(() =>
  import("../technology-infrastructure-content")
);
const MarketSentimentContent = lazy(() => import("../../../market-sentiment"));
const TrustContent = lazy(() => import("../trust-content"));
const FeaturesSectionContent = lazy(() => import("../../../features-section"));
const GuideContent = lazy(() => import("../../../shared/guide-content"));
const OurCommunityContent = lazy(() => import("../../../shared/our-community"));

/** Stagger IO attach; empty wrappers need observeMinHeight or they never intersect. */
const WIV_MOBILE = [0, 24, 48, 72, 96];
const WIV_DESKTOP = [0, 48, 96, 144, 192];
/** Reserve space while lazy chunks load so IO can fire before children mount. */
const BELOW_FOLD_OBSERVE_MIN_HEIGHT_PX = 520;

const HomeDeferredApp = ({ isMobile }) => {
  const firstBlockPlaceholderRef = useRef(null);
  const wivDelays = isMobile ? WIV_MOBILE : WIV_DESKTOP;

  return (
    <>
      <TradingTicker />
      <div
        className="below-hero-first-block-wrapper"
        ref={firstBlockPlaceholderRef}
      >
        <ContainerWrapper>
          <FeaturesExecutionExcellence />
          <TestimonialsSecurityContent />
        </ContainerWrapper>
      </div>

      <WhenInView
        rootMargin="200px 0px"
        delayMs={wivDelays[0]}
        observeMinHeight={BELOW_FOLD_OBSERVE_MIN_HEIGHT_PX}
      >
        <Suspense fallback={null}>
          <AccountComparison />
        </Suspense>
      </WhenInView>
      <WhenInView
        rootMargin="200px 0px"
        delayMs={wivDelays[1]}
        observeMinHeight={BELOW_FOLD_OBSERVE_MIN_HEIGHT_PX}
      >
        <ContainerWrapper>
          <Suspense fallback={null}>
            <CostCalculatorContent />
            <TechnologyInfrastructureContent />
          </Suspense>
        </ContainerWrapper>
      </WhenInView>
      <WhenInView
        rootMargin="200px 0px"
        delayMs={wivDelays[2]}
        observeMinHeight={BELOW_FOLD_OBSERVE_MIN_HEIGHT_PX}
      >
        <Suspense fallback={null}>
          <MarketSentimentContent />
        </Suspense>
      </WhenInView>
      <WhenInView
        rootMargin="200px 0px"
        delayMs={wivDelays[3]}
        observeMinHeight={BELOW_FOLD_OBSERVE_MIN_HEIGHT_PX}
      >
        <ContainerWrapper>
          <Suspense fallback={null}>
            <TrustContent />
            <FeaturesSectionContent />
            <GuideContent
              titleKey="main-guide-title"
              subtitleKey="main-guide-subtitle"
            />
          </Suspense>
        </ContainerWrapper>
      </WhenInView>
      <WhenInView
        rootMargin="200px 0px"
        delayMs={wivDelays[4]}
        observeMinHeight={BELOW_FOLD_OBSERVE_MIN_HEIGHT_PX}
      >
        {isMobile ? (
          <Suspense fallback={null}>
            <OurCommunityContent />
          </Suspense>
        ) : (
          <ContainerWrapper className="homepage-our-community-shell">
            <Suspense fallback={null}>
              <OurCommunityContent />
            </Suspense>
          </ContainerWrapper>
        )}
      </WhenInView>
    </>
  );
};

HomeDeferredApp.propTypes = {
  isMobile: PropTypes.bool,
};

export default HomeDeferredApp;
