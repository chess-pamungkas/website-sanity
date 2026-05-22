import React from "react";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import {
  BadgeSecurityIcon,
  CircleMarkIcon,
} from "../../../shared/shared-icons";
import InfrastructureIcon from "../../../../assets/images/icons/main-page/technology-infrastructure/infrastructure.svg";
import TradingPlatformsIcon from "../../../../assets/images/icons/main-page/technology-infrastructure/trading-platforms.svg";
import AdvancedToolsIcon from "../../../../assets/images/icons/main-page/technology-infrastructure/advanced-tools.svg";

const TechnologyInfrastructureContent = () => {
  const { isMobile } = useWindowSize();
  const { t } = useTranslationWithVariables();

  const features = [
    {
      icon: InfrastructureIcon,
      title: t("technology-infrastructure_infrastructure-title"),
      features: [
        t("technology-infrastructure_infrastructure-feature1"),
        t("technology-infrastructure_infrastructure-feature2"),
        t("technology-infrastructure_infrastructure-feature3"),
        t("technology-infrastructure_infrastructure-feature4"),
        t("technology-infrastructure_infrastructure-feature5"),
      ],
    },
    {
      icon: TradingPlatformsIcon,
      title: t("technology-infrastructure_trading-platforms-title"),
      features: [
        t("technology-infrastructure_trading-platforms-feature1"),
        t("technology-infrastructure_trading-platforms-feature2"),
        t("technology-infrastructure_trading-platforms-feature3"),
        t("technology-infrastructure_trading-platforms-feature4"),
        t("technology-infrastructure_trading-platforms-feature5"),
      ],
    },
    {
      icon: AdvancedToolsIcon,
      title: t("technology-infrastructure_advanced-tools-title"),
      features: [
        t("technology-infrastructure_advanced-tools-feature1"),
        t("technology-infrastructure_advanced-tools-feature2"),
        t("technology-infrastructure_advanced-tools-feature3"),
        t("technology-infrastructure_advanced-tools-feature4"),
        t("technology-infrastructure_advanced-tools-feature5"),
      ],
    },
  ];

  return (
    <section className="technology-infrastructure-content">
      <div className="technology-infrastructure-content__container">
        {/* Header Section */}
        <div className="technology-infrastructure-content__header">
          {/* Badge */}
          <div className="technology-infrastructure-content__badge-group">
            <div className="technology-infrastructure-content__badge-content">
              <div className="technology-infrastructure-content__badge-icon-wrapper">
                <img
                  src={BadgeSecurityIcon}
                  alt={t("technology-infrastructure_badge-icon-alt")}
                  className="technology-infrastructure-content__badge-icon"
                  width={24}
                  height={24}
                />
              </div>
              <span className="technology-infrastructure-content__badge-message">
                {t("technology-infrastructure_badge-text")}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h2 className="technology-infrastructure-content__title">
            {t("technology-infrastructure_title")}
          </h2>

          {/* Subtitle */}
          <p className="technology-infrastructure-content__subtitle">
            {t("technology-infrastructure_subtitle")}
          </p>
        </div>

        {/* Features Cards */}
        <div className="technology-infrastructure-content__cards">
          {features.map((feature, index) => (
            <div
              key={index}
              className="technology-infrastructure-content__card"
            >
              {/* Card Icon */}
              <div className="technology-infrastructure-content__card-icon">
                <img src={feature.icon} alt={feature.title} width={24} height={24} />
              </div>

              {/* Card Title */}
              <h3 className="technology-infrastructure-content__card-title">
                {feature.title}
              </h3>

              {/* Card Features List */}
              <ul className="technology-infrastructure-content__card-features">
                {feature.features.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="technology-infrastructure-content__card-feature"
                  >
                    <img
                      src={CircleMarkIcon}
                      alt={t("technology-infrastructure_check-icon-alt")}
                      className="technology-infrastructure-content__feature-icon"
                      width={16}
                      height={17}
                    />
                    <span className="technology-infrastructure-content__feature-text">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyInfrastructureContent;
