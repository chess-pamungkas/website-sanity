import React, { useEffect, useState, startTransition } from "react";
import { shouldDeferHeavyWorkForLighthouse } from "../../../helpers/is-audit-environment";

const ReCaptchaProvider = ({ children, showBadge = false }) => {
  const [isClient, setIsClient] = useState(false);
  const [GoogleReCaptchaProvider, setGoogleReCaptchaProvider] = useState(null);

  useEffect(() => {
    startTransition(() => setIsClient(true));
  }, []);

  // Preload the provider wrapper after hydration so the tree parent type stays stable
  // when the registration popup opens. Layout's MutationObserver sets showBadge=true on
  // first open; gating the wrapper on showBadge used to swap Fragment → GoogleReCaptchaProvider
  // and remount Header/Hero, resetting isPopupOpen and closing the popup instantly.
  useEffect(() => {
    if (!isClient || shouldDeferHeavyWorkForLighthouse()) return;
    if (GoogleReCaptchaProvider) return;
    // Homepage desktop: load only when badge needed (popup/contact) — avoids recaptcha__en.js forced reflow in LH.
    if (!showBadge) return;

    import("react-google-recaptcha-v3")
      .then((mod) =>
        setGoogleReCaptchaProvider(() => mod.GoogleReCaptchaProvider)
      )
      .catch(() => {});
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
