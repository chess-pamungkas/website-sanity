import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import BulletIcon from "../../../../assets/images/icons/client-portal-assistance/guide-bullet-icon.svg";
import GettingStartedIcon from "../../../../assets/images/icons/client-portal-assistance/guide-getting-started.svg";
import VerificationIcon from "../../../../assets/images/icons/client-portal-assistance/guide-verification.svg";
import FundingAccountIcon from "../../../../assets/images/icons/client-portal-assistance/guide-funding-your-account.svg";
import LoyaltyProgramIcon from "../../../../assets/images/icons/client-portal-assistance/guide-loyalty-program.svg";

const OnboardingGuideStep = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();

  // Define steps data
  const steps = [
    {
      id: "getting_started",
      icon: GettingStartedIcon,
      titleKey: "client-portal-assistance_getting_started_title",
      items: [
        "client-portal-assistance_getting_started_create_account",
        "client-portal-assistance_getting_started_update_password",
        "client-portal-assistance_getting_started_access_client_portal",
      ],
    },
    {
      id: "verification",
      icon: VerificationIcon,
      titleKey: "client-portal-assistance_verification_title",
      items: [
        "client-portal-assistance_verification_verify_identity",
        "client-portal-assistance_verification_submit_documents",
        "client-portal-assistance_verification_check_status",
      ],
    },
    {
      id: "funding_account",
      icon: FundingAccountIcon,
      titleKey: "client-portal-assistance_funding_account_title",
      items: [
        "client-portal-assistance_funding_account_how_to_deposit",
        "client-portal-assistance_funding_account_payment_methods",
        "client-portal-assistance_funding_account_deposit_troubleshooting",
      ],
    },
    {
      id: "loyalty_program",
      icon: LoyaltyProgramIcon,
      titleKey: "client-portal-assistance_loyalty_program_title",
      items: [
        "client-portal-assistance_loyalty_program_how_it_works",
        "client-portal-assistance_loyalty_program_tiers_benefits",
        "client-portal-assistance_loyalty_program_access_client_portal",
      ],
    },
  ];

  return (
    <section
      className={cn("onboarding-guide-step", className, {
        "onboarding-guide-step--rtl": isRTL,
      })}
    >
      <div className="onboarding-guide-step__container">
        <div
          className={cn("onboarding-guide-step__grid", {
            "onboarding-guide-step__grid--mobile": isMobile,
          })}
        >
          {steps.map((step) => (
            <div key={step.id} className="onboarding-guide-step__card">
              <div className="onboarding-guide-step__card-icon">
                <img src={step.icon} alt={t(step.titleKey)} />
              </div>

              <h3 className="onboarding-guide-step__title">
                {t(step.titleKey)}
              </h3>

              <ul className="onboarding-guide-step__list">
                {step.items.map((itemKey, index) => (
                  <li key={index} className="onboarding-guide-step__item">
                    <img
                      src={BulletIcon}
                      alt="bullet"
                      className="onboarding-guide-step__bullet-icon"
                    />
                    <span className="onboarding-guide-step__item-text">
                      {t(itemKey)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

OnboardingGuideStep.propTypes = {
  className: PropTypes.string,
};

export default OnboardingGuideStep;
