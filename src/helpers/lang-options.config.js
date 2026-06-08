import {
  CnFlagIcon,
  EnFlagIcon,
  EsFlagIcon,
  FrFlagIcon,
  IdFlagIcon,
  ItFlagIcon,
  JpFlagIcon,
  ThFlagIcon,
  VnFlagIcon,
  BrFlagIcon,
  MyFlagIcon,
  ArFlagIcon,
} from "../components/shared/icons/flags";
import { ENTITY_LANGUAGES } from "./lang.config";

const IconComponents = {
  EnFlagIcon: EnFlagIcon,
  FrFlagIcon: FrFlagIcon,
  EsFlagIcon: EsFlagIcon,
  ItFlagIcon: ItFlagIcon,
  CnFlagIcon: CnFlagIcon,
  VnFlagIcon: VnFlagIcon,
  ThFlagIcon: ThFlagIcon,
  IdFlagIcon: IdFlagIcon,
  JpFlagIcon: JpFlagIcon,
  BrFlagIcon: BrFlagIcon,
  MyFlagIcon: MyFlagIcon,
  ArFlagIcon: ArFlagIcon,
};

export const LANG_SELECT_OPTIONS = ENTITY_LANGUAGES.map((languageItem) => {
  languageItem.icon = IconComponents[languageItem.icon];

  return languageItem;
});

export const SHOULD_BE_SMALLER_LANGUAGES = ["Русский", "Ελληνικά"];

// MT4/MT5 supported languages: https://www.mql5.com/en/articles/3024
export const MT_LANGUAGES_MAP = {
  en: "en",
  fr: "fr",
  br: "pt",
  vn: "vi",
  th: "th",
  es: "es",
  it: "it",
  cn: "zh",
  zh: "zt",
  id: "id",
  jp: "ja",
  pt: "pt",
  de: "de",
  my: "ms",
  ar: "ar",
};

// PORTAL OQTIMA supported languages: https://portal.oqtima
export const PORTAL_LANGUAGES_MAP = {
  en: "en",
  fr: "fr",
  br: "pt",
  vn: "vi",
  th: "th",
  es: "es",
  it: "it",
  cn: "zh-Hans",
  zh: "zh-Hant",
  id: "id",
  jp: "ja",
  my: "ms",
  ar: "ar",
};
