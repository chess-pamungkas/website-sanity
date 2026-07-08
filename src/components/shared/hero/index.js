import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRegistrationPopup } from "../../../context/registration-popup-context";
import { MarketingContext } from "../../../context/marketing-context";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import LanguageContext from "../../../context/language-context";
import { HeroButtons, ButtonPrimaryHero } from "../reusable-buttons";
import FaqSearchBar from "../../help-center/faq-search-bar";
import { useI18next } from "gatsby-plugin-react-i18next";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../../../helpers/viewport-media";
import { whenAppStylesReady } from "../../../helpers/when-app-styles-ready";

/** Split Trustpilot + bootstrap out of the main hero chunk so lab/CPU parses less during TBT window. */
const TrustPilot = lazy(() => import("../trust-pilot"));
// Using static folder path for WebP - responsive srcset so mobile fetches only mobile assets
const globeImageDesktop = "/images/globe.webp";
const globeImageMobile = "/images/globe-mobile.webp";
const handImageDesktop = "/images/hand.webp";
const handImageMobile = "/images/hand-mobile.webp";
/**
 * WebP + SVG fallbacks under /static/images/bg/hero/<slug>/ — LCP must be real <img>s.
 * Desktop artboards are 1440×583; mobile SVGs/WebPs are 393×953 (`width`/`viewBox` on each *-mobile.svg).
 */
const HERO_LCP_DIM = {
  desktop: { width: 1440, height: 583 },
  mobile: { width: 393, height: 953 },
};

