import React, { useEffect, useState } from "react";
import "../../../assets/styles/index.scss";
import { ClientResolverProvider } from "../../../context/client-resolver-context";
import { LanguageProvider } from "../../../context/language-context";
import { MarketingContextProvider } from "../../../context/marketing-context";
import { CookieProvider } from "../../../context/cookie-context";
import { SearchProvider } from "../../../context/search-context";
import { CookiesPopup } from "../../cookies-popup";
import { NotificationStripeProvider } from "../../../context/notification-stripe-context";
import { TradingProvider } from "../../../context/trading-context";
import { CommonProvider } from "../../../context/common-context";
import ReCaptchaProvider from "../recaptcha-provider";
import Bookmark from "../../floating-button/BookmarkButton";
import Header from "../../header";
import Footer from "../../footer";
import { sendLog } from "../../../helpers/services/log-service";
import { pushUTMParamsToDataLayer } from "../../../helpers/services/gtm-service";
import { isBrowser } from "../../../helpers/services/is-browser";
import { useLocation } from "@reach/router";

const Layout = ({ children }) => {
  try {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();
    const isContactUsPage =
      location?.pathname === "/contact-us" ||
      location?.pathname === "/contact-us/" ||
      location?.pathname?.includes("/contact-us");

    // Check if popup registration is open
    const isPopupRegistrationOpen =
      isPopupOpen ||
      (typeof window !== "undefined" &&
        document.querySelector(".popup-registration") !== null);

    // Use useLayoutEffect for immediate execution (runs synchronously after DOM mutations)
    // This ensures content (especially LCP image) renders as soon as possible
    useEffect(() => {
      // Set loaded immediately - this is safe because it matches SSR behavior
      setIsLoaded(true);
    }, []);

    // Separate effect for non-critical operations
    useEffect(() => {
      // Push UTM parameters to GTM dataLayer
      if (isBrowser()) {
        pushUTMParamsToDataLayer();

        // Expose GTM helper functions to window for testing in development only
        // Using dynamic import to exclude testing functions from production bundle
        if (process.env.GATSBY_ENV === "development") {
          import("../../../helpers/services/gtm-service-test").then(
            (testHelpers) => {
              window.testGTMDataLayer = testHelpers.testGTMDataLayer;
              window.getDataLayer = testHelpers.getDataLayer;
              window.checkGTMStatus = testHelpers.checkGTMStatus;
              window.testGTMWithCampaignCode =
                testHelpers.testGTMWithCampaignCode;
              window.simulateURLWithParams = testHelpers.simulateURLWithParams;
            }
          );
        }
      }
    }, []);

    // Remove browser extension attributes that cause hydration warnings
    useEffect(() => {
      if (!isBrowser()) return;

      const removeExtensionAttributes = () => {
        // Remove bis_skin_checked and other browser extension attributes
        const allElements = document.querySelectorAll("[bis_skin_checked]");
        allElements.forEach((el) => {
          el.removeAttribute("bis_skin_checked");
        });
      };

      // Use MutationObserver to watch for attributes added by browser extensions
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "bis_skin_checked"
          ) {
            mutation.target.removeAttribute("bis_skin_checked");
          }
        });
      });

      // Observe the entire document for attribute changes
      observer.observe(document.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ["bis_skin_checked"],
      });

      // Also remove existing attributes
      removeExtensionAttributes();

      return () => {
        observer.disconnect();
      };
    }, []);

    // Monitor for popup registration changes
    useEffect(() => {
      if (!isBrowser()) return;

      const checkPopupStatus = () => {
        const popupElement = document.querySelector(".popup-registration");
        setIsPopupOpen(!!popupElement);
      };

      // Check initially
      checkPopupStatus();

      // Set up MutationObserver to watch for DOM changes
      const observer = new MutationObserver(checkPopupStatus);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });

      return () => {
        observer.disconnect();
      };
    }, []);

    return (
      <div suppressHydrationWarning>
        <ClientResolverProvider>
          <CookieProvider>
            <MarketingContextProvider>
              <LanguageProvider>
                <CommonProvider>
                  <SearchProvider>
                    <NotificationStripeProvider>
                      <TradingProvider>
                        <ReCaptchaProvider
                          showBadge={isContactUsPage || isPopupRegistrationOpen}
                        >
                          {isLoaded && (
                            <>
                              <Header />
                              <CookiesPopup />
                              <section className="scroll-container">
                                {/* Render children directly - MainPromotion will be outside MainContainer */}
                                {children}
                                <Footer />
                              </section>
                            </>
                          )}
                          {/* <Bookmark /> */}
                        </ReCaptchaProvider>
                      </TradingProvider>
                    </NotificationStripeProvider>
                  </SearchProvider>
                </CommonProvider>
              </LanguageProvider>
            </MarketingContextProvider>
          </CookieProvider>
        </ClientResolverProvider>
      </div>
    );
  } catch (error) {
    sendLog({ message: error.message, type: error.name });

    throw error;
  }
};

export default Layout;
