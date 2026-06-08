import { useEffect, useState, useCallback, startTransition } from "react";
import { WINDOW_SIZE_MD, WINDOW_SIZE_LG, WINDOW_SIZE_XL } from "../constants";
import {
  DESKTOP_LG_VIEWPORT_MQ,
  MOBILE_VIEWPORT_MQ,
  readViewportSizeFromMedia,
} from "../viewport-media";
import { isMarketingHomePath } from "../is-marketing-home-path";

// Initial state must be identical on server and client to avoid hydration mismatch #418.
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  const [didActivate, setDidActivate] = useState(false);

  const syncFromMedia = useCallback(() => {
    if (typeof window === "undefined") return;
    startTransition(() => setWindowSize(readViewportSizeFromMedia()));
  }, []);

  // Post-hydration sync only — useLayoutEffect here caused React #421 on homepage Suspense.
  useEffect(() => {
    if (typeof window === "undefined") return;
    startTransition(() => {
      setWindowSize(readViewportSizeFromMedia());
      setDidActivate(true);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let cancelled = false;
    let activated = false;
    let fallbackId;
    let mobileMq;
    let desktopMq;
    let onMediaChange;
    let onReady;

    const activate = () => {
      if (cancelled || activated) return;
      activated = true;

      setTimeout(() => {
        if (cancelled) return;
        mobileMq = window.matchMedia(MOBILE_VIEWPORT_MQ);
        desktopMq = window.matchMedia(DESKTOP_LG_VIEWPORT_MQ);
        onMediaChange = () => syncFromMedia();
        mobileMq.addEventListener("change", onMediaChange);
        desktopMq.addEventListener("change", onMediaChange);

        requestAnimationFrame(() => {
          if (cancelled) return;
          setDidActivate(true);
          syncFromMedia();
        });
      }, 20);
    };

    const path = window.location?.pathname || "";
    if (!isMarketingHomePath(path)) {
      activate();
    } else {
      onReady = () => activate();
      window.addEventListener("belowHeroContentReady", onReady, { once: true });
      fallbackId = setTimeout(activate, 6500);
    }

    return () => {
      cancelled = true;
      if (onReady) {
        window.removeEventListener("belowHeroContentReady", onReady);
      }
      if (fallbackId) clearTimeout(fallbackId);
      if (onMediaChange && mobileMq) {
        mobileMq.removeEventListener("change", onMediaChange);
      }
      if (onMediaChange && desktopMq) {
        desktopMq.removeEventListener("change", onMediaChange);
      }
    };
  }, [syncFromMedia]);

  const width = windowSize.width;
  const height = windowSize.height;
  const hasSize = didActivate && width !== undefined;

  const isMobile = hasSize ? width < WINDOW_SIZE_MD : false;

  return {
    width,
    height,
    isMobile,
    isMD: hasSize && width >= WINDOW_SIZE_MD && width < WINDOW_SIZE_LG,
    isTablet: hasSize ? width < WINDOW_SIZE_LG : false,
    isDesktop: hasSize ? width >= WINDOW_SIZE_LG : false,
    isLG: hasSize && width >= WINDOW_SIZE_LG && width < WINDOW_SIZE_XL,
    isXL: hasSize ? width >= WINDOW_SIZE_XL : false,
    didActivate,
  };
};
