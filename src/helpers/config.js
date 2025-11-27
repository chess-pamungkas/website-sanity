export const MT4_PLATFORMS = {
  ios: {
    title: "index_trading-tools-platforms-ios",
  },
  android: {
    title: "index_trading-tools-platforms-android",
  },
  windows: {
    title: "index_trading-tools-platforms-windows",
  },
};

export const MOBILE_PLATFORMS = {
  ios: {
    title: "index_trading-tools-platforms-ios",
  },
  android: {
    title: "index_trading-tools-platforms-android",
  },
};

export const getPlatforms = () => FSA_PLATFORMS;

export const ADDITIONAL_PLATFORMS = {
  windows: {
    title: "index_trading-tools-platforms-windows",
  },
};

export const CRYPTO_TRADING_SECTION = {
  id: "crypto",
  title: "index_trading-ticker-section-crypto",
};
export const FOREX_TRADING_SECTION = {
  id: "forex",
  title: "index_trading-ticker-section-forex",
};
export const SHARES_TRADING_SECTION = {
  id: "shares",
  title: "index_trading-ticker-section-shares",
};
export const ENERGIES_TRADING_SECTION = {
  id: "energies",
  title: "index_trading-ticker-section-energies",
};
export const METALS_TRADING_SECTION = {
  id: "metals",
  title: "index_trading-ticker-section-metals",
};
export const INDICES_TRADING_SECTION = {
  id: "indices",
  title: "index_trading-ticker-section-indices",
};
export const ETF_TRADING_SECTION = {
  id: "etf",
  title: "index_trading-ticker-section-etf",
};

const FSA_TRADING_SECTIONS = [
  METALS_TRADING_SECTION,
  CRYPTO_TRADING_SECTION,
  FOREX_TRADING_SECTION,
  SHARES_TRADING_SECTION,
  INDICES_TRADING_SECTION,
  ENERGIES_TRADING_SECTION,
  ETF_TRADING_SECTION,
];

export const getTradingSections = () => FSA_TRADING_SECTIONS;
