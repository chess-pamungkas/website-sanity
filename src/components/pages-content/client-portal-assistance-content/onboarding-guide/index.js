import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useI18next } from "gatsby-plugin-react-i18next";
import TrustPilot from "../../../shared/trust-pilot";
import { BadgeSecurityIconGeneral as BadgeSecurityIcon } from "../../../shared/shared-icons";
import SearchIcon from "../../../../assets/images/icons/client-portal-assistance/search.svg";
import {
  SEARCH_PAGE_LINK,
  SEARCH_PARAM_NAME,
} from "../../../../helpers/constants";

const OnboardingGuide = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { navigate } = useI18next();
  const trustRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  // Inject styles for TrustPilot widget after it's rendered
  useEffect(() => {
    const applyTrustPilotStyles = () => {
      if (!trustRef.current) return;

      // Find TrustPilot widget wrapper
      const widgetWrapper = trustRef.current.querySelector(
        "#tp-widget-wrapper, .tp-widget-wrapper"
      );

      if (widgetWrapper) {
        // Create style element and inject directly into the widget
        const styleId = "onboarding-guide-trustpilot-styles";
        let styleElement = document.getElementById(styleId);

        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = styleId;
          styleElement.textContent = `
            #tp-widget-wrapper *,
            .tp-widget-wrapper * {
              color: #000000 !important;
            }
            #trust-score,
            .tp-widget-trustscore,
            div[id="trust-score"] {
              color: #000000 !important;
            }
            #profile-link,
            a#profile-link {
              color: #000000 !important;
            }
            #tp-widget-stars *,
            .tp-widget-stars * {
              color: #000000 !important;
            }
            #tp-widget-logo *,
            .tp-widget-logo * {
              color: #000000 !important;
            }
          `;
          document.head.appendChild(styleElement);
        }
      }
    };

    // Try immediately
    applyTrustPilotStyles();

    // Also try after a delay to catch dynamically injected content
    const timer1 = setTimeout(applyTrustPilotStyles, 500);
    const timer2 = setTimeout(applyTrustPilotStyles, 1500);
    const timer3 = setTimeout(applyTrustPilotStyles, 3000);

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      applyTrustPilotStyles();
    });

    if (trustRef.current) {
      observer.observe(trustRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle Enter key press to navigate to search page
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Only navigate if there's text in the input
      if (searchValue && searchValue.trim()) {
        const query = encodeURIComponent(searchValue.trim());
        // navigate from useI18next automatically adds language prefix, so we don't need to add it manually
        const searchUrl = `${SEARCH_PAGE_LINK}?${SEARCH_PARAM_NAME}=${query}`;
        navigate(searchUrl);
      }
      // If no text, do nothing (no event)
    }
  };

  return (
    <section className={`onboarding-guide ${className || ""}`.trim()}>
      <div className="onboarding-guide__container">
        <div className="onboarding-guide__left">
          <div className="onboarding-guide__badge">
            <img
              src={BadgeSecurityIcon}
              alt="badge"
              className="onboarding-guide__badge-icon"
              width={24}
              height={24}
            />
            <span className="onboarding-guide__badge-text">
              {t("client-portal-assistance_onboarding_guide_badge")}
            </span>
          </div>

          <h2 className="onboarding-guide__title">
            {t("client-portal-assistance_quick_start_title")}
          </h2>

          <p className="onboarding-guide__subtitle">
            {t("client-portal-assistance_quick_start_description")}
          </p>
        </div>

        <div className="onboarding-guide__right">
          <label
            className="onboarding-guide__search"
            aria-label="search topics"
          >
            <img
              src={SearchIcon}
              alt="search"
              className="onboarding-guide__search-icon"
            />
            <input
              className="onboarding-guide__search-input"
              placeholder={t("client-portal-assistance_search_placeholder")}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </label>

          <div className="onboarding-guide__trust" ref={trustRef}>
            <TrustPilot />
          </div>
        </div>
      </div>
    </section>
  );
};

OnboardingGuide.propTypes = {
  className: PropTypes.string,
};

export default OnboardingGuide;
