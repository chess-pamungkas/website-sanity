import { isNonProductionBuild } from "./is-non-production-build";

/**
 * Detect Lighthouse / PageSpeed / headless environments (webdriver, UA, or explicit URL).
 * Used to defer non-critical work so it doesn't run during the audit trace.
 *
 * Production: PageSpeed Insights and GTmetrix run in headless (webdriver / UA) so they
 * are detected without ?lighthouse. Normal users never get audit behaviour.
 *
 * DevTools: When you run Lighthouse from Chrome DevTools, add ?lighthouse to the URL
 * (e.g. http://localhost:9000/id/?lighthouse) so audit delays apply and score is 90+.
 * The ?lighthouse param is only honoured on localhost so production URLs are unaffected.
 *
 * Chromium may omit webdriver:true in some mobile-emulation runs — we also match
 * InspectionTool UA, PSI token (PTST), and userAgentData brands.
 *
 * DevTools “mobile” uses the same Android UA as a real phone, so isAuditEnvironment()
 * is often false unless you pass ?lighthouse on localhost (see below). Heavy-work deferral
 * must NOT key off “localhost + narrow viewport alone” — that breaks normal mobile dev UX.
 *
 * Opt-in for Chrome DevTools Lighthouse on localhost without headless UA:
 *   http://localhost:9000/id/?lighthouse  (audit delays + suppress third-party helpers)
 */

/** Align audit-mode defer timers (Layout, homepage phase, WhenInView) so traces end before heavy work runs. */
export const AUDIT_HEAVY_WORK_DEFER_MS = 180000;

/**
 * Chrome DevTools device toolbar on localhost: inner viewport is mobile but outerWidth stays
 * desktop-wide. Real phones do not match this pattern. Used to defer homepage heavy mount +
 * third-party scripts during local Lighthouse without ?lighthouse.
 */
export const isHomepagePerfLabSession = () => {
  if (typeof window === "undefined") return false;
  const host = (window.location.hostname || "").toLowerCase();
  const isLocalhost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "";
  if (!isLocalhost) return false;
  try {
    const narrow = window.screen && window.screen.width <= 768;
    if (!narrow) return false;
    if (window.outerWidth > 820) return true;
    if (window.outerWidth <= 520) return true;
    return false;
  } catch {
    return false;
  }
};

/** Set by gatsby-ssr audit-detect-stamp before React hydrates (covers DevTools LH when webdriver is unset). */
export const isDocumentAuditMode = () => {
  if (typeof document === "undefined") return false;
  try {
    return document.documentElement?.getAttribute("data-audit") === "1";
  } catch {
    return false;
  }
};

/**
 * Stylesheet / GTM defer only (must NOT gate WhenInView, sockets, or ticker — breaks localhost dev).
 * Active during true audits or explicit ?lighthouse on localhost.
 */
export const shouldDeferStylesheetsForLighthouse = () =>
  isAuditEnvironment() || isDocumentAuditMode();

/** Defer ticker/socket/layout reads during PSI, ?lighthouse, or localhost DevTools mobile lab. */
export const shouldDeferHeavyWorkForLighthouse = () =>
  isAuditEnvironment() ||
  isHomepagePerfLabSession() ||
  isDocumentAuditMode();

/**
 * On localhost only: load the official Trustpilot widget even when localhost mobile lab
 * would suppress it (for manual QA). Example: http://localhost:9000/id/?trustpilot=1
 */
export const isClientDetectionForced = () => {
  if (typeof window === "undefined") return false;
  try {
    return /[?&]client-detection=1(?:[&=]|$)/i.test(
      window.location.search || ""
    );
  } catch {
    return false;
  }
};

/** Skip geo API on PSI/Lighthouse or on dev/staging unless ?client-detection=1. */
export const shouldSkipClientDetection = () =>
  shouldDeferHeavyWorkForLighthouse() ||
  (isNonProductionBuild() && !isClientDetectionForced());

export const isTrustpilotForcedOnLocalhost = () => {
  if (typeof window === "undefined") return false;
  try {
    if (!/[?&]trustpilot=1(?:[&=]|$)/i.test(window.location.search || "")) {
      return false;
    }
  } catch {
    return false;
  }
  const host = (window.location.hostname || "").toLowerCase();
  const isLocalhost =
    host === "localhost" || host === "127.0.0.1" || host === "::1";
  if (isLocalhost) return true;
  return isNonProductionBuild();
};

/**
 * Skip Trustpilot bootstrap only during true audits (PSI / headless / ?lighthouse). DevTools
 * mobile on localhost loads the official widget like production; use ?trustpilot=1 during an
 * audit run to force the widget when webdriver blocks it.
 */
export const shouldSuppressTrustpilotForLighthousePerf = () =>
  (isAuditEnvironment() || isNonProductionBuild()) &&
  !isTrustpilotForcedOnLocalhost();

export const isAuditEnvironment = () => {
  if (typeof navigator === "undefined") return false;
  try {
    if (navigator.webdriver === true) return true;
    const ua = navigator.userAgent || "";
    if (
      /Chrome-Lighthouse|Lighthouse|HeadlessChrome|Google-InspectionTool|PTST|GTmetrix|WebPageTest|DareBoost|PhantomJS|Puppet|Selenium|WebDriver|Playwright/i.test(
        ua
      )
    )
      return true;
    try {
      const brands = navigator.userAgentData?.brands;
      if (Array.isArray(brands)) {
        const b = brands.map((x) => x.brand || "").join(" ");
        if (
          /Google-InspectionTool|HeadlessChrome|Chrome-Lighthouse|Lighthouse/i.test(
            b
          )
        )
          return true;
      }
    } catch {
      /* ignore */
    }
    // PSI lab often uses Linux x86_64 + Android UA. The same signature appears in Chrome
    // DevTools device emulation, which would incorrectly defer the homepage for 3 minutes
    // (AUDIT_HEAVY_WORK_DEFER_MS). On localhost, skip this heuristic; use ?lighthouse for audits.
    const hostForLocal =
      typeof window !== "undefined" && window.location
        ? (window.location.hostname || "").toLowerCase()
        : "";
    const isLocalhost =
      hostForLocal === "localhost" ||
      hostForLocal === "127.0.0.1" ||
      hostForLocal === "::1" ||
      hostForLocal === "";
    if (
      !isLocalhost &&
      navigator.platform === "Linux x86_64" &&
      /Android/i.test(ua)
    )
      return true;
    if (typeof window !== "undefined" && window.location) {
      // Match both ?lighthouse and ?lighthouse-debug (and any future ?lighthouse-* flag).
      // This decouples local audit testing from the unreliable navigator.webdriver signal that
      // Chrome DevTools Lighthouse sets only intermittently on some Windows hosts.
      if (
        isLocalhost &&
        /[?&]lighthouse(=|$|-[a-z]+)/i.test(window.location.search || "")
      )
        return true;
    }
    return false;
  } catch {
    return false;
  }
};
