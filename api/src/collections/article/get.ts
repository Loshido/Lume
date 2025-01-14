import consola from "consola";
import Elysia, { t } from "elysia";
import { uncache } from "lib:orm/cache";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

export default new Elysia()
    .get('/collections/:collection/:article', async ({ params, set }) => {
        // cache layer
        const data = await uncache<Article>(`/collections/${params.collection}/${params.article}`,
            async (cache) => {
                const client = await sql();
        
                try {
                    const response = await client.query<Article>(`SELECT * FROM articles
                        WHERE collection = $1 AND id = $2`, [ params.collection, params.article ]);
                    client.release()
                    
                    if(response.rowCount && response.rowCount > 0) {
                        // Put in the cache layer
                        await cache(response.rows[0])
                        return response.rows[0];
                    } else {
                        return 404
                    }
                } catch (e) {
                    client.release()
                    consola.error(e);
                    return 500;
                }
            }
        )
        if(data.type == 'failed') {
            set.status = data.value;
            return null;
        }
        set.status = 200;
        return data.value
    }, {
        response: {
            200: t.Object({
                collection: t.String(),
                id: t.String(),
                title: t.String(),
                description: t.String(),
                data: t.Object({
                    head: t.Array(t.Record(t.String(), t.String())),
                    content: t.Array(t.Any()),
                }),
                createdat: t.Date(),
                updatedat: t.Date(),
                draft: t.Boolean()
            }),
            404: t.Null(),
            500: t.Null()
        },
        detail: {
            description: 'Get an article for a specified collection',
            summary: '/collections/:col…/:article'
        }
    })