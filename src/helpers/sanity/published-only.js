const PUBLISHED_ID_FILTER = `!(_id in path("drafts.**"))`;

function isPublishedSanityId(id) {
  return typeof id === "string" && id.length > 0 && !id.startsWith("drafts.");
}

function isPublishedSanityDocument(doc) {
  return Boolean(doc && isPublishedSanityId(doc._id));
}

function filterPublishedSanityDocuments(documents) {
  if (!Array.isArray(documents)) return [];
  return documents.filter(isPublishedSanityDocument);
}

module.exports = {
  PUBLISHED_ID_FILTER,
  isPublishedSanityId,
  isPublishedSanityDocument,
  filterPublishedSanityDocuments,
};
