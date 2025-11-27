import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import {
  FAQ_ALL,
  FAQ_BEGINNERS,
  FAQ_QUICK_ANSWER,
  getFAQMarket,
} from "../../helpers/faq";
import Faq from "../faq";
import FaqHero from "./faq-hero";
import featuresIcon from "../../assets/images/icons/features.svg";
import quickAnswersIcon from "../../assets/images/icons/faq/quick-answers.svg";
import yourAccountIcon from "../../assets/images/icons/faq/your-oqtima-account.svg";
import fundingIcon from "../../assets/images/icons/faq/oqtima-funding.svg";
import tradingIcon from "../../assets/images/icons/faq/oqtima-trading.svg";
import beginnersTerminologyIcon from "../../assets/images/icons/faq/beginners-terminology.svg";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../helpers/constants";
import OurCommunityContent from "../shared/our-community";
import ContainerWrapper from "../shared/container-wrapper";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { isBrowser } from "../../helpers/services/is-browser";

const HelpCenter = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile, isTablet } = useWindowSize();
  const [searchResults, setSearchResults] = useState([]);
  const [noSearchResult, setNoSearchResult] = useState(false);
  const isRTL = useRtlDirection();
  const faqMarket = getFAQMarket();
  const helpCenterRef = useRef(null);

  // Hide live chat when scrolling through help-center area (only on mobile and tablet)
  useEffect(() => {
    if (!isBrowser() || !helpCenterRef.current) return;

    const showLiveChat = () => {
      const liveChatElements = document.querySelectorAll(
        "#convrs-shadow-host, #convrs-chat-channel-container, .convrs-chat-channel-container"
      );

      liveChatElements.forEach((el) => {
        if (el && el.style) {
          el.style.removeProperty("display");
          el.style.removeProperty("visibility");
          el.style.removeProperty("opacity");
          el.style.removeProperty("pointer-events");
        }
      });
    };

    const hideLiveChat = () => {
      const liveChatElements = document.querySelectorAll(
        "#convrs-shadow-host, #convrs-chat-channel-container, .convrs-chat-channel-container"
      );

      liveChatElements.forEach((el) => {
        if (el && el.style) {
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
        }
      });
    };

    // Only hide live chat on mobile and tablet, not on desktop
    const shouldHideLiveChat = isMobile || isTablet;

    // If desktop, show live chat and return early
    if (!shouldHideLiveChat) {
      showLiveChat();
      return;
    }

    const checkScrollPosition = () => {
      const helpCenterElement = helpCenterRef.current;
      if (!helpCenterElement) return;

      const rect = helpCenterElement.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInViewport) {
        hideLiveChat();
      } else {
        showLiveChat();
      }
    };

    // Check on mount
    checkScrollPosition();

    // Check on scroll
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition, { passive: true });

    // Hide live chat on mount (since help-center is visible)
    hideLiveChat();

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      // Show live chat again when component unmounts or when switching to desktop
      showLiveChat();
    };
  }, [isMobile, isTablet]);

  // Clean and Simple HelpCenterBlock Component
  const HelpCenterBlock = ({
    title,
    subtitle,
    faq,
    titleClassName,
    classNames,
    icon,
  }) => (
    <div className="help-center__block">
      <div className="help-center__block-container">
        {/* Block Header with Icon and Content */}
        <div className="help-center__block-header">
          {icon && (
            <div className="help-center__block-icon">
              <img src={icon} alt="" className="help-center__block-icon-img" />
            </div>
          )}
          <div className="help-center__block-content">
            {title && (
              <h4 className={cn("help-center__block-title", titleClassName)}>
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="help-center__block-subtitle">{subtitle}</p>
            )}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="help-center__block-faqs">
          <Faq
            faq={faq}
            className={cn("faq--help-center", classNames)}
            isFaqBtnHidden
          />
        </div>
      </div>
    </div>
  );

  // PropTypes for HelpCenterBlock
  HelpCenterBlock.propTypes = {
    title: PropTypes.node,
    subtitle: PropTypes.string,
    faq: PropTypes.array.isRequired,
    titleClassName: PropTypes.string,
    classNames: PropTypes.arrayOf(PropTypes.string),
    icon: PropTypes.string,
  };
  return (
    <>
      <FaqHero
        setSearchResults={setSearchResults}
        setNoSearchResult={setNoSearchResult}
      />
      <section
        ref={helpCenterRef}
        className={cn("help-center", className, {
          "help-center--rtl": isRTL,
        })}
        dir={isRTL ? DIR_RTL : DIR_LTR}
      >
        <div className="help-center__wrapper container">
          {noSearchResult ? (
            <h2 className="help-center__title">
              {t("search-no-results-text")}
            </h2>
          ) : searchResults.length > 0 ? (
            <>
              {/* Search Results */}
              {searchResults.map((result, index) => (
                <HelpCenterBlock
                  key={index}
                  title={result.title ? t(result.title) : t("faq-title")}
                  subtitle={result.subtitle ? t(result.subtitle) : ""}
                  faq={result.content}
                  icon={result.icon}
                  classNames={["help-center--search-result"]}
                />
              ))}
            </>
          ) : (
            <>
              <HelpCenterBlock
                title={t("faq_quick-title")}
                titleClassName="help-center__block-title--quick-answer"
                subtitle={t("faq_quick-subtitle")}
                faq={FAQ_QUICK_ANSWER[0].content}
                icon={quickAnswersIcon}
                classNames={[
                  "help-center--no-title",
                  "help-center--quick-answer",
                ]}
              />
              <HelpCenterBlock
                title={t("faq_account-title")}
                titleClassName="help-center__block-title--account"
                subtitle={t("faq_account-subtitle")}
                faq={FAQ_ALL[0].content}
                icon={yourAccountIcon}
                classNames={["help-center--account"]}
              />
              <HelpCenterBlock
                title={t("faq_funding-title")}
                titleClassName="help-center__block-title--funding"
                subtitle={t("faq_funding-subtitle")}
                faq={FAQ_ALL[1].content}
                icon={fundingIcon}
                classNames={["help-center--funding"]}
              />
              <HelpCenterBlock
                title={t("faq_trading-title")}
                titleClassName="help-center__block-title--trading"
                subtitle={t("faq_trading-subtitle")}
                faq={FAQ_ALL[2].content}
                icon={tradingIcon}
                classNames={["help-center--trading"]}
              />
            </>
          )}
        </div>

        {/* MARKETS & BEGINNERS SECTIONS - Only visible when no search results */}
        {searchResults.length === 0 && (
          <>
            {/* MARKETS SECTION - Clean and Organized */}
            <div className="help-center__markets-section">
              <div className="help-center__wrapper container">
                {/* Markets Header with Badge and Title */}
                <div className="help-center__markets-header">
                  <div className="help-center__markets-badge">
                    <img
                      src={featuresIcon}
                      alt={t("help-center_badge-alt")}
                      className="help-center__markets-badge-icon"
                    />
                    <span className="help-center__markets-badge-text">
                      {t("help-center_badge-text")}
                    </span>
                  </div>
                  <h2 className="help-center__markets-title">
                    {t("faq_markets-title")}
                  </h2>
                </div>

                {/* Markets Grid - Individual Market Cards */}
                <div className="help-center__markets-grid">
                  {faqMarket.map((market, index) => (
                    <HelpCenterBlock
                      key={index}
                      title={t(market.title)}
                      subtitle={t(
                        `faq_${market.title
                          .replace("faq_", "")
                          .replace("-title", "")
                          .replace("-fsa", "")}-subtitle`
                      )}
                      faq={market.content}
                      icon={market.icon}
                      classNames={["help-center--market"]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* BEGINNERS TERMINOLOGY SECTION */}
            <div className="help-center__beginners-section">
              <div className="help-center__wrapper container">
                <HelpCenterBlock
                  title={t("faq_beginners-title")}
                  titleClassName="help-center__block-title--beginners"
                  subtitle={t("faq_beginners-subtitle")}
                  faq={FAQ_BEGINNERS[0].content}
                  icon={beginnersTerminologyIcon}
                  classNames={["help-center--beginners"]}
                />
              </div>
            </div>
          </>
        )}
      </section>

      <div className="help-center__our-community">
        {isMobile ? (
          <OurCommunityContent
            customBadgeMessage={t("partners_our_community_badge_message")}
            customTitle={t("partners_our_community_title")}
            customSubtitle={t("partners_our_community_subtitle")}
            customPrimaryButton={t("partners_our_community_primary_button")}
            customSecondaryButton={t("partners_our_community_secondary_button")}
          />
        ) : (
          <ContainerWrapper>
            <OurCommunityContent
              customBadgeMessage={t("partners_our_community_badge_message")}
              customTitle={t("partners_our_community_title")}
              customSubtitle={t("partners_our_community_subtitle")}
              customPrimaryButton={t("partners_our_community_primary_button")}
              customSecondaryButton={t(
                "partners_our_community_secondary_button"
              )}
            />
          </ContainerWrapper>
        )}
      </div>
    </>
  );
};

HelpCenter.propTypes = {
  className: PropTypes.string,
};
export default HelpCenter;
