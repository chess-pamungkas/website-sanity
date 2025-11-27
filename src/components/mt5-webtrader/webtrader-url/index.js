import { MT_LANGUAGES_MAP } from "../../../helpers/lang-options.config";
export const getWebTraderUrl = (selectedLanguage) => {
  const languageCode = MT_LANGUAGES_MAP[selectedLanguage.id];

  return `https://webtrader.oqtima.com/terminal?mode=connect&lang=${languageCode}&theme=light`;
};
