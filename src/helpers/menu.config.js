import {
  AccountTypesIcon,
  AllMarketsOverviewIcon,
  ContactUsIcon,
  CryptoIcon,
  EnergiesIcon,
  ForexIcon,
  FundingWithdrawalsIcon,
  HelpCenterIcon,
  IndicesIcon,
  IntroducingBrokersIcon,
  LegalIcon,
  Logo,
  MetalsIcon,
  PressAndNewsIcon,
  PrivateVPSIcon,
  SharesIcon,
  SwapFreeAccountIcon,
  TradingToolsIcon,
  ETFIcon,
  MT4Icon,
  MT5Icon,
  SpreadAndFeesIcon,
} from "../components/shared/icons";
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
      icon: AllMarketsOverviewIcon,
      description: "header-nav-tab-top-markets-allmarkets-desc",
    },
    {
      title: "header-nav-tab-top-markets-crypto-title-fsa",
      link: CRYPTO_PAGE_LINK,
      icon: CryptoIcon,
      description: "header-nav-tab-top-markets-crypto-desc-fsa",
    },
    {
      title: "header-nav-tab-top-markets-indices-title",
      link: INDICES_PAGE_LINK,
      icon: IndicesIcon,
      description: "header-nav-tab-top-markets-indices-desc",
    },
    {
      title: "header-nav-tab-top-markets-forex-title",
      link: FOREX_PAGE_LINK,
      icon: ForexIcon,
      description: "header-nav-tab-top-markets-forex-desc",
    },
    {
      title: "header-nav-tab-top-markets-metals-title",
      link: METALS_PAGE_LINK,
      icon: MetalsIcon,
      description: "header-nav-tab-top-markets-metals-desc",
    },
    {
      title: "header-nav-tab-top-markets-shares-title",
      link: SHARES_PAGE_LINK,
      icon: SharesIcon,
      description: "header-nav-tab-top-markets-shares-desc",
    },
    {
      title: "header-nav-tab-top-markets-energies-title",
      link: ENERGIES_PAGE_LINK,
      icon: EnergiesIcon,
      description: "header-nav-tab-top-markets-energies-desc",
    },
    {
      title: "header-nav-tab-top-markets-etf-title",
      link: ETF_PAGE_LINK,
      icon: ETFIcon,
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
      icon: MT4Icon,
      description: "header-nav-tab-platforms-mt4-desc",
    },
    {
      title: "header-nav-tab-platforms-mt5-title",
      link: MT5_PAGE_LINK,
      icon: MT5Icon,
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
      icon: AccountTypesIcon,
      description: "header-nav-tab-trading-funding-withdrawals-accounts-desc",
    },
    {
      title: "header-nav-tab-trading-funding-withdrawals-title",
      link: WITHDRAWAL_PAGE_LINK,
      icon: FundingWithdrawalsIcon,
      description: "header-nav-tab-trading-funding-withdrawals-desc",
    },
    {
      title: "header-nav-tab-trading-funding-withdrawals-spreads-title",
      link: SPREADS_AND_FEES_PAGE_LINK,
      icon: SpreadAndFeesIcon,
      description: "header-nav-tab-trading-funding-withdrawals-spreads-desc",
    },
    {
      title: "header-nav-tab-trading-trading-tools-title",
      link: TRADING_TOOLS_PAGE_LINK,
      icon: TradingToolsIcon,
      description: "header-nav-tab-trading-trading-tools-desc",
    },
    {
      title: "header-nav-tab-trading-vps-title",
      link: VPS_PAGE_LINK,
      icon: PrivateVPSIcon,
      description: "header-nav-tab-trading-vps-desc",
    },
    {
      title: "header-nav-tab-trading-swap-free-title",
      link: SWAP_FREE_PAGE_LINK,
      icon: SwapFreeAccountIcon,
      description: "header-nav-tab-trading-swap-free-desc",
    },
  ],
};

