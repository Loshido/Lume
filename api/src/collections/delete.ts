import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import sql from "lib:orm/sql";
import { Article, Collection } from "lib:utils/types";

export default new Elysia().delete('/collections/:collection', async ({ set, params, cookie: { jwt, refresh } }) => {
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
        const articles = await client.query<Article>(`DELETE FROM articles
            WHERE collection = $1 RETURNING *`, [ params.collection ]);
        const response = await client.query<Collection>(`DELETE FROM collections
            WHERE id = $1 RETURNING *`,
            [ params.collection ]);
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
        500: t.Null(),
        401: t.Null()
    },
    cookie: t.Cookie({
        jwt: t.Optional(t.String()),
        refresh: t.Optional(t.String())
    }),
    detail: {
        description: 'Delete a collection (must be authentificated)',
        summary: '/collections/:collection/'
    }
})