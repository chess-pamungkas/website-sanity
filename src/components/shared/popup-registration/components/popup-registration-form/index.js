import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Formik } from "formik";
import cn from "classnames";
import { PopupRegistrationSchema } from "../../../../../validations/popup-registration";
import axios from "axios";
import { Trans, useTranslation } from "react-i18next";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslationWithVariables } from "../../../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../../../helpers/hooks/use-rtl-direction";
import { sendLog } from "../../../../../helpers/services/log-service";
import countries from "../../../../shared/countries";
import ClientResolverContext from "../../../../../context/client-resolver-context";
import { PORTAL_LANGUAGES_MAP } from "../../../../../helpers/lang-options.config";
import LanguageContext from "../../../../../context/language-context";
import arrowDownIcon from "../../../../../assets/images/icons/arrow-down.png";

const RTL_LANGUAGES = ["ar"];

const ERROR_CODE_MAP = {
  99: "popup-registration-error-unexpected",
  10001: "popup-registration-error-invalid-data",
  10002: "popup-registration-error-operation-failure",
  10017: "popup-registration-error-signature-verification",
  40018: "popup-registration-error-blacklisted",
  40035: "popup-registration-error-ip-blocked",
  41009: "popup-registration-error-referral-code",
  41040: "popup-registration-error-registration-failed",
  80003: "popup-registration-error-password-format",
  80084: "popup-registration-error-email-format",
  80051: "popup-registration-error-email-taken",
};

