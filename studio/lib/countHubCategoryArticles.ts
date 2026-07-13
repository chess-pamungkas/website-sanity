import type {SanityClient} from '@sanity/client'

export async function countHubCategoryArticles(
  client: SanityClient,
  categoryDocumentId: string,
): Promise<number> {
  const categoryId = categoryDocumentId.replace(/^drafts\./, '')

  return client.fetch<number>(
    `count(*[_type == "hubArticle" && references($categoryId)])`,
    {categoryId},
    {tag: 'hub-categories.count-articles'},
  )
}
