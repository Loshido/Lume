import { component$, Slot } from "@builder.io/qwik";
import { Link, RequestHandler, useDocumentHead, useLocation } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async (req) => {
    if(!req.cookie.get('jwt')) {
        // We can't afford to check if the jwt is valid on each request.
        // but if it does not exist we kick the user.
        throw req.redirect(302, '/')
    }
}

export const Item = component$((props: { href: string }) => {
    const loc = useLocation()
    return <Link class={["flex gap-2 items-center p-2 transition-colors",
        "hover:bg-opacity-10 rounded cursor-pointer bg-black text-xs",
        loc.url.pathname == props.href ? 'bg-opacity-15' : 'bg-opacity-0']}
        href={props.href}>
        <Slot/>
    </Link>
})

import { LuAlignLeft, LuImage, LuLogOut, LuSettings, LuSquareSlash, LuUsers } from "@qwikest/icons/lucide"
export default component$(() => {
    const head = useDocumentHead()

    if(!head.frontmatter.dash) {
        return <Slot/>
    }

    return <section class="w-screen h-screen grid grid-col sm:grid-row sm:grid-rows-1 overflow-hidden">
        <div class="sm:h-full border flex sm:flex-col justify-between overflow-x-scroll sm:overflow-auto">
            <nav class="p-4 flex sm:flex-col gap-1 pr-1 sm:pr-4">
                <Item href="/dash/">
                    <LuSquareSlash />
                    Home
                </Item>
                <Item href="/dash/collections/">
                    <LuAlignLeft/>
                    Collections
                </Item>
                <Item href="/dash/media/">
                    <LuImage/>
                    Media
                </Item>
                <Item href="/dash/users/">
                    <LuUsers/>
                    Users
                </Item>
            </nav>
            <div class="p-4 flex sm:flex-col gap-1 pl-0 sm:pl-4">
                <Item href="/dash/settings/">
                    <LuSettings/>
                    Settings
                </Item>
                <Item href="/dash/logout/">
                    <LuLogOut/>
                    Logout
                </Item>
            </div>
        </div>
        <div class="h-full w-full p-5 overflow-y-scroll">
            <Slot/>
        </div>
    </section>
})