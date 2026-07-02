import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import PropTypes from "prop-types";
import { useIsomorphicLayoutEffect } from "../../helpers/hooks/use-isomorphic-layout-effect";
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
  const complianceBannerRef = useRef();
  const [isScrolled, setIsScrolled] = useState("");

  const checkIsScrolled = () => {
    if (isBrowser()) {
      startTransition(() => setIsScrolled(window.scrollY > 0));
    }
  };

  useEffect(() => {
    if (isBrowser()) {
      checkIsScrolled();
      window.addEventListener("scroll", checkIsScrolled, { passive: true });

      return () => {
        window.removeEventListener("scroll", checkIsScrolled);
      };
    }
  }, []);

  // Must run before paint: the desktop header-offset spacer drives #main-container layout.
  useIsomorphicLayoutEffect(() => {
    if (shouldDeferHeavyWorkForLighthouse() || !isBrowser()) {
      return undefined;
    }

    let cancelled = false;
    let rafId = null;
    let retryId = null;
    const observers = [];

    const measureCombinedHeight = () => {
      const bannerEl = complianceBannerRef.current;
      const stripeEl = riskWarningRef.current;
      const bannerH = bannerEl?.getBoundingClientRect().height ?? 0;
      const stripeH = stripeEl?.getBoundingClientRect().height ?? 0;

      if (isBrowser() && bannerEl) {
        document.documentElement.style.setProperty(
          "--compliance-banner-height",
          `${Math.round(bannerH)}px`
        );
      }

      return bannerH + stripeH;
    };

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

    const observeElement = (el) => {
      if (!el || typeof ResizeObserver === "undefined") return null;

      const observer = new ResizeObserver(() => {
        if (cancelled) return;
        scheduleHeight(measureCombinedHeight());
      });
      observer.observe(el);
      return observer;
    };

    const setupObservers = () => {
      if (cancelled) return;

      const bannerEl = complianceBannerRef.current;
      const stripeEl = riskWarningRef.current;

      if (!bannerEl && !stripeEl) {
        retryId = requestAnimationFrame(setupObservers);
        return;
      }

      scheduleHeight(measureCombinedHeight());

      [observeElement(bannerEl), observeElement(stripeEl)]
        .filter(Boolean)
        .forEach((observer) => observers.push(observer));
    };

    setupObservers();

    return () => {
      cancelled = true;
      if (rafId != null) cancelAnimationFrame(rafId);
      if (retryId != null) cancelAnimationFrame(retryId);
      observers.forEach((observer) => observer.disconnect());
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
        complianceBannerRef,
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
  complianceBannerRef: { current: null },
  isScrolled: "",
};

export default CommonContext;
