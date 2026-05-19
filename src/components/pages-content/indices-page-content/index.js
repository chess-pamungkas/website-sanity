import React, { lazy, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  isAuditEnvironment,
  isTrustpilotForcedOnLocalhost,
} from "../../../helpers/is-audit-environment";
import Hero from "../../shared/hero";

const loadIndicesBelowHero = () =>
  import(
    /* webpackChunkName: "indices-below-hero" */
    "./indices-below-hero"
  );

let indicesBelowHeroPromise = null;
const preloadIndicesBelowHero = () => {
  if (!indicesBelowHeroPromise) {
    indicesBelowHeroPromise = loadIndicesBelowHero();
  }
  return indicesBelowHeroPromise;
};

const IndicesBelowHero = lazy(() => preloadIndicesBelowHero());

const belowHeroFallback = (
  <div
    className="indices-page-deferred-fallback"
    aria-busy="true"
    style={{ minHeight: "120px" }}
  />
);

const IndicesContent = ({ className, isShowHero = true }) => {
  /** Avoid React 18 lazy+Suspense SSR/hydration mismatch (#422) next to Hero sibling. */
  const [hydratedBelowHero, setHydratedBelowHero] = useState(false);

  useEffect(() => {
    if (!isAuditEnvironment()) {
      void preloadIndicesBelowHero();
    }
    setHydratedBelowHero(true);
  }, []);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="indices"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={
          !isAuditEnvironment() || isTrustpilotForcedOnLocalhost()
        }
      />

      {hydratedBelowHero ? (
        <Suspense fallback={belowHeroFallback}>
          <IndicesBelowHero />
        </Suspense>
      ) : (
        belowHeroFallback
      )}
    </>
  );
};

IndicesContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default IndicesContent;
