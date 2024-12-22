import Elysia from "elysia";
import fs from "fs";
import { fromEnv } from "lib:utils/etc";

const MEDIA_FOLDER = fromEnv('MEDIA_FOLDER', '../data/media')

import post from "./post";
import rm from "./delete";
import sql from "lib:orm/sql";
import get from "./get";
export default new Elysia({
    detail: {
        tags: ['Media']
    }
})
    .use(post)
    .use(rm)
    .use(get)
    .onStart(async () => {
        const client = await sql()

        const response = await client.query<{ id: string }>(`SELECT id FROM media;`);
        client.release()

        const folder = fs.readdirSync(MEDIA_FOLDER, {
            recursive: true
        })

        if(!response.rowCount || response.rowCount === 0) {
            for(const file of folder) {
                fs.rmSync(MEDIA_FOLDER + `/${file}`)
            }
            return
        }

        const distant_files = response.rows.map(v => v.id);
        console.log(folder)
        for(const file of folder) {
            if(!distant_files.includes(file.toString())) {
                fs.rmSync(MEDIA_FOLDER + `/${file}`);
            }
        }
    })