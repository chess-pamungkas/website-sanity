import { useTranslationWithVariables } from "./hooks/use-translation-with-vars";
import { MobileCell } from "../components/shared/table/components/mobile-cell";

export const DATA_SPREADS_TABLE_FOREX = [
  {
    col1: "AUDUSD",
    col2: "0.00",
    col3: "0.14",
    col4: "1.00",
    col5: "1.14",
    col23_mobile: MobileCell("0.00", "0.14"),
    col45_mobile: MobileCell("1.00", "1.14"),
  },
  {
    col1: "EURJPY",
    col2: "0.00",
    col3: "0.80",
    col4: "1.00",
    col5: "1.80",
    col23_mobile: MobileCell("0.00", "0.80"),
    col45_mobile: MobileCell("1.00", "1.80"),
  },
  {
    col1: "EURUSD",
    col2: "0.00",
    col3: "0.12",
    col4: "1.00",
    col5: "1.12",
    col23_mobile: MobileCell("0.00", "0.12"),
    col45_mobile: MobileCell("1.00", "1.12"),
  },
  {
    col1: "GBPCAD",
    col2: "0.00",
    col3: "2.09",
    col4: "1.00",
    col5: "3.09",
    col23_mobile: MobileCell("0.00", "2.09"),
    col45_mobile: MobileCell("1.00", "3.09"),
  },
  {
    col1: "GBPJPY",
    col2: "0.00",
    col3: "1.61",
    col4: "1.00",
    col5: "2.61",
    col23_mobile: MobileCell("0.00", "1.61"),
    col45_mobile: MobileCell("1.00", "2.61"),
  },
  {
    col1: "GBPUSD",
    col2: "0.00",
    col3: "0.36",
    col4: "1.00",
    col5: "1.36",
    col23_mobile: MobileCell("0.00", "0.36"),
    col45_mobile: MobileCell("1.00", "1.36"),
  },
  {
    col1: "USDCHF",
    col2: "0.00",
    col3: "0.60",
    col4: "1.00",
    col5: "1.60",
    col23_mobile: MobileCell("0.00", "0.60"),
    col45_mobile: MobileCell("1.00", "1.60"),
  },
  {
    col1: "NZDUSD",
    col2: "0.00",
    col3: "0.40",
    col4: "1.00",
    col5: "1.40",
    col23_mobile: MobileCell("0.00", "0.40"),
    col45_mobile: MobileCell("1.00", "1.40"),
  },
];

export const DATA_SPREADS_TABLE_INDICES = [
  {
    col1: "USIDX",
    col2: "0.02",
    col3: "0.03",
    col4: "1.02",
    col5: "1.03",
    col23_mobile: MobileCell("0.02", "0.03"),
    col45_mobile: MobileCell("1.02", "1.03"),
  },
  {
    col1: "US2000",
    col2: "0.08",
    col3: "0.30",
    col4: "1.08",
    col5: "1.30",
    col23_mobile: MobileCell("0.08", "0.30"),
    col45_mobile: MobileCell("1.08", "1.30"),
  },
  {
    col1: "TW88",
    col2: "0.09",
    col3: "0.40",
    col4: "1.09",
    col5: "1.40",
    col23_mobile: MobileCell("0.09", "0.40"),
    col45_mobile: MobileCell("1.09", "1.40"),
  },
  {
    col1: "VIX",
    col2: "0.09",
    col3: "0.40",
    col4: "1.09",
    col5: "1.10",
    col23_mobile: MobileCell("0.09", "0.40"),
    col45_mobile: MobileCell("1.09", "1.40"),
  },
  {
    col1: "NETH25",
    col2: "0.30",
    col3: "0.40",
    col4: "1.30",
    col5: "1.40",
    col23_mobile: MobileCell("0.30", "0.40"),
    col45_mobile: MobileCell("1.30", "1.40"),
  },

  {
    col1: "FRA40",
    col2: "2.00",
    col3: "3.10",
    col4: "3.00",
    col5: "4.10",
    col23_mobile: MobileCell("2.00", "3.10"),
    col45_mobile: MobileCell("3.00", "4.10"),
  },
  {
    col1: "UK100",
    col2: "2.00",
    col3: "2.60",
    col4: "3.00",
    col5: "3.60",
    col23_mobile: MobileCell("2.00", "2.60"),
    col45_mobile: MobileCell("3.00", "3.60"),
  },
];

