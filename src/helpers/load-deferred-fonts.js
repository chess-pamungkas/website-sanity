/**
 * Load non-LCP fonts after window.load to keep them out of the critical request chain.
 * Reduces Network dependency tree (Lighthouse).
 */
import "../assets/styles/typography-deferred.scss";
