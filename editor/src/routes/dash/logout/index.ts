import { RequestHandler } from "@builder.io/qwik-city"

export const onGet: RequestHandler = async (requestHandler) => {
    requestHandler.cookie.delete('jwt', {
        domain: 'localhost',
        path: '/'
    })
    requestHandler.cookie.delete('refresh', {
        domain: 'localhost',
        path: '/'
    })

    throw requestHandler.redirect(302, '/')
}