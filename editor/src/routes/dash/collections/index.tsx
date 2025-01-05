import { component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { LuFolderPlus, LuRefreshCcw, LuSquareSlash } from "@qwikest/icons/lucide";

const info = {
    id: "someid",
    name: "Somename",
    description: "Some long description",
    date: new Date(),
    articles: 11
}

import Collection from "~/components/collections/card";
export default component$(() => {
    const refreshing = useSignal(false);
    const collections = useStore<{
        id: string,
        name: string,
        description: string | null
    }[]>([])

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        refreshing.value = true
        const response = await fetch('http://localhost/collections');
        if(response.status == 200) {
            const data = await response.json()
            collections.push(...data);
        }
        refreshing.value = false
    })

    return <>
        <header class="flex flex-row py-4 justify-between w-full">
            <div>
                <h1 class="font-semibold text-xl">
                    Collections
                </h1>
                <p class="font-light text-sm">
                    Create, delete, modify collections
                </p>
            </div>

            <div class="flex flex-row items-center gap-2 text-sm">
                <Link class="p-2 bg-black bg-opacity-5 rounded select-none
                    hover:bg-opacity-15 transition-colors cursor-pointer"
                    title="Create a collection" href="/dash/collections/create">
                    <LuFolderPlus/>
                </Link>
                <div class="p-2 bg-black bg-opacity-5 rounded select-none
                    hover:bg-opacity-15 transition-colors cursor-pointer"
                    title="Refresh" onClick$={async () => {
                        if(refreshing.value) return
                        refreshing.value = true
                        const response = await fetch('http://localhost/collections');
                        if(response.status == 200) {
                            const data = await response.json()
                            collections.splice(0, collections.length)
                            collections.push(...data);
                        }
                        refreshing.value = false
                    }}>
                    <LuRefreshCcw class={refreshing.value ? 'animate-spin' : ''} />
                </div>
            </div>
        </header>
        {
            collections.length == 0
            ? <section class="flex w-full h-full items-center justify-center 
                gap-2 text-black text-opacity-25 select-none">
                <LuSquareSlash/> Empty  
            </section>
            : <section class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {
                    collections.map(col => <Collection key={col.id} collection={{
                        id: col.id,
                        name: col.name,
                        description: col.description || '',
                        articles: 0,
                        date: new Date()
                    }} />)
                }
            </section>
        }
    </>
})


export const head: DocumentHead = {
    title: "Lume - Collections",
    meta: [
        {
            name: "description",
            content: "Lume's editor",
        },
    ],
    frontmatter: {
        dash: true
    }
};
