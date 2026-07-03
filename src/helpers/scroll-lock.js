export const getScrollbarWidth = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
};

export const lockBodyScroll = (scrollY) => {
  if (typeof document === "undefined") {
    return;
  }

  const { body } = document;
  const scrollbarWidth = getScrollbarWidth();

  setScrollLockY(scrollY);
  body.classList.add("overflow-hidden");
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
    document.querySelectorAll(".header-wrapper").forEach((element) => {
      element.style.paddingRight = `${scrollbarWidth}px`;
    });
  }
};

export const unlockBodyScroll = (scrollY) => {
  if (typeof document === "undefined") {
    return;
  }

  const { body } = document;

  body.classList.remove("overflow-hidden");
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.paddingRight = "";

  document.querySelectorAll(".header-wrapper").forEach((element) => {
    element.style.paddingRight = "";
  });

  clearScrollLockY();
  window.scrollTo(0, scrollY);
};

export const getEffectiveScrollY = () => {
  if (typeof document === "undefined") {
    return 0;
  }

  const locked = document.body.dataset.scrollLockY;
  if (locked !== undefined && locked !== "") {
    const scrollY = Number(locked);
    if (Number.isFinite(scrollY)) {
      return scrollY;
    }
  }

  return window.scrollY;
};

export const setScrollLockY = (scrollY) => {
  if (typeof document === "undefined") {
    return;
  }

  document.body.dataset.scrollLockY = String(scrollY);
};

export const clearScrollLockY = () => {
  if (typeof document === "undefined") {
    return;
  }

  delete document.body.dataset.scrollLockY;
};

export const notifyScrollPositionChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("scroll"));
};
