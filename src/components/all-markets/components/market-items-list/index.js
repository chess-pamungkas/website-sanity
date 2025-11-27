import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { getAllMarkets } from "../../../../helpers/all-markets.config";
import MarketItem from "../market-item";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../../../helpers/constants";

const MarketItemsList = ({ className }) => {
  const markets = getAllMarkets();
  const isRTL = useRtlDirection();

  return (
    <section
      className={cn("market-items-list", className, {
        "market-items-list--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      {markets.map((item, index) => (
        <MarketItem key={`market-item-${item.title}`} {...item} index={index} />
      ))}
    </section>
  );
};

MarketItemsList.propTypes = {
  className: PropTypes.string,
};
export default MarketItemsList;
