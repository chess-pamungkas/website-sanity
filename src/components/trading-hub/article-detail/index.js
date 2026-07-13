import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { PortableText } from "@portabletext/react";
import { Link } from "gatsby-plugin-react-i18next";
import {
  sanityArticleBodyImageUrls,
  sanityImageUrl,
} from "../../../helpers/sanity/sanity-image-url";
import { buildTradingHubPath } from "../../../helpers/sanity/trading-hub-paths";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { usePinnedArticleSidebar } from "../../../helpers/hooks/use-pinned-article-sidebar";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import CommonContext from "../../../context/common-context";
import ContainerWrapper from "../../shared/container-wrapper";
import OurCommunityContent from "../../shared/our-community";
import TradingHubArticleAuthor from "../article-author";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../../../helpers/viewport-media";

const slugifyHeading = (text) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const blockPlainText = (block) =>
  (block?.children || [])
    .map((child) => child?.text || "")
    .join("")
    .trim();

const createHeadingBlock =
  (Tag, registerHeading) =>
  ({ children, value, node }) => {
    const block = value || node;
    const id = slugifyHeading(blockPlainText(block));

    return (
      <Tag
        id={id || undefined}
        ref={(element) => registerHeading?.(id, element)}
      >
        {children}
      </Tag>
    );
  };

