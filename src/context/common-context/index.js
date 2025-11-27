import React, {
  useContext,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import { isBrowser } from "../../helpers/services/is-browser";
import LanguageContext from "../language-context";

const CommonContext = createContext({});

export const CommonProvider = ({ children }) => {
  const { width } = useWindowSize();
  const [sectionOptions, setSectionOptions] = useState(null);
  const headerRef = useRef();
  const [isSearchBarAttached, setIsSearchBarAttached] = useState(true);
  const [heightOffset, setHeightOffset] = useState(0);
  const [dropdownHeightOffset, setDropdownHeightOffset] = useState(0);
  const { selectedLanguage } = useContext(LanguageContext);
  const headerMainWrapperRef = useRef();
  const riskWarningRef = useRef();
  const [isScrolled, setIsScrolled] = useState("");

  const checkIsScrolled = () => {
    if (isBrowser()) {
      setIsScrolled(window.scrollY > 0);
    }
  };

  useEffect(() => {
    if (isBrowser()) {
      window.addEventListener("scroll", checkIsScrolled);

      return () => {
        window.removeEventListener("scroll", checkIsScrolled);
      };
    }
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      if (isBrowser()) {
        setHeightOffset(riskWarningRef?.current?.offsetHeight || 0);
      }
    };

    const updateDropdownOffset = () => {
      if (isBrowser() && headerMainWrapperRef?.current?.offsetTop) {
        setDropdownHeightOffset(
          headerMainWrapperRef.current.offsetTop +
            headerMainWrapperRef.current.offsetHeight
        );
      }
    };

    // workaround to actually update offset, doesn't work without timeout
    setTimeout(() => {
      updateOffset();
    }, 100);

    // We should do this after header transition (0.4s) ends
    setTimeout(() => {
      updateDropdownOffset();
    }, 500);
  }, [
    headerRef,
    sectionOptions,
    width,
    selectedLanguage,
    isScrolled,
    riskWarningRef,
  ]);

  return (
    <CommonContext.Provider
      value={{
        sectionOptions,
        setSectionOptions,
        headerRef,
        isSearchBarAttached,
        setIsSearchBarAttached,
        heightOffset,
        headerMainWrapperRef,
        dropdownHeightOffset,
        isScrolled,
        riskWarningRef,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

CommonProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CommonContext;
