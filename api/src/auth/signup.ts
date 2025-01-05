import Elysia, { t } from "elysia";

import { factory } from "lib:auth/jwt"
import sql from "lib:orm/sql";
import { hash } from "lib:auth/hash";
import consola from "consola";
import log from "lib:utils/log";
import { kebabCase } from "scule";
export default new Elysia()
    .post('/auth/signup', async ({ set, body: { email, password }, cookie: { jwt, refresh } }) => {
        const { type, value } = await factory(jwt.value, refresh.value);
        if(type === 'failed') {
            set.status = 'Unauthorized';
            return null
        } else if (type === 'refresh') {
            jwt.update({
                value,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            });

            // Ask the user to retry because his token was expired.
            set.status = 'Precondition Failed'
            return null
        };

        const client = await sql();

        try {
            // We get user informations
            const response = await client.query<{ id: string }>(`
                SELECT id
                FROM users
                WHERE id = $1 AND permission LIKE 'A__'`,
                [ value ]);

            // Not found -> bad request
            if(!response.rowCount || response.rowCount == 0) {
                set.status = 'Unauthorized';
                return null;
            }
        } catch(e) {
            client.release()
            set.status = 'Internal Server Error';
            consola.debug(`[/auth/signup]`, e)
            return null
        }

        const hashed_password = await hash(password);
        const name = email.split('@')[0];
        const id = kebabCase(name);
        try {
            const response = await client.query(`INSERT INTO users
                (id, email, name, password)
                VALUES ($1, $2, $3, $4)
                RETURNING *`, 
                [id, email, name, hashed_password]);
            client.release()

            
            if(response.rowCount && response.rowCount > 0) {
                log.trace(`${value.email} registered a new user (${email})`)
                set.status = 'OK';
                return id;
            } else {
                // Should never happen
                set.status = 'I\'m a teapot';
                return null;
            }
            
        } catch(e) {
            client.release()
            set.status = 'Internal Server Error';
            consola.debug(`[/auth/signup]`, e)
            return null
        }
    }, {
        body: t.Object({
            email: t.String({
                format: 'email'
            }),
            password: t.String({
                minLength: 6
            })
        }),
        cookie: t.Cookie({
            jwt: t.Optional(t.String()),
            refresh: t.Optional(t.String())
        }),
        response: {
            200: t.String(),
            500: t.Null(),
            418: t.Null(),
            412: t.Null(),
            401: t.Null()
        },
        detail: {
            description: 'Register a new user (must be authentificated & have the A++ permission)',
        }
    })