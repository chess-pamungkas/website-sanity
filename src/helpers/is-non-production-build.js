/** True for dev/staging Gatsby builds (GATSBY_ENV !== production). */
export const isNonProductionBuild = () =>
  process.env.GATSBY_ENV !== "production";
