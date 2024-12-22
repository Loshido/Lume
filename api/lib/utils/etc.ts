import consola from "consola";

export const fromEnv = (key: string, default_value?: string) => {
    const value = process.env[key];
    if(value) return value

    consola.warn(`No value for environment variable '${key}'.`);
    return default_value || key
}