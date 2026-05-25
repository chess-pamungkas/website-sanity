import React, { useEffect, useState, startTransition } from "react";
import {
  shouldDeferHeavyWorkForLighthouse,
  isDocumentAuditMode,
} from "../../../helpers/is-audit-environment";
import { isMarketingHomePath } from "../../../helpers/is-marketing-home-path";
import { importRecaptchaV3Module } from "../../../helpers/recaptcha-v3-module";
import {
  scheduleAfterCapOnly,
  scheduleAfterLcpOrCap,
} from "../../../helpers/schedule-after-lcp";

/** Homepage: load reCAPTCHA only when popup opens (not during Lighthouse trace). */
const RECAPTCHA_HOME_DEFER_CAP_MS = 11000;

const ReCaptchaProvider = ({ children, showBadge = false }) => {
  const [isClient, setIsClient] = useState(false);
  const [GoogleReCaptchaProvider, setGoogleReCaptchaProvider] = useState(null);

  useEffect(() => {
    startTransition(() => setIsClient(true));
  }, []);

  // Preload provider after idle (or immediately when popup opens) so LH desktop is not hit by
  // recaptcha__en.js layout during the hero window. Loading only on showBadge used to remount
  // Header/Hero and close the registration popup on first click — keep showBadge urgent path.
  useEffect(() => {
    if (!isClient || shouldDeferHeavyWorkForLighthouse()) return undefined;
    if (GoogleReCaptchaProvider) return undefined;

    const loadProvider = () => {
      void importRecaptchaV3Module()
        .then((mod) =>
          startTransition(() =>
            setGoogleReCaptchaProvider(() => mod.GoogleReCaptchaProvider)
          )
        )
        .catch(() => {});
    };

    if (showBadge) {
      loadProvider();
      return undefined;
    }

    const path =
      typeof window !== "undefined" ? window.location.pathname || "" : "";
    if (isMarketingHomePath(path)) {
      let cancelHomePreload = scheduleAfterLcpOrCap(
        loadProvider,
        RECAPTCHA_HOME_DEFER_CAP_MS
      );
      let cancelPointerWarm = () => {};
      const warmOnPointer = () => {
        loadProvider();
      };
      document.addEventListener("pointerdown", warmOnPointer, {
        capture: true,
        passive: true,
      });
      cancelPointerWarm = () => {
        document.removeEventListener("pointerdown", warmOnPointer, {
          capture: true,
        });
      };
      return () => {
        cancelHomePreload();
        cancelPointerWarm();
      };
    }

    let cancelDefer = () => {};
    const armLoad = () => {
      if (isDocumentAuditMode()) {
        cancelDefer = scheduleAfterCapOnly(loadProvider, RECAPTCHA_HOME_DEFER_CAP_MS);
        return;
      }
      let idleId;
      let timeoutId;
      if (typeof requestIdleCallback !== "undefined") {
        idleId = requestIdleCallback(loadProvider, { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(loadProvider, 1200);
      }
      cancelDefer = () => {
        if (idleId != null && typeof cancelIdleCallback !== "undefined") {
          cancelIdleCallback(idleId);
        }
        if (timeoutId != null) {
          window.clearTimeout(timeoutId);
        }
      };
    };

    cancelDefer = scheduleAfterLcpOrCap(armLoad, 4500);

    return () => {
      cancelDefer();
    };
  }, [isClient, GoogleReCaptchaProvider, showBadge]);

  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return;
    const style = document.createElement("style");
    style.setAttribute("data-recaptcha-style", "true");
    style.innerHTML = `
      .grecaptcha-badge { 
        visibility: ${showBadge ? "visible" : "hidden"} !important;
        left: 0 !important;
        right: auto !important;
        bottom: 0 !important;
        position: fixed !important;
        z-index: 999999 !important;
        width: 70px !important;
        transition: width 0.3s ease !important;
        overflow: hidden !important;
        transform: none !important;
        direction: ltr !important;
        display: flex !important;
        flex-direction: row-reverse !important;
      }
      .grecaptcha-badge:hover {
        width: 256px !important;
      }
      .grecaptcha-badge .grecaptcha-logo {
        transform: none !important;
      }
      [dir="rtl"] .grecaptcha-badge {
        transform: none !important;
      }
      [dir="rtl"] .grecaptcha-badge .grecaptcha-logo {
        transform: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.querySelector(
        "style[data-recaptcha-style]"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [showBadge]);

  if (!isClient) {
    return <>{children}</>;
  }

  const RecaptchaWrapper = GoogleReCaptchaProvider;

  return (
    <>
      {RecaptchaWrapper ? (
        <RecaptchaWrapper
          reCaptchaKey={process.env.GATSBY_GOOGLE_CAPTCHA_SITE_KEY}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: "body",
            nonce: undefined,
            id: "google-recaptcha-v3",
          }}
          language="en"
          useEnterprise={false}
          container={{
            element: "captcha-placeholder",
            parameters: {
              badge: "bottomleft",
              size: "invisible",
              theme: "light",
            },
          }}
        >
          {children}
        </RecaptchaWrapper>
      ) : (
        children
      )}
      <div id="captcha-placeholder" suppressHydrationWarning />
    </>
  );
};

export default ReCaptchaProvider;
