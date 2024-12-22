import consola from "consola";
import Elysia, { t } from "elysia";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

type Head = Pick<Article, 'title' | 'createdat' | 'updatedat'>;

export default new Elysia()
    .get('/collections/:collection/:article', async ({ params, set }) => {
        const client = await sql();

        try {
            const response = await client.query<Article>(`SELECT * FROM articles
                WHERE collection = $1 AND id = $2`, [ params.collection, params.article ]);
            client.release()
            
            if(response.rowCount && response.rowCount > 0) {
                set.status = 'OK';
                return response.rows[0];
            } else {
                set.status = 'Not Found';
                return null;
            }
        } catch (e) {
            client.release()
            set.status = 'Internal Server Error';
            consola.error(e);
            return null;
        }
    }, {
        response: {
            200: t.Object({
                collection: t.String(),
                id: t.String(),
                title: t.String(),
                content: t.String(),
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
    .get('/collections/:collection/:article/head', async ({ params, set }) => {
        const client = await sql();

        try {
            const response = await client.query<Head>(`
                SELECT title, createdat, updatedat 
                FROM articles
                WHERE collection = $1 AND id = $2`, 
                [ params.collection, params.article ]);
            client.release()
            
            if(response.rowCount && response.rowCount > 0) {
                set.status = 'OK';
                console.log(response.rows)
                return response.rows;
            } else {
                set.status = 'Not Found';
                return null;
            }
        } catch (e) {
            client.release()
            set.status = 'Internal Server Error';
            consola.error(e);
            return null;
        }
    }, {
        response: {
            200: t.Array(
                t.Object({
                    title: t.String(),
                    createdat: t.Date(),
                    updatedat: t.Date(),
                })
            ),
            404: t.Null(),
            500: t.Null()
        },
        detail: {
            description: 'Get the head of an article for a specified collection',
            summary: '/collections/:col…/:art…/head'
        }
    })