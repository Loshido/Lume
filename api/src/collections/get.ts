import consola from "consola";
import Elysia, { t } from "elysia";
import { uncache } from "lib:orm/cache";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

type ArticleHead = Pick<Article, 
    'id' | 'title' | 'updatedat' | 'draft' | 'description'>;

interface Collection {
    id: string,
    name: string,
    description: string | null
}

export default new Elysia()
    .get('/collections', async ({ set, query: { id } }) => {
        // Use a cache layer
        const data = await uncache<Collection[]>('/collections', async (cache) => {
            const client = await sql();
    
            try {
                const response = id 
                ? await client.query<Collection>(`SELECT * FROM collections WHERE id = $1`, [id])
                : await client.query<Collection>(`SELECT * FROM collections;`);
                client.release();

                if(!id) {
                    // We don't cache there a scoped collection.
                    await cache(response.rows)
                }

                return response.rows;
            } catch (e) {
                client.release();
                consola.error(e);
                return 500;
            }
        })
        if(data.type == 'failed') {
            set.status = 'Internal Server Error';
            return null;
        }

        set.status = 'OK';
        return data.value;
    }, {
        response: {
            200: t.Array(
                t.Object({
                    id: t.String(),
                    name: t.String(),
                    description: t.Union([
                        t.Null(),
                        t.String()
                    ])
                })
            ),
            500: t.Null()
        },
        query: t.Object({
            id: t.Optional(t.String())
        }),
        detail: {
            description: 'Get the collections list',
            summary: '/collections/'
        }
    })
    .get('/collections/:collection', async ({ set, params }) => {
        // cache layer
        const data = await uncache<ArticleHead[]>(`/collections/${params.collection}`, async (cache) => {
            const client = await sql();
    
            try {
                const response = await client.query<ArticleHead>(
                    `SELECT id, title, description, updatedat, draft FROM articles WHERE collection = $1;`,
                    [ params.collection ]);
                client.release();
    
                if(response.rowCount && response.rowCount > 0) {
                    await cache(response.rows)
                    return response.rows;
                } else {
                    return 404;
                }
    
            } catch (e) {
                client.release();
                consola.error(e);
                return 500;
            }
        })
        if(data.type == 'failed') {
            set.status = data.value;
            return null;
        }

        set.status = 200;
        return data.value

    }, {
        response: {
            200: t.Array(
                t.Object({
                    id: t.String(),
                    title: t.String(),
                    description: t.String(),
                    updatedat: t.Date(),
                    draft: t.Boolean()
                })
            ),
            404: t.Null(),
            500: t.Null()
        },
        detail: {
            description: 'Get the articles from a collection',
            summary: '/collections/:collection/'
        }
    })