import Elysia, { t } from "elysia";
import fs from "fs";
import consola from "consola";
import { fromEnv } from "lib:utils/etc";

const MEDIA_FOLDER = fromEnv('MEDIA_FOLDER', '../data/media')

export default new Elysia()
    .get('/media/:id', async ({ set, params }) => {
        try {
            const file = fs.readFileSync(MEDIA_FOLDER + `/${params.id}`);

            return new File([file], params.id)

        } catch (e) {
            consola.debug(e);

            set.status = 'Not Found';
            return null
        }
    }, {
        response: {
            200: t.File(),
            404: t.Null()
        },
        detail: {
            summary: '/media/:id',
            description: 'Get a file from the store',
        }
    })