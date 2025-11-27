import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import MtItemAdvantageList from "../shared/mt-advantage-list";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../helpers/constants";

const MtPromotion = forwardRef(
  (
    {
      className,
      title,
      advantages,
      advantagesTitle,
      downloadTitle,
      image,
      platformType = "mt4",
    },
    ref
  ) => {
    const isRTL = useRtlDirection();

    return (
      <section
        className={cn("mt-promotion", className, {
          "mt-promotion--rtl": isRTL,
        })}
        dir={isRTL ? DIR_RTL : DIR_LTR}
      >
        <div className={cn("mt-promotion__wrapper")}>
          <div
            className={cn("mt-promotion__block", "mt-promotion__block--flexed")}
          >
            <img
              src={image}
              alt={advantagesTitle}
              className="mt-promotion__img"
            />
          </div>
          <div className="mt-promotion__block">
            <div className="mt-promotion__description">
              <div
                className="mt-promotion__advantages"
                id="mt-advantage-list__platform-section"
              >
                <MtItemAdvantageList
                  title={advantagesTitle}
                  advantages={advantages}
                  className="mt-promotion-market-item-advantages"
                  platformType={platformType}
                />
              </div>
            </div>
            {/* <div className="mt-promotion__download" ref={ref} id="mt-download">
              <h2
                className={cn(
                  "mt-promotion__title",
                  "mt-promotion__title--download"
                )}
              >
                {downloadTitle}
              </h2>
            </div> */}
          </div>
        </div>
      </section>
    );
  }
);

MtPromotion.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  advantages: PropTypes.array.isRequired,
  advantagesTitle: PropTypes.string.isRequired,
  downloadTitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  platformType: PropTypes.oneOf(["mt4", "mt5"]),
};

// Set display name for the component
MtPromotion.displayName = "MtPromotion";

export default MtPromotion;
