import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Formik } from "formik";
import cn from "classnames";
import { PopupRegistrationSchema } from "../../../../../validations/popup-registration";
import axios from "axios";
import { Trans } from "react-i18next";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslationWithVariables } from "../../../../../helpers/hooks/use-translation-with-vars";
import { sendLog } from "../../../../../helpers/services/log-service";
import countries from "../../../../shared/countries";
import ClientResolverContext from "../../../../../context/client-resolver-context";
import { PORTAL_LANGUAGES_MAP } from "../../../../../helpers/lang-options.config";
import LanguageContext from "../../../../../context/language-context";
import arrowDownIcon from "../../../../../assets/images/icons/arrow-down.png";

const ERROR_MESSAGE_MAP = {
  "The given data was invalid.": "popup-registration-error-invalid-data",
  "Signature verification failed.":
    "popup-registration-error-signature-verification",
  "The email format is incorrect.": "popup-registration-error-email-format",
  "The email has already been taken.": "popup-registration-error-email-taken",
  "The user in black list.": "popup-registration-error-blacklisted",
  "Referral code error.":
    "popup-registratioThe email format is incorrect.n-error-referral-code",
  "User registration failed.": "popup-registration-error-registration-failed",
  "The password format is incorrect， include both Numbers and letters.":
    "popup-registration-error-password-format",
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
  const countryOptionsRef = useRef(null);
  const codeOptionsRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSentSuccessful, setIsSentSuccessful] = useState(null);
  const API_URL = process.env.GATSBY_OQTIMA_API_URL;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { clientConfig } = useContext(ClientResolverContext);
  const { selectedLanguage } = useContext(LanguageContext);
  const languageCode = PORTAL_LANGUAGES_MAP[selectedLanguage.id];
  const referral_type = params.referral_type;
  const referral_value = params.referral_value;

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

  useEffect(() => {
    const fetchPolicyLinks = async () => {
      try {
        const response = await axios.get(`${API_URL}crm-register/policy-links`);
        const { privacy_policy, cookie_policy } = response.data;

        const privacyLink =
          privacy_policy.find((p) => p.language === languageCode)?.oss_url ||
          privacy_policy.find((p) => p.language === "en")?.oss_url;

        const cookieLink =
          cookie_policy.find((c) => c.language === languageCode)?.oss_url ||
          cookie_policy.find((c) => c.language === "en")?.oss_url;

        setPolicyLinks({
          privacyPolicy: privacyLink,
          cookiePolicy: cookieLink,
        });
      } catch (error) {
        // console.error("Error fetching policy links:", error);
        sendLog({ message: error.message, type: error.name });
      }
    };

    fetchPolicyLinks();
  }, [languageCode]);

  const filteredCountries = useMemo(() => {
    if (!searchCountry) return countries;
    const searchTerm = searchCountry.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm)
    );
  }, [searchCountry]);

  const handleApiResponse = (isSuccessful, message = "") => {
    setIsSentSuccessful(isSuccessful);
    const translationKey = ERROR_MESSAGE_MAP[message];
    if (translationKey) {
      setErrorMessage(t(translationKey));
    } else {
      setErrorMessage(message);
    }
  };

  const handleRegistrationtForm = async (values) => {
    const token = await executeRecaptcha("popup_registration");
    const referralTypeValue = referral_type || referral_value;

    try {
      const response = await axios.post(`${API_URL}crm-register`, {
        ...values,
        token,
        language: languageCode,
        redirect: "register",
        register_ip: clientConfig.ipAddress,
        agreement: true,
        privacy: policyLinks.privacyPolicy,
        cookie: policyLinks.cookiePolicy,
        ...(referralTypeValue ? { referral_type, referral_value } : {}),
      });

      if (response.data.code && response.data.code !== 200) {
        handleApiResponse(false, response.data.message);
      } else {
        handleApiResponse(true);

        const redirectAddress = response.data.redirect_address;
        if (redirectAddress) {
          window.location.href = redirectAddress;
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      sendLog({ message: error.message, type: error.name });
      handleApiResponse(false, errorMessage);
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
            className="popup-registration__form"
            noValidate
          >
            {/* Name Fields */}
            <div className="name-fields">
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
            <div className="popup-registration__row">
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
            <div className="popup-registration__row">
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
            <div className="popup-registration__newsletter">
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
            <div className="popup-registration__consent">
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
                    >
                      Privacy Policy
                    </a>
                    and
                    <a
                      href={policyLinks.cookiePolicy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
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

            {/* Error Message - Only for API errors */}
            {errorMessage && (
              <p
                className="popup-registration-error-message"
                style={{ color: "red" }}
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
