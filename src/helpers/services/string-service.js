// Cache busting comment - v2
export const stringTransformToKebabCase = (str) => {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.replace(/\s+/g, "-").toLowerCase();
};