const FSA_COMPANY_TAB = {
  title: "header-nav-tab-company",
  subItems: [
    // Learn Column - Hidden (commented out)
    // {
    //   groupTitle: "header-nav-tab-trading-hub-learn-title",
    //   groupItems: [
    //     {
    //       title: "header-nav-tab-trading-hub-trading-academy-title",
    //       link: "/trading-academy",
    //       description: "header-nav-tab-trading-hub-trading-academy-desc",
    //     },
    //     {
    //       title: "header-nav-tab-trading-hub-beginners-guide-title",
    //       link: "/beginners-guide",
    //       description: "header-nav-tab-trading-hub-beginners-guide-desc",
    //     },
    //     {
    //       title: "header-nav-tab-trading-hub-intermediate-lessons-title",
    //       link: "/intermediate-lessons",
    //       description: "header-nav-tab-trading-hub-intermediate-lessons-desc",
    //     },
    //     {
    //       title: "header-nav-tab-trading-hub-advanced-playbook-title",
    //       link: "/advanced-playbook",
    //       description: "header-nav-tab-trading-hub-advanced-playbook-desc",
    //     },
    //   ],
    // },
    // Help Center Column
    {
      groupTitle: "header-nav-tab-trading-hub-help-center-title",
      groupItems: [
        // Hidden items - commented out
        // {
        //   title: "header-nav-tab-trading-hub-client-portal-assistance-title",
        //   link: "/client-portal-assistance",
        //   icon: HelpCenterIcon,
        //   description:
        //     "header-nav-tab-trading-hub-client-portal-assistance-desc",
        // },
        // {
        //   title: "header-nav-tab-trading-hub-platform-setup-guides-title",
        //   link: "/platform-setup-guides",
        //   icon: HelpCenterIcon,
        //   description: "header-nav-tab-trading-hub-platform-setup-guides-desc",
        // },
        {
          title: "header-nav-tab-company-help-center-title",
          link: FAQ_PAGE_LINK,
          icon: HelpCenterIcon,
          description: "header-nav-tab-company-help-center-desc",
        },
        {
          title: "header-nav-tab-trading-hub-newsroom-title",
          link: BLOG_URL,
          icon: PressAndNewsIcon,
          description: "header-nav-tab-trading-hub-newsroom-desc",
        },
        {
          title: "header-nav-tab-company-legal-title",
          link: LEGAL_PAGE_LINK,
          icon: LegalIcon,
          description: "header-nav-tab-company-legal-desc",
        },
      ],
    },
    // Contact Support Column
    {
      groupTitle: "header-nav-tab-trading-hub-contact-support-title",
      groupItems: [
        {
          title: "header-nav-tab-trading-hub-live-chat-title",
          link: CONTACT_US_PAGE_LINK,
          icon: ContactUsIcon,
          description: "header-nav-tab-trading-hub-live-chat-desc",
        },
        {
          title: "header-nav-tab-trading-hub-send-message-title",
          link: CONTACT_US_PAGE_LINK,
          icon: ContactUsIcon,
          description: "header-nav-tab-trading-hub-send-message-desc",
        },
        // Hidden item - commented out
        // {
        //   title: "header-nav-tab-trading-hub-support-hours-title",
        //   link: CONTACT_US_PAGE_LINK,
        //   icon: ContactUsIcon,
        //   description: "header-nav-tab-trading-hub-support-hours-desc",
        // },
      ],
    },
    // Legacy items for backward compatibility
    {
      desktopOnly: true,
      title: "header-nav-tab-partners-collaboration-partnership-title-fsa",
      link: PARTNERS_PAGE_LINK,
      icon: IntroducingBrokersIcon,
      description: "header-nav-tab-partners-collaboration-partnership-desc-fsa",
    },
    {
      footerOnly: true,
      title: "header-nav-tab-partners-fsa", // Use "Partners" title for footer
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

export const getMenuItems = () => FSA_MENU_ITEMS;
