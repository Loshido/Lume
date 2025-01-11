import consola from "consola";
import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import storage from "lib:orm/cache";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

export default new Elysia()
    .patch('/collections/:collection', async ({ set, params, body, cookie: { jwt, refresh } }) => {
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

        const keys = Object.keys(body)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(', ');

        const values = Object.values(body)
        const query = `UPDATE collections 
            SET ${keys} 
            WHERE id = $${ values.length + 1 }
            RETURNING *`
        consola.trace(`[/collections/:collection/ PATCH] query: ${query}`)
        
        try {
            const response = await client.query<Article>(query, 
                [ ...values, params.collection ]);
            client.release()

            if(response.rowCount && response.rowCount > 0) {
                await storage.removeItem('/collections')
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
            id: t.Optional(t.String()),
            description: t.Optional(t.String()),
            name: t.Optional(t.String()),
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
            description: 'Modify a collection (must be authentificated)',
            summary: '/collections/:collection/'
        }
    })