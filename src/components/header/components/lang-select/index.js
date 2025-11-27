import React, { useContext } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { ChevronDownIcon, ChevronUpIcon } from "../../../shared/icons";
import { useModal } from "../../../../helpers/hooks/use-modal";
import LanguageContext from "../../../../context/language-context";
import Popup from "../../../shared/popup";
import LangOptions from "../lang-options";

const LangSelect = ({ className, isHeader = false, setIsLangPopupOpened }) => {
  const {
    selectedLanguage,
    selectedLanguage: { icon: Icon } = {},
    setSelectedLanguage,
  } = useContext(LanguageContext);
  const { isShow, handleOpen, handleClose } = useModal();

  const closePopup = () => {
    setIsLangPopupOpened?.(false);
    handleClose();
  };

  const onLangSelect = (selected) => {
    setSelectedLanguage(selected);
    // Close popup after a short delay to allow the Link navigation to complete
    setTimeout(() => {
      closePopup();
    }, 100);
  };

  return (
    <>
      <button
        className={cn(
          "lang-select",
          { "lang-select--active": isShow },
          className
        )}
        type="button"
        onClick={() => {
          handleOpen();
          setIsLangPopupOpened?.(true);
        }}
        style={{ display: "flex", alignItems: "center" }}
      >
        {Icon && <Icon className="lang-select__flag" />}

        {isHeader && (
          <span className="lang-select__title">{selectedLanguage.id}</span>
        )}

        <span className="lang-select__icon-wrapper">
          <ChevronDownIcon
            className={cn("lang-select__icon", "lang-select__icon--down", {
              rotated: isShow,
            })}
            color="#000000"
          />
        </span>
      </button>

      <Popup isPopupOpen={isShow} handlePopupClose={closePopup}>
        <LangOptions
          selectedLanguage={selectedLanguage}
          languageSelectHandler={onLangSelect}
          onClose={closePopup}
        />
      </Popup>
    </>
  );
};

LangSelect.propTypes = {
  className: PropTypes.string,
  isHeader: PropTypes.bool,
  setIsLangPopupOpened: PropTypes.func,
};
export default LangSelect;
