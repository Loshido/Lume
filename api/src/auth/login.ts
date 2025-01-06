import Elysia, { t } from "elysia";

import { sign } from "lib:auth/jwt"
import sql from "lib:orm/sql";
import { hash, verify } from "lib:auth/hash";
import log from "lib:utils/log";
import consola from "consola";

export default new Elysia()
    .post('/auth/login', async ({ set, body: { email, password }, cookie: { jwt, refresh } }) => {
        let id = '';
        let name = '';

        const client = await sql();

        try {
            // We get user data
            const response = await client.query<{ password: string, id: string, name: string }>(`
                SELECT password, id, name
                FROM users
                WHERE email = $1`,
                [ email ]);
            

            // Not found -> bad request
            if(!response.rowCount || response.rowCount == 0) {
                // Release the connection
                client.release();
                log.trace(`attempt to login as ${email} but this user doesn't exist`)
                set.status = 'Bad Request';
                return null;
            }

            const user = response.rows[0];
            // If the password isn't hashed we hash it.
            if(!user.password.startsWith('$argon2')) {
                user.password = await hash(user.password);
                await client.query("UPDATE users SET password = $1 WHERE id = $2", 
                    [user.password, user.id]);
            }
            // Release the connection
            client.release();
            
            const valid = await verify(user.password, password);
            // Password doesn't correspond -> Bad request
            if(!valid) {
                log.trace(`attempt to login as ${email} failed`)
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

        // At this point, user's password is correct
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

        jwt.set({
            value: token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            domain: 'localhost',
            httpOnly: false,
            sameSite: false,
        });

        refresh.set({
            value: refresh_token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 16),
            domain: 'localhost',
            httpOnly: true,
            sameSite: false,

        })

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