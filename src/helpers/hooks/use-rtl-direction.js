import { useState, useContext, useEffect } from "react";
import LanguageContext from "../../context/language-context";

const RTL_LANGUAGES = ["ar"];
export const ARABIC_LANG_ID = "ar";

export const useRtlDirection = () => {
  const { selectedLanguage } = useContext(LanguageContext);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const shouldBeRTL =
      selectedLanguage?.id === ARABIC_LANG_ID ||
      RTL_LANGUAGES.includes(selectedLanguage?.id);

    console.groupEnd();

    setIsRTL(shouldBeRTL);
  }, [selectedLanguage]);

  return isRTL;
};
