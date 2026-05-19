import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import CopyRightBlock from "./components/copy-right-block";
import { LogoTextMain } from "../shared/icons/critical";
import { getFooterText } from "../../helpers/footer.config";
import Menu from "./components/menu";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import LinkedInIcon from "../../assets/images/icons/linkedin.svg";
import FacebookIcon from "../../assets/images/icons/facebook.svg";
import InstagramIcon from "../../assets/images/icons/instagram.svg";
import YoutubeIcon from "../../assets/images/icons/youtube.svg";
import AppStoreIcon from "../../assets/images/icons/app-store.svg";
import GooglePlayIcon from "../../assets/images/icons/google-play.svg";

const Footer = ({ className }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const { isTablet, isMobile } = useWindowSize();

  return (
    <footer
      className={cn("footer", className, {
        "footer--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div
        className={cn("container", {
          "container--no-padding": !isMobile && !isTablet,
        })}
      >
        <div className="footer__wrapper">
          <div className="footer__left">
            <div className="footer__logo-wrapper">
              <LogoTextMain />
            </div>
            <p className="footer__text">{t(getFooterText())}</p>
            <div className="footer__social-icons">
              <a
                href="https://www.linkedin.com/company/oqtimatrading"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={LinkedInIcon} alt="LinkedIn" width={24} height={24} />
              </a>
              <a
                href="https://www.facebook.com/OQtima.Global/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={FacebookIcon} alt="Facebook" width={24} height={24} />
              </a>
              <a
                href="https://www.instagram.com/oqtima.global/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={InstagramIcon} alt="Instagram" width={24} height={24} />
              </a>
              <a
                href="https://www.youtube.com/@OQtima"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={YoutubeIcon} alt="YouTube" width={24} height={24} />
              </a>
            </div>
            {/* <div className="footer__app-badges">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={AppStoreIcon} alt="App Store" width={24} height={24} />
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={GooglePlayIcon} alt="Google Play" width={24} height={24} />
              </a>
            </div> */}
          </div>
          <div className="footer__menu-wrapper">
            <Menu />
          </div>
        </div>
      </div>
      <CopyRightBlock />
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};
export default Footer;
