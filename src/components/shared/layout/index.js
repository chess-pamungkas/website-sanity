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
import MainContainer from "../main-container";
import Header from "../../header";
import Footer from "../../footer";
import { sendLog } from "../../../helpers/services/log-service";
import { pushUTMParamsToDataLayer } from "../../../helpers/services/gtm-service";
import { isBrowser } from "../../../helpers/services/is-browser";

const Layout = ({ children }) => {
  try {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
      setIsLoaded(true);

      // Push UTM parameters to GTM dataLayer
      if (isBrowser()) {
        pushUTMParamsToDataLayer();
      }
    }, []);

    return (
      <ClientResolverProvider>
        <CookieProvider>
          <MarketingContextProvider>
            <LanguageProvider>
              <CommonProvider>
                <SearchProvider>
                  <NotificationStripeProvider>
                    <TradingProvider>
                      <ReCaptchaProvider showBadge={false}>
                        {isLoaded && (
                          <>
                            <Header />
                            <CookiesPopup />
                            <section className="scroll-container">
                              <MainContainer>{children}</MainContainer>
                              <Footer />
                            </section>
                          </>
                        )}
                        <Bookmark />
                      </ReCaptchaProvider>
                    </TradingProvider>
                  </NotificationStripeProvider>
                </SearchProvider>
              </CommonProvider>
            </LanguageProvider>
          </MarketingContextProvider>
        </CookieProvider>
      </ClientResolverProvider>
    );
  } catch (error) {
    sendLog({ message: error.message, type: error.name });

    throw error;
  }
};

export default Layout;
