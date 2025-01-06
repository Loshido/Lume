import { component$, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import { LuArrowDownNarrowWide, LuPlus, LuRefreshCcw } from "@qwikest/icons/lucide";

import MediaCard from "~/components/media/card";

export default component$(() => {
    const refreshing = useSignal(false)
    const media = useStore<{
        id: string,
        description: string,
        origin: string,
        createdat: Date
    }[]>([]);
    const copy = useStore<{
        id: string,
        description: string,
        origin: string,
        createdat: Date
    }[]>([])

    useVisibleTask$(async () => {
        refreshing.value = true
        const response = await fetch('http://localhost/media');
        if(response.status == 200) {
            const data = await response.json() as {
                id: string,
                description: string,
                origin: string,
                createdat: string
            }[]
            media.push(...data.map(d => ({
                ...d,
                createdat: new Date(d.createdat)
            })));
            console.log(media)
            copy.push(...media)
        } else {
            console.error(response)
        };
        refreshing.value = false
    })

    return <div class="h-full w-[calc(100% + 40px)] -m-5">
        <header class="flex flex-row pt-9 px-5 justify-between w-full">
            <div>
                <h1 class="font-semibold text-xl">
                    Media storage
                </h1>
                <p class="font-light text-sm">
                    Insert, remove, modify media
                </p>
            </div>

            <div class="flex flex-row items-center gap-2 text-sm">
                <Link class="p-2 bg-black bg-opacity-5 rounded select-none
                    hover:bg-opacity-15 transition-colors cursor-pointer"
                    title="Insert" href="/dash/media/create">
                    <LuPlus/>
                </Link>
                <div class="p-2 bg-black bg-opacity-5 rounded select-none
                    hover:bg-opacity-15 transition-colors cursor-pointer"
                    title="Refresh" onClick$={async () => {
                        if(refreshing.value) return
                        refreshing.value = true
                        const response = await fetch('http://localhost/media');
                        if(response.status == 200) {
                            const data = await response.json() as {
                                id: string,
                                description: string,
                                origin: string,
                                createdat: string
                            }[]
                            media.splice(0, media.length)
                            media.push(...data.map(d => ({
                                ...d,
                                createdat: new Date(d.createdat)
                            })));
                            copy.splice(0, copy.length);
                            copy.push(...media);
                        }
                        refreshing.value = false
                    }}>
                    <LuRefreshCcw class={refreshing.value ? 'animate-spin' : ''} />
                </div>
            </div>
        </header>
        <section class="px-5 py-3 flex flex-row flex-wrap items-center gap-3">
            <input type="text" placeholder="Research..."
                class="rounded px-2 py-1.5 outline-none border" onInput$={(e, t) => {
                    copy.splice(0, copy.length)
                    if(t.value.length == 0) {
                        copy.push(...media);
                    } else {
                        copy.push(...media.filter(m => m.id.includes(t.value)))
                    }
                }} />
            <div class="flex flew-row items-center gap-1 text-sm 
                bg-black bg-opacity-5 p-2 rounded
                hover:bg-opacity-15 transition-colors cursor-pointer select-none">
                <LuArrowDownNarrowWide/>
            </div>
        </section>
        <section class="flex flex-col">
            {
                copy.map((m, i) => <MediaCard key={i} media={m}/>)
            }
        </section>
    </div>
})


export const head: DocumentHead = {
    title: "Lume - Media",
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