import argon2 from "argon2"
import { fromEnv } from "lib:utils/etc";

export const hash = async (data: string) => {
    const secret = fromEnv('HASH_SECRET');
    const buffer = Buffer.from(secret);

    return await argon2.hash(data, {
        secret: buffer
    })
}

export const verify = async (hash: string, password: string) => {
    const secret = fromEnv('HASH_SECRET');
    const buffer = Buffer.from(secret);

    return await argon2.verify(hash, password, {
        secret: buffer
    });
}