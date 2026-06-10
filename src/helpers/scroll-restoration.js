import {
  MOBILE_VIEWPORT_MQ,
  TABLET_VIEWPORT_MQ,
} from "./viewport-media";

const STORAGE_KEY = "oqtima-scroll-positions";

/** Mobile + tablet (below desktop-lg) need longer restore retries while layout hydrates. */
const BELOW_DESKTOP_MQ = `${MOBILE_VIEWPORT_MQ}, ${TABLET_VIEWPORT_MQ}`;

let activePath =
  typeof window !== "undefined" ? window.location.pathname : "/";

const getPathKey = (pathname) => pathname || "/";

const readStore = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeStore = (store) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota / private mode */
  }
};

const getScrollY = () =>
  window.scrollY ||
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  0;

const isBelowDesktopViewport = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(BELOW_DESKTOP_MQ).matches;
};

export const saveScrollPosition = (pathname, scrollY = getScrollY()) => {
  if (typeof window === "undefined" || !pathname) return;
  const store = readStore();
  store[getPathKey(pathname)] = {
    x: window.scrollX || 0,
    y: scrollY,
  };
  writeStore(store);
};

export const getStoredScrollPosition = (pathname) => {
  if (!pathname) return null;
  const entry = readStore()[getPathKey(pathname)];
  if (!entry || typeof entry.y !== "number") return null;
  return [entry.x || 0, entry.y];
};

export const restoreScrollPosition = (pathname) => {
  if (typeof window === "undefined" || !pathname) return undefined;

  const saved = getStoredScrollPosition(pathname);
  if (!saved) return undefined;

  const [targetX, targetY] = saved;
  if (targetY <= 0) return undefined;

  let cancelled = false;
  let attempts = 0;
  const maxAttempts = isBelowDesktopViewport() ? 24 : 12;
  const intervalMs = isBelowDesktopViewport() ? 100 : 75;

  const cancel = () => {
    cancelled = true;
  };

  const apply = () => {
    if (cancelled) return;

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );

    // Page still short (deferred content / bfcache remount) — retry.
    if (maxScroll + 8 < targetY && attempts < maxAttempts) {
      attempts += 1;
      window.setTimeout(apply, intervalMs);
      return;
    }

    window.scrollTo(targetX, Math.min(targetY, maxScroll));

    const currentY = getScrollY();
    if (Math.abs(currentY - targetY) > 4 && attempts < maxAttempts) {
      attempts += 1;
      window.setTimeout(apply, intervalMs);
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(apply);
  });
  window.setTimeout(apply, 0);
  window.setTimeout(apply, 50);
  window.setTimeout(apply, 150);
  window.setTimeout(apply, 350);

  return cancel;
};

export const setActiveScrollPath = (pathname) => {
  if (typeof window === "undefined" || !pathname) return;

  // Only persist when the DOM is still on the page we're leaving. After Gatsby
  // swaps routes, scrollY is already 0 — saving would overwrite the stored back target.
  if (window.location.pathname === activePath) {
    saveScrollPosition(activePath);
  }

  activePath = pathname;
};

/** Persist scroll on scroll + wire bfcache / page hide (Safari + all mobile browsers). */
export const initScrollRestoration = () => {
  if (typeof window === "undefined") return undefined;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  activePath = window.location.pathname;
  let scrollTimer;
  let restoreCancel;

  const persistActiveScroll = () => {
    saveScrollPosition(activePath);
  };

  const onScroll = () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(persistActiveScroll, 120);
  };

  const onPageShow = (event) => {
    if (restoreCancel) restoreCancel();
    restoreCancel = restoreScrollPosition(window.location.pathname);

    if (event.persisted) {
      window.setTimeout(() => {
        if (restoreCancel) restoreCancel();
        restoreCancel = restoreScrollPosition(window.location.pathname);
      }, 0);
    }
  };

  const onPageHide = () => {
    persistActiveScroll();
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      persistActiveScroll();
    }
  };

  const onPopState = () => {
    window.setTimeout(() => {
      if (restoreCancel) restoreCancel();
      restoreCancel = restoreScrollPosition(window.location.pathname);
    }, 0);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pageshow", onPageShow);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("popstate", onPopState);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pageshow", onPageShow);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("popstate", onPopState);
    window.clearTimeout(scrollTimer);
    if (restoreCancel) restoreCancel();
  };
};
