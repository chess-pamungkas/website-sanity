import React, { lazy, Suspense, useEffect } from "react";
import { useRegistrationPopupOptional } from "../context/registration-popup-context";
import visaLogo from "../assets/images/icons/payments/visa.png";
import masterCardLogo from "../assets/images/icons/payments/masterCard.png";
import danaLogo from "../assets/images/icons/payments/dana.png";
import duitNowLogo from "../assets/images/icons/payments/duitNow.png";
import equalsLogo from "../assets/images/icons/payments/equals.png";
import momoLogo from "../assets/images/icons/payments/momo.png";
import orisLogo from "../assets/images/icons/payments/oris.png";
import ovoLogo from "../assets/images/icons/payments/ovo.png";
import pembayaranBankLogo from "../assets/images/icons/payments/pembayaranBank.png";
import pixLogo from "../assets/images/icons/payments/pix.png";
import shopeePayLogo from "../assets/images/icons/payments/shopeePay.png";
import sticpayLogo from "../assets/images/icons/payments/sticpay.png";
import thaiqrLogo from "../assets/images/icons/payments/thaiQR.png";
import trueMoneyLogo from "../assets/images/icons/payments/trueMoney.png";
import vietqrLogo from "../assets/images/icons/payments/vietQR.png";
import vnPayLogo from "../assets/images/icons/payments/vnPay.png";
import visaLogoEU from "../assets/images/icons/payments/visaEU.png";
import masterCardLogoEU from "../assets/images/icons/payments/mastercardEU.png";
import bankwireLogo from "../assets/images/icons/payments/bankwire.png";
import netellerLogo from "../assets/images/icons/payments/neteller.png";
import revolutLogo from "../assets/images/icons/payments/revolut.png";
import skrillLogo from "../assets/images/icons/payments/skrill.png";
import wiseLogo from "../assets/images/icons/payments/wise.png";
import { topLevelDomain } from "./entity-resolver";
import { setIBparamsToLink, IB_PARAMS } from "./services/ib-service";
import {
  setCampaignParamsToLink,
  CAMPAIGN_PARAMS,
} from "./services/marketing-service";
import { setLangParam } from "./services/language-service";
import { PORTAL_LANGUAGES_MAP } from "./lang-options.config";
import { isBrowser } from "./services/is-browser";

// Lazy load registration popup so it is not in the main bundle (Lighthouse: reduce unused JS).
const RegistrationPopup = lazy(() =>
  import("../components/registration-popup")
);

export const WINDOW_SIZE_SM = 375;
export const WINDOW_SIZE_MD = 768;
export const WINDOW_SIZE_LG = 1024;
export const WINDOW_SIZE_XL = 1920;

export const SM_MAX_WIDTH = 767;
export const MD_MAX_WIDTH = 1023;
export const LG_MAX_WIDTH = 1919;

export const HEADER_BIG_HEIGHT = 65;
export const HEADER_SMALL_HEIGHT = 65;

export const BURGER_MENU_LINES_COUNT = 3;
export const DROPDOWN_SEARCH_ITEMS_TO_SHOW = 3;
export const SEARCH_RESULTS_FIRST_BUNDLE = 1;
export const SEARCH_RESULTS_BUNDLE_SIZE = 10;
export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_PARAM_NAME = "q";
export const LINK_TO_HIGHLIGHTED_TEXT_PARAM_NAME = "#:~:text";
export const INITIAL_SEARCH_STATE = {
  query: "",
  results: [],
  noResultsFound: false,
};

export const FSA_POSTFIX = "-fsa";

export const EU_HOSTNAME = "https://oqtima.eu/";

export const DIR_LTR = "ltr";
export const DIR_RTL = "rtl";

const CONTACT_PHONE_FSA = "44 330 828 5704";
export const CONTACT_PHONE_FSA_2 = "248 4632034";
const CONTACT_EMAIL_FSA = "support@oqtima.com";
export const CONTACT_ADDRESS =
  "Franklin Roosevelt 247-block C, Office 101, Limassol 3046";

