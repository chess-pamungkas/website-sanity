/**
 * Stub for react-i18next's TransWithoutContext.
 * We only use useTranslation (t()); Trans is never used, so we replace it with a minimal
 * component to reduce unused JavaScript in the bundle (Lighthouse "Reduce unused JavaScript").
 */
import React from "react";

export function Trans(props) {
  return props.children ?? null;
}

export function nodesToString() {
  return "";
}
