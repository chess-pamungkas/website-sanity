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

  // Parse params safely
  const safeParams = useMemo(() => {
    try {
      if (typeof params === "string") {
        return JSON.parse(params);
      }
      return params || {};
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

  // Update state values when params change
  useEffect(() => {
    if (safeParams.referral_type) {
      setReferralType(safeParams.referral_type);
    }
    if (safeParams.referral_value) {
      setReferralValue(safeParams.referral_value);
    }
  }, [safeParams]);

  // Listen for messages from parent window with higher priority
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "REGISTRATION_PARAMS") {
        const data = event.data.data || {};
        const msgReferralType = data.referral_type || null;
        const msgReferralValue = data.referral_value || null;

        if (msgReferralType) setReferralType(msgReferralType);
        if (msgReferralValue) setReferralValue(msgReferralValue);
      }
    };

    window.addEventListener("message", handleMessage);

    // Try to extract parameters directly from URL immediately
    const extractUrlParams = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);

        // Check all possible parameter formats
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
      } catch (err) {
        console.error("Error extracting URL parameters:", err);
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
  const forcedRTL =
    safeParams.langParam && RTL_LANGUAGES.includes(safeParams.langParam);
  const isRTLMode = isRTL || forcedRTL;

  // Prioritize langParam from URL parameters over context language
  // This ensures the language specified in the URL is used
  const paramLangCode = safeParams.langParam;
  const contextLangCode = selectedLanguage?.id || "en";

  // Use the language from params if available, otherwise use context language
  // This fixes the issue where language from URL is ignored
  const languageCode = paramLangCode || contextLangCode;

  // Map to portal language format (needed for API calls)
  const portalLanguageCode = PORTAL_LANGUAGES_MAP[languageCode] || "en";

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

    // Anti multi-click implementation with improved tracking
    const target = e.currentTarget;

    // Check if link is in process (throttling)
    if (target.getAttribute("data-processing") === "true") {
      return;
    }

    // Set flag to prevent repeated clicks
    target.setAttribute("data-processing", "true");

    // Track which window was opened
    let policyWindow = null;

    // Reset flag after 3 seconds
    setTimeout(() => {
      target.removeAttribute("data-processing");
    }, 3000);

    // Handle differently based on context
    if (window.parent !== window) {
      // If inside an iframe, first try sending a message to parent window
      try {
        window.parent.postMessage(
          {
            type: "OQTIMA_OPEN_LINK",
            url: url,
            isPolicyLink: true,
            policyType: url.toLowerCase().includes("privacy")
              ? "privacy"
              : "cookie",
            timestamp: Date.now(),
          },
          "*"
        );

        // As a fallback, try to open directly after a short delay
        // This only happens if the parent handler doesn't handle it
        setTimeout(() => {
          // Check if a window was already opened by the parent
          if (!policyWindow) {
            try {
              policyWindow = window.open(url, "_blank", "noopener,noreferrer");

              // If window was blocked, show a hint to the user
              if (!policyWindow) {
                console.warn(
                  "Popup was blocked by browser - consider enabling popups for this site"
                );
              }
            } catch (err) {
              console.error("Error opening policy link directly:", err);
            }
          }
        }, 500);
      } catch (err) {
        console.error("Error sending message to parent for policy link:", err);

        // Fallback to direct opening if message sending fails
        try {
          policyWindow = window.open(url, "_blank", "noopener,noreferrer");
        } catch (innerErr) {
          console.error("Error in fallback policy link opening:", innerErr);
        }
      }
    } else {
      // If not in an iframe, open the link directly
      try {
        policyWindow = window.open(url, "_blank", "noopener,noreferrer");

        // If window was blocked, show a hint to the user
        if (!policyWindow) {
          console.warn(
            "Popup was blocked by browser - consider enabling popups for this site"
          );
        }
      } catch (err) {
        console.error("Error opening policy link directly:", err);
      }
    }
  };

  useEffect(() => {
    const fetchPolicyLinks = async () => {
      try {
        const response = await axios.get(`${API_URL}crm-register/policy-links`);
        const { privacy_policy, cookie_policy } = response.data;

        const privacyLink =
          privacy_policy.find((p) => p.language === portalLanguageCode)
            ?.oss_url ||
          privacy_policy.find((p) => p.language === "en")?.oss_url;

        const cookieLink =
          cookie_policy.find((c) => c.language === portalLanguageCode)
            ?.oss_url ||
          cookie_policy.find((c) => c.language === "en")?.oss_url;

        setPolicyLinks({
          privacyPolicy: privacyLink,
          cookiePolicy: cookieLink,
        });
      } catch (error) {
        sendLog({ message: error.message, type: error.name });
      }
    };

    fetchPolicyLinks();
  }, [portalLanguageCode]);

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

    try {
      // Prepare submission data with referral parameters
      const submissionData = {
        ...values,
        token,
        language: portalLanguageCode,
        redirect: "register",
        register_ip: clientConfig.ipAddress,
        agreement: true,
        privacy: policyLinks.privacyPolicy,
        cookie: policyLinks.cookiePolicy,
      };

      // Only add referral parameters if we have them
      if (referral_type) {
        submissionData.referral_type = referral_type;
      }

      if (referral_value) {
        submissionData.referral_value = referral_value;
      }

      const response = await axios.post(
        `${API_URL}crm-register`,
        submissionData
      );

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
                    console.log("Could not directly set top location", err);
                  }
                }, 300);
              }
            } catch (err) {
              console.log("Could not access top window", err);
            }

            // ENHANCED: As a final fallback, try to save to localStorage for use on page reload
            try {
              localStorage.setItem("OQTIMA_PENDING_REDIRECT", redirectAddress);

              // Set a flag to indicate successful registration
              localStorage.setItem("OQTIMA_REGISTRATION_SUCCESS", "true");
              localStorage.setItem(
                "OQTIMA_REGISTRATION_TIMESTAMP",
                Date.now().toString()
              );
            } catch (err) {
              console.log("Could not save to localStorage", err);
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
                  <Trans i18nKey="popup-registration-consent" ns="index">
                    I agree to allow the company to process my personal data to
                    meet its regulatory obligations and I have read and
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
