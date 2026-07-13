import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import PageBackground from "../components/shared/page-background";
import Seo from "../components/shared/seo";
import TradingHubContent from "../components/trading-hub/trading-hub-content";
import {
  mapArticle,
  mapCategory,
  mapLandingPage,
  sortArticlesByOrderRank,
} from "../helpers/sanity/map-trading-hub-data";
import "../assets/styles/index.scss";

const TradingHubCategoryTemplate = ({ data, pageContext }) => {
  const { language } = useI18next();
  const { categorySlug } = pageContext;

  const landingPage = useMemo(
    () => mapLandingPage(data.landingPage, language),
    [data.landingPage, language]
  );

  const activeCategory = useMemo(
    () => mapCategory(data.category, language),
    [data.category, language]
  );

  const categories = useMemo(
    () =>
      (data.categories?.nodes || [])
        .map((node) => mapCategory(node, language))
        .filter(Boolean)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [data.categories?.nodes, language]
  );

  const articles = useMemo(
    () =>
      sortArticlesByOrderRank(
        (data.articles?.nodes || [])
          .map((node) => mapArticle(node, language))
          .filter(Boolean)
      ),
    [data.articles?.nodes, language]
  );

  const seo = landingPage?.seo || {};

  return (
    <PageBackground backgroundType="homepage-bg-1">
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
