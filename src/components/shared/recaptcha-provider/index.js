import React, { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const ReCaptchaProvider = ({ children, showBadge = false }) => {
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Defer reCAPTCHA loading until user interaction or form focus
    // This reduces initial page load by ~347KB
    const loadRecaptchaOnInteraction = () => {
      if (!shouldLoadRecaptcha) {
        setShouldLoadRecaptcha(true);
      }
    };

    // Load on user interaction (click, touch, scroll)
    const events = ["mousedown", "touchstart", "scroll", "keydown"];
    events.forEach((event) => {
      window.addEventListener(event, loadRecaptchaOnInteraction, {
        once: true,
        passive: true,
      });
    });

    // Also load after a delay if user hasn't interacted (fallback for forms)
    // Increased delay to 5 seconds to reduce initial JavaScript execution time
    const timeoutId = setTimeout(() => {
      loadRecaptchaOnInteraction();
    }, 5000); // Load after 5 seconds as fallback (increased from 3s)

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadRecaptchaOnInteraction);
      });
      clearTimeout(timeoutId);
    };
  }, [shouldLoadRecaptcha]);

  useEffect(() => {
    // Update style to position badge at bottom left
    // This style is needed regardless of when reCAPTCHA loads
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

  return (
    <>
      {shouldLoadRecaptcha ? (
        <GoogleReCaptchaProvider
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
        </GoogleReCaptchaProvider>
      ) : (
        // Render children without reCAPTCHA provider until needed
        children
      )}
      <div id="captcha-placeholder" suppressHydrationWarning />
    </>
  );
};

export default ReCaptchaProvider;
