import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuFolderPlus, LuRefreshCcw } from "@qwikest/icons/lucide";

const info = {
    id: "someid",
    name: "Somename",
    description: "Some long description",
    date: new Date(),
    articles: 11
}

import Collection from "~/components/collections/card";
export default component$(() => {
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
                <div class="p-2 bg-black bg-opacity-5 rounded select-none
                    hover:bg-opacity-15 transition-colors cursor-pointer"
                    title="Create a collection">
                    <LuFolderPlus/>
                </div>
                <div class="p-2 bg-black bg-opacity-5 rounded select-none
                    hover:bg-opacity-15 transition-colors cursor-pointer"
                    title="Refresh">
                    <LuRefreshCcw/>
                </div>
            </div>
        </header>
        <section class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {
                a.map(_ => <Collection collection={{
                    ...info,
                    articles: Math.floor(Math.random() * 100),
                    id: Math.floor(Math.random() * 99999999).toString(36),
                    name: Math.floor(Math.random() * 99999999).toString(36)
                }}/>)
            }
        </section>
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
