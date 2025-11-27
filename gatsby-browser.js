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
        createElement(Layout, undefined, element.props.children.props.children)
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
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((registrationError) => {
          console.log("Service Worker registration failed:", registrationError);
        });
    });
  }
}

// Global error handler to suppress expected errors from ad blockers and browser extensions
export const onClientEntry = () => {
  if (typeof window !== "undefined") {
    // Suppress ERR_BLOCKED_BY_CLIENT errors (typically from ad blockers)
    const originalError = window.console.error;
    window.console.error = function (...args) {
      // Filter out ERR_BLOCKED_BY_CLIENT errors
      const errorMessage = args.join(" ");
      if (
        errorMessage.includes("ERR_BLOCKED_BY_CLIENT") ||
        errorMessage.includes("net::ERR_BLOCKED_BY_CLIENT") ||
        errorMessage.includes("cloudflareinsights") ||
        errorMessage.includes("beacon.min.js")
      ) {
        // Silently ignore these expected errors
        return;
      }
      // Log other errors normally
      originalError.apply(console, args);
    };

    // Also handle resource loading errors
    window.addEventListener(
      "error",
      (event) => {
        if (
          event.message &&
          (event.message.includes("ERR_BLOCKED_BY_CLIENT") ||
            event.message.includes("cloudflareinsights") ||
            event.message.includes("beacon.min.js") ||
            event.message.includes("bat.bing.com") ||
            event.message.includes("bat.js"))
        ) {
          event.preventDefault(); // Prevent error from showing in console
          return false;
        }
      },
      true
    ); // Use capture phase to catch all errors
  }
};

export const onRouteUpdate = () => {};
