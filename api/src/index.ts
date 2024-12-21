import Elysia from "elysia";
import { swagger } from '@elysiajs/swagger'

import consola from "consola";
const port = process.env.PORT || 80

import collections from "./collections"

const app = new Elysia()
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Lume API Documentation',
                    version: '1.0.0'
                }
            },
            scalarConfig: {
                hideDownloadButton: true,
                hiddenClients: true,
            }
        })
    )
    .use(collections)
    .listen(port);

consola.success(`Lume's API listen at ${app.server?.hostname}:${app.server?.port}`);
