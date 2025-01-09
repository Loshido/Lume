import { $, component$, useContext, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { collectionCtx } from "./layout";
import { LuDisc3, LuPenLine, LuRefreshCcw, LuSquareSlash, LuX } from "@qwikest/icons/lucide";
import { DocumentHead, Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import Article_card from "~/components/collections/article_card";
import Confirmation from "~/components/dialog/confirmation";
import { isBrowser } from "@builder.io/qwik/build";

interface Article {
    id: string,
    title: string,
    createdat: string,
    updatedat: string,
    draft: boolean
}

export default component$(() => {
    const loc = useLocation();
    const nav = useNavigate();

    const option = useStore({
        search: '', // search filter for articles
        refreshing: false, // true while fetching
        deletePending: '', // takes the id of the article being deleted
        collection: {
            edition: false, // edition mode of the collection headers
            id: '',
            name: '',
            description: '',
            remove_confirmation: false // if a confirmation of delete is requested 
        }
    })
    const articles = useStore<Article[]>([]);
    const collection = useContext(collectionCtx);

    const getArticles = $(async (store: Article[]) => {
        store.splice(0, store.length);
        option.refreshing = true;
        const response = await fetch(`http://localhost/collections/${loc.params.collection}`);
        if(response.status == 404) {
            option.refreshing = false;
            return
        }
        if(response.status != 200) {
            nav('/dash/collections/')
        }
        
        const data = await response.json();
        store.push(...data);
        option.refreshing = false;
    })
    
    if(!collection.value || option.refreshing) return <div class="w-full h-full flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        getArticles(articles);
    })

    return <>
        <section class="flex flex-col gap-2 h-fit">
            <div>
                <h1 class="font-semibold text-3xl">
                    <span id="name"  class="outline-none"
                        contentEditable={option.collection.edition ? 'true' : 'false'}>
                        {
                            collection.value.name
                        }
                    </span> <span class="text-sm text-black text-opacity-25">
                        (<span id="id" class="outline-none"
                            contentEditable={option.collection.edition ? 'true' : 'false'}>
                            {
                                collection.value.id
                            }
                        </span>)
                    </span>
                </h1>
                <p class="font-light text-black text-opacity-50 outline-none" id="description" 
                    contentEditable={option.collection.edition ? 'true' : 'false'}>
                    {
                        collection.value.description
                    }
                </p>
            </div>
            <div class="flex flex-row items-start gap-2 text-xs font-medium">
                {
                    option.collection.edition
                    ? <>
                        <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                            bg-green-100 hover:bg-green-300 transition-colors"
                            onClick$={async () => {
                                const id = document.getElementById('id')!;
                                const desc = document.getElementById('description')!;
                                const name = document.getElementById('name')!;

                                const data: {
                                    [key in 'id' | 'description' | 'name']?: string
                                } = {}
                                if(id.innerText.length > 0) 
                                    data.id = id.innerText;
                                if(desc.innerText.length > 0) 
                                    data.description = desc.innerText;
                                if(name.innerText.length > 0) 
                                    data.name = name.innerText;
                                
                                const url = `http://localhost/collections/${collection.value!.id}`;
                                const response = await fetch(url, {
                                    method: 'PATCH',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                });
                                
                                if(response.status == 200) {
                                    if(desc.innerText.length > 0) 
                                        collection.value!.description = desc.innerText;
                                    if(name.innerText.length > 0) 
                                        collection.value!.name = name.innerText;
                                    if(id.innerText.length > 0) {
                                        collection.value!.id = id.innerText
                                        nav(`/dash/collections/${collection.value!.id}/`)
                                    };
                                }

                                console.trace(await response.json())
                            }}>
                            Save
                        </div>
                        <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                            bg-red-100 hover:bg-red-300 transition-colors"
                            onClick$={() => {
                                const id = document.getElementById('id')!;
                                const desc = document.getElementById('description')!;
                                const name = document.getElementById('name')!;

                                id.innerText = collection.value!.id;
                                desc.innerText = collection.value!.description;
                                name.innerText = collection.value!.name;
                                option.collection.edition = false
                            }}>
                            Cancel
                        </div>
                    </>
                    : <>
                        <div class="p-2 w-fit cursor-pointer select-none
                            bg-blue-100 hover:bg-blue-300 transition-colors"
                            onClick$={() => option.collection.edition = true}>
                            <LuPenLine/>
                        </div>
                        <div class="p-2 w-fit cursor-pointer select-none
                            bg-red-100 hover:bg-red-300 transition-colors"
                            onClick$={() => option.collection.remove_confirmation = true}>
                            <LuX/>
                        </div>
                    </>
                }
                <Confirmation
                    text="Are you sure you want to permanently remove this collection ?"
                    active={option.collection.remove_confirmation}
                    yes={{
                        fn: $(async () => {
                            const url = `http://localhost/collections/${collection.value!.id}`
                            const response = await fetch(url, {
                                method: 'DELETE',
                                credentials: 'include'
                            })
                            if(response.status == 200) {
                                nav('/dash/collections');
                            } else {
                                console.error(response)
                            }
                        })
                    }}
                    no={{
                        fn: $(() => {
                            option.collection.remove_confirmation = false
                        })
                    }}
                    cancel={$(() => {
                        option.collection.remove_confirmation = false
                    })}/>
            </div>
        </section>
        <hr class="my-4" />
        <div class="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-3">
            <div class="sm:col-span-2 lg:col-span-3 flex flex-row gap-2 items-center text-xs font-medium">
                <Link class="px-2.5 py-1 w-fit cursor-pointer select-none
                    bg-blue-100 hover:bg-blue-300 transition-colors
                    flex flex-row gap-1 items-center" href={`/dash/collections/${loc.params.collection}/create/`}>
                    Create
                </Link>
                <div class="p-1.5 w-fit cursor-pointer select-none
                    bg-black bg-opacity-5 hover:bg-opacity-15 transition-colors
                    flex flex-row gap-1 items-center" onClick$={async () => {
                        getArticles(articles)
                    }}>
                    <LuRefreshCcw/>
                </div>
                <input type="text" placeholder="Search..." onInput$={(_, t) => option.search = t.value}
                    class="px-2 py-1 w-fit outline-none bg-black bg-opacity-5 focus:bg-opacity-15 hover:bg-opacity-15" />
            </div>
            {
                articles.length > 0 
                ? articles.filter(article => article.title.includes(option.search)).map(article => 
                    <Article_card article={article} key={article.id} 
                        href={`/dash/collections/${loc.params.collection}/${article.id}/`}
                        ask_delete={$((id) => {option.deletePending = id})}/>)
                : <section class="flex w-full h-full items-center justify-center 
                    gap-2 text-black text-opacity-25 select-none
                    xl:col-span-3 md:col-span-2">
                    <LuSquareSlash/> Empty  
                </section>
            }
            <Confirmation
                text={`Are you sure you want to permanently remove '${option.deletePending}' ?`}
                active={option.deletePending != ''}
                cancel={$(() => {
                    option.deletePending = ''
                })}
                yes={{
                    fn: $(async () => {
                        const url = `http://localhost/collections/${loc.params.collection}/${option.deletePending}`
                        const response = await fetch(url, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                        if(response.status == 200) {
                            const i = articles.findIndex(article => article.id == option.deletePending)
                            articles.splice(i, 1);
                            option.deletePending = '';
                        } else {
                            console.error(response)
                        }
                    })
                }}
                no={{
                    fn: $(() => {
                        option.deletePending = ''
                    })
                }}/>
        </div>
    </>
})

export const head: DocumentHead = (head) => ({
    title: `Lume - ${head.params.collection}`,
    meta: [
        {
            name: "description",
            content: "Lume's editor",
        },
    ],
    frontmatter: {
        dash: true
    }
});
