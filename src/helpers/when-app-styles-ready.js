/** Dispatched from gatsby-ssr deferred loader after print→all stylesheet flip. */
export const APP_STYLES_READY_CLASS = "app-styles-ready";
export const APP_STYLES_READY_EVENT = "appStylesReady";

const dispatchReady = () => {
  if (typeof document === "undefined") return;
  if (document.documentElement.classList.contains(APP_STYLES_READY_CLASS)) {
    return;
  }
  document.documentElement.classList.add(APP_STYLES_READY_CLASS);
  try {
    window.dispatchEvent(new CustomEvent(APP_STYLES_READY_EVENT));
  } catch (e) {
    /* noop */
  }
};

/** Defer listeners until after style flush (matches inline oqMarkStylesReady). */
export const markAppStylesReady = () => {
  if (typeof window === "undefined") return;
  if (window.__oqStylesReady) return;
  window.__oqStylesReady = 1;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const run = () => dispatchReady();
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(run, { timeout: 200 });
      } else {
        setTimeout(run, 64);
      }
    });
  });
};

/** Run after main CSS is active; fallbackMs covers routes without the deferred loader script. */
export const whenAppStylesReady = (callback, fallbackMs = 5800) => {
  if (typeof window === "undefined") {
    callback();
    return () => {};
  }
  const run = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback();
      });
    });
  };
  if (
    window.__oqStylesReady ||
    document.documentElement.classList.contains(APP_STYLES_READY_CLASS)
  ) {
    run();
    return () => {};
  }
  window.addEventListener(APP_STYLES_READY_EVENT, run, { once: true });
  const fallbackId = window.setTimeout(run, fallbackMs);
  return () => {
    window.removeEventListener(APP_STYLES_READY_EVENT, run);
    window.clearTimeout(fallbackId);
  };
};
