import { component$, useStore } from "@builder.io/qwik";
import { DocumentHead, Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft, LuEye, LuEyeOff } from "@qwikest/icons/lucide";

export default component$(() => {
    const nav = useNavigate()
    const loc = useLocation()
    const article = useStore({
        id: "",
        title: "",
        createdat: new Date().toString(),
        updatedat: new Date().toString(),
        draft: true
    });

    return <>
        <header class="flex flex-row gap-2 py-4 justify-start w-full">
            <Link class="m-2 p-2 rounded-full bg-black bg-opacity-0 
                cursor-pointer hover:bg-opacity-15" href={`/dash/collections/${loc.params.collection}/`}>
                <LuArrowLeft/>
            </Link>
            <div>
                <h1 class="font-semibold text-xl">
                    Create an article
                </h1>
                <p class="font-light text-sm">
                    Leave a trace of your thoughts
                </p>
            </div>
        </header>
        <section class="flex flex-col gap-3">
            <h2 class="font-semibold mt-3">
                Meta
                <span class="font-light text-xs">, allows to sort and filter articles.</span>
            </h2>
            <article class="w-full h-full border rounded px-3 py-2">
                <h1 class="text-xl font-semibold outline-none" contentEditable="true"
                    onInput$={(_, t) => article.title = t.innerText}>
                    Title
                </h1>
                <div class="flex flex-row gap-1 items-center text-xs font-thin mb-2">
        
                    {
                        article.draft
                        ? <LuEyeOff class="cursor-pointer" onClick$={() => article.draft = false} />
                        : <LuEye class="cursor-pointer" onClick$={() => article.draft = true} />
                    }
        
                    -
        
                    <p contentEditable="true" class="outline-none"
                        onInput$={(_, t) => article.id = t.innerText}>
                        id
                    </p>
        
                    -
        
                    <p>
                        Last update { new Date(article.updatedat).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                        }) }
                    </p>
                </div>
                <div class="flex flex-row items-center text-xs font-medium gap-1">
                    <Link class="px-2.5 py-1 w-fit select-none
                        bg-blue-100 hover:bg-blue-300 transition-colors cursor-not-allowed">
                        Edit
                    </Link>
                </div>
            </article>

            <h2 class="font-semibold mt-3">
                Confirmation
                <span class="font-light text-xs">, insert the article in the database.</span>
            </h2>
            <div class="flex flex-row items-start gap-3 text-xs font-medium">
                <div class="px-2.5 py-1 w-fit cursor-pointer bg-opacity-15 bg-green-700 hover:bg-opacity-25"
                    onClick$={async () => {
                        const error = document.getElementById('error')!
                        const id = article.id
                            .replaceAll(' ', '-')
                            .replaceAll('_', '-')
                            .toLowerCase();
                        
                        if(id.length < 5 || article.title.length < 5) {
                            error.innerText = "⚠️ the id and title must be at least 5 characters long."
                            return
                        }

                        error.innerText = "";
                        const url = `http://localhost/collections/${loc.params.collection}/${id}`;
                        const response = await fetch(url, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                title: article.title,
                                draft: article.draft,
                                content: `[{"type": "text","text": "Hello, World!"}]`
                            })
                        });

                        if(response.status == 200) {
                            nav(`/dash/collections/${loc.params.collection}/${id}`)
                        }

                        console.log(response)
                        error.innerText = response.status.toString()
                    }}>
                    Create
                </div>
                <Link class="px-2.5 py-1 w-fit cursor-pointer bg-opacity-15 bg-red-700 hover:bg-opacity-25"
                    href={`/dash/collections/${loc.params.collection}/`}>
                    Cancel
                </Link>
                <p id="error" class="text-xs w-64 font-light"></p>
            </div>
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