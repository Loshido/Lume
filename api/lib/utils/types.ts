export interface Collection {
    id: string,
    name: string,
    description: string | null
}

export interface Article {
    collection: string,
    id: string,
    title: string,
    content: string,
    createdat: Date,
    updatedat: Date,
    draft: boolean
}