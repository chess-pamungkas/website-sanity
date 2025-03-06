import React from "react";
import ReactDOM from "react-dom";
import cn from "classnames";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { currentEntity } from "../../../helpers/entity-resolver";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import bulletImage from "../../../assets/images/icons/bullet.png";
import closemage from "../../../assets/images/icons/close-icon.svg";
import PopupRegistrationForm from "./components/popup-registration-form";

const benefitsConfig = [
  { label: "popup-registration-benefits-pips", entities: ["CYSEC", "FSA"] },
  { label: "popup-registration-benefits-commissions", entities: ["FSA"] },
  { label: "popup-registration-benefits-currenciesFSA", entities: ["FSA"] },
  {
    label: "popup-registration-benefits-verification",
    entities: ["CYSEC", "FSA"],
  },
  { label: "popup-registration-benefits-depositMethodsFSA", entities: ["FSA"] },
  {
    label: "popup-registration-benefits-transfers",
    entities: ["CYSEC", "FSA"],
  },
  {
    label: "popup-registration-benefits-diversificationFSA",
    entities: ["FSA"],
  },
  {
    label: "popup-registration-benefits-diversificationCYSEC",
    entities: ["CYSEC"],
  },
  {
    label: "popup-registration-benefits-connection",
    entities: ["CYSEC", "FSA"],
  },
  {
    label: "popup-registration-benefits-liquidity",
    entities: ["CYSEC", "FSA"],
  },
  { label: "popup-registration-benefits-ecn", entities: ["CYSEC", "FSA"] },
  { label: "popup-registration-benefits-productsCYSEC", entities: ["CYSEC"] },
  { label: "popup-registration-benefits-devices", entities: ["CYSEC", "FSA"] },
  { label: "popup-registration-benefits-toolsFSA", entities: ["FSA"] },
  { label: "popup-registration-benefits-toolsCYSEC", entities: ["CYSEC"] },
  { label: "popup-registration-benefits-currenciesCYSEC", entities: ["CYSEC"] },
  { label: "popup-registration-benefits-serviceFSA", entities: ["FSA"] },
  { label: "popup-registration-benefits-serviceCYSEC", entities: ["CYSEC"] },
];

const PopupRegistration = ({ isOpen, onClose, className, params }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const { isMobile } = useWindowSize();

  if (!isOpen) return null;

  const benefits = benefitsConfig.filter(({ entities }) =>
    entities.includes(currentEntity)
  );

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const popupContent = (
    <div
      className={cn("popup-registration", {
        "popup-registration--rtl": isRTL,
        "popup-registration--active": isOpen,
      })}
    >
      <div className="popup-registration__wrapper">
        <div
          className={cn("popup-registration__container", className, {
            "popup-registration__container--rtl": isRTL,
          })}
        >
          <div
            className={cn("popup-registration__sidebar", className, {
              "popup-registration__sidebar--rtl": isRTL,
            })}
          >
            {(isRTL ||
              isMobile ||
              window.matchMedia("(orientation: landscape)").matches) && (
              <img
                src={closemage}
                alt="Close"
                className={cn(
                  isRTL
                    ? "popup-registration__sidebar--rtl__close--rtl"
                    : "popup-registration__sidebar__close-mobile",
                  className
                )}
                onClick={handleClose}
              />
            )}
            <div className="sidebar-area">
              <div
                className={cn("popup-registration__sidebar__title", className, {
                  "popup-registration__sidebar--rtl__title--rtl": isRTL,
                })}
              >
                <Trans i18nKey="popup-registration-title" ns="index">
                  <span className="normal-text">Embark on the</span>
                  <span className="highlighted">
                    <span className="white-text">OQTIMA Trading</span>
                    <span className="journey">Journey</span>
                  </span>
                </Trans>
              </div>
              {/* <div className="benefits-container">
                {benefits.map(({ label }, index) => (
                  <div key={`${label}-${index}`} className="benefits-item">
                    <Bullet />
                    <span>{t(label)}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
          <div
            className={cn("popup-registration__content", className, {
              "popup-registration__content--rtl": isRTL,
            })}
          >
            {!isRTL && !isMobile && (
              <img
                src={closemage}
                alt="Close"
                className="popup-registration__close"
                onClick={handleClose}
              />
            )}
            <h1
              className={cn("popup-registration-register", className, {
                "popup-registration-register--rtl": isRTL,
              })}
            >
              {t("popup-registration-register")}
            </h1>
            <PopupRegistrationForm params={params} />
            <div className="risk-warning-container">
              <div className="risk-warning-content">
                <p className="risk-warning-text">
                  {t("popup-registration-riskWarning")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(popupContent, document.body);
};

const Bullet = () => {
  return (
    <img
      src={bulletImage}
      alt="Bullet"
      style={{ width: "10px", height: "10px" }}
      className="object-cover"
    />
  );
};

PopupRegistration.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopupRegistration;
