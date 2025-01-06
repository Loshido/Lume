import Elysia, { t } from "elysia";

import { factory } from "lib:auth/jwt"

export default new Elysia()
    .post('/auth/refresh', async ({ set, body }) => {
        const { type, value } = await factory(undefined, body);
        if(type === 'refresh') {
            set.status = 200;
            return value
        };

        set.status = 403
        return null
    }, {
        body: t.String(),
        response: {
            200: t.String(),
            403: t.Null(),
        },
        detail: {
            description: 'Gives a JWT token if the refresh token is valid.',
        }
    })