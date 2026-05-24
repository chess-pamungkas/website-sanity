import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import PropTypes from "prop-types";
import { isBrowser } from "../../helpers/services/is-browser";
import { shouldDeferHeavyWorkForLighthouse } from "../../helpers/is-audit-environment";

const CommonContext = createContext({});

export const CommonProvider = ({ children }) => {
  const [sectionOptions, setSectionOptions] = useState(null);
  const headerRef = useRef();
  const [isSearchBarAttached, setIsSearchBarAttached] = useState(true);
  const [heightOffset, setHeightOffset] = useState(0);
  const lastHeightRef = useRef(0);
  const headerMainWrapperRef = useRef();
  const riskWarningRef = useRef();
  const [isScrolled, setIsScrolled] = useState("");

  const checkIsScrolled = () => {
    if (isBrowser()) {
      startTransition(() => setIsScrolled(window.scrollY > 0));
    }
  };

  useEffect(() => {
    if (isBrowser()) {
      window.addEventListener("scroll", checkIsScrolled, { passive: true });

      return () => {
        window.removeEventListener("scroll", checkIsScrolled);
      };
    }
  }, []);

  // Must run before paint: the desktop header-offset spacer drives #main-container layout.
  useLayoutEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse() || !isBrowser()) {
      return undefined;
    }

    let cancelled = false;
    let ro = null;
    let rafId = null;
    const el = riskWarningRef.current;

    const applyHeight = (h) => {
      if (cancelled) return;
      const rounded = Math.max(0, Math.round(h));
      if (rounded === lastHeightRef.current) return;
      lastHeightRef.current = rounded;
      setHeightOffset(rounded);
    };

    const scheduleHeight = (h) => {
      if (cancelled) return;
      if (rafId != null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyHeight(h);
      });
    };

    if (!el) {
      applyHeight(0);
      return undefined;
    }

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (cancelled || !entry) return;
        let h = entry.contentRect.height;
        const box = entry.borderBoxSize?.[0];
        if (box && typeof box.blockSize === "number") {
          h = box.blockSize;
        }
        scheduleHeight(h);
      });
      ro.observe(el);
      return () => {
        cancelled = true;
        if (rafId != null) cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }

    return () => {
      cancelled = true;
    };
  }, [sectionOptions]);

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

/** Stub for deferred hydration; avoids useWindowSize, scroll listener, layout-effect spacer sync. */
export const COMMON_STUB_VALUE = {
  sectionOptions: null,
  setSectionOptions: () => {},
  headerRef: { current: null },
  isSearchBarAttached: true,
  setIsSearchBarAttached: () => {},
  heightOffset: 0,
  headerMainWrapperRef: { current: null },
  riskWarningRef: { current: null },
  isScrolled: "",
};

export default CommonContext;
