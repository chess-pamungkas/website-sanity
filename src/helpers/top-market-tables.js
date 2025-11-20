import { useWindowSize } from "./hooks/use-window-size";
import { useTranslationWithVariables } from "./hooks/use-translation-with-vars";
import { MobileCell } from "../components/shared/table/components/mobile-cell";

export const GeneralTableColumns = () => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const COLUMNS = [
    {
      id: "group1",
      Header: "",
      columns: [
        {
          Header: "",
          accessor: "col1",
        },
      ],
    },
    {
      id: "group2",
      Header: t("oqtima-ecn-account"),
      columns: [
        {
          Header: isMobile ? "" : "Min",
          accessor: isMobile ? "col23_mobile" : "col2",
        },
        ...(isMobile
          ? []
          : [
              {
                Header: "Avg",
                accessor: "col3",
              },
            ]),
      ],
    },
    {
      id: "group3",
      Header: t("oqtima-one-account"),
      columns: [
        {
          Header: isMobile ? "" : "Min",
          accessor: isMobile ? "col45_mobile" : "col4",
        },
        ...(isMobile
          ? []
          : [
              {
                Header: "Avg",
                accessor: "col5",
              },
            ]),
      ],
    },
    {
      id: "group4",
      Header: "",
      columns: [
        {
          Header: t("indices_table-market-header-group4"),
          accessor: "col6",
        },
      ],
    },
  ];
  return COLUMNS;
};

