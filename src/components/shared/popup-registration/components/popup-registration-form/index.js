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
import { cleanRTLAttributes } from "../../index";

// RTL languages - Arabic
const RTL_LANGUAGES = ["ar"];

// Helper function to check if a language is RTL
const isRTLLanguage = (lang) => {
  if (!lang) return false;

  const normalizedLang = lang.toLowerCase().trim();

  // Direct match with RTL_LANGUAGES array
  if (RTL_LANGUAGES.includes(normalizedLang)) {
    return true;
  }

  // Check for "ar" prefix (like ar-XX variants)
  if (
    normalizedLang.startsWith("ar") &&
    (normalizedLang.length === 2 ||
      normalizedLang[2] === "-" ||
      normalizedLang[2] === "_")
  ) {
    return true;
  }

  // Full word match with "arabic"
  if (normalizedLang === "arabic") {
    return true;
  }

  return false;
};

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
  const { selectedLanguage, setCurrentLanguage } = useContext(LanguageContext);

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
          // document.documentElement.setAttribute("dir", "ltr");
          // document.body.setAttribute("dir", "ltr");
          // document.documentElement.setAttribute("lang", "en");

          // Remove RTL classes
          // document.documentElement.classList.remove(
          //   "rtl-active",
          //   "rtl",
          //   "is-rtl"
          // );
          // document.body.classList.remove("rtl-active", "rtl", "is-rtl");

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
            // document.documentElement.setAttribute("dir", "ltr");
            // document.body.setAttribute("dir", "ltr");
            // document.documentElement.setAttribute("lang", specificLanguage);

            // Remove RTL classes
            // document.documentElement.classList.remove(
            //   "rtl-active",
            //   "rtl",
            //   "is-rtl"
            // );
            // document.body.classList.remove("rtl-active", "rtl", "is-rtl");

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
      console.log("Raw params:", params);

      // Try to parse JSON if params is a string
      if (typeof params === "string") {
        try {
          // Try standard JSON parsing first
          parsedParams = JSON.parse(params);
          console.log("Successfully parsed params as JSON:", parsedParams);
        } catch (jsonErr) {
          console.warn("JSON parsing failed:", jsonErr.message);

          // Check if the string might contain referral parameters in a non-standard format
          if (
            params.includes("referral_type") ||
            params.includes("referral_value")
          ) {
            console.log(
              "Found referral params in string, attempting alternate parsing"
            );

            // Try to extract referral parameters using regex
            const referralTypeMatch = params.match(
              /referral_type["|']?\s*:\s*(?:"|')?([^"',}]*)(?:"|')?/i
            );
            const referralValueMatch = params.match(
              /referral_value["|']?\s*:\s*(?:"|')?([^"',}]*)(?:"|')?/i
            );

            if (referralTypeMatch && referralTypeMatch[1]) {
              parsedParams.referral_type = referralTypeMatch[1].trim();
              console.log(
                "Extracted referral_type:",
                parsedParams.referral_type
              );
            }

            if (referralValueMatch && referralValueMatch[1]) {
              parsedParams.referral_value = referralValueMatch[1].trim();
              console.log(
                "Extracted referral_value:",
                parsedParams.referral_value
              );
            }
          }

          // If the string is simple (like a language code), parse it as a language
          else if (params && params.length <= 7) {
            // Most language codes are 2-7 chars
            parsedParams = { langParam: params };
          }
        }
      } else if (params && typeof params === "object") {
        // Handle case where params is already an object
        parsedParams = { ...params };
        console.log("Params is already an object:", parsedParams);
      }

      // Ensure referral parameters exist and are properly formatted
      if (parsedParams.referral_type) {
        // Make sure it's not a string "null" or "undefined"
        if (
          parsedParams.referral_type === "null" ||
          parsedParams.referral_type === "undefined"
        ) {
          parsedParams.referral_type = null;
        }
        // Convert string numbers to actual numbers
        else if (!isNaN(parsedParams.referral_type)) {
          parsedParams.referral_type = Number(parsedParams.referral_type);
        }
      }

      if (parsedParams.referral_value) {
        // Make sure it's not a string "null" or "undefined"
        if (
          parsedParams.referral_value === "null" ||
          parsedParams.referral_value === "undefined"
        ) {
          parsedParams.referral_value = null;
        }
      }

      // Store referral parameters in sessionStorage for persistence
      if (typeof window !== "undefined") {
        if (parsedParams.referral_type) {
          try {
            sessionStorage.setItem(
              "oqtima_referral_type",
              parsedParams.referral_type
            );
          } catch (e) {
            /* ignore storage errors */
          }
        }

        if (parsedParams.referral_value) {
          try {
            sessionStorage.setItem(
              "oqtima_referral_value",
              parsedParams.referral_value
            );
          } catch (e) {
            /* ignore storage errors */
          }
        }
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

        // Check for referral parameters in URL - these take precedence
        const urlReferralType =
          urlParams.get("referral_type") ||
          urlParams.get("referralType") ||
          urlParams.get("referral-type");

        const urlReferralValue =
          urlParams.get("referral_value") ||
          urlParams.get("referralValue") ||
          urlParams.get("referral-value");

        if (urlReferralType) {
          parsedParams.referral_type = !isNaN(urlReferralType)
            ? Number(urlReferralType)
            : urlReferralType;
          console.log(
            "Using referral_type from URL params:",
            parsedParams.referral_type
          );
        }

        if (urlReferralValue) {
          parsedParams.referral_value = urlReferralValue;
          console.log(
            "Using referral_value from URL params:",
            parsedParams.referral_value
          );
        }

        // NEW: If URL parameters are empty, try to extract language from the iframe's src attribute
        // This is needed because some environments (like dev.oqt-ima.com) may not properly pass URL parameters
        if (!parsedParams.langParam && window.location.pathname) {
          // Check if we're in a language-specific path like /br/popup-registration
          const pathParts = window.location.pathname.split("/").filter(Boolean);
          if (pathParts.length > 0) {
            const possibleLang = pathParts[0];
            // Check if the first part of the path is a language code (typically 2-7 chars)
            if (possibleLang && possibleLang.length <= 7) {
              parsedParams.langParam = possibleLang;
            }
          }
        }
      }

      // Log the final parsed parameters
      console.log("Final parsed parameters:", parsedParams);
      return parsedParams;
    } catch (e) {
      console.error("Error parsing parameters:", e);
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
    if (typeof window === "undefined") return;

    console.log("PopupRegistrationForm: Checking language settings");

    // Function to extract and set language from URL path
    const setLanguageFromUrlPath = () => {
      try {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        if (pathParts.length > 0) {
          const urlLanguage = pathParts[0];
          if (urlLanguage && urlLanguage.length <= 7) {
            // Most language codes are 2-7 chars
            console.log("Detected language from URL path:", urlLanguage);

            // Store in sessionStorage
            sessionStorage.setItem("oqtima_tab_language", urlLanguage);

            // Set global variables
            window.__OQTIMA_TAB_LANGUAGE__ = urlLanguage;
            window.__OQTIMA_LOCKED_LANG__ = urlLanguage;
            window.__OQTIMA_COMPONENT_LANGUAGE__ = urlLanguage;
            window.__FORCE_LANGUAGE__ = true;

            // Set on document element
            document.documentElement.setAttribute("lang", urlLanguage);

            // Update localStorage
            try {
              localStorage.setItem("i18nextLng", urlLanguage);
            } catch (e) {}

            // Check if language is non-Arabic and clean RTL attributes if needed
            if (urlLanguage.toLowerCase() !== "ar") {
              console.log(
                "Non-Arabic language detected, cleaning RTL attributes"
              );

              // Import and call the cleanRTLAttributes function
              try {
                if (window.cleanRTLAttributes) {
                  window.cleanRTLAttributes();
                } else if (typeof cleanRTLAttributes === "function") {
                  cleanRTLAttributes();
                } else {
                  // Fallback inline implementation to clean RTL attributes
                  document.documentElement.classList.remove(
                    "rtl-active",
                    "rtl",
                    "is-rtl"
                  );
                  // document.documentElement.setAttribute("dir", "ltr");
                  document.documentElement.removeAttribute("data-rtl");

                  // document.body.classList.remove("rtl-active", "rtl", "is-rtl");
                  // document.body.setAttribute("dir", "ltr");
                  // document.body.removeAttribute("data-rtl");
                  // document.body.style.direction = "ltr";

                  // Force UI update by triggering a reflow
                  const reflow = document.body.offsetHeight;

                  console.log("RTL attributes cleaned inline");
                }
              } catch (e) {
                console.error("Error cleaning RTL attributes:", e);
              }
            }

            console.log(
              "Language from URL path successfully set to:",
              urlLanguage
            );
            return urlLanguage;
          }
        }
        return null;
      } catch (e) {
        console.error("Error extracting language from URL path:", e);
        return null;
      }
    };

    // Determine language from various sources in priority order
    const getLanguage = () => {
      // 1. First check URL path (highest priority)
      const urlPathLanguage = setLanguageFromUrlPath();
      if (urlPathLanguage) return urlPathLanguage;

      // 2. Then check sessionStorage
      const sessionLanguage = sessionStorage.getItem("oqtima_tab_language");
      if (sessionLanguage) {
        console.log("Using language from sessionStorage:", sessionLanguage);
        return sessionLanguage;
      }

      // 3. Check global variables
      if (window.__OQTIMA_TAB_LANGUAGE__) {
        console.log(
          "Using language from global variable:",
          window.__OQTIMA_TAB_LANGUAGE__
        );
        return window.__OQTIMA_TAB_LANGUAGE__;
      }

      // 4. Check passed parameters
      if (safeParams.langParam) {
        console.log(
          "Using language from component props:",
          safeParams.langParam
        );
        return safeParams.langParam;
      }

      // 5. Fallback to default
      console.log("No language detected, using default: en");
      return "en";
    };

    // Get and set the language
    const detectedLanguage = getLanguage();

    // Explicitly set the language on document element and in storage
    if (detectedLanguage) {
      document.documentElement.setAttribute("lang", detectedLanguage);
      sessionStorage.setItem("oqtima_tab_language", detectedLanguage);
      window.__OQTIMA_TAB_LANGUAGE__ = detectedLanguage;

      try {
        localStorage.setItem("i18nextLng", detectedLanguage);
      } catch (e) {}

      // If language is not Arabic, ensure RTL attributes are removed
      if (detectedLanguage.toLowerCase() !== "ar") {
        console.log("Non-Arabic language detected, cleaning RTL attributes");

        try {
          // Try multiple ways to access the cleanRTLAttributes function
          if (window.cleanRTLAttributes) {
            window.cleanRTLAttributes();
          } else if (typeof cleanRTLAttributes === "function") {
            cleanRTLAttributes();
          } else {
            // Fallback inline implementation
            document.documentElement.classList.remove(
              "rtl-active",
              "rtl",
              "is-rtl"
            );
            // document.documentElement.setAttribute("dir", "ltr");
            document.documentElement.removeAttribute("data-rtl");

            // document.body.classList.remove("rtl-active", "rtl", "is-rtl");
            // document.body.setAttribute("dir", "ltr");
            // document.body.removeAttribute("data-rtl");
            // document.body.style.direction = "ltr";

            // Remove RTL from HTML tag
            // const html = document.getElementsByTagName("html")[0];
            // if (html) {
            //   html.classList.remove("rtl-active", "rtl", "is-rtl");
            //   html.setAttribute("dir", "ltr");
            //   html.removeAttribute("data-rtl");
            //   // html.style.direction = "ltr";
            // }
          }
        } catch (e) {
          console.error("Error cleaning RTL attributes:", e);
        }

        // Also set RTL flag to false explicitly in sessionStorage
        sessionStorage.setItem("oqtima_tab_rtl", "false");

        // Update global RTL flags
        window.__FORCE_RTL__ = false;
        window.__ORIGINAL_RTL__ = false;
      }

      console.log("Language set throughout application:", detectedLanguage);
    }
  }, [safeParams]);

  // Update state values when params change
  useEffect(() => {
    console.log("safeParams updated:", safeParams);

    // Handle referral_type - could be number or string
    if (
      safeParams.referral_type !== undefined &&
      safeParams.referral_type !== null
    ) {
      // Convert string to number if it's numeric
      const typeValue = !isNaN(safeParams.referral_type)
        ? Number(safeParams.referral_type)
        : safeParams.referral_type;

      console.log("Setting referral_type state to:", typeValue);
      setReferralType(typeValue);

      // Also store in session storage for persistence
      try {
        sessionStorage.setItem("oqtima_referral_type", typeValue);
        // Also set as a global variable as a fallback
        window.__OQTIMA_REFERRAL_TYPE__ = typeValue;
      } catch (e) {
        /* ignore storage errors */
      }
    }

    // Handle referral_value
    if (
      safeParams.referral_value !== undefined &&
      safeParams.referral_value !== null
    ) {
      console.log(
        "Setting referral_value state to:",
        safeParams.referral_value
      );
      setReferralValue(safeParams.referral_value);

      // Also store in session storage for persistence
      try {
        sessionStorage.setItem(
          "oqtima_referral_value",
          safeParams.referral_value
        );
        // Also set as a global variable as a fallback
        window.__OQTIMA_REFERRAL_VALUE__ = safeParams.referral_value;
      } catch (e) {
        /* ignore storage errors */
      }
    }

    // Update language from safeParams if available
    if (safeParams.langParam) {
      // Highest priority is langParam from safeParams
      setLanguageFromUrl(null); // Reset language from URL
      setLanguageFromMessage(null); // Reset language from message

      // We'll set languageFromUrl based on safeParams.langParam
      // This ensures our language priority logic works correctly
      setLanguageFromUrl(safeParams.langParam);
    }

    // Debug log for referral parameters
    console.log("Current referral state values:");
    console.log("- referral_type:", referral_type);
    console.log("- referral_value:", referral_value);
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
        console.log("Extracting URL parameters...");
        const urlParams = new URLSearchParams(window.location.search);

        // Create a collection of all parameters for debugging
        const allParams = {};
        urlParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log("All URL parameters:", allParams);

        // Check all possible parameter formats for referral
        const urlReferralType =
          urlParams.get("referral_type") ||
          urlParams.get("referralType") ||
          urlParams.get("referral-type");

        const urlReferralValue =
          urlParams.get("referral_value") ||
          urlParams.get("referralValue") ||
          urlParams.get("referral-value");

        console.log("URL referral_type:", urlReferralType);
        console.log("URL referral_value:", urlReferralValue);

        // Immediately set found referral parameters to state and sessionStorage
        if (urlReferralType) {
          // Convert to number if it's numeric
          const numericType = !isNaN(urlReferralType)
            ? Number(urlReferralType)
            : urlReferralType;
          console.log(
            "Setting referral_type state from URL parameter:",
            numericType
          );
          setReferralType(numericType);

          // Also persistently store in sessionStorage
          try {
            sessionStorage.setItem("oqtima_referral_type", numericType);
            window.__OQTIMA_REFERRAL_TYPE__ = numericType;
            console.log("Stored referral_type in sessionStorage:", numericType);
          } catch (storageErr) {
            console.error(
              "Failed to store referral_type in sessionStorage:",
              storageErr
            );
          }
        }

        if (urlReferralValue) {
          console.log(
            "Setting referral_value state from URL parameter:",
            urlReferralValue
          );
          setReferralValue(urlReferralValue);

          // Also persistently store in sessionStorage
          try {
            sessionStorage.setItem("oqtima_referral_value", urlReferralValue);
            window.__OQTIMA_REFERRAL_VALUE__ = urlReferralValue;
            console.log(
              "Stored referral_value in sessionStorage:",
              urlReferralValue
            );
          } catch (storageErr) {
            console.error(
              "Failed to store referral_value in sessionStorage:",
              storageErr
            );
          }
        }

        // If not found in URL, try sessionStorage (for popup mode)
        if (!urlReferralType && typeof window !== "undefined") {
          const storedReferralType = sessionStorage.getItem(
            "oqtima_referral_type"
          );
          if (storedReferralType) {
            console.log(
              "Found referral_type in sessionStorage:",
              storedReferralType
            );

            // Convert to number if it's numeric
            const numericType = !isNaN(storedReferralType)
              ? Number(storedReferralType)
              : storedReferralType;
            setReferralType(numericType);
          }
        }

        if (!urlReferralValue && typeof window !== "undefined") {
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

        // Check global window variables as a fallback
        if (
          !urlReferralType &&
          !referral_type &&
          typeof window !== "undefined"
        ) {
          if (window.__OQTIMA_REFERRAL_TYPE__ !== undefined) {
            console.log(
              "Found referral_type in window globals:",
              window.__OQTIMA_REFERRAL_TYPE__
            );

            // Convert to number if it's numeric
            const numericType = !isNaN(window.__OQTIMA_REFERRAL_TYPE__)
              ? Number(window.__OQTIMA_REFERRAL_TYPE__)
              : window.__OQTIMA_REFERRAL_TYPE__;

            setReferralType(numericType);

            // Also update sessionStorage for consistency
            try {
              sessionStorage.setItem("oqtima_referral_type", numericType);
            } catch (e) {
              /* ignore storage errors */
            }
          }
        }

        if (
          !urlReferralValue &&
          !referral_value &&
          typeof window !== "undefined"
        ) {
          if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
            console.log(
              "Found referral_value in window globals:",
              window.__OQTIMA_REFERRAL_VALUE__
            );
            setReferralValue(window.__OQTIMA_REFERRAL_VALUE__);

            // Also update sessionStorage for consistency
            try {
              sessionStorage.setItem(
                "oqtima_referral_value",
                window.__OQTIMA_REFERRAL_VALUE__
              );
            } catch (e) {
              /* ignore storage errors */
            }
          }
        }

        // Set language from URL if available
        let detectedLanguage = null;

        // Try all possible language parameter names
        const languageParams = ["language", "lang", "locale", "i18nextLng"];
        for (const param of languageParams) {
          const value = urlParams.get(param);
          if (value) {
            detectedLanguage = value;
            console.log(`Detected language from URL param ${param}:`, value);
            break;
          }
        }

        // Check data-lang parameter specifically (highest priority for Brazilian Portuguese)
        const dataLang = urlParams.get("data-lang");
        if (dataLang) {
          detectedLanguage = dataLang;
          console.log("Detected language from data-lang param:", dataLang);
        }

        // NEW: If URL parameters don't contain language, try to extract from pathname
        if (!detectedLanguage && window.location.pathname) {
          const pathParts = window.location.pathname.split("/").filter(Boolean);
          if (pathParts.length > 0) {
            const possibleLang = pathParts[0];
            // Check if first path segment looks like a language code
            if (possibleLang && possibleLang.length <= 7) {
              detectedLanguage = possibleLang;
              console.log("Detected language from URL path:", possibleLang);
            }
          }
        }

        // Check if language is part of the URL fragment/hash
        if (!detectedLanguage && window.location.hash) {
          const hashMatch = window.location.hash.match(
            /(#|&)(language|lang)=([^&]+)/i
          );
          if (hashMatch && hashMatch[3]) {
            detectedLanguage = hashMatch[3];
            console.log("Detected language from URL hash:", hashMatch[3]);
          }
        }

        // Set the language if detected from any source
        if (detectedLanguage) {
          // Clean up the language code to ensure proper formatting
          const cleanLang = sanitizeLanguageCode(detectedLanguage);
          console.log("Setting language from URL:", cleanLang);

          // Special handling for Arabic
          if (isRTLLanguage(cleanLang)) {
            console.log(
              "Arabic language detected from URL parameter, enabling RTL"
            );

            // Set RTL flags in session storage and globals
            try {
              sessionStorage.setItem("oqtima_tab_rtl", "true");
              sessionStorage.setItem("isRTL", "true");
              window.__FORCE_RTL__ = true;
              window.__ORIGINAL_RTL__ = true;
            } catch (e) {
              console.warn("Error storing RTL flags:", e);
            }
          }

          setLanguageFromUrl(cleanLang);
        }

        // Log current referral parameter state
        console.log("Current referral parameter state after URL extraction:");
        console.log("- referral_type:", referral_type);
        console.log("- referral_value:", referral_value);

        // Log sessionStorage state for verification
        try {
          console.log("SessionStorage state for referral parameters:");
          console.log(
            "- oqtima_referral_type:",
            sessionStorage.getItem("oqtima_referral_type")
          );
          console.log(
            "- oqtima_referral_value:",
            sessionStorage.getItem("oqtima_referral_value")
          );
        } catch (e) {
          console.error("Error reading sessionStorage:", e);
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
    // If code contains "?", it's likely malformed or contains query parameters
    if (code && code.includes("?")) {
      console.log("Sanitizing language code with query parameters:", code);

      // Check if code itself is a query parameter (e.g., "?language=ar")
      if (code.startsWith("?")) {
        // Try to extract the language part
        const match = code.match(/[?&](language|lang|locale)=([^&]+)/i);
        if (match && match[2]) {
          console.log("Extracted language from query parameter:", match[2]);
          return match[2];
        }
      }

      // If the code has format like "ar?param=value"
      const parts = code.split("?");
      if (parts.length > 1 && parts[0].length <= 5) {
        console.log("Extracted language from before query string:", parts[0]);
        return parts[0];
      }

      // Try again with more permissive regex to find language value
      const fullMatch = code.match(/(?:^|[?&])(language|lang|locale)=([^&]+)/i);
      if (fullMatch && fullMatch[2]) {
        console.log("Extracted language with permissive regex:", fullMatch[2]);
        return fullMatch[2];
      }

      // Default to English if we can't extract
      console.log(
        "Could not extract language from query string, defaulting to 'en'"
      );
      return "en";
    }

    // If code is longer than 5 chars and not a common format like "zh-CN"
    if (code && code.length > 5 && !code.match(/^[a-z]{2}-[A-Z]{2}$/)) {
      // Special handling for Arabic - don't convert "arabic" to "en"
      if (code.toLowerCase() === "arabic") {
        return "ar";
      }

      // Try to extract a valid language code if it starts with a 2-letter code
      const potentialCode = code.substring(0, 2).toLowerCase();
      if (
        potentialCode === "ar" ||
        potentialCode === "en" ||
        potentialCode === "fr" ||
        potentialCode === "es" ||
        potentialCode === "pt" ||
        potentialCode === "zh" ||
        potentialCode === "br" ||
        potentialCode === "th" ||
        potentialCode === "vn" ||
        potentialCode === "it" ||
        potentialCode === "jp" ||
        potentialCode === "id" ||
        potentialCode === "my" ||
        potentialCode === "cn"
      ) {
        return potentialCode;
      }

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
      if (pathLang && pathLang.length <= 7) {
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
  const forcedRTL = isRTLLanguage(effectiveLanguage);
  const isRTLMode = isRTL || forcedRTL;

  // First parse and extract the language parameters
  useEffect(() => {
    if (typeof window === "undefined") return;

    // First parse and extract the language parameters
    // Check for language explicitly set in params (FIRST PRIORITY)
    let langParam, dataLang, urlLanguage, browserLanguage, nativeLanguage;

    try {
      if (params) {
        const parsedParams =
          typeof params === "string" ? JSON.parse(params) : params;
        langParam = parsedParams.langParam;
        dataLang = parsedParams.dataLang;
        urlLanguage = parsedParams.language;
        browserLanguage = parsedParams.browserLanguage;
        nativeLanguage = parsedParams.nativeLanguage;
      }
    } catch (e) {
      console.warn("Error parsing params:", e);
    }

    // Log initial params for debugging
    console.log("Registration form detected language parameters:", {
      langParam,
      dataLang,
      urlLanguage,
      browserLanguage,
      nativeLanguage,
    });

    // Create final specific language variable with proper prioritization
    const specificLanguage = langParam || urlLanguage || dataLang;

    if (specificLanguage) {
      console.log(`Using specific language: ${specificLanguage}`);

      // ADDED: Clean RTL attributes for non-Arabic languages
      // Sanitize the specific language code first
      const sanitizedLang = sanitizeLanguageCode(specificLanguage);
      console.log(`Sanitized language code: ${sanitizedLang}`);

      // Check if the sanitized language is Arabic
      const isArabic = isRTLLanguage(sanitizedLang);

      if (!isArabic) {
        console.log(
          `Non-Arabic language detected (${sanitizedLang}), cleaning RTL attributes`
        );
        cleanRTLAttributes();
      } else {
        console.log(
          `Arabic language detected (${sanitizedLang}), preserving RTL attributes`
        );
      }

      // For RTL languages, update the language context
      if (setCurrentLanguage && typeof setCurrentLanguage === "function") {
        try {
          // Create proper language object expected by the context
          const isRtlLang = isRTLLanguage(sanitizedLang);
          const langObject = {
            id: sanitizedLang,
            title: sanitizedLang.toUpperCase(),
            URIPart: `/${sanitizedLang}/`,
            isRTL: isRtlLang,
          };
          setCurrentLanguage(langObject);
        } catch (e) {
          console.warn("Error updating language context:", e);
        }
      }

      // Make i18next aware of our language
      try {
        // Never call i18n.changeLanguage directly here - it could cause infinite loops
        // The LanguageContext will handle it
        if (
          window.i18next &&
          window.i18next.language !== specificLanguage.toLowerCase()
        ) {
          console.log(
            `Form detected language mismatch: i18next=${window.i18next.language}, form=${specificLanguage}`
          );
        }
      } catch (e) {
        console.warn("Error checking i18next language:", e);
      }
    }
  }, [params]);

  // Simplified RTL handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only run once to add minimal listener for language changes
    const simpleLanguageHandler = () => {
      const langAttr = document.documentElement.getAttribute("lang") || "";
      const cleanLang = langAttr.replace(/[?&].*$/, "").toLowerCase();

      // Just update the form's RTL state based on language
      if (isRTLLanguage(cleanLang)) {
        console.log("Form detected Arabic language, ensuring form RTL mode");

        // Add mobile-specific styling for RTL in the registration form
        if (!document.getElementById("rtl-form-mobile-styles")) {
          const mobileStyleEl = document.createElement("style");
          mobileStyleEl.id = "rtl-form-mobile-styles";
          mobileStyleEl.textContent = `
            /* Mobile RTL Form Fixes */
            @media (max-width: 767px) {
              /* General layout direction */
              [dir="rtl"] .registration-form,
              [dir="rtl"] .popup-registration__content {
                text-align: right !important;
                direction: rtl !important;
              }
              
              /* Input alignment */
              [dir="rtl"] .registration-form input,
              [dir="rtl"] .registration-form select,
              [dir="rtl"] .registration-form textarea {
                text-align: right !important;
                direction: rtl !important;
                padding-right: 12px !important;
                padding-left: 8px !important;
              }
              
              /* Label alignment */
              [dir="rtl"] .registration-form label {
                text-align: right !important;
                float: right !important;
              }
              
              /* Checkbox alignment */
              [dir="rtl"] .registration-form input[type="checkbox"] {
                right: 0 !important;
                left: auto !important;
                margin-right: 0 !important;
                margin-left: 8px !important;
              }
              
              /* Ensure checkbox labels are properly aligned */
              [dir="rtl"] .registration-form .form-checkbox label {
                padding-right: 25px !important;
                padding-left: 0 !important;
              }
              
              /* Button text alignment */
              [dir="rtl"] .registration-form button {
                text-align: center !important;
              }
            }
          `;
          document.head.appendChild(mobileStyleEl);
        }

        // Only set direction for the form elements we control
        document
          .querySelectorAll(
            ".registration-form, .registration-form__field, .registration-form__button, .form-group, .form-field, input, select, textarea"
          )
          .forEach((el) => {
            el.setAttribute("dir", "rtl");
            el.classList.add("rtl-mode");
          });
      } else {
        // Clean up RTL-specific styles if exists
        const rtlFormMobileStyles = document.getElementById(
          "rtl-form-mobile-styles"
        );
        if (rtlFormMobileStyles) rtlFormMobileStyles.remove();
      }
    };

    // Run once on initial render
    simpleLanguageHandler();

    // Add minimal listener with debounce
    let debounceTimer = null;
    const handleLanguageChange = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(simpleLanguageHandler, 50);
    };

    // Listen for custom events from parent components instead of using MutationObserver
    window.addEventListener("language-changed", handleLanguageChange);

    return () => {
      window.removeEventListener("language-changed", handleLanguageChange);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

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
        // Success
        console.log(`Successfully opened policy link: ${url}`);
        setTimeout(() => {
          target.removeAttribute("data-processing");
        }, 1000);
      } else {
        // Window.open was blocked
        console.warn(`window.open was blocked for ${url}`);

        // Log the blocked attempt
        console.log(`Policy link was blocked by the browser: ${url}`);

        // Reset processing state after delay
        setTimeout(() => {
          target.removeAttribute("data-processing");
        }, 1000);

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

      // Reset the processing state
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

  // Function to extract referral parameters from URL parameters, parent iframe attributes, or window.name transport
  useEffect(() => {
    const extractReferralParameters = () => {
      try {
        const referralParams = { type: null, value: null };
        const sources = [];

        // 1. Check URL parameters
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);

          // Try multiple parameter formats
          const urlReferralType =
            urlParams.get("referral_type") ||
            urlParams.get("referralType") ||
            urlParams.get("referral-type");

          const urlReferralValue =
            urlParams.get("referral_value") ||
            urlParams.get("referralValue") ||
            urlParams.get("referral-value");

          if (urlReferralType) {
            referralParams.type = urlReferralType;
            sources.push("URL parameters");
          }

          if (urlReferralValue) {
            referralParams.value = urlReferralValue;
            sources.push("URL parameters");
          }
        }

        // 2. Try to access parent iframe attributes (in case we're in an iframe)
        if (typeof window !== "undefined" && window !== window.parent) {
          try {
            // Request data from parent via postMessage
            window.parent.postMessage({ type: "REQUEST_REFERRAL_PARAMS" }, "*");

            // Create temporary global handlers to receive this data
            window.__TEMP_RECEIVE_REFERRAL_DATA = (data) => {
              if (data && data.referral_type && !referralParams.type) {
                // Check if this is a specific referral type registration (IB Referral or Campaign)
                let parsedType = data.referral_type;
                if (typeof parsedType === "string" && !isNaN(parsedType)) {
                  parsedType = Number(parsedType);
                }

                const isSpecificReferralType =
                  parsedType === 12 || // IB Referral Link
                  parsedType === 14; // Campaign Link

                if (isSpecificReferralType) {
                  referralParams.type = parsedType;
                  sources.push("parent window message");

                  // Store in our state and sessionStorage
                  setReferralType(parsedType);
                  try {
                    sessionStorage.setItem("oqtima_referral_type", parsedType);
                    window.__OQTIMA_REFERRAL_TYPE__ = parsedType;
                  } catch (e) {}

                  // Only set referral_value if we have a valid referral_type
                  if (data.referral_value && !referralParams.value) {
                    referralParams.value = data.referral_value;
                    sources.push("parent window message");

                    setReferralValue(data.referral_value);
                    try {
                      sessionStorage.setItem(
                        "oqtima_referral_value",
                        data.referral_value
                      );
                      window.__OQTIMA_REFERRAL_VALUE__ = data.referral_value;
                    } catch (e) {}
                  }
                } else {
                  // For Normal Registration, clear referral parameters
                  console.log(
                    "Normal Registration - not using referral parameters from parent iframe"
                  );

                  // Clear our local params
                  referralParams.type = null;
                  referralParams.value = null;

                  // Clear state and storage
                  setReferralType(null);
                  setReferralValue(null);
                  try {
                    sessionStorage.removeItem("oqtima_referral_type");
                    sessionStorage.removeItem("oqtima_referral_value");
                    window.__OQTIMA_REFERRAL_TYPE__ = null;
                    window.__OQTIMA_REFERRAL_VALUE__ = null;
                  } catch (e) {}
                }
              }

              if (data && data.referral_value && !referralParams.value) {
                referralParams.value = data.referral_value;
                sources.push("parent window message");
              }

              // Store in our state and sessionStorage
              if (data && data.referral_type) {
                setReferralType(data.referral_type);
                try {
                  sessionStorage.setItem(
                    "oqtima_referral_type",
                    data.referral_type
                  );
                  window.__OQTIMA_REFERRAL_TYPE__ = data.referral_type;
                } catch (e) {}
              }

              if (data && data.referral_value) {
                setReferralValue(data.referral_value);
                try {
                  sessionStorage.setItem(
                    "oqtima_referral_value",
                    data.referral_value
                  );
                  window.__OQTIMA_REFERRAL_VALUE__ = data.referral_value;
                } catch (e) {}
              }
            };
          } catch (e) {
            console.warn("Could not access parent iframe:", e);
          }
        }

        // 3. Check for parameters in window.name (transport hack)
        if (typeof window !== "undefined" && window.name) {
          try {
            // Check if window.name contains JSON data
            if (window.name.startsWith("{") && window.name.endsWith("}")) {
              const nameData = JSON.parse(window.name);

              if (nameData.oqtima_referral_type && !referralParams.type) {
                referralParams.type = nameData.oqtima_referral_type;
                sources.push("window.name transport");
              }

              if (nameData.oqtima_referral_value && !referralParams.value) {
                referralParams.value = nameData.oqtima_referral_value;
                sources.push("window.name transport");
              }
            }
          } catch (e) {
            console.warn("Error parsing window.name data:", e);
          }
        }

        // 4. Check for parameters in parsed props
        if (safeParams.referral_type && !referralParams.type) {
          referralParams.type = safeParams.referral_type;
          sources.push("component props");
        }

        if (safeParams.referral_value && !referralParams.value) {
          referralParams.value = safeParams.referral_value;
          sources.push("component props");
        }

        // 5. Check session storage as a last resort
        if (typeof window !== "undefined") {
          const storageType = sessionStorage.getItem("oqtima_referral_type");
          const storageValue = sessionStorage.getItem("oqtima_referral_value");

          if (storageType && !referralParams.type) {
            referralParams.type = storageType;
            sources.push("session storage");
          }

          // Only set referral_value if we have a valid referral_type
          let parsedType = referralParams.type;
          if (typeof parsedType === "string" && !isNaN(parsedType)) {
            parsedType = Number(parsedType);
          }

          const isSpecificReferralType =
            parsedType === 12 || // IB Referral Link
            parsedType === 14; // Campaign Link

          if (isSpecificReferralType && storageValue && !referralParams.value) {
            referralParams.value = storageValue;
            sources.push("session storage");
          } else if (!isSpecificReferralType && storageValue) {
            // For Normal Registration, clear the referral_value from sessionStorage
            try {
              // CRITICAL: Make sure we completely remove this key, not set it to null
              if (sessionStorage.getItem("oqtima_referral_value") !== null) {
                sessionStorage.removeItem("oqtima_referral_value");
              }

              if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
                delete window.__OQTIMA_REFERRAL_VALUE__;
              }
              console.log(
                "Cleared referral_value from sessionStorage for Normal Registration"
              );
            } catch (e) {
              console.warn("Error clearing referral_value:", e);
            }
          }
        }

        // Convert type to number if it's numeric
        if (referralParams.type && !isNaN(referralParams.type)) {
          referralParams.type = Number(referralParams.type);
        }

        // Check if this is a specific referral type registration (IB Referral or Campaign)
        const isSpecificReferralType =
          referralParams.type === 12 || // IB Referral Link
          referralParams.type === 14; // Campaign Link

        // For Normal Registration, explicitly set referral parameters to null and clear storage
        if (!isSpecificReferralType) {
          console.log(
            "Normal Registration detected - clearing referral parameters"
          );

          // Clear our local params
          referralParams.type = null;
          referralParams.value = null;

          // Clear state
          setReferralType(null);
          setReferralValue(null);

          // Clear storage and global variables
          if (typeof window !== "undefined") {
            try {
              // Remove from sessionStorage
              sessionStorage.removeItem("oqtima_referral_type");
              sessionStorage.removeItem("oqtima_referral_value");

              // Clear global variables
              window.__OQTIMA_REFERRAL_TYPE__ = null;
              window.__OQTIMA_REFERRAL_VALUE__ = null;

              // Clear cookies if they exist
              document.cookie =
                "oqtima_referral_type=; path=/; max-age=0; SameSite=None; Secure";
              document.cookie =
                "oqtima_referral_value=; path=/; max-age=0; SameSite=None; Secure";

              console.log(
                "Successfully cleared all referral parameters for Normal Registration"
              );
            } catch (e) {
              console.warn("Error clearing referral parameters:", e);
            }
          }

          return referralParams;
        }

        // Only update state and storage if we found valid values for specific referral types
        if (isSpecificReferralType && referralParams.type !== null) {
          setReferralType(referralParams.type);
          // Also store in global variables for redundancy
          if (typeof window !== "undefined") {
            window.__OQTIMA_REFERRAL_TYPE__ = referralParams.type;
            try {
              sessionStorage.setItem(
                "oqtima_referral_type",
                referralParams.type
              );
              // Try to set a cookie as well (might help with cross-domain issues)
              document.cookie = `oqtima_referral_type=${referralParams.type}; path=/; max-age=3600; SameSite=None; Secure`;
            } catch (e) {}
          }
        }

        if (isSpecificReferralType && referralParams.value !== null) {
          setReferralValue(referralParams.value);
          // Also store in global variables for redundancy
          if (typeof window !== "undefined") {
            window.__OQTIMA_REFERRAL_VALUE__ = referralParams.value;
            try {
              sessionStorage.setItem(
                "oqtima_referral_value",
                referralParams.value
              );
              // Try to set a cookie as well (might help with cross-domain issues)
              document.cookie = `oqtima_referral_value=${referralParams.value}; path=/; max-age=3600; SameSite=None; Secure`;
            } catch (e) {}
          }
        }

        // Log what we found
        if (sources.length > 0) {
          console.log("Found referral parameters from sources:", sources);
          console.log("Referral parameters:", referralParams);
        }

        return referralParams;
      } catch (e) {
        console.error("Error extracting referral parameters:", e);
        return { type: null, value: null };
      }
    };

    // Run the extraction immediately
    const extractedParams = extractReferralParameters();

    // Add a message listener to receive parameters from the parent window
    const handleParentMessage = (event) => {
      try {
        if (event.data && typeof event.data === "object") {
          // Check for our specific message types
          if (event.data.type === "REGISTRATION_PARAMS" && event.data.data) {
            const { data } = event.data;

            // Store the referral parameters
            if (data.referral_type !== undefined) {
              // Check if this is a specific referral type registration (IB Referral or Campaign)
              let parsedType = data.referral_type;
              if (typeof parsedType === "string" && !isNaN(parsedType)) {
                parsedType = Number(parsedType);
              }

              const isSpecificReferralType =
                parsedType === 12 || // IB Referral Link
                parsedType === 14; // Campaign Link

              if (isSpecificReferralType) {
                setReferralType(parsedType);
                try {
                  sessionStorage.setItem("oqtima_referral_type", parsedType);
                  window.__OQTIMA_REFERRAL_TYPE__ = parsedType;

                  console.log(
                    "Received valid referral_type from parent window:",
                    parsedType
                  );
                } catch (e) {}

                // Only set referral_value if we have a valid referral_type
                if (data.referral_value) {
                  setReferralValue(data.referral_value);
                  try {
                    sessionStorage.setItem(
                      "oqtima_referral_value",
                      data.referral_value
                    );
                    window.__OQTIMA_REFERRAL_VALUE__ = data.referral_value;

                    console.log(
                      "Received valid referral_value from parent window:",
                      data.referral_value
                    );
                  } catch (e) {}
                }
              } else {
                // For Normal Registration, clear referral parameters
                console.log(
                  "Normal Registration - clearing referral parameters from parent message"
                );
                setReferralType(null);
                setReferralValue(null);

                try {
                  // CRITICAL: Make sure we completely remove these keys, not set them to null
                  if (sessionStorage.getItem("oqtima_referral_type") !== null) {
                    sessionStorage.removeItem("oqtima_referral_type");
                  }

                  if (
                    sessionStorage.getItem("oqtima_referral_value") !== null
                  ) {
                    sessionStorage.removeItem("oqtima_referral_value");
                  }

                  if (window.__OQTIMA_REFERRAL_TYPE__ !== undefined) {
                    delete window.__OQTIMA_REFERRAL_TYPE__;
                  }

                  if (window.__OQTIMA_REFERRAL_VALUE__ !== undefined) {
                    delete window.__OQTIMA_REFERRAL_VALUE__;
                  }
                } catch (e) {
                  console.warn("Error clearing referral parameters:", e);
                }
              }
            }

            /* Block removed to prevent unconditional setting of referral_value */

            // Send confirmation back to parent
            try {
              window.parent.postMessage(
                {
                  type: "REFERRAL_PARAMS_RECEIVED",
                  success: true,
                  timestamp: Date.now(),
                },
                "*"
              );
            } catch (e) {}
          }
        }
      } catch (e) {
        console.warn("Error processing message from parent:", e);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleParentMessage);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleParentMessage);
      }
    };
  }, [safeParams]);

  // Update the handleRegistrationtForm function to ensure referral parameters are included
  const handleRegistrationtForm = async (values) => {
    const token = await executeRecaptcha("popup_registration");

    // Create a local copy of portalLanguageCode that we can modify
    let submissionLanguage = portalLanguageCode;
    console.log("submissionLanguage", submissionLanguage);

    // Check if we're in a Brazilian Portuguese URL path
    const urlPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (urlPath.includes("/br/") && submissionLanguage !== "pt") {
      submissionLanguage = "pt";
    }

    try {
      // CRUCIAL STEP: Get most accurate and up-to-date referral parameters
      // We collect from all possible sources with a clear priority order

      // 1. Collect from URL parameters (highest priority)
      let finalReferralType = null;
      let finalReferralValue = null;

      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlReferralType =
          urlParams.get("referral_type") ||
          urlParams.get("referralType") ||
          urlParams.get("referral-type");

        const urlReferralValue =
          urlParams.get("referral_value") ||
          urlParams.get("referralValue") ||
          urlParams.get("referral-value");

        if (urlReferralType) {
          finalReferralType = urlReferralType;
          console.log(
            "Using referral_type from URL parameters:",
            finalReferralType
          );
        }

        if (urlReferralValue) {
          finalReferralValue = urlReferralValue;
          console.log(
            "Using referral_value from URL parameters:",
            finalReferralValue
          );
        }
      }

      // 2. Check state variables if URL parameters weren't found
      if (finalReferralType === null && referral_type !== null) {
        finalReferralType = referral_type;
        console.log(
          "Using referral_type from component state:",
          finalReferralType
        );
      }

      if (finalReferralValue === null && referral_value !== null) {
        finalReferralValue = referral_value;
        console.log(
          "Using referral_value from component state:",
          finalReferralValue
        );
      }

      // 3. Check props parameters if still not found
      if (
        finalReferralType === null &&
        safeParams.referral_type !== undefined
      ) {
        finalReferralType = safeParams.referral_type;
        console.log("Using referral_type from props:", finalReferralType);
      }

      if (
        finalReferralValue === null &&
        safeParams.referral_value !== undefined
      ) {
        finalReferralValue = safeParams.referral_value;
        console.log("Using referral_value from props:", finalReferralValue);
      }

      // 4. Check sessionStorage as a fallback
      if (finalReferralType === null && typeof window !== "undefined") {
        const storageType = sessionStorage.getItem("oqtima_referral_type");
        if (storageType) {
          finalReferralType = storageType;
          console.log(
            "Using referral_type from sessionStorage:",
            finalReferralType
          );
        }
      }

      if (finalReferralValue === null && typeof window !== "undefined") {
        const storageValue = sessionStorage.getItem("oqtima_referral_value");
        if (storageValue) {
          finalReferralValue = storageValue;
          console.log(
            "Using referral_value from sessionStorage:",
            finalReferralValue
          );
        }
      }

      // 5. Check global variables as a final fallback
      if (
        finalReferralType === null &&
        typeof window !== "undefined" &&
        window.__OQTIMA_REFERRAL_TYPE__ !== undefined
      ) {
        finalReferralType = window.__OQTIMA_REFERRAL_TYPE__;
        console.log(
          "Using referral_type from global variable:",
          finalReferralType
        );
      }

      if (
        finalReferralValue === null &&
        typeof window !== "undefined" &&
        window.__OQTIMA_REFERRAL_VALUE__ !== undefined
      ) {
        finalReferralValue = window.__OQTIMA_REFERRAL_VALUE__;
        console.log(
          "Using referral_value from global variable:",
          finalReferralValue
        );
      }

      // 7. Normalize referral type to number if it's numeric
      if (finalReferralType !== null && !isNaN(finalReferralType)) {
        finalReferralType = Number(finalReferralType);
      }

      // Check if this is a specific referral type registration (IB Referral or Campaign)
      const isSpecificReferralType =
        finalReferralType === 12 || // IB Referral Link
        finalReferralType === 14; // Campaign Link

      // If not a specific referral type, clear the referral value
      if (!isSpecificReferralType) {
        finalReferralValue = null;
        console.log("Not a specific referral type - clearing referral_value");
      }

      // Build the registration data
      const registrationData = {
        ...values,
        language: submissionLanguage,
        token,
        redirect: "register",
        register_ip: clientIpAddress || clientConfig.ipAddress || "",
        agreement: true,
        privacy: policyLinks.privacyPolicy,
        cookie: policyLinks.cookiePolicy,
      };

      // Only include referral parameters if they exist and this is a specific referral type
      if (finalReferralType !== null) {
        registrationData.referral_type = finalReferralType;

        if (isSpecificReferralType) {
          console.log("Including referral parameters in API request:", {
            referral_type: finalReferralType,
            referral_value: finalReferralValue || null,
          });
        } else {
          console.log(
            "Normal Registration with referral_type but no referral_value"
          );
        }
      } else {
        console.log(
          "Normal Registration - Not including referral parameters in API request"
        );
      }

      // Only include referral_value if we have a specific referral type
      if (isSpecificReferralType && finalReferralValue !== null) {
        registrationData.referral_value = finalReferralValue;
      }

      // Make the API request
      const response = await axios.post(
        `${API_URL}crm-register`,
        registrationData
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
        // Check if it looks like a language code (typically 2-7 characters)
        if (possibleLang && possibleLang.length <= 7) {
          // CHANGE: Always set language from URL path regardless of other sources
          // This ensures the URL path language takes precedence over context language
          setLanguageFromUrl(possibleLang);
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log("Setting up message listeners for referral parameters");

    // Request parameters from parent window when component mounts
    if (window.parent && window.parent !== window) {
      try {
        console.log("Requesting parameters from parent window");
        window.parent.postMessage(
          {
            type: "OQTIMA_REQUEST_PARAMS",
            timestamp: Date.now(),
          },
          "*"
        );
      } catch (e) {
        console.error("Error requesting parameters from parent:", e);
      }
    }

    // Listen for parameter messages from parent window
    const handleMessages = (event) => {
      try {
        // For security, you might want to check the origin
        if (
          event.data &&
          typeof event.data === "object" &&
          event.data.type === "REGISTRATION_PARAMS"
        ) {
          console.log(
            "Received registration parameters from parent:",
            event.data
          );

          const params = event.data.data || {};
          let shouldUpdateState = false;
          let newReferralType = referral_type;
          let newReferralValue = referral_value;

          // Process referral_type
          if (
            params.referral_type !== undefined &&
            params.referral_type !== null
          ) {
            // Convert to number if it's numeric
            if (!isNaN(Number(params.referral_type))) {
              newReferralType = Number(params.referral_type);
            } else {
              newReferralType = params.referral_type;
            }
            shouldUpdateState = true;

            // Store in sessionStorage for persistence
            try {
              sessionStorage.setItem(
                "oqtima_referral_type",
                newReferralType.toString()
              );
              console.log(
                "Stored referral_type in sessionStorage:",
                newReferralType
              );
            } catch (e) {
              console.error(
                "Failed to store referral_type in sessionStorage:",
                e
              );
            }
          }

          // Process referral_value
          if (
            params.referral_value !== undefined &&
            params.referral_value !== null
          ) {
            newReferralValue = params.referral_value;
            shouldUpdateState = true;

            // Store in sessionStorage for persistence
            try {
              sessionStorage.setItem(
                "oqtima_referral_value",
                newReferralValue.toString()
              );
              console.log(
                "Stored referral_value in sessionStorage:",
                newReferralValue
              );
            } catch (e) {
              console.error(
                "Failed to store referral_value in sessionStorage:",
                e
              );
            }
          }

          // Update state if needed
          if (shouldUpdateState) {
            console.log("Updating state with new referral parameters:", {
              referral_type: newReferralType,
              referral_value: newReferralValue,
            });
            setReferralType(newReferralType);
            setReferralValue(newReferralValue);
          }
        }
      } catch (e) {
        console.error("Error processing message:", e);
      }
    };

    window.addEventListener("message", handleMessages);

    return () => {
      window.removeEventListener("message", handleMessages);
    };
  }, [referral_type, referral_value, setReferralType, setReferralValue]);

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
