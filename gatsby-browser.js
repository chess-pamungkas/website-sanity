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

export const onClientEntry = () => {};

export const onRouteUpdate = () => {};
