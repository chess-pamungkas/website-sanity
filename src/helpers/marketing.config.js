import heroImageFSA from "../assets/images/person.png";
import dollarIcon from "../assets/images/icons/companies/marketing/dollar.svg";
import euroIcon from "../assets/images/icons/companies/marketing/euro.svg";
import rmbIcon from "../assets/images/icons/companies/marketing/rmb.svg";
import shibIcon from "../assets/images/icons/companies/marketing/shib.svg";
import ethIcon from "../assets/images/icons/companies/marketing/eth.svg";
import goldIcon from "../assets/images/icons/companies/marketing/gold.svg";
import oilBarrelIcon from "../assets/images/icons/companies/marketing/oilBarrel.svg";
import coffeeIcon from "../assets/images/icons/companies/marketing/coffee.svg";
import sp500Icon from "../assets/images/icons/companies/marketing/sp500.svg";
import dowJonesIcon from "../assets/images/icons/companies/marketing/dowJones.svg";
import nikkeiIcon from "../assets/images/icons/companies/marketing/nikkei.svg";

const heroImage = heroImageFSA;

export const MARKETING_GET_PARAMS = {
  sect1: "_sect1",
  sect2: "_sect2",
  content: "utm_content",
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
};

const SECT2_LOGOS = {
  dollar: dollarIcon,
  euro: euroIcon,
  rmb: rmbIcon,
  shib: shibIcon,
  eth: ethIcon,
  gold: goldIcon,
  oilBarrel: oilBarrelIcon,
  coffee: coffeeIcon,
  sp500: sp500Icon,
  dowJones: dowJonesIcon,
  nikkei: nikkeiIcon,
};

// TODO change heroes
export const CONTENT_HEROES = {
  default: {
    image: heroImage,
    name: "index_main-promotion-hero-gianluigi-buffon-name",
    text: `index_main-promotion-hero-gianluigi-buffon-text-fsa`,
    surname: "index_main-promotion-hero-gianluigi-buffon-surname", // Add surname field
  },
  sea: {
    image: heroImage,
    name: "index_main-promotion-hero-sea-name",
    text: "index_main-promotion-hero-sea-text",
  },
  europe: {
    image: heroImage,
    name: "index_main-promotion-hero-europe-name",
    text: "index_main-promotion-hero-europe-text",
  },
  "south africa": {
    image: heroImage,
    name: "index_main-promotion-hero-south-africa-name",
    text: "index_main-promotion-hero-south-africa-text",
  },
  japan: {
    image: heroImage,
    name: "index_main-promotion-hero-japan-name",
    text: "index_main-promotion-hero-japan-text",
  },
  australia: {
    image: heroImage,
    name: "index_main-promotion-hero-australia-name",
    text: "index_main-promotion-hero-australia-text",
  },
};

const FSA_DEFAULT_TEXT_SEQUENCE = [
  "index_main-promotion-animated-text-forex-traders",
  "index_main-promotion-animated-text-day-traders",
  "index_main-promotion-animated-text-crypto-traders-fsa",
  "index_main-promotion-animated-text-stock-traders",
  "index_main-promotion-animated-text-you",
];
const JP_DEFAULT_TEXT_NO_SEQUENCE = [
  "index_main-promotion-animated-text-all-customers", // ticket https://oqtima-website.atlassian.net/browse/OW-429
];

export const getDefaultTextSequence = (currentLanguage) => {
  if (currentLanguage === "jp") {
    return JP_DEFAULT_TEXT_NO_SEQUENCE;
  }
  return FSA_DEFAULT_TEXT_SEQUENCE;
};

export const SECT1_TEXT_SEQUENCES = {
  forex: [
    "index_main-promotion-animated-text-forex-traders",
    "index_main-promotion-animated-text-day-traders",
    "index_main-promotion-animated-text-ea-traders",
    "index_main-promotion-animated-text-mt4-mt5-passionate",
    "index_main-promotion-animated-text-you",
  ],
  crypto: [
    "index_main-promotion-animated-text-crypto-traders-fsa",
    "index_main-promotion-animated-text-ea-traders",
    "index_main-promotion-animated-text-crypto-cfds-enthusiast",
    "index_main-promotion-animated-text-btc-signals-expert",
    "index_main-promotion-animated-text-you",
  ],
  commodities: [
    "index_main-promotion-animated-text-wti-and-brent-crude-oil-traders",
    "index_main-promotion-animated-text-natural-gas-traders",
    "index_main-promotion-animated-text-gold-enthusiast",
    "index_main-promotion-animated-text-silver-passionate",
    "index_main-promotion-animated-text-you",
  ],
  ea: [
    "index_main-promotion-animated-text-ea-for-mt4-and-mt5",
    "index_main-promotion-animated-text-scalpers",
    "index_main-promotion-animated-text-day-trader",
    "index_main-promotion-animated-text-quant-traders",
    "index_main-promotion-animated-text-you",
  ],
  expert: [
    "index_main-promotion-animated-text-expert-traders",
    "index_main-promotion-animated-text-scalpers",
    "index_main-promotion-animated-text-fundamental-or-technical-traders",
    "index_main-promotion-animated-text-ea-users",
    "index_main-promotion-animated-text-you",
  ],
  beginner: [
    "index_main-promotion-animated-text-novices-to-trading",
    "index_main-promotion-animated-text-traders-looking-for-education",
    "index_main-promotion-animated-text-traders-ready-to-graduate-to-the-next-level",
    "index_main-promotion-animated-text-mt4-and-mt5-graduates",
    "index_main-promotion-animated-text-you",
  ],
};

