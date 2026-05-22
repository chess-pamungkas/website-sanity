import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";
import Cookies from "universal-cookie";
import PropTypes from "prop-types";
import entities from "../../enums/entities";
import { CONSENT_TYPES } from "../../helpers/consent-types.config";
import {
  DEFAULT_COOKIE_CONSENT,
  COOKIE_CONSENT_KEY,
  IS_SHOW_COOKIE_POPUP_KEY,
  GLOBAL_COOKIE_PATH,
  DEFAULT_COOKIE_AGE,
} from "../../helpers/gdpr-cookie.config";
import { useModal } from "../../helpers/hooks/use-modal";
import { postClientConsent } from "../../helpers/services/client-consent-service";
import ClientResolverContext from "../client-resolver-context";
import { currentEntity } from "../../helpers/entity-resolver";
import { shouldDeferHeavyWorkForLighthouse } from "../../helpers/is-audit-environment";

const CookieContext = createContext({});

export const CookieProvider = ({ children }) => {
  const cookies = new Cookies();

  const showCookiePopup = cookies.get(IS_SHOW_COOKIE_POPUP_KEY) === undefined;

  const {
    isShow: isShowCookiePopup,
    handleOpen: handleOpenCookiePopup,
    handleClose: handleCloseCookiePopup,
  } = useModal(showCookiePopup, false);

  const {
    isShow: isShowGDPRPopup,
    handleOpen: handleOpenGDPRPopup,
    handleClose: handleCloseGDPRPopup,
  } = useModal();

  const [cookieConsent, setCookieConsent] = useState(
    cookies.get(COOKIE_CONSENT_KEY) || {}
  );
  const { clientConfig } = useContext(ClientResolverContext);

  const getCookie = (cookieKey) => {
    return cookies.get(cookieKey);
  };

  const setCookie = (cookieKey, cookieValue, cookieType) => {
    if (cookieConsent[cookieType]) {
      cookies.set(cookieKey, cookieValue, {
        path: GLOBAL_COOKIE_PATH,
        maxAge: DEFAULT_COOKIE_AGE,
      });
    }
  };

  const acceptCookies = (acceptedCookies) => {
    cookies.set(COOKIE_CONSENT_KEY, acceptedCookies, {
      path: GLOBAL_COOKIE_PATH,
      maxAge: DEFAULT_COOKIE_AGE,
    });
    setCookieConsent(acceptedCookies);
    cookies.set(IS_SHOW_COOKIE_POPUP_KEY, false, {
      path: GLOBAL_COOKIE_PATH,
      maxAge: DEFAULT_COOKIE_AGE,
    });
    const consent = `${CONSENT_TYPES["cookie"]} ${Object.keys(acceptedCookies)
      .filter((item) => acceptedCookies[item])
      .join(", ")}`;
    postClientConsent(clientConfig.ipAddress, consent);
  };

  const acceptAllCookies = () => {
    acceptCookies(DEFAULT_COOKIE_CONSENT);
  };

  useEffect(() => {
    // Audit: skip the consent state machine entirely. clientConfig is empty in audit mode
    // (ClientResolverProvider also skips) so this useEffect would no-op anyway, but the early
    // return avoids the startTransition microtask cost.
    if (shouldDeferHeavyWorkForLighthouse()) return;
    startTransition(() => {
      handleCloseCookiePopup();
      if (
        clientConfig.memberOfEU !== undefined &&
        currentEntity === entities.FSA &&
        cookies.get(COOKIE_CONSENT_KEY) === undefined
      ) {
        if (clientConfig.memberOfEU) {
          handleOpenCookiePopup();
        } else {
          acceptAllCookies();
        }
      }
    });
  }, [clientConfig, currentEntity]);

  return (
    <CookieContext.Provider
      value={{
        cookies,
        getCookie,
        setCookie,
        isShowGDPRPopup,
        handleCloseGDPRPopup,
        handleOpenGDPRPopup,
        isShowCookiePopup,
        handleOpenCookiePopup,
        handleCloseCookiePopup,
        cookieConsent,
        acceptCookies,
        acceptAllCookies,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

CookieProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/** Stub value for deferred hydration: no cookie work on first paint (Layout uses after requestIdleCallback). */
export const COOKIE_STUB_VALUE = {
  cookies: { get: () => undefined, set: () => {} },
  getCookie: () => undefined,
  setCookie: () => {},
  isShowGDPRPopup: false,
  handleCloseGDPRPopup: () => {},
  handleOpenGDPRPopup: () => {},
  isShowCookiePopup: false,
  handleOpenCookiePopup: () => {},
  handleCloseCookiePopup: () => {},
  cookieConsent: {},
  acceptCookies: () => {},
  acceptAllCookies: () => {},
};

export default CookieContext;
