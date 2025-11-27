import { object, string } from "yup";
import { emailRegex, textRegex } from "./regex";

export const ContactUsSchema = object().shape({
  fullName: string()
    .required("contact-us_form_error_message_required")
    .matches(textRegex, "contact-us_form_error_message_invalid_fullname")
    .trim(),
  email: string()
    .required("contact-us_form_error_message_required")
    .matches(emailRegex, "contact-us_form_error_message_invalid_email")
    .trim(),
  subject: string().required("contact-us_form_error_message_required").trim(),
  message: string().required("contact-us_form_error_message_required").trim(),
});
