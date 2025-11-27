const EXCLUDE_INDICES = ["NETH25"];
const EXCLUDE_FOREX = [];
const EXCLUDE_CRYPTO = [];
const EXCLUDE_DEFAULT = [];

export const filterSymbols = (symbols, section) => {
  let toExclude = [];
  switch (section) {
    case "indices":
      toExclude = EXCLUDE_INDICES;
      break;
    case "forex":
      toExclude = EXCLUDE_FOREX;
      break;
    case "crypto":
      toExclude = EXCLUDE_CRYPTO;
      break;
    default:
      toExclude = EXCLUDE_DEFAULT;
      break;
  }

  return symbols.filter((symbol) => !toExclude.includes(symbol.symbol));
};
