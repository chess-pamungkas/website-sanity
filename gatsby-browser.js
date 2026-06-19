import { cloneElement, createElement } from "react";
import Layout from "./src/components/shared/layout";
import {
  getStoredScrollPosition,
  initScrollRestoration,
  restoreScrollPosition,
  saveScrollPosition,
  setActiveScrollPath,
} from "./src/helpers/scroll-restoration";

export const wrapPageElement = ({ element }) => {
  // Don't remove the if statement, it will break everything!!!
  // Workaround to apply localization to layout content, plugin doesn't do this by default
  if (Object.keys(element.props).length !== 0) {
    const newElement = cloneElement(
      element,
      element.props,
      cloneElement(
        element.props.children,
        element.props.children.props,
        createElement(Layout, { pathname: element.props?.location?.pathname }, element.props.children.props.children)
      )
    );
    return newElement;
  }

  return element;
};

const unregisterDevServiceWorkers = () => {
  if (process.env.NODE_ENV !== "development") return;
  if (!("serviceWorker" in navigator)) return;

  try {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {});
        });
      })
      .catch(() => {});
  } catch (e) {
    /* DevTools device emulation can leave the document in an invalid state. */
  }
};

const isServiceWorkerInvalidStateRejection = (reason) => {
  const msg =
    (reason && typeof reason.message === "string" && reason.message) ||
    (typeof reason === "string" ? reason : "");
  return (
    msg.includes("ServiceWorkerRegistration") ||
    msg.includes("invalid state") ||
    msg.includes("Failed to get ServiceWorkerRegistration")
  );
};

const ensureRuntimeErrorHasStack = (error) => {
  if (!(error instanceof Error) || error.stack) return;
  try {
    error.stack = `${error.name || "Error"}: ${error.message || "Unknown error"}\n    at <unknown>`;
  } catch (e) {
    /* frozen error object */
  }
};

// Register before react-refresh overlay handlers (bubble). Gatsby RuntimeErrors calls
// error.stack.split() and crashes the whole page when stack is missing (DOMException, etc.).
if (typeof window !== "undefined") {
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      if (isServiceWorkerInvalidStateRejection(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.reason instanceof Error) {
        ensureRuntimeErrorHasStack(event.reason);
      }
    },
    true
  );

  window.addEventListener(
    "error",
    (event) => {
      if (event.error instanceof Error) {
        ensureRuntimeErrorHasStack(event.error);
      }
    },
    true
  );
}

// Service Worker management
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  if (process.env.NODE_ENV === "development") {
    // Unregister early — waiting for `load` is too late when DevTools emulation
    // rejects getRegistrations() and Gatsby's overlay crashes on rejections without .stack.
    unregisterDevServiceWorkers();
    window.addEventListener("DOMContentLoaded", unregisterDevServiceWorkers);
    window.addEventListener("load", unregisterDevServiceWorkers);
  } else {
    // In production, register the service worker
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // Service worker registered; avoid noisy console in production
        })
        .catch((registrationError) => {
          console.log("Service Worker registration failed:", registrationError);
        });
    });
  }
}

export const onPreRouteUpdate = ({ prevLocation }) => {
  if (prevLocation?.pathname) {
    saveScrollPosition(prevLocation.pathname);
  }
};

export const shouldUpdateScroll = ({ routerProps, getSavedScrollPosition }) => {
  const { location, action } = routerProps || {};

  if (action === "POP" && location?.pathname) {
    return new Promise((resolve) => {
      const fallback = () => {
        const stored = getStoredScrollPosition(location.pathname);
        resolve(stored || [0, 0]);
      };

      if (typeof getSavedScrollPosition === "function") {
        getSavedScrollPosition(location).then((saved) => {
          if (saved && saved[1] > 0) {
            resolve(saved);
            return;
          }
          fallback();
        });
        return;
      }

      fallback();
    });
  }

  return true;
};

export const onRouteUpdate = ({ location, action }) => {
  if (action === "POP" && location?.pathname) {
    restoreScrollPosition(location.pathname);
  }

  if (location?.pathname) {
    setActiveScrollPath(location.pathname);
  }
};

// Global error handler to suppress expected errors from ad blockers and third-party scripts (GTM, TikTok, Bing)
export const onClientEntry = () => {
  if (typeof window !== "undefined") {
    initScrollRestoration();
    unregisterDevServiceWorkers();

    const originalError = window.console.error;
    const originalWarn = window.console.warn;

    window.console.error = function (...args) {
      const msg = typeof args[0] === "string" ? args[0] : args.join(" ");
      if (
        msg.includes("ERR_BLOCKED_BY_CLIENT") ||
        msg.includes("net::ERR_BLOCKED_BY_CLIENT") ||
        msg.includes("cloudflareinsights") ||
        msg.includes("beacon.min.js") ||
        msg.includes("event_value should be a number") ||
        msg.includes("Uncaught event_value") ||
        msg.includes("bat.js") ||
        msg.includes("TikTok Pixel") ||
        msg.includes("Minified React error #418") ||
        msg.includes("Minified React error #423") ||
        msg.includes("reactjs.org/docs/error-decoder.html?invariant=418") ||
        msg.includes("reactjs.org/docs/error-decoder.html?invariant=423")
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    window.console.warn = function (...args) {
      const msg = typeof args[0] === "string" ? args[0] : args.join(" ");
      if (
        msg.includes("[TikTok Pixel]") ||
        msg.includes("TikTok Pixel") ||
        msg.includes("Invalid Event Name Format") ||
        msg.includes("event_value should be a number")
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    window.addEventListener(
      "error",
      (event) => {
        if (
          event.message &&
          (event.message.includes("ERR_BLOCKED_BY_CLIENT") ||
            event.message.includes("cloudflareinsights") ||
            event.message.includes("beacon.min.js") ||
            event.message.includes("bat.bing.com") ||
            event.message.includes("bat.js") ||
            event.message.includes("event_value should be a number") ||
            event.message.includes("Uncaught event_value") ||
            event.message.includes("TikTok Pixel") ||
            event.message.includes("Invalid Event Name Format") ||
            event.message.includes("Minified React error #418") ||
            event.message.includes("Minified React error #423") ||
            event.message.includes("invariant=418") ||
            event.message.includes("invariant=423"))
        ) {
          event.preventDefault();
          return false;
        }
      },
      true
    );
  }
};

