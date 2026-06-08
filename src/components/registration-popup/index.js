import React, { useMemo } from "react";
import PropTypes from "prop-types";
import PopupRegistration from "../shared/popup-registration";

const RegistrationPopup = ({ isOpen, onClose, params }) => {
  const parsedParams = useMemo(() => {
    if (!params) return {};
    try {
      return typeof params === "string" ? JSON.parse(params) : params;
    } catch {
      return {};
    }
  }, [params]);

  if (!isOpen) return null;

  return (
    <PopupRegistration
      isOpen={isOpen}
      onClose={onClose}
      params={parsedParams}
    />
  );
};

RegistrationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  params: PropTypes.string,
};

export default RegistrationPopup;
