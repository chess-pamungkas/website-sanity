import React from "react";
// import metaTrader4 from "../assets/images/icons/tools/metaTrader4.svg";
// import metaTrader5 from "../assets/images/icons/tools/metaTrader5.svg";
import {
  MT4_PAGE_LINK,
  MT5_PAGE_LINK,
  MT5_WEB_TRADER_LINK,
  MT4_WEB_TRADER_LINK,
} from "./constants";

import { isIOS, isAndroid, isWindows, isMacOs } from "react-device-detect";
import { useWindowSize } from "./hooks/use-window-size";
import { useTranslationWithVariables } from "./hooks/use-translation-with-vars";

export const CTRADER_DOWNLOAD_LINKS = {
  getAndroidLink: () =>
    "https://play.google.com/store/apps/details?id=com.oqtima.app",
  getIOSLink: () => "https://apps.apple.com/cy/app/oqtima-ctrader/id1672522637",
  getWindowsLink: () =>
    "https://getctrader.com/oqtima/ctrader-oqtima-setup.exe",
  getWebTraderLink: () => "https://app.oqtima.com/",
  getMacLink: () =>
    "https://getctradermac.com/spotware/ctrader-spotware-setup.dmg",
};

export const TRADING_VIEW_DOWNLOAD_LINKS = {
  android: "/",
  ios: "/",
  windows: "/",
  mac: "/",
  webtrader: "/",
};

export const MT4_DOWNLOAD_LINKS = {
  getAndroidLink: () =>
    "https://download.mql5.com/cdn/mobile/mt4/android?server=OqtimaGlobal-Demo,OqtimaGlobal-Server",
  getIOSLink: () =>
    "https://download.mql5.com/cdn/mobile/mt4/ios?server=OqtimaGlobal-Demo,OqtimaGlobal-Server",
  getWindowsLink: () =>
    "https://download.mql5.com/cdn/web/oqtima.global.limited/mt4/oqtimaglobal4setup.exe",
  getWebTraderLink: () => MT4_WEB_TRADER_LINK,
  getMacLink: () =>
    "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt4/MetaTrader4.pkg.zip",
  getHuaweiLink: () => "https://appgallery.huawei.com/#/app/C102015319",
};

export const MT5_DOWNLOAD_LINKS = {
  getAndroidLink: () =>
    "https://download.mql5.com/cdn/mobile/mt5/android?server=OQtima-Live",
  getIOSLink: () =>
    "https://download.mql5.com/cdn/mobile/mt5/ios?server=OQtima-Live",
  getWindowsLink: () =>
    "https://download.mql5.com/cdn/web/22911/mt5/oqtima5setup.exe",
  getWebTraderLink: () => MT5_WEB_TRADER_LINK,
  getMacLink: () =>
    "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.pkg.zip",
  // getHuaweiLink: () => "https://appgallery.huawei.com/#/app/C102015329",
};

export const getMT4DownloadLink = () => {
  switch (true) {
    case isIOS:
      return MT4_DOWNLOAD_LINKS.getIOSLink();
    case isAndroid:
      return MT4_DOWNLOAD_LINKS.getAndroidLink();
    case isWindows:
      return MT4_DOWNLOAD_LINKS.getWindowsLink();
    case isMacOs:
      return MT4_DOWNLOAD_LINKS.getMacLink();
    default:
      return MT4_DOWNLOAD_LINKS.getWindowsLink();
  }
};

export const getMT5DownloadLink = () => {
  switch (true) {
    case isIOS:
      return MT5_DOWNLOAD_LINKS.getIOSLink();
    case isAndroid:
      return MT5_DOWNLOAD_LINKS.getAndroidLink();
    case isWindows:
      return MT5_DOWNLOAD_LINKS.getWindowsLink();
    case isMacOs:
      return MT5_DOWNLOAD_LINKS.getMacLink();
    default:
      return MT5_DOWNLOAD_LINKS.getWindowsLink();
  }
};

const FSA_MT5_ADVANTAGES = [
  { key: "adv1", text: "mt5_market-items-list_adv1-fsa" },
  { key: "adv2", text: "mt5_market-items-list_adv2-fsa" },
  { key: "adv3", text: "mt5_market-items-list_adv3-fsa" },
  { key: "adv4", text: "mt5_market-items-list_adv4-fsa" },
  { key: "adv5", text: "mt5_market-items-list_adv5-fsa" },
  { key: "adv6", text: "mt5_market-items-list_adv6-fsa" },
  { key: "adv7", text: "mt5_market-items-list_adv7-fsa" },
  { key: "adv8", text: "mt5_market-items-list_adv8-fsa" },
];

