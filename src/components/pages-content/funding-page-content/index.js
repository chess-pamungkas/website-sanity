import React, { useState, useContext } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import WithdrawalTableComponent from "../../shared/table/withdrawal-table";
import {
  getWithdrawalDataForFigma,
  getWithdrawalColumnsForFigma,
  getDepositDataForFigma,
  getDepositColumnsForFigma,
} from "../../../helpers/withdrawal.config";
import TopMarketLayout from "../../top-market-layout";
import Tabs from "../../shared/tabs";
import {
  ShowRegistrationPopup,
  PAYMENT_SYSTEMS_FSA,
} from "../../../helpers/constants";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import ContainerWrapper from "../../../components/shared/container-wrapper";
import Hero from "../../shared/hero";
import FastInFastOutContent from "./fastin-fastout";
import FundingWithdrawalsHeader from "./funding-withdrawals-header";
import PaymentSystemsContent from "./payment-systems";
import OurCommunityContent from "../../../components/shared/our-community";
import {
  ButtonPrimaryStandard,
  ButtonSecondaryStandard,
  ButtonContainer,
} from "../../shared/reusable-buttons";
import LanguageContext from "../../../context/language-context";
import { PORTAL_LANGUAGES_MAP } from "../../../helpers/lang-options.config";
import { topLevelDomain } from "../../../helpers/entity-resolver";

const FundingPageContent = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const isRTL = useRtlDirection();
  const [isDepositTab, setIsDepositTab] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const { selectedLanguage } = useContext(LanguageContext);

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const tabs = [
    {
      id: 1,
      title: t("withdrawal_tabs_title1"),
      onClick: () => setIsDepositTab(true),
      content: (
        <div className="table-container-wrapper">
          <WithdrawalTableComponent
            data={getDepositDataForFigma()}
            columns={getDepositColumnsForFigma()}
            className="withdrawal-table"
            isMobile={isMobile}
            isDeposit={true}
          />
        </div>
      ),
    },
    {
      id: 2,
      title: t("withdrawal_tabs_title2"),
      onClick: () => setIsDepositTab(false),
      content: (
        <div className="table-container-wrapper">
          <WithdrawalTableComponent
            data={getWithdrawalDataForFigma()}
            columns={getWithdrawalColumnsForFigma()}
            className={cn("withdrawal-table", "withdrawal-table--wide")}
            isMobile={isMobile}
            isDeposit={false}
          />
        </div>
      ),
    },
  ];

  const GetDepositLink = () => {
    const languageCode = PORTAL_LANGUAGES_MAP[selectedLanguage.id];
    return `https://portal.oqtima.${topLevelDomain}/funds/deposit?language=${languageCode}`;
  };

  const GetWithdrawalLink = () => {
    const languageCode = PORTAL_LANGUAGES_MAP[selectedLanguage.id];
    return `https://portal.oqtima.${topLevelDomain}/funds/withdrawal?language=${languageCode}`;
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="funding-withdrawals"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/funding-withdrawals/funding-withdrawals-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/funding-withdrawals/funding-withdrawals-mobile.svg)"
      />

      <div className="funding-page">
        <ContainerWrapper>
          <FastInFastOutContent />
          <FundingWithdrawalsHeader />
          <TopMarketLayout className="top-market-layout--withdrawal">
            <Tabs tabList={tabs} />
          </TopMarketLayout>
          <ButtonContainer>
            <ButtonPrimaryStandard
              text={isDepositTab ? t("deposit_button") : t("withdrawal_button")}
              onClick={() => {
                const link = isDepositTab
                  ? GetDepositLink()
                  : GetWithdrawalLink();
                window.open(link, "_blank");
              }}
            />
            <ButtonSecondaryStandard
              text={t("try_demo_account_button")}
              onClick={() => {
                setIsPopupOpen(true);
              }}
            />
          </ButtonContainer>

          <PaymentSystemsContent isDepositTab={isDepositTab} />
        </ContainerWrapper>

        {isMobile ? (
          <OurCommunityContent
            customBadgeMessage={t(
              "funding-withdrawals_our_community_badge_message"
            )}
            customTitle={t("funding-withdrawals_our_community_title")}
            customSubtitle={t("funding-withdrawals_our_community_subtitle")}
            customPrimaryButton={t(
              "funding-withdrawals_our_community_primary_button"
            )}
            customSecondaryButton={t(
              "funding-withdrawals_our_community_secondary_button"
            )}
          />
        ) : (
          <ContainerWrapper>
            <OurCommunityContent
              customBadgeMessage={t(
                "funding-withdrawals_our_community_badge_message"
              )}
              customTitle={t("funding-withdrawals_our_community_title")}
              customSubtitle={t("funding-withdrawals_our_community_subtitle")}
              customPrimaryButton={t(
                "funding-withdrawals_our_community_primary_button"
              )}
              customSecondaryButton={t(
                "funding-withdrawals_our_community_secondary_button"
              )}
            />
          </ContainerWrapper>
        )}

        {/* Render the popup */}
        {isPopupOpen && (
          <ShowRegistrationPopup
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </>
  );
};

FundingPageContent.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default FundingPageContent;
