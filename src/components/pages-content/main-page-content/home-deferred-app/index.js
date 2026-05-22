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

/** WhenInView: minimal stagger on mobile so lazy chunks attach quickly when scrolling. */
const WIV_MOBILE = [0, 24, 48, 72, 96];

const HomeDeferredApp = ({ isMobile }) => {
  const firstBlockPlaceholderRef = useRef(null);

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

      <WhenInView rootMargin="200px 0px" delayMs={isMobile ? WIV_MOBILE[0] : 1800}>
        <Suspense fallback={null}>
          <AccountComparison />
        </Suspense>
      </WhenInView>
      <WhenInView rootMargin="200px 0px" delayMs={isMobile ? WIV_MOBILE[1] : 2200}>
        <ContainerWrapper>
          <Suspense fallback={null}>
            <CostCalculatorContent />
            <TechnologyInfrastructureContent />
          </Suspense>
        </ContainerWrapper>
      </WhenInView>
      <WhenInView rootMargin="200px 0px" delayMs={isMobile ? WIV_MOBILE[2] : 2600}>
        <Suspense fallback={null}>
          <MarketSentimentContent />
        </Suspense>
      </WhenInView>
      <WhenInView rootMargin="200px 0px" delayMs={isMobile ? WIV_MOBILE[3] : 3000}>
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
      <WhenInView rootMargin="200px 0px" delayMs={isMobile ? WIV_MOBILE[4] : 3400}>
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
