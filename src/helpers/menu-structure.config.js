/**
 * Menu structure without icon components (iconKey only).
 * Used by Header/Footer/BurgerMenu so the main bundle does not load 23 menu icons.
 * Full menu with icons is in menu.config.js and loaded only when dropdown content is shown.
 */
import {
  ACCOUNTS_TYPE_PAGE_LINK,
  ALL_MARKETS_PAGE_LINK,
  METALS_PAGE_LINK,
  COMPANY_PAGE_LINK,
  CONTACT_US_PAGE_LINK,
  CRYPTO_PAGE_LINK,
  ENERGIES_PAGE_LINK,
  FAQ_PAGE_LINK,
  FOREX_PAGE_LINK,
  INDICES_PAGE_LINK,
  LEGAL_PAGE_LINK,
  MT4_PAGE_LINK,
  MT5_PAGE_LINK,
  PARTNERS_PAGE_LINK,
  SHARES_PAGE_LINK,
  SPREADS_AND_FEES_PAGE_LINK,
  WITHDRAWAL_PAGE_LINK,
  TRADING_TOOLS_PAGE_LINK,
  ETF_PAGE_LINK,
  VPS_PAGE_LINK,
  SWAP_FREE_PAGE_LINK,
  PRIVACY_POLICY_PAGE_LINK,
  COOKIE_POLICY_PAGE_LINK,
  BLOG_URL,
} from "./constants";

const FSA_TOP_MARKETS_TAB = {
  title: "header-nav-tab-top-markets",
  subItems: [
    {
      title: "header-nav-tab-top-markets-allmarkets-title",
      link: ALL_MARKETS_PAGE_LINK,
      iconKey: "AllMarketsOverviewIcon",
      description: "header-nav-tab-top-markets-allmarkets-desc",
    },
    {
      title: "header-nav-tab-top-markets-crypto-title-fsa",
      link: CRYPTO_PAGE_LINK,
      iconKey: "CryptoIcon",
      description: "header-nav-tab-top-markets-crypto-desc-fsa",
    },
    {
      title: "header-nav-tab-top-markets-indices-title",
      link: INDICES_PAGE_LINK,
      iconKey: "IndicesIcon",
      description: "header-nav-tab-top-markets-indices-desc",
    },
    {
      title: "header-nav-tab-top-markets-forex-title",
      link: FOREX_PAGE_LINK,
      iconKey: "ForexIcon",
      description: "header-nav-tab-top-markets-forex-desc",
    },
    {
      title: "header-nav-tab-top-markets-metals-title",
      link: METALS_PAGE_LINK,
      iconKey: "MetalsIcon",
      description: "header-nav-tab-top-markets-metals-desc",
    },
    {
      title: "header-nav-tab-top-markets-shares-title",
      link: SHARES_PAGE_LINK,
      iconKey: "SharesIcon",
      description: "header-nav-tab-top-markets-shares-desc",
    },
    {
      title: "header-nav-tab-top-markets-energies-title",
      link: ENERGIES_PAGE_LINK,
      iconKey: "EnergiesIcon",
      description: "header-nav-tab-top-markets-energies-desc",
    },
    {
      title: "header-nav-tab-top-markets-etf-title",
      link: ETF_PAGE_LINK,
      iconKey: "ETFIcon",
      description: "header-nav-tab-top-markets-etf-desc",
    },
  ],
};

const FSA_PLATFORMS_TAB = {
  title: "header-nav-tab-platforms-title",
  subItems: [
    {
      title: "header-nav-tab-platforms-mt4-title",
      link: MT4_PAGE_LINK,
      iconKey: "MT4Icon",
      description: "header-nav-tab-platforms-mt4-desc",
    },
    {
      title: "header-nav-tab-platforms-mt5-title",
      link: MT5_PAGE_LINK,
      iconKey: "MT5Icon",
      description: "header-nav-tab-platforms-mt5-desc",
    },
  ],
};