const HERO_LCP_BY_TYPE = {
  "all-markets": {
    mobileWebp: "/images/bg/hero/all-markets/all-markets-mobile.webp",
    desktopWebp: "/images/bg/hero/all-markets/all-markets-desktop.webp",
    mobileSvg: "/images/bg/hero/all-markets/all-markets-mobile.svg",
    desktopSvg: "/images/bg/hero/all-markets/all-markets-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  forex: {
    mobileWebp: "/images/bg/hero/forex/forex-mobile.webp",
    desktopWebp: "/images/bg/hero/forex/forex-desktop.webp",
    mobileSvg: "/images/bg/hero/forex/forex-mobile.svg",
    desktopSvg: "/images/bg/hero/forex/forex-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  metals: {
    mobileWebp: "/images/bg/hero/metals/metals-mobile.webp",
    desktopWebp: "/images/bg/hero/metals/metals-desktop.webp",
    mobileSvg: "/images/bg/hero/metals/metals-mobile.svg",
    desktopSvg: "/images/bg/hero/metals/metals-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  crypto: {
    mobileWebp: "/images/bg/hero/crypto/crypto-mobile.webp",
    desktopWebp: "/images/bg/hero/crypto/crypto-desktop.webp",
    mobileSvg: "/images/bg/hero/crypto/crypto-mobile.svg",
    desktopSvg: "/images/bg/hero/crypto/crypto-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  indices: {
    mobileWebp: "/images/bg/hero/indices/indices-mobile.webp",
    desktopWebp: "/images/bg/hero/indices/indices-desktop.webp",
    mobileSvg: "/images/bg/hero/indices/indices-mobile.svg",
    desktopSvg: "/images/bg/hero/indices/indices-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  shares: {
    mobileWebp: "/images/bg/hero/shares/shares-mobile.webp",
    desktopWebp: "/images/bg/hero/shares/shares-desktop.webp",
    mobileSvg: "/images/bg/hero/shares/shares-mobile.svg",
    desktopSvg: "/images/bg/hero/shares/shares-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  energies: {
    mobileWebp: "/images/bg/hero/energies/energies-mobile.webp",
    desktopWebp: "/images/bg/hero/energies/energies-desktop.webp",
    mobileSvg: "/images/bg/hero/energies/energies-mobile.svg",
    desktopSvg: "/images/bg/hero/energies/energies-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  etf: {
    mobileWebp: "/images/bg/hero/etf/etf-mobile.webp",
    desktopWebp: "/images/bg/hero/etf/etf-desktop.webp",
    mobileSvg: "/images/bg/hero/etf/etf-mobile.svg",
    desktopSvg: "/images/bg/hero/etf/etf-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  "account-types": {
    mobileWebp: "/images/bg/hero/accounts-type/accounts-type-mobile.webp",
    desktopWebp: "/images/bg/hero/accounts-type/accounts-type-desktop.webp",
    mobileSvg: "/images/bg/hero/accounts-type/accounts-type-mobile.svg",
    desktopSvg: "/images/bg/hero/accounts-type/accounts-type-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  "funding-withdrawals": {
    mobileWebp:
      "/images/bg/hero/funding-withdrawals/funding-withdrawals-mobile.webp",
    desktopWebp:
      "/images/bg/hero/funding-withdrawals/funding-withdrawals-desktop.webp",
    mobileSvg:
      "/images/bg/hero/funding-withdrawals/funding-withdrawals-mobile.svg",
    desktopSvg:
      "/images/bg/hero/funding-withdrawals/funding-withdrawals-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  "spreads-fees": {
    mobileWebp: "/images/bg/hero/spreads-fees/spreads-fees-mobile.webp",
    desktopWebp: "/images/bg/hero/spreads-fees/spreads-fees-desktop.webp",
    mobileSvg: "/images/bg/hero/spreads-fees/spreads-fees-mobile.svg",
    desktopSvg: "/images/bg/hero/spreads-fees/spreads-fees-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  /* WebP preferred (gen:trading-hero-webp); SVG fallbacks + huge mobile SVG avoided on desktop LCP */
  "trading-tools": {
    mobileWebp: "/images/bg/hero/trading-tools/trading-tools-mobile.webp",
    desktopWebp: "/images/bg/hero/trading-tools/trading-tools-desktop.webp",
    mobileSvg: "/images/bg/hero/trading-tools/trading-tools-mobile.svg",
    desktopSvg: "/images/bg/hero/trading-tools/trading-tools-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  vps: {
    mobileWebp: "/images/bg/hero/vps/vps-mobile.webp",
    desktopWebp: "/images/bg/hero/vps/vps-desktop.webp",
    mobileSvg: "/images/bg/hero/vps/vps-mobile.svg",
    desktopSvg: "/images/bg/hero/vps/vps-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  "swap-free": {
    mobileWebp: "/images/bg/hero/swap-free/swap-free-mobile.webp",
    desktopWebp: "/images/bg/hero/swap-free/swap-free-desktop.webp",
    mobileSvg: "/images/bg/hero/swap-free/swap-free-mobile.svg",
    desktopSvg: "/images/bg/hero/swap-free/swap-free-desktop.svg",
    dimensions: {
      desktop: { width: 1400, height: 583 },
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  mt4: {
    mobileWebp: "/images/bg/hero/mt4/mt4-mobile.webp",
    desktopWebp: "/images/bg/hero/mt4/mt4-desktop.webp",
    mobileSvg: "/images/bg/hero/mt4/mt4-mobile.svg",
    desktopSvg: "/images/bg/hero/mt4/mt4-desktop.svg",
    dimensions: {
      desktop: { width: 1400, height: 583 },
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  mt5: {
    mobileWebp: "/images/bg/hero/mt5/mt5-mobile.webp",
    desktopWebp: "/images/bg/hero/mt5/mt5-desktop.webp",
    mobileSvg: "/images/bg/hero/mt5/mt5-mobile.svg",
    desktopSvg: "/images/bg/hero/mt5/mt5-desktop.svg",
    dimensions: {
      desktop: { width: 1400, height: 583 },
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  "faq-hero": {
    mobileWebp: "/images/bg/hero/faq/faq-mobile.webp",
    desktopWebp: "/images/bg/hero/faq/faq-desktop.webp",
    mobileSvg: "/images/bg/hero/faq/faq-mobile.svg",
    desktopSvg: "/images/bg/hero/faq/faq-desktop.svg",
    dimensions: {
      desktop: { width: 1400, height: 480 },
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  legal: {
    mobileWebp: "/images/bg/hero/legal/legal-mobile.webp",
    desktopWebp: "/images/bg/hero/legal/legal-desktop.webp",
    mobileSvg: "/images/bg/hero/legal/legal-mobile.svg",
    desktopSvg: "/images/bg/hero/legal/legal-desktop.svg",
    dimensions: {
      desktop: { width: 1400, height: 510 },
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  "contact-us": {
    mobileWebp: "/images/bg/hero/contact-us/contact-us-mobile.webp",
    desktopWebp: "/images/bg/hero/contact-us/contact-us-desktop.webp",
    mobileSvg: "/images/bg/hero/contact-us/contact-us-mobile.svg",
    desktopSvg: "/images/bg/hero/contact-us/contact-us-desktop.svg",
    dimensions: {
      desktop: { width: 1400, height: 510 },
      mobile: HERO_LCP_DIM.mobile,
    },
  },
  partners: {
    mobileWebp: "/images/bg/hero/partners/partners-mobile.webp",
    desktopWebp: "/images/bg/hero/partners/partners-desktop.webp",
    mobileSvg: "/images/bg/hero/partners/partners-mobile.svg",
    desktopSvg: "/images/bg/hero/partners/partners-desktop.svg",
    dimensions: {
      desktop: HERO_LCP_DIM.desktop,
      mobile: HERO_LCP_DIM.mobile,
    },
  },
};

const Hero = ({
  className,
  isShowHero = true,
  // Custom props for different hero types
  heroType = "main-promotion", // main-promotion, all-markets, forex, metals
  customBadgeText,
  customTitle,
  customSubtitle,
  customPrimaryButtonText,
  customSecondaryButtonText,
  customWarningText,
  showWarning = true,
  showHandImage = true,
  showHeroImage = true,
  showTrustPilot = true,
  // Background images
  desktopBackground,
  mobileBackground,
  // Custom styling
  customClassNames = {},
  // FAQ specific props
  setSearchResults,
  setNoSearchResult,
}) => {
  const { t } = useTranslationWithVariables({
    deferUntilBelowHeroReady: heroType === "main-promotion",
  });
  const { selectedLanguage } = useContext(LanguageContext);
  const { content, sect1 } = useContext(MarketingContext);
  const isRTL = useRtlDirection();
  const { open: openRegistrationPopup } = useRegistrationPopup();
  const { navigate } = useI18next();
  /** Avoid React 18 lazy+Suspense SSR/hydration mismatch (#422) for Trustpilot next to hero markup. */
  const [trustPilotClientReady, setTrustPilotClientReady] = useState(false);
  useEffect(() => {
    return whenAppStylesReady(() => setTrustPilotClientReady(true), 5800);
  }, []);
  // Use responsive images (srcset + sizes) so mobile viewport fetches only mobile assets.
  // Default src is mobile for LCP on mobile; browser picks from srcSet by viewport.
  const globeSrcSet = `${globeImageMobile} 500w, ${globeImageDesktop} 734w`;
  const handSrcSet = `${handImageMobile} 280w, ${handImageDesktop} 450w`;

  const handleShowRegistrationPopup = () => {
    openRegistrationPopup();
  };

  const handlePrimaryButtonClick = () => {
    // For MT4 and MT5, scroll to platform section instead of opening popup
    if (heroType === "mt4" || heroType === "mt5") {
      const platformSection = document.getElementById(
        "mt-advantage-list__platform-section"
      );
      if (platformSection) {
        platformSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (heroType === "contact-us") {
      // For contact-us, scroll to the form section
      const contactFormSection = document.getElementById(
        "contact-us__form-section"
      );
      if (contactFormSection) {
        contactFormSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (heroType === "legal") {
      // For contact-us, scroll to the form section
      const contactFormSection = document.getElementById("legalDocuments");
      if (contactFormSection) {
        contactFormSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      handleShowRegistrationPopup();
    }
  };

  const handleSecondaryButtonClick = () => {
    // For partners, redirect to contact-us page
    // Use navigate from useI18next to preserve language prefix in browser history
    if (heroType === "partners") {
      navigate("/contact-us");
    } else {
      handleShowRegistrationPopup();
    }
  };

  // Get translation keys based on hero type
  const getTranslationKeys = () => {
    switch (heroType) {
      case "all-markets":
        return {
          badge: customBadgeText || "all-markets_badge-text",
          title: customTitle || "all-markets_all-markets-title",
          subtitle: customSubtitle || "all-markets_all-markets-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "crypto":
        return {
          badge: customBadgeText || "crypto_badge-text",
          title: customTitle || "crypto_crypto-title",
          subtitle: customSubtitle || "crypto_crypto-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "indices":
        return {
          badge: customBadgeText || "indices_badge-text",
          title: customTitle || "indices_indices-title",
          subtitle: customSubtitle || "indices_indices-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "forex":
        return {
          badge: customBadgeText || "forex_badge-text",
          title: customTitle || "forex_forex-title",
          subtitle: customSubtitle || "forex_forex-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "metals":
        return {
          badge: customBadgeText || "metals_badge-text",
          title: customTitle || "metals_metals-title",
          subtitle: customSubtitle || "metals_metals-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "shares":
        return {
          badge: customBadgeText || "shares_badge-text",
          title: customTitle || "shares_shares-title",
          subtitle: customSubtitle || "shares_shares-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "energies":
        return {
          badge: customBadgeText || "energies_badge-text",
          title: customTitle || "energies_energies-title",
          subtitle: customSubtitle || "energies_energies-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "etf":
        return {
          badge: customBadgeText || "etf_badge-text",
          title: customTitle || "etf_etf-title",
          subtitle: customSubtitle || "etf_etf-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "account-types":
        return {
          badge: customBadgeText || "accounts-type_badge-text",
          title: customTitle || "accounts-type_accounts-type-title",
          subtitle: customSubtitle || "accounts-type_accounts-type-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "funding-withdrawals":
        return {
          badge: customBadgeText || "funding-withdrawals_badge-text",
          title: customTitle || "funding-withdrawals_funding-withdrawals-title",
          subtitle:
            customSubtitle || "funding-withdrawals_funding-withdrawals-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "spreads-fees":
        return {
          badge: customBadgeText || "spreads-fees_badge-text",
          title: customTitle || "spreads-fees_spreads-fees-title",
          subtitle: customSubtitle || "spreads-fees_spreads-fees-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "trading-tools":
        return {
          badge: customBadgeText || "trading-tools_badge-text",
          title: customTitle || "trading-tools_trading-tools-title",
          subtitle: customSubtitle || "trading-tools_trading-tools-text",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "vps":
        return {
          badge: customBadgeText || "vps_badge-text",
          title: customTitle || "vps_vps-title",
          subtitle: customSubtitle || "vps_vps-text",
          primaryButton: customPrimaryButtonText || "button-register-now",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "swap-free":
        return {
          badge: customBadgeText || "swap-free_badge-text",
          title: customTitle || "swap-free_swap-free-title",
          subtitle: customSubtitle || "swap-free_swap-free-text",
          primaryButton: customPrimaryButtonText || "button-apply-now",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "mt4":
        return {
          badge: customBadgeText || "mt4_badge-text",
          title: customTitle || "mt4_mt4-title",
          subtitle: customSubtitle || "mt4_mt4-text",
          primaryButton: customPrimaryButtonText || "btn-download-mt4",
          secondaryButton: null, // Hide secondary button for MT4
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "mt5":
        return {
          badge: customBadgeText || "mt5_badge-text",
          title: customTitle || "mt5_mt5-title",
          subtitle: customSubtitle || "mt5_mt5-text",
          primaryButton: customPrimaryButtonText || "btn-download-mt5",
          secondaryButton: null, // Hide secondary button for MT5
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "company":
        return {
          badge: customBadgeText || "company_badge-text",
          title: customTitle || "company_company-title",
          subtitle: customSubtitle || "company_company-text",
          primaryButton: null, // Hide primary button for company
          secondaryButton: null, // Hide secondary button for company
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "partners":
        return {
          badge: customBadgeText || "partners_badge-text",
          title: customTitle || "partners_partners-title",
          subtitle: customSubtitle || "partners_partners-text",
          primaryButton: customPrimaryButtonText || "partners_button-apply-now",
          secondaryButton:
            customSecondaryButtonText || "partners_button-contact-us",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "contact-us":
        return {
          badge: customBadgeText || "contact-us_badge-text",
          title: customTitle || "contact-us_contact-us-title",
          subtitle: customSubtitle || "contact-us_contact-us-text",
          primaryButton:
            customPrimaryButtonText || "contact-us_button-apply-now",
          secondaryButton:
            customSecondaryButtonText || "contact-us_button-contact-us",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "legal":
        return {
          badge: customBadgeText || "legal_badge-text",
          title: customTitle || "legal_legal-title",
          subtitle: customSubtitle || "legal_legal-text",
          primaryButton: customPrimaryButtonText || "legal_button-download",
          secondaryButton: null, // Hide secondary button for Legal
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "faq-hero":
        return {
          badge: customBadgeText || "faq_badge-text",
          title: customTitle || "faq_faq-title",
          subtitle: customSubtitle || "faq_faq-text",
          primaryButton: null, // Hide primary button for FAQ
          secondaryButton: null, // Hide secondary button for FAQ
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
      case "system-info":
        return {
          badge: customBadgeText || "system-info_badge-text",
          title: customTitle || "",
          subtitle: customSubtitle || "",
          primaryButton: customPrimaryButtonText || "",
        };
      case "client-portal-assistance":
        return {
          badge: customBadgeText || "client-portal-assistance_badge-text",
          title:
            customTitle ||
            "client-portal-assistance_client-portal-assistance-title",
          subtitle:
            customSubtitle ||
            "client-portal-assistance_client-portal-assistance-text",
          primaryButton:
            customPrimaryButtonText ||
            "client-portal-assistance_button-get-started",
          secondaryButton:
            customSecondaryButtonText ||
            "client-portal-assistance_button-watch-quick-overview",
          warning: customWarningText || "index_main-promotion-warning",
        };
      default: // main-promotion
        return {
          badge: customBadgeText || "index_main-promotion-badge",
          title: customTitle || "index_main-promotion-title",
          subtitle: customSubtitle || "index_main-promotion-subtitle",
          primaryButton: customPrimaryButtonText || "button-start-trading",
          secondaryButton: customSecondaryButtonText || "button-try-demo",
          warning: customWarningText || "index_main-promotion-warning",
          reviews: "index_main-promotion-reviews",
        };
    }
  };

  const translationKeys = getTranslationKeys();
  const heroLcpConfig = useMemo(
    () => HERO_LCP_BY_TYPE[heroType] ?? null,
    [heroType]
  );
  const heroLcpHasRaster =
    heroLcpConfig &&
    typeof heroLcpConfig.mobileWebp === "string" &&
    typeof heroLcpConfig.desktopWebp === "string";
  const localized = useMemo(() => {
    const title = t(translationKeys.title);
    return {
      badge: t(translationKeys.badge),
      title,
      titleLines: title.split("\n"),
      subtitle: t(translationKeys.subtitle),
      primaryButton: translationKeys.primaryButton
        ? t(translationKeys.primaryButton)
        : null,
      secondaryButton: translationKeys.secondaryButton
        ? t(translationKeys.secondaryButton)
        : null,
      warning: t(translationKeys.warning),
    };
  }, [t, translationKeys]);

  return (
    <>
      <section
        className={cn(`${heroType}`, className, {
          [`${heroType}--rtl`]: isRTL,
        })}
        style={heroType === "main-promotion" ? { opacity: 1 } : undefined}
      >
        <div className={`${heroType}__hero-container`}>
          {/* Hero Background Image - Render LCP image immediately for main-promotion */}
          {/* CRITICAL: Always render image container for main-promotion to avoid conditional rendering delay */}
          <div className={`${heroType}__hero-bg`}>
            {/* All-markets: LCP must be a real <img> in the document (CSS bg was ~2.6s discovery delay in Lighthouse). */}
            {heroLcpConfig ? (
              <picture>
                {heroLcpHasRaster ? (
                  <>
                    <source
                      media={HERO_ASSET_MOBILE_MQ}
                      type="image/webp"
                      srcSet={heroLcpConfig.mobileWebp}
                    />
                    <source
                      media={HERO_ASSET_DESKTOP_MQ}
                      type="image/webp"
                      srcSet={heroLcpConfig.desktopWebp}
                    />
                  </>
                ) : null}
                <source
                  media={HERO_ASSET_MOBILE_MQ}
                  type="image/svg+xml"
                  srcSet={heroLcpConfig.mobileSvg}
                />
                <source
                  media={HERO_ASSET_DESKTOP_MQ}
                  type="image/svg+xml"
                  srcSet={heroLcpConfig.desktopSvg}
                />
                <img
                  className={`${heroType}__hero-bg-lcp`}
                  src={
                    heroLcpHasRaster
                      ? heroLcpConfig.desktopWebp
                      : heroLcpConfig.desktopSvg
                  }
                  alt=""
                  width={heroLcpConfig.dimensions.desktop.width}
                  height={heroLcpConfig.dimensions.desktop.height}
                  loading="eager"
                  fetchpriority="high"
                  decoding="sync"
                  aria-hidden="true"
                />
              </picture>
            ) : null}
            {/* For main-promotion, always render image container (no conditional) to ensure immediate visibility */}
            {heroType === "main-promotion" ? (
              <div className={`${heroType}__hero-img`} aria-hidden="true">
                {showHeroImage && (
                  <>
                    <picture>
                      <img
                        src={globeImageMobile}
                        alt=""
                        width="419"
                        height="419"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        className={`${heroType}__hero-img-element ${heroType}__hero-img-element--mobile`}
                        style={{
                          display: "block",
                          visibility: "visible",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "bottom center",
                        }}
                      />
                    </picture>
                    <picture>
                      <source
                        media={HERO_ASSET_DESKTOP_MQ}
                        srcSet={globeImageDesktop}
                      />
                      <img
                        src={globeImageDesktop}
                        srcSet={globeSrcSet}
                        sizes="(max-width: 767px) 419px, 734px"
                        alt=""
                        width="734"
                        height="734"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        className={`${heroType}__hero-img-element ${heroType}__hero-img-element--desktop`}
                        style={{
                          display: "block",
                          visibility: "visible",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "bottom center",
                        }}
                      />
                    </picture>
                  </>
                )}
              </div>
            ) : showHeroImage ? (
              <div className={`${heroType}__hero-img`} aria-hidden="true">
                {/* Other hero types */}
              </div>
            ) : null}
          </div>

          <div className="container">
            {/* Content Container */}
            <div className={`${heroType}__content-container`}>
              {/* Badge Group */}
              <div className={`${heroType}__badge-group`}>
                {heroType === "faq-hero" ? (
                  // Custom FAQ Badge Structure
                  <div className={`${heroType}__badge`}>
                    <div className={`${heroType}__badge-icon`}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_2188_5347)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.5 0C1.56701 0 0 1.56701 0 3.5V10.5C0 12.433 1.56701 14 3.5 14H10.5C12.433 14 14 12.433 14 10.5V3.5C14 1.56701 12.433 0 10.5 0H3.5ZM7.94143 3.82614C7.55629 3.04573 6.44343 3.04573 6.05829 3.82614L5.50641 4.9444L4.27233 5.12373C3.41109 5.24887 3.06721 6.30721 3.6904 6.91467L4.58339 7.78512L4.37259 9.01425C4.22547 9.87203 5.12577 10.5261 5.8961 10.1212L6.99986 9.54086L8.10369 10.1212C8.87397 10.5261 9.77431 9.87203 9.62717 9.01425L9.41633 7.78512L10.3093 6.91467C10.9325 6.30721 10.5887 5.24887 9.72741 5.12373L8.49338 4.9444L7.94143 3.82614Z"
                            fill="#FF4400"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2188_5347">
                            <rect width="14" height="14" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className={`${heroType}__badge-text`}>
                      {localized.badge}
                    </span>
                  </div>
                ) : (
                  // Default Badge Structure
                  <div className={`${heroType}__badge-content`}>
                    <span className={`${heroType}__badge-message`}>
                      {localized.badge}
                    </span>
                    <svg
                      className={`${heroType}__badge-arrow`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
                        stroke="#FF4400"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Heading */}
              <h1 className={`${heroType}__heading`}>
                <span className={`${heroType}__title`}>
                  {localized.titleLines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < localized.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </h1>

              {/* Subheading */}
              <p className={`${heroType}__subheading`}>{localized.subtitle}</p>

              {/* Search Bar for FAQ */}
              {heroType === "faq-hero" &&
                setSearchResults &&
                setNoSearchResult && (
                  <div className={`${heroType}__search-container`}>
                    <FaqSearchBar
                      setSearchResults={setSearchResults}
                      setNoSearchResult={setNoSearchResult}
                    />
                  </div>
                )}

              {/* Trust Pilot Section for FAQ */}
              {heroType === "faq-hero" && showTrustPilot && (
                <div className={`${heroType}__trust-pilot`}>
                  {trustPilotClientReady ? (
                    <Suspense fallback={null}>
                      <TrustPilot className="trust-pilot--compact" />
                    </Suspense>
                  ) : null}
                </div>
              )}

              {/* Button Container */}
              {(translationKeys.primaryButton ||
                translationKeys.secondaryButton) && (
                <div className={`${heroType}__button-container`}>
                  {translationKeys.secondaryButton ? (
                    <HeroButtons
                      primaryText={localized.primaryButton}
                      secondaryText={localized.secondaryButton}
                      onPrimaryClick={handlePrimaryButtonClick}
                      onSecondaryClick={handleSecondaryButtonClick}
                    />
                  ) : translationKeys.primaryButton ? (
                    <ButtonPrimaryHero
                      text={localized.primaryButton}
                      onClick={handlePrimaryButtonClick}
                      className={
                        heroType === "mt4"
                          ? "mt4-hero-button"
                          : heroType === "mt5"
                          ? "mt5-hero-button"
                          : heroType === "legal"
                          ? "legal-hero-button"
                          : ""
                      }
                    />
                  ) : null}

                  {/* Warning Container */}
                  {showWarning && (
                    <div className={`${heroType}__warning-container`}>
                      <svg
                        className={`${heroType}__warning-icon`}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <g clipPath="url(#clip0_2188_8291)">
                          <path
                            d="M15.6676 11.9985L10.0155 1.60859C9.10744 0.0798092 6.89378 0.077778 5.98447 1.60859L0.332715 11.9985C-0.595597 13.5606 0.528309 15.5388 2.34778 15.5388H13.652C15.47 15.5388 16.5959 13.5622 15.6676 11.9985ZM8 13.6638C7.48318 13.6638 7.0625 13.2431 7.0625 12.7263C7.0625 12.2095 7.48318 11.7888 8 11.7888C8.51681 11.7888 8.9375 12.2095 8.9375 12.7263C8.9375 13.2431 8.51681 13.6638 8 13.6638ZM8.9375 9.91381C8.9375 10.4306 8.51681 10.8513 8 10.8513C7.48318 10.8513 7.0625 10.4306 7.0625 9.91381V5.22631C7.0625 4.7095 7.48318 4.28881 8 4.28881C8.51681 4.28881 8.9375 4.7095 8.9375 5.22631V9.91381Z"
                            fill="#FF4400"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2188_8291">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className={`${heroType}__warning-text`}>
                        {localized.warning}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TrustPilot: real widget; script load is deferred inside trust-pilot/index.js (mobile). */}
              {showTrustPilot && heroType !== "faq-hero" && (
                <div className={`${heroType}__trust-pilot`}>
                  {trustPilotClientReady ? (
                    <Suspense fallback={null}>
                      <TrustPilot />
                    </Suspense>
                  ) : null}
                </div>
              )}
            </div>

            {/* Hand Image - positioned on the right side */}
            {showHandImage && (
              <div className={`${heroType}__hand-container`}>
                <div className={`${heroType}__hand-img`} aria-hidden="true">
                  {heroType === "main-promotion" && (
                    <picture>
                      <source
                        media={HERO_ASSET_MOBILE_MQ}
                        srcSet={handImageMobile}
                      />
                      <img
                        src={handImageMobile}
                        srcSet={handSrcSet}
                        sizes="(max-width: 767px) 222px, 412px"
                        alt=""
                        width="280"
                        height="271"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className={`${heroType}__hand-img-element`}
                      />
                    </picture>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

Hero.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
  heroType: PropTypes.oneOf([
    "main-promotion",
    "all-markets",
    "crypto",
    "indices",
    "forex",
    "metals",
    "shares",
    "energies",
    "etf",
    "mt4",
    "mt5",
    "company",
    "partners",
    "contact-us",
    "legal",
    "faq-hero",
    "spreads-fees",
    "system-info",
    "client-portal-assistance",
    "account-types",
    "funding-withdrawals",
    "trading-tools",
    "vps",
    "swap-free",
  ]),
  customBadgeText: PropTypes.string,
  customTitle: PropTypes.string,
  customSubtitle: PropTypes.string,
  customPrimaryButtonText: PropTypes.string,
  customSecondaryButtonText: PropTypes.string,
  customWarningText: PropTypes.string,
  showWarning: PropTypes.bool,
  showHandImage: PropTypes.bool,
  showHeroImage: PropTypes.bool,
  showTrustPilot: PropTypes.bool,
  desktopBackground: PropTypes.string,
  mobileBackground: PropTypes.string,
  customClassNames: PropTypes.object,
  // FAQ specific props
  setSearchResults: PropTypes.func,
  setNoSearchResult: PropTypes.func,
};

export default Hero;
