import Elysia, { t } from "elysia";
import sql from "lib:sql";
import Case from "case";

export default new Elysia().post('/', async ({ body, set }) => {
    const client = await sql()

    const id = Case.kebab(body.title);
    try {
        const response = await client.query(`INSERT INTO collections
            (id, name, description) VALUES ($1, $2, $3) RETURNING *`,
            [id, body.title, body.description]);
        client.release()
    
        if(response.rowCount && response.rowCount > 0) {
            set.status = 'OK';
            return response.rows[0]
        } else {
            set.status = 'Bad Request'
            return
        }
    }
    catch(e) {
        client.release()
        set.status = 'Conflict'
        return null
    }
}, {
    body: t.Object({
        title: t.String(),
        description: t.Optional(
            t.String()
        )
    }),
    response: {
        200: t.Object({
            id: t.String(),
            name: t.String(),
            description: t.Union([t.String(), t.Null()])
        }),
        409: t.Null(),
        400: t.Null()
    }
})