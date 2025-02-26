import React, { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import Slider from "../../../shared/slider";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  CLIENTS_MARKS,
  COST_PER_CLIENT,
  DEFAULT_CLIENTS,
  MAX_CLIENTS,
  MIN_CLIENTS,
} from "../../../../helpers/partners.config";
import { formatMoney } from "../../../../helpers/services/format-money";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../../../helpers/constants";

const IncomeSlider = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const [clientsCount, setClientsCount] = useState(DEFAULT_CLIENTS);
  const [totalIncome, setTotalIncome] = useState(
    DEFAULT_CLIENTS * COST_PER_CLIENT
  );

  const onSliderChange = (value) => {
    setClientsCount(value);
    setTotalIncome(value * COST_PER_CLIENT);
  };

  const renderMark = (props) => {
    return (
      <div className={props.className}>
        <span {...props} className={`${props.className}-v-line`} />
        <span {...props} className={`${props.className}-number`}>
          {props.key}
        </span>
      </div>
    );
  };

  return (
    <section
      className={cn("partners-income", className, {
        "partners-income--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="partners-income__wrapper">
        <p className="partners-income__title">
          {t(`partners_income-slider-title-fsa`)}
        </p>
        <p className="partners-income__description">
          {t(`partners_income-slider-description-fsa`)}
        </p>
        <div className="partners-income__total-clients">
          <p className="partners-income__total-num">{clientsCount}</p>
          <p className="partners-income__total-note">
            {t(`partners_income-slider-clients-note-fsa`)}
          </p>
        </div>
        <Slider
          marks={CLIENTS_MARKS}
          minValue={MIN_CLIENTS}
          maxValue={MAX_CLIENTS}
          currentValue={clientsCount}
          onChange={onSliderChange}
          className={"partners-income__slider"}
          trackClassName={"partners-income__slider-track"}
          thumbClassName={"partners-income__slider-thumb"}
          markClassName={"partners-income__slider-mark"}
          renderMark={renderMark}
          invert={isRTL}
        />
        <div className="partners-income__total-income">
          <p className="partners-income__total-num">
            &#36; {formatMoney(totalIncome)}
          </p>
          <p className="partners-income__total-note">
            {t(`partners_income-slider-income-note-fsa`)}
          </p>
        </div>
      </div>
    </section>
  );
};

IncomeSlider.propTypes = {
  className: PropTypes.string,
};

export default IncomeSlider;
