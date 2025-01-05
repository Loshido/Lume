import consola from "consola";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";

// uses memory
const storage = createStorage({
    driver: memoryDriver()
});

export interface Cache<T> {
    tm: number,
    data: T
}

type CallbackCacheFn<T> = (data: T) => Promise<void>

type UncacheResponse<T> = 
    { type: 'cache', value: T } |
    { type: 'callback', value: T } |
    { type: 'failed', value: number }

export async function uncache<T>(key: string, 
    cb: (cache: CallbackCacheFn<T>) => Promise<T | number>, 
    ttl: number = 1000 * 60): Promise<UncacheResponse<T>> {
    const cache = await storage.get<Cache<T>>(key)
    if(cache && cache.tm > Date.now() + ttl) {
        consola.trace(`cache used with key: ${key}`);
        return {
            type: 'cache',
            value: cache.data
        };
    }

    // We pass a function to cache the item in the callback function
    const callback = await cb(async (data) => {
        await storage.setItem(key, {
            tm: Date.now(),
            data
        })
    });

    if(typeof callback != 'number') {
        return {
            type: 'callback',
            value: callback
        }
    }
    return {
        type: 'failed',
        value: callback
    }
}

export default storage;