export const DATA_SPREADS_TABLE_COMMODITIES = [
  {
    col1: "XAGUSD",
    col2: "0.20",
    col3: "1.05",
    col4: "1.20",
    col5: "2.05",
    col23_mobile: MobileCell("0.20", "1.05"),
    col45_mobile: MobileCell("1.20", "2.05"),
  },
  {
    col1: "XAGEUR",
    col2: "0.50",
    col3: "0.50",
    col4: "1.50",
    col5: "1.50",
    col23_mobile: MobileCell("0.50", "0.50"),
    col45_mobile: MobileCell("1.50", "1.50"),
  },
  {
    col1: "XAUEUR",
    col2: "0.50",
    col3: "0.50",
    col4: "1.50",
    col5: "1.50",
    col23_mobile: MobileCell("0.50", "0.50"),
    col45_mobile: MobileCell("1.50", "1.50"),
  },
  {
    col1: "XAUUSD",
    col2: "0.70",
    col3: "0.79",
    col4: "1.70",
    col5: "1.79",
    col23_mobile: MobileCell("0.70", "0.79"),
    col45_mobile: MobileCell("1.70", "1.79"),
  },
  {
    col1: "XPTUSD",
    col2: "7.10",
    col3: "32.10",
    col4: "8.10",
    col5: "33.10",
    col23_mobile: MobileCell("7.10", "32.10"),
    col45_mobile: MobileCell("8.10", "33.10"),
  },
];

export const DATA_SPREADS_TABLE_CRYPTO = [
  {
    col1: "DOGEUSD",
    col2: "1.9",
    col3: "2.16",
    col4: "2.9",
    col5: "3.16",
    col23_mobile: MobileCell("1.90", "2.16"),
    col45_mobile: MobileCell("2.90", "3.16"),
  },
  {
    col1: "MATUSD",
    col2: "2.1",
    col3: "2.32",
    col4: "3.1",
    col5: "3.32",
    col23_mobile: MobileCell("2.10", "2.32"),
    col45_mobile: MobileCell("3.10", "3.32"),
  },
  {
    col1: "ADAUSD",
    col2: "2.1",
    col3: "2.38",
    col4: "3.1",
    col5: "3.38",
    col23_mobile: MobileCell("2.10", "2.38"),
    col45_mobile: MobileCell("3.10", "3.38"),
  },
  {
    col1: "XRPUSD",
    col2: "2.1",
    col3: "2.66",
    col4: "3.1",
    col5: "3.66",
    col23_mobile: MobileCell("2.10", "2.66"),
    col45_mobile: MobileCell("3.10", "3.66"),
  },
  {
    col1: "EOSUSD",
    col2: "2.1",
    col3: "9.07",
    col4: "3.1",
    col5: "10.07",
    col23_mobile: MobileCell("2.10", "9.01"),
    col45_mobile: MobileCell("3.10", "10.07"),
  },
  {
    col1: "DOTUSD",
    col2: "2.2",
    col3: "2.27",
    col4: "3.2",
    col5: "3.27",
    col23_mobile: MobileCell("2.20", "2.27"),
    col45_mobile: MobileCell("3.20", "3.27"),
  },
  {
    col1: "LNKUSD",
    col2: "2.3",
    col3: "2.3",
    col4: "3.3",
    col5: "3.42",
    col23_mobile: MobileCell("2.30", "2.30"),
    col45_mobile: MobileCell("3.30", "3.42"),
  },
];

export const ColumnsSpreadTable2 = () => {
  const { t } = useTranslationWithVariables();
  const COLUMNS_SPREADS_TABLE_2 = [
    {
      accessor: "col1",
      Header: t("spreads_account-columns-table2-col1-header1"),
    },
    {
      accessor: "col2",
      Header: t("spreads_account-columns-table2-col2-header2"),
    },
  ];
  return COLUMNS_SPREADS_TABLE_2;
};

export const DataSpreadTable2 = () => {
  const { t } = useTranslationWithVariables();
  const DATA_SPREADS_TABLE_2_FSA = [
    {
      col1: "USD",
      col2: t("spreads_account-data-table2-col2-1"),
    },
    {
      col1: "EUR",
      col2: t("spreads_account-data-table2-col2-2"),
    },
    {
      col1: "GBP",
      col2: t("spreads_account-data-table2-col2-3"),
    },
    {
      col1: "SGD",
      col2: t("spreads_account-data-table2-col2-5"),
    },
    {
      col1: "JPY",
      col2: t("spreads_account-data-table2-col2-6"),
    },
    {
      col1: "CAD",
      col2: t("spreads_account-data-table2-col2-7"),
    },
  ];
  return DATA_SPREADS_TABLE_2_FSA;
};
