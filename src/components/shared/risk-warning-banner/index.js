import React, { useContext, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import CommonContext from "../../../context/common-context";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import {
  RISK_DISCLAIMER_BANNER_LABEL,
  RISK_DISCLAIMER_BANNER_SUMMARY_LINE1,
  RISK_DISCLAIMER_BANNER_SUMMARY_LINE2,
  RISK_DISCLAIMER_BANNER_TAP_TO_READ_MORE,
} from "./risk-disclaimer-content";
import RiskDisclaimerPopup from "./risk-disclaimer-popup";

const RiskWarningBanner = ({ className }) => {
  const { complianceBannerRef, isScrolled } = useContext(CommonContext);
  const { isMD, isDesktop } = useWindowSize();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const showInlineReadMore = isMD;
  const showBlockReadMore = !isMD && !isDesktop;
  const showDesktopSingleLine = isDesktop;

  const handleReadMoreClick = (event) => {
    event.stopPropagation();
    setIsDisclaimerOpen(true);
  };

  const handleDisclaimerClose = () => {
    setIsDisclaimerOpen(false);
  };

  return (
    <>
      <div
        className={cn("risk-warning-banner", className, {
          "risk-warning-banner--scrolled": isScrolled,
        })}
        ref={complianceBannerRef}
        role="region"
        aria-label={RISK_DISCLAIMER_BANNER_LABEL}
      >
        <div className="risk-warning-banner__inner risk-warning-banner__inner--collapsed">
          <div className="risk-warning-banner__collapsed">
            {showDesktopSingleLine ? (
              <p className="risk-warning-banner__text risk-warning-banner__text--summary-desktop">
                <strong className="risk-warning-banner__label">
                  {RISK_DISCLAIMER_BANNER_LABEL}
                </strong>{" "}
                <span className="risk-warning-banner__summary-body">
                  {RISK_DISCLAIMER_BANNER_SUMMARY_LINE1}{" "}
                  {RISK_DISCLAIMER_BANNER_SUMMARY_LINE2}
                </span>{" "}
                <button
                  type="button"
                  className="risk-warning-banner__read-more risk-warning-banner__read-more--inline"
                  onClick={handleReadMoreClick}
                  aria-haspopup="dialog"
                  aria-expanded={isDisclaimerOpen}
                >
                  {RISK_DISCLAIMER_BANNER_TAP_TO_READ_MORE}
                </button>
              </p>
            ) : (
              <>
                <div className="risk-warning-banner__summary">
                  <p className="risk-warning-banner__text risk-warning-banner__text--summary-line risk-warning-banner__text--summary-line-1">
                    <strong className="risk-warning-banner__label">
                      {RISK_DISCLAIMER_BANNER_LABEL}
                    </strong>{" "}
                    <span className="risk-warning-banner__summary-body">
                      {RISK_DISCLAIMER_BANNER_SUMMARY_LINE1}
                    </span>
                  </p>
                  <p className="risk-warning-banner__text risk-warning-banner__text--summary-line risk-warning-banner__text--summary-line-2">
                    <span className="risk-warning-banner__summary-body risk-warning-banner__summary-tail">
                      {RISK_DISCLAIMER_BANNER_SUMMARY_LINE2}
                    </span>
                    {showInlineReadMore && (
                      <>
                        {" "}
                        <button
                          type="button"
                          className="risk-warning-banner__read-more risk-warning-banner__read-more--inline"
                          onClick={handleReadMoreClick}
                          aria-haspopup="dialog"
                          aria-expanded={isDisclaimerOpen}
                        >
                          {RISK_DISCLAIMER_BANNER_TAP_TO_READ_MORE}
                        </button>
                      </>
                    )}
                  </p>
                </div>
                {showBlockReadMore && (
                  <button
                    type="button"
                    className="risk-warning-banner__read-more risk-warning-banner__read-more--block"
                    onClick={handleReadMoreClick}
                    aria-haspopup="dialog"
                    aria-expanded={isDisclaimerOpen}
                  >
                    {RISK_DISCLAIMER_BANNER_TAP_TO_READ_MORE}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <RiskDisclaimerPopup
        isOpen={isDisclaimerOpen}
        onClose={handleDisclaimerClose}
      />
    </>
  );
};

RiskWarningBanner.propTypes = {
  className: PropTypes.string,
};

export default RiskWarningBanner;
