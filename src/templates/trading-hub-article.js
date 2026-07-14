import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import PageBackground from "../components/shared/page-background";
import Seo from "../components/shared/seo";
import TradingHubArticleDetail from "../components/trading-hub/article-detail";
import SanityPreviewBanner from "../components/trading-hub/preview-banner";
import {
  mapArticle,
  resolveRelatedArticles,
} from "../helpers/sanity/map-trading-hub-data";
import "../assets/styles/index.scss";

const TradingHubArticleTemplate = ({ data, serverData, pageContext }) => {
  const { language } = useI18next();
  const {
    relatedArticleIds = [],
    relatedContentMode: contextRelatedContentMode,
  } = pageContext;
  const isPreview = serverData?.isPreview === true;

  // Prefer fresh SSR data over stale build-time GraphQL data
  const articleRaw =
    serverData?.ssrArticle ||
    data.article ||
    null;

  const allArticlesRaw = serverData?.articles || data.allArticles?.nodes || [];

  const article = useMemo(
    () => mapArticle(articleRaw, language),
    [articleRaw, language]
  );

  // Use fresh relatedContentMode and relatedArticleIds from SSR when available
  const freshRelatedContentMode =
    serverData?.ssrArticle?.relatedContentMode || contextRelatedContentMode;
  const freshRelatedArticleIds =
    serverData?.ssrArticle?.relatedArticles?.length
      ? serverData.ssrArticle.relatedArticles
      : relatedArticleIds;

  const articleForRelated = useMemo(
    () => ({
      ...article,
      relatedContentMode: freshRelatedContentMode || article?.relatedContentMode,
    }),
    [article, freshRelatedContentMode]
  );

  const relatedArticles = useMemo(() => {
    return resolveRelatedArticles(
      articleForRelated,
      allArticlesRaw,
      language,
      4,
      freshRelatedArticleIds
    );
  }, [
    articleForRelated,
    allArticlesRaw,
    language,
    freshRelatedArticleIds,
  ]);

  const seo = article?.seo || {};

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <SanityPreviewBanner enabled={isPreview} />
      <Seo
        title={seo.title || article?.title || "Trading Hub"}
        description={seo.description || article?.subtitle || ""}
      />
      <TradingHubArticleDetail
        article={article}
        relatedArticles={relatedArticles}
      />
    </PageBackground>
  );
};

export async function getServerData({ headers, pageContext }) {
  try {
    const { isPreviewRequest } = require("../helpers/sanity/preview");
    const { fetchTradingHubDataSSR } = require("../helpers/sanity/gatsby-source");
    const preview = isPreviewRequest(headers);
    const ssrData = await fetchTradingHubDataSSR({ preview });
    const ssrArticle =
      ssrData.articles.find(
        (a) => a.slug?.current === pageContext.articleSlug
      ) || null;
    return {
      props: { ...ssrData, ssrArticle },
      headers: preview
        ? { "Cache-Control": "private, no-cache, no-store, must-revalidate" }
        : undefined,
    };
  } catch (err) {
    console.error("[SSR] trading-hub-article:", err.message);
    return { props: {} };
  }
}

export default TradingHubArticleTemplate;

export const query = graphql`
  query TradingHubArticlePage($language: String!, $articleId: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    article: sanityHubArticle(id: { eq: $articleId }) {
      id
      sanityId
      publishToSites
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
      publishedAt
      readTimeMinutes
      isNew
      thumbnail {
        asset {
          url
        }
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
      heroImage {
        asset {
          url
        }
      }
      relatedContentMode
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
        photo {
          asset {
            url
          }
          hotspot {
            x
            y
            height
            width
          }
          crop {
            top
            bottom
            left
            right
          }
        }
        role {
          _key
          language
          value
        }
        bio {
          _key
          language
          value
        }
      }
    }
    allArticles: allSanityHubArticle(sort: { orderRank: ASC }) {
      nodes {
        id
        sanityId
        publishToSites
        slug {
          current
        }
        title {
          _key
          language
          value
        }
        relatedContentMode
        category {
          slug {
            current
          }
        }
      }
    }
  }
`;
