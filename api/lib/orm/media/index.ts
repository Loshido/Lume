
export interface MediaDriver {
    name: string,
    write(name: string, file: File): Promise<number> | number,
    read(name: string): Promise<File | false> | File | false
    delete(name: string): Promise<number> | number,
    list(): Promise<string[]> | string[]
}

export class MediaStorage {
    driver: MediaDriver
    constructor(driver: MediaDriver) {
        this.driver = driver
    }

    async write(name: string, file: File): Promise<boolean> {
        const bytes = await this.driver.write(name, file)
        return bytes != 0;
    }

    async read(name: string): Promise<File | false> {
        return await this.driver.read(name);
    }
    async delete(name: string): Promise<boolean> {
        const bytes = await this.driver.delete(name)
        return bytes != 0
    }
    async list() {
        return await this.driver.list();
    }
}

import { FileSystem } from "./local"
export default new MediaStorage(FileSystem)


