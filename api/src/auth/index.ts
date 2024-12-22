import Elysia from "elysia";
import login from "./login";
import signup from "./signup";

export default new Elysia({
    detail: {
        tags: ['Authentification']
    }
})
    .use(login)
    .use(signup);