const FSA_TRADING_TAB = {
  title: "header-nav-tab-trading",
  subItems: [
    {
      title: "header-nav-tab-trading-funding-withdrawals-accounts-title",
      link: ACCOUNTS_TYPE_PAGE_LINK,
      iconKey: "AccountTypesIcon",
      description: "header-nav-tab-trading-funding-withdrawals-accounts-desc",
    },
    {
      title: "header-nav-tab-trading-funding-withdrawals-title",
      link: WITHDRAWAL_PAGE_LINK,
      iconKey: "FundingWithdrawalsIcon",
      description: "header-nav-tab-trading-funding-withdrawals-desc",
    },
    {
      title: "header-nav-tab-trading-funding-withdrawals-spreads-title",
      link: SPREADS_AND_FEES_PAGE_LINK,
      iconKey: "SpreadAndFeesIcon",
      description: "header-nav-tab-trading-funding-withdrawals-spreads-desc",
    },
    {
      title: "header-nav-tab-trading-trading-tools-title",
      link: TRADING_TOOLS_PAGE_LINK,
      iconKey: "TradingToolsIcon",
      description: "header-nav-tab-trading-funding-withdrawals-spreads-desc",
    },
    {
      title: "header-nav-tab-trading-vps-title",
      link: VPS_PAGE_LINK,
      iconKey: "PrivateVPSIcon",
      description: "header-nav-tab-trading-vps-desc",
    },
    {
      title: "header-nav-tab-trading-swap-free-title",
      link: SWAP_FREE_PAGE_LINK,
      iconKey: "SwapFreeAccountIcon",
      description: "header-nav-tab-trading-swap-free-desc",
    },
  ],
};

const FSA_COMPANY_TAB = {
  title: "header-nav-tab-company",
  subItems: [
    {
      groupTitle: "header-nav-tab-trading-hub-help-center-title",
      groupItems: [
        {
          title: "header-nav-tab-company-help-center-title",
          link: FAQ_PAGE_LINK,
          iconKey: "HelpCenterIcon",
          description: "header-nav-tab-company-help-center-desc",
        },
        {
          title: "header-nav-tab-trading-hub-newsroom-title",
          link: BLOG_URL,
          iconKey: "PressAndNewsIcon",
          description: "header-nav-tab-trading-hub-newsroom-desc",
        },
        {
          title: "header-nav-tab-company-legal-title",
          link: LEGAL_PAGE_LINK,
          iconKey: "LegalIcon",
          description: "header-nav-tab-company-legal-desc",
        },
      ],
    },
    {
      groupTitle: "header-nav-tab-trading-hub-contact-support-title",
      groupItems: [
        {
          title: "header-nav-tab-trading-hub-live-chat-title",
          link: CONTACT_US_PAGE_LINK,
          iconKey: "ContactUsIcon",
          description: "header-nav-tab-trading-hub-live-chat-desc",
        },
        {
          title: "header-nav-tab-trading-hub-send-message-title",
          link: CONTACT_US_PAGE_LINK,
          iconKey: "ContactUsIcon",
          description: "header-nav-tab-trading-hub-send-message-desc",
        },
      ],
    },
    {
      desktopOnly: true,
      title: "header-nav-tab-partners-collaboration-partnership-title-fsa",
      link: PARTNERS_PAGE_LINK,
      iconKey: "IntroducingBrokersIcon",
      description: "header-nav-tab-partners-collaboration-partnership-desc-fsa",
    },
    {
      footerOnly: true,
      title: "header-nav-tab-partners-fsa",
      link: PARTNERS_PAGE_LINK,
    },
    {
      footerOnly: true,
      title: "document-privacy-policy-name",
      link: PRIVACY_POLICY_PAGE_LINK,
    },
    {
      footerOnly: true,
      title: "document-cookie-policy-fsa",
      link: COOKIE_POLICY_PAGE_LINK,
    },
  ],
};

const FSA_PARTNERS_TAB = {
  title: "header-nav-tab-partners-fsa",
  link: PARTNERS_PAGE_LINK,
  isPartners: true,
};

const FSA_MENU_ITEMS = [
  FSA_TOP_MARKETS_TAB,
  FSA_TRADING_TAB,
  FSA_PLATFORMS_TAB,
  FSA_COMPANY_TAB,
  FSA_PARTNERS_TAB,
];

export const getMenuStructure = () => FSA_MENU_ITEMS;
