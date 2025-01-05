import Elysia from "elysia";
import { swagger } from '@elysiajs/swagger'

import consola from "consola";
const port = fromEnv('PORT', '80')

import collections from "./collections"
import auth from "./auth";
import { fromEnv } from "lib:utils/etc";
import media from "./media";
import editor from "./editor";
import cors from "@elysiajs/cors";
import storage from "lib:orm/cache";

const app = new Elysia()
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Lume - API',
                    version: '1.0.0'
                },
                tags: [
                    {
                        name: "Authentification",
                        description: "Endpoint for manager authentification"
                    },
                    {
                        name: "Content",
                        description: "Endpoint for content management"
                    },
                    {
                        name: "Media",
                        description: "Endpoint for media management"
                    },
                    {
                        name: "Editor",
                        description: "Endpoint for Editor's configuration"
                    },
                ]
            },
            scalarConfig: {
                hideDownloadButton: true,
                hiddenClients: true,
            },
        })
    )
    .use(cors())
    .use(auth)
    .use(collections)
    .use(media)
    .use(editor)
    .listen(port);

consola.success(`Lume's API listen at ${app.server?.hostname}:${app.server?.port}`);
