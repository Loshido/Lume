import { component$, createContextId, type Signal, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useDocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";

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

import { LuAlignLeft, LuArrowLeft, LuDisc3, LuSquareSlash } from "@qwikest/icons/lucide"
export default component$(() => {
    const loc = useLocation()
    const nav = useNavigate()
    const head = useDocumentHead();
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
    
    if(head.frontmatter.layout == false) {
        return <Slot/>
    }
    if(!collection.value) return <div class="w-screen h-screen flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <section class="w-screen h-screen grid grid-col sm:grid-row sm:grid-rows-1 overflow-hidden">
        <div class="sm:h-full border flex sm:flex-col justify-between overflow-x-scroll sm:overflow-auto">
            <nav class="p-4 flex sm:flex-col gap-1 pr-1 sm:pr-4">
                <Item href={`/dash/collections/${loc.params.collection}/`}>
                    <LuSquareSlash />
                    {
                        collection.value 
                        ? collection.value.id
                        : '?'
                    }
                </Item>
                <Item href={`/dash/collections/${loc.params.collection}/articles/`}>
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