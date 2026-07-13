export const ORDER_FIELD_NAME = 'orderRank'
export const HUB_ARTICLES_API_VERSION = 'v2025-06-27'

type HubArticlesListQueryOptions = {
  type: string
  filter?: string
  params?: Record<string, unknown>
  currentVersion?: string
}

export function getHubArticlesListQuery({
  type,
  filter,
  params = {},
  currentVersion,
}: HubArticlesListQueryOptions) {
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

  const querySelect = `*[_type == $type${perspectiveFilter ? ` && ${perspectiveFilter}` : ''}${filter ? ` && ${filter}` : ''}]`
  const queryOrder = '| order(@[$order] asc)'
  const queryFields = `{_id, _type, ${ORDER_FIELD_NAME}, title}`
  const query = `${querySelect}${queryOrder}${queryFields}`

  return {
    query,
    queryParams: {
      ...params,
      type,
      order: ORDER_FIELD_NAME,
      ...(currentVersion ? {currentVersion} : {}),
    },
  }
}
