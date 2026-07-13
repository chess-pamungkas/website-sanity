export const HUB_CATEGORIES_API_VERSION = 'v2025-06-27'
export const SORT_FIELD_NAME = 'sortOrder'

type HubCategoriesListQueryOptions = {
  currentVersion?: string
}

export function getHubCategoriesListQuery({currentVersion}: HubCategoriesListQueryOptions = {}) {
  let perspectiveFilter: string | null = null

  if (currentVersion === 'published') {
    perspectiveFilter = '!(_id in path("drafts.**")) && !(_id in path("versions.**"))'
  } else if (currentVersion === 'drafts') {
    perspectiveFilter =
      '(_id in path("drafts.**") || (!(_id in path("drafts.**")) && !(_id in path("versions.**"))))'
  } else if (currentVersion) {
    perspectiveFilter =
      '(sanity::partOfRelease($currentVersion) || (!(_id in path("drafts.**")) && !(_id in path("versions.**"))) || (_id in path("drafts.**")))'
  }

  const querySelect = `*[_type == "hubCategory"${perspectiveFilter ? ` && ${perspectiveFilter}` : ''}]`
  const queryOrder = `| order(${SORT_FIELD_NAME} asc)`
  const queryFields = `{_id, _type, ${SORT_FIELD_NAME}, isActive, title}`
  const query = `${querySelect}${queryOrder}${queryFields}`

  return {
    query,
    queryParams: {
      ...(currentVersion ? {currentVersion} : {}),
    },
  }
}
