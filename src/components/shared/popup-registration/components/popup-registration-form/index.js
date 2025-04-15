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
  const languageCode = PORTAL_LANGUAGES_MAP[selectedLanguage?.id];

  // State to store language code sent from landing page
  const [externalLangCode, setExternalLangCode] = useState(null);

  // Function to get the final language code to be used
  const getEffectiveLanguageCode = () => {
    // Prioritize language code from external parameter if available
    if (externalLangCode) {
      return externalLangCode;
    }
    // Fallback to language code from Gatsby application
    return languageCode || "en";
  };

  // Parse params safely
  const safeParams = useMemo(() => {
    try {
      let parsedParams = {};

      // Try to parse JSON if params is a string
      if (typeof params === "string") {
        try {
          parsedParams = JSON.parse(params);
        } catch (jsonErr) {
          console.warn("Could not parse params as JSON:", jsonErr);
          // If JSON parsing fails, assume it might be a simple string like a language code
          if (params && params.length <= 5) {
            // Most language codes are 2-5 chars
            parsedParams = { langParam: params };
          }
        }
      } else {
        parsedParams = params || {};
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
          console.log("Using language from URL query params:", urlLangParam);
        }

        // Handle data-lang parameter which may be set as br (for brazilian portuguese)
        const urlDataLang = urlParams.get("data-lang");
        if (urlDataLang && !parsedParams.langParam) {
          parsedParams.langParam = urlDataLang;
          console.log("Using data-lang from URL query params:", urlDataLang);
        }
      }

      return parsedParams;
    } catch (e) {
      console.error("Error parsing params:", e);
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

  // Update state values when params change
  useEffect(() => {
    if (safeParams.referral_type) {
      setReferralType(safeParams.referral_type);
    }
    if (safeParams.referral_value) {
      setReferralValue(safeParams.referral_value);
    }
    // Process langParam if available
    if (safeParams.langParam) {
      // Map to portal language format using PORTAL_LANGUAGES_MAP
      const mappedLanguage =
        PORTAL_LANGUAGES_MAP[safeParams.langParam] || safeParams.langParam;
      setExternalLangCode(mappedLanguage);
      console.log("Setting external language from params:", {
        original: safeParams.langParam,
        mapped: mappedLanguage,
      });
    }
  }, [safeParams]);

  // Listen for messages from parent window with higher priority
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "REGISTRATION_PARAMS") {
        const data = event.data.data || {};
        const msgReferralType = data.referral_type || null;
        const msgReferralValue = data.referral_value || null;

        // ADDED: Extract client information from message
        const msgIpAddress = data.ip_address || null;
        const msgCountryName = data.country_name || null;
        const msgCountryCode = data.country_code || null;
        // Extract language data
        const msgLanguage = data.language || data.lang || null;

        if (msgReferralType) setReferralType(msgReferralType);
        if (msgReferralValue) setReferralValue(msgReferralValue);

        // ADDED: Set client information if available
        if (msgIpAddress) setClientIpAddress(msgIpAddress);
        if (msgCountryName) setClientCountryName(msgCountryName);
        if (msgCountryCode) setClientCountryCode(msgCountryCode);

        // Set language code if received from parent window
        if (msgLanguage) {
          const mappedLanguage =
            PORTAL_LANGUAGES_MAP[msgLanguage] || msgLanguage;
          setExternalLangCode(mappedLanguage);
          console.log("Setting external language from parent message:", {
            original: msgLanguage,
            mapped: mappedLanguage,
          });
        }

        // ADDED: Log received data for debugging
        console.log("Received client data:", {
          ip: msgIpAddress,
          country: msgCountryName,
          code: msgCountryCode,
          language: msgLanguage,
        });
      }
    };

    window.addEventListener("message", handleMessage);

    // Try to extract parameters directly from URL immediately
    const extractUrlParams = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        console.log("URL search params:", window.location.search);

        // Check all possible parameter formats for referral
        const urlReferralType =
          urlParams.get("referral_type") ||
          urlParams.get("referralType") ||
          urlParams.get("referral-type");

        const urlReferralValue =
          urlParams.get("referral_value") ||
          urlParams.get("referralValue") ||
          urlParams.get("referral-value");

        if (urlReferralType) setReferralType(urlReferralType);
        if (urlReferralValue) setReferralValue(urlReferralValue);

        // Extract language parameters for debugging
        const langParam =
          urlParams.get("language") ||
          urlParams.get("lang") ||
          urlParams.get("locale") ||
          urlParams.get("i18nextLng") ||
          urlParams.get("data-lang");

        if (langParam) {
          console.log("Extracted language from URL:", langParam);
          // Set language code from URL parameters
          const mappedLanguage = PORTAL_LANGUAGES_MAP[langParam] || langParam;
          setExternalLangCode(mappedLanguage);
          console.log("Setting external language from URL:", {
            original: langParam,
            mapped: mappedLanguage,
          });
        }
      } catch (err) {
        console.error("Error extracting URL parameters:", err);
      }
    };

    // Extract parameters from URL immediately
    extractUrlParams();

    // Also try to get data-lang from script element if available
    try {
      if (typeof window !== "undefined") {
        const scriptElement = document.querySelector("script[data-lang]");
        if (scriptElement) {
          const scriptLang = scriptElement.getAttribute("data-lang");
          if (scriptLang) {
            console.log("Found data-lang attribute in script:", scriptLang);
            const mappedLanguage =
              PORTAL_LANGUAGES_MAP[scriptLang] || scriptLang;
            setExternalLangCode(mappedLanguage);
            console.log("Setting external language from script element:", {
              original: scriptLang,
              mapped: mappedLanguage,
            });
          }
        }
      }
    } catch (err) {
      console.error("Error checking script elements:", err);
    }

    // Try again after a short delay (for late-loading cases)
    const timeout = setTimeout(extractUrlParams, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  // ADDED: Effect to set client information when it's updated
  useEffect(() => {
    // If we received client info from parent window and it's different from context
    if (
      clientIpAddress &&
      (!clientConfig.ipAddress || clientConfig.ipAddress !== clientIpAddress)
    ) {
      console.log(
        "Overriding client IP with data from parent:",
        clientIpAddress
      );
      // Update the clientConfig object
      clientConfig.ipAddress = clientIpAddress;
    }

    // Apply country information if we have it
    if (
      clientCountryName &&
      (!clientConfig.countryName ||
        clientConfig.countryName !== clientCountryName)
    ) {
      console.log(
        "Overriding country with data from parent:",
        clientCountryName
      );
      clientConfig.countryName = clientCountryName;
    }

    if (
      clientCountryCode &&
      (!clientConfig.countryCode ||
        clientConfig.countryCode !== clientCountryCode)
    ) {
      console.log(
        "Overriding country code with data from parent:",
        clientCountryCode
      );
      clientConfig.countryCode = clientCountryCode;
    }
  }, [clientIpAddress, clientCountryName, clientCountryCode, clientConfig]);

  // Use the i18n translation function
  const { i18n } = useTranslation();

  // Check for RTL languages using effective language code
  const effectiveLanguageCode = getEffectiveLanguageCode();
  const isRTLMode = isRTL || RTL_LANGUAGES.includes(effectiveLanguageCode);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [policyLinks, setPolicyLinks] = useState({
    privacyPolicy: "",
    cookiePolicy: "",
    loading: true,
    error: false,
  });

  // Add state to track if we've already fetched policy links
  const [hasFetchedPolicyLinks, setHasFetchedPolicyLinks] = useState(false);
  // Add state to track the language we used for fetching
  const [fetchedLanguage, setFetchedLanguage] = useState("");

  // Enhanced policy link click handler with improved tracking and error handling
  const handlePolicyLinkClick = (e, url) => {
    e.preventDefault();

    if (!url) {
      console.warn("Attempted to open policy link but URL is empty");
      return;
    }

    // Anti multi-click implementation with improved tracking
    const target = e.currentTarget;

    // Check if link is in process (throttling)
    if (target.getAttribute("data-processing") === "true") {
      return;
    }

    // Set flag to prevent repeated clicks
    target.setAttribute("data-processing", "true");

    // Generate a unique ID for this request
    const requestId = Date.now();

    // Track which window was opened
    let policyWindow = null;
    // Flag to track if the link was handled by parent
    let handledByParent = false;

    // Reset flag after 3 seconds
    setTimeout(() => {
      target.removeAttribute("data-processing");
    }, 3000);

    // Determine the policy type for tracking and messaging
    const policyType = url.toLowerCase().includes("privacy")
      ? "privacy"
      : "cookie";
    console.log(`Opening ${policyType} policy link: ${url}`);

    // Handle differently based on context
    if (window.parent !== window) {
      // If inside an iframe, first try sending a message to parent window
      try {
        // Set up a listener to know if the parent handled the link - BEFORE sending the message
        const messageListener = (event) => {
          if (
            event.data &&
            event.data.type === "OQTIMA_LINK_OPENED" &&
            event.data.url === url
          ) {
            console.log("Link was handled by parent window");
            handledByParent = true;
            window.removeEventListener("message", messageListener);
          }
        };

        window.addEventListener("message", messageListener);

        // Send a clear message to the parent window to handle opening the policy link
        window.parent.postMessage(
          {
            type: "OQTIMA_OPEN_LINK",
            url: url,
            isPolicyLink: true,
            policyType: policyType,
            openInNewTab: true, // Explicitly state this should open in a new tab
            timestamp: requestId,
          },
          "*"
        );

        // Fallback: try to open directly after a short delay if parent doesn't handle it
        setTimeout(() => {
          window.removeEventListener("message", messageListener);

          // Only open in a new tab if the parent didn't handle it
          if (!handledByParent && !policyWindow) {
            try {
              console.log("Parent didn't handle link, opening directly:", url);
              policyWindow = window.open(url, "_blank", "noopener,noreferrer");

              if (!policyWindow) {
                console.warn("Policy link popup was blocked by browser");
              }
            } catch (fallbackErr) {
              console.error(
                "Error in fallback policy link opening:",
                fallbackErr
              );
            }
          }
        }, 400); // Increase timeout to ensure parent has time to handle the request
      } catch (err) {
        console.error("Error sending policy link message to parent:", err);

        // Last resort: direct opening if message sending fails
        try {
          policyWindow = window.open(url, "_blank", "noopener,noreferrer");
        } catch (fallbackErr) {
          console.error(
            "Final attempt to open policy link failed:",
            fallbackErr
          );
          sendLog({
            message: `Failed to open policy link: ${fallbackErr.message}`,
            type: fallbackErr.name,
            url: url,
          });
        }
      }
    } else {
      // If not in an iframe, open the link directly in a new tab
      try {
        policyWindow = window.open(url, "_blank", "noopener,noreferrer");

        if (!policyWindow) {
          console.warn("Policy link popup was blocked by browser");
        }
      } catch (err) {
        console.error("Error opening policy link directly:", err);
        sendLog({
          message: `Failed to open policy link: ${err.message}`,
          type: err.name,
          url: url,
        });
      }
    }
  };

  useEffect(() => {
    const fetchPolicyLinks = async () => {
      // Use effective language code for fetching policy links
      const currentLanguageCode = getEffectiveLanguageCode();

      // Skip fetching if we already have policy links and the language hasn't changed significantly
      if (
        hasFetchedPolicyLinks &&
        fetchedLanguage &&
        (fetchedLanguage === currentLanguageCode ||
          (fetchedLanguage === "en" &&
            !["pt", "es", "ar"].includes(currentLanguageCode)))
      ) {
        console.log(
          `Using cached policy links. Previous: ${fetchedLanguage}, Current: ${currentLanguageCode}`
        );
        return;
      }

      try {
        setPolicyLinks((prev) => ({ ...prev, loading: true, error: false }));

        console.log(
          `Fetching policy links for language: ${currentLanguageCode}`
        );

        const response = await axios.get(`${API_URL}crm-register/policy-links`);
        const { privacy_policy, cookie_policy } = response.data;

        console.log("Available policy languages:", {
          privacy: privacy_policy.map((p) => p.language),
          cookie: cookie_policy.map((c) => c.language),
        });

        // First try to find policy in user's language
        let privacyLink = privacy_policy.find(
          (p) => p.language === currentLanguageCode
        )?.oss_url;

        let cookieLink = cookie_policy.find(
          (c) => c.language === currentLanguageCode
        )?.oss_url;

        // If not found, fallback to English
        if (!privacyLink) {
          privacyLink = privacy_policy.find(
            (p) => p.language === "en"
          )?.oss_url;
          console.log(
            `Privacy policy not found in ${currentLanguageCode}, using English version`
          );
        }

        if (!cookieLink) {
          cookieLink = cookie_policy.find((c) => c.language === "en")?.oss_url;
          console.log(
            `Cookie policy not found in ${currentLanguageCode}, using English version`
          );
        }

        setPolicyLinks({
          privacyPolicy: privacyLink || "",
          cookiePolicy: cookieLink || "",
          loading: false,
          error: false,
        });

        // Mark that we've fetched the links and store the language used
        setHasFetchedPolicyLinks(true);
        setFetchedLanguage(currentLanguageCode);

        // Log for debugging
        console.log(`Policy links loaded. Language: ${currentLanguageCode}`);
        console.log(`Privacy policy: ${privacyLink}`);
        console.log(`Cookie policy: ${cookieLink}`);
      } catch (error) {
        console.error("Error fetching policy links:", error);
        setPolicyLinks((prev) => ({
          ...prev,
          loading: false,
          error: true,
        }));
        sendLog({
          message: `Failed to fetch policy links: ${error.message}`,
          type: error.name,
        });
      }
    };

    fetchPolicyLinks();
  }, [externalLangCode, languageCode, hasFetchedPolicyLinks, fetchedLanguage]);

  const filteredCountries = useMemo(() => {
    if (!searchCountry) return countries;
    const searchTerm = searchCountry.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm)
    );
  }, [searchCountry]);

  const handleApiResponse = (isSuccessful, message = "", code = null) => {
    setIsSentSuccessful(isSuccessful);

    // Use code-based error mapping
    if (code && ERROR_CODE_MAP[code]) {
      setErrorMessage(t(ERROR_CODE_MAP[code]));
    } else {
      // If no code or no mapping for the code, just use the message directly
      setErrorMessage(message);
    }
  };

  const handleRegistrationtForm = async (values) => {
    const token = await executeRecaptcha("popup_registration");
    // Use effective language code for registration
    const currentLanguageCode = getEffectiveLanguageCode();
    console.log(
      "Effective language code for registration:",
      currentLanguageCode
    );

    try {
      // Prepare submission data with referral parameters and ensure IP address is included
      const submissionData = {
        ...values,
        token,
        language: currentLanguageCode,
        redirect: "register",
        // MODIFIED: Use the client IP address from parent if available or fallback to context
        register_ip: clientIpAddress || clientConfig.ipAddress || "",
        agreement: true,
        privacy: policyLinks.privacyPolicy,
        cookie: policyLinks.cookiePolicy,
      };

      // Validate if policy links are available
      if (!policyLinks.privacyPolicy || !policyLinks.cookiePolicy) {
        console.warn("Missing policy links during form submission");
        // Still include them in submission but log the issue
        sendLog({
          message: "Registration submitted with missing policy links",
          type: "PolicyWarning",
          privacy: policyLinks.privacyPolicy,
          cookie: policyLinks.cookiePolicy,
        });
      }

      // Only add referral parameters if we have them
      if (referral_type) {
        submissionData.referral_type = referral_type;
      }

      if (referral_value) {
        submissionData.referral_value = referral_value;
      }

      console.log("Submitting registration with data:", {
        ip: submissionData.register_ip,
        language: currentLanguageCode,
        country: values.country,
        code: values.country_code,
        referral_type,
        referral_value,
      });

      const response = await axios.post(
        `${API_URL}crm-register`,
        submissionData
      );

      if (response.data.code && response.data.code !== 200) {
        handleApiResponse(false, response.data.message, response.data.code);
      } else {
        handleApiResponse(true);

        const redirectAddress = response.data.redirect_address;
        console.log("redirectAddress", redirectAddress);
        if (redirectAddress) {
          // Check if we're in an iframe
          if (window.parent !== window) {
            // MODIFIED: Improved redirection handling for iframe context
            console.log(
              "Registration successful, redirecting to:",
              redirectAddress
            );

            try {
              // STEP 1: Send multiple message formats to ensure compatibility

              // Send detailed registration success message
              window.parent.postMessage(
                {
                  type: "OQTIMA_REGISTRATION_SUCCESS",
                  redirectUrl: redirectAddress,
                  success: true,
                  timestamp: Date.now(),
                },
                "*"
              );

              // STEP 2: Alternative message formats for different parent handlers
              // Standard redirect message
              window.parent.postMessage(
                {
                  type: "REDIRECT_TO_URL",
                  url: redirectAddress,
                  success: true,
                  timestamp: Date.now(),
                },
                "*"
              );

              // Legacy format support
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

              // Simple format for basic handlers
              window.parent.postMessage(`redirect:${redirectAddress}`, "*");

              // STEP 3: Direct approach - try to set parent location directly
              // This is the most reliable but might be blocked in some browsers
              setTimeout(() => {
                try {
                  console.log("Attempting direct redirect to parent window");
                  window.parent.location.href = redirectAddress;
                } catch (directErr) {
                  console.warn(
                    "Direct parent redirect blocked:",
                    directErr.message
                  );

                  // STEP 4: As last resort, if direct redirection fails, try to open in a new tab
                  try {
                    console.log("Attempting fallback to new tab");
                    const newWindow = window.open(redirectAddress, "_blank");

                    if (newWindow) {
                      newWindow.focus();
                      // Close the current popup if new window was opened successfully
                      window.parent.postMessage(
                        {
                          type: "OQTIMA_CLOSE_POPUP",
                          reason: "redirect-success",
                        },
                        "*"
                      );
                    } else {
                      console.error("Popup blocked - unable to redirect");
                      // Display a user-friendly message about the redirect
                      setErrorMessage(
                        "Registration successful! The redirection was blocked by your browser. Please check for popup blockers."
                      );
                    }
                  } catch (fallbackErr) {
                    console.error(
                      "All redirect methods failed:",
                      fallbackErr.message
                    );
                  }
                }
              }, 500);

              // STEP 5: Store redirect in localStorage for potential use by parent
              try {
                localStorage.setItem(
                  "OQTIMA_PENDING_REDIRECT",
                  redirectAddress
                );
                localStorage.setItem("OQTIMA_REGISTRATION_SUCCESS", "true");
                localStorage.setItem(
                  "OQTIMA_REGISTRATION_TIMESTAMP",
                  Date.now().toString()
                );
              } catch (storageErr) {
                console.warn(
                  "Could not save to localStorage:",
                  storageErr.message
                );
              }
            } catch (err) {
              console.error("Error during redirect process:", err.message);

              // If all else fails, try one more redirect approach
              try {
                window.top.location.href = redirectAddress;
              } catch (topErr) {
                console.error("Final redirect attempt failed:", topErr.message);
              }
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

  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        email: "",
        // MODIFIED: Prioritize country data from parent window over context
        country: clientCountryName || clientConfig?.countryName || "",
        country_code:
          clientCountryCode ||
          (clientConfig?.countryName
            ? countries.find(
                (country) =>
                  country.name.toLowerCase() ===
                  clientConfig.countryName.toLowerCase()
              )?.code || ""
            : ""),
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
          const matchingCountry = countries.find((c) => c.name === countryName);
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
            })}
            dir={isRTLMode ? "rtl" : "ltr"}
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
                        isCountryOpen ? "custom-dropdown__selected--open" : ""
                      }`}
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                    >
                      {selectedCountry || (
                        <span className="custom-dropdown__placeholder">
                          {t("popup-registration-countryOfResidence") + " *"}
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
                          isCodeOpen ? "custom-dropdown__selected--open" : ""
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
                      placeholder={t("popup-registration-phoneNumber") + " *"}
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
                  {policyLinks.loading ? (
                    // Show loading state for policy links
                    <span>{t("popup-registration-loading-policies")}</span>
                  ) : policyLinks.error ? (
                    // Show error state if policy links failed to load
                    <span>{t("popup-registration-policies-error")}</span>
                  ) : (
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
                        data-policy-type="privacy"
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
                        data-policy-type="cookie"
                      >
                        Cookie Policy
                      </a>
                      of the Company.
                    </Trans>
                  )}
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
                "button-link--disabled": false,
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
  );
};

export default PopupRegistrationForm;
