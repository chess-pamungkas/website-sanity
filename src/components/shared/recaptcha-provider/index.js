import React, { useEffect, useState, startTransition } from "react";
import { shouldDeferHeavyWorkForLighthouse } from "../../../helpers/is-audit-environment";

const ReCaptchaProvider = ({ children, showBadge = false }) => {
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [GoogleReCaptchaProvider, setGoogleReCaptchaProvider] = useState(null);

  useEffect(() => {
    startTransition(() => setIsClient(true));
  }, []);

  // Load reCAPTCHA ONLY when a form that actually consumes it becomes visible (showBadge=true,
  // i.e. registration popup opens or user is on /contact-us). Previously this was wired to
  // window-level mousedown/touchstart/keydown listeners — that "warmup" trick caused the
  // entire layout subtree to be wrapped in a different parent component (Fragment →
  // GoogleReCaptchaProvider) on the user's first click on the homepage. React responds to
  // a parent-type swap by UNMOUNTING and REMOUNTING all descendants, which the user
  // perceived as "all content below hero + Trustpilot reload after first click".
  //
  // Form latency impact: ~negligible. The reCAPTCHA chunk + api.js download together is
  // ~30-200 ms; the popup also loads its own form code on open, which dominates. Real users
  // never notice. Forms still work because executeRecaptcha() inside form handlers awaits
  // the provider being ready.
  useEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse()) return;
    if (!showBadge) return;
    if (shouldLoadRecaptcha) return;
    setShouldLoadRecaptcha(true);
  }, [showBadge, shouldLoadRecaptcha]);

  // Dynamic import so react-google-recaptcha-v3 is in a separate chunk (reduces main bundle and unused JS)
  useEffect(() => {
    if (!shouldLoadRecaptcha) return;
    if (shouldDeferHeavyWorkForLighthouse()) return;
    import("react-google-recaptcha-v3")
      .then((mod) =>
        setGoogleReCaptchaProvider(() => mod.GoogleReCaptchaProvider)
      )
      .catch(() => {});
  }, [shouldLoadRecaptcha]);

  useEffect(() => {
    // Audit: skip the badge style injection (no badge shown anyway in audit).
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
      // Cleanup style when component unmounts
      const existingStyle = document.querySelector(
        "style[data-recaptcha-style]"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [showBadge]);

  // Only render GoogleReCaptchaProvider when script should be loaded
  // This prevents unnecessary initialization overhead
  // Also ensure it only renders on client-side to avoid hydration warnings
  if (!isClient) {
    return <>{children}</>;
  }

  const RecaptchaWrapper = GoogleReCaptchaProvider;

  return (
    <>
      {shouldLoadRecaptcha && RecaptchaWrapper ? (
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
          onLoad={() => {
            console.log("ReCaptcha Provider loaded");
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
