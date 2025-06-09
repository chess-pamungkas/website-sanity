import { useContext } from "react";
import LanguageContext from "../context/language-context";
import ClientResolverContext from "../context/client-resolver-context";

const JP_CONTRY_CODE = "JP";
const JP_LANG_CODE = "jp";

export const getLocalizationVariables = () => {
  const { clientConfig } = useContext(ClientResolverContext);
  const { selectedLanguage } = useContext(LanguageContext);

  const isJapaneseVariables = () =>
    (clientConfig?.countryCode &&
      clientConfig.countryCode === JP_CONTRY_CODE) ||
    selectedLanguage.id === JP_LANG_CODE;

  //TODO Check if needed
  const isIncreasedMinDeposit = () => {
    const HIGHER_DEPOSIT_COUNTRIES = [
      "CA", // Canadabn
      "GB", // UK
      JP_CONTRY_CODE, // Japan
      "AU", // Australia
      "SG", // Singapore
      "AE", // UAE
      "SA", // Saudi Arabia
      "QA", // Qatar
    ];
    // we need this condition because we should increase deposit in case if JP IP OR JP language selected
    // in the other cases (the rest countries) we checking only the IP, no need to check language
    return (
      isJapaneseVariables() ||
      (clientConfig &&
        clientConfig.countryCode &&
        HIGHER_DEPOSIT_COUNTRIES.includes(clientConfig.countryCode))
    );
  };

  const VARS = {
    "cysec-percentage": "83",
    "shares-number": "880",
    "shares-number-fsa": "91",
    "assets-number": "1.000",
    "assets-number-fsa": "1.000",
    "assets-number-fsa-jp": "1,000",
    "index-promotion1-amount": "200",
    // "index-promotion1-amount-fsa": isIncreasedMinDeposit() ? "100" : "20",
    "index-promotion1-amount-fsa": "100",
    "index-promotion1-currencies": "4",
    "index-promotion1-currencies-fsa": "8",
    "execution-time": "30",
    "leverage-up-to": "1:30",
    "shares-leverage-up-to": "1:5",
    "leverage-up-to-fsa": "1:1000",
    "tradeable-products": "1000",
    "tradeable-products-fsa": "1000",
    "execution-time-fsa": "30",
    "forex-currency-pairs": "80",
    "forex-major-pairs": "7",
    "forex-minor-pairs": "21",
    "forex-exotic-pairs": "52",
    "energies-number": "3",
    "indices-number": "20",
    "metals-number": "3",
    "crypto-number": "45",
    "etf-number": "100",
    "mt5-symbols-number": "1000",
    "mt4-symbols-number": "350",
    "mt5-assets-number": "6",
    "mt5-assets-number-fsa": "7",
    "mt4-assets-number": "6",
    "mt4-assets-number-fsa": "7",
    "trading-view-indicators": "100",
    "trading-view-community-indicators": "100,000",
    "mt5-timeframes": "21",
    "mt5-timeframes-fsa": "21",
    "mt5-total-orders-fsa": "500",
    "mt5-pre-build-indicators": "38",
    "account-type1-spreads-from": "0.0",
    "account-type1-commissions": "1.5",
    "account-type1-min-deposit": "200",
    // "account-type1-min-deposit-fsa": isIncreasedMinDeposit() ? "100" : "20",
    "account-type1-min-deposit-fsa": "100",
    "account-type1-max-leverage": "1:30",
    "account-type1-max-leverage-fsa": "1:1000",
    "account-type1-funding-fees": "0",
    "account-type1-withdrawals-fees": "0",
    "account-type1-markets": "6",
    "account-type1-markets-fsa": "7",
    "account-type1-total-symbols": "1000",
    "account-type1-total-symbols-fsa": "300",
    "account-type2-spreads-from": "1.0",
    "account-type2-commissions": "3.50",
    "account-type2-min-deposit": "200",
    // "account-type2-min-deposit-fsa": isIncreasedMinDeposit() ? "100" : "20",
    "account-type2-min-deposit-fsa": "100",
    "account-type2-max-leverage": "1:30",
    "account-type2-max-leverage-fsa": "1:1000",
    "account-type2-funding-fees": "0",
    "account-type2-withdrawals-fees": "0",
    "account-type2-markets": "6",
    "account-type2-markets-fsa": "7",
    "account-type2-total-symbols": "1000",
    "account-type2-total-symbols-fsa": "300",
    "index-promo-spreads": "0.0",
    "index-promo-spreads-fsa": "0.0",
    "index-performance-spreads": "0.0",
    "prof-qual-max-sum": "500,000",
    "prof-qual-trades-number": "10",

    "commodities-col1_3": "100",
    "commodities-col2_3": "5000",
    "commodities-col3_3": "100",
    "commodities-col4_3": "100",
    "commodities-col5_3": "2000",
    "spreads-table2-col2-lot-num": "1",
    "spreads-table2-col2-currency": "100,000",
    "spreads-table2-col2-1-per-lot": "3.00",
    "spreads-table2-col2-1-round-turn": "6",
    "spreads-table2-col2-2-per-lot": "3.00",
    "spreads-table2-col2-2-round-turn": "6",
    "spreads-table2-col2-3-per-lot": "2.50",
    "spreads-table2-col2-3-round-turn": "5",
    "spreads-table2-col2-4-per-lot": "3.00",
    "spreads-table2-col2-4-round-turn": "6",
    "spreads-table2-col2-5-per-lot": "3.50",
    "spreads-table2-col2-5-round-turn": "7",
    "spreads-table2-col2-6-per-lot": "450",
    "spreads-table2-col2-6-round-turn": "900",
    "spreads-table2-col2-7-per-lot": "4.00",
    "spreads-table2-col2-7-round-turn": "8",
    "spreads-table2-col2-8-per-lot": "60",
    "spreads-table2-col2-8-round-turn": "120",

    "por-max-days": "180",

    "deposit-minutes": "10",
    "deposit-days": "3-5",
    // "min-deposit": isIncreasedMinDeposit() ? "$100" : "$20",
    "min-deposit": "$100",
  };

  return VARS;
};
