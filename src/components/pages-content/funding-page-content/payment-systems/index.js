import React from "react";
import PropTypes from "prop-types";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import desktopPaymentSystemsSVG from "../../../../assets/images/bg/funding-withdrawals/payment-systems-desktop.svg";
import mobilePaymentSystemsSVG from "../../../../assets/images/bg/funding-withdrawals/payment-systems-mobile.svg";

/** Match SVG root width/height (Lighthouse unsized-images + CLS). */
const PAYMENT_SYSTEMS_BG_SIZE = {
  mobile: { width: 353, height: 226 },
  desktop: { width: 1241, height: 76 },
};

const PaymentSystemsContent = ({ isDepositTab = true }) => {
  const { isMobile } = useWindowSize();
  const { t } = useTranslationWithVariables();

  const backgroundSrc = isMobile
    ? mobilePaymentSystemsSVG
    : desktopPaymentSystemsSVG;
  const bgSize = isMobile
    ? PAYMENT_SYSTEMS_BG_SIZE.mobile
    : PAYMENT_SYSTEMS_BG_SIZE.desktop;

  return (
    <div className="payment-systems-section">
      <div className="payment-systems-section__container">
        {/* Payment Systems Background with Logos */}
        <div className="payment-systems-section__background">
          <img
            src={backgroundSrc}
            alt="Payment Systems"
            className="payment-systems-section__background-image"
            width={bgSize.width}
            height={bgSize.height}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Informational Text */}
        <div className="payment-systems-section__info">
          <div className="payment-systems-section__info-text">
            {isDepositTab ? (
              // Deposit Disclaimer Text
              <>
                <p>{t("deposit_disclaimer1-fsa")}</p>
                <p>{t("deposit_disclaimer2-fsa")}</p>
                <p>{t("deposit_disclaimer3-fsa")}</p>
              </>
            ) : (
              // Withdrawal Disclaimer Text
              <>
                <p>{t("withdrawal_disclaimer1-fsa")}</p>
                <p>{t("withdrawal_disclaimer2-fsa")}</p>
                <p>{t("withdrawal_disclaimer3_1-fsa")}</p>
                <p>{t("withdrawal_disclaimer3_2-fsa")}</p>
                <p>{t("withdrawal_disclaimer4-fsa")}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentSystemsContent.propTypes = {
  isDepositTab: PropTypes.bool,
};

export default PaymentSystemsContent;
