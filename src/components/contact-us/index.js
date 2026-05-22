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

// Import icons
import { BadgeSecurityIcon as BadgeIcon } from "../shared/shared-icons";
import EmailIcon from "../../assets/images/icons/contact-us/email.svg";
import PhoneIcon from "../../assets/images/icons/contact-us/phone.svg";
import AddressIcon from "../../assets/images/icons/contact-us/address.svg";

const ContactUs = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const email = getContactEmail();
  const phone = getContactPhone();

  return (
    <section
      className={cn("contact-us-content-section", className, {
        "contact-us-content-section--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="contact-us-content-section__container">
        {/* Left Section - Content */}
        <div className="contact-us__content">
          {/* Badge */}
          <div className="contact-us__page-badge-group">
            <div className="contact-us__page-badge-content">
              <img
                src={BadgeIcon}
                alt="Icon"
                className="contact-us__page-badge-icon"
              />
              <span className="contact-us__page-badge-message">
                {t("contact-us_badge-text-trade-the-next-level")}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="contact-us__title">{t("contact-us_page-title")}</h2>

          {/* Subtitle */}
          <p className="contact-us__subtitle">{t("contact-us_page-text")}</p>

          {/* Contact Information */}
          <div className="contact-us__info">
            {/* Email */}
            <div className="contact-us__info-item">
              <div className="contact-us__info-icon">
                <img src={EmailIcon} alt="Email" width={24} height={24} />
              </div>
              <div className="contact-us__info-content">
                <h3 className="contact-us__info-title">
                  {t("contact-us_email")}
                </h3>
                <a className="contact-us__info-link" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="contact-us__info-item">
              <div className="contact-us__info-icon">
                <img src={PhoneIcon} alt="Phone" width={24} height={24} />
              </div>
              <div className="contact-us__info-content">
                <h3 className="contact-us__info-title">
                  {t("contact-us_phone")}
                </h3>
                <a className="contact-us__info-link" href={`tel:${phone}`}>
                  +{phone}
                </a>
                <a
                  className="contact-us__info-link"
                  href={`tel:${CONTACT_PHONE_FSA_2}`}
                >
                  +{CONTACT_PHONE_FSA_2}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="contact-us__info-item">
              <div className="contact-us__info-icon">
                <img src={AddressIcon} alt="Address" width={24} height={24} />
              </div>
              <div className="contact-us__info-content">
                <h3 className="contact-us__info-title">
                  {t("contact-us_address")}
                </h3>
                <p className="contact-us__info-text">
                  {t("contact-us_address_result")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div id="contact-us__form-section" className="contact-us__form-section">
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
