import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { HOME_PAGE_LINK } from "../../../helpers/constants";
import InternalLink from "../internal-link";

const BreadcrumbsTab = ({ className, currentPage, activeTab }) => {
  const { t } = useTranslationWithVariables();

  const marketTabs = [
    { key: "all-markets", label: "All Markets Overview", link: "/all-markets" },
    { key: "metals", label: "Metals", link: "/metals" },
    { key: "crypto", label: "Crypto", link: "/crypto" },
    { key: "forex", label: "Forex", link: "/forex" },
    { key: "shares", label: "Shares", link: "/shares" },
    { key: "indices", label: "Indices", link: "/indices" },
    { key: "energies", label: "Energies", link: "/energies" },
    { key: "etf", label: "ETF", link: "/etf" },
  ];

  // Check if activeTab exists in marketTabs
  const isActiveTabValid = marketTabs.some((tab) => tab.key === activeTab);

  return (
    <div className={cn("breadcrumbs-tab", className)}>
      {/* <div className="container"> */}
      <div className="breadcrumbs-tab__content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs-tab__breadcrumbs">
          <InternalLink
            to={HOME_PAGE_LINK}
            className="breadcrumbs-tab__home-link"
          >
            {t("breadcrumbs_home")}
          </InternalLink>
          <span className="breadcrumbs-tab__separator">/</span>
          <span className="breadcrumbs-tab__current-page">{currentPage}</span>
        </div>

        {/* Market Tabs */}
        <div className="breadcrumbs-tab__tabs">
          {marketTabs.map((tab) => (
            <InternalLink
              key={tab.key}
              to={tab.link}
              className={cn("breadcrumbs-tab__tab", {
                "breadcrumbs-tab__tab--hide-desktop-lg":
                  tab.key === "all-markets",
                "breadcrumbs-tab__tab--active":
                  isActiveTabValid && activeTab === tab.key,
              })}
              data-tab-key={tab.key}
            >
              <span>{t(`breadcrumbs_tab_${tab.key}`)}</span>
            </InternalLink>
          ))}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

BreadcrumbsTab.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
};

export default BreadcrumbsTab;