export const HOME_PAGE_LINK = "/";

export const getContactPhone = () => {
  return CONTACT_PHONE_FSA;
};

export const getContactEmail = () => {
  return CONTACT_EMAIL_FSA;
};

export const BLOG_URL = "https://oqtima.news/";

export const ShowRegistrationPopup = ({ isOpen, onClose, langParam }) => {
  const registrationPopup = useRegistrationPopupOptional();

  // Keep layout ReCaptchaProvider in sync when pages use local isPopupOpen state.
  useEffect(() => {
    if (!registrationPopup?.setIsOpen) return undefined;
    registrationPopup.setIsOpen(isOpen);
    return () => {
      if (isOpen) registrationPopup.setIsOpen(false);
    };
  }, [isOpen, registrationPopup]);

  if (!isOpen) return null;

  const ibParams = setIBparamsToLink();
  const campaignParams = setCampaignParamsToLink();

  const params = {};
  if (ibParams && ibParams.startsWith(`?${IB_PARAMS.r_code}=`)) {
    params.referral_type = 12;
    params.referral_value = ibParams.split("=")[1];
  } else if (
    campaignParams &&
    campaignParams.startsWith(`?${CAMPAIGN_PARAMS.campaign_code}=`)
  ) {
    params.referral_type = 14;
    params.referral_value = campaignParams.split("=")[1];
  } else if (langParam) {
    params.langParam = langParam;
  }
  const paramsString = JSON.stringify(params);

  return (
    <Suspense fallback={null}>
      <RegistrationPopup
        isOpen={isOpen}
        onClose={onClose}
        params={paramsString}
      />
    </Suspense>
  );
};

