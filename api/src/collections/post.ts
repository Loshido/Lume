import Elysia, { t } from "elysia";
import sql from "lib:orm/sql";
import { kebabCase } from "scule";
import { factory } from "lib:auth/jwt";

// Creates a new collection of articles
export default new Elysia().post('/collections', async ({ body, set, cookie: { jwt, refresh } }) => {
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

    // ID are in kebab-case
    const id = kebabCase(body.title);
    
    if(id.length < 5) {
        set.status = 'Bad Request';
        return id;
    }
    try {
        const response = await client.query(`INSERT INTO collections
            (id, name, description) VALUES ($1, $2, $3) RETURNING *`,
            [id, body.title, body.description]);
        client.release();
    
        if(response.rowCount && response.rowCount > 0) {
            set.status = 'OK';
            return response.rows[0];
        } else {
            set.status = 'Bad Request';
            return "";
        }
    }
    catch(e) {
        client.release();
        set.status = 'Conflict';
        return null;
    }
}, {
    body: t.Object({
        title: t.String(),
        description: t.Optional(
            t.String()
        )
    }),
    response: {
        401: t.Null(),
        200: t.Object({
            id: t.String(),
            name: t.String(),
            description: t.Union([t.String(), t.Null()])
        }),
        409: t.Null(),
        400: t.String(),
    },
    cookie: t.Cookie({
        jwt: t.Optional(t.String()),
        refresh: t.Optional(t.String())
    }),
    detail: {
        description: 'Create a new collection (must be authentificated)',
        summary: '/collections'
    }
})