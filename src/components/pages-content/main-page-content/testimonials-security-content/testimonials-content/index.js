import React from "react";
import { useTranslationWithVariables } from "../../../../../helpers/hooks/use-translation-with-vars";
import UAEIcon from "../../../../../assets/images/icons/main-page/testimonials/uae.svg";
import MexicoIcon from "../../../../../assets/images/icons/main-page/testimonials/mexico.svg";
import SouthAfricaIcon from "../../../../../assets/images/icons/main-page/testimonials/south-africa.svg";
import TestimonialsIcon from "../../../../../assets/images/icons/main-page/testimonials/testimonials.svg";

const TestimonialsContent = () => {
  const { t } = useTranslationWithVariables();

  const testimonials = [
    {
      text: t("testimonials-content_testimonial1-text"),
      name: t("testimonials-content_testimonial1-name"),
      countryIcon: UAEIcon,
    },
    {
      text: t("testimonials-content_testimonial2-text"),
      name: t("testimonials-content_testimonial2-name"),
      countryIcon: MexicoIcon,
    },
    {
      text: t("testimonials-content_testimonial3-text"),
      name: t("testimonials-content_testimonial3-name"),
      countryIcon: SouthAfricaIcon,
    },
  ];

  return (
    <div className="testimonials-content">
      {testimonials.map((item, idx) => (
        <div className="testimonial-card" key={idx}>
          <div className="testimonial-text">{item.text}</div>
          <div className="testimonial-footer">
            <span className="badge">
              <img
                src={TestimonialsIcon}
                alt={t("testimonials-content_badge-icon-alt")}
                width={24}
                height={24}
              />
              {t("testimonials-content_badge-text")}
            </span>
            <span className="name-country">
              <span className="name">{item.name}</span>
              <img
                src={item.countryIcon}
                alt={t("testimonials-content_country-icon-alt")}
                className="country-icon"
                width={24}
                height={24}
              />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsContent;
