import Elysia from "elysia";

import list from "./list";
import insert from "./insert";

const app = new Elysia();

app.group('/collections', (app) => app
    .use(list)
    .use(insert)
)

export default app;