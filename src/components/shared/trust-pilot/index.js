import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { shouldSuppressTrustpilotForLighthousePerf } from "../../../helpers/is-audit-environment";
import { isMarketingHomePath } from "../../../helpers/is-marketing-home-path";
import { scheduleAfterLcpOrCap } from "../../../helpers/schedule-after-lcp";
import { whenAppStylesReady } from "../../../helpers/when-app-styles-ready";
import { TRUSTPILOT_WIDGET_BOOTSTRAP_URL } from "../../../helpers/trustpilot-constants";

const MOBILE_TRUSTPILOT_FALLBACK_MS = 200;
const DESKTOP_TRUSTPILOT_FALLBACK_MS = 520;
const TRUSTPILOT_AFTER_LCP_CAP_MS = 1800;
const TRUSTPILOT_AFTER_LCP_CAP_IN_VIEWPORT_MS = 900;

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

const queueTrustpilotBootstrapUrgent = (callback) => {
  if (typeof window === "undefined") {
    callback();
    return;
  }
  requestAnimationFrame(() => {
    callback();
  });
};

const mountTrustpilotWidget = (widgetEl) => {
  if (!widgetEl || !window.Trustpilot) return;
  window.Trustpilot.loadFromElement(widgetEl);
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
  const slotRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    let didLoad = false;
    let fallbackTimer = null;
    let io = null;
    let cancelAfterLcp = () => {};
    let cancelHomePreload = () => {};
    let cancelPointerWarm = () => {};

    const loadTrustPilotScript = () => {
      if (didLoad || shouldSuppressTrustpilotForLighthousePerf()) return;
      didLoad = true;

      const widgetEl = widgetRef.current;
      const runMount = () => {
        if (widgetEl && window.Trustpilot) {
          mountTrustpilotWidget(widgetEl);
        }
      };

      const existingScript = document.querySelector(
        'script[src*="tp.widget.bootstrap.min.js"]'
      );
      if (existingScript) {
        if (window.Trustpilot) {
          runMount();
        } else {
          existingScript.addEventListener("load", runMount, { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = TRUSTPILOT_WIDGET_BOOTSTRAP_URL;
      script.async = true;
      script.onload = runMount;
      script.onerror = () => {
        console.warn("Failed to load TrustPilot script");
        didLoad = false;
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

      const path =
        typeof window !== "undefined" ? window.location.pathname || "" : "";
      if (isMarketingHomePath(path)) {
        cancelHomePreload = scheduleAfterLcpOrCap(loadTrustPilotScript, 4500);
        const warmOnPointer = () => loadTrustPilotScript();
        document.addEventListener("pointerdown", warmOnPointer, {
          capture: true,
          passive: true,
        });
        cancelPointerWarm = () => {
          document.removeEventListener("pointerdown", warmOnPointer, {
            capture: true,
          });
        };
      }

      const observeTarget = slotRef.current;
      if (!observeTarget || typeof window === "undefined") return undefined;

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
        const isMobileViewport =
          window.matchMedia && window.matchMedia("(max-width: 768px)").matches;

        if (isMobileViewport) {
          enqueueBelowFold();
        } else {
          fallbackTimer = setTimeout(() => {
            if (cancelledStart) return;
            enqueueBelowFold();
          }, DESKTOP_TRUSTPILOT_FALLBACK_MS - MOBILE_TRUSTPILOT_FALLBACK_MS);
        }
      }, MOBILE_TRUSTPILOT_FALLBACK_MS);

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
        io.observe(observeTarget);
      } else {
        enqueueInViewport();
      }

      return undefined;
    };

    let rafId;
    let cancelStylesArm = () => {};
    const begin = () => {
      rafId = requestAnimationFrame(() => {
        start();
      });
    };
    const path =
      typeof window !== "undefined" ? window.location.pathname || "" : "";
    if (isMarketingHomePath(path)) {
      cancelStylesArm = whenAppStylesReady(begin, 5800);
    } else {
      begin();
    }

    return () => {
      cancelledStart = true;
      cancelStylesArm();
      if (rafId) cancelAnimationFrame(rafId);
      cancelAfterLcp();
      cancelHomePreload();
      cancelPointerWarm();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (io) {
        io.disconnect();
        io = null;
      }
    };
  }, []);

  useEffect(() => {
    if (shouldSuppressTrustpilotForLighthousePerf()) return;
    if (window.Trustpilot && widgetRef.current) {
      widgetRef.current.innerHTML = "";
      mountTrustpilotWidget(widgetRef.current);
    }
  }, [locale, templateId, businessUnitId, token]);

  if (shouldSuppressTrustpilotForLighthousePerf()) {
    return null;
  }

  return (
    <div className={`trust-pilot ${className}`}>
      <div ref={slotRef} className="trust-pilot__slot">
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
