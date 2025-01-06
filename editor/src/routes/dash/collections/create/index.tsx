import { component$, useStore } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { LuArrowLeft, LuCalendarPlus, LuListOrdered } from "@qwikest/icons/lucide";

export default component$(() => {
    const nav = useNavigate()
    const collection = useStore({
        name: '',
        description: '',
        date: new Date(),
        articles: 0
    })

    return <>
        <header class="flex flex-row gap-2 py-4 justify-start w-full">
            <Link class="m-2 p-2 rounded-full bg-black bg-opacity-0 
                cursor-pointer hover:bg-opacity-15" href="/dash/collections/">
                <LuArrowLeft/>
            </Link>
            <div>
                <h1 class="font-semibold text-xl">
                    Create a collection
                </h1>
                <p class="font-light text-sm">
                    Collections holds multiples articles and media.
                </p>
            </div>
        </header>
        <section class="">
            <Link class="border-2 border-dashed px-4 py-3 rounded block
                bg-black bg-opacity-0 hover:bg-opacity-5 hover:border-solid
                transition-colors duration-500">
                <h1 class="text-xl outline-none" 
                    contentEditable="true"
                    onInput$={(_, t) => collection.name = t.innerText}>
                    Collection name
                </h1>
                <p class="font-light outline-none" 
                    contentEditable="true"
                    onInput$={(_, t) => collection.description = t.innerText}>
                    A brief description
                </p>
                <div class="flex flex-wrap flex-row gap-2 text-xs font-light">
                    <div class="flex flex-row items-center gap-1"
                        title="Creation date">
                        <LuCalendarPlus/>
                        { 
                            collection.date.toLocaleDateString(undefined, {
                                dateStyle: 'short'
                            }) 
                        }
                    </div>
                    <div class="flex flex-row items-center gap-1"
                        title="Number of article">
                        <LuListOrdered/>
                        { 
                            collection.articles
                        }
                    </div>
                </div>
            </Link>
            <div class="flex flex-row gap-3">
                {/* Data */}
                <div class="text-xs p-3">
                    <p class="mb-1 text-black text-opacity-25">data that will be inserted</p>
                    <pre>
                        {
                            JSON.stringify(collection, undefined, 4)
                        }
                    </pre>
                </div>
                {/* Errors & Informations */}
                <div class="text-xs p-3">

                </div>
            </div>
            <div class="flex flex-row items-center gap-3 text-xs font-medium">
                <div class="px-2.5 py-1 w-fit cursor-pointer bg-opacity-15 bg-green-700 hover:bg-opacity-25"
                    onClick$={async () => {
                        const response = await fetch('http://localhost/collections', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                title: collection.name,
                                description: collection.description
                            })
                        })
                        if(response.status == 200) {
                            nav('/dash/collections')
                        } else {
                            console.error(response)
                            console.error(await response.json())
                        }
                    }}>
                    Insert
                </div>
                <Link class="px-2.5 py-1 w-fit cursor-pointer bg-opacity-15 bg-red-700 hover:bg-opacity-25"
                    href="/dash/collections/">
                    Cancel
                </Link>
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