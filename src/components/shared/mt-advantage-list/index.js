import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import badgeSecurity from "../../../assets/images/icons/badge-security.svg";
import circleMark from "../../../assets/images/icons/circle-mark.svg";
import bgDesktop from "../../../assets/images/bg/mt4-mt5-trade-the-next-level-desktop.svg";
import bgMobile from "../../../assets/images/bg/mt4-mt5-trade-the-next-level-mobile.svg";
import Tabs from "../tabs";

const MtItemAdvantageList = ({
  className,
  advantages,
  title,
  platformType = "mt4", // Add platformType prop
}) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();

  return (
    <div
      className={cn("mt-advantage-list", className, {
        "mt-advantage-list--rtl": isRTL,
      })}
    >
      <div className="mt-advantage-list__container">
        {/* Background Image */}
        <div className="mt-advantage-list__bg-image">
          <img src={isMobile ? bgMobile : bgDesktop} alt="" />
        </div>

        {/* Content */}
        <div className="mt-advantage-list__content">
          {/* Badge */}
          <div className="mt-advantage-list__badge">
            <img
              src={badgeSecurity}
              alt=""
              className="mt-advantage-list__badge-icon"
            />
            <span className="mt-advantage-list__badge-text">
              {t("mt-advantage-list_badge-text")}
            </span>
          </div>

          {/* Title */}
          <h2 className="mt-advantage-list__title">
            {title || t("mt-advantage-list_title")}
          </h2>

          {/* Features List */}
          <div className="mt-advantage-list__features">
            {advantages.map((item, index) => (
              <div
                key={item.key || index}
                className="mt-advantage-list__feature-item"
              >
                <img
                  src={circleMark}
                  alt=""
                  className="mt-advantage-list__feature-icon"
                />
                <span className="mt-advantage-list__feature-text">
                  {t(item.text)}
                </span>
              </div>
            ))}
          </div>

          {/* Platform Selection */}
          <div className="mt-advantage-list__platform-section">
            <Tabs
              isPlatformSelection={true}
              platformType={platformType}
              classname="mt-advantage-list__platform-tabs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

MtItemAdvantageList.propTypes = {
  className: PropTypes.string,
  advantages: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  platformType: PropTypes.oneOf(["mt4", "mt5"]),
};

export default MtItemAdvantageList;
