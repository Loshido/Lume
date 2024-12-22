import Elysia, { t } from "elysia";

import { sign } from "lib:auth/jwt"
import sql from "lib:orm/sql";
import { verify } from "lib:auth/hash";
import consola from "consola";
import log from "lib:utils/log";
export default new Elysia()
    .post('/auth/login', async ({ set, body: { email, password }, cookie: { jwt, refresh } }) => {
        let id = '';
        let name = '';

        const client = await sql();

        try {
            // We get user informations
            const response = await client.query<{ password: string, id: string, name: string }>(`
                SELECT password, id, name
                FROM users
                WHERE email = $1`,
                [ email ]);
            // Release the connection
            client.release();

            // Not found -> bad request
            if(!response.rowCount || response.rowCount == 0) {
                set.status = 'Bad Request';
                return null;
            }

            const user = response.rows[0];
            const valid = await verify(user.password, password);
            // Password doesn't correspond -> Bad request
            if(!valid) {
                set.status = 'Bad Request';
                return null;
            }

            id = user.id;
            name = user.name;
        } catch(e) {
            client.release()
            set.status = 'Internal Server Error';
            consola.debug(`[/auth/login]`, e)
            return null
        }

        // At this point, the user's password is correct
        // we consider the user as logged.

        const token = await sign({
            id,
            name,
            email
        });

        const refresh_token = await sign({
            id,
            name,
            email
        }, '16 weeks');

        jwt.value = token;
        jwt.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        refresh.value = refresh_token;
        refresh.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 16)

        log.trace(`${email} logged in`)
        set.status = 'OK';
        return token
    }, {
        body: t.Object({
            email: t.String({
                format: 'email'
            }),
            password: t.String({
                minLength: 6
            })
        }),
        response: {
            200: t.String(),
            400: t.Null(),
            500: t.Null()
        },
        detail: {
            description: 'Login with credentials, responds with \'Set-cookie\' headers & the JWT as body',
        }
    })