// Helper function to get current language code from URL
const getCurrentLangCode = () => {
  if (isBrowser()) {
    const { pathname } = window.location;
    const matches = pathname.match(/\/[a-z]{2}\//);
    if (matches) {
      const langCode = matches[0].slice(1, 3);
      return langCode;
    }
  }
  return "en"; // Default to English
};

// Helper function to get language parameter for portal links
const getLangParamForPortal = () => {
  const langCode = getCurrentLangCode();
  const portalLangCode = PORTAL_LANGUAGES_MAP[langCode] || langCode;
  return `?language=${portalLangCode}`;
};

export const GetRegistrationLink = () => {
  const langParam = getLangParamForPortal();
  const ibParams = setIBparamsToLink();
  const campaignParams = setCampaignParamsToLink();

  // Construct the base URL
  let registrationLink = `https://portal.oqtima.${topLevelDomain}/register`;

  // Append IB parameters based on their format
  if (ibParams) {
    if (ibParams.startsWith(`?${IB_PARAMS.r_code}=`)) {
      // If the link is for r_code, do not include the language parameter
      registrationLink += ibParams; // Only append r_code
    }
  } else if (campaignParams) {
    if (campaignParams.startsWith(`?${CAMPAIGN_PARAMS.campaign_code}=`)) {
      // If the link is for campaign_code, do not include the language parameter
      registrationLink += campaignParams; // Only append campaign_code
    }
  } else if (langParam) {
    // If no IB params but langParam exists, append it
    registrationLink += langParam;
  }

  return registrationLink;
};

export const GetLoginLink = () =>
  `https://portal.oqtima.${topLevelDomain}/login${getLangParamForPortal()}`;

export const GetDepositLink = () =>
  `https://portal.oqtima.${topLevelDomain}/funds/deposit${getLangParamForPortal()}`;

export const GetWithdrawalLink = () =>
  `https://portal.oqtima.${topLevelDomain}/funds/withdrawal${getLangParamForPortal()}`;

export const COMING_SOON_PAGE_LINK = "/coming-soon";
export const COMPANY_PAGE_LINK = "/company";
export const LEGAL_PAGE_LINK = "/legal";
export const CONTACT_US_PAGE_LINK = "/contact-us";
export const FAQ_PAGE_LINK = "/faq";
export const SEARCH_PAGE_LINK = "/search";
export const CRYPTO_PAGE_LINK = "/crypto";
export const INDICES_PAGE_LINK = "/indices";
export const FOREX_PAGE_LINK = "/forex";
export const SHARES_PAGE_LINK = "/shares";
export const ENERGIES_PAGE_LINK = "/energies";
export const METALS_PAGE_LINK = "/metals";
export const ALL_MARKETS_PAGE_LINK = "/all-markets";
export const MT4_PAGE_LINK = "/mt4";
export const MT5_PAGE_LINK = "/mt5";
export const TRADING_TOOLS_PAGE_LINK = "/trading-tools";
export const VPS_PAGE_LINK = "/vps";
export const SWAP_FREE_PAGE_LINK = "/swap-free";
export const WITHDRAWAL_PAGE_LINK = "/funding";
export const SPREADS_AND_FEES_PAGE_LINK = "/spreads-and-fees";
export const PARTNERS_PAGE_LINK = "/partners";
export const ACCOUNTS_TYPE_PAGE_LINK = "/accounts-type";
export const ETF_PAGE_LINK = "/etf";

export const MT5_WEB_TRADER_LINK = "/mt5-webtrader";
export const MT4_WEB_TRADER_LINK = "/mt4-webtrader";

export const PRIVACY_POLICY_PAGE_LINK = "/legal/privacy";
export const COOKIE_POLICY_PAGE_LINK = "/legal/cookie";

export const TABLE_PAGE_SIZES = [5, 10, 15];

export const PAYMENT_SYSTEMS_FSA = [
  {
    alt: "Visa",
    logo: visaLogo,
  },
  {
    alt: "MasterCard",
    logo: masterCardLogo,
  },
  {
    alt: "Dana",
    logo: danaLogo,
  },
  {
    alt: "Duit Now",
    logo: duitNowLogo,
  },
  {
    alt: "Equals",
    logo: equalsLogo,
  },
  {
    alt: "Momo",
    logo: momoLogo,
  },
  {
    alt: "Ovo",
    logo: ovoLogo,
  },
  {
    alt: "Pembayaran Bank",
    logo: pembayaranBankLogo,
  },
  {
    alt: "Pix",
    logo: pixLogo,
  },
  {
    alt: "Oris",
    logo: orisLogo,
  },
  {
    alt: "Shopee Pay",
    logo: shopeePayLogo,
  },
  {
    alt: "Sticpay",
    logo: sticpayLogo,
  },
  {
    alt: "ThaiQR",
    logo: thaiqrLogo,
  },
  {
    alt: "VietQR",
    logo: vietqrLogo,
  },
  {
    alt: "Vn Pay",
    logo: vnPayLogo,
  },
  {
    alt: "True Money",
    logo: trueMoneyLogo,
  },
];

export const PAYMENT_SYSTEMS = {
  visa: {
    alt: "Visa",
    logo: visaLogoEU,
  },
  masterCard: {
    alt: "MasterCard",
    logo: masterCardLogoEU,
  },
  bankwire: {
    alt: "Bank Wire",
    logo: bankwireLogo,
  },
  neteller: {
    alt: "Neteller",
    logo: netellerLogo,
  },
  revolut: {
    alt: "Revolut",
    logo: revolutLogo,
  },
  skrill: {
    alt: "Skrill",
    logo: skrillLogo,
  },
  wise: {
    alt: "TransferWise",
    logo: wiseLogo,
  },
};

/**
 * When true (set at build time via env), the homepage does not render the Market Sentiment
 * block at all, so its JS/CSS and socket-driven work are absent — use to compare Lighthouse
 * “with” vs “without” that section. Rebuild after changing .env.
 *
 * @see GATSBY_DISABLE_MARKET_SENTIMENT in .env — use "true" or "1" to disable.
 */
export const IS_HOMEPAGE_MARKET_SENTIMENT_DISABLED =
  typeof process.env.GATSBY_DISABLE_MARKET_SENTIMENT !== "undefined" &&
  /^(1|true|yes)$/i.test(
    String(process.env.GATSBY_DISABLE_MARKET_SENTIMENT).trim()
  );
