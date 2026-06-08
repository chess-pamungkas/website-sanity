import { cloneElement, createElement } from "react";
import Layout from "./src/components/shared/layout";

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

// Service Worker management
if ("serviceWorker" in navigator) {
  if (process.env.NODE_ENV === "development") {
    // In development, unregister any existing service workers
    window.addEventListener("load", () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log("Service Worker unregistered for development");
        });
      });
    });
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

// Global error handler to suppress expected errors from ad blockers and third-party scripts (GTM, TikTok, Bing)
export const onClientEntry = () => {
  if (typeof window !== "undefined") {
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

export const onRouteUpdate = () => {};
