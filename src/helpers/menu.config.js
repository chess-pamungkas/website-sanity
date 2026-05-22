/**
 * Full menu config with icon components.
 * Imported only when dropdown content is rendered (lazy chunk).
 */
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
import { getMenuStructure } from "./menu-structure.config";

const ICON_MAP = {
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
};

function mapItemWithIcon(item) {
  if (!item) return item;
  if (item.iconKey && ICON_MAP[item.iconKey]) {
    return { ...item, icon: ICON_MAP[item.iconKey] };
  }
  if (item.groupItems) {
    return { ...item, groupItems: item.groupItems.map(mapItemWithIcon) };
  }
  return item;
}

function mapMenuWithIcons(structure) {
  return structure.map((tab) => ({
    ...tab,
    subItems: tab.subItems ? tab.subItems.map(mapItemWithIcon) : undefined,
  }));
}

export const getMenuItems = () => mapMenuWithIcons(getMenuStructure());
