import React, { lazy, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  isAuditEnvironment,
  isTrustpilotForcedOnLocalhost,
} from "../../../helpers/is-audit-environment";
import Hero from "../../shared/hero";

const loadForexBelowHero = () =>
  import(
    /* webpackChunkName: "forex-below-hero" */
    "./forex-below-hero"
  );

let forexBelowHeroPromise = null;
const preloadForexBelowHero = () => {
  if (!forexBelowHeroPromise) {
    forexBelowHeroPromise = loadForexBelowHero();
  }
  return forexBelowHeroPromise;
};

const ForexBelowHero = lazy(() => preloadForexBelowHero());

const belowHeroFallback = (
  <div
    className="forex-page-deferred-fallback"
    aria-busy="true"
    style={{ minHeight: "120px" }}
  />
);

const ForexContent = ({ className, isShowHero = true }) => {
  const [hydratedBelowHero, setHydratedBelowHero] = useState(false);

  useEffect(() => {
    if (!isAuditEnvironment()) {
      void preloadForexBelowHero();
    }
    setHydratedBelowHero(true);
  }, []);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="forex"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={
          !isAuditEnvironment() || isTrustpilotForcedOnLocalhost()
        }
      />

      {hydratedBelowHero ? (
        <Suspense fallback={belowHeroFallback}>
          <ForexBelowHero />
        </Suspense>
      ) : (
        belowHeroFallback
      )}
    </>
  );
};

ForexContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default ForexContent;
