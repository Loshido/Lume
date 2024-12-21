import consola from "consola"
import { createClient } from "redis"

export default async () => {
    return await createClient()
        .on('error', err => consola.error('[Redis package]', err))
        .connect()
}