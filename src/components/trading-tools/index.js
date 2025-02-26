import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { getPlatforms } from "../../helpers/config";
import PlatformBlock from "./components/platform-block";
import ButtonPopup from "../shared/button-popup";
import DeviceBlock from "./components/device-block";
import {
  DIR_LTR,
  DIR_RTL,
  ShowRegistrationPopup,
} from "../../helpers/constants";
import { useTrail } from "react-spring";
import { useIntersectionObserver } from "../../helpers/hooks/use-intersection-observer";
import HighlightedLocalizationText from "../shared/highlighted-localization-text";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { setLangParam } from "../../helpers/services/language-service";
import { useWindowSize } from "../../helpers/hooks/use-window-size";

const TradingTools = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const containerRef = useRef();
  const intersectionRef = useIntersectionObserver(containerRef, {
    freezeOnceVisible: true,
  });
  const platforms = getPlatforms();
  const { isTablet, isMobile } = useWindowSize();

  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const langParam = setLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const platformIconTrail = useTrail(Object.values(platforms).length, {
    from: {
      position: "relative",
      bottom: "-40px",
      opacity: 0,
      config: {
        duration: 80,
      },
    },
    to: {
      bottom: isRTL || isAnimationStarted ? "0" : "-40px",
      opacity: isRTL || isAnimationStarted ? 1 : 0,
    },
    delay: isRTL ? 0 : 1500,
  });

  useEffect(() => {
    if (intersectionRef?.isIntersecting) {
      setIsAnimationStarted(true);
    }
  }, [intersectionRef]);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section
      className={cn("trading-tools", className, {
        "trading-tools--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="container">
        <div className="trading-tools__wrapper">
          <div className="trading-tools__icon-wrapper">
            {platformIconTrail.map((styles, i) => {
              return (
                <PlatformBlock
                  key={`platform-${Object.values(platforms)[i].title}`}
                  icon={Object.values(platforms)[i].icon}
                  title={t(Object.values(platforms)[i].title)}
                  animationStyle={styles}
                />
              );
            })}
          </div>
          <DeviceBlock
            className="trading-tools__img-wrapper device-block--animated"
            isAnimationStarted={isRTL || isAnimationStarted}
            isRTL={isRTL}
          />
          <h2 className="trading-tools__title" ref={containerRef}>
            <HighlightedLocalizationText
              localizationText={`index_trading-tools-title-fsa`}
              wordsToHighlight={`trading-tools-title-accent-fsa`}
              primaryClassName="highlighted-in-black"
              accentClassName="highlighted-in-red"
            />
          </h2>
          <ButtonPopup
            onClick={handleShowRegistrationPopup}
            className="trading-tools__btn"
          >
            {t("index_trading-tools-btn-text")}
          </ButtonPopup>
        </div>

        {/* Render the popup */}
        {isPopupOpen && (
          <ShowRegistrationPopup
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            langParam={langParam} // Pass langParam if needed
          />
        )}
      </div>
    </section>
  );
};

TradingTools.propTypes = {
  className: PropTypes.string,
};

TradingTools.defaultProps = {
  className: "",
};
export default TradingTools;
