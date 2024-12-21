import consola from "consola";
import Elysia, { t } from "elysia";
import sql from "lib:sql";

export default new Elysia().get('/', async ({ set }) => {
    const client = await sql()

    try {
        const response = await client.query<{
            id: string,
            name: string,
            description: string | null
        }>(`SELECT * FROM collections;`);
        client.release()

        set.status = 'OK';
        return response.rows

    } catch (e) {
        client.release()
        set.status = 'Internal Server Error'
        consola.error(e)
        return null
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
    }
})