const FSA_MT4_ADVANTAGES = [
  { key: "adv1", text: "mt4_market-items-list_adv1-fsa" },
  { key: "adv2", text: "mt4_market-items-list_adv2-fsa" },
  { key: "adv3", text: "mt4_market-items-list_adv3-fsa" },
  { key: "adv4", text: "mt4_market-items-list_adv4-fsa" },
  { key: "adv5", text: "mt4_market-items-list_adv5-fsa" },
  { key: "adv6", text: "mt4_market-items-list_adv6-fsa" },
  { key: "adv7", text: "mt4_market-items-list_adv7-fsa" },
  { key: "adv8", text: "mt4_market-items-list_adv8-fsa" },
];

export const getMT4Advantages = () => FSA_MT4_ADVANTAGES;
export const getMT5Advantages = () => FSA_MT5_ADVANTAGES;

const MetaTrader4info = () => {
  const META_TRADER_4 = {
    key: "mtTrader4",
    icon: metaTrader4,
    title: "platforms_meta-trader-4-title",
    text: ["platforms_meta-trader-4-text-1", "platforms_meta-trader-4-text-2"],
    isGrayBackground: false,
    learMoreLink: MT4_PAGE_LINK,
    downloadLink: getMT4DownloadLink(),
    learMoreLinkTitle: "platforms_meta-trader-4-more-link-title",
    downloadLinkTitle: "platforms_meta-trader-4-download-link-title",
    advantages: [
      {
        key: "mtTrader4-advantage-1",
        text: "platforms_meta-trader-4-advantage-1",
      },
      {
        key: "mtTrader4-advantage-2",
        text: "platforms_meta-trader-4-advantage-2",
      },
      {
        key: "mtTrader4-advantage-3",
        text: "platforms_meta-trader-4-advantage-3",
      },
      {
        key: "mtTrader4-advantage-4",
        text: "platforms_meta-trader-4-advantage-4",
      },
      {
        key: "mtTrader4-advantage-5",
        text: "platforms_meta-trader-4-advantage-5",
      },
      {
        key: "mtTrader4-advantage-6",
        text: "platforms_meta-trader-4-advantage-6",
      },
      {
        key: "mtTrader4-advantage-7",
        text: "platforms_meta-trader-4-advantage-7-fsa",
      },
      {
        key: "mtTrader4-advantage-8",
        text: "platforms_meta-trader-4-advantage-8",
      },
      {
        key: "mtTrader4-advantage-9",
        text: "platforms_meta-trader-4-advantage-9",
      },
      {
        key: "mtTrader4-advantage-10",
        text: "platforms_meta-trader-4-advantage-10",
      },
    ],
  };
  return META_TRADER_4;
};

const MetaTrader5info = () => {
  const META_TRADER_5 = {
    key: "mtTrader5",
    icon: metaTrader5,
    title: "platforms_meta-trader-5-title",
    text: ["platforms_meta-trader-5-text-1"],
    isGrayBackground: true,
    learMoreLink: MT5_PAGE_LINK,
    downloadLink: getMT5DownloadLink(),
    learMoreLinkTitle: "platforms_meta-trader-5-more-link-title",
    downloadLinkTitle: "platforms_meta-trader-5-download-link-title",
    advantages: [
      {
        key: "mtTrader5-advantage-1",
        text: "platforms_meta-trader-5-advantage-1",
      },
      {
        key: "mtTrader5-advantage-2",
        text: "platforms_meta-trader-5-advantage-2",
      },
      {
        key: "mtTrader5-advantage-3",
        text: "platforms_meta-trader-5-advantage-3",
      },
      {
        key: "mtTrader5-advantage-4",
        text: "platforms_meta-trader-5-advantage-4",
      },
      {
        key: "mtTrader5-advantage-5",
        text: "platforms_meta-trader-5-advantage-5",
      },
      {
        key: "mtTrader5-advantage-6",
        text: "platforms_meta-trader-5-advantage-6",
      },
      {
        key: "mtTrader5-advantage-7",
        text: "platforms_meta-trader-5-advantage-7",
      },
      {
        key: "mtTrader5-advantage-8",
        text: "platforms_meta-trader-5-advantage-8",
      },
      {
        key: "mtTrader5-advantage-9",
        text: "platforms_meta-trader-5-advantage-9",
      },
      {
        key: "mtTrader5-advantage-10",
        text: "platforms_meta-trader-5-advantage-10",
      },
      {
        key: "mtTrader5-advantage-11",
        text: "platforms_meta-trader-5-advantage-11",
      },
    ],
  };
  return META_TRADER_5;
};

