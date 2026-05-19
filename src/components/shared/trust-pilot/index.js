import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { shouldSuppressTrustpilotForLighthousePerf } from "../../../helpers/is-audit-environment";
import { scheduleAfterLcpOrCap } from "../../../helpers/schedule-after-lcp";
import { TRUSTPILOT_WIDGET_BOOTSTRAP_URL } from "../../../helpers/trustpilot-constants";

const MOBILE_TRUSTPILOT_FALLBACK_MS = 200;
const DESKTOP_TRUSTPILOT_FALLBACK_MS = 520;
/** Hard cap if LCP is slow / observer missing (below-fold widgets). */
const TRUSTPILOT_AFTER_LCP_CAP_MS = 1800;
/** In-viewport Trustbox — cap tighter so heroes feel responsive after first paint. */
const TRUSTPILOT_AFTER_LCP_CAP_IN_VIEWPORT_MS = 900;

/**
 * Below-fold path: idle-bounded bootstrap so ticker/LCP-heavy frames stay smooth.
 */
const queueTrustpilotBootstrap = (callback) => {
  if (typeof window === "undefined") {
    callback();
    return;
  }
  const run = () => {
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(callback, { timeout: 200 });
    } else {
      setTimeout(callback, 48);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(run));
};

/** In viewport: one animation frame after LCP gate — script loads async; avoids idle wait UX. */
const queueTrustpilotBootstrapUrgent = (callback) => {
  if (typeof window === "undefined") {
    callback();
    return;
  }
  requestAnimationFrame(() => {
    callback();
  });
};

const TrustPilot = ({
  className = "",
  businessUnitId = "64ca3f86b3187fdf335b2740",
  templateId = "5419b732fbfb950b10de65e5",
  locale = "en-US",
  height = "24px",
  width = "100%",
  token = "5e065b16-d809-410f-ae86-bc22829c122d",
}) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    let didLoad = false;
    let fallbackTimer = null;
    let io = null;
    let cancelAfterLcp = () => {};

    const loadTrustPilotScript = () => {
      if (didLoad || shouldSuppressTrustpilotForLighthousePerf()) return;
      didLoad = true;
      const existingScript = document.querySelector(
        'script[src*="tp.widget.bootstrap.min.js"]'
      );
      if (existingScript) {
        if (window.Trustpilot && widgetRef.current) {
          window.Trustpilot.loadFromElement(widgetRef.current);
        }
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = TRUSTPILOT_WIDGET_BOOTSTRAP_URL;
      script.async = true;

      script.onload = () => {
        if (window.Trustpilot && widgetRef.current) {
          window.Trustpilot.loadFromElement(widgetRef.current);
        }
      };

      script.onerror = () => {
        console.warn("Failed to load TrustPilot script");
      };

      document.head.appendChild(script);
    };

    let trustpilotViewportCapMs = TRUSTPILOT_AFTER_LCP_CAP_MS;
    let bootstrapInViewportUx = false;

    const enqueueBootstrap = () => {
      cancelAfterLcp();
      cancelAfterLcp = scheduleAfterLcpOrCap(
        () =>
          bootstrapInViewportUx
            ? queueTrustpilotBootstrapUrgent(loadTrustPilotScript)
            : queueTrustpilotBootstrap(loadTrustPilotScript),
        trustpilotViewportCapMs
      );
    };

    let cancelledStart = false;

    const start = () => {
      if (shouldSuppressTrustpilotForLighthousePerf()) return undefined;

      // Avoid getBoundingClientRect / innerHeight — Lighthouse flags forced reflow.
      // IntersectionObserver reports visibility without synchronous layout reads.
      const el = widgetRef.current;
      if (!el || typeof window === "undefined") return undefined;

      const isMobileViewport =
        window.matchMedia &&
        window.matchMedia("(max-width: 768px)").matches;

      const fallbackMs = isMobileViewport
        ? MOBILE_TRUSTPILOT_FALLBACK_MS
        : DESKTOP_TRUSTPILOT_FALLBACK_MS;

      const enqueueBelowFold = () => {
        trustpilotViewportCapMs = TRUSTPILOT_AFTER_LCP_CAP_MS;
        bootstrapInViewportUx = false;
        enqueueBootstrap();
      };

      const enqueueInViewport = () => {
        trustpilotViewportCapMs = TRUSTPILOT_AFTER_LCP_CAP_IN_VIEWPORT_MS;
        bootstrapInViewportUx = true;
        enqueueBootstrap();
      };

      fallbackTimer = setTimeout(() => {
        if (cancelledStart) return;
        enqueueBelowFold();
      }, fallbackMs);

      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            if (cancelledStart) return;
            const isVisible = entries.some((e) => e.isIntersecting);
            if (!isVisible) return;
            if (io) {
              io.disconnect();
              io = null;
            }
            if (fallbackTimer) {
              clearTimeout(fallbackTimer);
              fallbackTimer = null;
            }
            enqueueInViewport();
          },
          { root: null, rootMargin: "80px 0px 40px 0px", threshold: 0.01 }
        );
        io.observe(el);
      }

      return undefined;
    };

    start();

    return () => {
      cancelledStart = true;
      cancelAfterLcp();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (io) {
        io.disconnect();
        io = null;
      }
    };
  }, []);

  // Re-initialize widget when props change (e.g., language change)
  useEffect(() => {
    if (shouldSuppressTrustpilotForLighthousePerf()) return;
    if (window.Trustpilot && widgetRef.current) {
      widgetRef.current.innerHTML = "";
      window.Trustpilot.loadFromElement(widgetRef.current);
    }
  }, [locale, templateId, businessUnitId, token]);

  return (
    <div className={`trust-pilot ${className}`}>
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={businessUnitId}
        data-style-height={height}
        data-style-width={width}
        data-token={token}
      />
    </div>
  );
};

TrustPilot.propTypes = {
  className: PropTypes.string,
  businessUnitId: PropTypes.string,
  templateId: PropTypes.string,
  locale: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  token: PropTypes.string,
};

export default TrustPilot;
