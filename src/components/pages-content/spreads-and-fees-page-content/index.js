import React, { useEffect, useContext, useState } from "react";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import PropTypes from "prop-types";
import cn from "classnames";
import TableComponent from "../../shared/table";
import {
  ColumnsSpreadTable2,
  DATA_SPREADS_TABLE_COMMODITIES,
  DataSpreadTable2,
  DATA_SPREADS_TABLE_CRYPTO,
  DATA_SPREADS_TABLE_FOREX,
  DATA_SPREADS_TABLE_INDICES,
} from "../../../helpers/spreads-and-fees.config";
import icon from "../../../assets/images/icon--white.svg";
import { ShowRegistrationPopup } from "../../../helpers/constants";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { updateTableDataWithLiveColumn } from "../../../helpers/services/update-table-data-with-live-column";
import {
  FOREX_TRADING_SECTION,
  INDICES_TRADING_SECTION,
  METALS_TRADING_SECTION,
  CRYPTO_TRADING_SECTION,
} from "../../../helpers/config";
import TradingContext from "../../../context/trading-context";
import { GeneralTableColumns } from "../../../helpers/top-market-tables";
import { setLangParam } from "../../../helpers/services/language-service";
import ContainerWrapper from "../../../components/shared/container-wrapper";
import Hero from "../../shared/hero";
import CostSwapRate from "./cost-swap-rate";
import SpreadsFeesCommission from "./spreads-fees-commission";
import OurSpreads from "./our-spreads";
import OurCommunityContent from "../../../components/shared/our-community";

const SpreadsAndFeesPageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const { tradingSymbols, setSelectedSection, setNeedToLoadSymbols } =
    useContext(TradingContext);

  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_INDICES, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_FOREX, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_COMMODITIES, tradingSymbols);
  updateTableDataWithLiveColumn(DATA_SPREADS_TABLE_CRYPTO, tradingSymbols);

  const tabs = [
    {
      id: 1,
      title: t("spreads_tabs_title1"),
      onClick: () => setSelectedSection(FOREX_TRADING_SECTION),
      content: (
        <TableComponent
          isWrapperPadding
          data={DATA_SPREADS_TABLE_FOREX}
          columns={GeneralTableColumns()}
          tableClassName={isRTL ? "spreads-table--rtl" : ""}
          tip={
            <span>
              <span className="bold">*MIN</span>&nbsp;-&nbsp;{t("table-tip1")}
              &nbsp;
              <span className="bold">AVG</span>&nbsp;-&nbsp;{t("table-tip2")}
              &nbsp;
            </span>
          }
          isSearch
        />
      ),
    },
    {
      id: 2,
      title: t("spreads_tabs_title2"),
      onClick: () => setSelectedSection(INDICES_TRADING_SECTION),
      content: (
        <TableComponent
          isWrapperPadding
          data={DATA_SPREADS_TABLE_INDICES}
          columns={GeneralTableColumns()}
          tableClassName={isRTL ? "spreads-table--rtl" : ""}
          tip={
            <span>
              <span className="bold">*MIN</span>&nbsp;-&nbsp;{t("table-tip1")}
              &nbsp;
              <span className="bold">AVG</span>&nbsp;-&nbsp;{t("table-tip2")}
              &nbsp;
            </span>
          }
          isSearch
        />
      ),
    },
    {
      id: 3,
      title: t("spreads_tabs_title3"),
      onClick: () => setSelectedSection(METALS_TRADING_SECTION),
      content: (
        <TableComponent
          isWrapperPadding
          data={DATA_SPREADS_TABLE_COMMODITIES}
          columns={GeneralTableColumns()}
          tableClassName={isRTL ? "spreads-table--rtl" : ""}
          tip={
            <span>
              <span className="bold">*MIN</span>&nbsp;-&nbsp;{t("table-tip1")}
              &nbsp;
              <span className="bold">AVG</span>&nbsp;-&nbsp;{t("table-tip2")}
              &nbsp;
            </span>
          }
          isSearch
        />
      ),
    },
    {
      id: 4,
      title: t("spreads_tabs_title4-fsa"),
      onClick: () => setSelectedSection(CRYPTO_TRADING_SECTION),
      content: (
        <TableComponent
          isWrapperPadding
          data={DATA_SPREADS_TABLE_CRYPTO}
          columns={GeneralTableColumns()}
          tableClassName={isRTL ? "spreads-table--rtl" : ""}
          tip={
            <span>
              <span className="bold">*MIN</span>&nbsp;-&nbsp;{t("table-tip1")}
              &nbsp;
              <span className="bold">AVG</span>&nbsp;-&nbsp;{t("table-tip2")}
              &nbsp;
            </span>
          }
          isSearch
        />
      ),
    },
  ];

  useEffect(() => {
    setSelectedSection(FOREX_TRADING_SECTION);
    setNeedToLoadSymbols(true);

    return () => setNeedToLoadSymbols(false);
  }, []);

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="spreads-fees"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/spreads-fees/spreads-fees-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/spreads-fees/spreads-fees-mobile.svg)"
      />

      <ContainerWrapper>
        <OurSpreads />
      </ContainerWrapper>

      <SpreadsFeesCommission />

      <ContainerWrapper>
        <CostSwapRate />
      </ContainerWrapper>

      {isMobile ? (
        <OurCommunityContent
          customBadgeMessage={t("spreads-fees_our_community_badge_message")}
          customTitle={t("spreads-fees_our_community_title")}
          customSubtitle={t("spreads-fees_our_community_subtitle")}
          customPrimaryButton={t("spreads-fees_our_community_primary_button")}
          customSecondaryButton={t(
            "spreads-fees_our_community_secondary_button"
          )}
        />
      ) : (
        <ContainerWrapper>
          <OurCommunityContent
            customBadgeMessage={t("spreads-fees_our_community_badge_message")}
            customTitle={t("spreads-fees_our_community_title")}
            customSubtitle={t("spreads-fees_our_community_subtitle")}
            customPrimaryButton={t("spreads-fees_our_community_primary_button")}
            customSecondaryButton={t(
              "spreads-fees_our_community_secondary_button"
            )}
          />
        </ContainerWrapper>
      )}

      {/* Render the popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam} // Pass langParam if needed
        />
      )}
    </>
  );
};

SpreadsAndFeesPageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default SpreadsAndFeesPageContent;
