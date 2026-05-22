/**
 * Drop-in for react-i18next/dist/es/Trans.js without @babel/runtime helpers.
 * Keeps context wiring; delegates to trans-without-context.js (no html-parse-stringify).
 *
 * Use relative paths into node_modules — package.json "exports" blocks "react-i18next/dist/es/…".
 */
import { useContext } from "react";
import {
  Trans as TransWithoutContext,
  nodesToString,
} from "./trans-without-context.js";
import { getI18n, I18nContext } from "../../node_modules/react-i18next/dist/es/context.js";

export { nodesToString };

export function Trans(_ref) {
  const {
    children,
    count,
    parent,
    i18nKey,
    context: ctx,
    tOptions = {},
    values,
    defaults,
    components,
    ns,
    i18n: i18nFromProps,
    t: tFromProps,
    shouldUnescape,
    ...additionalProps
  } = _ref;

  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } =
    useContext(I18nContext) || {};

  const i18n = i18nFromProps || i18nFromContext || getI18n();
  const t =
    tFromProps ||
    (i18n && typeof i18n.t === "function" ? i18n.t.bind(i18n) : undefined);

  return TransWithoutContext({
    children,
    count,
    parent,
    i18nKey,
    context: ctx,
    tOptions,
    values,
    defaults,
    components,
    ns:
      ns ||
      (t && t.ns) ||
      defaultNSFromContext ||
      (i18n && i18n.options && i18n.options.defaultNS),
    i18n,
    t: tFromProps,
    shouldUnescape,
    ...additionalProps,
  });
}
