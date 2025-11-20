import React from "react";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";

// Import icons
import badgeSecurityIcon from "../../../../assets/images/icons/badge-security.svg";
import bgCardFastInFastOut from "../../../../assets/images/bg/funding-withdrawals/bg-card-fastin-fastout.svg";
import instantDepositIcon from "../../../../assets/images/icons/funding-withdrawals/instant-deposit.svg";
import sameDayWithdrawalsIcon from "../../../../assets/images/icons/funding-withdrawals/same-day-withdrawals.svg";
import zeroFeesIcon from "../../../../assets/images/icons/funding-withdrawals/zero-fees.svg";
import circleMarkIcon from "../../../../assets/images/icons/circle-mark.svg";

const FastInFastOutContent = () => {
  const { isMobile } = useWindowSize();
  const { t } = useTranslationWithVariables();

  const features = [
    {
      id: "instant-deposit",
      icon: instantDepositIcon,
      title: t("funding-withdrawals_fast-in-fast-out-instant-deposit"),
      description: t(
        "funding-withdrawals_fast-in-fast-out-fund-your-account-in-seconds"
      ),
    },
    {
      id: "same-day-withdrawals",
      icon: sameDayWithdrawalsIcon,
      title: t("funding-withdrawals_fast-in-fast-out-same-day-withdrawals"),
      description: t(
        "funding-withdrawals_fast-in-fast-out-access-your-money-fast"
      ),
    },
    {
      id: "zero-fees",
      icon: zeroFeesIcon,
      title: t("funding-withdrawals_fast-in-fast-out-zero-fees"),
      description: t("funding-withdrawals_fast-in-fast-out-no-hidden-charges"),
    },
  ];

  return (
    <div className="fastin-fastout-section">
      <div className="fastin-fastout-section__container">
        {/* Header Section */}
        <div className="fastin-fastout-section__header">
          {/* Badge */}
          <div className="fastin-fastout-section__badge">
            <img
              src={badgeSecurityIcon}
              alt={t("fastin-fastout_badge-icon-alt")}
              className="fastin-fastout-section__badge-icon"
            />
            <span className="fastin-fastout-section__badge-text">
              {t("funding-withdrawals_fast-in-fast-out-title")}
            </span>
          </div>

          {/* Title */}
          <h2 className="fastin-fastout-section__title">
            {t("funding-withdrawals_fast-in-fast-out-text")}
          </h2>

          {/* Description */}
          <p className="fastin-fastout-section__description">
            {t("funding-withdrawals_fast-in-fast-out-description")}
          </p>
        </div>

        {/* Features Cards */}
        <div className="fastin-fastout-section__features">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="fastin-fastout-section__card"
              style={{ backgroundImage: `url(${bgCardFastInFastOut})` }}
            >
              <div className="fastin-fastout-section__card-content">
                {/* Card Icon */}
                <div className="fastin-fastout-section__card-icon">
                  <img src={feature.icon} alt={feature.title} />
                </div>

                {/* Card Details */}
                <div className="fastin-fastout-section__card-details">
                  <h3 className="fastin-fastout-section__card-title">
                    {feature.title}
                  </h3>

                  <div className="fastin-fastout-section__card-description">
                    <img
                      src={circleMarkIcon}
                      alt={t("fastin-fastout_check-icon-alt")}
                      className="fastin-fastout-section__card-check"
                    />
                    <span>{feature.description}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FastInFastOutContent;
