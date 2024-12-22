import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import fs from "fs";
import sql from "lib:orm/sql";
import consola from "consola";
import { fromEnv } from "lib:utils/etc";

const MEDIA_FOLDER = fromEnv('MEDIA_FOLDER', '../data/media')

export default new Elysia()
    .delete('/media', async ({ body, set, cookie: { jwt, refresh } }) => {
        const { type, value } = await factory(jwt.value, refresh.value);
        if(type === 'failed') {
            set.status = 'Unauthorized';
            return null
        } else if (type === 'refresh') {
            jwt.update({
                value,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            })

            // Ask the user to retry because his token was expired.
            set.status = 'Precondition Failed'
            return null
        }

        const client = await sql()
        
        try {
            const response = await client.query(`DELETE FROM media
                WHERE id = $1 AND origin = $2
                RETURNING *`,
                [body.id, value.id])
            client.release()

            if(!response.rowCount || response.rowCount == 0) {
                set.status = 'Expectation Failed';
                return null
            }

            fs.rmSync(MEDIA_FOLDER + `/${body.id}`)
    
            set.status = 'OK'
            return body.id
        } catch(e) {
            client.release()
            set.status = 'Internal Server Error';
            consola.debug(e)
            return null
        }
    }, {
        response: {
            401: t.Null(),
            500: t.Null(),
            200: t.String(),
            412: t.Null(),
            417: t.Null(),
        },
        body: t.Object({
            id: t.String()
        }),
        cookie: t.Cookie({
            jwt: t.Optional(t.String()),
            refresh: t.Optional(t.String())
        }),
        detail: {
            description: 'Remove a media from the store (you must be authentificated)',
        }
    })