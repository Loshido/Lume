import Elysia from "elysia";
import login from "./login";
import signup from "./signup";
import valide from "./valide";
import refresh from "./refresh";

export default new Elysia({
    detail: {
        tags: ['Authentification']
    }
})
    .use(refresh)
    .use(valide)
    .use(login)
    .use(signup);