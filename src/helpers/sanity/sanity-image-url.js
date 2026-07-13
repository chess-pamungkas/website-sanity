import imageUrlBuilder from "@sanity/image-url";

const projectId =
  process.env.GATSBY_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "ms3sz7xq";
const dataset =
  process.env.GATSBY_SANITY_DATASET || process.env.SANITY_DATASET || "production";

const builder = imageUrlBuilder({ projectId, dataset });

/**
 * @param {import('@sanity/image-url/lib/types/types').SanityImageSource | null | undefined} source
 */
export function sanityImageUrl(source, options = {}) {
  if (!source?.asset) return null;

  const hasTransformOptions =
    options.width || options.height || options.fit || options.quality;

  if (source.asset.url && !hasTransformOptions) {
    return source.asset.url;
  }

  let url = builder.image(source);
  if (options.width) url = url.width(options.width);
  if (options.height) url = url.height(options.height);
  if (options.fit) url = url.fit(options.fit);
  if (options.quality) url = url.quality(options.quality);
  return url.auto("format").url();
}

/**
 * Maps Sanity image hotspot to CSS object-position (percentages).
 */
export function sanityImageHotspotObjectPosition(
  hotspot,
  fallback = "center top"
) {
  if (
    hotspot &&
    typeof hotspot.x === "number" &&
    typeof hotspot.y === "number"
  ) {
    return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
  }
  return fallback;
}

/**
 * Author card photo — preserves 1:1 (and other) aspect ratios unless hotspot crop is set.
 */
export function sanityAuthorPhotoUrl(source) {
  if (!source?.asset) return null;

  const hasHotspot =
    source.hotspot &&
    typeof source.hotspot.x === "number" &&
    typeof source.hotspot.y === "number";

  if (hasHotspot) {
    return sanityImageUrl(source, {
      width: 264,
      height: 192,
      fit: "crop",
      quality: 90,
    });
  }

  return sanityImageUrl(source, {
    width: 400,
    fit: "max",
    quality: 90,
  });
}

const ARTICLE_BODY_IMAGE_WIDTHS = [480, 768, 1024, 1280, 1920];

/**
 * Article body images: never upscale beyond source dimensions (fit=max).
 * Provides src/srcSet for sharp display up to native resolution on all viewports.
 */
export function sanityArticleBodyImageUrls(source) {
  if (!source?.asset) {
    return { src: null, srcSet: null };
  }

  const options = { fit: "max", quality: 90 };
  const src = sanityImageUrl(source, { ...options, width: 1920 });

  const srcSet = ARTICLE_BODY_IMAGE_WIDTHS.map((width) => {
    const url = sanityImageUrl(source, { ...options, width });
    return url ? `${url} ${width}w` : null;
  })
    .filter(Boolean)
    .join(", ");

  return {
    src,
    srcSet: srcSet || null,
  };
}
