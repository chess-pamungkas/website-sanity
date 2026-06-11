/**
 * Lightweight Trans for react-i18next without html-parse-stringify.
 * Supports i18nKey + numbered <1>…</1> component tags (e.g. popup-registration-consent).
 */
import React from "react";

const TAGGED_COMPONENT_RE = /<(\d+)>(.*?)<\/\1>/gs;

function renderInterpolatedTranslation(translated, components) {
  if (!translated || typeof translated !== "string") {
    return translated ?? null;
  }

  if (!components || typeof components !== "object") {
    return translated;
  }

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = TAGGED_COMPONENT_RE.exec(translated)) !== null) {
    if (match.index > lastIndex) {
      parts.push(translated.slice(lastIndex, match.index));
    }

    const tagIndex = match[1];
    const childText = match[2];
    const component =
      components[tagIndex] ?? components[Number(tagIndex)];

    if (component) {
      parts.push(
        React.cloneElement(component, { key: `trans-${key++}` }, childText)
      );
    } else {
      parts.push(childText);
    }

    lastIndex = match.lastIndex;
  }

  if (lastIndex < translated.length) {
    parts.push(translated.slice(lastIndex));
  }

  return parts.length > 0 ? parts : translated;
}

function wrapContent(content, parent) {
  if (!Array.isArray(content)) {
    return content;
  }

  if (parent == null || parent === false) {
    return content;
  }

  if (typeof parent === "string") {
    return React.createElement(parent, null, ...content);
  }

  return React.createElement(parent, null, ...content);
}

export function Trans(props) {
  const {
    children,
    i18nKey,
    ns,
    components,
    t,
    i18n,
    defaults,
    tOptions = {},
    values,
    count,
    parent,
  } = props;

  if (children != null && children !== false) {
    return children;
  }

  const translate =
    typeof t === "function"
      ? t
      : i18n && typeof i18n.t === "function"
        ? i18n.t.bind(i18n)
        : null;

  if (!i18nKey || !translate) {
    return null;
  }

  const translated = translate(i18nKey, {
    ns,
    defaultValue: defaults,
    ...tOptions,
    ...(values || {}),
    ...(count !== undefined ? { count } : {}),
  });

  return wrapContent(
    renderInterpolatedTranslation(translated, components),
    parent
  );
}

export function nodesToString(children) {
  if (typeof children === "string") {
    return children;
  }

  return "";
}
