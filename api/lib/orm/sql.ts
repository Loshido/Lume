import { fromEnv } from "lib:utils/etc";
import { Pool } from "pg";

const DEFAULT_CONFIGURATION = {
    host: 'localhost',
    user: 'api',
    database: 'postgres',
    max: 50
}

export default async () => {
    const secret = fromEnv('POSTGRES_API_PASSWORD');

    return await new Pool({
        ...DEFAULT_CONFIGURATION,
        password: secret,
    }).connect()
}