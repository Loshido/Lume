import { component$, createContextId, type Signal, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";

export const Item = component$((props: { href: string }) => {
    const loc = useLocation()
    return <Link class={["flex gap-2 items-center p-2 transition-colors",
        "hover:bg-opacity-10 rounded cursor-pointer bg-black text-xs",
        loc.url.pathname == props.href ? 'bg-opacity-10' : 'bg-opacity-0']}
        href={props.href}>
        <Slot/>
    </Link>
})

export interface Collection {
    id: string,
    name: string,
    description: string
}
export const collectionCtx = createContextId<Signal<Collection | null>>('collection');

import { LuDisc3 } from "@qwikest/icons/lucide"
export default component$(() => {
    const loc = useLocation()
    const nav = useNavigate()
    const collection = useSignal<Collection | null>(null)
    useContextProvider(collectionCtx, collection);

    
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        const response = await fetch(`http://localhost/collections?id=${loc.params.collection}`);
        if(response.status != 200) {
            nav('/dash/collections/')
        }
        
        const data = await response.json();
        collection.value = data[0];
    })
    
    if(!collection.value) return <div class="w-screen h-screen flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <Slot/>
})