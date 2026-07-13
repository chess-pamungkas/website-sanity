import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useLocation } from "@reach/router";
import TradingHubHero from "../trading-hub-hero";
import TradingHubCategoryTabs from "../category-tabs";
import TradingHubArticleCard from "../article-card";
import { ButtonSecondaryStandard } from "../../shared/reusable-buttons";
import { articleMatchesPublishSite } from "../../../helpers/sanity/publish-site";
import { isPublishedSanityId } from "../../../helpers/sanity/published-only";
import { articleMatchesSearch } from "../../../helpers/sanity/trading-hub-search";
import { sortArticlesByOrderRank } from "../../../helpers/sanity/map-trading-hub-data";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { BadgeSecurityIconGeneral as badgeSecurityIcon } from "../../shared/shared-icons";
import SearchIcon from "../../../assets/images/icons/client-portal-assistance/search.svg";
import TrustPilot from "../../shared/trust-pilot";

const PAGE_SIZE = 6;

const TradingHubContent = ({
  locale,
  landingPage,
  categories,
  articles,
  activeCategorySlug,
  sectionTitle,
}) => {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const isRTL = useRtlDirection();
  const location = useLocation();
  const resultsAnchorRef = useRef(null);

  useEffect(() => {
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  }, [activeCategorySlug]);

  useEffect(() => {
    const shouldScroll =
      location.state?.scrollToTradingHubResults ||
      location.hash === "#trading-hub-results";

    if (!shouldScroll) return undefined;

    const frame = requestAnimationFrame(() => {
      resultsAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.state]);

  const publishFilteredArticles = useMemo(
    () =>
      articles.filter(
        (article) =>
          articleMatchesPublishSite(article) &&
          isPublishedSanityId(article.sanityId || article.id) &&
          Boolean(article.publishedAt)
      ),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim();
    let list = publishFilteredArticles;

    if (normalizedQuery) {
      list = list.filter((article) =>
        articleMatchesSearch(article, normalizedQuery)
      );
    } else if (activeCategorySlug) {
      list = list.filter(
        (article) => article.categorySlug === activeCategorySlug
      );
    }

    return sortArticlesByOrderRank(list);
  }, [publishFilteredArticles, activeCategorySlug, query]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;
  const searchPlaceholder =
    landingPage?.searchPlaceholder || "What do you want to learn today?";
  const noResultsLabel =
    landingPage?.noResultsLabel || "No articles found. Try a different search.";

  return (
    <>
      <TradingHubHero
        badge={landingPage?.heroBadge}
        title={landingPage?.heroTitle}
        subtitle={landingPage?.heroSubtitle}
        ctaLabel={landingPage?.heroCtaLabel}
        ctaUrl={landingPage?.heroCtaUrl}
        heroImageDesktop={landingPage?.heroImageDesktop}
        heroImageMobile={landingPage?.heroImageMobile}
      />

      <section
        className={cn("trading-hub-section", {
          "trading-hub-section--rtl": isRTL,
        })}
      >
        <div className="container">
          {landingPage?.sectionEyebrow || sectionTitle ? (
            <div className="trading-hub-section__header">
              {landingPage?.sectionEyebrow ? (
                <div className="trading-hub-section__badge">
                  <img
                    src={badgeSecurityIcon}
                    alt=""
                    className="trading-hub-section__badge-icon"
                    width={16}
                    height={16}
                    aria-hidden="true"
                  />
                  <span className="trading-hub-section__badge-text">
                    {landingPage.sectionEyebrow}
                  </span>
                </div>
              ) : null}
              {sectionTitle ? (
                <h2 className="trading-hub-section__title">{sectionTitle}</h2>
              ) : null}
            </div>
          ) : null}

          <div className="trading-hub-section__search-group">
            <form
              className="trading-hub-section__search-form"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                resultsAnchorRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <label
                className="trading-hub-section__search"
                aria-label={searchPlaceholder}
              >
                <img
                  src={SearchIcon}
                  alt=""
                  className="trading-hub-section__search-icon"
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                <input
                  type="search"
                  className="trading-hub-section__search-input"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                />
              </label>
            </form>

            <div className="trading-hub-section__trust">
              <TrustPilot />
            </div>
          </div>

          <div
            id="trading-hub-results"
            ref={resultsAnchorRef}
            className="trading-hub-section__results-anchor"
            aria-hidden="true"
          />

          <TradingHubCategoryTabs
            categories={categories}
            allTabLabel={landingPage?.allTabLabel || "All"}
            activeCategorySlug={activeCategorySlug}
          />

          <div className="trading-hub-section__grid">
            {visibleArticles.length > 0 ? (
              visibleArticles.map((article) => (
                <TradingHubArticleCard
                  key={article.id}
                  article={article}
                  newBadgeLabel={landingPage?.newBadgeLabel || "New"}
                />
              ))
            ) : (
              <p className="trading-hub-section__empty">{noResultsLabel}</p>
            )}
          </div>

          {hasMore ? (
            <div className="trading-hub-section__load-more">
              <ButtonSecondaryStandard
                text={landingPage?.loadMoreLabel || "Load more"}
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

TradingHubContent.propTypes = {
  locale: PropTypes.string.isRequired,
  landingPage: PropTypes.object,
  categories: PropTypes.array.isRequired,
  articles: PropTypes.array.isRequired,
  activeCategorySlug: PropTypes.string,
  sectionTitle: PropTypes.string,
};

export default TradingHubContent;
