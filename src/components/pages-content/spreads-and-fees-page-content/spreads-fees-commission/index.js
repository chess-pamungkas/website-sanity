import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import featureIcon from "../../../../assets/images/icons/features.svg";
import bgCommissionDesktop from "../../../../assets/images/bg/spreads-fees/bg-commission-desktop.svg";
import bgCommissionMobile from "../../../../assets/images/bg/spreads-fees/bg-commission-mobile.svg";
import CommissionTableMobile from "../commission-table-mobile";

const SpreadsFeesCommission = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();

  // Commission data based on Figma design
  const commissionData = [
    {
      currencyCode: "USD",
      currencyName: t("spreads-fees-commission_currency-usd"),
      commissionRate: t("spreads-fees-commission_rate-usd"),
    },
    {
      currencyCode: "EUR",
      currencyName: t("spreads-fees-commission_currency-eur"),
      commissionRate: t("spreads-fees-commission_rate-eur"),
    },
    {
      currencyCode: "GBP",
      currencyName: t("spreads-fees-commission_currency-gbp"),
      commissionRate: t("spreads-fees-commission_rate-gbp"),
    },
    {
      currencyCode: "SGD",
      currencyName: t("spreads-fees-commission_currency-sgd"),
      commissionRate: t("spreads-fees-commission_rate-sgd"),
    },
    {
      currencyCode: "JPY",
      currencyName: t("spreads-fees-commission_currency-jpy"),
      commissionRate: t("spreads-fees-commission_rate-jpy"),
    },
    {
      currencyCode: "CAD",
      currencyName: t("spreads-fees-commission_currency-cad"),
      commissionRate: t("spreads-fees-commission_rate-cad"),
    },
  ];

  return (
    <div className={cn("commission", className)}>
      {/* Background */}
      <div className="commission__bg">
        <img
          src={bgCommissionDesktop}
          alt={t("spreads-fees-commission_background-alt")}
          className="desktop-bg"
        />
        <img
          src={bgCommissionMobile}
          alt={t("spreads-fees-commission_background-alt")}
          className="mobile-bg"
        />
      </div>

      {/* Content */}
      <div className="commission__content container">
        {/* Header Section */}
        <div className="commission__header">
          {/* Badge Group */}
          <div className="commission__badge-group">
            <img
              src={featureIcon}
              alt={t("spreads-fees-commission_feature-icon-alt")}
            />
            <span>{t("spreads-fees-commission_badge-text")}</span>
          </div>

          {/* Title and Subtitle Container */}
          <div className="commission__title-container">
            <h2 className="commission__title">
              {t("spreads-fees_commission_title")}
            </h2>
            <p className="commission__subtitle">
              {t("spreads-fees_commission_subtitle")}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="commission__table-container">
          {isMobile ? (
            <CommissionTableMobile data={commissionData} />
          ) : (
            <>
              {/* Desktop Table Header */}
              <div className="commission__table-header">
                <div className="commission__header-column">
                  {t("spreads-fees_commission_table_header1")}
                </div>
                <div className="commission__header-column">
                  {t("spreads-fees_commission_table_header2")}
                </div>
              </div>

              {/* Desktop Table Body */}
              <div className="commission__table-body">
                {commissionData.map((item, index) => (
                  <div key={index} className="commission__table-row">
                    <div className="commission__row-column commission__row-column--currency">
                      <span className="commission__currency-code">
                        {item.currencyCode}
                      </span>
                      <span className="commission__currency-name">
                        {item.currencyName}
                      </span>
                    </div>
                    <div className="commission__row-column commission__row-column--rate">
                      {item.commissionRate}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

SpreadsFeesCommission.propTypes = {
  className: PropTypes.string,
};

export default SpreadsFeesCommission;
