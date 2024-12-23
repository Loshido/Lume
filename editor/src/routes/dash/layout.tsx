import { component$, Slot } from "@builder.io/qwik";
import { Link, useDocumentHead, useLocation } from "@builder.io/qwik-city";

export const Item = component$((props: { href: string }) => {
    const loc = useLocation()
    return <Link class={["flex gap-2 items-center p-2 px-4 transition-colors",
        "hover:bg-opacity-10 rounded cursor-pointer bg-black",
        loc.url.pathname == props.href ? 'bg-opacity-15' : 'bg-opacity-0']}
        href={props.href}>
        <Slot/>
    </Link>
})

import { LuAlignLeft, LuImage, LuLogOut, LuSettings, LuUsers } from "@qwikest/icons/lucide"
export default component$(() => {
    const head = useDocumentHead()
    const loc = useLocation()

    if(!head.frontmatter.dash) {
        return <Slot/>
    }

    return <section class="w-screen h-screen flex flex-col sm:flex-row overflow-hidden">
        <div class="sm:h-full border flex sm:flex-col justify-between overflow-x-scroll sm:overflow-auto">
            <nav class="p-3 sm:p-5 pr-0 sm:pr-5 flex sm:flex-col gap-2">
                <Item href="/dash/collections/">
                    <LuAlignLeft/>
                    Collections
                </Item>
                <Item href="/dash/media/">
                    <LuImage/>
                    Media
                </Item>
                <Item href="/dash/users/">
                    <LuUsers class="w-4"/>
                    Users
                </Item>
            </nav>
            <div class="p-3 sm:p-5 flex sm:flex-col gap-2 w-fit items-center">
                <Link href="/dash/settings"
                    class={["p-2 sm:p-4 rounded transition-colors",
                    "bg-black hover:bg-opacity-10 cursor-pointer",
                    loc.url.pathname == '/dash/settings/' ? 'bg-opacity-15' : 'bg-opacity-0']}>
                    <LuSettings/>
                </Link>
                <Link href="/dash/logout" 
                    class="p-2 sm:p-4 rounded transition-colors
                    hover:bg-black hover:bg-opacity-10 cursor-pointer">
                    <LuLogOut/>
                </Link>
            </div>
        </div>
        <div class="h-full p-5">
            <Slot/>
        </div>
    </section>
})