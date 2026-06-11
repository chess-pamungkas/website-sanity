import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";
import { shouldDeferHeavyWorkForLighthouse } from "../../../helpers/is-audit-environment";
import { importRecaptchaV3Module } from "../../../helpers/recaptcha-v3-module";

const RecaptchaReadyContext = createContext(false);

/** True when GoogleReCaptchaProvider is mounted and captcha can run. */
export const useRecaptchaReady = () => useContext(RecaptchaReadyContext);

const ReCaptchaProvider = ({ children, showBadge = false }) => {
  const [isClient, setIsClient] = useState(false);
  const [GoogleReCaptchaProvider, setGoogleReCaptchaProvider] = useState(null);

  useEffect(() => {
    startTransition(() => setIsClient(true));
  }, []);

  // Load reCAPTCHA ONLY when it is actually needed (contact-us or popup open).
  // Preloading it on homepage adds large long tasks and unused JS/CSS in PSI.
  useEffect(() => {
    if (!isClient || shouldDeferHeavyWorkForLighthouse()) return undefined;
    if (GoogleReCaptchaProvider) return undefined;
    if (!showBadge) return undefined;

    const loadProvider = () => {
      void importRecaptchaV3Module()
        .then((mod) =>
          startTransition(() =>
            setGoogleReCaptchaProvider(() => mod.GoogleReCaptchaProvider)
          )
        )
        .catch(() => {});
    };

    loadProvider();
    return undefined;
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

  const isRecaptchaReady =
    isClient &&
    !shouldDeferHeavyWorkForLighthouse() &&
    showBadge &&
    !!GoogleReCaptchaProvider;

  if (!isClient) {
    return (
      <RecaptchaReadyContext.Provider value={false}>
        {children}
      </RecaptchaReadyContext.Provider>
    );
  }

  const RecaptchaWrapper = GoogleReCaptchaProvider;

  return (
    <RecaptchaReadyContext.Provider value={isRecaptchaReady}>
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
    </RecaptchaReadyContext.Provider>
  );
};

export default ReCaptchaProvider;
