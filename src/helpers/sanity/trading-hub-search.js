export function extractPortableTextPlainText(blocks = []) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .flatMap((block) => {
      if (block?._type === "block" && Array.isArray(block.children)) {
        return block.children.map((child) => child?.text || "");
      }

      if (block?._type === "image") {
        return [block.alt, block.caption].filter(Boolean);
      }

      return [];
    })
    .join(" ")
    .trim();
}

export function buildArticleSearchText(article = {}) {
  const parts = [
    article.title,
    article.subtitle,
    article.categoryTitle,
    article.authorName,
    article.authorRole,
    article.slug?.current,
    article.seo?.title,
    article.seo?.description,
    extractPortableTextPlainText(article.body),
  ];

  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function articleMatchesSearch(article, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchText = article.searchText || buildArticleSearchText(article);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return terms.every((term) => searchText.includes(term));
}
