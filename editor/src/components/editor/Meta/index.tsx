import { component$, type QRL, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft, LuEye, LuEyeOff, LuHelpCircle, LuImport } from "@qwikest/icons/lucide";
import type { Article } from "~/lib/types";
type Props = {
    article: Article,
    exit: QRL
}

export default component$(({ article, exit }: Props) => {
    const nav = useNavigate()
    const meta = useStore<string[]>([])
    const replicate = useStore<Article>({...article})

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        // Initialisation
        const id = document.getElementById('meta-id')
        const title = document.getElementById('meta-title')
        const desc = document.getElementById('meta-desc')

        for(const attr of article.data.head) {
            // deserialization of attr
            meta.push(
                Object
                    .entries(attr)
                    .map(([property, value]) => `${property}="${value}"`)
                    .join(' ')
            );
        }
        if(id) id.innerText = replicate.id
        if(title) title.innerText = replicate.title
        if(desc) desc.innerText = replicate.description
    })

    useTask$(({ track }) => {
        track(meta);

        if(meta.reduce((last, tag) => tag.length != 0 && last, true)) {
            meta.push('');
        } else if(meta.filter(t => t.length == 0).length > 1) {
            Object.entries(meta)
                .filter(([i, tag]) => tag.length == 0) // Takes every empty tags
                .slice(0, -1) // Keep every one except the last
                .forEach(([i]) => meta.splice(parseInt(i), 1)) // splice them from the array
        }
    })

    return <div class="h-screen w-full sm:w-4/5 bg-white border-l p-5 md:p-10">
        <p class="text-xs text-black text-opacity-25 mb-4">
            <span>
                /collections/
            </span>
            <span>
                { replicate.collection }/
            </span>
            <span class="text-black text-opacity-100 outline-none" contentEditable="true"
                onInput$={(_, t) => replicate.id = t.innerText} id="meta-id"/>
        </p>
        <h1 class="text-2xl md:text-4xl font-semibold mb-2 outline-none" contentEditable="true"
            onInput$={(_, t) => replicate.title = t.innerText} id="meta-title"/>
        <p class="font-light outline-none mb-4" contentEditable="true"
            onInput$={(_, t) => replicate.description = t.innerText} id="meta-desc" />

        <hr />
        <section class="my-2">
            <h2 class="text-lg md:text-xl font-medium mb-2">
                Head<span class="text-sm font-light">, SEO tags and OpenGraph Protocol <i 
                    title="Note that the description above is already served as a description meta tag.">
                    <LuHelpCircle class="inline"/>
                </i></span>
            </h2>
            <div class="flex flex-col">
                {
                    meta.map((tag, i) => <pre key={i}>
                        <span>
                            {'<meta '}
                        </span>
                        <span contentEditable="true" class="outline-none"
                            onInput$={(_,t) => {
                                meta[i] = t.innerText
                            }} document:onLoad$={(e, t) => t.innerText = tag.length == 0
                                ? 'foo="bar" content="gg"'
                                : tag}>
                        </span>
                        <span>
                            {`/>`}
                        </span>
                    </pre>)
                }
            </div>
        </section>

        <div class="flex flex-row items-center text-xs font-medium gap-2 my-8">
            <div class={["px-2.5 py-1 w-fit select-none flex flex-row items-center gap-1 transition-colors",
                "cursor-pointer", replicate.draft 
                ? 'bg-black text-white bg-opacity-75 hover:bg-opacity-60' 
                : 'bg-black bg-opacity-5 hover:bg-opacity-25 text-black']}
                onClick$={() => replicate.draft = !replicate.draft}>
                {
                    replicate.draft
                    ? <>
                        <LuEyeOff/>
                        Make public
                    </> 
                    : <>
                        <LuEye/>
                        Make private
                    </>
                }
            </div>
            <div class="px-2.5 py-1 w-fit select-none flex flex-row items-center gap-1 transition-colors
                bg-green-300 hover:bg-green-200 cursor-pointer"
                onClick$={async () => {
                    const update: Partial<Article> = {}
                    if(replicate.id.length > 0 && replicate.id != article.id) {
                        update.id = replicate.id
                    }
                    if(replicate.title.length > 0 && replicate.title != article.title) {
                        update.title = replicate.title
                    }
                    if(replicate.description.length > 0 && replicate.description != article.description) {
                        update.description = replicate.description
                    }
                    if(replicate.draft != article.draft) {
                        update.draft = replicate.draft
                    }

                    const metas: Record<string, string>[] = []
                    for(const entry of meta) {
                        // a="a" is the mimimum
                        if(entry.length < 5) continue
                        
                        // entry.split(' ') doesn't work, 
                        // bc there are spaces in entry values
                        // we must check for opening & closing dbl quotes.

                        const brut_attr = [] // contains unprocessed attributes
                        let s = ''
                        for(const c of entry) {
                            if(c != '"') {
                                s += c;
                                continue;
                            }

                            let count = s
                            .split('') // into char[]
                            .filter(char => char == '"').length; // count '"'
                            
                            if(count == 0) s += c; 
                            else {
                                brut_attr.push((s + c).trim())
                                s = '';
                            }
                        }
                        const attrs = brut_attr // string[]
                            .filter(attr => attr.length > 1)
                            .map(attr => attr.split('=')) // [string, string][]
                            .filter(attr => attr.length == 2 && attr[1].length > 2) // \"\" <- 2 char


                        const tag: Record<string, string> = {}
                        for(const [key, value] of attrs) {
                            tag[key] = value.slice(1, value.length - 1)
                        }
                        metas.push(tag);
                    }
                    
                    if(metas.reduce((previous, tag, i) => 
                        previous || (
                            Object.entries(article.data.head[i]).reduce((p, [k, v]) =>
                                p || (!(k in tag) || v != tag[k]), 
                            false)
                        ), false)) {
                        update.data = {
                            content: article.data.content,
                            head: metas
                        }
                    }
                    
                    console.log(update)
                    if(Object.values(update).length == 0) {
                        return
                    }

                    const url = `http://localhost/collections/${article.collection}/${article.id}`
                    const response = await fetch(url, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(update)
                    })
                    if(response.status == 200) {
                        if(update.id) {
                            nav(`/collections/${article.collection}/${update.id}`)
                        }
                        exit()
                        return
                    }
                    console.log(response)
                }}>
                <LuImport/>
                <span>
                    Save
                </span>
            </div>
            <div class="px-2.5 py-1 w-fit select-none flex flex-row items-center gap-1 transition-colors
                bg-blue-100 hover:bg-blue-300 cursor-pointer" onClick$={exit}>
                <LuArrowLeft/>
                <span>
                    Exit
                </span>
            </div>
        </div>
        {/*
        - open-graph
        */}
    </div>
}) 