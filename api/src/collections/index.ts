import Elysia from "elysia";

import get from "./get";
import post from "./post";
import del from "./delete";

import get_article from "./article/get"
import post_article from "./article/post"
import patch_article from "./article/patch"

const app = new Elysia({
    tags: ['Content']
});

app.group('', (app) => app
    .use(get)
    .use(post)
    .use(del)
    .use(get_article)
    .use(post_article)
    .use(patch_article)
)

export default app;