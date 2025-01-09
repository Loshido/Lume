import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { LuDisc3, LuRefreshCcw } from "@qwikest/icons/lucide";

import ArticleCard from "~/components/collections/article_card";
import Dialog from "~/components/dialog";

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
        search: '',
        refreshing: false
    })
    const deleteArticle = useSignal('');
    const articles = useStore<Article[]>([])

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        option.refreshing = true;
        const response = await fetch(`http://localhost/collections/${loc.params.collection}`);
        if(response.status != 200) {
            nav('/dash/collections/')
        }
        
        const data = await response.json();
        articles.push(...data);
        option.refreshing = false;
    })

    if(option.refreshing) return <div class="w-full h-full flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <div class="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-3">
        <div class="sm:col-span-2 lg:col-span-3 flex flex-row gap-2 items-center text-xs font-medium">
            <Link class="px-2.5 py-1 w-fit cursor-pointer select-none
                bg-blue-100 hover:bg-blue-300 transition-colors
                flex flex-row gap-1 items-center" href={`/dash/collections/${loc.params.collection}/create/`}>
                Create
            </Link>
            <div class="p-1.5 w-fit cursor-pointer select-none
                bg-black bg-opacity-5 hover:bg-opacity-15 transition-colors
                flex flex-row gap-1 items-center" onClick$={async () => {
                    option.refreshing = true;
                    const response = await fetch(`http://localhost/collections/${loc.params.collection}`);
                    if(response.status != 200) {
                        nav('/dash/collections/');
                        return
                    }
            
                    const data = await response.json();
                    articles.splice(0, articles.length);
                    articles.push(...data);
                    option.refreshing = false;
                }}>
                <LuRefreshCcw/>
            </div>
            <input type="text" placeholder="Search..." onInput$={(_, t) => option.search = t.value}
                class="px-2 py-1 w-fit outline-none bg-black bg-opacity-5 focus:bg-opacity-15 hover:bg-opacity-15" />
        </div>

        {
            articles.filter(article => article.title.includes(option.search)).map(article => 
                <ArticleCard article={article} key={article.id} 
                    href={`/dash/collections/${loc.params.collection}/${article.id}/`}
                    ask_delete={$((id) => {deleteArticle.value = id})}/>)
        }
        <Dialog active={deleteArticle.value != ''} exit={$(() => deleteArticle.value = '')}>
            <p class="w-2/3 text-center">
                Are you sure you want to permanently remove '{deleteArticle.value}' ?
            </p>
            <div class="flex flex-row items-center gap-3 text-xs font-medium">
                <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                    bg-red-100 hover:bg-red-300 transition-colors"
                    onClick$={async () => {
                        const url = `http://localhost/collections/${loc.params.collection}/${deleteArticle.value}`
                        const response = await fetch(url, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                        if(response.status == 200) {
                            const i = articles.findIndex(article => article.id == deleteArticle.value)
                            articles.splice(i, 1);
                            deleteArticle.value = '';
                        } else {
                            console.error(response)
                        }
                    }}>
                    Yes
                </div>
                <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                    bg-blue-100 hover:bg-blue-300 transition-colors"
                    onClick$={() => deleteArticle.value = ''}>
                    No, Cancel
                </div>
            </div>
        </Dialog>
    </div>
})