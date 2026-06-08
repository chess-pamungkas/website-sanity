/**
 * Browser-safe “package root” for react-i18next: same public API as dist/es/index.js
 * but Trans / TransWithoutContext never load html-parse-stringify or the real TransWithoutContext.
 *
 * Deep imports must be relative (…/node_modules/react-i18next/dist/es/…) — package "exports"
 * forbids bare "react-i18next/dist/es/…" specifiers in webpack 5.
 */
export { Trans } from "./react-i18next-Trans.js";
export {
  Trans as TransWithoutContext,
  nodesToString,
} from "./trans-without-context.js";
export { useTranslation } from "../../node_modules/react-i18next/dist/es/useTranslation.js";
export { withTranslation } from "../../node_modules/react-i18next/dist/es/withTranslation.js";
export { Translation } from "../../node_modules/react-i18next/dist/es/Translation.js";
export { I18nextProvider } from "../../node_modules/react-i18next/dist/es/I18nextProvider.js";
export { withSSR } from "../../node_modules/react-i18next/dist/es/withSSR.js";
export { useSSR } from "../../node_modules/react-i18next/dist/es/useSSR.js";
export { initReactI18next } from "../../node_modules/react-i18next/dist/es/initReactI18next.js";
export { setDefaults, getDefaults } from "../../node_modules/react-i18next/dist/es/defaults.js";
export { setI18n, getI18n } from "../../node_modules/react-i18next/dist/es/i18nInstance.js";
export {
  I18nContext,
  composeInitialProps,
  getInitialProps,
} from "../../node_modules/react-i18next/dist/es/context.js";

export const date = () => "";
export const time = () => "";
export const number = () => "";
export const select = () => "";
export const plural = () => "";
export const selectOrdinal = () => "";
