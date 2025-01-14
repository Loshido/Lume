import fs from "fs";
import consola from "consola";
import { MediaDriver } from ".";
import { fromEnv } from "lib:utils/etc";

const MEDIA_FOLDER = fromEnv('MEDIA_FOLDER', '../data/media/')
export const FileSystem: MediaDriver = {
    name: 'fs',
    async write(name: string, file: File): Promise<number> {
        const bytes = await file.bytes()
        try {
            fs.writeFileSync(MEDIA_FOLDER + name, bytes);
            return file.size
        } catch(err) {
            consola.error(err)
            return 0
        }
    },
    read(name: string): File | false {
        try {
            const bytes = fs.readFileSync(MEDIA_FOLDER + name)
            const file = new File([bytes], name)
            return file
        } catch(err) {
            consola.error(err)
            return false
        } 
    },
    
    delete(name: string): number {
        try {
            fs.rmSync(MEDIA_FOLDER + name)
            return 1
        } catch(err) {
            consola.error(err)
            return 0
        }
    },
    
    list(): string[] {
        const dir = fs.readdirSync(MEDIA_FOLDER)
        return dir
    }
}