import React, { lazy, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  isAuditEnvironment,
  isTrustpilotForcedOnLocalhost,
} from "../../../helpers/is-audit-environment";
import Hero from "../../shared/hero";

const loadMetalsBelowHero = () =>
  import(
    /* webpackChunkName: "metals-below-hero" */
    "./metals-below-hero"
  );

let metalsBelowHeroPromise = null;
const preloadMetalsBelowHero = () => {
  if (!metalsBelowHeroPromise) {
    metalsBelowHeroPromise = loadMetalsBelowHero();
  }
  return metalsBelowHeroPromise;
};

const MetalsBelowHero = lazy(() => preloadMetalsBelowHero());

const belowHeroFallback = (
  <div
    className="metals-page-deferred-fallback"
    aria-busy="true"
    style={{ minHeight: "120px" }}
  />
);

const MetalsContent = ({ className, isShowHero = true }) => {
  const [hydratedBelowHero, setHydratedBelowHero] = useState(false);

  useEffect(() => {
    if (!isAuditEnvironment()) {
      void preloadMetalsBelowHero();
    }
    setHydratedBelowHero(true);
  }, []);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="metals"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={
          !isAuditEnvironment() || isTrustpilotForcedOnLocalhost()
        }
      />

      {hydratedBelowHero ? (
        <Suspense fallback={belowHeroFallback}>
          <MetalsBelowHero />
        </Suspense>
      ) : (
        belowHeroFallback
      )}
    </>
  );
};

MetalsContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default MetalsContent;
