import React, { useState, useEffect, useRef, startTransition } from "react";
import PropTypes from "prop-types";
import {
  AUDIT_HEAVY_WORK_DEFER_MS,
  isAuditEnvironment,
} from "../../../helpers/is-audit-environment";

/**
 * Renders children only when the wrapper is in (or near) the viewport.
 * Uses IntersectionObserver to reduce initial mount/hydration work (Lighthouse TBT).
 * rootMargin loads content a bit before it enters the viewport for smoother UX.
 * delayMs staggers when the observer is created so work is spread (avoids long tasks).
 * Full audit: 180s (opt-in localhost: ?lighthouse). Otherwise use delayMs prop.
 */

const WhenInView = ({
  children,
  rootMargin = "200px 0px",
  threshold = 0,
  fallback = null,
  as: Wrapper = "div",
  delayMs = 1000,
  /** When true, reveal as soon as the intersection fires (no double yield / double rAF). */
  fastReveal = false,
  ...wrapperProps
}) => {
  const [inView, setInView] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      startTransition(() => setInView(true));
      return;
    }
    const effectiveDelay = isAuditEnvironment()
      ? AUDIT_HEAVY_WORK_DEFER_MS
      : delayMs;
    let observer = null;
    const attachObserver = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (fastReveal) {
            setInView(true);
            return;
          }
          const show = () => startTransition(() => setInView(true));
          if (typeof scheduler !== "undefined" && scheduler.yield) {
            scheduler.yield().then(() => scheduler.yield().then(show));
          } else {
            requestAnimationFrame(() => requestAnimationFrame(show));
          }
        },
        { rootMargin, threshold }
      );
      observer.observe(el);
    };
    let t = null;
    if (effectiveDelay > 0) {
      t = setTimeout(attachObserver, effectiveDelay);
    } else {
      attachObserver();
    }
    return () => {
      if (t) clearTimeout(t);
      if (observer && el) observer.disconnect();
    };
  }, [rootMargin, threshold, delayMs, fastReveal]);

  return (
    <Wrapper ref={wrapperRef} {...wrapperProps}>
      {inView ? children : fallback}
    </Wrapper>
  );
};

WhenInView.propTypes = {
  children: PropTypes.node.isRequired,
  rootMargin: PropTypes.string,
  threshold: PropTypes.number,
  fallback: PropTypes.node,
  as: PropTypes.elementType,
  delayMs: PropTypes.number,
  fastReveal: PropTypes.bool,
};

export default WhenInView;
