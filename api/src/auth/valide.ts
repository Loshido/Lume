import Elysia, { t } from "elysia";

import { factory } from "lib:auth/jwt"

export default new Elysia()
    .post('/auth/valide', async ({ set, body }) => {
        const { type } = await factory(body);
        if(type === 'failed') {
            set.status = 403;
            return null
        };

        set.status = 'OK';
        return null
    }, {
        body: t.String(),
        response: {
            200: t.Null(),
            403: t.Null(),
        },
        detail: {
            description: 'Checks whether the given JWT token is valid.',
        }
    })