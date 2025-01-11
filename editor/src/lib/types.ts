export interface Article{
    collection: string,
    id: string,
    title: string,
    description: string,
    content: {
        head: Record<string, string>[],
        content: any[]
    },
    createdat: string,
    updatedat: string,
    draft: boolean
}