import React, { lazy, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isAuditEnvironment, isTrustpilotForcedOnLocalhost } from "../../../helpers/is-audit-environment";
import Hero from "../../shared/hero";

const loadCryptoBelowHero = () =>
  import(
    /* webpackChunkName: "crypto-below-hero" */
    "./crypto-below-hero"
  );

let cryptoBelowHeroPromise = null;
const preloadCryptoBelowHero = () => {
  if (!cryptoBelowHeroPromise) {
    cryptoBelowHeroPromise = loadCryptoBelowHero();
  }
  return cryptoBelowHeroPromise;
};

const CryptoBelowHero = lazy(() => preloadCryptoBelowHero());

const belowHeroFallback = (
  <div
    className="crypto-page-deferred-fallback"
    aria-busy="true"
    style={{ minHeight: "120px" }}
  />
);

const CryptoContent = ({ className, isShowHero = true }) => {
  const [hydratedBelowHero, setHydratedBelowHero] = useState(false);

  useEffect(() => {
    if (!isAuditEnvironment()) {
      void preloadCryptoBelowHero();
    }
    setHydratedBelowHero(true);
  }, []);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="crypto"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={
          !isAuditEnvironment() || isTrustpilotForcedOnLocalhost()
        }
      />

      {hydratedBelowHero ? (
        <Suspense fallback={belowHeroFallback}>
          <CryptoBelowHero />
        </Suspense>
      ) : (
        belowHeroFallback
      )}
    </>
  );
};

CryptoContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default CryptoContent;
