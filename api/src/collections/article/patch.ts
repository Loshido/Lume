import consola from "consola";
import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import storage from "lib:orm/cache";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

export default new Elysia()
    .patch('/collections/:collection/:article', async ({ set, params, body, cookie: { jwt, refresh } }) => {
        const { type, value } = await factory(jwt.value, refresh.value);
        if(type === 'failed') {
            set.status = 'Unauthorized';
            return null
        } else if (type === 'refresh') {
            jwt.update({
                value,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            })
        }

        const client = await sql();

        // into "key = $1, key2 = $2..."
        const keys = Object.keys(body)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(', ');

        // content value need to be stringified
        const values = Object.entries(body)
            .map(([key, value]) => key == 'content' ? JSON.stringify(value) : value)
        const query = `UPDATE articles 
            SET ${keys} 
            WHERE id = $${ values.length + 1 } AND collection = $${values.length + 2}
            RETURNING *`
        consola.trace(`[/collections/:collection/:article PATCH] query: ${query}`)
        
        try {
            const response = await client.query<Article>(query, 
                [ ...values, params.article, params.collection ]);
            client.release()

            if(response.rowCount && response.rowCount > 0) {
                // cache is not updated
                await storage.removeItem(`/collections/${params.collection}`)
                await storage.removeItem(`/collections/${params.collection}/${params.article}`)
                await storage.removeItem(`/collections/${params.collection}/${params.article}/html`)
                set.status = 'OK';
                return response.rows[0].id;
            } else {
                set.status = 'Internal Server Error';
                return null;
            }
        } catch (e) {
            client.release();
            set.status = 'Not Found';
            consola.error(e);
            return null;
        }
    }, {
        body: t.Object({
            collection: t.Optional(t.String()),
            id: t.Optional(t.String()),
            title: t.Optional(t.String()),
            description: t.Optional(t.String()),
            data: t.Optional(t.Object({
                head: t.Array(t.Record(t.String(), t.String())),
                content: t.Array(t.Any()),
            })),
            draft: t.Optional(t.Boolean()),
        }),
        response: {
            200: t.String(),
            500: t.Null(),
            404: t.Null(),
            401: t.Null()
        },
        cookie: t.Cookie({
            jwt: t.Optional(t.String()),
            refresh: t.Optional(t.String())
        }),
        detail: {
            description: 'Modify an article (must be authentificated)',
            summary: '/collections/:col…/:article'
        }
    })