export const SECT2_GROUP1_COUNT_OF_WORDS_DEFAULT = 5;

export const SECT2_GROUP1_DEFAULT = [
  "index_trade-with-promotion-gold",
  "index_trade-with-promotion-EUR/USD",
  "index_trade-with-promotion-crude-oil-wti",
  "index_trade-with-promotion-tsla",
  "index_trade-with-promotion-XAU/USD",
  "index_trade-with-promotion-aapl",
  "index_trade-with-promotion-GBP/USD",
  "index_trade-with-promotion-amzn",
  "index_trade-with-promotion-s&p-500",
];

export const SECT2_GROUP2_DEFAULT = ["index_trade-with-promotion-ending-call"];

export const SECT2_TEXT_SEQUENCES = {
  forex: {
    group1: [
      "index_trade-with-promotion-EUR/USD",
      "index_trade-with-promotion-USD/JPY",
      "index_trade-with-promotion-GBP/USD",
      "index_trade-with-promotion-AUD/USD",
      "index_trade-with-promotion-USD/CAD",
      "index_trade-with-promotion-USD/CNY",
      "index_trade-with-promotion-USD/CHF",
      "index_trade-with-promotion-USD/HKD",
      "index_trade-with-promotion-EUR/GBP",
      "index_trade-with-promotion-USD/KRW",
    ],
    group2: SECT2_GROUP2_DEFAULT,
    symbols: [SECT2_LOGOS.rmb, SECT2_LOGOS.dollar, SECT2_LOGOS.euro],
  },
  crypto: {
    group1: [
      "index_trade-with-promotion-BTC",
      "index_trade-with-promotion-ETH",
      "index_trade-with-promotion-ADA",
      "index_trade-with-promotion-XRP",
      "index_trade-with-promotion-SOL",
      "index_trade-with-promotion-SHIB",
      "index_trade-with-promotion-NEO",
      "index_trade-with-promotion-BNB",
    ],
    group2: SECT2_GROUP2_DEFAULT,
    symbols: [SECT2_LOGOS.shib, SECT2_LOGOS.eth],
  },
  commodities: {
    group1: [
      "index_trade-with-promotion-gold",
      "index_trade-with-promotion-silver",
      "index_trade-with-promotion-platinum",
      "index_trade-with-promotion-crude-oil",
      "index_trade-with-promotion-brent-oil",
      "index_trade-with-promotion-soybean",
      "index_trade-with-promotion-palladium",
      "index_trade-with-promotion-copper",
      "index_trade-with-promotion-coffee-arabica",
      "index_trade-with-promotion-cotton",
      "index_trade-with-promotion-wheat",
    ],
    group2: SECT2_GROUP2_DEFAULT,
    symbols: [SECT2_LOGOS.coffee, SECT2_LOGOS.oilBarrel, SECT2_LOGOS.gold],
  },
  indices: {
    group1: [
      "index_trade-with-promotion-s&p-500",
      "index_trade-with-promotion-dow-jones-30",
      "index_trade-with-promotion-dax",
      "index_trade-with-promotion-ftse100",
      "index_trade-with-promotion-nikkei",
      "index_trade-with-promotion-dax40",
      "index_trade-with-promotion-hong-kong-50",
      "index_trade-with-promotion-euro-50",
      "index_trade-with-promotion-euro-btp",
      "index_trade-with-promotion-australia-200",
      "index_trade-with-promotion-spain-35",
      "index_trade-with-promotion-france-40",
      "index_trade-with-promotion-canada-40",
    ],
    group2: SECT2_GROUP2_DEFAULT,
    symbols: [SECT2_LOGOS.nikkei, SECT2_LOGOS.sp500, SECT2_LOGOS.dowJones],
  },
  stocks: {
    group1: ["index_trade-with-promotion-TBC"],
    group2: SECT2_GROUP2_DEFAULT,
    symbols: [],
  },
};
