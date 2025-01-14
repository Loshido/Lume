import Elysia, { t } from "elysia";
import fs from "fs";
import consola from "consola";
import sql from "lib:orm/sql";
import { uncache } from "lib:orm/cache";
import media from "lib:orm/media";

interface Media {
    id: string,
    description: string,
    origin: string,
    createdat: Date
}

export default new Elysia()
    .get('/media', async ({ set }) => {
        // cache layer
        const data = await uncache<Media[]>(`/media`, async (cache) => {
            const client = await sql();
    
            try {
                const response = await client.query<Media>(
                    `SELECT id, description, origin, createdat FROM media;`);
                client.release();
    
                if(response.rowCount && response.rowCount > 0) {
                    await cache(response.rows)
                    return response.rows;
                } else {
                    return 404;
                }
    
            } catch (e) {
                client.release();
                consola.error(e);
                return 500;
            }
        })
        if(data.type == 'failed') {
            set.status = data.value;
            return null;
        }

        set.status = 200;
        return data.value
    }, {
        response: {
            200: t.Array(
                t.Object({
                    id: t.String(),
                    description: t.String(),
                    origin: t.String(),
                    createdat: t.Date()
                })
            ),
            401: t.Null()
        },
        detail: {
            summary: '/media',
            description: 'Get files from the store',
        }
    })
    .get('/media/:id', async ({ set, params }) => {
        try {
            const file = await media.read(params.id);
            if(!file) {
                throw new Error('driver failed to read')
            }
            return file
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