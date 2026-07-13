import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import PageBackground from "../components/shared/page-background";
import Seo from "../components/shared/seo";
import TradingHubArticleDetail from "../components/trading-hub/article-detail";
import {
  mapArticle,
  resolveRelatedArticles,
} from "../helpers/sanity/map-trading-hub-data";
import "../assets/styles/index.scss";

const TradingHubArticleTemplate = ({ data, pageContext }) => {
  const { language } = useI18next();
  const {
    relatedArticleIds = [],
    relatedContentMode: contextRelatedContentMode,
  } = pageContext;

  const article = useMemo(
    () => mapArticle(data.article, language),
    [data.article, language]
  );

  const articleForRelated = useMemo(
    () => ({
      ...article,
      relatedContentMode:
        contextRelatedContentMode || article.relatedContentMode,
    }),
    [article, contextRelatedContentMode]
  );

  const relatedArticles = useMemo(() => {
    const allNodes = data.allArticles?.nodes || [];
    return resolveRelatedArticles(
      articleForRelated,
      allNodes,
      language,
      4,
      relatedArticleIds
    );
  }, [
    articleForRelated,
    data.allArticles?.nodes,
    language,
    relatedArticleIds,
  ]);

  const seo = article?.seo || {};

  return (
    <PageBackground backgroundType="homepage-bg-1">
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