const HubPortableText = ({ value, registerHeading }) => {
  const components = useMemo(
    () => ({
      block: {
        normal: ({ children }) => <p>{children}</p>,
        h2: createHeadingBlock("h2", registerHeading),
        h3: createHeadingBlock("h3", registerHeading),
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
      },
    list: {
      bullet: ({ children }) => (
        <ul className="trading-hub-article-body__list">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="trading-hub-article-body__list trading-hub-article-body__list--numbered">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href || "#";
        const external = /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        const { src, srcSet } = sanityArticleBodyImageUrls(value);
        if (!src) return null;
        return (
          <figure className="trading-hub-article-body__figure">
            <img
              className="trading-hub-article-body__image"
              src={src}
              srcSet={srcSet || undefined}
              sizes="(min-width: 1024px) 775px, 100vw"
              alt={value?.alt || ""}
              loading="lazy"
              decoding="async"
            />
            {value?.caption ? (
              <figcaption className="trading-hub-article-body__caption">
                {value.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
    },
  }),
    [registerHeading]
  );

  if (!value?.length) return null;
  return (
    <div className="trading-hub-article-body">
      <PortableText value={value} components={components} />
    </div>
  );
};

HubPortableText.propTypes = {
  value: PropTypes.array,
  registerHeading: PropTypes.func,
};

export const buildTableOfContents = (blocks = []) =>
  blocks
    .filter((block) => block?._type === "block" && ["h2", "h3"].includes(block.style))
    .map((block) => {
      const text = (block.children || [])
        .map((child) => child.text || "")
        .join("")
        .trim();
      return {
        id: slugifyHeading(text),
        text,
        level: block.style,
      };
    })
    .filter((entry) => entry.text);

const TOC_INDICATOR_HEIGHT = 24;
const TOC_HEADER_SCROLL_OFFSET = 120;
const TOC_SCROLL_UNLOCK_MS = 1200;

const TradingHubTableOfContents = ({ entries, headingRegistryRef, registeredHeadingCount }) => {
  const [activeId, setActiveId] = useState(entries[0]?.id || "");
  const [indicatorTop, setIndicatorTop] = useState(0);
  const listRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef({});
  const entriesRef = useRef(entries);
  const scrollSpyLockedRef = useRef(false);
  const scrollUnlockTimerRef = useRef(null);

  entriesRef.current = entries;

  const getHeading = useCallback(
    (entryId) => headingRegistryRef.current?.get(entryId) || null,
    [headingRegistryRef]
  );

  const updateIndicator = useCallback(() => {
    const listEl = listRef.current;
    const trackEl = trackRef.current;
    const activeItem = itemRefs.current[activeId];

    if (!listEl || !trackEl) return;

    trackEl.style.minHeight = `${listEl.getBoundingClientRect().height}px`;

    if (!activeItem) return;

    const trackRect = trackEl.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const centeredTop =
      itemRect.top -
      trackRect.top +
      Math.max(0, (itemRect.height - TOC_INDICATOR_HEIGHT) / 2);

    setIndicatorTop(centeredTop);
  }, [activeId]);

  const syncActiveFromScroll = useCallback(() => {
    if (scrollSpyLockedRef.current || !entriesRef.current.length) return;

    const marker = TOC_HEADER_SCROLL_OFFSET;
    let currentId = entriesRef.current[0].id;

    entriesRef.current.forEach((entry) => {
      const heading = getHeading(entry.id);
      if (!heading) return;

      const { top } = heading.getBoundingClientRect();
      if (top <= marker + 8) {
        currentId = entry.id;
      }
    });

    setActiveId((prev) => (prev === currentId ? prev : currentId));
  }, [getHeading]);

  const updateIndicatorRef = useRef(updateIndicator);
  updateIndicatorRef.current = updateIndicator;

  const unlockScrollSpy = useCallback(
    (targetId) => {
      scrollSpyLockedRef.current = false;

      if (targetId) {
        setActiveId(targetId);
      } else {
        syncActiveFromScroll();
      }

      updateIndicatorRef.current();
    },
    [syncActiveFromScroll]
  );

  const scrollToHeading = useCallback(
    (entryId, behavior = "smooth") => {
      const heading = getHeading(entryId);
      if (!heading) return;

      if (scrollUnlockTimerRef.current) {
        clearTimeout(scrollUnlockTimerRef.current);
      }

      scrollSpyLockedRef.current = true;
      setActiveId(entryId);

      if (window.history.replaceState) {
        window.history.replaceState(null, "", `#${entryId}`);
      } else {
        window.location.hash = entryId;
      }

      heading.scrollIntoView({
        behavior: behavior === "instant" ? "auto" : behavior,
        block: "start",
      });

      scrollUnlockTimerRef.current = setTimeout(
        () => unlockScrollSpy(entryId),
        behavior === "smooth" ? TOC_SCROLL_UNLOCK_MS : 150
      );
    },
    [getHeading, unlockScrollSpy]
  );

  const handleTocClick = useCallback(
    (event, entryId) => {
      event.preventDefault();
      scrollToHeading(entryId, "smooth");
    },
    [scrollToHeading]
  );

  useEffect(() => {
    updateIndicator();
  }, [activeId, updateIndicator]);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(syncActiveFromScroll);
    };

    const onResize = () => {
      requestAnimationFrame(() => {
        syncActiveFromScroll();
        updateIndicatorRef.current();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const listEl = listRef.current;
    let ro;

    if (listEl && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateIndicatorRef.current());
      ro.observe(listEl);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [syncActiveFromScroll]);

  useEffect(() => {
    if (!registeredHeadingCount) return undefined;

    const frameId = requestAnimationFrame(() => {
      syncActiveFromScroll();
      updateIndicatorRef.current();
    });

    return () => cancelAnimationFrame(frameId);
  }, [registeredHeadingCount, syncActiveFromScroll]);

  useEffect(() => {
    const currentEntries = entriesRef.current;
    if (!currentEntries.length) return undefined;

    let frameId = 0;
    let timerId = 0;

    const applyInitialState = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const match = currentEntries.find((entry) => entry.id === hash);

      if (match) {
        scrollToHeading(match.id, "instant");
        return;
      }

      syncActiveFromScroll();
    };

    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        timerId = window.setTimeout(applyInitialState, 50);
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      if (scrollUnlockTimerRef.current) {
        clearTimeout(scrollUnlockTimerRef.current);
      }
    },
    []
  );

  if (!entries.length) return null;

  return (
    <nav className="trading-hub-toc" aria-label="Table of contents">
      <h2 className="trading-hub-sidebar__title">Table of contents</h2>
      <div className="trading-hub-toc__body">
        <div className="trading-hub-toc__track" ref={trackRef} aria-hidden="true">
          <span className="trading-hub-toc__track-line" />
          <span
            className="trading-hub-toc__indicator"
            style={{ top: `${indicatorTop}px` }}
          />
        </div>
        <ul className="trading-hub-toc__list" ref={listRef}>
          {entries.map((entry) => (
            <li
              key={entry.id}
              ref={(node) => {
                if (node) itemRefs.current[entry.id] = node;
              }}
            >
              <a
                className={cn("trading-hub-toc__link", {
                  "trading-hub-toc__link--active": activeId === entry.id,
                })}
                href={`#${entry.id}`}
                onClick={(event) => handleTocClick(event, entry.id)}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

TradingHubTableOfContents.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  headingRegistryRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  registeredHeadingCount: PropTypes.number,
};

TradingHubTableOfContents.defaultProps = {
  registeredHeadingCount: 0,
};

const CategoryBadgeArrow = () => (
  <svg
    className="trading-hub-article-hero__category-arrow"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667"
      stroke="#FF4400"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatArticleHeroDate = (isoDate, locale) => {
  const dateLocale =
    !locale || locale === "en" || locale.startsWith("en-") ? "en-GB" : locale;

  return new Date(isoDate).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const TradingHubArticleDetail = ({ article, relatedArticles }) => {
  const isRTL = useRtlDirection();
  const { isMobile } = useWindowSize();
  const { heightOffset } = useContext(CommonContext);
  const layoutRef = useRef(null);
  const sidebarAsideRef = useRef(null);
  const sidebarStickyRef = useRef(null);
  const headingRegistryRef = useRef(new Map());
  const [registeredHeadingCount, setRegisteredHeadingCount] = useState(0);

  const sidebarStickyTop = useMemo(
    () => (heightOffset > 0 ? heightOffset + 12 : 96),
    [heightOffset]
  );

  const sidebarPinStyle = usePinnedArticleSidebar({
    layoutRef,
    asideRef: sidebarAsideRef,
    sidebarRef: sidebarStickyRef,
    stickyTop: sidebarStickyTop,
  });

  const registerHeading = useCallback((id, element) => {
    if (!id) return;

    const registry = headingRegistryRef.current;

    if (element) {
      const isNew = !registry.has(id);
      registry.set(id, element);
      if (isNew) {
        setRegisteredHeadingCount((count) => count + 1);
      }
      return;
    }

    if (registry.has(id)) {
      registry.delete(id);
      setRegisteredHeadingCount((count) => Math.max(0, count - 1));
    }
  }, []);
  const categorySlug = article.categorySlug;
  const categoryTitle = article.categoryTitle;
  const heroImageDesktop = article.heroImageDesktop || article.heroImage;
  const heroImageMobile = article.heroImageMobile || heroImageDesktop;

  const desktopHeroUrl = useMemo(
    () => sanityImageUrl(heroImageDesktop, { width: 1400 }) || null,
    [heroImageDesktop]
  );
  const mobileHeroUrl = useMemo(
    () => sanityImageUrl(heroImageMobile, { width: 800 }) || desktopHeroUrl,
    [heroImageMobile, desktopHeroUrl]
  );

  const toc = useMemo(() => buildTableOfContents(article.body), [article.body]);
  const publishedDate = article.publishedAt
    ? formatArticleHeroDate(article.publishedAt, article.locale)
    : null;

  return (
    <>
      <section
        className={cn("trading-hub-article-hero", {
          "trading-hub-article-hero--rtl": isRTL,
        })}
      >
        <div className="trading-hub-article-hero__hero-container">
          {desktopHeroUrl ? (
            <div className="trading-hub-article-hero__hero-bg" aria-hidden="true">
              <picture>
                {mobileHeroUrl ? (
                  <source media={HERO_ASSET_MOBILE_MQ} srcSet={mobileHeroUrl} />
                ) : null}
                {desktopHeroUrl ? (
                  <source media={HERO_ASSET_DESKTOP_MQ} srcSet={desktopHeroUrl} />
                ) : null}
                <img
                  className="trading-hub-article-hero__hero-bg-lcp"
                  src={mobileHeroUrl || desktopHeroUrl}
                  alt=""
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              </picture>
            </div>
          ) : (
            <div
              className="trading-hub-article-hero__hero-bg trading-hub-article-hero__hero-bg--fallback"
              aria-hidden="true"
            />
          )}
          <div className="container">
            <div className="trading-hub-article-hero__content-container">
              {categorySlug ? (
                <Link
                  className="trading-hub-article-hero__category"
                  to={buildTradingHubPath({
                    categorySlug,
                  })}
                >
                  <span className="trading-hub-article-hero__category-label">
                    {categoryTitle}
                  </span>
                  <CategoryBadgeArrow />
                </Link>
              ) : null}
              <h1 className="trading-hub-article-hero__title">{article.title}</h1>
              {article.subtitle ? (
                <p className="trading-hub-article-hero__subtitle">{article.subtitle}</p>
              ) : null}
              {publishedDate ? (
                <time className="trading-hub-article-hero__date" dateTime={article.publishedAt}>
                  {publishedDate}
                </time>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div
        ref={layoutRef}
        className={cn("container trading-hub-article-layout", {
          "trading-hub-article-layout--rtl": isRTL,
        })}
        style={
          sidebarStickyTop
            ? { "--trading-hub-sidebar-sticky-top": `${sidebarStickyTop}px` }
            : undefined
        }
      >
        <article className="trading-hub-article-layout__body">
          <HubPortableText value={article.body} registerHeading={registerHeading} />
          {article.authorName ? (
            <TradingHubArticleAuthor
              name={article.authorName}
              role={article.authorRole}
              bio={article.authorBio}
              photo={article.authorPhoto}
              publishedAt={article.publishedAt}
              publishedDate={publishedDate}
            />
          ) : null}
        </article>
        <aside
          ref={sidebarAsideRef}
          className="trading-hub-article-layout__sidebar"
        >
          <div
            ref={sidebarStickyRef}
            className="trading-hub-article-layout__sidebar-sticky"
            style={sidebarPinStyle || undefined}
          >
            {relatedArticles?.length ? (
              <div className="trading-hub-related">
                <h2 className="trading-hub-sidebar__title">Related content</h2>
                <div className="trading-hub-sidebar__divider" aria-hidden="true" />
                <ul className="trading-hub-related__list">
                  {relatedArticles.map((related) => (
                    <li key={related.id}>
                      <Link
                        className="trading-hub-related__link"
                        to={buildTradingHubPath({
                          categorySlug: related.categorySlug,
                          articleSlug: related.slug?.current,
                        })}
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {toc.length ? (
              <TradingHubTableOfContents
                entries={toc}
                headingRegistryRef={headingRegistryRef}
                registeredHeadingCount={registeredHeadingCount}
              />
            ) : null}
          </div>
        </aside>
      </div>

      {isMobile ? (
        <OurCommunityContent />
      ) : (
        <div className="trading-hub-article-community">
          <ContainerWrapper>
            <OurCommunityContent />
          </ContainerWrapper>
        </div>
      )}
    </>
  );
};

TradingHubArticleDetail.propTypes = {
  article: PropTypes.object.isRequired,
  relatedArticles: PropTypes.array,
};

export default TradingHubArticleDetail;
