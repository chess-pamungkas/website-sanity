import React, { useState, useEffect, useRef } from "react";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
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
import { isBrowser } from "../../helpers/services/is-browser";
import {
  isMobileViewportMedia,
  MOBILE_VIEWPORT_MQ,
} from "../../helpers/viewport-media";
import {
  FAQ_MARKETS_SECTION_BG,
  FAQ_MARKET_CARD_BG,
} from "../../helpers/faq-lcp-backgrounds";

const HelpCenter = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const [viewportLayoutReady, setViewportLayoutReady] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [noSearchResult, setNoSearchResult] = useState(false);
  const isRTL = useRtlDirection();
  const mobileLayout = viewportLayoutReady && isMobile;

  useEffect(() => {
    setViewportLayoutReady(true);
  }, []);
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
    const shouldHideLiveChat = isMobileViewportMedia();

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

    // Defer geometry read until after first paint (avoids forced reflow on FAQ mount).
    requestAnimationFrame(() => {
      requestAnimationFrame(checkScrollPosition);
    });

    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition, { passive: true });

    hideLiveChat();

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      // Show live chat again when component unmounts or when switching to desktop
      showLiveChat();
    };
  }, []);

  // Clean and Simple HelpCenterBlock Component
  const HelpCenterBlock = ({
    title,
    subtitle,
    faq,
    titleClassName,
    classNames,
    icon,
    /** 2 = main FAQ sections (after hero h1); 3 = market cards under "Pasar OQtima" h2; 4 = e.g. beginners after last h3 */
    titleHeadingLevel = 2,
  }) => {
    const isMarketCard = classNames?.includes("help-center--market");
    const level =
      titleHeadingLevel === 3 || titleHeadingLevel === 4
        ? titleHeadingLevel
        : 2;
    const TitleTag = level === 3 ? "h3" : level === 4 ? "h4" : "h2";

    return (
    <div className="help-center__block">
      <div className="help-center__block-container">
        {/* Block Header with Icon and Content */}
        <div className="help-center__block-header">
          {isMarketCard && (
            <picture
              className="help-center__block-header-bg"
              aria-hidden="true"
            >
              <source
                media={MOBILE_VIEWPORT_MQ}
                srcSet={FAQ_MARKET_CARD_BG.mobile.src}
                type="image/webp"
              />
              <img
                src={FAQ_MARKET_CARD_BG.desktop.src}
                alt=""
                className="help-center__block-header-bg-image"
                width={FAQ_MARKET_CARD_BG.desktop.width}
                height={FAQ_MARKET_CARD_BG.desktop.height}
                decoding="async"
              />
            </picture>
          )}
          {icon && (
            <div className="help-center__block-icon">
              <img src={icon} alt="" className="help-center__block-icon-img" />
            </div>
          )}
          <div className="help-center__block-content">
            {title && (
              <TitleTag className={cn("help-center__block-title", titleClassName)}>
                {title}
              </TitleTag>
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
  };

  // PropTypes for HelpCenterBlock
  HelpCenterBlock.propTypes = {
    title: PropTypes.node,
    subtitle: PropTypes.string,
    faq: PropTypes.array.isRequired,
    titleClassName: PropTypes.string,
    classNames: PropTypes.arrayOf(PropTypes.string),
    icon: PropTypes.string,
    titleHeadingLevel: PropTypes.oneOf([2, 3, 4]),
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
              <picture
                className="help-center__markets-section-bg"
                aria-hidden="true"
              >
                <source
                  media={MOBILE_VIEWPORT_MQ}
                  srcSet={FAQ_MARKETS_SECTION_BG.mobile.src}
                  type="image/svg+xml"
                />
                <img
                  src={FAQ_MARKETS_SECTION_BG.desktop.src}
                  alt=""
                  className="help-center__markets-section-bg-image"
                  width={FAQ_MARKETS_SECTION_BG.desktop.width}
                  height={FAQ_MARKETS_SECTION_BG.desktop.height}
                  decoding="async"
                />
              </picture>
              <div className="help-center__wrapper container">
                {/* Markets Header with Badge and Title */}
                <div className="help-center__markets-header">
                  <div className="help-center__markets-badge">
                    <img
                      src={featuresIcon}
                      alt={t("help-center_badge-alt")}
                      className="help-center__markets-badge-icon"
                      width={14}
                      height={14}
                      decoding="async"
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
                      titleHeadingLevel={3}
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
                  titleHeadingLevel={4}
                />
              </div>
            </div>
          </>
        )}
      </section>

      <div className="help-center__our-community">
        {mobileLayout ? (
          <OurCommunityContent />
        ) : (
          <ContainerWrapper>
            <OurCommunityContent />
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