export const CTRADER_ADVANTAGES = [
  { key: "adv1", text: "ctrader_market-items-list_adv1" },
  { key: "adv2", text: "ctrader_market-items-list_adv2" },
  { key: "adv3", text: "ctrader_market-items-list_adv3" },
  { key: "adv4", text: "ctrader_market-items-list_adv4" },
  { key: "adv5", text: "ctrader_market-items-list_adv5" },
  { key: "adv6", text: "ctrader_market-items-list_adv6" },
  { key: "adv7", text: "ctrader_market-items-list_adv7" },
  { key: "adv8", text: "ctrader_market-items-list_adv8" },
  { key: "adv9", text: "ctrader_market-items-list_adv9" },
  { key: "adv10", text: "ctrader_market-items-list_adv10" },
  { key: "adv11", text: "ctrader_market-items-list_adv11" },
  { key: "adv12", text: "ctrader_market-items-list_adv12" },
  { key: "adv13", text: "ctrader_market-items-list_adv13" },
];

export const TRADING_VIEW_ADVANTAGES = [
  { key: "adv1", text: "trading-view_market-items-list_adv1" },
  { key: "adv2", text: "trading-view_market-items-list_adv2" },
  { key: "adv3", text: "trading-view_market-items-list_adv3" },
  { key: "adv4", text: "trading-view_market-items-list_adv4" },
  { key: "adv5", text: "trading-view_market-items-list_adv5" },
  { key: "adv6", text: "trading-view_market-items-list_adv6" },
  { key: "adv7", text: "trading-view_market-items-list_adv7" },
  { key: "adv8", text: "trading-view_market-items-list_adv8" },
  { key: "adv9", text: "trading-view_market-items-list_adv9" },
  { key: "adv10", text: "trading-view_market-items-list_adv10" },
  { key: "adv11", text: "trading-view_market-items-list_adv11" },
  { key: "adv12", text: "trading-view_market-items-list_adv12" },
  { key: "adv13", text: "trading-view_market-items-list_adv13" },
  { key: "adv14", text: "trading-view_market-items-list_adv14" },
];

export { MetaTrader4info, MetaTrader5info };

export const getCTraderDownloadLink = () => {
  switch (true) {
    case isIOS:
      return CTRADER_DOWNLOAD_LINKS.getIOSLink();
    case isAndroid:
      return CTRADER_DOWNLOAD_LINKS.getAndroidLink();
    case isWindows:
      return CTRADER_DOWNLOAD_LINKS.getWindowsLink();
    default:
      return CTRADER_DOWNLOAD_LINKS.getWindowsLink();
  }
};

export const cTraderDownloadTabs = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      id: 1,
      title: t("mt-promotion-tabs-mobile"),
      content: (
        <>
          <a href={CTRADER_DOWNLOAD_LINKS.getAndroidLink()}>
            {t("ctrader_mt-promotion-download-android")}
          </a>
          <a href={CTRADER_DOWNLOAD_LINKS.getIOSLink()}>
            {t("ctrader_mt-promotion-download-ios")}
          </a>
        </>
      ),
    },
    {
      id: 2,
      title: t("mt-promotion-tabs-desktop"),
      content: (
        <>
          <a href={CTRADER_DOWNLOAD_LINKS.getWindowsLink()}>
            {t("ctrader_mt-promotion-download-windows")}
          </a>
          <a href={CTRADER_DOWNLOAD_LINKS.getMacLink()}>
            {t("ctrader_mt-promotion-download-mac")}
          </a>
        </>
      ),
    },
    {
      id: 3,
      title: t("mt-promotion-tabs-webtrader"),
      content: (
        <>
          <a
            href={CTRADER_DOWNLOAD_LINKS.getWebTraderLink()}
            target="_blank"
            rel="noreferrer"
          >
            {t("ctrader_mt-promotion-download-webtrader")}
          </a>
        </>
      ),
    },
  ];
};

