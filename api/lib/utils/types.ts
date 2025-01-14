export interface Collection {
    id: string,
    name: string,
    description: string | null
}

interface ArticleData {
    head: Record<string, string>[],
    content: any[],
}

export interface Article {
    collection: string,
    id: string,
    title: string,
    description: string,
    data: ArticleData,
    createdat: Date,
    updatedat: Date,
    draft: boolean
}