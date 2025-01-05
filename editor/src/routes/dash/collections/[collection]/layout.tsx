import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

export const Item = component$((props: { href: string }) => {
    const loc = useLocation()
    return <Link class={["flex gap-2 items-center p-2 transition-colors",
        "hover:bg-opacity-10 rounded cursor-pointer bg-black text-xs",
        loc.url.pathname == props.href ? 'bg-opacity-15' : 'bg-opacity-0']}
        href={props.href}>
        <Slot/>
    </Link>
})

import { LuAlignLeft, LuArrowLeft, LuSquareSlash } from "@qwikest/icons/lucide"
export default component$(() => {
    const loc = useLocation()

    return <section class="w-screen h-screen grid grid-col sm:grid-row sm:grid-rows-1 overflow-hidden">
        <div class="sm:h-full border flex sm:flex-col justify-between overflow-x-scroll sm:overflow-auto">
            <nav class="p-4 flex sm:flex-col gap-1 pr-1 sm:pr-4">
                <Item href={`/dash/collections/${loc.params.collection}`}>
                    <LuSquareSlash />
                    {loc.params.collection}
                </Item>
                <Item href={`/dash/collections/${loc.params.collection}/articles`}>
                    <LuAlignLeft/>
                    Articles
                </Item>
            </nav>
            <div class="p-4 flex sm:flex-col gap-1 pl-0 sm:pl-4">
                <Item href="/dash/collections/">
                    <LuArrowLeft/>
                    Collections
                </Item>
            </div>
        </div>
        <div class="h-full w-full p-5 overflow-y-scroll">
            <Slot/>
        </div>
    </section>
})