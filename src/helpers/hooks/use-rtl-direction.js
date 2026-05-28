import { useContext } from "react";
import LanguageContext from "../../context/language-context";
import { ARABIC_LANG_ID } from "../lang.config";

/** Sync with LanguageContext — no useEffect delay (avoids RTL hero flicker on hydrate). */
export const useRtlDirection = () => {
  const { selectedLanguage } = useContext(LanguageContext);
  return selectedLanguage?.id === ARABIC_LANG_ID;
};
