import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useI18next } from "gatsby-plugin-react-i18next";
import Hero from "../../shared/hero";
import { useRegistrationPopup } from "../../../context/registration-popup-context";
import { sanityImageUrl } from "../../../helpers/sanity/sanity-image-url";

const TradingHubHero = ({
  badge,
  title,
  subtitle,
  ctaLabel,
  ctaUrl,
  heroImageDesktop,
  heroImageMobile,
}) => {
  const { navigate } = useI18next();
  const { open: openRegistrationPopup } = useRegistrationPopup();

  const desktopBackground = useMemo(
    () => sanityImageUrl(heroImageDesktop, { width: 1440 }) || undefined,
    [heroImageDesktop]
  );
  const mobileBackground = useMemo(
    () =>
      sanityImageUrl(heroImageMobile || heroImageDesktop, { width: 800 }) ||
      desktopBackground,
    [heroImageMobile, heroImageDesktop, desktopBackground]
  );

  const handlePrimaryClick = useCallback(() => {
    if (ctaUrl) {
      if (/^https?:\/\//i.test(ctaUrl)) {
        window.location.assign(ctaUrl);
        return;
      }
      navigate(ctaUrl);
      return;
    }
    openRegistrationPopup();
  }, [ctaUrl, navigate, openRegistrationPopup]);

  return (
    <Hero
      heroType="trading-hub"
      useCmsCopy
      customBadgeText={badge || undefined}
      customTitle={title || undefined}
      customSubtitle={subtitle || undefined}
      customPrimaryButtonText={ctaLabel || undefined}
      desktopBackground={desktopBackground}
      mobileBackground={mobileBackground}
      showWarning={false}
      showHandImage={false}
      showHeroImage={false}
      showTrustPilot={false}
      onPrimaryButtonClick={handlePrimaryClick}
    />
  );
};

TradingHubHero.propTypes = {
  badge: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  ctaLabel: PropTypes.string,
  ctaUrl: PropTypes.string,
  heroImageDesktop: PropTypes.object,
  heroImageMobile: PropTypes.object,
};

export default TradingHubHero;
