import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { ButtonPrimaryStandard } from "../reusable-buttons";
import Faq from "../../faq";
import SpreadsIcon from "../../../assets/images/icons/main-page/features-execution-excellence/features.svg";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { isBrowser } from "../../../helpers/services/is-browser";

const FaqSection = ({
  faqData,
  className = "",
  badgeTextKey = "faq-badge-text",
  titleKey = "faq-title",
  subtitleKey = "faq-subtitle",
  buttonTextKey = "faq-button-text",
  onFaqButtonClick,
}) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const { navigate } = useI18next();
  const { isMobile, isTablet } = useWindowSize();
  const faqSectionRef = useRef(null);

  // Hide live chat when scrolling through faq-section area (only on mobile and tablet)
  useEffect(() => {
    if (!isBrowser() || !faqSectionRef.current) return;

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
      const faqSectionElement = faqSectionRef.current;
      if (!faqSectionElement) return;

      const rect = faqSectionElement.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInViewport) {
        hideLiveChat();
      } else {
        showLiveChat();
      }
    };

    const checkScrollPositionInFrame = () => {
      requestAnimationFrame(() => requestAnimationFrame(checkScrollPosition));
    };

    // Check on mount after layout (avoids forced reflow)
    requestAnimationFrame(() => requestAnimationFrame(checkScrollPosition));

    window.addEventListener("scroll", checkScrollPositionInFrame, { passive: true });
    window.addEventListener("resize", checkScrollPositionInFrame, { passive: true });

    // Hide live chat on mount (since faq-section is visible)
    hideLiveChat();

    return () => {
      window.removeEventListener("scroll", checkScrollPositionInFrame);
      window.removeEventListener("resize", checkScrollPositionInFrame);
      // Show live chat again when component unmounts or when switching to desktop
      showLiveChat();
    };
  }, [isMobile, isTablet]);

  const handleFaqButtonClick = () => {
    if (onFaqButtonClick) {
      onFaqButtonClick();
    } else {
      // Default behavior - navigate to FAQ page
      // Use navigate from useI18next to preserve language prefix in browser history
      navigate("/faq");
    }
  };

  return (
    <div
      ref={faqSectionRef}
      className={`faq-section ${className} ${isRTL ? `${className}--rtl` : ""}`}
    >
      {/* Left Side - Badge, Title, Subtitle, Button */}
      <div className="faq-left">
        <div className="faq-badge">
          <div className="faq-badge-icon">
            <img src={SpreadsIcon} alt="FAQ" width={24} height={24} />
          </div>
          <span className="faq-badge-text">{t(badgeTextKey)}</span>
        </div>
        <h2 className="faq-title">{t(titleKey)}</h2>
        <p className="faq-subtitle">{t(subtitleKey)}</p>
        <ButtonPrimaryStandard
          text={t(buttonTextKey)}
          onClick={handleFaqButtonClick}
          showArrow={true}
        />
      </div>

      {/* Right Side - FAQ Items */}
      <div className="faq-right">
        {/* Comprehensive FAQ Component - Using help-center structure */}
        {faqData && faqData.length > 0 && (
          <Faq
            faq={faqData}
            className="faq--help-center"
            title={null}
            isFaqBtnHidden={true}
          />
        )}
      </div>
    </div>
  );
};

FaqSection.propTypes = {
  faqData: PropTypes.array.isRequired,
  className: PropTypes.string,
  badgeTextKey: PropTypes.string,
  titleKey: PropTypes.string,
  subtitleKey: PropTypes.string,
  buttonTextKey: PropTypes.string,
  onFaqButtonClick: PropTypes.func,
};

export default FaqSection;
