import { useEffect, useState, useCallback, startTransition } from "react";
import { WINDOW_SIZE_MD, WINDOW_SIZE_LG, WINDOW_SIZE_XL } from "../constants";

// Initial state must be identical on server and client to avoid hydration mismatch #418.
// We use undefined and set real size in useEffect so first render is consistent.
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  const [didActivate, setDidActivate] = useState(false);

  const handleResize = useCallback(() => {
    requestAnimationFrame(() => {
      if (typeof window === "undefined") return;
      startTransition(() =>
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      );
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let cancelled = false;
    let activated = false;
    let fallbackId;

    const activate = () => {
      if (cancelled || activated) return;
      activated = true;
      window.addEventListener("resize", handleResize);
      // Defer innerWidth reads to the next animation frame so we do not invoke a forced
      // synchronous layout flush in the same turn as hydration / body class/style writes.
      // UA heuristic keeps isMobile stable for ~one frame when guess matches (~all mobile).
      requestAnimationFrame(() => {
        if (cancelled) return;
        setDidActivate(true);
        startTransition(() =>
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        );
      });
    };

    // Marketing homepage emits this when below-hero content becomes ready.
    // We use it as the main trigger to avoid early `innerWidth` reads and resize listeners.
    const onReady = () => activate();
    window.addEventListener("belowHeroContentReady", onReady, { once: true });

    // Safety: if the event never fires (non-home routes, errors), activate after a short delay.
    fallbackId = setTimeout(activate, 6500);

    return () => {
      cancelled = true;
      window.removeEventListener("belowHeroContentReady", onReady);
      if (fallbackId) clearTimeout(fallbackId);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const width = windowSize.width;
  const height = windowSize.height;
  const hasSize = width !== undefined && height !== undefined;

  // Before activation we avoid `innerWidth` reads but still want a decent branch for rendering.
  // Use a cheap UA-based heuristic until real dimensions are populated.
  const uaMobileGuess =
    typeof navigator !== "undefined" &&
    (navigator.userAgentData?.mobile ||
      /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent));

  const isMobile = hasSize ? width < WINDOW_SIZE_MD : !!uaMobileGuess;

  return {
    width,
    height,
    isMobile,
    isMD: hasSize && width >= WINDOW_SIZE_MD && width < WINDOW_SIZE_LG,
    isTablet: hasSize ? width < WINDOW_SIZE_LG : isMobile,
    isDesktop: hasSize ? width >= WINDOW_SIZE_LG : !isMobile,
    isLG: hasSize && width >= WINDOW_SIZE_LG && width < WINDOW_SIZE_XL,
    isXL: hasSize ? width >= WINDOW_SIZE_XL : false,
    didActivate,
  };
};
