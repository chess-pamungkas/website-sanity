import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import icon from "../../../../assets/images/icons/all-markets/advantage-icon.svg";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { ButtonLearnMore } from "../../../shared/reusable-buttons";
import bgCard from "../../../../assets/images/bg/all-markets/bg-card.svg";
import { useI18next } from "gatsby-plugin-react-i18next";

const MarketItemAdvantageList = ({ className, advantages, link }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const { navigate } = useI18next();

  return (
    <div
      className={cn("market-item-advantages-list", className, {
        "market-item-advantages-list--rtl": isRTL,
      })}
    >
      <div className="market-item-advantages-list__container">
        {/* Background Image */}
        <div className="market-item-advantages-list__bg-image">
          <img src={bgCard} alt="" width={798} height={479} decoding="async" />
        </div>

        {/* Content */}
        <div className="market-item-advantages-list__content">
          {/* Title */}
          <h3 className="market-item-advantages-list__title">
            {t("all-markets_market-items-list-benefits-title")}
          </h3>

          {/* Advantages List */}
          <div className="market-item-advantages-list__advantages">
            {advantages.map((item, index) => (
              <div
                key={item.key || index}
                className="market-item-advantages-list__advantage-item"
              >
                <img
                  src={icon}
                  alt=""
                  width={24}
                  height={24}
                  className="market-item-advantages__icon"
                  decoding="async"
                />
                <span className="market-item-advantages-list__advantage-text">
                  {t(item.text)}
                </span>
              </div>
            ))}
          </div>

          {/* Learn More Button */}
          {link && (
            <div className="market-item-advantages-list__learn-more-wrapper">
              <ButtonLearnMore
                text={t("all-markets_market-items-list-learn-more-btn")}
                onClick={() => {
                  // Use navigate from useI18next to preserve language prefix in browser history
                  // Extract path from link (remove domain if present)
                  const linkPath = link.startsWith("http")
                    ? new URL(link).pathname
                    : link;
                  navigate(linkPath);
                }}
                className="market-item-advantages-list__learn-more-btn"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MarketItemAdvantageList.propTypes = {
  className: PropTypes.string,
  advantages: PropTypes.arrayOf(PropTypes.object).isRequired,
  link: PropTypes.string,
};

export default MarketItemAdvantageList;
