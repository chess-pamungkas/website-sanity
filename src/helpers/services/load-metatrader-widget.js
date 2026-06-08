const WIDGET_SCRIPT_URL = "https://metatraderweb.app/trade/widget.js";

let widgetScriptPromise = null;

const waitForMetaTraderWebTerminal = (maxAttempts = 60, intervalMs = 50) =>
  new Promise((resolve, reject) => {
    let attempts = 0;
    const tick = () => {
      if (typeof window.MetaTraderWebTerminal === "function") {
        resolve();
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        reject(new Error("MetaTraderWebTerminal is not available"));
        return;
      }
      setTimeout(tick, intervalMs);
    };
    tick();
  });

/**
 * Load MT4 WebTrader widget.js once (shared promise). Resolves when
 * window.MetaTraderWebTerminal is callable.
 */
export function loadMetaTraderWidgetScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (typeof window.MetaTraderWebTerminal === "function") {
    return Promise.resolve();
  }
  if (widgetScriptPromise) {
    return widgetScriptPromise;
  }

  widgetScriptPromise = new Promise((resolve, reject) => {
    const finish = () => {
      waitForMetaTraderWebTerminal()
        .then(resolve)
        .catch(reject);
    };

    const existing = document.querySelector(
      `script[src="${WIDGET_SCRIPT_URL}"]`
    );
    if (existing) {
      if (existing.dataset.mtWidgetLoaded === "1") {
        finish();
        return;
      }
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("MetaTrader widget script failed to load")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_URL;
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.mtWidgetLoaded = "1";
        finish();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => reject(new Error("MetaTrader widget script failed to load")),
      { once: true }
    );
    document.body.appendChild(script);
  }).catch((error) => {
    widgetScriptPromise = null;
    throw error;
  });

  return widgetScriptPromise;
}

export function preloadMetaTraderWidgetScript() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[rel="preload"][href="${WIDGET_SCRIPT_URL}"]`)) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "script";
  link.href = WIDGET_SCRIPT_URL;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

export { WIDGET_SCRIPT_URL };
