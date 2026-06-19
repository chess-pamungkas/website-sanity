import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect on client; useEffect on server (avoids DEV_SSR / Gatsby SSR warnings). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
