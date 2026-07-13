import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby-plugin-react-i18next";
import {
  buildTradingHubPath,
  splitTitleHighlight,
} from "../../../helpers/sanity/trading-hub-paths";
import { sanityImageUrl } from "../../../helpers/sanity/sanity-image-url";
import ClockIcon from "../../../assets/images/icons/trading-hub/clock.svg";

const TradingHubArticleCard = ({ article, newBadgeLabel }) => {
  const categorySlug = article.categorySlug;
  const articleSlug = article.slug?.current;
  const title = article.title || "";
  const { lead, highlight } = useMemo(() => splitTitleHighlight(title), [title]);
  const imageUrl = sanityImageUrl(article.thumbnail, { width: 800, height: 500 });

  if (!categorySlug || !articleSlug) return null;

  return (
    <Link
      to={buildTradingHubPath({
        categorySlug,
        articleSlug,
      })}
      className="trading-hub-card"
    >
      <div className="trading-hub-card__media">
        {imageUrl ? (
          <img
            className="trading-hub-card__image"
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : null}
        {article.isNew === true && newBadgeLabel ? (
          <span className="trading-hub-card__badge">{newBadgeLabel}</span>
        ) : null}
      </div>
      <div className="trading-hub-card__body">
        <h3 className="trading-hub-card__title">
          {lead ? (
            <>
              <span className="trading-hub-card__title-lead">{lead} </span>
              <span className="trading-hub-card__title-highlight">{highlight}</span>
            </>
          ) : (
            <span className="trading-hub-card__title-highlight">{highlight}</span>
          )}
        </h3>
        {article.readTimeMinutes ? (
          <span className="trading-hub-card__meta">
            <img
              className="trading-hub-card__meta-icon"
              src={ClockIcon}
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <span className="trading-hub-card__meta-text">
              {article.readTimeMinutes} MINS
            </span>
          </span>
        ) : null}
      </div>
    </Link>
  );
};

TradingHubArticleCard.propTypes = {
  newBadgeLabel: PropTypes.string,
  article: PropTypes.shape({
    slug: PropTypes.shape({
      current: PropTypes.string,
    }),
    title: PropTypes.string,
    categorySlug: PropTypes.string,
    thumbnail: PropTypes.object,
    isNew: PropTypes.bool,
    readTimeMinutes: PropTypes.number,
  }).isRequired,
};

export default TradingHubArticleCard;
