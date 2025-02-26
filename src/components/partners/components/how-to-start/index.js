import React, { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { stringTransformToKebabCase } from "../../../../helpers/services/string-service";
import HowToStartItem from "../how-to-start-item";
import { START_STEPS } from "../../../../helpers/partners.config";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import ButtonPopup from "../../../shared/button-popup";
import {
  DIR_LTR,
  DIR_RTL,
  ShowRegistrationPopup,
} from "../../../../helpers/constants";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { getArrows } from "./get-arrows";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { setLangParam } from "../../../../helpers/services/language-service";

const HowToStart = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile, isTablet, isLG, isXL } = useWindowSize();
  const isRTL = useRtlDirection();
  const { arrow1, arrow2 } = getArrows(isMobile, isTablet, isLG, isXL);
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
      className={cn("partners-start", className, {
        "partners-start--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="partners-start__wrapper">
        <h2 className="partners-start__title">
          {t(`partners_start-title-fsa`)}
        </h2>
        <div className="partners-start__items">
          {START_STEPS.length > 0 &&
            START_STEPS.map((block) => (
              <HowToStartItem
                key={`start-item-${stringTransformToKebabCase(block.text)}`}
                icon={block.icon}
                text={block.text}
                accent={block.accent}
              />
            ))}
        </div>
        <ButtonPopup
          className={cn("partners-start__btn")}
          onClick={handleShowRegistrationPopup}
        >
          {t(`partners_start-btn-fsa`)}
        </ButtonPopup>
        <img src={arrow1} alt="" className="partners-start__arrow1" />
        <img src={arrow2} alt="" className="partners-start__arrow2" />
      </div>

      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam}
        />
      )}
    </section>
  );
};

HowToStart.propTypes = {
  className: PropTypes.string,
};

export default HowToStart;
