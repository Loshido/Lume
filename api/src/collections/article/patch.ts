import consola from "consola";
import Elysia, { t } from "elysia";
import sql from "lib:sql";
import { Article } from "lib:types";

export default new Elysia()
    .patch('/collections/:col/:article', async ({ set, params, body }) => {
        const client = await sql();

        const keys = Object.keys(body)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(', ');

        const values = Object.values(body)
        const query = `UPDATE article 
        SET ${keys} 
        WHERE id = $${ values.length + 1 } AND collection = $${values.length + 2}
        RETURNING *`
        consola.trace(`[/collections/:col/:article PATCH] query: ${query}`)
        
        try {
            const response = await client.query<Article>(query, 
                [ ...values, params.article, params.col ]);
            client.release()

            if(response.rowCount && response.rowCount > 0) {
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
            content: t.Optional(t.String()),
            draft: t.Optional(t.Boolean()),
        }),
        response: {
            200: t.String(),
            500: t.Null(),
            404: t.Null()
        }
    })