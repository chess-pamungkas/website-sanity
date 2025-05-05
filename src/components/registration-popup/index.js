import React, { useState } from "react";
import PropTypes from "prop-types";
import PopupRegistration from "../shared/popup-registration";

const RegistrationPopup = ({ isOpen, onClose, params }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(isOpen); // Manage the popup state

  // Optional: Parse params back to an object if needed
  const parsedParams = params ? JSON.parse(params) : {};

  const handleClose = () => {
    setIsPopupOpen(false);
    onClose(); // Call the onClose function passed as a prop
  };

  return (
    <>
      {/* Render the PopupRegistration component */}
      <PopupRegistration
        isOpen={isPopupOpen}
        onClose={handleClose}
        params={parsedParams} // Pass the parsed params to PopupRegistration
      />
    </>
  );
};

RegistrationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure isOpen is passed as a prop
  onClose: PropTypes.func.isRequired, // Ensure onClose is passed as a prop
  params: PropTypes.string, // Keep as optional if it can be omitted
};

export default RegistrationPopup;
