import { Pool } from "pg";

const DEFAULT_CONFIGURATION = {
    host: 'localhost',
    user: 'api',
    database: 'postgres',
    max: 50
}

export default async () => {
    const secret = process.env.POSTGRES_API_PASSWORD || '';

    return await new Pool({
        ...DEFAULT_CONFIGURATION,
        password: secret,
    }).connect()
}