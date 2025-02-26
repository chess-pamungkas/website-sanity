import { object, string, boolean } from "yup";
import { emailRegex, textRegex } from "./regex";

export const PopupRegistrationSchema = object().shape({
  first_name: string()
    .matches(textRegex, "popup-registration-name-invalid")
    .required("popup-registration-firstName-required")
    .trim(),
  last_name: string()
    .matches(textRegex, "popup-registration-name-invalid")
    .required("popup-registration-lastName-required")
    .trim(),
  email: string()
    .matches(emailRegex, "popup-registration-email-invalid")
    .required("popup-registration-email-required"),
  country: string().required("popup-registration-countryOfResidence-required"),
  country_code: string().required("popup-registration-countryCode-required"),
  mobile: string()
    .matches(/^\d+$/, "popup-registration-phoneNumber-numbers-only")
    .min(7, "popup-registration-phoneNumber-invalid")
    .required("popup-registration-phoneNumber-required"),
  agreement: boolean()
    .oneOf([true], "popup-registration-agreement-required")
    .required("popup-registration-agreement-required"),
});
