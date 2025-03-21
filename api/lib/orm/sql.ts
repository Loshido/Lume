import { fromEnv } from "lib:utils/etc";
import { Pool } from "pg";

const DEFAULT_CONFIGURATION = {
    host: fromEnv('POSTGRES_HOST', '127.0.0.1'),
    port: 5432,
    user: 'postgres',
    database: 'postgres',
    max: 50
}

const clients = new Pool({
    ...DEFAULT_CONFIGURATION,
    password: fromEnv('POSTGRES_PASSWORD'),
});

process.on('exit', async () => {
    await clients.end()
})

export default async () => await clients.connect();