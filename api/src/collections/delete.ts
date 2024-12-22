import Elysia, { t } from "elysia";
import sql from "lib:sql";
import { Article, Collection } from "lib:types";

export default new Elysia().delete('/collections/:col', async ({ set, params }) => {
    const client = await sql();

    try {
        const articles = await client.query<Article>(`DELETE FROM article
            WHERE collection = $1 RETURNING *`, [ params.col ]);
        const response = await client.query<Collection>(`DELETE FROM collections
            WHERE id = $1 RETURNING *`,
            [ params.col ]);
        client.release();
    
        if(response.rowCount && response.rowCount > 0) {
            set.status = 'OK';
            return {
                articles: articles.rows,
                collection: response.rows[0]
            };
        } else {
            set.status = 'Not Found';
            return null;
        }
    }
    catch(e) {
        client.release();
        set.status = 'Internal Server Error';
        return null;
    }
}, {
    response: {
        200: t.Object({
            articles: t.Array(
                t.Object({
                    collection: t.String(),
                    id: t.String(),
                    title: t.String(),
                    content: t.String(),
                    createdat: t.Date(),
                    updatedat: t.Date(),
                    draft: t.Boolean()
                })
            ),
            collection: t.Object({
                id: t.String(),
                name: t.String(),
                description: t.Union([t.String(), t.Null()])
            })
        }),
        404: t.Null(),
        500: t.Null()
    }
})