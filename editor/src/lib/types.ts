export interface Article{
    collection: string,
    id: string,
    title: string,
    description: string,
    data: {
        head: Record<string, string>[],
        content: any[]
    },
    createdat: string,
    updatedat: string,
    draft: boolean
}