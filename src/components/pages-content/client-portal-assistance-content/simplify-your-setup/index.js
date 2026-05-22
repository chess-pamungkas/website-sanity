import React, { useContext, useState } from "react";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import LanguageContext from "../../../../context/language-context";
import { BadgeSecurityIconGeneral as BadgeSecurityIcon } from "../../../shared/shared-icons";
import SimplifyYourSetupImage from "../../../../assets/images/client-portal-assistance/simplify-your-setup.svg";

const SimplifyYourSetup = () => {
  const { t } = useTranslationWithVariables();

  return (
    <section className="simplify-your-setup">
      <div className="simplify-your-setup__container">
        <div className="simplify-your-setup__content">
          <div className="simplify-your-setup__image">
            <img
              src={SimplifyYourSetupImage}
              alt="Simplify Your Setup"
              className="simplify-your-setup__image-content"
            />
          </div>
          <div className="simplify-your-setup__text">
            {/* Badge */}
            <div className="simplify-your-setup__badge">
              <img
                src={BadgeSecurityIcon}
                alt={t("simplify_your_setup_badge")}
                width={24}
                height={24}
              />
              <span className="simplify-your-setup__badge-text">
                {t("simplify_your_setup_badge")}
              </span>
            </div>

            {/* Title */}
            <h2 className="simplify-your-setup__title">
              {t("simplify_your_setup_title")}
            </h2>

            {/* Description */}
            <p className="simplify-your-setup__description">
              {t("simplify_your_setup_description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimplifyYourSetup;
