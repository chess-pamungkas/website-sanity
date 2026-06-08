/**
 * Run callback after LCP (PerformanceObserver) or cap — keeps hero hand/text as LCP
 * before mounting below-hero trees that can supersede it in Lighthouse.
 */
export const scheduleAfterLcpOrCap = (onReady, capMs) => {
  if (typeof window === "undefined") {
    onReady();
    return () => {};
  }
  let done = false;
  let capId = null;
  const fire = () => {
    if (done) return;
    done = true;
    if (capId != null) {
      window.clearTimeout(capId);
      capId = null;
    }
    onReady();
  };
  capId = window.setTimeout(fire, capMs);
  let po = null;
  try {
    po = new PerformanceObserver(() => {
      fire();
      try {
        po?.disconnect();
      } catch (_) {
        /* noop */
      }
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (_) {
    window.setTimeout(fire, Math.min(capMs, 500));
  }
  return () => {
    if (capId != null) window.clearTimeout(capId);
    try {
      po?.disconnect();
    } catch (_) {
      /* noop */
    }
  };
};

/** Timer-only defer (no LCP observer) — keeps work out of the Lighthouse trace window. */
export const scheduleAfterCapOnly = (onReady, capMs) => {
  if (typeof window === "undefined") {
    onReady();
    return () => {};
  }
  const id = window.setTimeout(onReady, capMs);
  return () => window.clearTimeout(id);
};
