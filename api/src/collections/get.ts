import consola from "consola";
import Elysia, { t } from "elysia";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

type ArticleHead = Pick<Article, 
    'id' | 'title' | 'createdat' | 'updatedat' | 'draft'>;

export default new Elysia()
    .get('/collections', async ({ set }) => {
        const client = await sql();

        try {
            const response = await client.query<{
                id: string,
                name: string,
                description: string | null
            }>(`SELECT * FROM collections;`);
            client.release();

            set.status = 'OK';
            return response.rows;

        } catch (e) {
            client.release();
            set.status = 'Internal Server Error';
            consola.error(e);
            return null;
        }
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
        detail: {
            description: 'Get the collections list',
            summary: '/collections/'
        }
    })
    .get('/collections/:collection', async ({ set, params }) => {
        const client = await sql();

        try {
            const response = await client.query<ArticleHead>(
                `SELECT * FROM articles WHERE collection = $1;`,
                [ params.collection ]);
            client.release();

            if(response.rowCount && response.rowCount > 0) {
                set.status = 'OK';
                return response.rows;
            } else {
                set.status = 'Not Found';
                return null;
            }

        } catch (e) {
            client.release();
            set.status = 'Internal Server Error';
            consola.error(e);
            return null;
        }
    }, {
        response: {
            200: t.Array(
                t.Object({
                    id: t.String(),
                    title: t.String(),
                    createdat: t.Date(),
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