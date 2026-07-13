import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  sanityAuthorPhotoUrl,
  sanityImageHotspotObjectPosition,
} from "../../../helpers/sanity/sanity-image-url";

const TradingHubArticleAuthor = ({
  name,
  role,
  bio,
  photo,
  publishedAt,
  publishedDate,
}) => {
  const photoUrl = useMemo(() => sanityAuthorPhotoUrl(photo), [photo]);
  const photoObjectPosition = useMemo(
    () => sanityImageHotspotObjectPosition(photo?.hotspot),
    [photo]
  );

  if (!name) return null;

  const subtitle = [role, bio].filter(Boolean).join("\n");

  return (
    <aside className="trading-hub-article-author" aria-label="Article author">
      <div className="trading-hub-article-author__media">
        {photoUrl ? (
          <img
            className="trading-hub-article-author__photo"
            src={photoUrl}
            alt=""
            width={132}
            height={96}
            style={{ objectPosition: photoObjectPosition }}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="trading-hub-article-author__info">
        <p className="trading-hub-article-author__name">{name}</p>
        {subtitle ? (
          <p className="trading-hub-article-author__subtitle">{subtitle}</p>
        ) : null}
      </div>
      {publishedDate ? (
        <time
          className="trading-hub-article-author__date-badge"
          dateTime={publishedAt}
        >
          {publishedDate}
        </time>
      ) : null}
    </aside>
  );
};

TradingHubArticleAuthor.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  bio: PropTypes.string,
  photo: PropTypes.object,
  publishedAt: PropTypes.string,
  publishedDate: PropTypes.string,
};

export default TradingHubArticleAuthor;
