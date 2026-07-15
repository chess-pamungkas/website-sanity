import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import PageBackground from "../components/shared/page-background";
import Seo from "../components/shared/seo";
import TradingHubContent from "../components/trading-hub/trading-hub-content";
import SanityPreviewBanner from "../components/trading-hub/preview-banner";
import {
  mapArticle,
  mapCategory,
  mapLandingPage,
  sortArticlesByOrderRank,
} from "../helpers/sanity/map-trading-hub-data";
import "../assets/styles/index.scss";

const TradingHubCategoryTemplate = ({ data, serverData, pageContext }) => {
  const { language } = useI18next();
  const categorySlug =
    serverData?.resolvedCategorySlug || pageContext?.categorySlug || "";
  const isPreview = serverData?.isPreview === true;
  const notFound = serverData?.notFound === true;

  const landingPageRaw = serverData?.landingPage || data?.landingPage;
  const categoriesRaw =
    serverData?.categories || data?.categories?.nodes || [];
  const articlesRaw = serverData?.articles || data?.articles?.nodes || [];
  const categoryRaw =
    serverData?.ssrCategory ||
    data?.category ||
    categoriesRaw.find((c) => c.slug?.current === categorySlug);

  const landingPage = useMemo(
    () => mapLandingPage(landingPageRaw, language),
    [landingPageRaw, language]
  );

  const activeCategory = useMemo(
    () => mapCategory(categoryRaw, language),
    [categoryRaw, language]
  );

  const categories = useMemo(
    () =>
      categoriesRaw
        .map((node) => mapCategory(node, language))
        .filter(Boolean)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [categoriesRaw, language]
  );

  const articles = useMemo(
    () =>
      sortArticlesByOrderRank(
        articlesRaw
          .map((node) => mapArticle(node, language))
          .filter(Boolean)
      ),
    [articlesRaw, language]
  );

  const seo = landingPage?.seo || {};

  if (notFound || !activeCategory) {
    return (
      <PageBackground backgroundType="homepage-bg-1">
        <SanityPreviewBanner enabled={isPreview} />
        <Seo title="Category not found" description="" />
        <div className="container" style={{ padding: "4rem 1rem" }}>
          <h1>Category not found</h1>
          <p>
            {isPreview
              ? "No draft/published category matches this slug. Save the document in Studio, then try Preview again."
              : "This Trading Hub category is not available."}
          </p>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <SanityPreviewBanner enabled={isPreview} />
      <Seo
        title={activeCategory?.title || seo.title || "Trading Hub"}
        description={seo.description || landingPage?.heroSubtitle || ""}
      />
      <TradingHubContent
        locale={language}
        landingPage={landingPage}
        categories={categories}
        articles={articles}
        activeCategorySlug={categorySlug}
        sectionTitle={activeCategory?.title}
      />
    </PageBackground>
  );
};

export async function getServerData({
  headers,
  pageContext,
  params,
  url,
  query,
}) {
  try {
    const { isPreviewRequest } = require("../helpers/sanity/preview");
    const { fetchTradingHubDataSSR } = require("../helpers/sanity/gatsby-source");
    const {
      resolveTradingHubSlugs,
    } = require("../helpers/sanity/resolve-trading-hub-slugs");
    const preview = isPreviewRequest(headers);
    const { categorySlug } = resolveTradingHubSlugs({
      params,
      pageContext,
      url,
      query,
    });
    const ssrData = await fetchTradingHubDataSSR({ preview });
    const ssrCategory =
      ssrData.categories.find((c) => c.slug?.current === categorySlug) || null;

    if (!categorySlug || !ssrCategory) {
      return {
        status: 404,
        props: {
          ...ssrData,
          ssrCategory: null,
          resolvedCategorySlug: categorySlug,
          notFound: true,
        },
        headers: preview
          ? { "Cache-Control": "private, no-cache, no-store, must-revalidate" }
          : undefined,
      };
    }

    return {
      props: {
        ...ssrData,
        ssrCategory,
        resolvedCategorySlug: categorySlug,
        notFound: false,
      },
      headers: preview
        ? { "Cache-Control": "private, no-cache, no-store, must-revalidate" }
        : undefined,
    };
  } catch (err) {
    console.error("[SSR] trading-hub-category:", err.message);
    return { props: {} };
  }
}

export default TradingHubCategoryTemplate;

export const query = graphql`
  query TradingHubCategoryPage($language: String!, $categoryId: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    landingPage: sanityTradingHubPage {
      heroBadge {
        _key
        language
        value
      }
      heroTitle {
        _key
        language
        value
      }
      heroSubtitle {
        _key
        language
        value
      }
      heroCtaLabel {
        _key
        language
        value
      }
      heroImageDesktop {
        asset {
          url
        }
      }
      heroImageMobile {
        asset {
          url
        }
      }
      sectionEyebrow {
        _key
        language
        value
      }
      allTabLabel {
        _key
        language
        value
      }
      hubTitle {
        _key
        language
        value
      }
      searchPlaceholder {
        _key
        language
        value
      }
      loadMoreLabel {
        _key
        language
        value
      }
      newBadgeLabel {
        _key
        language
        value
      }
      seo {
        _key
        language
        value {
          title
          description
        }
      }
    }
    category: sanityHubCategory(id: { eq: $categoryId }) {
      id
      sortOrder
      slug {
        current
      }
      title {
        _key
        language
        value
      }
    }
    categories: allSanityHubCategory(sort: { sortOrder: ASC }) {
      nodes {
        id
        sortOrder
        slug {
          current
        }
        title {
          _key
          language
          value
        }
      }
    }
    articles: allSanityHubArticle(sort: { orderRank: ASC }) {
      nodes {
        id
        publishToSites
        orderRank
        publishedAt
        slug {
          current
        }
        title {
          _key
          language
          value
        }
        subtitle {
          _key
          language
          value
        }
        body {
          _key
          language
          value {
            _key
            _type
            style
            listItem
            level
            children {
              _key
              _type
              text
              marks
            }
            alt
            asset {
              _ref
            }
          }
        }
        readTimeMinutes
        isNew
        categorySlug
        thumbnail {
          asset {
            url
          }
        }
        category {
          slug {
            current
          }
          title {
            _key
            language
            value
          }
        }
        author {
          name
          role {
            _key
            language
            value
          }
        }
        seo {
          _key
          language
          value {
            title
            description
          }
        }
      }
    }
  }
`;
