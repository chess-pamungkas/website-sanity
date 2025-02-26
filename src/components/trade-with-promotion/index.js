import React, { useRef, useContext, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { animated } from "react-spring";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import airbnbIcon from "../../assets/images/icons/companies/airbnb.svg";
import amazonIcon from "../../assets/images/icons/companies/amazon.svg";
import appleIcon from "../../assets/images/icons/companies/apple.svg";
import bitcoinIcon from "../../assets/images/icons/companies/bitcoin.svg";
import greyDot from "../../assets/images/icons/companies/grey_dot.svg";
import logoIcon from "../../assets/images/icons/companies/logo.svg";
import manIcon from "../../assets/images/icons/companies/man.svg";
import metaIcon from "../../assets/images/icons/companies/meta.svg";
import netflixIcon from "../../assets/images/icons/companies/netflix.svg";
import redDot from "../../assets/images/icons/companies/red_dot.svg";
import rippleIcon from "../../assets/images/icons/companies/ripple.svg";
import teslaIcon from "../../assets/images/icons/companies/tesla.svg";
import womanIcon from "../../assets/images/icons/companies/woman.svg";
import ButtonPopup from "../shared/button-popup";
import TypingAnimation from "../shared/typing-animation";
import { MarketingContext } from "../../context/marketing-context";
import {
  SECT2_GROUP1_DEFAULT,
  SECT2_GROUP2_DEFAULT,
  SECT2_TEXT_SEQUENCES,
} from "../../helpers/marketing.config";
import {
  getSect2TextSequence,
  transformParamToKey,
} from "../../helpers/services/marketing-service";
import { useIntersectionObserver } from "../../helpers/hooks/use-intersection-observer";
import { INTERSECTION_OBSERVER_CONFIG } from "../../helpers/animation.config";
import { useSectionAnimation } from "./use-section-animation";
import HighlightedLocalizationText from "../shared/highlighted-localization-text";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import {
  DIR_LTR,
  DIR_RTL,
  ShowRegistrationPopup,
} from "../../helpers/constants";
import { setLangParam } from "../../helpers/services/language-service";

const TradeWithPromotion = ({ className, sectionRef }) => {
  const typingContainerRef = useRef();

  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();

  const sectionIntersectionRef = useIntersectionObserver(
    sectionRef,
    INTERSECTION_OBSERVER_CONFIG.TWPSection
  );
  const typingIntersectionRef = useIntersectionObserver(typingContainerRef, {
    freezeOnceVisible: true,
  });

  const {
    sectionAnimation1,
    sectionAnimation2,
    sectionAnimation3,
    sectionAnimation4,
    sectionAnimation5,
    sectionAnimation6,
    sectionAnimation7,
    sectionAnimation8,
    sectionAnimation9,
  } = useSectionAnimation(sectionIntersectionRef);
  const { sect2 } = useContext(MarketingContext);

  const content = SECT2_TEXT_SEQUENCES[transformParamToKey(sect2)];

  const titles = content
    ? getSect2TextSequence(content?.group1, content?.group2)
    : getSect2TextSequence(SECT2_GROUP1_DEFAULT, SECT2_GROUP2_DEFAULT);

  const icons = content ? content.symbols : [];
  const langParam = setLangParam();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section
      className={cn("trade-with-promotion", className, {
        "trade-with-promotion--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
      ref={sectionRef}
    >
      <div className="trade-with-promotion-bg" />
      <animated.img
        style={sectionAnimation1}
        src={icons.length > 0 && icons[0] ? icons[0] : logoIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--dynamic-logo-1"
        )}
      />
      <animated.img
        style={sectionAnimation2}
        src={icons.length > 0 && icons[1] ? icons[1] : appleIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--dynamic-logo-2"
        )}
      />
      <animated.img
        style={sectionAnimation3}
        src={icons.length > 0 && icons[2] ? icons[2] : rippleIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--dynamic-logo-3"
        )}
      />
      <img
        src={manIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--man"
        )}
      />
      <img
        src={womanIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--woman"
        )}
      />
      <animated.img
        style={sectionAnimation4}
        src={netflixIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--netflix"
        )}
      />
      <animated.img
        style={sectionAnimation5}
        src={teslaIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--tesla"
        )}
      />
      <animated.img
        style={sectionAnimation6}
        src={airbnbIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--airbnb"
        )}
      />
      <img
        src={greyDot}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--grey-dot"
        )}
      />
      <img
        src={redDot}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--red-dot"
        )}
      />
      <animated.img
        style={sectionAnimation7}
        src={metaIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--meta"
        )}
      />
      <animated.img
        style={sectionAnimation8}
        src={amazonIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--amazon"
        )}
      />
      <animated.img
        style={sectionAnimation9}
        src={bitcoinIcon}
        alt=""
        className={cn(
          "trade-with-promotion__icon",
          "trade-with-promotion__icon--bitcoin"
        )}
      />
      <div className="trade-with-promotion__wrapper">
        <h2 className="trade-with-promotion__title">
          <HighlightedLocalizationText
            localizationText="index_trade-with-promotion-title"
            wordsToHighlight="trade-with-promotion-title-accent"
            accentClassName="bold"
          />
        </h2>
        <div className="trade-with-promotion__input" ref={typingContainerRef}>
          <span className="trade-with-promotion__input-text">
            {typingIntersectionRef?.isIntersecting ? (
              <TypingAnimation keywords={titles} />
            ) : (
              t(titles[0])
            )}
          </span>
        </div>

        <div className="trade-with-promotion__promo">
          <div className="trade-with-promotion__block">
            <p className="trade-with-promotion__promo-text">
              <span>
                {t(`index_trade-with-promotion-promo-text1-fsa`)}
                &nbsp;
              </span>
              <span className="bold">
                {t(`index_trade-with-promotion-promo-text-bold-fsa`)}
                &nbsp;
              </span>
              <span>{t(`index_trade-with-promotion-promo-text2-fsa`)}</span>
            </p>
          </div>
          <div className="trade-with-promotion__block">
            <div className="trade-with-promotion__btn-wrapper">
              <ButtonPopup
                onClick={handleShowRegistrationPopup}
                className="trade-with-promotion__btn"
              >
                {t("button-start-now")}
              </ButtonPopup>
            </div>
          </div>
        </div>
      </div>

      {/* Render the popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam} // Pass langParam if needed
        />
      )}
    </section>
  );
};

TradeWithPromotion.propTypes = {
  className: PropTypes.string,
  sectionRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current:
        typeof Element === "undefined"
          ? PropTypes.any
          : PropTypes.instanceOf(Element),
    }),
  ]),
};

export default TradeWithPromotion;
