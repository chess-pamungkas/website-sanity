import React from "react";
import PropTypes from "prop-types";
import Hero from "../../../shared/hero";
import { isAuditEnvironment } from "../../../../helpers/is-audit-environment";

const MainPromotion = ({ className, isShowHero = true }) => {
  return (
    <Hero
      className={className}
      isShowHero={isShowHero}
      heroType="main-promotion"
      showWarning={true}
      showHandImage={true}
      showHeroImage={true}
      showTrustPilot={!isAuditEnvironment()}
      // desktopBackground="url(../../../../assets/images/bg/main-promotion-desktop.svg)"
      // mobileBackground="url(../../../../assets/images/bg/main-promotion-mobile.svg)"
    />
  );
};

MainPromotion.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};
export default MainPromotion;
