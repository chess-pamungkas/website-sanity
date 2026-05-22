import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import legalCardDesktop from "../../../../assets/images/legal/legal-card-desktop.svg";
import legalCardMobile from "../../../../assets/images/legal/legal-card-mobile.svg";

const LegalRegulatorItem = ({
  className,
  icon,
  title,
  titleAccent,
  text,
  anchorLink,
  index,
}) => {
  const { t } = useTranslationWithVariables();

  return (
    <div className={cn("legal-regulator-item", className)}>
      {/* Card Background - Desktop */}
      <div className="legal-regulator-item__background legal-regulator-item__background--desktop">
        <img
          src={legalCardDesktop}
          alt=""
          className="legal-regulator-item__card-bg"
        />
      </div>

      {/* Card Background - Mobile */}
      <div className="legal-regulator-item__background legal-regulator-item__background--mobile">
        <img
          src={legalCardMobile}
          alt=""
          className="legal-regulator-item__card-bg"
        />
      </div>

      {/* Content Container */}
      <div className="legal-regulator-item__content">
        {/* Icon */}
        <div className="legal-regulator-item__icon-container">
          <img src={icon} alt="" className="legal-regulator-item__icon" />
        </div>

        {/* Text Content Wrapper */}
        <div className="legal-regulator-item__text-content-wrapper">
          {/* Title */}
          <div className="legal-regulator-item__title-container">
            <p className="legal-regulator-item__title">
              {t(title)} {t(titleAccent)}
            </p>
          </div>

          {/* Description Text */}
          <div className="legal-regulator-item__text-container">
            <p className="legal-regulator-item__text">{t(text)}</p>
          </div>
        </div>

        {/* Read More Link */}
        {/* <div className="legal-regulator-item__link-container">
          <AnchorLink href={anchorLink} className="legal-regulator-item__link">
            {t("legal-regulator-read-more-fsa")}
          </AnchorLink>
        </div> */}
      </div>
    </div>
  );
};

LegalRegulatorItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  titleAccent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  anchorLink: PropTypes.string.isRequired,
  index: PropTypes.number,
};

export default LegalRegulatorItem;
