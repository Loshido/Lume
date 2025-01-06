import Elysia, { t } from "elysia";
import { factory } from "lib:auth/jwt";
import fs from "fs";
import sql from "lib:orm/sql";
import consola from "consola";
import { fromEnv } from "lib:utils/etc";

const MEDIA_FOLDER = fromEnv('MEDIA_FOLDER', '../data/media')

export default new Elysia()
    .post('/media', async ({ body, set, cookie: { jwt, refresh } }) => {
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
        console.log(value)

        const client = await sql()
        
        // File extension
        const ext = body.file.name.split('.').at(-1);
        // Random name + extension
        const name = crypto.randomUUID().slice(0, 18) + `.${ext}`;

        try {
            const response = await client.query(`INSERT INTO media
                (id, description, origin)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [name, body.description, value.id])
            client.release()

            if(!response.rowCount || response.rowCount == 0) {
                set.status = 'Expectation Failed';
                return null
            }

            const data = await body.file.bytes()
            fs.writeFileSync(MEDIA_FOLDER + `/${name}`, data);
    
            set.status = 'OK'
            return name
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
            file: t.File({
                maxSize: '5m'
            }),
            description: t.Optional(t.String())
        }),
        cookie: t.Cookie({
            jwt: t.Optional(t.String()),
            refresh: t.Optional(t.String())
        }),
        detail: {
            description: 'Push a new media to the store (you must be authentificated)',
        }
    })