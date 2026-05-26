/** Fixed layout from trading-symbols.scss — avoid per-card offsetWidth reads (Lighthouse forced reflow). */
export const TRADING_SYMBOL_CARD_WIDTH_PX = 267.2;
export const TRADING_SYMBOL_CARD_GAP_PX = 16;
export const TRADING_SYMBOL_CARD_STRIDE_PX =
  TRADING_SYMBOL_CARD_WIDTH_PX + TRADING_SYMBOL_CARD_GAP_PX;

/** Desktop CSS loop: translate -50% over this duration at reference card count (legacy 90s). */
export const TRADING_TICKER_CSS_SCROLL_DURATION_SEC = 90;
export const TRADING_TICKER_CSS_SCROLL_REFERENCE_CARD_COUNT = 40;

/** Duplicate symbol rows until length >= 20 (seamless -50% CSS loop). */
export const prepareTradingTickerSymbols = (symbols) => {
  if (!symbols?.length) return [];
  return symbols.length < 20
    ? prepareTradingTickerSymbols(symbols.concat(symbols))
    : symbols;
};

/** Same pixels-per-second for every product tab (duration scales with track width). */
export const getTradingTickerCssScrollDurationSec = (preparedSymbolCount) => {
  if (!preparedSymbolCount) return TRADING_TICKER_CSS_SCROLL_DURATION_SEC;
  const scrollDistancePx =
    preparedSymbolCount * TRADING_SYMBOL_CARD_STRIDE_PX * 0.5;
  const referenceDistancePx =
    TRADING_TICKER_CSS_SCROLL_REFERENCE_CARD_COUNT *
    TRADING_SYMBOL_CARD_STRIDE_PX *
    0.5;
  const pxPerSec =
    referenceDistancePx / TRADING_TICKER_CSS_SCROLL_DURATION_SEC;
  return scrollDistancePx / pxPerSec;
};
