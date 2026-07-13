import { useEffect, useState } from "react";
import { DESKTOP_LG_VIEWPORT_MQ } from "../viewport-media";

const DEFAULT_STICKY_TOP = 96;
const VIEWPORT_BOTTOM_GAP = 24;

/**
 * Pins the article sidebar within the layout column on desktop (fixed while scrolling).
 * Falls back to static positioning below desktop-lg.
 */
export const usePinnedArticleSidebar = ({
  layoutRef,
  asideRef,
  sidebarRef,
  stickyTop = DEFAULT_STICKY_TOP,
  enabled = true,
}) => {
  const [pinStyle, setPinStyle] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setPinStyle(null);
      return undefined;
    }

    const mq = window.matchMedia(DESKTOP_LG_VIEWPORT_MQ);

    const update = () => {
      if (!mq.matches) {
        setPinStyle(null);
        return;
      }

      const layout = layoutRef.current;
      const aside = asideRef.current;
      const sidebar = sidebarRef.current;

      if (!layout || !aside || !sidebar) {
        setPinStyle(null);
        return;
      }

      const scrollY = window.scrollY;
      const layoutRect = layout.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const layoutTop = layoutRect.top + scrollY;
      const layoutBottom = layoutTop + layout.offsetHeight;
      const pinStart = layoutTop - stickyTop;
      const pinEnd = layoutBottom - sidebarHeight - stickyTop;
      const maxHeight = `calc(100dvh - ${stickyTop}px - ${VIEWPORT_BOTTOM_GAP}px)`;

      if (scrollY < pinStart) {
        setPinStyle(null);
        return;
      }

      if (scrollY > pinEnd) {
        setPinStyle({
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
          maxHeight,
          overflowY: "auto",
        });
        return;
      }

      setPinStyle({
        position: "fixed",
        top: stickyTop,
        left: asideRect.left,
        width: asideRect.width,
        zIndex: 10,
        maxHeight,
        overflowY: "auto",
      });
    };

    const onScroll = () => requestAnimationFrame(update);
    const onResize = () => requestAnimationFrame(update);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", update);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      if (layoutRef.current) ro.observe(layoutRef.current);
      if (asideRef.current) ro.observe(asideRef.current);
      if (sidebarRef.current) ro.observe(sidebarRef.current);
    }

    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", update);
      ro?.disconnect();
    };
  }, [layoutRef, asideRef, sidebarRef, stickyTop, enabled]);

  return pinStyle;
};