export const DATA_FOREX_MAJOR = [
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

export const DATA_FOREX_MINOR = [
  {
    col1: "AUDCAD",
    col2: "0.05",
    col3: "0.11",
    col4: "1.05",
    col5: "1.11",
    col23_mobile: MobileCell("0.05", "0.11"),
    col45_mobile: MobileCell("1.05", "1.11"),
  },
  {
    col1: "AUDCHF",
    col2: "0.05",
    col3: "0.09",
    col4: "1.05",
    col5: "1.09",
    col23_mobile: MobileCell("0.05", "0.09"),
    col45_mobile: MobileCell("1.05", "1.09"),
  },
  {
    col1: "AUDCNH",
    col2: "0.58",
    col3: "2.80",
    col4: "1.58",
    col5: "3.80",
    col23_mobile: MobileCell("0.58", "2.80"),
    col45_mobile: MobileCell("1.58", "3.80"),
  },
  {
    col1: "AUDJPY",
    col2: "2.00",
    col3: "6.66",
    col4: "3.00",
    col5: "7.66",
    col23_mobile: MobileCell("2.00", "6.66"),
    col45_mobile: MobileCell("3.00", "7.66"),
  },
  {
    col1: "AUDNZD",
    col2: "0.00",
    col3: "0.11",
    col4: "1.00",
    col5: "1.11",
    col23_mobile: MobileCell("0.00", "0.11"),
    col45_mobile: MobileCell("1.00", "1.11"),
  },
  {
    col1: "AUDSGD",
    col2: "0.08",
    col3: "0.23",
    col4: "1.08",
    col5: "1.23",
    col23_mobile: MobileCell("0.08", "0.23"),
    col45_mobile: MobileCell("1.08", "1.23"),
  },
  {
    col1: "AUDZAR",
    col2: "0.84",
    col3: "7.57",
    col4: "1.84",
    col5: "8.57",
    col23_mobile: MobileCell("0.84", "7.57"),
    col45_mobile: MobileCell("1.84", "8.57"),
  },
  {
    col1: "CADCHF",
    col2: "0.05",
    col3: "0.11",
    col4: "1.05",
    col5: "1.11",
    col23_mobile: MobileCell("0.05", "0.11"),
    col45_mobile: MobileCell("1.05", "1.11"),
  },
  {
    col1: "CADJPY",
    col2: "2.00",
    col3: "10.23",
    col4: "3.00",
    col5: "11.23",
    col23_mobile: MobileCell("2.00", "10.23"),
    col45_mobile: MobileCell("3.00", "11.23"),
  },
  {
    col1: "CHFJPY",
    col2: "5.00",
    col3: "16.08",
    col4: "6.00",
    col5: "17.08",
    col23_mobile: MobileCell("5.00", "16.08"),
    col45_mobile: MobileCell("6.00", "17.08"),
  },
  {
    col1: "EURAUD",
    col2: "0.05",
    col3: "0.12",
    col4: "1.05",
    col5: "1.12",
    col23_mobile: MobileCell("0.05", "0.12"),
    col45_mobile: MobileCell("1.05", "1.12"),
  },
  {
    col1: "EURCAD",
    col2: "0.05",
    col3: "0.12",
    col4: "1.05",
    col5: "1.12",
    col23_mobile: MobileCell("0.05", "0.12"),
    col45_mobile: MobileCell("1.05", "1.12"),
  },
  {
    col1: "EURCHF",
    col2: "0.03",
    col3: "0.09",
    col4: "1.03",
    col5: "1.09",
    col23_mobile: MobileCell("0.03", "0.09"),
    col45_mobile: MobileCell("1.03", "1.09"),
  },
  {
    col1: "EURGBP",
    col2: "0.02",
    col3: "0.06",
    col4: "1.02",
    col5: "1.06",
    col23_mobile: MobileCell("0.02", "0.06"),
    col45_mobile: MobileCell("1.02", "1.06"),
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
    col1: "EURNZD",
    col2: "0.05",
    col3: "0.22",
    col4: "1.05",
    col5: "1.22",
    col23_mobile: MobileCell("0.05", "0.22"),
    col45_mobile: MobileCell("1.05", "1.22"),
  },
  {
    col1: "GBPAUD",
    col2: "0.05",
    col3: "0.27",
    col4: "1.05",
    col5: "1.27",
    col23_mobile: MobileCell("0.05", "0.27"),
    col45_mobile: MobileCell("1.05", "1.27"),
  },
  {
    col1: "GBPCAD",
    col2: "0.00",
    col3: "0.21",
    col4: "1.00",
    col5: "1.21",
    col23_mobile: MobileCell("0.00", "0.21"),
    col45_mobile: MobileCell("1.00", "1.21"),
  },
  {
    col1: "GBPCHF",
    col2: "0.05",
    col3: "0.22",
    col4: "1.05",
    col5: "1.22",
    col23_mobile: MobileCell("0.05", "0.22"),
    col45_mobile: MobileCell("1.05", "1.22"),
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
    col1: "USDSGD",
    col2: "0.06",
    col3: "0.17",
    col4: "1.06",
    col5: "1.17",
    col23_mobile: MobileCell("0.06", "0.17"),
    col45_mobile: MobileCell("1.06", "1.17"),
  },
];

export const DATA_FOREX_EXOTIC = [];

// Combined forex data for spreads display
export const DATA_FOREX = [...DATA_FOREX_MAJOR, ...DATA_FOREX_MINOR];

export const DATA_CRYPTO = [
  {
    col1: "DOGEUSD",
    col2: "1.90",
    col3: "2.16",
    col4: "2.90",
    col5: "3.16",
    col23_mobile: MobileCell("1.90", "2.16"),
    col45_mobile: MobileCell("2.90", "3.16"),
  },
  {
    col1: "MATUSD",
    col2: "2.10",
    col3: "2.32",
    col4: "3.10",
    col5: "3.32",
    col23_mobile: MobileCell("2.10", "2.32"),
    col45_mobile: MobileCell("3.10", "3.32"),
  },
  {
    col1: "ADAUSD",
    col2: "2.10",
    col3: "2.38",
    col4: "3.10",
    col5: "3.38",
    col23_mobile: MobileCell("2.10", "2.38"),
    col45_mobile: MobileCell("3.10", "3.38"),
  },
  {
    col1: "XRPUSD",
    col2: "2.10",
    col3: "2.66",
    col4: "3.10",
    col5: "3.66",
    col23_mobile: MobileCell("2.10", "2.66"),
    col45_mobile: MobileCell("3.10", "3.66"),
  },
  {
    col1: "EOSUSD",
    col2: "2.10",
    col3: "9.07",
    col4: "3.10",
    col5: "10.07",
    col23_mobile: MobileCell("2.10", "9.07"),
    col45_mobile: MobileCell("3.10", "10.07"),
  },
  {
    col1: "DOTUSD",
    col2: "2.20",
    col3: "2.27",
    col4: "3.20",
    col5: "3.27",
    col23_mobile: MobileCell("2.20", "2.27"),
    col45_mobile: MobileCell("3.20", "3.27"),
  },
  {
    col1: "LNKUSD",
    col2: "2.30",
    col3: "2.30",
    col4: "3.30",
    col5: "3.42",
    col23_mobile: MobileCell("2.30", "2.30"),
    col45_mobile: MobileCell("3.30", "3.42"),
  },
];

export const DATA_SHARES = [
  {
    col1: "AUDCAD",
    col2: "0",
    col3: "0.4",
    col4: "0",
    col5: "0.4",
  },
  {
    col1: "AUDCAD",
    col2: "0",
    col3: "0.4",
    col4: "0",
    col5: "0.4",
  },
  {
    col1: "AUDCAD",
    col2: "0",
    col3: "0.4",
    col4: "0",
    col5: "0.4",
  },
  {
    col1: "AUDCAD",
    col2: "0",
    col3: "0.4",
    col4: "0",
    col5: "0.4",
  },
  {
    col1: "AUDCAD",
    col2: "0",
    col3: "0.4",
    col4: "0",
    col5: "0.4",
  },

  {
    col1: "USDEUR",
    col2: "0",
    col3: "0.4",
    col4: "0",
    col5: "0.4",
  },
];

export const DATA_METALS = [
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

export const DATA_INDICES = [
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
    col45_mobile: MobileCell("1.09", "1.10"),
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

export const DATA_ENERGIES = [
  {
    col1: "XBRUSD",
    col2: "2.00",
    col3: "3.66",
    col4: "3.00",
    col5: "4.66",
    col23_mobile: MobileCell("2.00", "3.66"),
    col45_mobile: MobileCell("3.00", "4.66"),
  },
  {
    col1: "XTIUSD",
    col2: "4.00",
    col3: "4.01",
    col4: "5.00",
    col5: "5.01",
    col23_mobile: MobileCell("4.00", "4.01"),
    col45_mobile: MobileCell("5.00", "5.01"),
  },
  {
    col1: "XNGUSD",
    col2: "0.00",
    col3: "5.43",
    col4: "1.00",
    col5: "6.43",
    col23_mobile: MobileCell("0.00", "5.43"),
    col45_mobile: MobileCell("1.00", "6.43"),
  },
];

export const DATA_ETF = [];
