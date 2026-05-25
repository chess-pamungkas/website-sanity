import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const RegistrationPopupContext = createContext(null);

export const RegistrationPopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, setIsOpen }),
    [isOpen, open, close]
  );

  return (
    <RegistrationPopupContext.Provider value={value}>
      {children}
    </RegistrationPopupContext.Provider>
  );
};

RegistrationPopupProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRegistrationPopup = () => {
  const ctx = useContext(RegistrationPopupContext);
  if (!ctx) {
    throw new Error(
      "useRegistrationPopup must be used within RegistrationPopupProvider"
    );
  }
  return ctx;
};

/** Optional hook for components that may render outside the provider (stubs). */
export const useRegistrationPopupOptional = () =>
  useContext(RegistrationPopupContext);

export default RegistrationPopupContext;
