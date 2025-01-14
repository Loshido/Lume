import consola from "consola";
import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import storage from "lib:orm/cache";
import sql from "lib:orm/sql";
import { Article } from "lib:utils/types";

export default new Elysia()
    .post('/collections/:collection/:article', async ({ params, body, set, cookie: { jwt, refresh } }) => {
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
        
        try {
            const response = await client.query<Article>(`INSERT INTO articles
                (collection, id, title, description, data, draft) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`, 
                [
                    params.collection,
                    params.article,
                    body.title,
                    body.description,
                    JSON.stringify(body.data),
                    body.draft
                ]);
            client.release()

            if(response.rowCount && response.rowCount > 0) {
                await storage.removeItem(`/collections/${params.collection}`);
                set.status = 'OK';
                return response.rows[0].id;
            } else {
                set.status = 'Not Found';
                return null;
            }
        } catch (e) {
            client.release();
            set.status = 'Conflict';
            consola.error(e)
            return null;
        }

    }, {
        body: t.Object({
            title: t.String(),
            description: t.String(),
            data: t.Object({
                head: t.Array(t.Record(t.String(), t.String())),
                content: t.Array(t.Any()),
            }),
            draft: t.Boolean()
        }),
        response: {
            200: t.String(), // Article's id
            409: t.Null(),
            404: t.Null(),
            401: t.Null()
        },
        cookie: t.Cookie({
            jwt: t.Optional(t.String()),
            refresh: t.Optional(t.String())
        }),
        detail: {
            description: 'Create a new article for a specified collection (must be authentificated)',
            summary: '/collections/:col…/:article'
        }
    })