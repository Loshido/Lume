import { component$, noSerialize, NoSerialize, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft, LuDisc3, LuImport } from "@qwikest/icons/lucide";
import type { Editor } from "@tiptap/core";
import Bubble from "~/components/editor/Bubble";

interface Article {
    collection: string,
    id: string,
    title: string,
    content: string,
    createdat: string,
    updatedat: string,
    draft: boolean
}

import doc from "~/components/editor/doc.css?inline"
import buildEditor from "~/components/editor/editor";
import Slash from "~/components/editor/Slash";
export default component$(() => {
    const loc = useLocation()
    const nav = useNavigate()
    const article = useSignal<Article | null>(null);
    const editor = useSignal<NoSerialize<Editor>>()
    const saved = useSignal(true)
    useStyles$(doc)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        const url = `http://localhost/collections/${loc.params.collection}/${loc.params.article}`;
        const response = await fetch(url);
        if(response.status != 200) {
            nav(`/dash/collections/${loc.params.collection}/`);
        }
        
        const data = await response.json();
        article.value = data;

        editor.value = noSerialize(await buildEditor(article.value!.content));
        editor.value?.on('update', () => {
            saved.value = false;
        })
    })

    if(!article.value)  return <div class="w-screen h-screen flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <section class="w-screen flex flex-col">
        <header class="flex flex-row justify-between p-2">
            <div class="flex flex-row items-center text-xs font-medium gap-2">
                <Link class="px-2.5 py-1 w-fit select-none flex flex-row items-center gap-1
                    bg-blue-100 hover:bg-blue-300 transition-colors cursor-pointer"
                    href={`/dash/collections/${loc.params.collection}/`}>
                    <LuArrowLeft/>
                    Collection
                </Link>
                <div class={["px-2.5 py-1 w-fit select-none flex flex-row items-center gap-1",
                    "bg-green-100 hover:bg-green-300 transition-colors cursor-pointer",
                    saved.value ? 'bg-green-100' : 'bg-green-400']}
                    onClick$={async () => {
                        const data = editor.value?.getJSON().content;
                        const url = `http://localhost/collections/${loc.params.collection}/${loc.params.article}`
                        if(!data) return

                        const response = await fetch(url, {
                            method: 'PATCH',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                content: JSON.stringify(data)
                            })
                        })

                        if(response.status === 200) {
                            saved.value = true
                        } else {
                            console.log(response)
                            try {
                                console.log(await response.json())
                            } catch(e) {
                                console.error(e)
                            }
                            saved.value = false
                        }

                    }}>
                    <LuImport/>
                    <span>
                        {
                            saved.value ? 'Saved' : 'Save'
                        }
                    </span>
                </div>
            </div>
        </header>
        <main class="px-5 py-3 sm:px-16 md:px-32 md:py-4 lg:px-64 xl:px-96">
            <div id="editor" class="doc w-full h-full p-5 border rounded *:outline-none">
                <Bubble editor={editor.value}/>
                <Slash editor={editor.value} />
            </div>
        </main>
    </section>
})

export const head: DocumentHead = (head) => ({
    title: `Lume - ${head.params.article}`,
    meta: [
        {
            name: "description",
            content: "Lume's editor",
        },
    ],
    links: [
        {
            rel: "stylesheet",
            href: 'http://localhost/css'
        }
    ],
    frontmatter: {
        layout: false
    }
});