export const mt4DownloadTabs = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      id: 1,
      title: t("mt-promotion-tabs-mobile"),
      content: (
        <>
          <a href={MT4_DOWNLOAD_LINKS.getAndroidLink()}>
            {t("mt4_mt-promotion-download-android")}
          </a>
          <a href={MT4_DOWNLOAD_LINKS.getIOSLink()}>
            {t("mt4_mt-promotion-download-ios")}
          </a>
          <a href={MT4_DOWNLOAD_LINKS.getHuaweiLink()}>
            {t("mt4_mt-promotion-download-huawei")}
          </a>
        </>
      ),
    },
    {
      id: 2,
      title: t("mt-promotion-tabs-desktop"),
      content: (
        <>
          <a href={MT4_DOWNLOAD_LINKS.getMacLink()}>
            {t("mt4_mt-promotion-download-mac")}
          </a>
          <a href={MT4_DOWNLOAD_LINKS.getWindowsLink()}>
            {t("mt4_mt-promotion-download-windows")}
          </a>
        </>
      ),
    },
    {
      id: 3,
      title: t("mt-promotion-tabs-webtrader"),
      content: (
        <>
          <a
            href={MT4_DOWNLOAD_LINKS.getWebTraderLink()}
            target="_blank"
            rel="noreferrer"
          >
            {t("mt4_mt-promotion-download-webtrader")}
          </a>
        </>
      ),
    },
  ];
};

export const mt5DownloadTabs = () => {
  const { t } = useTranslationWithVariables();
  return [
    {
      id: 1,
      title: t("mt-promotion-tabs-mobile"),
      content: (
        <>
          <a href={MT5_DOWNLOAD_LINKS.getAndroidLink()}>
            {t("mt5_mt-promotion-download-android")}
          </a>
          <a href={MT5_DOWNLOAD_LINKS.getIOSLink()}>
            {t("mt5_mt-promotion-download-ios")}
          </a>
          {/* <a href={MT5_DOWNLOAD_LINKS.getHuaweiLink()}>
            {t("mt5_mt-promotion-download-huawei")}
          </a> */}
        </>
      ),
    },
    {
      id: 2,
      title: t("mt-promotion-tabs-desktop"),
      content: (
        <>
          <a href={MT5_DOWNLOAD_LINKS.getMacLink()}>
            {t("mt5_mt-promotion-download-mac")}
          </a>
          <a href={MT5_DOWNLOAD_LINKS.getWindowsLink()}>
            {t("mt5_mt-promotion-download-windows")}
          </a>
        </>
      ),
    },
    {
      id: 3,
      title: t("mt-promotion-tabs-webtrader"),
      content: (
        <>
          <a
            href={MT5_DOWNLOAD_LINKS.getWebTraderLink()}
            target="_blank"
            rel="noreferrer"
          >
            {t("mt5_mt-promotion-download-webtrader")}
          </a>
        </>
      ),
    },
  ];
};

export const getTradersList = () => [MetaTrader4info(), MetaTrader5info()];
export const getAnimationStyle = () => {
  const { isMobile, isTablet, isLG, isXL } = useWindowSize();

  switch (true) {
    case isXL:
      return { height: 700 };
    case isLG:
      return { height: 444 };
    case isTablet:
      return { height: 540 };
    case isMobile:
      return { height: 358 };
    default:
      return { height: 358 };
  }
};

// Platform Selection Configuration
export const PLATFORM_SELECTION_CONFIG = () => {
  const { t } = useTranslationWithVariables();

  return {
    tabs: [
      { id: "mobile", label: t("platform-selection_mobile-tablet") },
      { id: "desktop", label: t("platform-selection_desktop") },
      { id: "webtrader", label: t("platform-selection_webtrader") },
    ],
    mobilePlatforms: [
      {
        id: "android",
        name: t("platform-selection_mt4-android"),
        color: "#4CAF50",
      },
      {
        id: "ios",
        name: t("platform-selection_mt4-ios"),
        color: "#000000",
      },
      {
        id: "huawei",
        name: t("platform-selection_mt4-huawei"),
        color: "#000000",
      },
    ],
    desktopPlatforms: [
      {
        id: "windows",
        name: t("platform-selection_mt4-windows"),
        color: "#0078D4",
      },
      {
        id: "mac",
        name: t("platform-selection_mt4-mac"),
        color: "#000000",
      },
    ],
    webtraderPlatforms: [
      {
        id: "browser",
        name: t("platform-selection_mt4-webtrader"),
        color: "#FF4400",
      },
    ],
  };
};
