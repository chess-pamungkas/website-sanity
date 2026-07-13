/**
 * Build Trading Hub paths without a language prefix.
 * Use with `Link` from `gatsby-plugin-react-i18next`, which localizes the path.
 * @param {{ categorySlug?: string, articleSlug?: string }} params
 */
export function buildTradingHubPath({ categorySlug, articleSlug } = {}) {
  let path = "/trading-hub";

  if (categorySlug) path += `/${categorySlug}`;
  if (articleSlug) path += `/${articleSlug}`;

  return `${path}/`;
}

export function splitTitleHighlight(title) {
  const trimmed = (title || "").trim();
  if (!trimmed) return { lead: "", highlight: "" };

  const words = trimmed.split(/\s+/);
  if (words.length <= 1) {
    return { lead: "", highlight: trimmed };
  }

  return {
    lead: words.slice(0, -1).join(" "),
    highlight: words[words.length - 1],
  };
}
