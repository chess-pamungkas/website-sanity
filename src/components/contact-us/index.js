import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import {
  DIR_LTR,
  DIR_RTL,
  getContactPhone,
  getContactEmail,
  CONTACT_PHONE_FSA_2,
} from "../../helpers/constants";
import ContactUsForm from "./components/contact-us-form";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";

const ContactUs = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const email = getContactEmail();
  const phone = getContactPhone();

  return (
    <section
      className={cn("contact-us", className, {
        "contact-us--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="contact-us__wrapper">
        <div className="contact-us__block">
          <h2 className="contact-us__title">{t("contact-us_page-title")}</h2>
          <p className="contact-us__text">{t("contact-us_page-text")}</p>
          <div className="contact-us__contact-block">
            <p className="contact-us__contact-block-title">
              {t("contact-us_email")}
            </p>
            <a
              className="contact-us__contact-block-href"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </div>
          <div className="contact-us__contact-block">
            <p className="contact-us__contact-block-title">
              {t("contact-us_phone")}
            </p>
            <a className="contact-us__contact-block-href" href={`tel:${phone}`}>
              {`+${phone}`}
            </a>
            <a
              className="contact-us__contact-block-href"
              href={`tel:${CONTACT_PHONE_FSA_2}`}
            >
              {`+${CONTACT_PHONE_FSA_2}`}
            </a>
          </div>
          <div className="contact-us__contact-block">
            <p className="contact-us__contact-block-title">
              {t("contact-us_address")}
            </p>
            <p className="contact-us__contact-block-text">
              {t("contact-us_address_result")}
            </p>
          </div>
        </div>
        <div className="contact-us__block">
          <ContactUsForm />
        </div>
      </div>
    </section>
  );
};

ContactUs.propTypes = {
  className: PropTypes.string,
};

export default ContactUs;
