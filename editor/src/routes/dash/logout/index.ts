import { RequestHandler } from "@builder.io/qwik-city"

export const onGet: RequestHandler = async (requestHandler) => {
    requestHandler.cookie.delete('jwt')
    requestHandler.cookie.delete('refresh')

    throw requestHandler.redirect(302, '/')
}