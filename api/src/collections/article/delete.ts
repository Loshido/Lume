import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import sql from "lib:orm/sql";
import log from "lib:utils/log";
import { Article } from "lib:utils/types";

export default new Elysia().delete('/collections/:collection/:article', async ({ set, params, cookie: { jwt, refresh } }) => {
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
        const response = await client.query<Article>(`DELETE FROM articles
            WHERE collection = $1 AND id = $2 RETURNING *`, [ params.collection, params.article ]);
        client.release();
    
        if(response.rowCount && response.rowCount > 0) {
            set.status = 'OK';
            log.trace(`Article '${params.article}' from '${params.collection}' has been removed`)
            return response.rows[0];
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
            collection: t.String(),
            id: t.String(),
            title: t.String(),
            content: t.String(),
            createdat: t.Date(),
            updatedat: t.Date(),
            draft: t.Boolean()
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
        description: 'Delete an article (must be authentificated)',
        summary: '/collections/:col…/:article'
    }
})