const CodeDropdown = ({
  searchCode,
  setSearchCode,
  selectedCountryCode,
  handleCodeSelect,
  t,
  codeOptionsRef,
  setIsCodeOpen,
  errors,
  touched,
}) => {
  const initialActiveIndex = useMemo(() => {
    if (!selectedCountryCode) return 0;
    return (
      countries.findIndex((country) => country.code === selectedCountryCode) ||
      0
    );
  }, [selectedCountryCode]);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const filteredCodes = useMemo(() => {
    if (!searchCode) return countries;
    const searchTerm = searchCode.toLowerCase().trim();

    if (/^[+\d]/.test(searchTerm)) {
      return countries.filter((country) =>
        country.code.replace("+", "").startsWith(searchTerm.replace("+", ""))
      );
    }
    return countries.filter((country) =>
      country.name.toLowerCase().startsWith(searchTerm)
    );
  }, [searchCode]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchCode]);

  useEffect(() => {
    if (codeOptionsRef.current && selectedCountryCode) {
      const selectedElement = codeOptionsRef.current.querySelector(
        ".custom-dropdown__option--selected"
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [selectedCountryCode]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredCodes.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCodes.length > 0) {
          handleCodeSelect(filteredCodes[activeIndex].code);
          setSearchCode("");
          setIsCodeOpen(false);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="custom-dropdown__content">
      <input
        type="text"
        className={cn("custom-dropdown__search", {
          "custom-dropdown__search--error":
            errors.country_code && touched.country_code,
        })}
        placeholder={t("popup-registration-search")}
        value={searchCode}
        onChange={(e) => setSearchCode(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="custom-dropdown__options" ref={codeOptionsRef}>
        {filteredCodes.map((country, index) => (
          <div
            key={`${country.code}-${index}`}
            className={`custom-dropdown__option ${
              selectedCountryCode === country.code
                ? "custom-dropdown__option--selected"
                : ""
            } ${
              index === activeIndex ? "custom-dropdown__option--active" : ""
            }`}
            onClick={() => {
              handleCodeSelect(country.code);
              setSearchCode("");
              setIsCodeOpen(false);
            }}
          >
            {`${country.name} ${country.code}`}
          </div>
        ))}
      </div>
      {errors.country_code && touched.country_code && (
        <div className="popup-registration__error">
          {t(errors.country_code)}
        </div>
      )}
    </div>
  );
};

const CountryDropdown = ({
  searchCountry,
  setSearchCountry,
  selectedCountry,
  handleCountrySelect,
  t,
  countryOptionsRef,
  filteredCountries,
  setFieldValue,
  setIsCountryOpen,
  errors,
  touched,
}) => {
  const initialActiveIndex = useMemo(() => {
    if (!selectedCountry) return 0;
    return (
      countries.findIndex((country) => country.name === selectedCountry) || 0
    );
  }, [selectedCountry]);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchCountry]);

  useEffect(() => {
    if (countryOptionsRef.current && selectedCountry) {
      const selectedElement = countryOptionsRef.current.querySelector(
        ".custom-dropdown__option--selected"
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [selectedCountry]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCountries.length > 0) {
          handleCountrySelect(filteredCountries[activeIndex].name);
          setSearchCountry("");
          setIsCountryOpen(false);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="custom-dropdown__content">
      <input
        type="text"
        className={cn("custom-dropdown__search", {
          "custom-dropdown__search--error": errors.country && touched.country,
        })}
        placeholder={t("popup-registration-search")}
        value={searchCountry}
        onChange={(e) => setSearchCountry(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="custom-dropdown__options" ref={countryOptionsRef}>
        {filteredCountries.map((country, index) => (
          <div
            key={country.name}
            className={`custom-dropdown__option ${
              selectedCountry === country.name
                ? "custom-dropdown__option--selected"
                : ""
            } ${
              index === activeIndex ? "custom-dropdown__option--active" : ""
            }`}
            onClick={() => {
              handleCountrySelect(country.name);
              setSearchCountry("");
              setIsCountryOpen(false);
            }}
          >
            {country.name}
          </div>
        ))}
      </div>
      {errors.country && touched.country && (
        <div className="popup-registration__error">{t(errors.country)}</div>
      )}
    </div>
  );
};

// Wrapper component to force remount when RTL changes
const RTLAwareForm = ({ children, isRTLMode, language }) => {
  // Use a key to force remount of child components when RTL changes
  return (
    <div key={`${isRTLMode ? "rtl" : "ltr"}-${language}-wrapper`}>
      {children}
    </div>
  );
};

const PopupRegistrationForm = ({ params }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const countryOptionsRef = useRef(null);
  const codeOptionsRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSentSuccessful, setIsSentSuccessful] = useState(null);
  const API_URL = process.env.GATSBY_OQTIMA_API_URL;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { clientConfig } = useContext(ClientResolverContext);
  const { selectedLanguage } = useContext(LanguageContext);

  // Add effect to prevent incorrect language and RTL settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("PopupRegistrationForm: Checking language settings");

      // Detect if we have explicit language in params
      let specificLanguage = null;
      let dataLang = null;

      try {
        // Try to get language from params
        if (typeof params === "string") {
          const parsedParams = JSON.parse(params);
          if (parsedParams.langParam) {
            specificLanguage = parsedParams.langParam;
          }
          if (parsedParams.dataLang) {
            dataLang = parsedParams.dataLang;
          }
        } else if (params) {
          if (params.langParam) {
            specificLanguage = params.langParam;
          }
          if (params.dataLang) {
            dataLang = params.dataLang;
          }
        }

        // Check URL search params
        if (!specificLanguage) {
          const urlParams = new URLSearchParams(window.location.search);
          specificLanguage = urlParams.get("language") || urlParams.get("lang");

          if (!dataLang) {
            dataLang = urlParams.get("data-lang");
          }
        }

        console.log(
          "Detected languages - specificLanguage:",
          specificLanguage,
          "dataLang:",
          dataLang
        );

        // Store in sessionStorage for this tab only
        if (specificLanguage) {
          try {
            sessionStorage.setItem("oqtima_tab_language", specificLanguage);
          } catch (e) {
            /* ignore */
          }
        }

        // CRITICAL FIX: Handle conflict between data-lang="ar" and language="en"
        // If we have a language param of "en" but data-lang of "ar", explicitly force "en"
        if (
          specificLanguage &&
          specificLanguage.toLowerCase() === "en" &&
          dataLang &&
          dataLang.toLowerCase() === "ar"
        ) {
          console.log(
            "CRITICAL FIX: Detected conflict between language='en' and data-lang='ar'"
          );
          console.log("Forcing English language and LTR mode");

          // Fix document attributes
          document.documentElement.setAttribute("dir", "ltr");
          document.body.setAttribute("dir", "ltr");
          document.documentElement.setAttribute("lang", "en");

          // Remove RTL classes
          document.documentElement.classList.remove(
            "rtl-active",
            "rtl",
            "is-rtl"
          );
          document.body.classList.remove("rtl-active", "rtl", "is-rtl");

          // Fix global flags
          window.__FORCE_RTL__ = false;
          window.__ORIGINAL_RTL__ = false;
          window.gatsby_i18next_language = "en";

          // Save correct language to sessionStorage (tab specific)
          try {
            sessionStorage.setItem("oqtima_tab_language", "en");
            // Only set localStorage if it already has a value
            if (localStorage.getItem("i18nextLng")) {
              localStorage.setItem("i18nextLng", "en");
            }
          } catch (e) {
            /* ignore */
          }

          // Add special override to prevent automatic RTL detection
          window.__OQTIMA_DISABLE_AUTO_RTL__ = true;

          // Force visual refresh
          document.body.style.display = "none";
          setTimeout(() => {
            document.body.style.display = "";
          }, 10);
        }
        // If we have a specific language and it's not Arabic, ensure we're not in RTL mode
        else if (specificLanguage && specificLanguage.toLowerCase() !== "ar") {
          console.log(`Form detected non-Arabic language: ${specificLanguage}`);

          // Fix incorrect RTL settings
          if (
            document.documentElement.dir === "rtl" ||
            document.documentElement.getAttribute("lang") === "ar" ||
            document.documentElement.classList.contains("rtl-active")
          ) {
            console.log("CORRECTING INCORRECT RTL SETTINGS");

            // Fix document attributes
            document.documentElement.setAttribute("dir", "ltr");
            document.body.setAttribute("dir", "ltr");
            document.documentElement.setAttribute("lang", specificLanguage);

            // Remove RTL classes
            document.documentElement.classList.remove(
              "rtl-active",
              "rtl",
              "is-rtl"
            );
            document.body.classList.remove("rtl-active", "rtl", "is-rtl");

            // Fix global flags
            if (window.__FORCE_RTL__) window.__FORCE_RTL__ = false;
            if (window.__ORIGINAL_RTL__) window.__ORIGINAL_RTL__ = false;
            if (window.gatsby_i18next_language === "ar") {
              try {
                window.gatsby_i18next_language = specificLanguage;
              } catch (e) {
                /* ignore */
              }
            }

            // Save correct language to sessionStorage (per tab)
            try {
              sessionStorage.setItem("oqtima_tab_language", specificLanguage);
              // Only set localStorage if it already has a value
              if (localStorage.getItem("i18nextLng")) {
                localStorage.setItem("i18nextLng", specificLanguage);
              }
            } catch (e) {
              /* ignore */
            }

            // Force visual refresh
            document.body.style.display = "none";
            setTimeout(() => {
              document.body.style.display = "";
            }, 10);
          }
        }
      } catch (e) {
        console.error("Error checking language settings:", e);
      }
    }
  }, [params]);

  // Parse params safely
  const safeParams = useMemo(() => {
    try {
      let parsedParams = {};

      // Try to parse JSON if params is a string
      if (typeof params === "string") {
        try {
          parsedParams = JSON.parse(params);
        } catch (jsonErr) {
          // If JSON parsing fails, assume it might be a simple string like a language code
          if (params && params.length <= 5) {
            // Most language codes are 2-5 chars
            parsedParams = { langParam: params };
          }
        }
      } else {
        parsedParams = params || {};
      }

      // IMPORTANT FIX: Sanitize the langParam if it contains a query string format
      if (parsedParams.langParam) {
        // Check if langParam mistakenly contains "?language=" or similar prefixes
        const langValue = parsedParams.langParam;

        if (langValue.includes("?")) {
          // Try to extract the actual language value from the query string
          try {
            // Handle cases like "?language=en" or "?lang=en"
            const queryMatch = langValue.match(
              /[?&](language|lang|locale)=([^&]+)/i
            );
            if (queryMatch && queryMatch[2]) {
              parsedParams.langParam = queryMatch[2];
            } else {
              // If we can't extract the language, default to "en"
              parsedParams.langParam = "en";
            }
          } catch (err) {
            // Default to "en" if we can't parse the language
            parsedParams.langParam = "en";
          }
        }
      }

      // Explicitly check for URL parameters that might contain language info
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for language parameters with various names
        const urlLangParam =
          urlParams.get("language") ||
          urlParams.get("lang") ||
          urlParams.get("locale") ||
          urlParams.get("i18nextLng");

        // Only override if URL contains language param and it's not already set
        if (urlLangParam && !parsedParams.langParam) {
          parsedParams.langParam = urlLangParam;
        }

        // Handle data-lang parameter which may be set as br (for brazilian portuguese)
        const urlDataLang = urlParams.get("data-lang");
        if (urlDataLang && !parsedParams.langParam) {
          parsedParams.langParam = urlDataLang;
        }

        // NEW: If URL parameters are empty, try to extract language from the iframe's src attribute
        // This is needed because some environments (like dev.oqt-ima.com) may not properly pass URL parameters
        if (!parsedParams.langParam && window.location.pathname) {
          // Check if we're in a language-specific path like /br/popup-registration
          const pathParts = window.location.pathname.split("/").filter(Boolean);
          if (pathParts.length > 0) {
            const possibleLang = pathParts[0];
            // Check if the first part of the path is a language code (typically 2-5 chars)
            if (possibleLang && possibleLang.length <= 5) {
              parsedParams.langParam = possibleLang;
            }
          }
        }
      }

      return parsedParams;
    } catch (e) {
      return {};
    }
  }, [params]);

  // Store referral parameters in state with defaults from parsed params
  const [referral_type, setReferralType] = useState(
    safeParams.referral_type || null
  );
  const [referral_value, setReferralValue] = useState(
    safeParams.referral_value || null
  );

  // ADDED: Store country and IP information with defaults
  const [clientIpAddress, setClientIpAddress] = useState(null);
  const [clientCountryName, setClientCountryName] = useState(null);
  const [clientCountryCode, setClientCountryCode] = useState(null);

  // ADDED: State untuk menampung language dari berbagai sumber
  const [languageFromUrl, setLanguageFromUrl] = useState(null);
  const [languageFromMessage, setLanguageFromMessage] = useState(null);

  // ADDED: Debug logger untuk nilai language yang sedang digunakan
  useEffect(() => {
    // Start with the source language following our priority order
    let initialLanguage =
      safeParams.langParam ||
      languageFromMessage ||
      languageFromUrl ||
      selectedLanguage?.id ||
      "en";

    // Check if we're in a path like /br/ and if so, ensure we're using 'br'
    if (typeof window !== "undefined" && window.location.pathname) {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0 && pathParts[0] === "br") {
        if (initialLanguage !== "br") {
          initialLanguage = "br";
        }
      }
    }

    // Normalize Brazilian Portuguese variations
    const brVariations = ["br", "pt-br", "pt_br", "pt-BR", "pt_BR"];
    if (brVariations.includes(initialLanguage.toLowerCase())) {
      initialLanguage = "pt";
    }

    // Get final language code
    const finalLanguageCode =
      PORTAL_LANGUAGES_MAP[initialLanguage] || initialLanguage || "en";
  }, [safeParams, languageFromMessage, languageFromUrl, selectedLanguage]);

  // Update state values when params change
  useEffect(() => {
    if (safeParams.referral_type) {
      setReferralType(safeParams.referral_type);
    }
    if (safeParams.referral_value) {
      setReferralValue(safeParams.referral_value);
    }

    // Update language from safeParams if available
    if (safeParams.langParam) {
      // Prioritas tertinggi adalah langParam dari safeParams
      setLanguageFromUrl(null); // Reset language from URL
      setLanguageFromMessage(null); // Reset language from message

      // We'll set languageFromUrl based on safeParams.langParam
      // This ensures our language priority logic works correctly
      setLanguageFromUrl(safeParams.langParam);
    }
  }, [safeParams]);

  // Listen for messages from parent window with higher priority
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "REGISTRATION_PARAMS") {
        const data = event.data.data || {};

        const msgReferralType = data.referral_type || null;
        const msgReferralValue = data.referral_value || null;
        const msgLanguage = data.language || data.lang || null;

        // ADDED: Extract client information from message
        const msgIpAddress = data.ip_address || null;
        const msgCountryName = data.country_name || null;
        const msgCountryCode = data.country_code || null;

        if (msgReferralType) setReferralType(msgReferralType);
        if (msgReferralValue) setReferralValue(msgReferralValue);

        // ADDED: Set client information if available
        if (msgIpAddress) setClientIpAddress(msgIpAddress);
        if (msgCountryName) setClientCountryName(msgCountryName);
        if (msgCountryCode) setClientCountryCode(msgCountryCode);

        // Set langParam from message if available
        if (msgLanguage) {
          // Store language from message to override context language
          setLanguageFromMessage(msgLanguage);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Try to extract parameters directly from URL immediately
    const extractUrlParams = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);

        // Check all possible parameter formats for referral
        const urlReferralType =
          urlParams.get("referral_type") ||
          urlParams.get("referralType") ||
          urlParams.get("referral-type");

        const urlReferralValue =
          urlParams.get("referral_value") ||
          urlParams.get("referralValue") ||
          urlParams.get("referral-value");

        // Set referral parameters if found in URL
        if (urlReferralType) setReferralType(urlReferralType);
        if (urlReferralValue) setReferralValue(urlReferralValue);

        // ENHANCED: If not found in URL, try sessionStorage (for popup mode)
        if (
          !urlReferralType &&
          !referral_type &&
          typeof window !== "undefined"
        ) {
          const storedReferralType = sessionStorage.getItem(
            "oqtima_referral_type"
          );
          if (storedReferralType) {
            console.log(
              "Found referral_type in sessionStorage:",
              storedReferralType
            );
            setReferralType(storedReferralType);
          }
        }

        if (
          !urlReferralValue &&
          !referral_value &&
          typeof window !== "undefined"
        ) {
          const storedReferralValue = sessionStorage.getItem(
            "oqtima_referral_value"
          );
          if (storedReferralValue) {
            console.log(
              "Found referral_value in sessionStorage:",
              storedReferralValue
            );
            setReferralValue(storedReferralValue);
          }
        }

        // ENHANCED: Check global window variables as a fallback
        if (
          !urlReferralType &&
          !referral_type &&
          typeof window !== "undefined"
        ) {
          if (window.__OQTIMA_REFERRAL_TYPE__) {
            console.log(
              "Found referral_type in window globals:",
              window.__OQTIMA_REFERRAL_TYPE__
            );
            setReferralType(window.__OQTIMA_REFERRAL_TYPE__);
          }
        }

        if (
          !urlReferralValue &&
          !referral_value &&
          typeof window !== "undefined"
        ) {
          if (window.__OQTIMA_REFERRAL_VALUE__) {
            console.log(
              "Found referral_value in window globals:",
              window.__OQTIMA_REFERRAL_VALUE__
            );
            setReferralValue(window.__OQTIMA_REFERRAL_VALUE__);
          }
        }

        // Extract language parameters for debugging
        const langParam =
          urlParams.get("language") ||
          urlParams.get("lang") ||
          urlParams.get("locale") ||
          urlParams.get("i18nextLng") ||
          urlParams.get("langParam");

        // IMPROVED: First check for language in URL parameters
        let detectedLanguage = null;

        if (langParam) {
          detectedLanguage = langParam;
        }

        // Check data-lang parameter specifically (highest priority for Brazilian Portuguese)
        const dataLang = urlParams.get("data-lang");
        if (dataLang) {
          detectedLanguage = dataLang;
        }

        // NEW: If URL parameters don't contain language, try to extract from pathname
        if (!detectedLanguage && window.location.pathname) {
          const pathParts = window.location.pathname.split("/").filter(Boolean);
          if (pathParts.length > 0) {
            const possibleLang = pathParts[0];
            // Check if first path segment looks like a language code
            if (possibleLang && possibleLang.length <= 5) {
              detectedLanguage = possibleLang;
            }
          }
        }

        // Set the language if detected from any source
        if (detectedLanguage) {
          setLanguageFromUrl(detectedLanguage);
        }
      } catch (err) {
        console.error("Error extracting parameters:", err);
      }
    };

    // Extract parameters from URL immediately
    extractUrlParams();

    // Try again after a short delay (for late-loading cases)
    const timeout = setTimeout(extractUrlParams, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  // Use the language parameter also to detect RTL
  // UPDATED: Implementasi prioritas language yang jelas
  // Prioritas: 1. langParam dari safeParams, 2. message, 3. URL param, 4. context, 5. fallback "en"
  let effectiveLanguage =
    safeParams.langParam ||
    languageFromMessage ||
    languageFromUrl ||
    selectedLanguage?.id ||
    "en";

  // SANITIZE: Function to clean up language codes that might be malformed
  const sanitizeLanguageCode = (code) => {
    // If code contains "?", it's likely malformed
    if (code && code.includes("?")) {
      // Try to extract the language part
      const match = code.match(/[?&](language|lang|locale)=([^&]+)/i);
      if (match && match[2]) {
        return match[2];
      }
      // Default to English if we can't extract
      return "en";
    }

    // If code is longer than 5 chars and not a common format like "zh-CN"
    if (code && code.length > 5 && !code.match(/^[a-z]{2}-[A-Z]{2}$/)) {
      return "en";
    }

    return code;
  };

  // Clean up the language code before using it
  effectiveLanguage = sanitizeLanguageCode(effectiveLanguage);

  // Force the path language when present in URL
  if (typeof window !== "undefined" && window.location.pathname) {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const pathLang = pathParts[0];
      if (pathLang && pathLang.length <= 5) {
        effectiveLanguage = pathLang;
      }
    }
  }

  // Normalize Brazilian Portuguese variations
  const brVariations = ["br", "pt-br", "pt_br", "pt-BR", "pt_BR"];
  if (brVariations.includes(effectiveLanguage.toLowerCase())) {
    effectiveLanguage = "pt";
  }

  // Check untuk RTL language
  const forcedRTL = RTL_LANGUAGES.includes(effectiveLanguage);
  const isRTLMode = isRTL || forcedRTL;

  // Add effect to properly handle RTL language changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if we're in popup mode
    const isInPopupMode =
      sessionStorage.getItem("oqtima_popup_mode") === "true";
    const parentDir = sessionStorage.getItem("oqtima_parent_dir") || "ltr";

    // If we're in popup mode, we should respect the parent document's direction
    // and only apply RTL styles to the popup itself
    const shouldModifyGlobalRTL = !isInPopupMode;

    console.log(
      `[RTL Update] In popup mode: ${isInPopupMode}, Parent dir: ${parentDir}, Should modify global: ${shouldModifyGlobalRTL}`
    );

    // Helper function to update RTL state immediately
    const updateRtlState = () => {
      console.log(
        `[RTL Update] Setting RTL mode to: ${isRTLMode} for language: ${effectiveLanguage} (popup mode: ${isInPopupMode})`
      );

      // Update global flags for RTL only if we're not in popup mode
      if (shouldModifyGlobalRTL) {
        window.__FORCE_RTL__ = isRTLMode;
        window.__ORIGINAL_RTL__ = isRTLMode;

        // Update document direction attribute
        document.documentElement.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
        document.body.setAttribute("dir", isRTLMode ? "rtl" : "ltr");

        // Update RTL classes - be thorough in class management
        if (isRTLMode) {
          document.documentElement.classList.add("rtl-active");
          document.body.classList.add("rtl-active");

          // Add additional RTL classes that might be used by the system
          document.documentElement.classList.add("rtl");
          document.body.classList.add("rtl");

          // Set data attributes for RTL
          document.documentElement.setAttribute("data-rtl", "true");
          document.body.setAttribute("data-rtl", "true");
        } else {
          // Remove ALL possible RTL classes
          const rtlClasses = ["rtl-active", "rtl", "is-rtl"];
          rtlClasses.forEach((cls) => {
            document.documentElement.classList.remove(cls);
            document.body.classList.remove(cls);
          });

          // Remove data attributes related to RTL
          document.documentElement.removeAttribute("data-rtl");
          document.body.removeAttribute("data-rtl");
        }
      } else {
        // In popup mode, we DON'T modify the parent document's direction
        console.log(
          `[RTL Update] Respecting parent direction: ${parentDir} (popup mode)`
        );

        // We still set window flags for the iframe context
        window.__FORCE_RTL__ = isRTLMode;
        window.__ORIGINAL_RTL__ = isRTLMode;
      }

      // Apply form-specific RTL direction
      const formElement = document.querySelector(".popup-registration__form");
      if (formElement) {
        formElement.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
        formElement.style.direction = isRTLMode ? "rtl" : "ltr";
        formElement.style.textAlign = isRTLMode ? "right" : "left";

        if (isRTLMode) {
          formElement.classList.add("popup-registration__form--rtl");
        } else {
          formElement.classList.remove("popup-registration__form--rtl");
        }
      }

      // Apply RTL to all form controls for more consistent layout
      const formControls = document.querySelectorAll(
        ".popup-registration__form input, .popup-registration__form select, .popup-registration__form textarea"
      );
      formControls.forEach((control) => {
        control.setAttribute("dir", isRTLMode ? "rtl" : "ltr");
        control.style.textAlign = isRTLMode ? "right" : "left";
        control.style.direction = isRTLMode ? "rtl" : "ltr";
      });

      // Force UI update by triggering a reflow - only of the form container
      const formContainer = document.querySelector(
        ".popup-registration__form-container"
      );
      if (formContainer) {
        const reflow = formContainer.offsetHeight;
      }

      // Force repaint of elements by temporarily modifying display
      const formContainers = document.querySelectorAll(
        ".popup-registration__form, .popup-registration__container"
      );
      formContainers.forEach((container) => {
        if (container) {
          const originalDisplay = container.style.display;
          container.style.display = "none";
          // Force reflow
          const reflow = container.offsetHeight;
          container.style.display = originalDisplay;
        }
      });
    };

    // Call immediately
    updateRtlState();

    // Log RTL state change for debugging
    console.log(
      `[RTL Debug] RTL mode ${
        isRTLMode ? "enabled" : "disabled"
      } for language: ${effectiveLanguage} (popup mode: ${isInPopupMode})`
    );

    // Cleanup function
    return () => {
      // No need to revert direction attributes if in popup mode
    };
  }, [isRTLMode, effectiveLanguage]);

  // Map ke language code portal untuk API
  // Special handling for Brazilian Portuguese - ensure it maps to "pt" for API calls
  let portalLanguageCode;

  // First normalize effectiveLanguage to lowercase for case-insensitive comparison
  const effectiveLangLower = effectiveLanguage.toLowerCase();

  // Check if it's a Brazilian Portuguese variant
  if (
    effectiveLangLower === "br" ||
    effectiveLangLower === "pt" ||
    effectiveLangLower === "pt-br" ||
    effectiveLangLower === "pt_br"
  ) {
    // All Brazilian Portuguese variations should map to "pt" for API calls
    portalLanguageCode = "pt";
  } else {
    console.log("effectiveLanguage", effectiveLanguage);
    // For other languages, use the standard mapping
    portalLanguageCode = PORTAL_LANGUAGES_MAP[effectiveLanguage];
  }

  console.log("portalLanguageCode", portalLanguageCode);

  // Double-check if we're in a Brazilian Portuguese URL path but didn't catch it earlier
  if (typeof window !== "undefined" && window.location.pathname) {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0 && pathParts[0].toLowerCase() === "br") {
      portalLanguageCode = "pt";
    }
  }

  // Get translation function outside the effect to avoid the error
  const { i18n } = useTranslation();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [policyLinks, setPolicyLinks] = useState({
    privacyPolicy: "",
    cookiePolicy: "",
  });

  // Function to handle policy link clicks
  const handlePolicyLinkClick = (e, url) => {
    e.preventDefault();

    // Validate URL
    if (!url) {
      console.error("Empty or invalid policy URL");
      return;
    }

    console.log(`Attempting to open policy link: ${url}`);

    // Anti multi-click implementation
    const target = e.currentTarget;
    if (target.getAttribute("data-processing") === "true") {
      return;
    }

    // Set flag to prevent repeated clicks
    target.setAttribute("data-processing", "true");

    // Add visual feedback to the link to indicate it's being processed
    const originalText = target.innerHTML;
    target.innerHTML = `${originalText} <span style="display: inline-block; margin-left: 5px;">↗</span>`;

    // Get policy type from URL
    const policyType = url.toLowerCase().includes("privacy")
      ? "Privacy"
      : url.toLowerCase().includes("cookie")
      ? "Cookie"
      : url.toLowerCase().includes("terms")
      ? "Terms"
      : "Policy";

    // Try to open the window directly
    let policyWindow = null;
    try {
      policyWindow = window.open(url, "_blank", "noopener,noreferrer");

      // Check if the window opened successfully
      if (policyWindow && !policyWindow.closed) {
        // Success! Show checkmark
        target.innerHTML = `${originalText} <span style="display: inline-block; margin-left: 5px; color: green;">✓</span>`;
        setTimeout(() => {
          target.innerHTML = originalText;
          target.removeAttribute("data-processing");
        }, 1500);
      } else {
        // Window.open was blocked, show the link was blocked with different styling
        console.warn("window.open was blocked");
        target.style.textDecoration = "underline";
        target.style.fontWeight = "bold";
        target.style.color = "#ff4400";
        target.innerHTML = `${originalText} <span style="color: #ff4400;">(try again)</span>`;

        // Reset the original link after a while
        setTimeout(() => {
          target.innerHTML = originalText;
          target.style.textDecoration = "";
          target.style.fontWeight = "";
          target.style.color = "";
          target.removeAttribute("data-processing");
        }, 5000);

        // Log the blocked attempt
        console.log(`Policy link was blocked by the browser: ${url}`);

        // Track analytics if available
        try {
          if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
              event: "policy_link_blocked",
              policyType: policyType,
              url: url,
            });
          }
        } catch (err) {
          // Ignore analytics errors
        }
      }
    } catch (err) {
      console.error("Error opening policy window:", err);

      // Reset the link on error
      target.innerHTML = originalText;
      target.removeAttribute("data-processing");
    }
  };

  useEffect(() => {
    const fetchPolicyLinks = async () => {
      try {
        // Create a local copy of portalLanguageCode that we can modify within this function scope
        let apiLanguageCode = portalLanguageCode;

        // Force check one more time for Brazilian Portuguese
        // This ensures that even if we somehow missed it earlier, we'll catch it here
        const urlPath =
          typeof window !== "undefined" ? window.location.pathname : "";
        if (urlPath.includes("/br/")) {
          if (apiLanguageCode !== "pt") {
            apiLanguageCode = "pt";
          }
        }

        const response = await axios.get(`${API_URL}crm-register/policy-links`);
        const { privacy_policy, cookie_policy } = response.data;

        // First try to find policy in user's language
        let privacyLink = privacy_policy.find(
          (p) => p.language === apiLanguageCode
        )?.oss_url;

        let cookieLink = cookie_policy.find(
          (c) => c.language === apiLanguageCode
        )?.oss_url;

        // If not found, fallback to English
        if (!privacyLink) {
          privacyLink = privacy_policy.find(
            (p) => p.language === "en"
          )?.oss_url;
        }

        if (!cookieLink) {
          cookieLink = cookie_policy.find((c) => c.language === "en")?.oss_url;
        }

        setPolicyLinks({
          privacyPolicy: privacyLink || "",
          cookiePolicy: cookieLink || "",
        });
      } catch (error) {
        sendLog({ message: error.message, type: error.name });
      }
    };

    fetchPolicyLinks();
  }, [portalLanguageCode, API_URL]);

  const filteredCountries = useMemo(() => {
    if (!searchCountry) return countries;
    const searchTerm = searchCountry.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm)
    );
  }, [searchCountry]);

  const handleApiResponse = (isSuccessful, message = "", code = null) => {
    setIsSentSuccessful(isSuccessful);
    // If message is an object, try to extract the actual message
    let actualMessage = message;
    if (typeof message === "object") {
      actualMessage = message.message || JSON.stringify(message);
    }

    // Handle specific error messages without codes
    if (!code) {
      const lowerMessage = actualMessage.toLowerCase();

      // Check for various email validation error patterns
      if (lowerMessage.includes("email must be an email")) {
        setErrorMessage(t("popup-registration-error-email-format"));
        return;
      }
    }

    // Use code-based error mapping
    if (code && ERROR_CODE_MAP[code]) {
      setErrorMessage(t(ERROR_CODE_MAP[code]));
    } else {
      // If no code or no mapping for the code, use the message
      setErrorMessage(actualMessage);
    }

    // Log final error message being set
    console.log("Final error message:", errorMessage);
  };

  const handleRegistrationtForm = async (values) => {
    const token = await executeRecaptcha("popup_registration");

    // Create a local copy of portalLanguageCode that we can modify
    let submissionLanguage = portalLanguageCode;
    console.log("submissionLanguage", submissionLanguage);
    // CRITICAL FIX: Additional safety check to ensure language is valid
    // If language still contains "?" or is longer than 5 chars, it's probably invalid
    // if (
    //   submissionLanguage &&
    //   (submissionLanguage.includes("?") || submissionLanguage.length > 5)
    // ) {
    //   submissionLanguage = "en";
    // }

    // Check if we're in a Brazilian Portuguese URL path
    const urlPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (urlPath.includes("/br/") && submissionLanguage !== "pt") {
      submissionLanguage = "pt";
    }

    try {
      // Prepare submission data with referral parameters
      const submissionData = {
        ...values,
        token,
        language: submissionLanguage,
        redirect: "register",
        register_ip: clientIpAddress || clientConfig.ipAddress || "",
        agreement: true,
        privacy: policyLinks.privacyPolicy,
        cookie: policyLinks.cookiePolicy,
      };

      console.log("submissionData", submissionData);

      // Validate if policy links are available
      if (!policyLinks.privacyPolicy || !policyLinks.cookiePolicy) {
        // Still include them in submission but log the issue
        sendLog({
          message: "Registration submitted with missing policy links",
          type: "PolicyWarning",
          privacy: policyLinks.privacyPolicy,
          cookie: policyLinks.cookiePolicy,
        });
      }

      console.log("referral_type", referral_type);
      // Only add referral parameters if we have them
      if (referral_type) {
        submissionData.referral_type = referral_type;
      }

      console.log("referral_value", referral_value);
      if (referral_value) {
        submissionData.referral_value = referral_value;
      }
      console.log("submissionData", submissionData);
      const response = await axios.post(
        `${API_URL}crm-register`,
        submissionData
      );
      console.log("response", response.data);
      if (response.data.code && response.data.code !== 200) {
        handleApiResponse(false, response.data.message, response.data.code);
      } else {
        handleApiResponse(true);

        const redirectAddress = response.data.redirect_address;
        if (redirectAddress) {
          // Check if we're in an iframe
          if (window.parent !== window) {
            // ENHANCED: Send multiple message formats to ensure compatibility

            // 1. Standard object format with REDIRECT_TO_URL type
            window.parent.postMessage(
              {
                type: "REDIRECT_TO_URL",
                url: redirectAddress,
                success: true,
                timestamp: Date.now(),
              },
              "*"
            );

            // 2. Alternative object format with redirectUrl property
            window.parent.postMessage(
              {
                type: "REDIRECT_TO_URL",
                redirectUrl: redirectAddress,
                success: true,
                timestamp: Date.now(),
              },
              "*"
            );

            // 3. Registration success format
            window.parent.postMessage(
              {
                type: "REGISTRATION_SUCCESS",
                url: redirectAddress,
                redirectUrl: redirectAddress,
                success: true,
                timestamp: Date.now(),
              },
              "*"
            );

            // 4. Simple string format (for the global handler)
            window.parent.postMessage(`redirect:${redirectAddress}`, "*");

            // 5. Direct URL string (for simple string extraction)
            setTimeout(() => {
              window.parent.postMessage(redirectAddress, "*");
            }, 100);

            // ENHANCED: Try direct redirection approach for some browsers
            try {
              // Some browsers allow this in certain contexts
              if (window.top) {
                setTimeout(() => {
                  try {
                    window.top.location.href = redirectAddress;
                  } catch (err) {
                    // Could not set top location
                  }
                }, 300);
              }
            } catch (err) {
              // Could not access top window
            }

            // ENHANCED: As a final fallback, try to save to sessionStorage for use on page reload
            try {
              sessionStorage.setItem(
                "OQTIMA_PENDING_REDIRECT",
                redirectAddress
              );

              // Set a flag to indicate successful registration
              sessionStorage.setItem("OQTIMA_REGISTRATION_SUCCESS", "true");
              sessionStorage.setItem(
                "OQTIMA_REGISTRATION_TIMESTAMP",
                Date.now().toString()
              );
            } catch (err) {
              // Could not save to sessionStorage
            }
          } else {
            // If not in iframe, redirect normally
            window.location.href = redirectAddress;
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      const errorCode = error.response?.data?.code;
      sendLog({ message: error.message, type: error.name, code: errorCode });
      handleApiResponse(false, errorMessage, errorCode);
    }
  };

  // Special hook to extract language from URL path on component mount
  // This is needed for environments like dev.oqt-ima.com where URL parameters might not be properly passed
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname) {
      // Check if we're in a path like /br/popup-registration
      const pathParts = window.location.pathname.split("/").filter(Boolean);

      if (pathParts.length > 0) {
        const possibleLang = pathParts[0];
        // Check if it looks like a language code (typically 2-5 characters)
        if (possibleLang && possibleLang.length <= 5) {
          // CHANGE: Always set language from URL path regardless of other sources
          // This ensures the URL path language takes precedence over context language
          setLanguageFromUrl(possibleLang);
        }
      }
    }
  }, []);

  return (
    <RTLAwareForm isRTLMode={isRTLMode} language={effectiveLanguage}>
      <div className="popup-registration__form-container">
        <Formik
          key={`${isRTLMode ? "rtl" : "ltr"}-${effectiveLanguage}-form`}
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            country: clientConfig?.countryName || "",
            country_code: clientConfig?.countryCode
              ? countries.find(
                  (country) =>
                    country.name.toLowerCase() ===
                    clientConfig.countryName.toLowerCase()
                )?.code || ""
              : "",
            mobile: "",
            is_subscribe: 1,
            agreement: 0,
          }}
          validationSchema={PopupRegistrationSchema}
          onSubmit={handleRegistrationtForm}
          validateOnMount={true}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setTouched,
            isSubmitting,
          }) => {
            // Move the initialization effect here where setFieldValue is available
            useEffect(() => {
              if (clientConfig?.countryName) {
                const matchingCountry = countries.find(
                  (country) =>
                    country.name.toLowerCase() ===
                    clientConfig.countryName.toLowerCase()
                );
                if (matchingCountry) {
                  setSelectedCountry(matchingCountry.name);
                  setSelectedCountryCode(matchingCountry.code);
                  setFieldValue("country", matchingCountry.name, true);
                  setFieldValue("country_code", matchingCountry.code, true);
                }
              }
            }, [clientConfig, setFieldValue]);

            const handleCountrySelect = (countryName) => {
              setSelectedCountry(countryName);
              const matchingCountry = countries.find(
                (c) => c.name === countryName
              );
              if (matchingCountry?.code) {
                setSelectedCountryCode(matchingCountry.code);
                setFieldValue("country_code", matchingCountry.code, true);
              }
              setFieldValue("country", countryName, true);
              setIsCountryOpen(false);
              setSearchCountry("");
            };

            const handleCodeSelect = (code) => {
              setSelectedCountryCode(code);
              const matchingCountry = countries.find((c) => c.code === code);
              if (matchingCountry?.name) {
                setSelectedCountry(matchingCountry.name);
                setFieldValue("country", matchingCountry.name, true);
              }
              setFieldValue("country_code", code, true);
              setIsCodeOpen(false);
              setSearchCode("");
            };

            return (
              <form
                onSubmit={handleSubmit}
                className={cn("popup-registration__form", {
                  "popup-registration__form--rtl": isRTLMode,
                  "popup-registration__form--submitting": isSubmitting,
                  "popup-registration__form--success":
                    isSentSuccessful === true,
                  "popup-registration__form--error": isSentSuccessful === false,
                })}
                dir={isRTLMode ? "rtl" : "ltr"}
                style={{
                  textAlign: isRTLMode ? "right" : "left",
                  direction: isRTLMode ? "rtl" : "ltr",
                }}
                noValidate
              >
                {/* Name Fields */}
                <div className="name-fields" style={{ marginBottom: "20px" }}>
                  <div className="popup-registration__field">
                    <label className="popup-registration__label">
                      {t("popup-registration-firstName")} *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder={t("popup-registration-firstName") + " *"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name}
                      className={cn("popup-registration__input", {
                        "popup-registration__input--error":
                          errors.first_name && touched.first_name,
                      })}
                      noValidate
                    />
                    {errors.first_name && touched.first_name && (
                      <div className="popup-registration__error">
                        {t(errors.first_name)}
                      </div>
                    )}
                  </div>
                  <div className="popup-registration__field">
                    <label className="popup-registration__label">
                      {t("popup-registration-lastName")} *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder={t("popup-registration-lastName") + " *"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name}
                      className={cn("popup-registration__input", {
                        "popup-registration__input--error":
                          errors.last_name && touched.last_name,
                      })}
                      noValidate
                    />
                    {errors.last_name && touched.last_name && (
                      <div className="popup-registration__error">
                        {t(errors.last_name)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div
                  className="popup-registration__row"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="popup-registration__field">
                    <label className="popup-registration__label">
                      {t("popup-registration-email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder={t("popup-registration-email") + " *"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={cn("popup-registration__input", {
                        "popup-registration__input--error":
                          errors.email && touched.email,
                      })}
                      noValidate
                    />
                    {errors.email && touched.email && (
                      <div className="popup-registration__error">
                        {t(errors.email)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Country, Code, Phone Fields */}
                <div
                  className="popup-registration__row"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="three-fields-container">
                    {/* Country Field */}
                    <div className="popup-registration__field country-field">
                      <label className="popup-registration__label">
                        {t("popup-registration-countryOfResidence")} *
                      </label>
                      <div className="custom-dropdown">
                        <div
                          className={`custom-dropdown__selected ${
                            selectedCountry
                              ? "custom-dropdown__selected--has-value"
                              : ""
                          } ${
                            isCountryOpen
                              ? "custom-dropdown__selected--open"
                              : ""
                          }`}
                          onClick={() => setIsCountryOpen(!isCountryOpen)}
                        >
                          {selectedCountry || (
                            <span className="custom-dropdown__placeholder">
                              {t("popup-registration-countryOfResidence") +
                                " *"}
                            </span>
                          )}
                          <img
                            src={arrowDownIcon}
                            alt="dropdown"
                            className="custom-dropdown__arrow"
                          />
                        </div>
                        {isCountryOpen && (
                          <CountryDropdown
                            searchCountry={searchCountry}
                            setSearchCountry={setSearchCountry}
                            selectedCountry={selectedCountry}
                            handleCountrySelect={handleCountrySelect}
                            t={t}
                            countryOptionsRef={countryOptionsRef}
                            filteredCountries={filteredCountries}
                            setFieldValue={setFieldValue}
                            setIsCountryOpen={setIsCountryOpen}
                            errors={errors}
                            touched={touched}
                          />
                        )}
                      </div>
                      {errors.country && touched.country && (
                        <div className="popup-registration__error">
                          {t(errors.country)}
                        </div>
                      )}
                    </div>

                    {/* Mobile wrapper for Code and Phone */}
                    <div className="mobile-code-phone">
                      {/* Code Field */}
                      <div className="popup-registration__field code-field">
                        <label className="popup-registration__label">
                          {t("popup-registration-countryCode")} *
                        </label>
                        <div className="custom-dropdown">
                          <div
                            className={`custom-dropdown__selected ${
                              selectedCountryCode
                                ? "custom-dropdown__selected--has-value"
                                : ""
                            } ${
                              isCodeOpen
                                ? "custom-dropdown__selected--open"
                                : ""
                            }`}
                            onClick={() => setIsCodeOpen(!isCodeOpen)}
                          >
                            {selectedCountryCode || (
                              <span className="custom-dropdown__placeholder">
                                {t("popup-registration-countryCode") + " *"}
                              </span>
                            )}
                            <img
                              src={arrowDownIcon}
                              alt="dropdown"
                              className="custom-dropdown__arrow"
                            />
                          </div>
                          {isCodeOpen && (
                            <CodeDropdown
                              searchCode={searchCode}
                              setSearchCode={setSearchCode}
                              selectedCountryCode={selectedCountryCode}
                              handleCodeSelect={handleCodeSelect}
                              t={t}
                              codeOptionsRef={codeOptionsRef}
                              setIsCodeOpen={setIsCodeOpen}
                              errors={errors}
                              touched={touched}
                            />
                          )}
                        </div>
                        {errors.country_code && touched.country_code && (
                          <div className="popup-registration__error">
                            {t(errors.country_code)}
                          </div>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div className="popup-registration__field phone-field">
                        <label className="popup-registration__label">
                          {t("popup-registration-phoneNumber")} *
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder={
                            t("popup-registration-phoneNumber") + " *"
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.mobile}
                          className={cn("popup-registration__input", {
                            "popup-registration__input--error":
                              errors.mobile && touched.mobile,
                          })}
                          noValidate
                        />
                        {errors.mobile && touched.mobile && (
                          <div className="popup-registration__error">
                            {t(errors.mobile)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Newsletter Subscription */}
                <div
                  className="popup-registration__newsletter"
                  style={{ marginBottom: "20px" }}
                >
                  <input
                    type="checkbox"
                    name="is_subscribe"
                    checked={values.is_subscribe}
                    onChange={(e) =>
                      setFieldValue("is_subscribe", e.target.checked ? 1 : 0)
                    }
                  />
                  {t("popup-registration-acceptMarketing")}
                </div>

                {/* Consent */}
                <div
                  className="popup-registration__consent"
                  style={{ marginBottom: "20px" }}
                >
                  <span className="popup-registration__consent-text">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={values.agreement}
                      onChange={(e) =>
                        setFieldValue("agreement", e.target.checked ? 1 : 0)
                      }
                    />
                    <span>
                      <Trans i18nKey="popup-registration-consent" ns="index">
                        I agree to allow the company to process my personal data
                        to meet its regulatory obligations and I have read and
                        understood the
                        <a
                          href={policyLinks.privacyPolicy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                          onClick={(e) =>
                            handlePolicyLinkClick(e, policyLinks.privacyPolicy)
                          }
                        >
                          Privacy Policy
                        </a>
                        and
                        <a
                          href={policyLinks.cookiePolicy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link"
                          onClick={(e) =>
                            handlePolicyLinkClick(e, policyLinks.cookiePolicy)
                          }
                        >
                          Cookie Policy
                        </a>
                        of the Company.
                      </Trans>
                    </span>
                  </span>
                  {errors.agreement && touched.agreement && (
                    <div
                      className={cn(
                        "popup-registration__error",
                        "popup-registration__error--agreement"
                      )}
                    >
                      {t("popup-registration-agreement-required")}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={cn("continue-button", {
                    "button-link--disabled": isSubmitting,
                  })}
                  style={{ marginTop: "auto", marginBottom: "20px" }}
                  onClick={async (e) => {
                    e.preventDefault();
                    // Touch all fields to show validation errors
                    await setTouched(
                      {
                        first_name: true,
                        last_name: true,
                        email: true,
                        country: true,
                        country_code: true,
                        mobile: true,
                        agreement: true,
                        is_subscribe: true,
                      },
                      true
                    );

                    // Validate all fields
                    Object.keys(values).forEach((field) => {
                      setFieldValue(field, values[field], true);
                    });

                    // If form is valid, submit it
                    if (Object.keys(errors).length === 0) {
                      handleSubmit();
                    }
                  }}
                >
                  {t("popup-registration-continue")}
                </button>

                {/* Error Message */}
                {errorMessage && (
                  <p
                    className="popup-registration-error-message"
                    style={{ color: "red", marginBottom: "20px" }}
                  >
                    {errorMessage}
                  </p>
                )}
              </form>
            );
          }}
        </Formik>
      </div>
    </RTLAwareForm>
  );
};

export default PopupRegistrationForm;
