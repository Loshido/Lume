import { generateHTML } from "@tiptap/html";
import consola from "consola";
import Elysia, { t } from "elysia";
import { uncache } from "lib:orm/cache";
import sql from "lib:orm/sql";

import StarterKit from "@tiptap/starter-kit"
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

const extension = [
    StarterKit,
    Superscript,
    Subscript,
    TextStyle,
    Color,
    Typography,
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
    }),
    Underline,
]

interface Response {
    data: {
        head: Record<string, string>[],
        content: any[]
    }
}

export default new Elysia()
    .get('/collections/:collection/:article/html', async ({ params, set }) => {
        const data = await uncache<string>(`/collections/${params.collection}/${params.article}/html`, 
            async (cache) => {
                const client = await sql();
        
                try {
                    const response = await client.query<Response>(`
                        SELECT data 
                        FROM articles
                        WHERE collection = $1 AND id = $2`, 
                        [ params.collection, params.article ]);
                    client.release()
                    
                    if(response.rowCount && response.rowCount > 0) {
                        const content = response.rows[0].data.content
                        const html = generateHTML({
                            type: 'doc',
                            content
                        }, extension)
                        await cache(html)
                        return html;
                    } else {
                        return 404
                    }
                } catch (e) {
                    client.release()
                    consola.error(e);
                    return 500;
                }
            }, 10000);

        if(data.type == 'failed') {
            set.status = data.value;
            return null;
        }
        set.status = 200;
        return data.value;
    }, {
        response: {
            200: t.String(),
            404: t.Null(),
            500: t.Null()
        },
        detail: {
            description: 'Get article as html for a specified collection',
            summary: '/collections/:col…/:art…/html'
        }
    })
