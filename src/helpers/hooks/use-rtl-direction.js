import { useState, useContext, useEffect } from "react";
import LanguageContext from "../../context/language-context";
import { ARABIC_LANG_ID } from "../lang.config";

export const useRtlDirection = () => {
  const { selectedLanguage } = useContext(LanguageContext);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(selectedLanguage.id === ARABIC_LANG_ID);
  }, [selectedLanguage]);

  return isRTL;
};
