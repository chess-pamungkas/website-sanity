import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/Bookmark.scss";
import ButtonPopup from "../shared/button-popup";
import { ShowRegistrationPopup } from "../../helpers/constants";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { setLangParam } from "../../helpers/services/language-service";

function Bookmark() {
  const [isExpanded, setExpanded] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [isBlinking, setBlinking] = useState(true);
  const [isShaking, setShaking] = useState(false);
  const [isClosing, setClosing] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  const bookmarkRef = useRef(null);
  const { t } = useTranslationWithVariables();

  const langParam = setLangParam(); // Get the language parameter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const initiateClosingSequence = () => {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setClosing(true);
      setTimeout(() => {
        setExpanded(false);
        setClosing(false);
        setHasBeenClosed(true);
        setBlinking(false);
      }, 500);
    }, 2000);
  };
  useEffect(() => {
    if (isVisible && !isExpanded && !hasBeenClosed) {
      const autoOpenTimeout = setTimeout(() => {
        setExpanded(true);
        const autoCloseTimeout = setTimeout(initiateClosingSequence, 2000);
        return () => clearTimeout(autoCloseTimeout);
      }, 4000);
      return () => clearTimeout(autoOpenTimeout);
    }
  }, [isVisible, isExpanded, hasBeenClosed]);

  const resetBookmark = () => {
    setExpanded(false);
    setBlinking(true);
    setShaking(false);
    setClosing(false);
    setHasBeenClosed(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const wasVisible = isVisible;
      setVisible(scrollPosition > 100);

      if (wasVisible && scrollPosition <= 100) {
        // Reset states when scrolled back to top
        resetBookmark();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  const handleBookmarkClick = () => {
    if (!isExpanded) {
      setExpanded(true);
      setTimeout(initiateClosingSequence, 1000);
    }
  };

  const bookmarkClass = `${isExpanded ? "expanded" : "closed"} ${
    isVisible ? "" : "hidden"
  }`;
  const buttonClass = `${isShaking ? "shaking" : ""} ${
    isClosing ? "closing" : ""
  }`;

  return (
    <>
      <div
        ref={bookmarkRef}
        className={`bookmark ${bookmarkClass}`}
        onClick={handleBookmarkClick}
      >
        {isExpanded ? (
          <ButtonPopup
            onClick={handleShowRegistrationPopup}
            className={`bookmark-button-link ${buttonClass}`}
          >
            {t("button-sign-up")}
          </ButtonPopup>
        ) : (
          <img
            src={ChevronIcon}
            alt="Chevron"
            className={`text ${isBlinking ? "blinking" : ""}`}
          />
        )}
      </div>

      {/* Render the popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={langParam}
        />
      )}
    </>
  );
}

export default Bookmark;
