import consola from "consola";
import Elysia, { t } from "elysia";
import sql from "lib:sql";
import { Article } from "lib:types";

export default new Elysia()
    .post('/collections/:col/:article', async ({ params, body, set }) => {
        const client = await sql();
        
        try {
            const response = await client.query<Article>(`INSERT INTO article
                (collection, id, title, content, draft) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`, 
                [
                    params.col,
                    params.article,
                    body.title,
                    body.content,
                    body.draft
                ]);
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
            set.status = 'Conflict';
            consola.error(e)
            return null;
        }

    }, {
        body: t.Object({
            title: t.String(),
            content: t.String(),
            draft: t.Boolean()
        }),
        response: {
            200: t.String(), // Article's id
            409: t.Null(),
            500: t.Null()
        }
    })